import 'server-only';

import { createHmac, randomUUID } from 'node:crypto';
import { getAchievementGroup } from '@/content/covua';
import type { CovuaLead } from './covua-form-schema';

/**
 * Đẩy lead sang admin satarobo.vn.
 *
 * CHỈ chạy phía server (route handler /api/lead-covua). Không import vào client —
 * SATAROBO_INGEST_SECRET lộ ra browser là mở cửa cho spam thẳng vào DB thật.
 */

export type SataroboIngestStatus = 'sent' | 'duplicated' | 'failed';

export function buildSataroboPayload(
  lead: CovuaLead,
  opts: { idempotencyKey?: string; submittedAt?: Date } = {},
) {
  return {
    idempotencyKey: opts.idempotencyKey ?? randomUUID(),
    source: 'LANDING_QUATANG',
    programCode: 'COVUA',
    submittedAt: (opts.submittedAt ?? new Date()).toISOString(),

    student: { fullName: lead.studentName },
    parent: {
      fullName: lead.parentName,
      phone: lead.parentPhone,
      email: lead.parentEmail || '',
    },
    location: { province: lead.province, address: lead.address },

    program: {
      achievement: lead.achievement,
      // satarobo tính lại giá trị này, gửi kèm chỉ để đối chiếu
      achievementGroup: getAchievementGroup(lead.achievement),
      category: lead.category || '',
      registrationNumber: lead.registrationNumber || '',
      studyMode: lead.studyMode,
      campusCode: lead.campus ?? null,
      techInterest: lead.techInterest,
    },

    attribution: {
      refCode: lead.ref || '',
      utmSource: lead.utmSource || '',
      utmMedium: lead.utmMedium || '',
      utmCampaign: lead.utmCampaign || '',
    },

    consent: { contactAgreed: true, agreedAt: new Date().toISOString() },
  };
}

function sign(rawBody: string, timestamp: number, secret: string): string {
  return createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
}

/**
 * Gửi 1 lead. Không bao giờ throw — lỗi ở đây không được làm hỏng
 * phản hồi "đăng ký thành công" cho phụ huynh.
 * Retry đúng 1 lần, chỉ với 429/5xx/timeout.
 */
export async function pushLeadToSatarobo(
  lead: CovuaLead,
  opts: { idempotencyKey?: string } = {},
): Promise<{ status: SataroboIngestStatus; leadId?: string; reason?: string }> {
  const url = process.env.SATAROBO_INGEST_URL;
  const apiKey = process.env.SATAROBO_INGEST_API_KEY;
  const secret = process.env.SATAROBO_INGEST_SECRET;

  if (!url || !apiKey || !secret) {
    return { status: 'failed', reason: 'MISSING_ENV' };
  }

  const payload = buildSataroboPayload(lead, opts);
  const rawBody = JSON.stringify(payload);

  const attempt = async (): Promise<
    { status: SataroboIngestStatus; leadId?: string; reason?: string } | 'RETRY'
  > => {
    const timestamp = Math.floor(Date.now() / 1000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
          'X-Timestamp': String(timestamp),
          'X-Signature': sign(rawBody, timestamp, secret),
        },
        body: rawBody,
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          leadId?: string;
          duplicated?: boolean;
        };
        return {
          status: data.duplicated ? 'duplicated' : 'sent',
          leadId: data.leadId,
        };
      }

      // 400/401/403: payload hoặc khóa sai — retry cũng vô ích
      if (res.status < 500 && res.status !== 429) {
        return { status: 'failed', reason: `HTTP_${res.status}` };
      }
      return 'RETRY';
    } catch {
      return 'RETRY';
    }
  };

  const first = await attempt();
  if (first !== 'RETRY') return first;

  await new Promise((r) => setTimeout(r, 2000));

  const second = await attempt();
  if (second !== 'RETRY') return second;

  return { status: 'failed', reason: 'UNAVAILABLE' };
}
