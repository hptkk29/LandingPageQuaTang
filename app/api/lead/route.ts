import { NextRequest, NextResponse } from "next/server";
import { ipAddress, waitUntil } from "@vercel/functions";
import { leadSchema } from "@/lib/schemas/lead";
import { branchLabel, provinceName } from "@/lib/constants/misa";
import { submitToMisaServer } from "@/lib/server/misa";
import {
  AFF_COOKIE_FIRST,
  AFF_COOKIE_LAST,
  AFF_COOKIE_UTM,
  parseTouch,
  parseUtmCookie,
  type AffTouch,
  type AffUtm,
} from "@/lib/server/attribution";
import { resolveAffCode } from "@/lib/server/aff-store";
import type { LeadApiResponse } from "@/lib/types/api";

// /api/lead giờ là đường DUY NHẤT vào cả MISA lẫn Sheet nên rate-limit phải:
// (1) key theo SĐT chứ không theo IP — nhà mạng VN dùng CGNAT nặng, hai phụ
//     huynh sau cùng một IP công cộng không được chặn nhau;
// (2) chỉ "đóng dấu" SAU khi lead đã vào được ít nhất một kênh — submit thất
//     bại thì lần thử lại ngay không bị 429 (thử lại là cứu lead, không phải spam).
const RATE_LIMIT_WINDOW_MS = 30 * 1000;
const rateLimitMap = new Map<string, number>();

function isRateLimited(key: string): boolean {
  const lastOk = rateLimitMap.get(key);
  return !!lastOk && Date.now() - lastOk < RATE_LIMIT_WINDOW_MS;
}

function markSubmitted(key: string): void {
  const now = Date.now();
  rateLimitMap.set(key, now);
  if (rateLimitMap.size > 1000) {
    for (const [k, ts] of rateLimitMap.entries()) {
      if (now - ts > 3600 * 1000) rateLimitMap.delete(k);
    }
  }
}

// Vercel: cho phép chờ hết đường lui (MISA 6s + Sheet 15s) + Sheet chạy nền
export const maxDuration = 60;

// App Router KHÔNG có bodyParser.sizeLimit (đó là khái niệm Pages Router) nên
// phải tự chặn body quá khổ. Form này tổng các field có giới hạn chưa tới 1KB —
// 16KB là rộng rãi, chỉ để cắt trường hợp cố tình nhồi byte.
const MAX_BODY_BYTES = 16 * 1024;

type ReadBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "TOO_LARGE" | "INVALID" };

/**
 * Đọc body và ĐẾM BYTE THẬT thay vì tin `content-length`.
 *
 * `content-length` cũng là header do client đặt: khai man số nhỏ, hoặc gửi
 * `Transfer-Encoding: chunked` (không có header này) là đi vòng qua được.
 * Đọc theo stream và huỷ ngay khi vượt ngưỡng mới là chặn thật — quan trọng là
 * huỷ TRƯỚC khi phần còn lại của body kịp vào bộ nhớ.
 *
 * Không bao giờ throw: mọi lỗi đọc/parse đều quy về "INVALID" để caller trả 400,
 * đúng tinh thần fail-safe của route này.
 */
async function readJsonWithLimit(
  req: NextRequest,
  maxBytes: number
): Promise<ReadBodyResult> {
  if (!req.body) return { ok: false, reason: "INVALID" };

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        return { ok: false, reason: "TOO_LARGE" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "INVALID" };
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(merged)) };
  } catch {
    return { ok: false, reason: "INVALID" };
  }
}

// Header user-agent do client đặt nên không tin được và có thể dài tuỳ ý;
// 300 ký tự thừa sức nhận diện trình duyệt mà không nhồi byte rác vào Sheet.
const MAX_USER_AGENT_CHARS = 300;

