import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/shared/Container";

const CHIPS = ["ROBOTICS", "ROBOSIM", "CODING"];

const STATS = [
  { value: "≤12", label: "học viên / lớp" },
  { value: "2026", label: "RoboSim" },
  { value: "100%", label: "hoàn tiền" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-50 via-white to-surface-50 pt-8 md:pt-12 pb-14 md:pb-20">
      <div
        aria-hidden="true"
        className="absolute -top-20 -left-24 w-[420px] h-[420px] bg-cta-100/50 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute top-10 -right-24 w-[420px] h-[420px] bg-cta-50 rounded-full blur-3xl"
      />

      <Container size="xl" className="relative">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-cta-50 border border-[#F5C49A] rounded-pill px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-cta-500 animate-pulse" />
              <span className="font-display font-semibold text-cta-700 text-sm">
                Tuyển sinh RoboSim 2026
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Lập trình Robot{" "}
              <span className="text-cta-600">RoboSim cơ bản</span> cho trẻ 6–13
              tuổi
            </h1>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Khơi dậy đam mê công nghệ, rèn tư duy logic và sự tự tin cho con
              qua các khoá học lập trình robot thực hành.
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-3 mb-7">
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="px-4 py-1.5 rounded-pill bg-white border border-[#F5C49A] text-cta-700 text-sm font-display font-bold tracking-wider"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 md:gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl md:text-4xl font-extrabold text-cta-600">
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Form */}
          <div id="dang-ky" className="scroll-mt-20">
            <div className="bg-white rounded-card shadow-card border border-[#F5C49A] p-5 md:p-7 lg:p-8">
              <div className="text-center mb-5">
                <h2 className="font-display text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                  Đăng ký tư vấn miễn phí
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Để lại thông tin, Sata Robo sẽ liên hệ ngay
                </p>
              </div>
              <LeadForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
