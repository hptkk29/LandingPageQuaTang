import { CAMPAIGN } from "@/lib/constants/campaign";

export function FinalCTA() {
  return (
    <section className="section section--white">
      <div className="container container--md">
        <div className="finalcta-card">
          <span className="kicker kicker--onlight" style={{ marginBottom: 14 }}>Sẵn sàng cho con bắt đầu?</span>
          <h2>Đăng ký giữ chỗ cho con ngay hôm nay</h2>
          <p>Số lượng lớp có hạn ở mỗi cơ sở. Đăng ký ngay để Sata Robo liên hệ tư vấn lộ trình phù hợp nhất cho con.</p>
          <a className="btn btn--cta btn--lg btn--pulse" href="#dang-ky">🎁 Đăng ký ngay →</a>
          <p className="phone-note">Hoặc gọi ngay hotline <a href={`tel:${CAMPAIGN.hotlineDigits}`}>{CAMPAIGN.hotline}</a></p>
        </div>
      </div>
    </section>
  );
}
