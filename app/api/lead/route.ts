import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas/lead";
import { branchLabel, provinceName } from "@/lib/constants/misa";
import { submitToMisaServer } from "@/lib/server/misa";
import type { LeadApiResponse } from "@/lib/types/api";

const RATE_LIMIT_WINDOW_MS = 30 * 1000;
const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const lastSubmit = rateLimitMap.get(ip);
  if (lastSubmit && now - lastSubmit < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  rateLimitMap.set(ip, now);
  if (rateLimitMap.size > 1000) {
    for (const [key, ts] of rateLimitMap.entries()) {
      if (now - ts > 3600 * 1000) rateLimitMap.delete(key);
    }
  }
  return false;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

type SheetResult = { ok: boolean; detail?: string };

// Kênh backup: Google Sheet qua Apps Script Web App.
// GOOGLE_SCRIPT_URL là tên mới (server-only); fallback tên cũ NEXT_PUBLIC_*
// trong 1 release để không phải phối hợp đổi env cùng lúc deploy.
async function submitToSheet(
  payload: Record<string, string>
): Promise<SheetResult> {
  const scriptUrl =
    process.env.GOOGLE_SCRIPT_URL ?? process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
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
    const body = await req.json().catch(() => null);
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

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          ok: false,
          error: "RATE_LIMITED",
          message: "Bạn gửi quá nhanh, vui lòng đợi 30 giây",
        },
        { status: 429 }
      );
    }

    const userAgent = req.headers.get("user-agent") ?? "unknown";

    // Kênh chính: MISA CRM — gửi từ server, đọc response thật (P0-03).
    // Chạy trước để row Sheet ghi được misa_status (soi thất bại, không im lặng).
    const misaResult = await submitToMisaServer(data);

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
      misa_status:
        misaResult.status === "OK"
          ? "OK"
          : `${misaResult.status}${
              "httpStatus" in misaResult && misaResult.httpStatus
                ? `_${misaResult.httpStatus}`
                : ""
            }`,
    };

    const sheetResult = await submitToSheet(sheetPayload);

    // KT-03: khách thấy "thành công" nếu dữ liệu vào được ít nhất MỘT nơi
    if (misaResult.status === "OK" || sheetResult.ok) {
      if (misaResult.status !== "OK") {
        console.error(
          "[MISA-FAIL] Lead chỉ vào Sheet — cần đối soát nhập lại MISA:",
          data.sdt.slice(0, 4) + "***"
        );
      }
      return NextResponse.json(
        {
          ok: true,
          message:
            "Đăng ký thành công! Sata Robo sẽ liên hệ ba mẹ trong 24 giờ.",
        },
        { status: 200 }
      );
    }

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
