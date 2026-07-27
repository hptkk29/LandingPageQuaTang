import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quatang.edu.vn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // CỐ Ý không chặn /r/ ở đây: đó là link CTV dán vào Zalo/Facebook, chặn
        // robots là mất ảnh + tiêu đề preview, tức là bóp chính kênh phân phối.
        // Việc crawler đốt quota Apps Script được xử lý đúng chỗ hơn ở
        // app/r/[code]/route.ts — bỏ qua logClick cho bot, vẫn redirect bình thường.
        disallow: ["/api/", "/thank-you"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
