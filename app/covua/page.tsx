import "./covua.css";

import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import {
  CAMPUSES,
  covuaContent,
  covuaHeroPhoto,
  covuaShots,
  covuaVideoSection,
} from "@/content/covua";
import { CovuaFaq } from "@/components/covua/CovuaFaq";
import { CovuaFloatingCta } from "@/components/covua/CovuaFloatingCta";
import { CovuaLeadForm } from "@/components/covua/CovuaLeadForm";
import { CovuaTracking } from "@/components/covua/CovuaTracking";
import { Footer } from "@/components/sections/Footer";

const C = covuaContent;

// SEO theo docs covua 05 §4. Canonical trỏ về subdomain để quatang.edu.vn/covua
// không bị coi là bản trùng. title absolute để né template "%s | Sata Robo"
// của layout gốc (tiêu đề đã có sẵn đuôi thương hiệu).
export const metadata: Metadata = {
  title: { absolute: "Nhận quà tặng dành cho thí sinh giải cờ vua | Sata Robo" },
  description:
    "Sata Robo trao khóa học lập trình Robot cho toàn bộ thí sinh giải cờ vua, kèm 20 suất học bổng trải nghiệm Robotics & AI cho thí sinh đoạt giải.",
  alternates: { canonical: "https://covua.quatang.edu.vn" },
  openGraph: {
    title: "Phần quà của con từ Sata Robo",
    description: "Quà tặng dành cho thí sinh giải cờ vua.",
    url: "https://covua.quatang.edu.vn",
    siteName: "Sata Robo",
    locale: "vi_VN",
    type: "website",
    // Ảnh toàn cảnh hội trường giải, crop 1200×630 (sinh từ covua-media/)
    images: ["/covua/og.jpg"],
  },
};

/** Nội dung trong content/covua.ts dùng **đậm** kiểu markdown — render thành <b>. */
function renderBold(text: string): ReactNode[] {
  return text
    .split("**")
    .map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : part));
}

const TICK = (
  <span className="tick" aria-hidden>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  </span>
);

