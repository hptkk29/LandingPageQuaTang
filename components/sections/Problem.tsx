"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const PROBLEMS = [
  {
    icon: "🤔",
    title: "Con không thích công nghệ?",
    description:
      "Trong khi bạn bè cùng tuổi đã lập trình được robot đơn giản, con vẫn ngại máy tính, không tự tin trong giờ Tin học.",
  },
  {
    icon: "😰",
    title: "Ba mẹ sợ chọn nhầm chỗ học?",
    description:
      "Đầu tư vài triệu cho khóa STEM nhưng con học vài buổi rồi chán, không thấy tiến bộ, mà tiền đã đóng trọn gói.",
  },
  {
    icon: "⏰",
    title: "Con học nhanh chán, không kiên trì?",
    description:
      "Mua bộ robot xếp hình về cho con — chơi 2 tuần rồi xếp xó. Không lộ trình, không thầy cô hướng dẫn.",
  },
  {
    icon: "🎯",
    title: "Muốn con có lợi thế hồ sơ tương lai?",
    description:
      "Trường THCS điểm cao và học bổng quốc tế ưu tiên hồ sơ có thành tích STEM — nhưng không biết bắt đầu từ đâu.",
  },
];

export function Problem() {
  return (
    <section className="relative py-14 md:py-24 bg-white overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-brand-100/40 rounded-full filter blur-3xl animate-blob"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Vấn đề của ba mẹ"
          title={"Có phải ba mẹ đang gặp\n1 trong 4 vấn đề này?"}
          description="Sata Robo đã trò chuyện với hơn 500+ ba mẹ tại Đà Nẵng — và 4 nỗi lo dưới đây luôn được nhắc đến nhiều nhất."
        />

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {PROBLEMS.map((problem, idx) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-card p-6 md:p-7 shadow-soft border-2 border-brand-100 hover:border-cta-300 hover:shadow-card transition-all tilt-card group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {problem.icon}
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">
                {problem.title}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-lg md:text-xl font-display font-semibold text-gradient-brand"
        >
          → 5 buổi RoboSim MIỄN PHÍ của Sata Robo có giải pháp dành riêng cho ba
          mẹ ↓
        </motion.p>
      </Container>
    </section>
  );
}