// IP chỉ dùng để ghi log/Sheet, nhưng vẫn nên lấy nguồn đáng tin: ipAddress()
// của Vercel là giá trị hạ tầng xác định, còn x-forwarded-for phần tử đầu là
// do client gửi lên (giả mạo được) — chỉ giữ làm fallback cho local/dev nơi
// không có header của Vercel.
function getClientIp(req: NextRequest): string {
  try {
    const trusted = ipAddress(req);
    if (trusted) return trusted;
  } catch {
    // Ghi nhận IP không bao giờ được phép chặn lead: lỗi ở đây thì rơi xuống
    // fallback header, không để vỡ ra catch 500 chung của handler.
  }
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

type SheetResult = { ok: boolean; detail?: string };

// Kênh backup: Google Sheet qua Apps Script Web App. URL là server-only —
// fallback NEXT_PUBLIC_GOOGLE_SCRIPT_URL đã bỏ (env đó cũng đã xoá khỏi Vercel):
// đặt tên NEXT_PUBLIC_ cho URL server-only là quả mìn, chỉ cần một client
// component lỡ tham chiếu là Next inline thẳng vào bundle trình duyệt.
async function submitToSheet(
  payload: Record<string, string>
): Promise<SheetResult> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.GOOGLE_SCRIPT_SECRET;

  if (!scriptUrl || !secret) {
    console.error("[/api/lead] Sheet SKIPPED_CONFIG — thiếu env Apps Script");
    return { ok: false, detail: "SKIPPED_CONFIG" };
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, ...payload }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error("[/api/lead] Apps Script HTTP error:", res.status);
      return { ok: false, detail: `HTTP_${res.status}` };
    }

    const json = await res.json().catch(() => null);
    if (!json || json.ok !== true) {
      console.error("[/api/lead] Apps Script error response:", json);
      return { ok: false, detail: "UPSTREAM_ERROR" };
    }

    return { ok: true };
  } catch (err) {
    console.error("[/api/lead] Apps Script network/timeout:", err);
    return { ok: false, detail: "NETWORK" };
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<LeadApiResponse>> {
  try {
    // Cửa 1 (rẻ): client trung thực khai body quá lớn thì chặn ngay, khỏi mở
    // stream. Header vắng mặt hoặc rác thì cho đi tiếp — cửa 2 mới là cửa thật.
    const contentLength = Number(req.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYLOAD_TOO_LARGE",
          message: "Dữ liệu gửi lên quá lớn, vui lòng kiểm tra lại thông tin",
        },
        { status: 413 }
      );
    }

    // Cửa 2 (thật): đếm byte theo stream, không tin header nào cả.
    const read = await readJsonWithLimit(req, MAX_BODY_BYTES);
    if (!read.ok) {
      if (read.reason === "TOO_LARGE") {
        return NextResponse.json(
          {
            ok: false,
            error: "PAYLOAD_TOO_LARGE",
            message: "Dữ liệu gửi lên quá lớn, vui lòng kiểm tra lại thông tin",
          },
          { status: 413 }
        );
      }
      return NextResponse.json(
        { ok: false, error: "INVALID_JSON" },
        { status: 400 }
      );
    }
    const body = read.value;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      const fields = issues.map((e) => e.path.join("."));
      const firstError = issues[0]?.message ?? "Validation failed";
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_FAILED",
          message: firstError,
          fields,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot — trả OK giả để bot không biết bị detect
    if (data.website && data.website.length > 0) {
      return NextResponse.json(
        { ok: true, message: "Đăng ký thành công" },
        { status: 200 }
      );
    }

    // Rate-limit theo SĐT đã chuẩn hoá bởi schema (không theo IP — CGNAT);
    // chỉ chặn khi lần gửi TRƯỚC ĐÓ đã THÀNH CÔNG trong 30s (chống double-click)
    const ip = getClientIp(req);
    if (isRateLimited(data.sdt)) {
      return NextResponse.json(
        {
          ok: false,
          error: "RATE_LIMITED",
          message: "Bạn vừa đăng ký thành công, vui lòng đợi 30 giây",
        },
        { status: 429 }
      );
    }

    const userAgent = (req.headers.get("user-agent") ?? "unknown").slice(
      0,
      MAX_USER_AGENT_CHARS
    );

    // ── Attribution affiliate: đọc cookie server-side (UI không đổi — AC-10).
    // Resolve mã link → mã NV TẠI THỜI ĐIỂM SUBMIT (link đã thu hồi → không
    // gán, AC-08). Mọi lỗi khối này đều nuốt — không bao giờ chặn đăng ký
    // (FR-B05); cookie là input KHÔNG TIN ĐƯỢC nên cả phần dựng giá trị cho
    // Sheet cũng nằm trong try/catch. Sheet lưu mã link THÔ nên resolve fail
    // vẫn truy ngược được người giới thiệu.
    let affEmployeeCode = "";
    let affSheetFields = {
      aff_ma_link_cuoi: "",
      aff_ma_link_dau: "",
      aff_click_id: "",
      aff_thoi_diem_click: "",
      aff_utm: "",
    };
    try {
      const affLast: AffTouch | null = parseTouch(
        req.cookies.get(AFF_COOKIE_LAST)?.value
      );
      const affFirst: AffTouch | null = parseTouch(
        req.cookies.get(AFF_COOKIE_FIRST)?.value
      );
      const affUtm: AffUtm = parseUtmCookie(req.cookies.get(AFF_COOKIE_UTM)?.value);
      if (affLast) {
        const info = await resolveAffCode(affLast.code);
        if (info?.employeeCode) affEmployeeCode = info.employeeCode;
      }
      affSheetFields = {
        aff_ma_link_cuoi: affLast?.code ?? "",
        aff_ma_link_dau: affFirst?.code ?? "",
        aff_click_id: affLast?.clickId ?? "",
        aff_thoi_diem_click: affLast
          ? new Date(affLast.clickedAt).toISOString()
          : "",
        aff_utm: [affUtm.source, affUtm.medium, affUtm.campaign]
          .filter(Boolean)
          .join(" / "),
      };
    } catch (err) {
      console.error("[/api/lead] aff attribution error (bỏ qua):", err);
    }

    // Kênh chính: MISA CRM — gửi từ server, đọc response thật (P0-03).
    // Chạy trước để row Sheet ghi được misa_status (soi thất bại, không im lặng).
    // FR-B08: không có mã giới thiệu → không truyền aff → field bị omit hoàn toàn.
    const misaResult = await submitToMisaServer(
      data,
      affEmployeeCode ? { employeeCode: affEmployeeCode } : undefined
    );

    // Giữ nguyên các key cũ của Google Sheet để không lệch cột; key mới
    // (misa_status...) Apps Script bỏ qua nếu chưa có cột tương ứng.
    const sheetPayload: Record<string, string> = {
      ho_ten: data.ho_ten_ph ?? "", // họ tên phụ huynh
      ho_ten_con: data.ho_ten_con, // họ tên con
      sdt: data.sdt,
      email: data.email ?? "",
      lop: data.lop ?? "",
      truong: data.truong ?? "",
      co_so: branchLabel(data.co_so),
      tinh: provinceName(data.tinh),
      source: "quatang.edu.vn",
      ip,
      user_agent: userAgent,
      // Cột attribution (Apps Script v2.2 — cột O–U; script cũ bỏ qua key lạ)
      ...affSheetFields,
      aff_ma_nv: affEmployeeCode,
      misa_status:
        misaResult.status === "OK"
          ? "OK"
          : `${misaResult.status}${
              "httpStatus" in misaResult && misaResult.httpStatus
                ? `_${misaResult.httpStatus}`
                : ""
            }`,
    };

    // MISA đã OK → lead an toàn (KT-03), trả thành công NGAY; Sheet backup
    // ghi nền qua waitUntil — khách không phải chờ thêm 1-15s của Apps Script.
    if (misaResult.status === "OK") {
      markSubmitted(data.sdt);
      waitUntil(
        submitToSheet(sheetPayload).then((r) => {
          if (!r.ok) {
            console.error(
              "[/api/lead] Sheet backup fail (lead đã ở MISA):",
              r.detail
            );
          }
        })
      );
      return NextResponse.json(
        {
          ok: true,
          message:
            "Đăng ký thành công! Sata Robo sẽ liên hệ ba mẹ trong 24 giờ.",
        },
        { status: 200 }
      );
    }

    // MISA fail → Sheet là kênh duy nhất còn lại, PHẢI chờ ghi xong mới dám
    // báo thành công (KT-03: ≥1 nơi giữ được lead)
    const sheetResult = await submitToSheet(sheetPayload);
    if (sheetResult.ok) {
      markSubmitted(data.sdt);
      console.error(
        "[MISA-FAIL] Lead chỉ vào Sheet — cần đối soát nhập lại MISA:",
        data.sdt.slice(0, 4) + "***"
      );
      return NextResponse.json(
        {
          ok: true,
          message:
            "Đăng ký thành công! Sata Robo sẽ liên hệ ba mẹ trong 24 giờ.",
        },
        { status: 200 }
      );
    }

    // Cả hai kênh chết — KHÔNG markSubmitted: khách bấm thử lại ngay được
    console.error("[/api/lead] CẢ HAI kênh đều thất bại — lead bị mất!");
    return NextResponse.json(
      {
        ok: false,
        error: "ALL_CHANNELS_FAILED",
        message: "Có lỗi xảy ra, vui lòng thử lại sau ít phút",
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("[/api/lead] Unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL_ERROR",
        message: "Có lỗi xảy ra, vui lòng thử lại",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "/api/lead",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
}
