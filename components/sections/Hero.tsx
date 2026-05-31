import Image from "next/image";
import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/shared/Container";

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
          {/* LEFT: Banner image */}
          <a href="#dang-ky" className="block scroll-mt-20" aria-label="Đăng ký học thử miễn phí">
            <Image
              src="/hero-banner.jpg"
              alt="Lập trình Robot RoboSim cơ bản cho trẻ 6–13 tuổi — Sata Robo"
              width={1920}
              height={820}
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="w-full h-auto rounded-card shadow-card"
            />
          </a>

          {/* RIGHT: Form (giữ nguyên) */}
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
