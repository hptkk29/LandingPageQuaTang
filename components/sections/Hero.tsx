import Image from "next/image";
import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/shared/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Banner làm nền cho cả section */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/hero-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Form đăng ký nổi trên nền banner */}
      <Container size="xl" className="relative z-10">
        <div className="flex justify-center lg:justify-end py-10 md:py-14 lg:py-20">
          <div
            id="dang-ky"
            className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-card shadow-card border border-[#F5C49A] p-5 md:p-7 scroll-mt-24"
          >
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
      </Container>
    </section>
  );
}
