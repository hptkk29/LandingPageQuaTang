import { LeadForm } from "@/components/forms/LeadForm";

export function Hero() {
  return (
    <section className="hero">
      <span className="doodle star4 floaty" style={{ top: "14%", left: "6%" }}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 5.5 1 5.8 6.5 6.5C13 7.2 12.7 7.5 12 13c-.7-5.5-1-5.8-6.5-6.5C11 5.8 11.3 5.5 12 0Z" /></svg>
      </span>
      <span className="doodle star4 floaty" style={{ bottom: "18%", left: "46%", color: "var(--red-400)" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 5.5 1 5.8 6.5 6.5C13 7.2 12.7 7.5 12 13c-.7-5.5-1-5.8-6.5-6.5C11 5.8 11.3 5.5 12 0Z" /></svg>
      </span>

      <div className="container container--xl">
        <div className="grid">
          <div>
            <div className="live-badge"><span className="dot" /><span>Tuyển sinh RoboSim 2026</span></div>
            <h1>Lập trình Robot <em>RoboSim cơ bản</em> cho trẻ 6–13 tuổi</h1>
            <p className="lede">Khơi dậy đam mê công nghệ, rèn tư duy logic và sự tự tin cho con qua các khoá học lập trình robot thực hành.</p>
            <div className="chips"><span className="chip">ROBOTICS</span><span className="chip">ROBOSIM</span><span className="chip">CODING</span></div>
            <div className="stats-row">
              <div className="stat"><div className="num">≤12</div><div className="lbl">học viên / lớp</div></div>
              <div className="stat"><div className="num">2026</div><div className="lbl">RoboSim</div></div>
              <div className="stat"><div className="num">100%</div><div className="lbl">hoàn tiền</div></div>
            </div>
          </div>

          <div id="dang-ky" style={{ scrollMarginTop: 90 }}>
            <div className="form-card">
              <span className="ribbon">🎁 5 BUỔI MIỄN PHÍ</span>
              <h2>Đăng ký tư vấn miễn phí</h2>
              <p className="sub">Để lại thông tin, Sata Robo sẽ liên hệ ngay</p>
              <LeadForm source="hero" submitLabel="Nhận 5 buổi miễn phí →" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
