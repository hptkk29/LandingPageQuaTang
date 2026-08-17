import { z } from 'zod';
import { covuaContent, isWinner } from '@/content/covua';

const E = covuaContent.errors;

/* ------------------------------------------------------------------ */
/* Chuẩn hóa                                                           */
/* ------------------------------------------------------------------ */

/** '+84 905.123.456' -> '0905123456' */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[\s.\-()]/g, '');
  if (digits.startsWith('+84')) return '0' + digits.slice(3);
  if (digits.startsWith('84') && digits.length === 11) return '0' + digits.slice(2);
  return digits;
}

/** '  nguyễn   văn an ' -> 'Nguyễn Văn An' */
export function normalizeName(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => (w ? w[0].toLocaleUpperCase('vi-VN') + w.slice(1) : w))
    .join(' ');
}

const PHONE_RE = /^0(3|5|7|8|9)\d{8}$/;

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

export const covuaLeadSchema = z
  .object({
    studentName: z
      .string()
      .trim()
      .min(2, E.studentNameRequired)
      .max(80, E.studentNameRequired)
      .refine((v) => v.trim().includes(' '), E.studentNameFullName)
      .transform(normalizeName),

    parentName: z
      .string()
      .trim()
      .min(2, E.parentNameRequired)
      .max(80, E.parentNameRequired)
      .transform(normalizeName),

    parentPhone: z
      .string()
      .trim()
      .min(1, E.phoneInvalid)
      .transform(normalizePhone)
      .refine((v) => PHONE_RE.test(v), E.phoneInvalid),

    parentEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email(E.emailInvalid)
      .optional()
      .or(z.literal('')),

    province: z.string().trim().min(1, 'Chọn tỉnh/thành phố.'),

    // 17/08: rút gọn form theo yêu cầu — address/category/registrationNumber/
    // techInterest không còn hiện trên UI, giữ trong schema (optional) để
    // payload cũ/tương lai không gãy.
    address: z.string().trim().max(200).optional().or(z.literal('')),

    achievement: z.enum(['NHAT', 'NHI', 'BA', 'KHUYEN_KHICH', 'THAM_GIA'], {
      message: E.achievementRequired,
    }),

    category: z.string().trim().max(80).optional().or(z.literal('')),
    registrationNumber: z.string().trim().max(30).optional().or(z.literal('')),

    techInterest: z.enum(['CO', 'CHUA']).optional(),

    studyMode: z.enum(['BOTH', 'ONLINE_ONLY']),

    campus: z.enum(['CS1', 'CS2']).nullable().optional(),

    // Checkbox đồng ý đã bỏ khỏi UI (17/08) — thay bằng dòng cam kết bảo mật
    // dưới nút gửi; client luôn gửi true qua defaults.
    consent: z.literal(true, { message: E.consentRequired }),

    // ẩn
    ref: z.string().trim().max(50).optional().or(z.literal('')),
    utmSource: z.string().trim().max(80).optional().or(z.literal('')),
    utmMedium: z.string().trim().max(80).optional().or(z.literal('')),
    utmCampaign: z.string().trim().max(80).optional().or(z.literal('')),
  })
  /**
   * Nhóm B luôn là ONLINE_ONLY + campus null.
   * Đây là chốt chặn cuối: UI đã reset khi đổi thành tích, nhưng nếu người dùng
   * bấm nhanh hoặc payload bị sửa tay thì vẫn không lọt cơ sở rác vào MISA.
   */
  .transform((data) => {
    if (!isWinner(data.achievement)) {
      return { ...data, studyMode: 'ONLINE_ONLY' as const, campus: null };
    }
    if (data.studyMode === 'ONLINE_ONLY') {
      return { ...data, campus: null };
    }
    return data;
  })
  .superRefine((data, ctx) => {
    if (data.studyMode === 'BOTH' && !data.campus) {
      ctx.addIssue({
        code: 'custom',
        path: ['campus'],
        message: E.campusRequired,
      });
    }
  });

export type CovuaLeadInput = z.input<typeof covuaLeadSchema>;
export type CovuaLead = z.output<typeof covuaLeadSchema>;

export const covuaFormDefaults: CovuaLeadInput = {
  studentName: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  province: 'Đà Nẵng',
  address: '',
  achievement: undefined as never, // buộc người dùng chọn
  category: '',
  registrationNumber: '',
  techInterest: undefined,
  studyMode: 'BOTH',
  campus: null,
  consent: true, // đồng ý ngầm định qua dòng bảo mật dưới nút gửi

  ref: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
};
