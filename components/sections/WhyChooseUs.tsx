import Image from "next/image";

const ROWS = [
  {
    no: "1",
    color: "blue",
    label: "Biến thời gian màn hình thành sáng tạo",
    body: [
      "Thay vì chỉ giải trí, con dùng máy tính để thiết kế, lập trình và tạo ra sản phẩm robot của riêng mình.",
      "9–13 tuổi là giai đoạn vàng để con tiếp cận tư duy công nghệ một cách tự nhiên và hào hứng.",
    ],
    ph: "Con thực hành RoboSim",
    img: "/anh-con-thuc-hanh-robosim.jpg",
  },
  {
    no: "2",
    color: "orange",
    label: "Rèn tư duy & kiên nhẫn qua thực hành thật",
    body: [
      "Học qua dự án thực tế theo vòng lặp thử – sai – sửa. Con rèn tư duy logic, khả năng giải quyết vấn đề và sự kiên trì.",
      "Kết hợp lý thuyết và thực hành giúp con học tốt hơn cả các môn ở trường.",
    ],
    ph: "Lớp học dự án",
    img: "/anh-lop-hoc-du-an.jpg",
  },
  {
    no: "3",
    color: "green",
    label: "Tự tin khi có thành quả thật",
    body: [
      "Con tự tay lắp ráp, lập trình robot chạy được và thuyết trình về sản phẩm — sự tự tin đến từ thành quả cụ thể.",
      "Thay đổi hoàn toàn thói quen dùng công nghệ: từ người tiêu thụ thành người sáng tạo.",
    ],
    ph: "Con thuyết trình sản phẩm robot trên RoboSim",
    img: "/anh-con-thuyet-trinh.jpg",
  },
];

export function WhyChooseUs() {
  return (
    <section id="vi-sao" className="section section--cream" style={{ scrollMarginTop: 80 }}>
      <span className="doodle" style={{ top: "7%", left: "4%" }}><span style={{ display: "inline-block", background: "var(--red-500)", color: "#fff", fontFamily: "var(--fontd)", fontWeight: 800, fontSize: ".8rem", padding: "6px 12px", borderRadius: 10, boxShadow: "var(--sh-pop)", transform: "rotate(-8deg)" }}>JAVA</span></span>
      <span className="doodle floaty" style={{ top: "6%", right: "6%" }}><span style={{ display: "inline-block", background: "var(--blue)", color: "#fff", fontFamily: "var(--fontd)", fontWeight: 800, fontSize: ".8rem", padding: "6px 12px", borderRadius: 10, boxShadow: "var(--sh-pop)", transform: "rotate(7deg)" }}>PHP</span></span>
      <span className="doodle" style={{ bottom: "5%", left: "7%" }}><span style={{ display: "inline-block", background: "var(--yellow)", color: "var(--red-700)", fontFamily: "var(--fontd)", fontWeight: 800, fontSize: ".8rem", padding: "6px 12px", borderRadius: 10, boxShadow: "var(--sh-pop)", transform: "rotate(6deg)" }}>PYTHON</span></span>

      <div className="container container--md">
        <div className="head">
          <span className="kicker kicker--onlight">Vì sao nên cho con học</span>
          <h2 className="sticker sticker--red">Học lập trình Robot<br />mang lại gì cho <span className="hl">con</span>?</h2>
        </div>

        {ROWS.map((r) => (
          <div className="why-row" key={r.no}>
            <div className="pill-head">
              <span className={`badge-no b-${r.color}`}>{r.no}</span>
              <span className={`label p-${r.color}`}>{r.label}</span>
            </div>
            <div className="body">
              <div className="txt">
                {r.body.map((t, i) => (<p key={i}>{t}</p>))}
              </div>
              <div className={`ph ph--${r.color}`}>
                <Image src={r.img} alt={r.ph} fill sizes="(max-width:760px) 100vw, 35vw" style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
