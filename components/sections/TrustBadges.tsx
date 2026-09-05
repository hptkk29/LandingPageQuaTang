import { Carousel } from "@/components/shared/Carousel";

const STATS = [
  { num: "1500+", lbl: "Học viên đã đào tạo" },
  { num: "2", lbl: "Cơ sở tại Đà Nẵng" },
  { num: "15+", lbl: "Giải thưởng đạt được" },
  { num: "100%", lbl: "Phụ huynh hài lòng" },
];

const PARTNERS = ["Thành Đoàn Đà Nẵng", "Báo Sở hữu trí tuệ", "Nghị quyết 57"];

export function TrustBadges() {
  return (
    <section className="section section--white trust-section">
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onlight">Niềm tin từ cộng đồng</span>
          <h2 className="sticker sticker--red">Được phụ huynh &amp; đối tác<br />Đà Nẵng <span className="hl">tin tưởng</span></h2>
        </div>
        <Carousel className="md:grid-cols-4">
          {STATS.map((s, i) => (
            // data-i thay cho :nth-child — Carousel bọc mỗi thẻ trong một
            // wrapper riêng nên thẻ nào cũng là con thứ 1 và bộ 4 màu viền dưới
            // (cam/xanh dương/xanh lá/đỏ) không bao giờ được áp dụng.
            <div className="tb-stat" data-i={i} key={s.lbl}>
              <div className="num">{s.num}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </Carousel>
        <p className="partners-label">Đồng hành &amp; bảo trợ</p>
        <div className="partners">
          {PARTNERS.map((p) => (<div className="partner" key={p}>{p}</div>))}
        </div>
      </div>
    </section>
  );
}
