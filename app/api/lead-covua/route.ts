import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { covuaLeadSchema } from "@/lib/covua-form-schema";
import { buildSheetRow } from "@/lib/covua-lead-mapping";
import { submitCovuaLeadToMisa } from "@/lib/server/covua-misa";
import { pushLeadToSatarobo } from "@/lib/server/covua-satarobo-push";
import type { LeadApiResponse } from "@/lib/types/api";

// Lead cờ vua đi 3 đường, cả ba đều ở đây (17/08: thêm lại MISA theo yêu cầu):
//   1. MISA CRM — WebForm savecollection, gọi từ server (đọc kết quả thật),
//      dùng chung form + env MISA_* với trang quà tặng cũ
//   2. Google Sheet cờ vua (bản gốc đối soát) — env COVUA_SHEET_WEBHOOK_URL
//   3. satarobo.vn — POST /api/leads public có sẵn; env SATAROBO_*
// Kênh nào chết chỉ ghi trạng thái vào cột tương ứng của Sheet, KHÔNG BAO GIỜ
// làm hỏng phản hồi. Báo thành công khi lead nằm ở ÍT NHẤT một nơi (KT-03).
// Cả ba chết → 502, client giữ dữ liệu + idempotencyKey để gửi lại.
//
// MISA + satarobo chạy SONG SONG trước, Sheet ghi sau cùng (không song song
// với 2 kênh kia) vì dòng Sheet phải chứa misaStatus + sataroboStatus —
// Apps Script chỉ append, không sửa dòng cũ. Giá chờ: max(6s MISA, ~12s
// satarobo treo), bình thường ~1s; thiếu env thì kênh đó trả kết quả ngay.

// Rate-limit theo SĐT (không theo IP — CGNAT nhà mạng VN), chỉ đóng dấu SAU
// khi lead đã vào được ít nhất một kênh: thử lại sau thất bại không bị 429.
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

// satarobo tối đa ~12s + Sheet 15s vẫn nằm gọn trong 60s
export const maxDuration = 60;

// Form covua tổng các field giới hạn dưới 1KB — 16KB là rộng rãi.
const MAX_BODY_BYTES = 16 * 1024;

type ReadBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "TOO_LARGE" | "INVALID" };

// Đếm byte thật theo stream thay vì tin content-length (header do client đặt).
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

const MAX_USER_AGENT_CHARS = 300;

// idempotencyKey do client sinh (uuid) và giữ nguyên khi bấm gửi lại —
// satarobo dựa vào nó để retry không tạo bản ghi thứ hai. Giá trị lạ/thiếu
// thì server tự sinh, không bao giờ chặn lead vì khóa sai định dạng.
const IDEMPOTENCY_KEY_REGEX = /^[A-Za-z0-9-]{8,64}$/;

function resolveIdempotencyKey(body: unknown): string {
  if (body && typeof body === "object") {
    const raw = (body as Record<string, unknown>).idempotencyKey;
    if (typeof raw === "string" && IDEMPOTENCY_KEY_REGEX.test(raw)) return raw;
  }
  return randomUUID();
}

type SheetResult = { ok: boolean; detail?: string };

async function submitToCovuaSheet(
  payload: Record<string, string>
): Promise<SheetResult> {
  const scriptUrl = process.env.COVUA_SHEET_WEBHOOK_URL;
  const secret = process.env.COVUA_SHEET_SECRET;

  if (!scriptUrl || !secret) {
    console.error(
      "[/api/lead-covua] Sheet SKIPPED_CONFIG — thiếu env COVUA_SHEET_WEBHOOK_URL/COVUA_SHEET_SECRET"
    );
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
      console.error("[/api/lead-covua] Apps Script HTTP error:", res.status);
      return { ok: false, detail: `HTTP_${res.status}` };
    }

    const json = await res.json().catch(() => null);
    if (!json || json.ok !== true) {
      console.error("[/api/lead-covua] Apps Script error response:", json);
      return { ok: false, detail: "UPSTREAM_ERROR" };
    }

    return { ok: true };
  } catch (err) {
    console.error("[/api/lead-covua] Apps Script network/timeout:", err);
    return { ok: false, detail: "NETWORK" };
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<LeadApiResponse>> {
  try {
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

    // Validate lại toàn bộ bằng zod — không tin client. Schema tự chuẩn hóa
    // SĐT/họ tên và ép nhóm B về ONLINE_ONLY + campus=null (chốt chặn cuối
    // cho quy tắc reset cơ sở, kể cả khi payload bị sửa tay).
    const parsed = covuaLeadSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_FAILED",
          message: issues[0]?.message ?? "Validation failed",
          fields: issues.map((e) => e.path.join(".")),
        },
        { status: 400 }
      );
    }

    const lead = parsed.data;
    const idempotencyKey = resolveIdempotencyKey(body);

    if (isRateLimited(lead.parentPhone)) {
      return NextResponse.json(
        {
          ok: false,
          error: "RATE_LIMITED",
          message: "Anh/chị vừa gửi đăng ký thành công, vui lòng đợi 30 giây",
        },
        { status: 429 }
      );
    }

    const userAgent = (req.headers.get("user-agent") ?? "unknown").slice(
      0,
      MAX_USER_AGENT_CHARS
    );

    // MISA + satarobo song song — cả hai không bao giờ throw; thiếu env thì
    // kênh đó trả skipped/failed ngay lập tức.
    const [misa, satarobo] = await Promise.all([
      submitCovuaLeadToMisa(lead),
      pushLeadToSatarobo(lead, { idempotencyKey }),
    ]);
    if (satarobo.status === "failed") {
      console.error("[/api/lead-covua] satarobo failed:", satarobo.reason);
    }

    // Đường Google Sheet — dòng ghi kèm kết quả 2 kênh kia: lọc failed để
    // nhập bù MISA/satarobo (docs covua 04 §5 + 07 §6).
    const sheetRow: Record<string, string> = {
      ...buildSheetRow(lead, { userAgent }),
      sataroboStatus: satarobo.status,
      sataroboLeadId: satarobo.leadId ?? "",
      misaStatus: misa.status,
      idempotencyKey,
    };
    const sheet = await submitToCovuaSheet(sheetRow);

    const sataroboOk =
      satarobo.status === "sent" || satarobo.status === "duplicated";
    const misaOk = misa.status === "sent";

    if (misaOk && !sheet.ok) {
      console.error(
        "[/api/lead-covua] Lead đã ở MISA nhưng Sheet fail:",
        sheet.detail
      );
    }

    if (sheet.ok || sataroboOk || misaOk) {
      markSubmitted(lead.parentPhone);
      if (!sheet.ok) {
        console.error(
          "[/api/lead-covua] Lead chỉ vào satarobo — Sheet fail:",
          sheet.detail
        );
      }
      return NextResponse.json(
        {
          ok: true,
          message:
            "Đã nhận đăng ký! Sata Robo sẽ liên hệ anh/chị trong 24–48 giờ làm việc.",
        },
        { status: 200 }
      );
    }

    // Cả ba kênh chết — KHÔNG markSubmitted: khách bấm gửi lại ngay được
    console.error("[/api/lead-covua] CẢ BA kênh đều thất bại — lead bị mất!");
    return NextResponse.json(
      {
        ok: false,
        error: "ALL_CHANNELS_FAILED",
        message: "Có lỗi xảy ra, vui lòng thử lại sau ít phút",
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("[/api/lead-covua] Unexpected error:", err);
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
    service: "/api/lead-covua",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
