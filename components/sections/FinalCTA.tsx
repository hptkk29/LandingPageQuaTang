"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { CAMPAIGN } from "@/lib/constants/campaign";

function CountdownCompact({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate);
    function calc() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const labels = ["Ngày", "Giờ", "Phút", "Giây"];
  const values = timeLeft
    ? [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
    : [0, 0, 0, 0];

  return (
    <>
      {values.map((v, i) => (
        <div
          key={labels[i]}
          className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-button p-2 md:p-3"
        >
          <div className="font-display font-extrabold text-xl md:text-2xl tabular-nums text-white">
            {String(v).padStart(2, "0")}
          </div>
          <div className="text-[10px] md:text-xs text-white/80 uppercase tracking-wider">
            {labels[i]}
          </div>
        </div>
      ))}
    </>
  );
}

export function FinalCTA() {
  const totalSlots =
    CAMPAIGN.totalSlotsPerLocation * CAMPAIGN.locations.length;

  function scrollToForm() {
    document.getElementById("dang-ky")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <section className="relative py-14 md:py-20 overflow-hidden bg-gradient-to-br from-cta-500 via-cta-600 to-cta-700">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, white 1px, transparent 1px),
                            radial-gradient(circle at 80% 70%, white 1px, transparent 1px),
                            radial-gradient(circle at 50% 50%, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px, 80px 80px, 100px 100px",
        }}
      />

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {[
          { top: "15%", left: "8%", delay: "0s" },
          { top: "70%", left: "90%", delay: "1s" },
          { top: "40%", left: "3%", delay: "2s" },
          { top: "20%", left: "85%", delay: "0.5s" },
        ].map((s, i) => (
          <svg
            key={i}
            className="absolute animate-sparkle w-6 h-6 text-amber-300"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        ))}
      </div>

      <Container size="xl" className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-display font-semibold text-xs md:text-sm uppercase tracking-wider px-4 py-2 rounded-pill mb-5">
            🔥 Số suất sắp hết
          </div>

          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 drop-shadow-md">
            Đăng ký ngay — Con bạn xứng đáng
            <br />
            <span className="text-amber-300">được trải nghiệm tốt nhất</span>
          </h2>

          <p className="text-lg md:text-xl text-white/95 mb-8 leading-relaxed">
            5 buổi học <strong>MIỄN PHÍ 100%</strong> — Không thu phí ẩn, không
            ràng buộc.
            <br className="hidden md:inline" />
            Cam kết hoàn 100% nếu không hài lòng sau buổi đầu.
          </p>

          {/* Mini countdown */}
          <div className="max-w-md mx-auto mb-8">
            <p className="text-sm md:text-base text-white/90 font-semibold mb-3 flex items-center justify-center gap-2">
              <span className="text-amber-300 text-lg">⏰</span>
              Hết hạn đăng ký sau:
            </p>
            <div className="grid grid-cols-4 gap-2">
              <CountdownCompact targetDate={CAMPAIGN.registrationDeadline} />
            </div>
          </div>

          {/* 2 CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6">
            <button
              type="button"
              onClick={scrollToForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-cta-600 font-display font-extrabold text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-button shadow-xl transition-all hover:-translate-y-0.5 hover:scale-105 animate-shimmer cursor-pointer"
            >
              🎁 Đăng ký 1 trong {totalSlots} suất MIỄN PHÍ →
            </button>

            <a
              href={`tel:${CAMPAIGN.hotlineDigits}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/70 hover:bg-white/10 text-white font-display font-bold text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-button transition-all"
            >
              📞 Gọi {CAMPAIGN.hotline}
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-white/90">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-300">✓</span>
              Không cần thẻ tín dụng
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-300">✓</span>
              Không ràng buộc
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-300">✓</span>
              Hoàn 100% nếu không hài lòng
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-amber-300">✓</span>
              Tư vấn 24/7
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
