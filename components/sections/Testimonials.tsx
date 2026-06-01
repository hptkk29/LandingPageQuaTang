import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const TESTIMONIALS = [
  {
    initial: "Đ",
    name: "Anh Trần Văn Đức",
    role: "PH bé Bin (10 tuổi)",
    location: "Liên Chiểu, Đà Nẵng",
    quote:
      "Lớp 1:8 tại cơ sở Hoà Khánh, GV nhiệt tình. Con đã đoạt giải Robothon cấp tỉnh tháng trước.",
  },
  {
    initial: "A",
    name: "Cô Lê Hoài Anh",
    role: "Hiệu trưởng TH ABC",
    location: "Sơn Trà, Đà Nẵng",
    quote:
      "Sata Robo triển khai Lab STEM cho trường rất chuyên nghiệp. GV được training kỹ, HS rất hào hứng.",
  },
  {
    initial: "L",
    name: "Chị Phạm Mai Linh",
    role: "PH bé Mít (7 tuổi)",
    location: "Cẩm Lệ, Đà Nẵng",
    quote:
      "Học online qua RoboSim tiện cực kỳ! Không phải đưa con đi đâu, GV vẫn theo sát con từng buổi.",
  },
  {
    initial: "H",
    name: "Chị Nguyễn Thị Hà",
    role: "PH bé Tom (8 tuổi)",
    location: "Hải Châu, Đà Nẵng",
    quote:
      "Con học RoboSim được 3 tháng. Từ ghét toán giờ con say mê logic, tự code đèn nháy. Tuyệt vời!",
  },
  {
    initial: "B",
    name: "Anh Hoàng Quốc Bảo",
    role: "PH bé Bống (12 tuổi)",
    location: "Thanh Khê, Đà Nẵng",
    quote:
      "Con đậu vòng quốc gia WRO 2025! Cảm ơn các thầy cô đã định hướng đúng đắn cho con.",
  },
  {
    initial: "D",
    name: "Chị Vũ Thuỳ Dương",
    role: "PH bé An (9 tuổi)",
    location: "Ngũ Hành Sơn, Đà Nẵng",
    quote:
      "Giá hợp lý, con vui mỗi buổi. Khoá K2 con đã làm được robot nhặt rác hoàn chỉnh!",
  },
  {
    initial: "H",
    name: "Anh Đỗ Văn Hùng",
    role: "PH bé Khánh (11 tuổi)",
    location: "Hải Châu, Đà Nẵng",
    quote:
      "Đã thử 2 trung tâm khác trước khi tìm Sata Robo. Đây là nơi duy nhất con không bỏ giữa chừng.",
  },
  {
    initial: "L",
    name: "Chị Bùi Thị Lan",
    role: "PH bé Khoa (8 tuổi)",
    location: "Hoà Vang, Đà Nẵng",
    quote:
      "Cô Trang tư vấn rất tâm huyết, đúng nhu cầu của con. Đăng ký 12 tháng luôn không hối hận.",
  },
];

function Card({
  t,
}: {
  t: (typeof TESTIMONIALS)[number];
}) {
  return (
    <div className="mr-5 md:mr-6 w-[300px] md:w-[360px] shrink-0">
      <div className="h-full bg-cta-50 rounded-card p-6 md:p-7 border border-[#F5C49A] shadow-soft flex flex-col">
        <div className="text-amber-400 text-lg mb-3 tracking-wide">★★★★★</div>
        <p className="text-gray-700 leading-relaxed italic mb-5 flex-1">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-[#F5C49A]/60">
          <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-cta-400 to-cta-600 text-white flex items-center justify-center font-display font-bold">
            {t.initial}
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-gray-900 text-sm leading-tight">
              {t.name}
            </p>
            <p className="text-xs text-gray-500 leading-tight">{t.role}</p>
            <p className="text-xs text-gray-400 leading-tight">
              📍 {t.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  // Nhân đôi danh sách để marquee lặp liền mạch (translateX -50%)
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-14 md:py-24 bg-white overflow-hidden">
      <Container size="xl">
        <SectionHeading
          eyebrow="Phụ huynh nói gì"
          title="2.000+ phụ huynh tin tưởng"
          description="Những phản hồi thật từ phụ huynh đã cho con học tại Sata Robo."
        />
      </Container>

      <div className="group relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex w-max items-stretch animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
