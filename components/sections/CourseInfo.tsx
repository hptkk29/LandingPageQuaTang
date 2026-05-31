import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const DIFFERENTIATORS = [
  {
    icon: "🤖",
    title: "Robot thật + RoboSim",
    description:
      "Con học trên phần mềm mô phỏng RoboSim chuẩn quốc tế VÀ thực hành với robot thật — nắm chắc lý thuyết, tự tin lập trình.",
  },
  {
    icon: "🏆",
    title: "Thi đấu thật 2026",
    description:
      "Không học cho vui — con được rèn để tranh tài tại các giải đấu robot thực tế, cọ xát và trưởng thành.",
  },
  {
    icon: "🎤",
    title: "Thuyết trình trước ba mẹ",
    description:
      "Cuối mỗi 12 buổi, con thuyết trình sản phẩm trước ba mẹ — rèn bản lĩnh sân khấu và khả năng diễn đạt.",
  },
];

export function CourseInfo() {
  return (
    <section className="py-14 md:py-24 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Điểm khác biệt"
          title="Điều làm nên sự khác biệt của Sata Robo"
          description="Không chỉ dạy code — Sata Robo tạo ra trải nghiệm học tập trọn vẹn."
        />

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {DIFFERENTIATORS.map((d) => (
            <div
              key={d.title}
              className="relative bg-surface-50 rounded-card p-8 border border-[#F5C49A] hover:border-cta-500 transition-colors"
            >
              <div className="text-5xl md:text-6xl mb-5">{d.icon}</div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-cta-700 mb-3 leading-tight">
                {d.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{d.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
