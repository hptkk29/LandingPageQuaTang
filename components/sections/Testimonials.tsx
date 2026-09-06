"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  { av: "Đ", quote: "Lớp sĩ số nhỏ, thầy cô nhiệt tình. Con đã đoạt giải Robothon cấp tỉnh tháng trước.", name: "Anh Trần Văn Đức", role: "PH bé Bin (10 tuổi)", loc: "Liên Chiểu, Đà Nẵng" },
  { av: "A", quote: "Sata Robo triển khai Lab STEM cho trường rất chuyên nghiệp. GV được training kỹ, HS rất hào hứng.", name: "Cô Lê Hoài Anh", role: "Đại diện một trường Tiểu học", loc: "Sơn Trà, Đà Nẵng" },
  { av: "H", quote: "Con học RoboSim được 3 tháng. Từ ghét toán giờ con say mê logic, tự code đèn nháy. Tuyệt vời!", name: "Chị Nguyễn Thị Hà", role: "PH bé Tom (8 tuổi)", loc: "Hải Châu, Đà Nẵng" },
  { av: "B", quote: "Con đậu vòng quốc gia WRO 2025! Cảm ơn các thầy cô đã định hướng đúng đắn cho con.", name: "Anh Hoàng Quốc Bảo", role: "PH bé Bống (12 tuổi)", loc: "Thanh Khê, Đà Nẵng" },
  { av: "D", quote: "Giá hợp lý, con vui mỗi buổi. Khoá K2 con đã làm được robot nhặt rác hoàn chỉnh!", name: "Chị Vũ Thuỳ Dương", role: "PH bé An (9 tuổi)", loc: "Ngũ Hành Sơn, Đà Nẵng" },
];

function TCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <article className="tcard">
      <div className="stars">★★★★★</div>
      <p className="quote">&ldquo;{t.quote}&rdquo;</p>
      <div className="who">
        <span className="av">{t.av}</span>
        <span>
          <b>{t.name}</b>
          <small>{t.role}</small>
          <small>📍 {t.loc}</small>
        </span>
      </div>
    </article>
  );
}

export function Testimonials() {
  // nhân đôi để marquee lặp liền mạch
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  // WCAG 2.2.2: nội dung tự chạy quá 5 giây phải có cách dừng. Trước đây chỉ
  // dừng khi rê chuột — người dùng bàn phím và người dùng chạm không có cách nào.
  const [paused, setPaused] = useState(false);

  // Ai đã bật "giảm chuyển động" thì dừng hẳn từ đầu, không chỉ rút ngắn
  // thời lượng như quy tắc chung trong globals.css.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPaused(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section className="section section--white">
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onlight">Phụ huynh nói gì</span>
          <h2 className="sticker sticker--red">1500+ phụ huynh <span className="hl">tin tưởng</span></h2>
        </div>
      </div>
      <div className={`marquee-wrap ${paused ? "is-paused" : ""}`}>
        {/* tabIndex + overflow-x:auto (CSS) để cuộn được bằng bàn phím khi dừng */}
        <div
          className="marquee-scroll"
          tabIndex={0}
          role="group"
          aria-label="Đánh giá của phụ huynh"
        >
          <div className="marquee">
            {loop.map((t, i) => (<TCard key={`${t.name}-${i}`} t={t} />))}
          </div>
        </div>
      </div>
      <div className="marquee-ctrl">
        <button
          type="button"
          className="marquee-btn"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
        >
          {paused ? (
            <><span aria-hidden>▶</span> Chạy lại băng đánh giá</>
          ) : (
            <><span aria-hidden>❚❚</span> Tạm dừng băng đánh giá</>
          )}
        </button>
      </div>
    </section>
  );
}
