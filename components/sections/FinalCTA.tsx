import { CAMPAIGN } from "@/lib/constants/campaign";

export function FinalCTA() {
  return (
    <section id="cta-cuoi" className="section section--white" style={{ scrollMarginTop: 80 }}>
      <div className="container container--md">
        <div className="finalcta-card">
          <span className="kicker kicker--onlight" style={{ marginBottom: 14 }}>Sẵn sàng cho con bắt đầu?</span>
          <h2>Nhận buổi trải nghiệm 1-1 miễn phí cho con</h2>
          <p>Mỗi đợt chỉ có {CAMPAIGN.totalSlots} suất cho cả 2 cơ sở. Đăng ký ngay để Sata Robo liên hệ xếp lịch học và tư vấn lộ trình phù hợp nhất cho con.</p>
          <a className="btn btn--cta btn--lg btn--pulse" href="#dang-ky">🎁 Nhận suất trải nghiệm&nbsp;1-1&nbsp;→</a>
          <p className="phone-note">
            Hoặc gọi:{" "}
            {CAMPAIGN.locations.map((loc, i) => (
              // nowrap giữ tên cơ sở dính với số điện thoại; inline-block để
              // hai cụm XUỐNG DÒNG được với nhau — nếu chỉ nowrap thì ở 320px
              // chúng nằm cùng một dòng và tràn ra ngoài container.
              <span key={loc.key} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
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
