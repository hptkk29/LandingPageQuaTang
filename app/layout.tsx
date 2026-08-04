import "./globals.css";
import "./v2.css";

import type { Metadata } from "next";
import { Baloo_2, Be_Vietnam_Pro, Inter } from "next/font/google";
import { Toaster } from "sonner";

import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

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

const baloo = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-baloo",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quatang.edu.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "🎁 Tặng 29 Suất Trải Nghiệm RoboSim 1-1 Cùng Chuyên Gia — Sata Robo Đà Nẵng",
    template: "%s | Sata Robo",
  },
  description:
    "Tặng 29 suất trải nghiệm Robotics MIỄN PHÍ 1-1 cùng chuyên gia cho học sinh lớp 1-8: một chuyên gia kèm riêng một bạn 90 phút trên phần mềm RoboSim, cuối buổi ba mẹ nhận phiếu đánh giá năng lực của con. Lịch linh hoạt cuối tuần & các buổi tối tại 211 Nguyễn Hữu Thọ và 114 Hoàng Diệu, Đà Nẵng.",
  keywords: [
    "Robotics trẻ em Đà Nẵng",
    "RoboSim",
    "STEM tiểu học",
    "Sata Robo",
    "học robot miễn phí",
    "trải nghiệm robotics 1 kèm 1",
    "Sáng tạo Robotics 2026",
    "lớp robot lớp 1-8",
    "học robot Đà Nẵng",
  ],
  authors: [{ name: "Sata Robo" }],
  creator: "Sata Robo",
  publisher: "Sata Robo",
  openGraph: {
    title: "🎁 Tặng 29 Suất Trải Nghiệm RoboSim 1-1 Cùng Chuyên Gia — Sata Robo Đà Nẵng",
    description:
      "29 suất trải nghiệm Robotics MIỄN PHÍ 1-1 cùng chuyên gia — một thầy kèm riêng một bạn 90 phút. Lịch linh hoạt cuối tuần & các buổi tối tại Đà Nẵng.",
    url: SITE_URL,
    siteName: "Sata Robo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tặng 29 suất trải nghiệm RoboSim 1-1 cùng chuyên gia — Sata Robo Đà Nẵng",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🎁 Tặng 29 Suất Trải Nghiệm RoboSim 1-1 — Sata Robo",
    description: "29 suất trải nghiệm MIỄN PHÍ 1-1 cùng chuyên gia cho con lớp 1-8.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${beVietnamPro.variable} ${baloo.variable}`}
    >
      <body className="font-body antialiased bg-white text-gray-900">
        {children}
        <Toaster position="top-center" richColors />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
