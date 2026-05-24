"use client";

import { motion } from "framer-motion";
import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/shared/Container";
import { Countdown } from "@/components/shared/Countdown";
import { CAMPAIGN } from "@/lib/constants/campaign";
import {
  formatVNSaturdayLabel,
  getNextSaturday,
  getNextSaturdayEnd,
} from "@/lib/utils/schedule";

export function Hero() {
  const totalSlots =
    CAMPAIGN.totalSlotsPerLocation * CAMPAIGN.locations.length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-50 via-white to-surface-50 pt-8 md:pt-12 pb-16 md:pb-24">
      {/* === DECORATIVE BACKGROUND === */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
      />
      <div
        aria-hidden="true"
        className="absolute top-20 right-0 w-[400px] h-[400px] bg-cta-200/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob-delayed"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-accent-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob-slow"
      />

      {/* Sparkles */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {[
          { top: "10%", left: "5%", delay: "0s", size: 8 },
          { top: "25%", left: "92%", delay: "1s", size: 6 },
          { top: "60%", left: "8%", delay: "2s", size: 10 },
          { top: "75%", left: "85%", delay: "0.5s", size: 7 },
          { top: "40%", left: "50%", delay: "1.5s", size: 5 },
          { top: "15%", left: "70%", delay: "2.5s", size: 9 },
        ].map((s, i) => (
          <svg
            key={i}
            className="absolute animate-sparkle"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              className={i % 2 === 0 ? "text-cta-400" : "text-brand-400"}
            />
          </svg>
        ))}
      </div>

      <Container size="xl" className="relative">
        {/* === TOP RIBBON === */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white border-2 border-cta-200 rounded-pill px-5 md:px-8 py-2.5 md:py-3 shadow-soft">
            <span
              className="text-xl md:text-2xl animate-bounce-in"
              style={{ animationDelay: "0.3s" }}
            >
              🎁
            </span>
            <h1 className="font-display text-sm md:text-lg lg:text-xl font-bold text-gray-900">
              Đăng ký tham gia trải nghiệm sáng tạo công nghệ
            </h1>
          </div>
        </motion.div>

        {/* === MAIN 2-COLUMN === */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-start">
          {/* === LEFT === */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* Star burst */}
            <div className="absolute -top-4 right-0 md:-right-4 lg:right-8 z-10 animate-star">
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full filter drop-shadow-lg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="50,2 58,28 88,18 70,42 96,52 70,62 88,86 58,76 50,98 42,76 12,86 30,62 4,52 30,42 12,18 42,28"
                    fill="url(#starGrad)"
                    stroke="#D97706"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="relative font-display font-extrabold text-center text-amber-900 text-[9px] md:text-[10px] leading-tight px-2">
                  DÀNH CHO
                  <br />
                  HỌC SINH
                  <br />
                  TIỂU HỌC
                  <br />& THCS
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="mb-7 pr-28 md:pr-36">
              <p className="font-display text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-1">
                DUY NHẤT
              </p>
              <p className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-gradient-warm">{`${totalSlots} SUẤT`}</span>
              </p>
              <p className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                MIỄN PHÍ:
              </p>
              <p className="text-sm md:text-base text-gray-600 mt-2 italic">
                ({CAMPAIGN.totalSlotsPerLocation} suất/cơ sở ×{" "}
                {CAMPAIGN.locations.length} cơ sở)
              </p>
            </div>

            {/* Benefits */}
            <ul className="space-y-3 md:space-y-4 mb-7 md:mb-8">
              {[
                "Học phần mềm RoboSim chuẩn quốc tế",
                "Lắp ráp & lập trình robot tự hành",
                "Đọc sa bàn, phân tích chiến thuật thi đấu",
                "Chuyên gia đánh giá năng khiếu công nghệ",
              ].map((benefit, idx) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-cta-400 to-cta-600 text-white font-bold flex items-center justify-center text-base shadow-md">
                    ✓
                  </span>
                  <span className="font-display font-semibold text-base md:text-lg text-gray-800 leading-snug pt-0.5">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Highlight badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-7 md:mb-8"
            >
              <div className="inline-block relative animate-shimmer">
                <div className="bg-gradient-to-r from-cta-500 to-cta-600 text-white font-display font-extrabold text-base md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-button shadow-cta-glow">
                  💯 MIỄN PHÍ 100% cho 5 buổi học đầu tiên
                </div>
              </div>
            </motion.div>

            {/* Countdown */}
            <div className="mb-6">
              <p className="text-gray-700 font-display font-semibold text-sm md:text-base mb-3 flex items-center gap-2">
                <span className="text-cta-500 text-lg">⏰</span>
                Hết hạn đăng ký sau:
              </p>
              <Countdown getTarget={getNextSaturdayEnd} />
            </div>

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white border-2 border-brand-100 rounded-card p-4 md:p-5 shadow-soft tilt-card"
            >
              <p className="font-display font-bold text-gray-900 text-sm md:text-base mb-3 flex items-center gap-2">
                <span className="text-xl">📅</span>
                LỊCH KHAI GIẢNG:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-1 inline-block w-2 h-2 rounded-full bg-cta-500" />
                  <div>
                    <p className="font-display font-bold text-gray-900 leading-tight">
                      Khai giảng đợt tới:{" "}
                      {formatVNSaturdayLabel(getNextSaturday())}
                    </p>
                    <p className="text-gray-600 text-xs md:text-sm mt-0.5">
                      Lịch học: {CAMPAIGN.classDayLabel} —{" "}
                      {CAMPAIGN.classTime}
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs md:text-sm text-gray-600 flex items-start gap-1.5">
                  <span className="shrink-0">📍</span>
                  <span>
                    Áp dụng cho cả 2 cơ sở:{" "}
                    {CAMPAIGN.locations[0].address} &{" "}
                    {CAMPAIGN.locations[1].address}
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* === RIGHT: Form === */}
          <motion.div
            id="dang-ky"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="scroll-mt-20"
          >
            <div className="bg-white rounded-card shadow-card p-5 md:p-7 lg:p-8 border-2 border-brand-100 tilt-card relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 w-32 h-32 bg-cta-100 rounded-full opacity-50"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-12 -left-12 w-28 h-28 bg-brand-100 rounded-full opacity-50"
              />

              <div className="relative text-center mb-5">
                <div className="inline-flex items-center gap-1.5 bg-success-50 text-success-600 text-xs font-semibold px-3 py-1.5 rounded-pill mb-3 border border-success-500/20">
                  <span>✓</span>
                  <span>Miễn phí — Không thu phí ẩn</span>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                  ĐĂNG KÝ THAM GIA LỚP HỌC THỬ
                </h2>
                <p className="font-display text-lg md:text-xl font-extrabold text-gradient-warm">
                  NHẬN ƯU ĐÃI KHỦNG
                </p>
              </div>

              <div className="relative">
                <LeadForm />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
