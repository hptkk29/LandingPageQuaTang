import "server-only";

// Kho mã link affiliate — interface duy nhất cho /r/[code] và /api/lead.
// Implementation chọn theo env AFF_STORE:
//   "sheet"    — Pha 1: Google Sheet "AffLinks" qua Apps Script Web App
//   "satarobo" — Pha 4: API kho mã trung tâm trên satarobo.vn
// Đổi kho = đổi env, KHÔNG sửa route. Sau khi satarobo ổn định ~2 tuần
// (chạy song song) thì tắt hẳn Sheet.

export type AffLinkInfo = {
  employeeCode: string; // mã NV chủ link — chỉ trả khi link "Đang chạy"
  status: string;
  channel?: string; // nhãn kênh
};

export type AffClickEvent = {
  clickId: string;
  code: string; // mã thô trên URL (kể cả mã sai — log dò mã FR-B04)
  syntaxValid: boolean;
  occurredAt: number; // epoch ms
  domain: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  ip?: string;
  userAgent?: string;
};

// Cache in-memory theo instance (module-level) — đủ tốt cho redirect/submit;
// negative-cache ngắn hơn để link mới tạo không bị "ẩn" lâu.
type CacheEntry = { value: AffLinkInfo | null; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_HIT_MS = 120_000;
const CACHE_TTL_MISS_MS = 60_000;

function getStoreKind(): "sheet" | "satarobo" {
  return process.env.AFF_STORE === "satarobo" ? "satarobo" : "sheet";
}

/**
 * Tra mã link → thông tin chủ link. null = không tồn tại / không "Đang chạy" /
 * store lỗi. KHÔNG bao giờ throw — caller không cần try/catch (FR-B05).
 */
export async function resolveAffCode(code: string): Promise<AffLinkInfo | null> {
  const now = Date.now();
  const cached = cache.get(code);
  if (cached && cached.expiresAt > now) return cached.value;

  let value: AffLinkInfo | null = null;
  try {
    value =
      getStoreKind() === "satarobo"
        ? await resolveViaSatarobo(code)
        : await resolveViaSheet(code);
  } catch (err) {
    console.error("[aff-store] resolve error:", err);
    value = null;
  }

  cache.set(code, {
    value,
    expiresAt: now + (value ? CACHE_TTL_HIT_MS : CACHE_TTL_MISS_MS),
  });
  if (cache.size > 500) {
    for (const [k, v] of cache.entries()) {
      if (v.expiresAt <= now) cache.delete(k);
    }
  }
  return value;
}

/**
 * Ghi log click (FR-B10). Caller gọi qua waitUntil — không chặn redirect.
 * Nuốt mọi lỗi (FR-B05: lỗi ghi nhận không bao giờ làm hỏng chuyển hướng).
 */
export async function logClick(evt: AffClickEvent): Promise<void> {
  try {
    if (getStoreKind() === "satarobo") {
      await logClickViaSatarobo(evt);
    } else {
      await logClickViaSheet(evt);
    }
  } catch (err) {
    console.error("[aff-store] logClick error:", err);
  }
}

// ── Impl "sheet" — Pha 1: Apps Script AffLinks (docs/apps-script-aff-links.gs) ──

function getSheetConfig(): { url: string; secret: string } | null {
  const url = process.env.AFF_SHEET_API_URL;
  const secret = process.env.AFF_SHEET_SECRET;
  if (!url || !secret) return null;
  return { url, secret };
}

async function resolveViaSheet(code: string): Promise<AffLinkInfo | null> {
  const cfg = getSheetConfig();
  if (!cfg) {
    console.error("[aff-store] SKIPPED_CONFIG — thiếu env AFF_SHEET_*");
    return null;
  }
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "resolve", secret: cfg.secret, code }),
    // Apps Script cold-start có thể vài giây — 3s quá chặt làm rớt mã NV.
    // Kho mã đáng tin (lead-handler cũng tự tra lại từ Links tab) nên chờ lâu
    // hơn ở đây đáng giá; MISA vẫn timeout 6s riêng.
    signal: AbortSignal.timeout(9000),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  if (!json?.ok || !json.found || !json.employeeCode) return null;
  return {
    employeeCode: String(json.employeeCode),
    status: String(json.status ?? ""),
    channel: json.channel ? String(json.channel) : undefined,
  };
}

async function logClickViaSheet(evt: AffClickEvent): Promise<void> {
  const cfg = getSheetConfig();
  if (!cfg) return;
  await fetch(cfg.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "click", secret: cfg.secret, ...evt }),
    signal: AbortSignal.timeout(9000),
    cache: "no-store",
  });
}

// ── Impl "satarobo" — Pha 4: kho mã trung tâm (POST /api/aff/resolve, HMAC) ──
// Kích hoạt khi cổng satarobo go-live; đến lúc đó bổ sung HMAC theo contract
// x-sata-source/timestamp/signature.

async function resolveViaSatarobo(code: string): Promise<AffLinkInfo | null> {
  void code;
  console.warn("[aff-store] AFF_STORE=satarobo chưa kích hoạt (Pha 4) — trả null");
  return null;
}

async function logClickViaSatarobo(evt: AffClickEvent): Promise<void> {
  void evt;
  console.warn("[aff-store] AFF_STORE=satarobo chưa kích hoạt (Pha 4) — bỏ qua log");
}
