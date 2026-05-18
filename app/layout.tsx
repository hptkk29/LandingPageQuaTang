import type { Metadata } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-body",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://quatang.edu.vn"
  ),
  title: {
    default: "🎁 Tặng 5 Buổi RoboSim MIỄN PHÍ — Sata Robo",
    template: "%s | Sata Robo",
  },
  description:
    "Tặng phụ huynh 5 buổi đào tạo Robotics cơ bản trên phần mềm RoboSim cho học sinh lớp 1-8. 12 suất miễn phí mỗi cơ sở. Khai giảng 23/5 & 25/5 tại Đà Nẵng.",
  keywords: [
    "Robotics trẻ em",
    "RoboSim",
    "STEM tiểu học",
    "Sata Robo Đà Nẵng",
    "học robot miễn phí",
    "Sáng tạo Robotics 2026",
  ],
  authors: [{ name: "Sata Robo" }],
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    title: "🎁 Tặng 5 Buổi RoboSim MIỄN PHÍ — Sata Robo",
    description:
      "5 buổi học Robotics đại cương miễn phí cho con — chỉ 12 suất/cơ sở.",
    type: "website",
    locale: "vi_VN",
    siteName: "Sata Robo",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`}>
      <body className="font-body antialiased bg-white text-gray-900">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
