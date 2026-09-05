"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/shared/Container";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToForm() {
    document.getElementById("dang-ky")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-transparent"
      }`}
    >
      <Container size="xl">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-satarobo.jpg"
              alt="Sata Robo"
              width={140}
              height={40}
              className="h-9 md:h-11 w-auto transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            <a
              href="#bon-buoi"
              className="link-underline text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              Buổi trải nghiệm 1-1
            </a>
            <a
              href="#chuong-trinh"
              className="link-underline text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              Chương trình
            </a>
            <a
              href="#vi-sao"
              className="link-underline text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              Vì sao chọn Sata Robo
            </a>
            <a
              href="#cau-hoi"
              className="link-underline text-sm font-medium text-gray-700 hover:text-brand-600"
            >
              Hỏi đáp
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToForm}
            className="relative min-h-11 bg-cta-500 hover:bg-cta-600 text-white font-display font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-button shadow-md hover:shadow-cta transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            🎁 Nhận suất 1-1<span className="hidden sm:inline"> miễn phí</span>
          </button>
        </div>
      </Container>
    </header>
  );
}
