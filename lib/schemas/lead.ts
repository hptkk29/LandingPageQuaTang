import { z } from "zod";

const VN_PHONE_REGEX = /^(\+84|0)\d{8,10}$/;

export const LOP_OPTIONS = [
  "Lớp 1",
  "Lớp 2",
  "Lớp 3",
  "Lớp 4",
  "Lớp 5",
  "Lớp 6",
  "Lớp 7",
  "Lớp 8",
] as const;

export const CO_SO_OPTIONS = [
  "211 Nguyễn Hữu Thọ",
  "114 Hoàng Diệu",
] as const;

export function cleanPhone(phone: string): string {
  return phone.replace(/[\s\-.]/g, "");
}

export const leadSchema = z.object({
  ho_ten: z
    .string()
    .trim()
    .min(2, "Họ tên cần ít nhất 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự"),

  sdt: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .transform(cleanPhone)
    .refine(
      (val) => VN_PHONE_REGEX.test(val),
      "Số điện thoại không hợp lệ (vd: 0901234567)"
    ),

  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),

  lop: z.enum(LOP_OPTIONS, { message: "Vui lòng chọn lớp" }),

  truong: z
    .string()
    .trim()
    .max(200, "Tên trường tối đa 200 ký tự")
    .optional()
    .or(z.literal("")),

  co_so: z.enum(CO_SO_OPTIONS, { message: "Vui lòng chọn cơ sở" }),

  // Honeypot — schema accepts any value; bot detection in route handler
  website: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const appsScriptPayloadSchema = leadSchema
  .omit({ website: true })
  .extend({
    secret: z.string().min(1),
    source: z.string().default("quatang.edu.vn"),
    ip: z.string().optional(),
    user_agent: z.string().optional(),
  });

export type AppsScriptPayload = z.infer<typeof appsScriptPayloadSchema>;
