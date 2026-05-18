"use client";

import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/shared/Container";
import { Countdown } from "@/components/shared/Countdown";
import { CAMPAIGN } from "@/lib/constants/campaign";

export function Hero() {
  const totalSlots =
    CAMPAIGN.totalSlotsPerLocation * CAMPAIGN.locations.length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-urgency-700 via-urgency-600 to-urgency-700 py-6 md:py-10">
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

      <Container size="xl" className="relative">
        {/* Top ribbon */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-block bg-white border-2 border-urgency-200 rounded-pill px-6 md:px-10 py-2.5 md:py-3 shadow-card">
            <h1 className="font-display text-base md:text-xl lg:text-2xl font-bold text-urgency-600 text-center">
              🎁 Đăng ký tham gia trải nghiệm sáng tạo công nghệ
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 items-start">
          {/* LEFT — headline + benefits + countdown */}
          <div className="text-white relative">
            {/* Star burst */}
            <div
              className="absolute -top-2 right-0 md:-right-4 lg:right-8 z-10 animate-pulse-star"
              style={{ transformOrigin: "center" }}
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full drop-shadow-lg"
                  aria-hidden="true"
                >
                  <polygon
                    points="50,2 58,28 88,18 70,42 96,52 70,62 88,86 58,76 50,98 42,76 12,86 30,62 4,52 30,42 12,18 42,28"
                    fill="#FBBF24"
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />
                </svg>
                <div className="relative font-display font-extrabold text-center text-brand-900 text-[10px] md:text-xs leading-tight px-2">
                  DÀNH CHO
                  <br />
                  HỌC SINH
                  <br />
                  TIỂU HỌC
                  <br />& THCS
                </div>
              </div>
            </div>

            <div className="mb-6 pr-32 md:pr-40 lg:pr-44">
              <p className="font-display text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-1 drop-shadow-md">
                DUY NHẤT
              </p>
              <p className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md">
                <span className="text-accent-400">{`${totalSlots} SUẤT`}</span>{" "}
                MIỄN PHÍ:
              </p>
              <p className="text-sm md:text-base text-white/90 mt-2">
                ({CAMPAIGN.totalSlotsPerLocation} suất/cơ sở ×{" "}
                {CAMPAIGN.locations.length} cơ sở)
              </p>
            </div>

            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {[
                "Học phần mềm RoboSim chuẩn quốc tế",
                "Lắp ráp & lập trình robot tự hành",
                "Đọc sa bàn, phân tích chiến thuật thi đấu",
                "Chuyên gia đánh giá năng khiếu công nghệ",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white text-urgency-600 font-bold flex items-center justify-center text-base md:text-lg shadow-md">
                    ✓
                  </span>
                  <span className="font-display font-semibold text-base md:text-lg lg:text-xl leading-snug drop-shadow-md">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mb-6 md:mb-8 inline-block relative">
              <div className="bg-accent-400 text-brand-900 font-display font-extrabold text-lg md:text-2xl px-6 md:px-8 py-3 md:py-4 rounded-button shadow-cta-red border-2 border-white">
                💯 MIỄN PHÍ 100% cho 5 buổi học đầu tiên
              </div>
            </div>

            <div className="mb-2">
              <p className="text-white font-display font-semibold text-sm md:text-base mb-3 flex items-center gap-2">
                <span className="text-accent-400 text-lg">⏰</span>
                Hết hạn đăng ký sau:
              </p>
              <Countdown targetDate={CAMPAIGN.registrationDeadline} />
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-button p-4 md:p-5">
              <p className="font-display font-bold text-white text-sm md:text-base mb-2">
                📅 LỊCH KHAI GIẢNG:
              </p>
              <ul className="space-y-1 text-sm md:text-base">
                {CAMPAIGN.locations.map((loc) => (
                  <li
                    key={loc.key}
                    className="text-white/95 flex flex-wrap gap-x-2"
                  >
                    <span className="font-semibold">{loc.address}:</span>
                    <span>{loc.khaiGiangLabel}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — form card */}
          <div id="dang-ky" className="scroll-mt-20">
            <div className="bg-white rounded-card shadow-card p-5 md:p-7 lg:p-8">
              <div className="text-center mb-5">
                <h2 className="font-display text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                  ĐĂNG KÝ THAM GIA LỚP HỌC THỬ
                </h2>
                <p className="font-display text-lg md:text-xl font-extrabold text-urgency-600">
                  NHẬN ƯU ĐÃI KHỦNG
                </p>
              </div>

              <LeadForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
