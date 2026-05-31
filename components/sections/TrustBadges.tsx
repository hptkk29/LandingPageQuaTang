import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STATS = [
  { number: "500+", label: "Học viên đã đào tạo" },
  { number: "2", label: "Cơ sở tại Đà Nẵng" },
  { number: "15+", label: "Giải thưởng đạt được" },
  { number: "100%", label: "Phụ huynh hài lòng" },
];

const PARTNERS = [
  "Thành Đoàn Đà Nẵng",
  "Báo Đà Nẵng",
  "Sở Giáo dục & Đào tạo",
  "Nghị quyết 57",
];

export function TrustBadges() {
  return (
    <section className="py-14 md:py-24 bg-white">
      <Container size="xl">
        <SectionHeading
          eyebrow="Niềm tin từ cộng đồng"
          title="Được phụ huynh & đối tác Đà Nẵng tin tưởng"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="text-center bg-cta-50 rounded-card p-6 border border-[#F5C49A]"
            >
              <div className="font-display text-4xl md:text-5xl font-extrabold text-cta-600 mb-1.5">
                {s.number}
              </div>
              <div className="text-gray-600 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs md:text-sm font-display font-semibold uppercase tracking-wider text-gray-500 mb-6">
          Đồng hành & bảo trợ
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
          {PARTNERS.map((p) => (
            <div
              key={p}
              className="bg-surface-50 border border-gray-200 rounded-pill px-5 py-2.5 font-display font-semibold text-gray-800 text-sm md:text-base"
            >
              {p}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
