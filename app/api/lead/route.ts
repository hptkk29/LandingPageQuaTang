import { NextRequest, NextResponse } from "next/server";
import { leadSchema, type AppsScriptPayload } from "@/lib/schemas/lead";
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

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      console.error("[/api/lead] Missing env vars");
      return NextResponse.json(
        {
          ok: false,
          error: "SERVER_CONFIG",
          message: "Hệ thống đang bảo trì, vui lòng thử lại sau",
        },
        { status: 500 }
      );
    }

    const userAgent = req.headers.get("user-agent") ?? "unknown";
    const payload: AppsScriptPayload = {
      secret,
      ho_ten: data.ho_ten,
      sdt: data.sdt,
      email: data.email ?? "",
      lop: data.lop,
      truong: data.truong ?? "",
      co_so: data.co_so,
      source: "quatang.edu.vn",
      ip,
      user_agent: userAgent,
    };

    const appsScriptRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!appsScriptRes.ok) {
      console.error(
        "[/api/lead] Apps Script HTTP error:",
        appsScriptRes.status
      );
      return NextResponse.json(
        {
          ok: false,
          error: "UPSTREAM_HTTP_ERROR",
          message: "Có lỗi xảy ra, vui lòng thử lại sau ít phút",
        },
        { status: 502 }
      );
    }

    const appsScriptData = await appsScriptRes.json().catch(() => null);
    if (!appsScriptData || appsScriptData.ok !== true) {
      console.error(
        "[/api/lead] Apps Script error response:",
        appsScriptData
      );
      return NextResponse.json(
        {
          ok: false,
          error: "UPSTREAM_ERROR",
          message:
            appsScriptData?.message ?? "Có lỗi xảy ra, vui lòng thử lại",
        },
        { status: 502 }
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
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
