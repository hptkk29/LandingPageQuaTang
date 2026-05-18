"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { CAMPAIGN } from "@/lib/constants/campaign";

const BENEFITS = [
  {
    title: "Làm quen phần mềm RoboSim",
    description:
      "Nền tảng chuẩn quốc tế đang được dùng tại các giải đấu robotics chuyên nghiệp.",
  },
  {
    title: "Nguyên lý thiết kế & lắp ráp robot",
    description:
      "Nắm vững từ ý tưởng đến sản phẩm thực tế — không chỉ học lý thuyết.",
  },
  {
    title: "Lập trình tự hành (Autonomous)",
    description:
      "Không chỉ điều khiển tay — robot tự xử lý tình huống trên sa bàn.",
  },
  {
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
      className="py-12 md:py-20 bg-gradient-to-b from-white to-brand-50 scroll-mt-20"
    >
      <Container>
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-block bg-brand-700 text-white font-display font-bold text-xs md:text-sm uppercase tracking-wider px-4 py-2 rounded-pill mb-4 shadow-md">
            🎁 Khoá học miễn phí 100%
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-900 leading-tight mb-3">
            Khoá học đại cương
            <br />
            <span className="text-brand-700">Lập trình RoboSim</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-display font-semibold">
            Hành trang vững chắc chinh phục Cuộc thi Sáng tạo Robotics 2026
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-14 max-w-4xl mx-auto">
          {[
            {
              icon: "🎯",
              label: "Đối tượng",
              value: `${CAMPAIGN.targetAudience} (${CAMPAIGN.targetGrades})`,
            },
            {
              icon: "📅",
              label: "Lịch học",
              value: "Khai giảng 23/5 & 25/5",
            },
            {
              icon: "⏱️",
              label: "Thời lượng",
              value: CAMPAIGN.duration,
            },
          ].map((fact) => (
            <div
              key={fact.label}
              className="bg-white rounded-card p-5 md:p-6 shadow-soft border-2 border-brand-100 text-center hover:border-brand-300 hover:shadow-card transition"
            >
              <div className="text-3xl md:text-4xl mb-2">{fact.icon}</div>
              <p className="text-xs md:text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {fact.label}
              </p>
              <p className="font-display font-bold text-brand-900 text-sm md:text-base leading-tight">
                {fact.value}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-display text-xl md:text-2xl font-bold text-brand-900 text-center mb-6 md:mb-8">
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
                className="flex items-start gap-3 bg-white rounded-card p-5 md:p-6 shadow-soft border border-brand-100 hover:border-success-500/50 hover:shadow-card transition"
              >
                <div className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-success-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  ✓
                </div>
                <div>
                  <h4 className="font-display font-bold text-brand-900 text-base md:text-lg mb-1.5 leading-tight">
                    {benefit.title}
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-brand-50 border-2 border-brand-200 rounded-card p-4 md:p-5 flex items-start gap-3">
            <span className="text-2xl shrink-0">⚠️</span>
            <p className="text-brand-900 font-display font-semibold text-sm md:text-base leading-relaxed">
              <strong>Số lượng có hạn</strong> — Lớp được giới hạn{" "}
              {CAMPAIGN.totalSlotsPerLocation} học viên/cơ sở để đảm bảo chất
              lượng giảng dạy và mỗi học sinh đều được giảng viên hỗ trợ trực
              tiếp.
            </p>
          </div>

          <div className="text-center mt-8 md:mt-10">
            <a
              href="#dang-ky"
              className="inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-display font-extrabold text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-button shadow-cta transition-all hover:scale-105 animate-pulse-cta"
            >
              🎁 Đăng ký 1 trong {totalSlots} suất MIỄN PHÍ
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
