"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CAMPAIGN } from "@/lib/constants/campaign";
import { ZALO_GROUP_URL } from "@/lib/constants/misa";

const SECONDS = 10;
// spring-like bezier (soft-skill approved); mutable tuple for framer-motion's Easing type
const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

function ZaloIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
      <path d="M12 3C6.9 3 3 6.6 3 11c0 2.5 1.3 4.7 3.4 6.1-.1.9-.5 2.1-1.2 3.1-.2.3 0 .7.4.6 1.9-.4 3.3-1 4.2-1.6 1 .3 2.1.4 3.2.4 5.1 0 9-3.6 9-8S17.1 3 12 3Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function ThankYouView() {
  const [left, setLeft] = useState(SECONDS);
  const reduce = useReducedMotion();

  useEffect(() => {
    const started = Date.now();
    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setLeft(Math.max(0, SECONDS - elapsed));
    }, 250);
    const go = setTimeout(() => {
      window.location.href = ZALO_GROUP_URL;
    }, SECONDS * 1000);
    return () => {
      clearInterval(tick);
      clearTimeout(go);
    };
  }, []);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE },
        },
      };

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-orange-50 px-4 py-3">
      {/* Ambient orbs — chiều sâu, không chặn tương tác */}
      <div aria-hidden className="animate-blob pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-cta-300/30 blur-3xl" />
      <div aria-hidden className="animate-blob-delayed pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-accent-300/25 blur-3xl" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full min-w-0 max-w-md sm:max-w-3xl"
      >
        {/* Double-bezel: vỏ ngoài + lõi trong */}
        <div className="rounded-[1.8rem] border border-white/60 bg-white/70 p-1.5 shadow-card ring-1 ring-black/5 backdrop-blur-xl">
          <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] sm:p-6 [@media(max-height:440px)]:p-3.5">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] sm:items-center sm:gap-6 [@media(max-height:440px)]:gap-3">
              {/* ===== LEFT: xác nhận + thông điệp ===== */}
              <div className="min-w-0 text-center sm:text-left">
                <motion.div
                  variants={item}
                  className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-success-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                  Đăng ký thành công
                </motion.div>

                <motion.h1
                  variants={item}
                  className="text-gradient-warm font-display text-[1.7rem] font-extrabold leading-[1.05] sm:text-[2.5rem] [@media(max-height:440px)]:text-2xl"
                >
                  Cảm ơn ba mẹ!
                </motion.h1>

                <motion.p
                  variants={item}
                  className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-stone-500 sm:mx-0 [@media(max-height:440px)]:hidden"
                >
                  Sata Robo đã nhận được đăng ký. Đội ngũ tư vấn sẽ liên hệ ba mẹ
                  sớm nhất để xếp lịch học thử.
                </motion.p>

                <motion.div
                  variants={item}
                  className="relative mt-3 rounded-2xl border border-brand-100 bg-brand-50/60 px-3.5 py-2.5 text-left"
                >
                  <span className="absolute left-2 top-0 select-none font-display text-2xl leading-none text-brand-300">
                    “
                  </span>
                  <p className="pl-3.5 text-[12.5px] font-semibold leading-snug text-brand-800">
                    Hãy giúp con phát triển tư duy công nghệ để chuẩn bị hành
                    trang hội nhập trong kỷ nguyên số &amp; AI.
                  </p>
                </motion.div>
              </div>

              {/* ===== RIGHT: Zalo CTA + hotline ===== */}
              <div className="min-w-0 space-y-2.5 [@media(max-height:440px)]:space-y-2">
                <motion.div
                  variants={item}
                  className="overflow-hidden rounded-2xl border border-[#CFE3FF] bg-[#EAF3FF] p-3.5 [@media(max-height:440px)]:p-3"
                >
                  <div className="flex items-center gap-2 text-[#0068FF]">
                    <ZaloIcon />
                    <span className="text-[13px] font-bold">Nhóm Zalo phụ huynh</span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600">
                    Nhận thêm thông tin tư vấn về các khoá học của SataRobo tại
                    nhóm Zalo sau{" "}
                    <strong className="tabular-nums text-[#0068FF]">{left}s</strong>
                  </p>

                  <a
                    href={ZALO_GROUP_URL}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0068FF] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_16px_-4px_rgba(0,104,255,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Vào nhóm Zalo ngay
                    <span aria-hidden>→</span>
                  </a>

                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#CFE3FF]">
                    <motion.div
                      className="h-full origin-left rounded-full bg-[#0068FF]"
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: SECONDS, ease: "linear" }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={item}
                  className="rounded-2xl border border-surface-200 bg-surface-50 p-3"
                >
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-stone-500">
                    <PhoneIcon />
                    Hỗ trợ nhanh
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CAMPAIGN.locations.map((loc) => (
                      <a
                        key={loc.key}
                        href={`tel:${loc.phoneDigits}`}
                        className="min-w-0 rounded-xl bg-white px-2.5 py-1.5 shadow-soft transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                      >
                        <div className="truncate text-[10px] text-stone-400">
                          {loc.name} · {loc.address}
                        </div>
                        <div className="text-[13px] font-bold text-brand-600">
                          {loc.phone}
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ===== Footer ===== */}
            <motion.div
              variants={item}
              className="mt-3.5 flex flex-col items-center justify-between gap-1 border-t border-surface-100 pt-2.5 text-center sm:flex-row sm:text-left [@media(max-height:440px)]:mt-2.5 [@media(max-height:440px)]:pt-2"
            >
              <p className="text-[10px] leading-tight text-stone-400">
                Công Ty CP Công Nghệ Giáo Dục Sata Robo · 258 Lê Thanh Nghị, Đà
                Nẵng
              </p>
              <Link
                href="/"
                className="link-underline shrink-0 text-[11px] font-semibold text-brand-600"
              >
                ← Về trang chủ
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
