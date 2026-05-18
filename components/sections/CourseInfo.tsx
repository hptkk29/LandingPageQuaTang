"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { CAMPAIGN } from "@/lib/constants/campaign";

const BENEFITS = [
  {
    icon: "🤖",
    title: "Làm quen phần mềm RoboSim",
    description:
      "Nền tảng chuẩn quốc tế đang được dùng tại các giải đấu robotics chuyên nghiệp.",
  },
  {
    icon: "🔧",
    title: "Nguyên lý thiết kế & lắp ráp robot",
    description:
      "Nắm vững từ ý tưởng đến sản phẩm thực tế — không chỉ học lý thuyết.",
  },
  {
    icon: "⚡",
    title: "Lập trình tự hành (Autonomous)",
    description:
      "Không chỉ điều khiển tay — robot tự xử lý tình huống trên sa bàn.",
  },
  {
    icon: "🎯",
    title: "Phân tích thể lệ & xây chiến thuật",
    description:
      "Đọc sa bàn, lập kế hoạch — sẵn sàng tranh tài tại Sáng tạo Robotics 2026.",
  },
];

export function CourseInfo() {
  const totalSlots =
    CAMPAIGN.totalSlotsPerLocation * CAMPAIGN.locations.length;

  return (
    <section
      id="chuong-trinh"
      className="relative py-14 md:py-24 bg-surface-50 scroll-mt-20 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-100/60 rounded-full filter blur-3xl animate-blob-slow"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -right-32 w-96 h-96 bg-cta-100/60 rounded-full filter blur-3xl animate-blob-delayed"
      />

      <Container className="relative">
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-cta-50 text-cta-700 font-display font-bold text-xs md:text-sm uppercase tracking-wider px-4 py-2 rounded-pill mb-4 border-2 border-cta-200"
          >
            🎁 Khoá học miễn phí 100%
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3"
          >
            Khoá học đại cương
            <br />
            <span className="text-gradient-brand">Lập trình RoboSim</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700 font-display font-semibold"
          >
            Hành trang vững chắc chinh phục Cuộc thi Sáng tạo Robotics 2026
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-14 max-w-4xl mx-auto">
          {[
            {
              icon: "🎯",
              label: "Đối tượng",
              value: `${CAMPAIGN.targetAudience}\n(${CAMPAIGN.targetGrades})`,
            },
            {
              icon: "📅",
              label: "Lịch học",
              value: "Khai giảng\n23/5 & 25/5",
            },
            {
              icon: "⏱️",
              label: "Thời lượng",
              value: CAMPAIGN.duration,
            },
          ].map((fact, idx) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-card p-5 md:p-6 shadow-soft border-2 border-brand-100 text-center hover:border-cta-300 transition-all tilt-card"
            >
              <div className="text-3xl md:text-4xl mb-2">{fact.icon}</div>
              <p className="text-xs md:text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {fact.label}
              </p>
              <p className="font-display font-bold text-gray-900 text-sm md:text-base leading-tight whitespace-pre-line">
                {fact.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-display text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 md:mb-8">
            🎓 Học sinh sẽ được trang bị:
          </h3>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-8">
            {BENEFITS.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-card p-5 md:p-6 shadow-soft border-2 border-brand-100 hover:border-cta-300 transition-all tilt-card group"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-12 h-12 rounded-card bg-gradient-to-br from-cta-400 to-cta-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-base md:text-lg mb-1.5 leading-tight">
                      {benefit.title}
                    </h4>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-cta-50 border-2 border-cta-200 rounded-card p-4 md:p-5 flex items-start gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <p className="text-cta-800 font-display font-semibold text-sm md:text-base leading-relaxed">
              <strong>Số lượng có hạn</strong> — Lớp được giới hạn{" "}
              {CAMPAIGN.totalSlotsPerLocation} học viên/cơ sở để đảm bảo chất
              lượng giảng dạy.
            </p>
          </div>

          <div className="text-center mt-8 md:mt-10">
            <a
              href="#dang-ky"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cta-500 to-cta-600 hover:from-cta-600 hover:to-cta-700 text-white font-display font-extrabold text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-button shadow-cta animate-pulse-glow animate-shimmer transition-all hover:-translate-y-0.5"
            >
              🎁 Đăng ký 1 trong {totalSlots} suất MIỄN PHÍ
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
