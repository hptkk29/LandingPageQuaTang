"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Carousel } from "@/components/shared/Carousel";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const PAIN_POINTS = [
  {
    icon: "🎮",
    tag: "Giải trí thụ động",
    title: "Chơi game cả ngày",
    description:
      "Con dành phần lớn thời gian rảnh cho game giải trí — màn hình chỉ để tiêu khiển, không tạo ra giá trị.",
  },
  {
    icon: "😵‍💫",
    tag: "Khó tập trung",
    title: "Mất tập trung, ngại học",
    description:
      "Dễ bị phân tâm, khó ngồi yên với một việc, ngại những môn đòi hỏi tư duy và kiên nhẫn.",
  },
  {
    icon: "📱",
    tag: "Phụ thuộc thiết bị",
    title: "Nghiện điện thoại",
    description:
      "Phụ thuộc thiết bị nhưng không dùng vào việc có ích — thiếu hoạt động phát triển trí tuệ.",
  },
  {
    icon: "😟",
    tag: "Ngại thể hiện",
    title: "Thiếu tự tin",
    description:
      "Ngại giao tiếp, ngại làm việc nhóm, chưa có thành quả thật để tự hào và tin vào bản thân.",
  },
];

export function Problem() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-14 md:py-24 bg-white">
      {/* decorative playful blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-[360px] h-[360px] bg-cta-100/50 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 w-[360px] h-[360px] bg-cta-100/40 rounded-full blur-3xl"
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Ba mẹ có đang lo lắng?"
          title={"Có phải con đang gặp\n1 trong 4 vấn đề này?"}
          description="Những điều ba mẹ thường trăn trở nhất ở trẻ trong thời đại công nghệ."
        />

        <Carousel className="md:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reduce ? undefined : { y: -10 }}
              className="group relative h-full overflow-hidden bg-white rounded-card p-6 md:p-7 border border-[#F5C49A] shadow-soft hover:shadow-card-hover transition-shadow"
            >
              {/* top accent bar reveal on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cta-400 to-cta-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
              />
              {/* corner glow */}
              <span
                aria-hidden="true"
                className="absolute -top-10 -right-10 w-28 h-28 bg-cta-100 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"
              />

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <motion.div
                    className="shrink-0 grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cta-400 to-cta-600 text-white text-4xl shadow-cta group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300"
                    animate={reduce ? undefined : { y: [0, -6, 0] }}
                    transition={
                      reduce
                        ? undefined
                        : {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.25,
                          }
                    }
                  >
                    <span className="drop-shadow-sm">{p.icon}</span>
                  </motion.div>
                  <span className="font-display text-[11px] md:text-xs font-bold uppercase tracking-wider text-cta-700 bg-cta-50 border border-[#F5C49A] rounded-pill px-2.5 py-1">
                    {p.tag}
                  </span>
                </div>

                <h3 className="font-display text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </Carousel>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10 text-lg md:text-xl font-display font-semibold text-cta-600"
        >
          → Lập trình Robot RoboSim biến những nỗi lo đó thành cơ hội phát triển ↓
        </motion.p>
      </Container>
    </section>
  );
}
