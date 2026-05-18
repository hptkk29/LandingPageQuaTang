import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://quatang.edu.vn"),
  title: {
    default: "🎁 Tặng 5 Buổi Học RoboSim MIỄN PHÍ — Sata Robo",
    template: "%s | Sata Robo",
  },
  description:
    "Tặng phụ huynh 5 buổi đào tạo Robotics cơ bản trên phần mềm RoboSim — dành cho học sinh lớp 1-8. Đăng ký nhận quà ngay tại 2 cơ sở Sata Robo Đà Nẵng.",
  keywords: [
    "Robotics trẻ em",
    "RoboSim",
    "STEM tiểu học",
    "lập trình robot lớp 1-8",
    "Sata Robo Đà Nẵng",
    "học robot miễn phí",
  ],
  authors: [{ name: "Sata Robo" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "🎁 Tặng 5 Buổi Học RoboSim MIỄN PHÍ",
    description:
      "5 buổi học Robotics đại cương miễn phí cho con — đăng ký nhận quà ngay.",
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
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
