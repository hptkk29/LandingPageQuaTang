import { Container } from "@/components/shared/Container";
import { CAMPAIGN } from "@/lib/constants/campaign";

export function FinalCTA() {
  return (
    <section className="py-14 md:py-24 bg-white">
      <Container size="md">
        <div className="text-center max-w-2xl mx-auto bg-cta-50 border border-[#F5C49A] rounded-card shadow-soft px-6 py-10 md:px-10 md:py-12">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-cta-600 mb-3">
            Sẵn sàng cho con bắt đầu?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-cta-700 leading-tight mb-4">
            Đăng ký giữ chỗ cho con ngay hôm nay
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-8">
            Số lượng lớp có hạn ở mỗi cơ sở. Đăng ký ngay để Sata Robo liên hệ tư
            vấn lộ trình phù hợp nhất cho con.
          </p>

          <a
            href="#dang-ky"
            className="inline-flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-600 text-white font-display font-extrabold text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-button shadow-cta transition-all hover:-translate-y-0.5"
          >
            🎁 Đăng ký ngay →
          </a>

          <p className="mt-6 text-gray-600">
            Hoặc gọi ngay hotline{" "}
            <a
              href={`tel:${CAMPAIGN.hotlineDigits}`}
              className="font-display font-bold text-cta-600 hover:text-cta-700"
            >
              {CAMPAIGN.hotline}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
