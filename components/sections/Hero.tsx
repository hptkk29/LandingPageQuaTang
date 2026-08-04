import Image from "next/image";

import { LeadForm } from "@/components/forms/LeadForm";
import { DeadlineStrip } from "@/components/shared/DeadlineStrip";
import { CAMPAIGN } from "@/lib/constants/campaign";
import heroBanner from "@/public/hero-banner.jpg";

const TICKS = [
  "Một chuyên gia kèm riêng một bạn — không phải buổi tư vấn",
  "Con tự lập trình robot trên phần mềm mô phỏng RoboSim",
  "Không mất phí, không ràng buộc học tiếp",
];

const STATS = [
  { num: "1-1", lbl: "kèm riêng cùng chuyên gia" },
  { num: "90'", lbl: "thời lượng buổi học" },
  { num: `${CAMPAIGN.totalSlots}`, lbl: "suất mỗi đợt" },
  { num: "0đ", lbl: "học phí" },
];

export function Hero() {
  return (
    <section className="hero hero--split">
      <span className="doodle star4 floaty" style={{ top: "10%", left: "3%" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.7 5.5 1 5.8 6.5 6.5C13 7.2 12.7 7.5 12 13c-.7-5.5-1-5.8-6.5-6.5C11 5.8 11.3 5.5 12 0Z" /></svg>
      </span>

      <div className="container container--xl">
        <div className="hero-grid">
          {/* ===== TRÁI: banner ===== */}
          <div className="hero-banner">
            <Image
              src={heroBanner}
              alt="Lập trình Robot RoboSim cơ bản cho trẻ 6–13 tuổi — Sata Robo"
              priority
              fetchPriority="high"
              sizes="(max-width: 1023px) 100vw, 68vw"
              className="hero-banner__img"
            />
            <p className="hero-banner__flag">
              🎁 TẶNG <b>{CAMPAIGN.totalSlots} SUẤT TRẢI NGHIỆM 1-1 CÙNG CHUYÊN GIA</b> — PHÁT TRIỂN TƯ DUY CÔNG NGHỆ
            </p>
          </div>

          {/* ===== TRÁI (dưới banner): thông điệp suất trải nghiệm 1 kèm 1 =====
              Đặt TRƯỚC form trong DOM để h1 đứng trước h2 (đúng thứ bậc heading
              cho SEO/screen reader); vị trí hiển thị do grid-template-areas lo. */}
          <div className="hero-copy">
            <div className="live-badge">
              <span className="dot" />
              <span>Đang nhận đăng ký — lịch học linh hoạt</span>
            </div>

            <h1>
              Tặng con <em>buổi trải nghiệm {CAMPAIGN.trial.format} cùng chuyên gia</em> phát triển tư duy công nghệ
            </h1>

            <p className="lede">
              Lập trình robot RoboSim cho trẻ 6–13 tuổi tại Đà Nẵng. Một chuyên gia
              kèm riêng con {CAMPAIGN.trial.duration}: đo năng lực, chọn đúng bài và
              con tự hoàn thành một sản phẩm ngay tại lớp.
            </p>

            <ul className="hero-ticks">
              {TICKS.map((t) => (
                <li key={t}>
                  <span className="tick">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="stats-row">
              {STATS.map((s) => (
                <div className="stat" key={s.lbl}>
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== PHẢI: form đăng ký (sticky trên desktop) ===== */}
          <aside className="hero-aside" id="dang-ky">
            <div className="form-card form-card--hero">
              <span className="ribbon">🎁 TRẢI NGHIỆM 1-1 MIỄN PHÍ</span>
              <h2>Đăng ký suất trải nghiệm 1-1</h2>
              <p className="sub">
                Điền 3 thông tin — Sata Robo gọi lại xếp lịch học cho con tại{" "}
                <strong style={{ color: "var(--red-500)" }}>2 cơ sở Đà Nẵng</strong>
              </p>

              <DeadlineStrip slots={CAMPAIGN.totalSlots} />

              <LeadForm
                source="hero"
                compact
                submitLabel="Nhận suất trải nghiệm miễn phí →"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
