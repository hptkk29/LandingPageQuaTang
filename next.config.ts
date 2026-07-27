import type { NextConfig } from "next";

// Security headers — theo CHECKLIST-SERVER.md mục 2 (bảo mật trọn chuỗi).
// LƯU Ý: bản mẫu tĩnh có thêm CSP `default-src 'none'` dạng meta. Ở đây KHÔNG gửi
// CSP vì Next.js phát sinh inline script/style của framework (bootstrap, hydration,
// next/font, next/image) — CSP chặt của bản tĩnh sẽ làm vỡ trang. Nếu sau này cần
// CSP, phải làm theo cách của Next (nonce sinh trong middleware), không copy nguyên
// chuỗi CSP của file tĩnh.
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // HSTS + chống MIME sniffing + rò rỉ referrer + chống clickjacking cho toàn site.
        // X-Frame-Options phải áp cho MỌI trang chứ không riêng /thank-you: trang "/" mới là
        // nơi có form thu tên trẻ + SĐT phụ huynh (Hero, MidCTA, ExitIntent), nếu bị nhúng
        // iframe thì kẻ tấn công clickjack đúng vào form đó. Site không nhúng iframe ở đâu và
        // không có bên nào nhúng lại site này, nên DENY toàn bộ là an toàn.
        // (Header này chỉ gửi được từ server — meta tag không làm được.)
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
