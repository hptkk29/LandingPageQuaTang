const ZIGS = [
  {
    ph: "ảnh: học qua giải quyết vấn đề",
    pill: "01 · Robot thật + RoboSim",
    pillBg: "var(--blue)",
    title: "Học chắc lý thuyết, tự tin lập trình",
    desc: "Con học trên phần mềm mô phỏng RoboSim chuẩn quốc tế VÀ thực hành với robot thật — nắm chắc nguyên lý rồi mới làm thật, học chắc và an toàn.",
  },
  {
    ph: "ảnh: thi đấu robot",
    pill: "02 · Thi đấu thật 2026",
    pillBg: "var(--orange-500)",
    title: "Không học cho vui — con tranh tài thật",
    desc: "Con được rèn để tham gia các giải đấu robot thực tế, cọ xát và trưởng thành. Lộ trình hướng thẳng tới giải đấu RoboSim 2026.",
  },
  {
    ph: "ảnh: con thuyết trình",
    pill: "03 · Thuyết trình trước ba mẹ",
    pillBg: "var(--green)",
    title: "Rèn bản lĩnh sân khấu & diễn đạt",
    desc: "Cuối mỗi học phần, con thuyết trình sản phẩm trước ba mẹ — rèn sự tự tin, khả năng diễn đạt và tinh thần làm chủ thành quả.",
  },
];

export function CourseInfo() {
  return (
    <section id="khac-biet" className="section section--red" style={{ scrollMarginTop: 80 }}>
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onred">Điểm khác biệt</span>
          <h2 className="sticker sticker--light">Chương trình học tại Sata Robo<br />có gì <span className="hl">khác biệt</span>?</h2>
        </div>

        {ZIGS.map((z) => (
          <div className="zig" key={z.pill}>
            <div className="ph ph--ring"><span>{z.ph}</span></div>
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
