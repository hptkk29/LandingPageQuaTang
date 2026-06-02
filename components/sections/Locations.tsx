import Image from "next/image";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
);

const LOCATIONS = [
  { ph: "Cơ sở 1 · phòng lab", img: "/anh-phong-lab-cs1.jpg", chipBg: "var(--orange-500)", n: "Cơ sở 1", addr: "211 Nguyễn Hữu Thọ", dist: "Hoà Cường, Đà Nẵng", phone: "0818.823.720", phoneDigits: "0818823720", q: "211 Nguyễn Hữu Thọ, Hoà Cường, Đà Nẵng" },
  { ph: "Cơ sở 2 · phòng lab", img: "/anh-phong-lab-cs2.jpg", chipBg: "var(--blue)", n: "Cơ sở 2", addr: "114 Hoàng Diệu", dist: "Hải Châu, Đà Nẵng", phone: "0702.193.933", phoneDigits: "0702193933", q: "114 Hoàng Diệu, Hải Châu, Đà Nẵng" },
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
                <a className="maps" href={`tel:${l.phoneDigits}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                  <span style={{ width: 17, height: 17, display: "inline-grid", placeItems: "center" }}><PhoneIcon /></span>
                  {l.phone}
                </a>
                <br />
                <a className="maps" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.q)}`} target="_blank" rel="noopener noreferrer">
                  Xem trên Google Maps <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="loc-help">
          Cần tư vấn cho con?{" "}
          <a href="#dang-ky">Đăng ký ngay</a> để Sata Robo gọi lại — hoặc gọi trực tiếp cơ sở gần bạn ở trên.
        </p>
      </div>
    </section>
  );
}
