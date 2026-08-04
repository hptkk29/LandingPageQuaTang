import { CAMPAIGN } from "@/lib/constants/campaign";

export function FinalCTA() {
  return (
    <section className="section section--white">
      <div className="container container--md">
        <div className="finalcta-card">
          <span className="kicker kicker--onlight" style={{ marginBottom: 14 }}>Sẵn sàng cho con bắt đầu?</span>
          <h2>Nhận buổi trải nghiệm 1-1 miễn phí cho con</h2>
          <p>Mỗi đợt chỉ có {CAMPAIGN.totalSlots} suất cho cả 2 cơ sở. Đăng ký ngay để Sata Robo liên hệ xếp lịch học và tư vấn lộ trình phù hợp nhất cho con.</p>
          <a className="btn btn--cta btn--lg btn--pulse" href="#dang-ky">🎁 Nhận suất trải nghiệm 1-1 →</a>
          <p className="phone-note">
            Hoặc gọi:{" "}
            {CAMPAIGN.locations.map((loc, i) => (
              <span key={loc.key}>
                {i > 0 ? " · " : ""}
                {loc.name} <a href={`tel:${loc.phoneDigits}`}>{loc.phone}</a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
