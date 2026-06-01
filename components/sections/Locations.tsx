import Image from "next/image";
import { CAMPAIGN } from "@/lib/constants/campaign";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);

const LOCATIONS = [
  { ph: "Cơ sở 1 · phòng lab", img: "/anh-phong-lab-cs1.jpg", chipBg: "var(--orange-500)", n: "Cơ sở 1", addr: "211 Nguyễn Hữu Thọ", dist: "Hoà Cường, Đà Nẵng", q: "211 Nguyễn Hữu Thọ, Hoà Cường, Đà Nẵng" },
  { ph: "Cơ sở 2 · phòng lab", img: "/anh-phong-lab-cs2.jpg", chipBg: "var(--blue)", n: "Cơ sở 2", addr: "114 Hoàng Diệu", dist: "Hải Châu, Đà Nẵng", q: "114 Hoàng Diệu, Hải Châu, Đà Nẵng" },
];

export function Locations() {
  return (
    <section id="co-so" className="section section--white" style={{ scrollMarginTop: 80 }}>
      <div className="container">
        <div className="head">
          <span className="kicker kicker--onlight">Hệ thống cơ sở</span>
          <h2 className="sticker sticker--red">2 cơ sở thuận tiện tại <span className="hl">Đà Nẵng</span></h2>
          <p>Trang thiết bị hiện đại, không gian thực hành an toàn cho con.</p>
        </div>
        <div className="grid-cards grid-2" style={{ maxWidth: 880, marginInline: "auto" }}>
          {LOCATIONS.map((l) => (
            <article className="loc" key={l.n}>
              <div className="ph">
                <Image src={l.img} alt={l.ph} fill sizes="(max-width:620px) 100vw, 440px" style={{ objectFit: "cover" }} />
              </div>
              <div className="body">
                <div className="top">
                  <span className="gear-chip" style={{ background: l.chipBg }}><PinIcon /></span>
                  <div>
                    <h3>{l.n}</h3>
                    <p className="addr">{l.addr}</p>
                    <p className="dist">{l.dist}</p>
                  </div>
                </div>
                <a className="maps" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.q)}`} target="_blank" rel="noopener noreferrer">
                  Xem trên Google Maps <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="loc-help">
          Cần hỗ trợ? Gọi hotline <a href={`tel:${CAMPAIGN.hotlineDigits}`}>{CAMPAIGN.hotline}</a> hoặc{" "}
          <a href={`https://zalo.me/${CAMPAIGN.hotlineDigits}`} target="_blank" rel="noopener noreferrer">chat Zalo</a>.
        </p>
      </div>
    </section>
  );
}
