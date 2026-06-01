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
  return (
    <section className="py-14 md:py-24 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Ba mẹ có đang lo lắng?"
          title={"Có phải con đang gặp\n1 trong 4 vấn đề này?"}
          description="Những điều ba mẹ thường trăn trở nhất ở trẻ trong thời đại công nghệ."
        />

        <Carousel className="md:grid-cols-2 lg:grid-cols-4">
          {PAIN_POINTS.map((p) => (
            <div
              key={p.title}
              className="group h-full bg-cta-50 rounded-card p-6 md:p-7 border border-[#F5C49A] shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-cta-400 to-cta-600 text-white text-3xl md:text-4xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                  {p.icon}
                </div>
                <span className="font-display text-[11px] md:text-xs font-bold uppercase tracking-wider text-cta-700 bg-white border border-[#F5C49A] rounded-pill px-2.5 py-1">
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
          ))}
        </Carousel>

        <p className="text-center mt-10 text-lg md:text-xl font-display font-semibold text-cta-600">
          → Lập trình Robot RoboSim biến những nỗi lo đó thành cơ hội phát triển ↓
        </p>
      </Container>
    </section>
  );
}
