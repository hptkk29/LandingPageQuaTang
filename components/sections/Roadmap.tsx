"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const LEVELS = {
  basic: {
    label: "Cơ bản",
    age: "6–9 tuổi",
    title: "Khởi đầu với Robotics",
    items: [
      "Làm quen robot và tư duy lập trình qua giao diện kéo–thả trực quan",
      "Lắp ráp robot đơn giản theo hướng dẫn từng bước",
      "Hình thành tư duy logic và thói quen thử – sai – sửa",
      "Hoàn thành sản phẩm đầu tiên và thuyết trình ngắn",
    ],
  },
  advanced: {
    label: "Nâng cao",
    age: "9–11 tuổi",
    title: "Lập trình & cảm biến",
    items: [
      "Lập trình robot phức tạp hơn với điều kiện, vòng lặp",
      "Sử dụng cảm biến, động cơ để robot tự xử lý tình huống",
      "Giải các bài toán thực tế theo nhóm dự án",
      "Phân tích sa bàn, tối ưu giải pháp",
    ],
  },
  competition: {
    label: "Thi đấu",
    age: "11–13 tuổi",
    title: "Chinh phục RoboSim 2026",
    items: [
      "Lập trình tự hành nâng cao và tối ưu hiệu suất",
      "Xây dựng chiến thuật, luyện tập theo thể lệ giải đấu",
      "Chuẩn bị toàn diện cho RoboSim 2026 và các kỳ thi quốc gia",
      "Rèn kỹ năng làm việc nhóm và thuyết trình trước hội đồng",
    ],
  },
} as const;

type LevelKey = keyof typeof LEVELS;

export function Roadmap() {
  const [active, setActive] = useState<LevelKey>("basic");
  const level = LEVELS[active];

  return (
    <section id="chuong-trinh" className="py-14 md:py-24 bg-white scroll-mt-20">
      <Container size="md">
        <SectionHeading
          eyebrow="Lộ trình học"
          title="Lộ trình 3 cấp theo độ tuổi"
          description="Chương trình được thiết kế phù hợp với từng giai đoạn phát triển của con."
        />

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(Object.keys(LEVELS) as LevelKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`px-5 md:px-6 py-3 rounded-pill font-display font-bold text-sm md:text-base transition-all cursor-pointer ${
                active === key
                  ? "bg-cta-500 text-white shadow-cta"
                  : "bg-cta-50 text-cta-700 border border-[#F5C49A] hover:bg-cta-100"
              }`}
            >
              {LEVELS[key].label}
              <span className="block text-xs font-normal opacity-80">
                {LEVELS[key].age}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-cta-50 rounded-card p-6 md:p-8 border border-[#F5C49A] shadow-soft">
          <h3 className="font-display text-xl md:text-2xl font-bold text-cta-700 mb-5">
            {level.title}{" "}
            <span className="text-gray-400 text-base font-normal">
              · {level.age}
            </span>
          </h3>
          <ul className="space-y-4">
            {level.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-800">
                <span className="shrink-0 w-7 h-7 rounded-full bg-cta-500 text-white text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="leading-relaxed pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
