import { Container } from "@/components/shared/Container";

const BADGES = [
  { icon: "🏆", label: "Đối tác tổ chức", value: "Cuộc thi Robotics TW Đoàn" },
  { icon: "🌏", label: "Cơ hội lớn tham gia", value: "World Robot Conference" },
  { icon: "📜", label: "Bám sát", value: "NQ57 & GDPT 2018" },
  { icon: "👨‍🎓", label: "Đã đào tạo", value: "500+ học viên" },
];

export function TrustBadges() {
  return (
    <section className="py-8 md:py-12 bg-white border-y border-gray-100">
      <Container size="xl">
        <p className="text-center text-xs md:text-sm font-display font-semibold uppercase tracking-wider text-gray-500 mb-5 md:mb-6">
          Sata Robo — Đơn vị giáo dục robotics uy tín tại Đà Nẵng
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.value}
              className="flex flex-col items-center text-center p-3 md:p-4 rounded-card bg-surface-50 border border-brand-100 hover:border-cta-300 hover:shadow-soft transition-all tilt-card"
            >
              <div className="text-2xl md:text-3xl mb-1.5">{badge.icon}</div>
              <p className="text-[10px] md:text-xs text-gray-500 mb-0.5">
                {badge.label}
              </p>
              <p className="font-display text-xs md:text-sm font-bold text-gray-900 leading-tight">
                {badge.value}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
