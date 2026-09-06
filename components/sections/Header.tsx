"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Container } from "@/components/shared/Container";

/** Cùng một nguồn cho nav desktop và menu hamburger — thêm mục là thêm một chỗ. */
const NAV = [
  { href: "#bon-buoi", label: "Buổi trải nghiệm 1-1" },
  { href: "#chuong-trinh", label: "Chương trình" },
  { href: "#vi-sao", label: "Vì sao chọn Sata Robo" },
  { href: "#co-so", label: "Cơ sở" },
  { href: "#cau-hoi", label: "Hỏi đáp" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mở: Esc để đóng, bấm ra ngoài để đóng, giữ Tab trong panel, và trả
  // focus về nút hamburger khi đóng. Không khoá cuộn nền vì panel xổ ngay dưới
  // header dính — cuộn là hành vi thoát hợp lý, nên cuộn thì đóng luôn.
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    const opener = burgerRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>("a[href], button")).filter(
        (el) => el.offsetParent !== null
      );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.contains(t) && !opener?.contains(t)) setMenuOpen(false);
    };
    const onScroll = () => setMenuOpen(false);

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    focusables()[0]?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      opener?.focus();
    };
  }, [menuOpen]);

  function scrollToForm() {
    setMenuOpen(false);
    document.getElementById("dang-ky")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white border-b border-transparent"
      }`}
    >
      <Container size="xl">
        <div className="flex items-center justify-between h-14 md:h-16 gap-2">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Image
              src="/logo-satarobo.png"
              alt="Sata Robo"
              width={644}
              height={380}
              className="h-9 md:h-11 w-auto transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-underline text-sm font-medium text-gray-700 hover:text-brand-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={scrollToForm}
              className="relative min-h-11 bg-cta-500 hover:bg-cta-600 text-white font-display font-bold text-xs md:text-sm px-3 sm:px-4 md:px-6 py-2 md:py-2.5 rounded-button shadow-md hover:shadow-cta transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              🎁 Nhận suất 1-1<span className="hidden sm:inline"> miễn phí</span>
            </button>

            {/* Dưới 1024px nav bị ẩn mà trước đây không có gì thay thế — cả
                điện thoại lẫn tablet đều không tới được 5 mục neo. */}
            <button
              type="button"
              ref={burgerRef}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              className="lg:hidden grid place-items-center w-11 h-11 shrink-0 rounded-button text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="relative block w-5 h-4" aria-hidden>
                <span
                  className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                    menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                    menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {/* Panel xổ xuống ngay dưới header dính. Nằm TRONG <header> nên thừa
          hưởng z-40, không tạo thêm lớp nổi mới để phải xếp chồng. */}
      <div
        id={menuId}
        ref={panelRef}
        hidden={!menuOpen}
        className="lg:hidden border-t border-gray-100 bg-white shadow-lg"
      >
        <Container size="xl">
          <nav className="flex flex-col py-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center border-b border-gray-100 py-2 text-[15px] font-medium text-gray-700 transition-colors last:border-b-0 hover:text-brand-600"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}
