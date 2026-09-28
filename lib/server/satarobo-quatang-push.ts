import "server-only";

import { randomUUID } from "node:crypto";

/**
 * Đẩy lead form quà tặng THẲNG vào CRM satarobo — kênh DUY NHẤT (28/09/2026).
 *
 * Trước đây: form → MISA (kênh chính) + Google Sheet → Apps Script → satarobo.
 * Chủ dự án chốt 28/09: bỏ MISA và Sheet, lead chỉ cần về admin.satarobo.vn.
 *
 * Đích là ĐÚNG cổng mà Apps Script vẫn gọi: `POST /api/public/webhook/quatang`
 * (header `x-webhook-secret` = `WEBHOOK_QUATANG_SECRET` bên satarobo). Cổng đó
 * nhận nguyên bộ trường mà trước đây gửi cho Sheet (`ho_ten_con`, `sdt`,
 * `aff_ma_nv`…) — nên nguồn lead "quatang", affiliate, phân cơ sở và chống
 * trùng giữ y như cũ, bên satarobo không phải sửa gì.
 *
 * `event_id` là khoá idempotency: satarobo nhận lại cùng id thì trả duplicate,
 * không đẻ lead thứ hai.
 */
export type SataroboPushResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; detail: string };

export async function pushQuatangLeadToSatarobo(
  payload: Record<string, string>,
): Promise<SataroboPushResult> {
  const url = process.env.SATAROBO_QUATANG_WEBHOOK_URL;
  const secret = process.env.SATAROBO_QUATANG_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.error(
      "[/api/lead] satarobo SKIPPED_CONFIG — thiếu SATAROBO_QUATANG_WEBHOOK_URL/SECRET",
    );
    return { ok: false, detail: "SKIPPED_CONFIG" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": secret },
      body: JSON.stringify({
        ...payload,
        event_id: randomUUID(),
        ts: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(15000),
    });
    // satarobo trả 200 cả khi từ chối nội dung (ok:false) — phải đọc body.
    const json = (await res.json().catch(() => null)) as
      | { ok?: boolean; duplicate?: boolean; error?: string }
      | null;
    if (!res.ok || !json || json.ok !== true) {
      console.error("[/api/lead] satarobo từ chối:", res.status, json?.error ?? "");
      return { ok: false, detail: `HTTP_${res.status}${json?.error ? `: ${json.error}` : ""}` };
    }
    return { ok: true, duplicate: json.duplicate === true };
  } catch (err) {
    console.error("[/api/lead] satarobo network/timeout:", err);
    return { ok: false, detail: "NETWORK" };
  }
}
