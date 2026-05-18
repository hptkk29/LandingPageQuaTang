"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const TESTIMONIALS = [
  {
    initial: "H",
    name: "Chị Nguyễn Thị Hà",
    role: "PH bé Tom (8 tuổi)",
    location: "Hải Châu, Đà Nẵng",
    rating: 5,
    quote:
      "Con học RoboSim được 3 tháng. Từ ghét máy tính giờ con say mê logic, tự code đèn nháy. Tuyệt vời!",
  },
  {
    initial: "Đ",
    name: "Anh Trần Văn Đức",
    role: "PH bé Bin (10 tuổi)",
    location: "Liên Chiểu, Đà Nẵng",
    rating: 5,
    quote:
      "Lớp nhỏ, GV nhiệt tình, kèm từng con. Con đã đoạt giải Robothon cấp tỉnh tháng trước.",
  },
  {
    initial: "L",
    name: "Chị Phạm Mai Linh",
    role: "PH bé Mít (7 tuổi)",
    location: "Cẩm Lệ, Đà Nẵng",
    rating: 5,
    quote:
      "Đăng ký 5 buổi miễn phí ban đầu, không thấy gọi điện ép mua khoá. Con thích thì học tiếp — rất chuyên nghiệp.",
  },
  {
    initial: "B",
    name: "Anh Hoàng Quốc Bảo",
    role: "PH bé Bống (12 tuổi)",
    location: "Thanh Khê, Đà Nẵng",
    rating: 5,
    quote:
      "Con đậu vòng quốc gia WRO 2025! Cảm ơn các thầy cô Sata Robo đã định hướng đúng đắn.",
  },
  {
    initial: "D",
    name: "Chị Vũ Thuỳ Dương",
    role: "PH bé An (9 tuổi)",
    location: "Ngũ Hành Sơn, Đà Nẵng",
    rating: 5,
    quote:
      "Giá hợp lý, con vui mỗi buổi đi học. Khoá K2 con đã làm được robot nhặt rác hoàn chỉnh!",
  },
  {
    initial: "H",
    name: "Anh Đỗ Văn Hùng",
    role: "PH bé Khánh (11 tuổi)",
    location: "Hải Châu, Đà Nẵng",
    rating: 5,
    quote:
      "Đã thử 2 trung tâm khác trước khi tìm Sata Robo. Đây là nơi duy nhất con không bỏ giữa chừng.",
  },
];

const AVATAR_COLORS = [
  "bg-cta-100 text-cta-700",
  "bg-brand-100 text-brand-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
];

export function Testimonials() {
  return (
    <section className="relative py-14 md:py-24 bg-white overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-0 w-96 h-96 bg-cta-100/40 rounded-full filter blur-3xl animate-blob"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-80 h-80 bg-brand-100/40 rounded-full filter blur-3xl animate-blob-delayed"
      />

      <Container size="xl" className="relative">
        <SectionHeading
          eyebrow="Ba mẹ nói gì"
          title="500+ ba mẹ Đà Nẵng đã tin tưởng Sata Robo"
          description="Phản hồi thật từ ba mẹ đã cho con học tại Sata Robo."
        />

        {/* Rating summary */}
        <div className="flex flex-col items-center gap-2 mb-10 md:mb-12">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 md:w-7 md:h-7 text-amber-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-700 font-display font-semibold text-sm md:text-base">
            <span className="text-2xl md:text-3xl font-extrabold text-cta-600">
              4.9
            </span>
            <span className="text-gray-500"> / 5</span>
            <span className="mx-2 text-gray-300">•</span>
            <span>500+ đánh giá</span>
          </p>
        </div>

        {/* Grid 3 cols */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
              className="bg-white rounded-card p-6 md:p-7 shadow-soft border-2 border-brand-100 hover:border-cta-300 hover:shadow-card-hover transition-all tilt-card relative"
            >
              {/* Quote icon */}
              <svg
                aria-hidden="true"
                className="absolute top-4 right-4 w-10 h-10 text-cta-100"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>

              {/* 5 stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`shrink-0 w-11 h-11 rounded-full ${
                    AVATAR_COLORS[idx % AVATAR_COLORS.length]
                  } flex items-center justify-center font-display font-bold text-base`}
                >
                  {t.initial}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-gray-900 text-sm leading-tight truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">{t.role}</p>
                  <p className="text-xs text-gray-400 leading-tight">
                    📍 {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
