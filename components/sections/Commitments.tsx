import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const COMMITMENTS = [
  {
    icon: "💰",
    title: "Hoàn tiền 100%",
    description: "Không hài lòng sau buổi học đầu tiên — hoàn lại toàn bộ học phí.",
  },
  {
    icon: "👥",
    title: "Lớp ≤ 12 học viên",
    description: "Sĩ số nhỏ, giáo viên kèm sát từng con, không ai bị bỏ lại.",
  },
  {
    icon: "🤖",
    title: "RoboSim bắt buộc thi 2026",
    description: "Mọi học viên được chuẩn bị và tham gia giải đấu RoboSim 2026.",
  },
  {
    icon: "✈️",
    title: "Thưởng du lịch 3–7 triệu",
    description: "Phần thưởng hấp dẫn cho học viên có thành tích xuất sắc.",
  },
  {
    icon: "🎤",
    title: "Thuyết trình cuối học phần",
    description: "Con trình bày sản phẩm trước ba mẹ — rèn sự tự tin và kỹ năng nói.",
  },
  {
    icon: "🏅",
    title: "Hỗ trợ thi quốc gia 3 triệu",
    description: "Hỗ trợ chi phí cho học viên tham gia các kỳ thi cấp quốc gia.",
  },
];

export function Commitments() {
  return (
    <section className="py-14 md:py-24 bg-surface-100">
      <Container size="xl">
        <SectionHeading
          eyebrow="Cam kết của Sata Robo"
          title="6 cam kết cho hành trình học của con"
          description="Những cam kết rõ ràng để ba mẹ hoàn toàn yên tâm."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {COMMITMENTS.map((c, idx) => (
            <div
              key={c.title}
              className="bg-white rounded-card p-6 md:p-7 border-l-4 border-cta-500 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="shrink-0 w-10 h-10 rounded-full bg-cta-50 text-cta-700 font-display font-extrabold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-3xl">{c.icon}</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-gray-900 mb-1.5 leading-tight">
                {c.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
