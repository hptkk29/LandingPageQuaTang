import { COVUA_PROGRAM_CODE, getAchievementGroup } from '@/content/covua';
import type { CovuaLead } from './covua-form-schema';

/**
 * Mapping lead cờ vua → dòng Google Sheet.
 *
 * Bản gốc trong gói bàn giao có thêm mapping MISA WebForm (buildMisaFields /
 * buildMisaDescription). Đã BỎ theo quyết định 16/08/2026: trang covua không
 * đẩy MISA — lead chỉ đi 2 đường Google Sheet + satarobo.vn, đều nằm trong
 * route handler /api/lead-covua. Cột misaStatus của Sheet bỏ theo.
 */

/* ------------------------------------------------------------------ */
/* Google Sheet (bản gốc đối soát) — giữ trường thô, mỗi trường một cột */
/* ------------------------------------------------------------------ */

export function buildSheetRow(lead: CovuaLead, meta: {
  userAgent?: string;
}) {
  return {
    timestamp: new Date().toISOString(),
    programCode: COVUA_PROGRAM_CODE,
    studentName: lead.studentName,
    parentName: lead.parentName,
    parentPhone: lead.parentPhone,
    parentEmail: lead.parentEmail || '',
    province: lead.province,
    address: lead.address ?? '',
    achievement: lead.achievement,
    achievementGroup: getAchievementGroup(lead.achievement) ?? '',
    category: lead.category || '',
    registrationNumber: lead.registrationNumber || '',
    techInterest: lead.techInterest ?? '',
    studyMode: lead.studyMode,
    campus: lead.campus ?? '',
    ref: lead.ref || '',
    utmSource: lead.utmSource || '',
    utmMedium: lead.utmMedium || '',
    utmCampaign: lead.utmCampaign || '',
    userAgent: meta.userAgent ?? '',
  };
}
