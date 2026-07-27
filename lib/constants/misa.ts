// Dữ liệu danh mục dùng chung client/server (cơ sở, tỉnh/thành, Zalo).
// Cấu hình + credentials MISA CRM đã chuyển về server-only: lib/server/misa.ts
// (đọc từ env MISA_* — không còn nằm trong bundle client).

// Cơ sở — value là giá trị MISA CustomField17 ("1" / "2")
export const BRANCHES = [
  { value: "1", label: "Cơ sở 1 - 211 Nguyễn Hữu Thọ, Đà Nẵng" },
  { value: "2", label: "Cơ sở 2 - 114 Hoàng Diệu, Đà Nẵng" },
] as const;

export const DEFAULT_BRANCH_VALUE = "1";

// Tỉnh/Thành phố — value là MailingProvinceID của MISA
export const PROVINCES = [
  { id: "231", name: "Hà Nội" },
  { id: "863", name: "Hải Phòng" },
  { id: "1102", name: "Hải Dương" },
  { id: "1380", name: "Hưng Yên" },
  { id: "1552", name: "Hà Nam" },
  { id: "1675", name: "Nam Định" },
  { id: "1915", name: "Thái Bình" },
  { id: "2210", name: "Ninh Bình" },
  { id: "2366", name: "Hà Giang" },
  { id: "2577", name: "Cao Bằng" },
  { id: "2788", name: "Lào Cai" },
  { id: "2962", name: "Bắc Kạn" },
  { id: "3093", name: "Lạng Sơn" },
  { id: "3331", name: "Tuyên Quang" },
  { id: "3484", name: "Yên Bái" },
  { id: "3674", name: "Thái Nguyên" },
  { id: "3864", name: "Phú Thọ" },
  { id: "4155", name: "Vĩnh Phúc" },
  { id: "4302", name: "Bắc Giang" },
  { id: "4544", name: "Bắc Ninh" },
  { id: "4679", name: "Quảng Ninh" },
  { id: "4880", name: "Điện Biên" },
  { id: "5002", name: "Lai Châu" },
  { id: "5108", name: "Sơn La" },
  { id: "5326", name: "Hòa Bình" },
  { id: "5557", name: "Thanh Hóa" },
  { id: "6223", name: "Nghệ An" },
  { id: "6723", name: "Hà Tĩnh" },
  { id: "6998", name: "Quảng Bình" },
  { id: "7165", name: "Quảng Trị" },
  { id: "7318", name: "Huế" },
  { id: "7480", name: "Đà Nẵng" },
  { id: "7547", name: "Quảng Nam" },
  { id: "7808", name: "Quảng Ngãi" },
  { id: "8007", name: "Bình Định" },
  { id: "8178", name: "Phú Yên" },
  { id: "8301", name: "Khánh Hòa" },
  { id: "8448", name: "Kon Tum" },
  { id: "8555", name: "Gia Lai" },
  { id: "8793", name: "Đắk Lắk" },
  { id: "8999", name: "Đắk Nông" },
  { id: "9081", name: "Hồ Chí Minh" },
  { id: "9428", name: "Lâm Đồng" },
  { id: "9589", name: "Ninh Thuận" },
  { id: "9668", name: "Bình Phước" },
  { id: "9791", name: "Tây Ninh" },
  { id: "9896", name: "Bình Dương" },
  { id: "9995", name: "Đồng Nai" },
  { id: "10182", name: "Bình Thuận" },
  { id: "10320", name: "Bà Rịa - Vũng Tàu" },
  { id: "10412", name: "Long An" },
  { id: "10617", name: "Đồng Tháp" },
  { id: "10774", name: "An Giang" },
  { id: "10943", name: "Tiền Giang" },
  { id: "11123", name: "Vĩnh Long" },
  { id: "11239", name: "Bến Tre" },
  { id: "11413", name: "Kiên Giang" },
  { id: "11578", name: "Cần Thơ" },
  { id: "11673", name: "Hậu Giang" },
  { id: "11754", name: "Trà Vinh" },
  { id: "11868", name: "Sóc Trăng" },
  { id: "11989", name: "Bạc Liêu" },
  { id: "12061", name: "Cà Mau" },
] as const;

// Đà Nẵng — mặc định (2 cơ sở đều ở Đà Nẵng)
export const DEFAULT_PROVINCE_ID = "7480";

export function branchLabel(value: string): string {
  return BRANCHES.find((b) => b.value === value)?.label ?? value;
}

export function provinceName(id: string): string {
  return PROVINCES.find((p) => p.id === id)?.name ?? id;
}

// ĐÃ XOÁ: ZALO_GROUP_URL (link nhóm Zalo cũ). Trang /thank-you mới không còn
// dùng, và CHECKLIST-SERVER.md mục 6 cấm đặt link nhóm Zalo lên trang cảm ơn —
// giữ hằng số chết chỉ làm tăng rủi ro có người vô tình dùng lại.

// Zalo OA Sata Robo Academy — link DUY NHẤT được phép xuất hiện trên /thank-you
// (nội dung đã Founder duyệt: không thêm link nào khác, kể cả link nhóm Zalo)
export const ZALO_OA_URL = "https://zalo.me/40213330288531842";
