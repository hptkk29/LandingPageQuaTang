import type { Metadata, Viewport } from "next";

// CSS chỉ import ở route này → không rò rỉ sang landing page
import "./thank-you.css";
import { ThankYouView } from "./ThankYouView";

/* Bản mẫu (yeucau-thankyou/index.html, <head> dòng 4..14) CHỈ có: charset,
   viewport(viewport-fit=cover), CSP, referrer, robots=noindex/nofollow,
   format-detection và <title>. KHÔNG có canonical / description / og / twitter.
   Root layout lại khai báo đầy đủ metadata marketing của landing page và Next.js
   merge NÔNG → phải gán `null` cho từng khoá để gỡ phần kế thừa.
   Ràng buộc: CHECKLIST-SERVER.md mục 6 — không thêm link nào khác, không đưa
   địa chỉ/hotline/tên công ty đầy đủ vào trang (description của root layout có
   kèm địa chỉ 2 cơ sở). */
export const metadata: Metadata = {
  // `absolute` để không bị template "%s | Sata Robo" của root layout nối thêm
  title: { absolute: "Đăng ký thành công — Nhận quà từ Sata Robo" },
  // Trang đích riêng tư sau form → không cho Google index (checklist mục 2)
  robots: { index: false, follow: false },

  // ── Gỡ metadata kế thừa từ app/layout.tsx ──
  // canonical trỏ về trang chủ chiến dịch: vừa là "link khác" (mục 6), vừa mâu
  // thuẫn với noindex (Google có thể lan noindex sang trang đích canonical).
  alternates: { canonical: null },
  // description của landing page chứa địa chỉ 211 Nguyễn Hữu Thọ / 114 Hoàng Diệu
  description: null,
  keywords: null,
  authors: null,
  creator: null,
  publisher: null,
  // Trang cảm ơn là trang riêng tư sau form — không mang theo thẻ quảng bá
  openGraph: null,
  twitter: null,

  // Bản mẫu dòng 12 — chặn iOS Safari tự biến "3.000", "6–13", "100%" thành link tel:
  other: { "format-detection": "telephone=no" },
};

/* Bản mẫu dòng 5: viewport-fit=cover — điều kiện để env(safe-area-inset-bottom)
   của thanh CTA dính đáy (thank-you.css) khác 0 trên iPhone có home-indicator.
   Chỉ áp dụng cho route /thank-you, không đụng landing page. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function ThankYouPage() {
  return <ThankYouView />;
}
