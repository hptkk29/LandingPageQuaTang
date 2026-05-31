import { LeadForm } from "@/components/forms/LeadForm";
import { Container } from "@/components/shared/Container";
import { CAMPAIGN } from "@/lib/constants/campaign";

export function FinalCTA() {
  return (
    <section className="py-14 md:py-24 bg-surface-50">
      <Container size="md">
        <div className="text-center mb-8 md:mb-10">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-cta-600 mb-3">
            Sẵn sàng cho con bắt đầu?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-cta-700 leading-tight mb-4">
            Đăng ký giữ chỗ cho con ngay hôm nay
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Số lượng lớp có hạn ở mỗi cơ sở. Để lại thông tin — Sata Robo liên hệ
            tư vấn lộ trình phù hợp nhất cho con.
          </p>
        </div>

        <div
          id="dang-ky-3"
          className="bg-white rounded-card shadow-card border border-[#F5C49A] p-5 md:p-8 max-w-xl mx-auto scroll-mt-20"
        >
          <LeadForm />
        </div>

        <p className="text-center mt-6 text-gray-600">
          Hoặc gọi ngay hotline{" "}
          <a
            href={`tel:${CAMPAIGN.hotlineDigits}`}
            className="font-display font-bold text-cta-600 hover:text-cta-700"
          >
            {CAMPAIGN.hotline}
          </a>
        </p>
      </Container>
    </section>
  );
}
