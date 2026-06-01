import Image from "next/image";

const ZIGS = [
  {
    ph: "Học qua giải quyết vấn đề",
    img: "/anh-hoc-qua-giai-quyet-van-de.jpg",
    pill: "01 · Robot thật + RoboSim",
    pillBg: "var(--blue)",
    title: "Học chắc lý thuyết, tự tin lập trình",
    desc: "Con học trên phần mềm mô phỏng RoboSim chuẩn quốc tế VÀ thực hành với robot thật — nắm chắc nguyên lý rồi mới làm thật, học chắc và an toàn.",
  },
  {
    ph: "Thi đấu robot",
    img: "/anh-con-thi-dau.jpg",
    pill: "02 · Thi đấu thật 2026",
    pillBg: "var(--orange-500)",
    title: "Không học cho vui — con tranh tài thật",
    desc: "Con được rèn để tham gia các giải đấu robot thực tế, cọ xát và trưởng thành. Lộ trình hướng thẳng tới giải đấu RoboSim 2026.",
  },
  {
    ph: "Con thuyết trình",
    img: "/anh-con-thuyet-trinh.jpg",
    pill: "03 · Thuyết trình trước ba mẹ",
    pillBg: "var(--green)",
    title: "Rèn bản lĩnh sân khấu & diễn đạt",
    desc: "Cuối mỗi học phần, con thuyết trình sản phẩm trước ba mẹ — rèn sự tự tin, khả năng diễn đạt và tinh thần làm chủ thành quả.",
  },
];

export function CourseInfo() {
  return (
    <section id="khac-biet" className="section section--cream" style={{ scrollMarginTop: 80 }}>
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onlight">Điểm khác biệt</span>
          <h2 className="sticker sticker--red">Chương trình học tại Sata Robo<br />có gì <span className="hl">khác biệt</span>?</h2>
        </div>

        {ZIGS.map((z) => (
          <div className="zig" key={z.pill}>
            <div className="ph ph--ring">
              <Image src={z.img} alt={z.ph} fill sizes="(max-width:820px) 100vw, 45vw" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <span className="label-pill" style={{ background: z.pillBg }}>{z.pill}</span>
              <h3>{z.title}</h3>
              <p>{z.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
