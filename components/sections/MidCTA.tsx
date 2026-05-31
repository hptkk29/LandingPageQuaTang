import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/shared/Container";

export function MidCTA() {
  return (
    <section className="py-14 md:py-24 bg-gradient-to-br from-cta-500 to-cta-700">
      <Container size="xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight mb-5">
              Đừng để con bỏ lỡ cơ hội với RoboSim 2026
            </h2>
            <p className="text-lg text-white/90 mb-7 leading-relaxed">
              Đăng ký ngay để nhận tư vấn lộ trình miễn phí và giữ chỗ ưu đãi
              tuyển sinh cho con.
            </p>
            <ul className="space-y-3">
              {[
                "Tư vấn 1-1 lộ trình phù hợp với con",
                "Trải nghiệm buổi học thử miễn phí",
                "Cam kết hoàn tiền 100% nếu không hài lòng",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-white text-cta-600 font-bold flex items-center justify-center">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            id="dang-ky-2"
            className="bg-white rounded-card shadow-card p-5 md:p-7 lg:p-8 scroll-mt-20"
          >
            <h3 className="font-display text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-1">
              Đăng ký tư vấn miễn phí
            </h3>
            <p className="text-center text-gray-600 mb-5 text-sm md:text-base">
              Chỉ mất 30 giây để giữ chỗ cho con
            </p>
            <LeadForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
