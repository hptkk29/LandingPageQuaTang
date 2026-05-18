"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const REASONS = [
  {
    icon: "🎓",
    title: "Giáo trình bám sát GDPT 2018",
    description:
      "Nội dung thiết kế phù hợp lớp 1-8, đáp ứng yêu cầu năng lực STEM của Bộ GD&ĐT.",
  },
  {
    icon: "🏅",
    title: "GV có thành tích dẫn đội thi",
    description:
      "Giáo viên Sata Robo nhiều năm dẫn dắt học sinh đạt giải Robotics cấp thành phố và quốc gia.",
  },
  {
    icon: "🤖",
    title: "Phần mềm RoboSim 3D chuyên nghiệp",
    description:
      "Học mô phỏng trước khi đụng linh kiện thật — con nắm chắc lý thuyết, tự tin lập trình.",
  },
  {
    icon: "🏫",
    title: "2 cơ sở tiện lợi tại Đà Nẵng",
    description:
      "Cơ sở 211 Nguyễn Hữu Thọ và 114 Hoàng Diệu — đầu tư đầy đủ máy tính và không gian thực hành.",
  },
  {
    icon: "📊",
    title: "Báo cáo tiến độ rõ ràng",
    description:
      "Sau mỗi buổi, ba mẹ nhận nhận xét chi tiết về tiến bộ của con — biết con cần hỗ trợ gì.",
  },
  {
    icon: "👥",
    title: "Cộng đồng học sinh đam mê",
    description:
      "Con tham gia nhóm bạn cùng đam mê — cùng học, cùng thi đấu, tạo động lực dài hạn.",
  },
];

export function WhyChooseUs() {
  return (
    <section
      id="vi-sao"
      className="relative py-14 md:py-24 bg-surface-50 overflow-hidden scroll-mt-20"
    >
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-96 h-96 bg-cta-100/50 rounded-full filter blur-3xl animate-blob-delayed"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-80 h-80 bg-brand-100/50 rounded-full filter blur-3xl animate-blob-slow"
      />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow="Vì sao chọn Sata Robo"
          title="6 lý do hơn 500 ba mẹ Đà Nẵng đã chọn Sata Robo"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {REASONS.map((reason, idx) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
              className="bg-white rounded-card p-6 md:p-7 border-2 border-brand-100 hover:border-cta-300 hover:shadow-card-hover transition-all tilt-card group relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="absolute -top-8 -right-8 w-24 h-24 bg-cta-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {reason.icon}
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {reason.title}
                </h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#dang-ky"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cta-500 to-cta-600 hover:from-cta-600 hover:to-cta-700 text-white font-display font-extrabold text-base md:text-lg px-8 py-4 rounded-button shadow-cta hover:shadow-cta-glow transition-all hover:-translate-y-0.5"
          >
            🎁 Đăng ký ngay cho con →
          </a>
        </div>
      </Container>
    </section>
  );
}