export default function CovuaPage() {
  return (
    <>
      <main className="v2-root covua-root">
      <CovuaTracking />

      {/* 1 — Hero: chữ + CTA bên trái, ảnh Sata Robo đồng hành cùng giải bên
          phải. Không countdown, không "còn X suất" (docs covua 02 §4) */}
      <section className="section hero covua-hero">
        <div className="covua-board" aria-hidden />
        <div className="container covua-hero-grid">
          <div className="covua-hero-copy">
            <Image
              src="/logo-satarobo.jpg"
              alt="Sata Robo"
              width={160}
              height={56}
              className="covua-logo"
              priority
            />
            <span className="kicker kicker--onlight">{C.hero.eyebrow}</span>
            <h1 className="sticker sticker--red">{C.hero.title}</h1>
            <p className="lede">{C.hero.description}</p>
            <div className="covua-cta-row">
              <a className="btn btn--cta btn--lg" href="#dang-ky">
                {C.hero.primaryCta}
              </a>
              <a className="btn btn--covua-ghost btn--lg" href="#phan-qua">
                {C.hero.secondaryCta}
              </a>
            </div>
            <p className="covua-trust">{C.hero.trustLine}</p>
          </div>
          <div>
            <figure className="covua-hero-photo">
              <Image
                src={covuaHeroPhoto.src}
                width={covuaHeroPhoto.width}
                height={covuaHeroPhoto.height}
                alt={covuaHeroPhoto.alt}
                sizes="(min-width: 940px) 400px, 100vw"
                priority
              />
              <figcaption className="flag">{covuaHeroPhoto.flag}</figcaption>
            </figure>
            <p className="covua-hero-caption">{covuaHeroPhoto.caption}</p>
          </div>
        </div>
      </section>

      <div className="covua-divider" aria-hidden />

      {/* 2 — Hai phần quà: trọng tâm của trang; nhóm A nhận CẢ HAI món */}
      <section id="phan-qua" className="section section--cream" style={{ scrollMarginTop: 80 }}>
        <div className="container">
          <div className="head">
            <h2 className="sticker sticker--red">{C.gifts.title}</h2>
          </div>
          <div className="grid-cards grid-2">
            {C.gifts.cards.map((card) => (
              <article
                key={card.id}
                className={`gift-card ${card.id === "B" ? "gift-card--b" : ""}`}
              >
                <span className="gift-badge">{card.badge}</span>
                <h3>{card.title}</h3>
                <p className="cond">{card.condition}</p>
                <ul>
                  {card.items.map((item) => (
                    <li key={item}>
                      {TICK}
                      <span>{renderBold(item)}</span>
                    </li>
                  ))}
                </ul>
                <p className="hl-line">{card.highlight}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2b — Hình ảnh tại giải: 1 ảnh lớn + 2 ảnh nhỏ có chú thích. Ảnh nén
          sẵn + khai width/height để không giật layout (giữ CLS) */}
      <section className="section section--white">
        <div className="container">
          <div className="head">
            <h2 className="sticker sticker--red">{covuaShots.title}</h2>
            <p>{covuaShots.intro}</p>
          </div>
          <div className="covua-shots">
            <figure className="covua-shot">
              <Image
                src={covuaShots.featured.src}
                width={covuaShots.featured.width}
                height={covuaShots.featured.height}
                alt={covuaShots.featured.alt}
                sizes="(min-width: 1180px) 1132px, 100vw"
              />
              <figcaption>{covuaShots.featured.caption}</figcaption>
            </figure>
            <div className="covua-shots-row">
              {covuaShots.photos.map((p) => (
                <figure className="covua-shot" key={p.src}>
                  <Image
                    src={p.src}
                    width={p.width}
                    height={p.height}
                    alt={p.alt}
                    sizes="(min-width: 620px) 50vw, 100vw"
                  />
                  <figcaption>{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2c — Video tại giải: video dọc 9:16, preload=metadata chỉ tải khung
          hình đầu làm poster, bấm mới tải cả video */}
      <section className="section section--cream">
        <div className="container container--md">
          <div className="head">
            <h2 className="sticker sticker--red">{covuaVideoSection.title}</h2>
            <p>{covuaVideoSection.intro}</p>
          </div>
          <div className="covua-video-wrap">
            <video
              className="covua-video"
              src={covuaVideoSection.video.src}
              controls
              playsInline
              preload="metadata"
              aria-label={covuaVideoSection.video.label}
            />
          </div>
        </div>
      </section>

      {/* 3 — Con học được gì */}
      <section className="section section--white">
        <div className="covua-board" aria-hidden />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="head">
            <h2 className="sticker sticker--red">{C.learning.title}</h2>
          </div>
          <p className="covua-intro">{C.learning.intro}</p>
          <div className="grid-cards grid-2">
            {C.learning.points.map((p) => (
              <div className="covua-point" key={p.title}>
                <span className="gear-chip" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4m0 14v4M4.2 4.2l2.8 2.8m10 10 2.8 2.8M1 12h4m14 0h4M4.2 19.8l2.8-2.8m10-10 2.8-2.8" /></svg>
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Hai cơ sở học trực tiếp */}
      <section className="section section--cream">
        <div className="container">
          <div className="head">
            <h2 className="sticker sticker--red">{C.campusSection.title}</h2>
          </div>
          <div className="grid-cards grid-2">
            {CAMPUSES.map((cs) => (
              <div className="loc" key={cs.value}>
                <div className="body">
                  <div className="top">
                    <span className="gear-chip" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    </span>
                    <div>
                      <h3>{cs.shortLabel}</h3>
                      <p className="addr">{cs.address}</p>
                    </div>
                  </div>
                  <a
                    className="maps"
                    href={cs.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-3V6L9 9m0 9-6 3V9l6-3m0 12V6m6 9 6 3V6l-6-3" /></svg>
                    Xem trên Google Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="loc-help">{C.campusSection.note}</p>
        </div>
      </section>

      {/* 5 — Form đăng ký */}
      <section id="dang-ky" className="section section--white" style={{ scrollMarginTop: 80 }}>
        <div className="covua-board" aria-hidden />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <CovuaLeadForm />
        </div>
      </section>

      {/* 6 — Cách nhận quà: chuỗi tuần tự nên đánh số 01/02/03 là hợp lệ */}
      <section className="section section--cream">
        <div className="container">
          <div className="head">
            <h2 className="sticker sticker--red">{C.steps.title}</h2>
          </div>
          <div className="grid-cards grid-3">
            {C.steps.items.map((step, i) => (
              <div className="covua-step" key={step.no}>
                <span className={`badge-no ${["b-orange", "b-blue", "b-green"][i] ?? ""}`}>
                  {step.no}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — FAQ */}
      <section className="section section--white">
        <div className="container container--md">
          <div className="head">
            <h2 className="sticker sticker--red">{C.faq.title}</h2>
          </div>
          <CovuaFaq />
        </div>
      </section>

      {/* Dòng bảo mật (docs covua 03 §9) — footer dùng chung của quatang */}
      <p className="covua-privacy">
        Thông tin đăng ký chỉ dùng để liên hệ trao quà và tư vấn khóa học,
        không chia sẻ cho bên thứ ba.
      </p>
      <CovuaFloatingCta />
      </main>
      {/* Footer dùng chung với trang quatang — import, không sửa file gốc.
          Wrapper để covua.css nén khoảng cách trên mobile. */}
      <div className="covua-footer-wrap">
        <Footer />
      </div>
    </>
  );
}
