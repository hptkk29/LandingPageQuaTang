import { z } from "zod";
import { BRANCHES, DEFAULT_BRANCH_VALUE, DEFAULT_PROVINCE_ID } from "@/lib/constants/misa";

const VN_PHONE_REGEX = /^(\+84|0)\d{8,10}$/;

const BRANCH_VALUES = BRANCHES.map((b) => b.value) as [string, ...string[]];

export function cleanPhone(phone: string): string {
  return phone.replace(/[\s\-.]/g, "");
}

export const leadSchema = z.object({
  // Họ và tên con — bắt buộc (map MISA: LastName)
  ho_ten_con: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên con")
    .max(100, "Họ tên tối đa 100 ký tự"),

  // Họ tên phụ huynh (map MISA: CustomField25)
  ho_ten_ph: z
    .string()
    .trim()
    .max(100, "Họ tên tối đa 100 ký tự")
    .optional()
    .or(z.literal("")),

  // ĐT di động phụ huynh — bắt buộc (map MISA: CustomField15)
  sdt: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .transform(cleanPhone)
    .refine(
      (val) => VN_PHONE_REGEX.test(val),
      "Số điện thoại không hợp lệ (vd: 0901234567)"
    ),

  // Email phụ huynh — không bắt buộc (map MISA: Email)
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),

  // Trường con đang học (map MISA: CustomField14)
  truong: z
    .string()
    .trim()
    .max(200, "Tên trường tối đa 200 ký tự")
    .optional()
    .or(z.literal("")),

  // Lớp con đang học — text tự do, vd "Lớp 4" (map MISA: CustomField13)
  lop: z
    .string()
    .trim()
    .max(50, "Lớp tối đa 50 ký tự")
    .optional()
    .or(z.literal("")),

  // Chọn cơ sở (map MISA: CustomField17)
  co_so: z.enum(BRANCH_VALUES, { message: "Vui lòng chọn cơ sở" }),

  // Tỉnh/Thành phố (map MISA: MailingProvinceID)
  tinh: z.string().trim().min(1, "Vui lòng chọn tỉnh/thành phố"),

  // Honeypot — schema accepts any value; bot detection in route handler
  website: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const LEAD_DEFAULTS: LeadInput = {
  ho_ten_con: "",
  ho_ten_ph: "",
  sdt: "",
  email: "",
  truong: "",
  lop: "",
  co_so: DEFAULT_BRANCH_VALUE,
  tinh: DEFAULT_PROVINCE_ID,
  website: "",
};
