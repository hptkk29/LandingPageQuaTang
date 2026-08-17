import 'server-only';

import {
  ACHIEVEMENTS,
  CAMPUSES,
  covuaConfig,
  getAchievementGroup,
} from '@/content/covua';
import { PROVINCES } from '@/lib/constants/misa';
import { classifyMisaResponse, getMisaConfig } from '@/lib/server/misa';
import type { CovuaLead } from '@/lib/covua-form-schema';

/**
 * Đẩy lead cờ vua sang MISA AMIS CRM (WebForm savecollection) — dùng CHUNG
 * form quà tặng với trang cũ (env MISA_FORM_ID/COMPANY_CODE/FORM_KEY qua
 * getMisaConfig()). Gọi từ SERVER như lib/server/misa.ts: đọc được status +
 * body thật (302 redirect = lưu thành công), không mù như no-cors.
 *
 * Field ID copy NGUYÊN từ bảng MISA_FIELDS của form quà tặng — không đoán.
 * Form không có field riêng cho "Mô tả" và "Nguồn gốc Leads" của chương
 * trình cờ vua, nên 2 mục đó đi qua env tùy chọn (thiếu env → omit, không
 * gửi giá trị đoán mò):
 *   COVUA_MISA_DESC_FIELD        — tên field nhận chuỗi mô tả [COVUA] ...
 *   COVUA_MISA_LEAD_SOURCE_FIELD — tên field "Nguồn gốc Leads"
 *                                  (fallback MISA_AFF_LEAD_SOURCE_FIELD)
 *   COVUA_MISA_LEAD_SOURCE_ID    — ID option "Giải cờ vua" trên MISA
 */

export type CovuaMisaStatus = 'sent' | 'failed' | 'skipped';

// Ánh xạ nghĩa → field ID thật trên form quà tặng MISA (lib/server/misa.ts)
const MISA_FIELDS = {
  hoTenCon: 'LastName', // bắt buộc theo cấu hình MISA
  hoTenPhuHuynh: 'CustomField25',
  sdtPhuHuynh: 'Mobile',
  email: 'Email',
  coSo: 'CustomField17', // option '1' / '2'
  tinh: 'MailingProvinceID', // ID tỉnh của MISA (Đà Nẵng = 7480)
} as const;

// CS1/CS2 của covua → giá trị option cơ sở trên MISA ('1'/'2' — trùng
// BRANCHES của form cũ). Nhóm học online không gửi field cơ sở.
const CAMPUS_TO_MISA: Record<string, string> = { CS1: '1', CS2: '2' };

const achievementLabel = (v: string) =>
  ACHIEVEMENTS.find((a) => a.value === v)?.label ?? v;

/** Chuỗi mô tả cho Sale — định dạng cố định theo docs covua 04 §4. */
export function buildCovuaMisaDescription(lead: CovuaLead): string {
  const parts: string[] = [
    `Thanh tich: ${achievementLabel(lead.achievement)}`,
    `Nhom qua: ${getAchievementGroup(lead.achievement) ?? '?'}`,
    `Hinh thuc: ${lead.studyMode === 'BOTH' ? 'Ca hai (Offline+Online)' : 'Chi Online'}`,
  ];
  const campus = CAMPUSES.find((c) => c.value === lead.campus)?.shortLabel;
  if (campus) parts.push(`Co so: ${campus}`);
  if (lead.utmSource) parts.push(`Nguon: ${lead.utmSource}`);
  parts.push(`Giai: ${covuaConfig.tenGiaiDau}`);
  return `[COVUA] ${parts.join(' | ')}`;
}

type MisaConfig = NonNullable<ReturnType<typeof getMisaConfig>>;

export function buildCovuaMisaBody(
  cfg: MisaConfig,
  lead: CovuaLead
): URLSearchParams {
  const p = new URLSearchParams();
  // Field ẩn (auth + cấu hình form) — giống hệt form quà tặng
  p.set('ID', cfg.formId);
  p.set('Companycode', cfg.companyCode);
  p.set('AllowURL', cfg.allowUrl);
  p.set('FormKey', cfg.formKey);
  p.set('RedirectURL', cfg.redirectUrl);

  p.set(MISA_FIELDS.hoTenCon, lead.studentName);
  p.set(MISA_FIELDS.hoTenPhuHuynh, lead.parentName);
  p.set(MISA_FIELDS.sdtPhuHuynh, lead.parentPhone);
  if (lead.parentEmail) p.set(MISA_FIELDS.email, lead.parentEmail);

  const misaCampus = lead.campus ? CAMPUS_TO_MISA[lead.campus] : undefined;
  if (misaCampus) p.set(MISA_FIELDS.coSo, misaCampus);

  const provinceId = PROVINCES.find((x) => x.name === lead.province)?.id;
  if (provinceId) p.set(MISA_FIELDS.tinh, provinceId);

  // Mã NV giới thiệu — field do env khai (form quà tặng: CustomField26).
  // FR-B08: không có mã → omit hoàn toàn, không gửi giá trị giả.
  const affFieldName = process.env.MISA_AFF_FIELD_NAME;
  if (lead.ref && affFieldName) p.set(affFieldName, lead.ref);

  // Nguồn gốc Leads = option "Giải cờ vua" — chỉ gửi khi có đủ tên field + ID
  const leadSourceField =
    process.env.COVUA_MISA_LEAD_SOURCE_FIELD ??
    process.env.MISA_AFF_LEAD_SOURCE_FIELD;
  const leadSourceValue = process.env.COVUA_MISA_LEAD_SOURCE_ID;
  if (leadSourceField && leadSourceValue) {
    p.set(leadSourceField, leadSourceValue);
  }

  // Mô tả — chỉ gửi khi đã xác nhận field ID thật từ MISA admin
  const descField = process.env.COVUA_MISA_DESC_FIELD;
  if (descField) p.set(descField, buildCovuaMisaDescription(lead));

  return p;
}

/**
 * Gửi 1 lead sang MISA. Không bao giờ throw — MISA hỏng thì phụ huynh vẫn
 * thấy thành công qua kênh Sheet/satarobo, chỉ ghi misaStatus vào Sheet.
 */
export async function submitCovuaLeadToMisa(
  lead: CovuaLead
): Promise<{ status: CovuaMisaStatus; httpStatus?: number; reason?: string }> {
  const cfg = getMisaConfig();
  if (!cfg) {
    console.error('[covua-misa] SKIPPED_CONFIG — thiếu env MISA_*');
    return { status: 'skipped', reason: 'SKIPPED_CONFIG' };
  }

  try {
    const res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Origin: cfg.siteOrigin,
        Referer: `${cfg.siteOrigin}/covua`,
      },
      body: buildCovuaMisaBody(cfg, lead).toString(),
      // 302 → RedirectURL chính là tín hiệu lưu thành công — không follow
      redirect: 'manual',
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    });

    const isRedirect = res.status === 0 || (res.status >= 300 && res.status < 400);
    const text = isRedirect ? '' : await res.text().catch(() => '');

    if (classifyMisaResponse(res.status, text)) {
      console.log('[covua-misa] OK', res.status);
      return { status: 'sent', httpStatus: res.status };
    }

    console.error('[covua-misa] FAIL HTTP', res.status, text.slice(0, 300));
    return { status: 'failed', httpStatus: res.status };
  } catch (err) {
    console.error('[covua-misa] Network/timeout:', err);
    return {
      status: 'failed',
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}
