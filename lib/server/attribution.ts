import "server-only";

// Cookie attribution affiliate trên quatang.edu.vn (BRD-AFF-005 FR-B02/B03).
// Một nguồn sự thật cho cả /r/[code] (ghi) và /api/lead (đọc).
// Cookie HttpOnly — client không bao giờ đọc (AC-10: form không đổi gì);
// server đọc qua req.cookies vì POST /api/lead là same-origin.

export const AFF_COOKIE_FIRST = "aff_first"; // lần chạm đầu — chỉ set nếu chưa có
export const AFF_COOKIE_LAST = "aff_last"; // lần chạm cuối — luôn ghi đè
export const AFF_COOKIE_UTM = "aff_utm"; // utm của lần chạm cuối

export const AFF_COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 ngày (FR-B02)

// Mã link hợp lệ: base64url, 6-64 ký tự (mã thật ≥16 theo FR-A02 — nhận dải
// rộng hơn để còn log những lượt dò mã)
export const AFF_CODE_REGEX = /^[A-Za-z0-9_-]{6,64}$/;

const CLICK_ID_REGEX = /^[A-Za-z0-9_-]{8,32}$/;

// Biên trên của JS Date (±8.64e15 ms) — timestamp giả mạo vượt biên sẽ làm
// new Date(x).toISOString() throw RangeError. Cookie là input không tin được.
const MAX_EPOCH_MS = 8_640_000_000_000_000;

export type AffTouch = {
  code: string; // mã link (không phải mã NV — resolve lúc submit)
  clickId: string; // định danh phiên click (BRD §8.3) — nối click ↔ lead
  clickedAt: number; // epoch ms thời điểm click
};

/** Format cookie: `v1.<code>.<clickId>.<epochMs>` — các phần không chứa dấu chấm. */
export function serializeTouch(touch: AffTouch): string {
  return `v1.${touch.code}.${touch.clickId}.${touch.clickedAt}`;
}

/** Cookie hỏng/không đúng format → null (fail-safe, coi như không có). */
export function parseTouch(raw: string | undefined): AffTouch | null {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return null;
  const [, code, clickId, ts] = parts;
  if (!AFF_CODE_REGEX.test(code)) return null;
  if (!CLICK_ID_REGEX.test(clickId)) return null;
  const clickedAt = Number(ts);
  if (!Number.isFinite(clickedAt) || clickedAt <= 0 || clickedAt > MAX_EPOCH_MS) {
    return null;
  }
  return { code, clickId, clickedAt };
}

export type AffUtm = {
  source?: string;
  medium?: string;
  campaign?: string;
};

const UTM_VALUE_MAX = 120;

function sanitizeUtmValue(v: string | null): string | undefined {
  if (!v) return undefined;
  // Bỏ ký tự có thể phá format cookie/query; cắt độ dài
  const clean = v.replace(/[^\p{L}\p{N} _\-.:/]/gu, "").trim().slice(0, UTM_VALUE_MAX);
  return clean.length > 0 ? clean : undefined;
}

/** Dựng giá trị cookie aff_utm từ query của lượt click; "" nếu không có utm. */
export function buildUtmCookieValue(searchParams: URLSearchParams): string {
  const p = new URLSearchParams();
  const source = sanitizeUtmValue(searchParams.get("utm_source"));
  const medium = sanitizeUtmValue(searchParams.get("utm_medium"));
  const campaign = sanitizeUtmValue(searchParams.get("utm_campaign"));
  if (source) p.set("s", source);
  if (medium) p.set("m", medium);
  if (campaign) p.set("c", campaign);
  return p.toString().slice(0, 400);
}

export function parseUtmCookie(raw: string | undefined): AffUtm {
  if (!raw) return {};
  try {
    const p = new URLSearchParams(raw);
    return {
      source: p.get("s") ?? undefined,
      medium: p.get("m") ?? undefined,
      campaign: p.get("c") ?? undefined,
    };
  } catch {
    return {};
  }
}

export const AFF_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: AFF_COOKIE_MAX_AGE,
};
