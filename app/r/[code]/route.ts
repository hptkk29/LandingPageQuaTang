import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";

import {
  AFF_CODE_REGEX,
  AFF_COOKIE_FIRST,
  AFF_COOKIE_LAST,
  AFF_COOKIE_UTM,
  AFF_COOKIE_OPTIONS,
  buildUtmCookieValue,
  parseTouch,
  serializeTouch,
} from "@/lib/server/attribution";
import { logClick } from "@/lib/server/aff-store";

// Bộ chuyển hướng affiliate /r/<mã> (BRD-AFF-005 FR-B01..B05, B10).
//
// Hot path KHÔNG có network call: validate cú pháp → set cookie → 302 về "/"
// (mọi link quatang đều trỏ trang quà tặng; resolve mã → NV xảy ra lúc submit
// form, không phải lúc click). Log click chạy nền qua waitUntil.
//
// Fail-open toàn diện (FR-B04/AC-08): mã sai, mã thu hồi, store chết, thậm chí
// handler throw — khách vẫn được đưa vào trang bình thường, không bao giờ lỗi.

export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> }
) {
  // Đích luôn là trang chủ, GIỮ NGUYÊN query string (utm_*, fbclid…) để
  // Meta Pixel/analytics trên landing vẫn thấy nguồn chiến dịch (FR-B09).
  const target = new URL("/", req.nextUrl.origin);
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value); // append: không nuốt param trùng key
  });
  const res = NextResponse.redirect(target, 302);

  try {
    const { code } = await ctx.params;
    const syntaxValid = AFF_CODE_REGEX.test(code);
    const now = Date.now();

    if (syntaxValid) {
      const clickId = randomBytes(12).toString("base64url"); // 16 ký tự
      const touch = { code, clickId, clickedAt: now };

      // Lần chạm đầu: chỉ set khi chưa có cookie hợp lệ (AC-06)
      const existingFirst = parseTouch(req.cookies.get(AFF_COOKIE_FIRST)?.value);
      if (!existingFirst) {
        res.cookies.set(AFF_COOKIE_FIRST, serializeTouch(touch), AFF_COOKIE_OPTIONS);
      }
      // Lần chạm cuối: luôn ghi đè (BR-01.1)
      res.cookies.set(AFF_COOKIE_LAST, serializeTouch(touch), AFF_COOKIE_OPTIONS);

      // UTM của lần chạm cuối — không có utm thì XOÁ cookie cũ (tránh gán
      // nhầm utm của lần click trước cho lần chạm này)
      const utmValue = buildUtmCookieValue(req.nextUrl.searchParams);
      if (utmValue) {
        res.cookies.set(AFF_COOKIE_UTM, utmValue, AFF_COOKIE_OPTIONS);
      } else {
        res.cookies.set(AFF_COOKIE_UTM, "", { ...AFF_COOKIE_OPTIONS, maxAge: 0 });
      }

      waitUntil(
        logClick({
          clickId,
          code,
          syntaxValid: true,
          occurredAt: now,
          domain: "quatang.edu.vn",
          utmSource: req.nextUrl.searchParams.get("utm_source") ?? undefined,
          utmMedium: req.nextUrl.searchParams.get("utm_medium") ?? undefined,
          utmCampaign: req.nextUrl.searchParams.get("utm_campaign") ?? undefined,
          referrer: req.headers.get("referer") ?? undefined,
          ip: getClientIp(req),
          userAgent: req.headers.get("user-agent") ?? undefined,
        })
      );
    } else {
      // Mã rác: không cookie, vẫn redirect bình thường; log để soi dò mã (FR-B04)
      waitUntil(
        logClick({
          clickId: randomBytes(12).toString("base64url"),
          code: code.slice(0, 64),
          syntaxValid: false,
          occurredAt: now,
          domain: "quatang.edu.vn",
          ip: getClientIp(req),
          userAgent: req.headers.get("user-agent") ?? undefined,
        })
      );
    }
  } catch (err) {
    // FR-B05: lỗi ghi nhận không bao giờ làm hỏng chuyển hướng
    console.error("[/r] error (vẫn redirect):", err);
  }

  return res;
}
