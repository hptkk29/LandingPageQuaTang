"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/Container";

export function Header() {
  function scrollToForm() {
    const form = document.getElementById("dang-ky");
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-100/50 shadow-sm">
      <Container size="xl">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-satarobo.jpg"
              alt="Sata Robo"
              width={140}
              height={40}
              className="h-9 md:h-11 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#chuong-trinh"
              className="text-sm font-medium text-gray-700 hover:text-brand-800 transition"
            >
              Chương trình
            </a>
            <a
              href="#vi-sao"
              className="text-sm font-medium text-gray-700 hover:text-brand-800 transition"
            >
              Vì sao chọn Sata Robo
            </a>
            <a
              href="#cau-hoi"
              className="text-sm font-medium text-gray-700 hover:text-brand-800 transition"
            >
              Hỏi đáp
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToForm}
            className="bg-urgency-600 hover:bg-urgency-700 text-white font-display font-bold text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-button shadow-md transition cursor-pointer"
          >
            🎁 Đăng ký ngay
          </button>
        </div>
      </Container>
    </header>
  );
}
