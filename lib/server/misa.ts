import "server-only";

import type { LeadInput } from "@/lib/schemas/lead";

// Cấu hình MISA AMIS CRM (Web-to-lead) — đọc từ env, CHỈ dùng phía server.
// FormKey/ID/Companycode không còn xuất hiện trong bundle client (P0-01).
// Thiếu env → getMisaConfig() trả null, /api/lead ghi SKIPPED_CONFIG và vẫn
// nhận lead qua kênh Google Sheet — không bao giờ chặn đăng ký (KT-03).

type MisaConfig = {
  endpoint: string;
  formId: string;
  companyCode: string;
  formKey: string;
  allowUrl: string;
  redirectUrl: string;
  siteOrigin: string;
};

// Ánh xạ field của form → tên field kỹ thuật trên MISA CRM (form quà tặng)
const MISA_FIELDS = {
  hoTenCon: "LastName", // bắt buộc theo cấu hình MISA
  hoTenPhuHuynh: "CustomField25",
  sdtPhuHuynh: "CustomField15",
  email: "Email",
  truong: "CustomField14",
  lop: "CustomField13",
  coSo: "CustomField17",
  tinh: "MailingProvinceID",
} as const;

export function getMisaConfig(): MisaConfig | null {
  const formId = process.env.MISA_FORM_ID;
  const companyCode = process.env.MISA_COMPANY_CODE;
  const formKey = process.env.MISA_FORM_KEY;
  if (!formId || !companyCode || !formKey) return null;

  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://quatang.edu.vn";
  return {
    endpoint:
      process.env.MISA_ENDPOINT ??
      "https://amisapp.misa.vn/crm/gc/api/open/WebForm/savecollection",
    formId,
    companyCode,
    formKey,
    // Default '*' đồng bộ với cấu hình form MISA HIỆN TẠI (mã nhúng gốc gửi '*').
    // Siết về đúng origin ở P0-02: đổi cấu hình trên MISA admin + env cùng lúc.
    allowUrl: process.env.MISA_ALLOW_URL ?? "*",
    redirectUrl: process.env.MISA_REDIRECT_URL ?? `${siteOrigin}/thank-you`,
    siteOrigin,
  };
}

// Thông tin người giới thiệu (affiliate) — gắn vào body MISA khi
// MISA_AFF_FIELD_NAME đã được cấu hình (form quà tặng phải có sẵn field này).
export type MisaAffData = {
  employeeCode: string;
};

export type MisaSubmitResult =
  | { status: "OK"; httpStatus: number; bodySnippet: string }
  | { status: "FAIL"; httpStatus?: number; bodySnippet?: string; error?: string }
  | { status: "SKIPPED_CONFIG" };

export function buildMisaBody(
  cfg: MisaConfig,
  data: LeadInput,
  aff?: MisaAffData
): URLSearchParams {
  const p = new URLSearchParams();
  // Field ẩn (auth + cấu hình form)
  p.set("ID", cfg.formId);
  p.set("Companycode", cfg.companyCode);
  p.set("AllowURL", cfg.allowUrl);
  p.set("FormKey", cfg.formKey);
  p.set("RedirectURL", cfg.redirectUrl);

  // Dữ liệu người dùng
  p.set(MISA_FIELDS.hoTenCon, data.ho_ten_con);
  if (data.ho_ten_ph) p.set(MISA_FIELDS.hoTenPhuHuynh, data.ho_ten_ph);
  if (data.sdt) p.set(MISA_FIELDS.sdtPhuHuynh, data.sdt);
  if (data.email) p.set(MISA_FIELDS.email, data.email);
  if (data.truong) p.set(MISA_FIELDS.truong, data.truong);
  if (data.lop) p.set(MISA_FIELDS.lop, data.lop);
  p.set(MISA_FIELDS.coSo, data.co_so);
  p.set(MISA_FIELDS.tinh, data.tinh);

  // Người giới thiệu — chỉ gửi khi có mã thật VÀ form MISA đã có field
  // (FR-B08: không có mã → omit hoàn toàn, không bao giờ gửi giá trị giả)
  const affFieldName = process.env.MISA_AFF_FIELD_NAME;
  if (aff?.employeeCode && affFieldName) {
    p.set(affFieldName, aff.employeeCode);
    const leadSourceId = process.env.MISA_AFF_LEAD_SOURCE_ID;
    if (leadSourceId) p.set("LeadSourceID", leadSourceId);
  }

  return p;
}

/**
 * Phân loại response savecollection. Format chưa có tài liệu chính thức →
 * ưu tiên đọc marker tường minh trong JSON; heuristic keyword chỉ là fallback
 * và tránh các bẫy đã biết ("error":null, "invalidFields":[] là body THÀNH CÔNG
 * theo convention phổ biến). Body luôn được log để tinh chỉnh sau lead test
 * đầu tiên (bước bắt buộc trong runbook Pha 0).
 */
export function classifyMisaResponse(httpOk: boolean, text: string): boolean {
  if (!httpOk) return false;
  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      const o = parsed as Record<string, unknown>;
      if (o.success === true || o.Success === true) return true;
      if (o.success === false || o.Success === false) return false;
      if (typeof o.code === "number" && o.code >= 400) return false;
      if (o.error != null || o.Error != null) return false;
      return true; // JSON object không có marker lỗi nào
    }
  } catch {
    // không phải JSON (có thể là HTML trang cảm ơn sau redirect) — fallback
  }
  return !/"error"\s*:\s*(?!null)|exception|unauthoriz|denied/i.test(text);
}

/**
 * Gửi lead sang MISA CRM từ phía server (P0-03).
 *
 * Khác bản client cũ (`mode: "no-cors"` — response opaque, mất lead âm thầm):
 * server đọc được status + body thật, log đầy đủ để phát hiện thất bại.
 * Header Origin/Referer đặt sẵn theo site để cấu hình AllowURL siết về đúng
 * tên miền (P0-02) không làm gãy request server-to-server.
 */
export async function submitToMisaServer(
  data: LeadInput,
  aff?: MisaAffData
): Promise<MisaSubmitResult> {
  const cfg = getMisaConfig();
  if (!cfg) {
    console.error(
      "[MISA-FAIL] SKIPPED_CONFIG — thiếu env MISA_FORM_ID/MISA_COMPANY_CODE/MISA_FORM_KEY"
    );
    return { status: "SKIPPED_CONFIG" };
  }

  try {
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Origin: cfg.siteOrigin,
        Referer: `${cfg.siteOrigin}/`,
      },
      body: buildMisaBody(cfg, data, aff).toString(),
      // 6s: đủ cho API bình thường, không bắt khách chờ quá lâu khi MISA treo
      // (lead vẫn an toàn ở kênh Sheet — KT-03)
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    const bodySnippet = text.slice(0, 500);

    if (classifyMisaResponse(res.ok, text)) {
      console.log("[misa] OK", res.status, bodySnippet);
      return { status: "OK", httpStatus: res.status, bodySnippet };
    }

    console.error("[MISA-FAIL] HTTP", res.status, bodySnippet);
    return { status: "FAIL", httpStatus: res.status, bodySnippet };
  } catch (err) {
    console.error("[MISA-FAIL] Network/timeout:", err);
    return { status: "FAIL", error: err instanceof Error ? err.message : String(err) };
  }
}
