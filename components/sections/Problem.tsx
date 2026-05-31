import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const PAIN_POINTS = [
  {
    icon: "🎮",
    title: "Chơi game cả ngày",
    description:
      "Con dành phần lớn thời gian rảnh cho game giải trí — màn hình chỉ để tiêu khiển, không tạo ra giá trị.",
  },
  {
    icon: "😵‍💫",
    title: "Mất tập trung, ngại học",
    description:
      "Dễ bị phân tâm, khó ngồi yên với một việc, ngại những môn đòi hỏi tư duy và kiên nhẫn.",
  },
  {
    icon: "📱",
    title: "Nghiện điện thoại",
    description:
      "Phụ thuộc thiết bị nhưng không dùng vào việc có ích — thiếu hoạt động phát triển trí tuệ.",
  },
  {
    icon: "😟",
    title: "Thiếu tự tin",
    description:
      "Ngại giao tiếp, ngại làm việc nhóm, chưa có thành quả thật để tự hào và tin vào bản thân.",
  },
];

export function Problem() {
  return (
    <section className="py-14 md:py-24 bg-surface-50">
      <Container>
        <SectionHeading
          eyebrow="Ba mẹ có đang lo lắng?"
          title={"Có phải con đang gặp\n1 trong 4 vấn đề này?"}
          description="Những điều ba mẹ thường trăn trở nhất ở trẻ trong thời đại công nghệ."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {PAIN_POINTS.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-card p-6 md:p-7 border border-[#F5C49A] shadow-soft hover:shadow-card transition-shadow text-center"
            >
              <div className="text-4xl md:text-5xl mb-3">{p.icon}</div>
              <h3 className="font-display text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">
                {p.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-lg md:text-xl font-display font-semibold text-cta-600">
          → Lập trình Robot RoboSim biến những nỗi lo đó thành cơ hội phát triển ↓
        </p>
      </Container>
    </section>
  );
}
