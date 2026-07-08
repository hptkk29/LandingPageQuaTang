import { MISA } from "@/lib/constants/misa";
import type { LeadInput } from "@/lib/schemas/lead";

// Dựng body dạng application/x-www-form-urlencoded đúng tên field MISA
export function buildMisaBody(data: LeadInput): URLSearchParams {
  const p = new URLSearchParams();
  // Field ẩn (auth + cấu hình form)
  p.set("ID", MISA.id);
  p.set("Companycode", MISA.companyCode);
  p.set("AllowURL", MISA.allowUrl);
  p.set("FormKey", MISA.formKey);
  p.set("RedirectURL", MISA.redirectUrl);

  // Dữ liệu người dùng
  p.set(MISA.fields.hoTenCon, data.ho_ten_con);
  if (data.ho_ten_ph) p.set(MISA.fields.hoTenPhuHuynh, data.ho_ten_ph);
  if (data.sdt) p.set(MISA.fields.sdtPhuHuynh, data.sdt);
  if (data.email) p.set(MISA.fields.email, data.email);
  if (data.truong) p.set(MISA.fields.truong, data.truong);
  if (data.lop) p.set(MISA.fields.lop, data.lop);
  p.set(MISA.fields.coSo, data.co_so);
  p.set(MISA.fields.tinh, data.tinh);

  return p;
}

/**
 * Gửi lead trực tiếp từ trình duyệt sang MISA CRM.
 *
 * Dùng `mode: "no-cors"` — về phía MISA, request giống hệt khi submit form
 * MISA nhúng gốc (cùng Origin quatang.edu.vn, cùng body form-urlencoded), nên
 * lead vào CRM ổn định. Đổi lại, JS không đọc được response (opaque) → coi như
 * thành công nếu request được gửi đi. `keepalive` đảm bảo request không bị huỷ
 * khi ta điều hướng sang trang cảm ơn ngay sau đó.
 *
 * Trả về false chỉ khi lỗi mạng (không gửi được).
 */
export async function submitToMisa(data: LeadInput): Promise<boolean> {
  try {
    await fetch(MISA.endpoint, {
      method: "POST",
      mode: "no-cors",
      // Không set header Content-Type thủ công: truyền URLSearchParams thì trình
      // duyệt tự đặt application/x-www-form-urlencoded;charset=UTF-8 (hợp lệ với no-cors).
      body: buildMisaBody(data),
      keepalive: true,
    });
    return true;
  } catch (err) {
    console.error("[submitToMisa] Network error:", err);
    return false;
  }
}
