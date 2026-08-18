import 'server-only';

import { randomUUID } from 'node:crypto';
import {
  ACHIEVEMENTS,
  CAMPUSES,
  covuaConfig,
  getAchievementGroup,
} from '@/content/covua';
import type { CovuaLead } from '@/lib/covua-form-schema';

/**
 * Đẩy lead cờ vua vào CRM satarobo.vn.
 *
 * 17/08: đổi đích — KHÔNG chờ endpoint HMAC riêng (docs covua 07 §3, chưa
 * tồn tại) nữa. Đẩy thẳng vào POST /api/leads CÔNG KHAI có sẵn của
 * satarobo.vn — đúng đường mà form trên web satarobo đang dùng. Được luôn:
 * chống trùng SĐT 90 ngày, tự phân Sale theo cơ sở, gắn affiliate qua mã
 * ?ref, lead hiện ngay trong màn /admin/leads. Không cần API key/secret.
 *
 * CHỈ chạy phía server (route handler /api/lead-covua) — không import vào
 * client. Không bao giờ throw: satarobo hỏng không được làm hỏng phản hồi
 * "đăng ký thành công"; kết quả chỉ ghi vào cột sataroboStatus của Sheet.
 */

export type SataroboIngestStatus = 'sent' | 'duplicated' | 'failed';

const achievementLabel = (v: string) =>
  ACHIEVEMENTS.find((a) => a.value === v)?.label ?? v;

const campusLabel = (v?: string | null) =>
  CAMPUSES.find((c) => c.value === v)?.shortLabel ?? null;

/** Ghi chú cho Sale — Lead.note của satarobo giới hạn 500 ký tự. */
function buildNote(lead: CovuaLead): string {
  const parts: string[] = [
    `Quà tặng ${covuaConfig.tenGiaiDau}`,
    `Thành tích: ${achievementLabel(lead.achievement)} (nhóm ${getAchievementGroup(lead.achievement) ?? '?'})`,
    `Hình thức: ${lead.studyMode === 'BOTH' ? 'Học cả hai (Offline+Online)' : 'Chỉ học online'}`,
  ];
  const campus = campusLabel(lead.campus);
  if (campus) parts.push(`Cơ sở: ${campus}`);
  parts.push(`Tỉnh/TP: ${lead.province}`);
  if (lead.category) parts.push(`Bảng: ${lead.category}`);
  if (lead.registrationNumber) parts.push(`SBD: ${lead.registrationNumber}`);
  return `[COVUA] ${parts.join(' · ')}`.slice(0, 500);
}

/**
 * Payload theo leadCreateSchema của satarobo (lib/validators/lead.ts bên đó):
 * bắt buộc parentName + phone + source + eventId (≥8 ký tự — chính là
 * idempotencyKey); centerId là Center.id thật trên DB satarobo, map từ
 * campus qua env SATAROBO_CENTER_ID_CS1/CS2 (thiếu env → bỏ trống,
 * cơ sở vẫn nằm trong note).
 */
export function buildSataroboPayload(
  lead: CovuaLead,
  opts: { idempotencyKey?: string } = {},
) {
  // Center.id trên satarobo là chuỗi TỰ ĐẶT trong seed (vd
  // "co-so-nguyen-huu-tho"), KHÔNG phải cuid — gửi nguyên giá trị env.
  // Phòng id sai: pushLeadToSatarobo tự retry KHÔNG kèm centerId khi 5xx.
  const centerIdByCampus: Record<string, string | undefined> = {
    CS1: process.env.SATAROBO_CENTER_ID_CS1?.trim(),
    CS2: process.env.SATAROBO_CENTER_ID_CS2?.trim(),
  };
  const centerId = lead.campus
    ? centerIdByCampus[lead.campus] || undefined
    : undefined;

  return {
    parentName: lead.parentName,
    childName: lead.studentName,
    phone: lead.parentPhone,
    email: lead.parentEmail || undefined,
    centerId,
    source: 'covua.quatang.edu.vn',
    utmSource: lead.utmSource || undefined,
    utmMedium: lead.utmMedium || undefined,
    utmCampaign: lead.utmCampaign || undefined,
    landingPage: covuaConfig.canonicalUrl,
    // Mã giới thiệu → Affiliate.code trên satarobo; mã sai vẫn tạo lead
    ref: lead.ref ? lead.ref.slice(0, 32) : undefined,
    eventId: opts.idempotencyKey ?? randomUUID(),
    consentMarketing: true,
    note: buildNote(lead),
  };
}

/**
 * Gửi 1 lead. Không bao giờ throw. Retry đúng 1 lần, chỉ với 429/5xx/timeout.
 * 'duplicated' = satarobo đã có lead cùng SĐT trong 90 ngày (không tạo bản
 * mới — dữ liệu đầy đủ vẫn nằm ở Google Sheet).
 */
export async function pushLeadToSatarobo(
  lead: CovuaLead,
  opts: { idempotencyKey?: string } = {},
): Promise<{ status: SataroboIngestStatus; leadId?: string; reason?: string }> {
  const url = process.env.SATAROBO_INGEST_URL;
  if (!url) {
    return { status: 'failed', reason: 'MISSING_ENV' };
  }

  const payload = buildSataroboPayload(lead, opts);

  const attempt = async (
    body: string
  ): Promise<
    { status: SataroboIngestStatus; leadId?: string; reason?: string } | 'RETRY'
  > => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          leadId?: string;
          duplicate?: boolean;
        };
        if (data.ok === false) {
          return { status: 'failed', reason: 'UPSTREAM_ERROR' };
        }
        return {
          status: data.duplicate ? 'duplicated' : 'sent',
          leadId: data.leadId,
        };
      }

      // 400/401/403: payload sai — retry cũng vô ích
      if (res.status < 500 && res.status !== 429) {
        return { status: 'failed', reason: `HTTP_${res.status}` };
      }
      return 'RETRY';
    } catch {
      return 'RETRY';
    }
  };

  const first = await attempt(JSON.stringify(payload));
  if (first !== 'RETRY') return first;

  await new Promise((r) => setTimeout(r, 2000));

  // Retry: nếu lần đầu có centerId thì bỏ đi — Center.id sai gây lỗi khóa
  // ngoại 500; thà lead vào CRM không gắn cơ sở (cơ sở vẫn nằm trong note)
  // còn hơn mất cả kênh.
  const retryPayload = payload.centerId
    ? { ...payload, centerId: undefined }
    : payload;
  if (payload.centerId) {
    console.warn(
      '[covua-satarobo] retry lần 2 KHÔNG kèm centerId (phòng Center.id sai gây 5xx)'
    );
  }
  const second = await attempt(JSON.stringify(retryPayload));
  if (second !== 'RETRY') return second;

  return { status: 'failed', reason: 'UNAVAILABLE' };
}
