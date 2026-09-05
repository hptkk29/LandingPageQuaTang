import { LeadForm } from "@/components/forms/LeadForm";
import { CAMPAIGN } from "@/lib/constants/campaign";

const BULLETS = [
  "Buổi trải nghiệm 1-1 cùng chuyên gia, miễn phí 100%",
  "Phiếu đánh giá năng lực của con ngay cuối buổi",
  "Cam kết hoàn tiền 100% nếu không hài lòng",
];

export function MidCTA() {
  return (
    <section className="section section--cream midcta">
      <div className="container container--xl">
        <div className="grid">
          <div>
            <h2 className="midcta__title">Đừng để con bỏ lỡ suất trải nghiệm 1-1 miễn phí</h2>
            <p className="lede">Đợt này chỉ có {CAMPAIGN.totalSlots} suất. Đăng ký ngay để giữ chỗ buổi trải nghiệm 1 kèm 1 cho con và nhận tư vấn lộ trình miễn phí.</p>
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
              <h2 style={{ marginTop: 0 }}>Đăng ký suất trải nghiệm 1-1</h2>
              <p className="sub">
                Suất học tuần này có hạn tại{" "}
                <strong style={{ color: "var(--red-500)" }}>2 cơ sở Đà Nẵng</strong>{" "}
                — đăng ký sớm để giữ chỗ
              </p>
              <LeadForm source="mid-cta" submitLabel="Giữ chỗ cho con ngay →" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
