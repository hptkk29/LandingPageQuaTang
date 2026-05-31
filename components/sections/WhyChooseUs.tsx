import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const REASONS = [
  {
    icon: "🎨",
    title: "Biến thời gian màn hình thành sáng tạo",
    description:
      "Thay vì chỉ giải trí, con dùng máy tính để thiết kế, lập trình và tạo ra sản phẩm robot của riêng mình.",
  },
  {
    icon: "🧠",
    title: "Rèn tư duy & kiên nhẫn qua thực hành thật",
    description:
      "Học qua dự án thực tế: thử – sai – sửa. Con rèn tư duy logic, khả năng giải quyết vấn đề và sự kiên trì.",
  },
  {
    icon: "🏆",
    title: "Tự tin khi có thành quả thật",
    description:
      "Con tự tay lắp ráp, lập trình robot chạy được và thuyết trình về sản phẩm — tự tin từ thành quả cụ thể.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="vi-sao" className="py-14 md:py-24 bg-white scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Vì sao nên cho con học"
          title="Học lập trình Robot mang lại gì cho con?"
          description="Ba giá trị cốt lõi mà mỗi học viên Sata Robo nhận được."
        />

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="bg-cta-50 rounded-card p-8 border border-[#F5C49A] text-center hover:shadow-card transition-shadow"
            >
              <div className="text-5xl md:text-6xl mb-5">{r.icon}</div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-cta-700 mb-3 leading-tight">
                {r.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
