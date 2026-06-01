import { LeadForm } from "@/components/forms/LeadForm";

const BULLETS = [
  "Tư vấn 1-1 lộ trình phù hợp với con",
  "Trải nghiệm buổi học thử miễn phí",
  "Cam kết hoàn tiền 100% nếu không hài lòng",
];

export function MidCTA() {
  return (
    <section className="section section--red midcta">
      <div className="container container--xl">
        <div className="grid">
          <div>
            <h2>Đừng để con bỏ lỡ cơ hội với RoboSim 2026</h2>
            <p className="lede">Đăng ký ngay để nhận tư vấn lộ trình miễn phí và giữ chỗ ưu đãi tuyển sinh cho con.</p>
            <ul>
              {BULLETS.map((b) => (
                <li key={b}>
                  <span className="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div id="dang-ky-2" style={{ scrollMarginTop: 90 }}>
            <div className="form-card">
              <h2 style={{ marginTop: 0 }}>Đăng ký tư vấn miễn phí</h2>
              <p className="sub">Chỉ mất 30 giây để giữ chỗ cho con</p>
              <LeadForm source="mid-cta" submitLabel="Giữ chỗ cho con ngay →" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
