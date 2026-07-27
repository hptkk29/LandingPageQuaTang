import { CAMPAIGN } from "@/lib/constants/campaign";

/**
 * "4 buổi trải nghiệm gồm gì" — section đặt ngay dưới hero để trả lời câu hỏi
 * đầu tiên của phụ huynh sau khi thấy lời mời tặng 4 buổi.
 * Nội dung 4 buổi do trung tâm cung cấp (giáo án thật của đợt trải nghiệm).
 */
const SESSIONS = [
  {
    no: 1,
    color: "b-blue",
    title: "Làm quen phần mềm mô phỏng RoboSim",
    desc: "Con làm quen phần mềm mô phỏng RoboSim và được thực hành lắp ráp robot ngay trên phần mềm.",
  },
  {
    no: 2,
    color: "b-orange",
    title: "Câu lệnh kéo–thả cho xe robot di chuyển",
    desc: "Con làm quen các câu lệnh kéo–thả đơn giản để điều khiển xe robot di chuyển trên phần mềm mô phỏng.",
  },
  {
    no: 3,
    color: "b-green",
    title: "Dự án “Cùng em đến trường”",
    desc: "Con lập trình xe robot di chuyển theo đường line trên một sa bàn đơn giản trong phần mềm mô phỏng.",
  },
  {
    no: 4,
    color: "b-yellow",
    title: "Dự án “Giải cứu nhà máy công nghiệp”",
    desc: "Tương tự buổi 3 nhưng con tự thực hiện trọn dự án, không cần thầy cô hướng dẫn.",
  },
];

const FACTS = [
  { icon: "⏱️", text: `${CAMPAIGN.classDuration}` },
  { icon: "📅", text: `Lịch linh hoạt: ${CAMPAIGN.schedule}` },
  { icon: "👨‍👩‍👧", text: `Lớp ≤${CAMPAIGN.maxStudents} học viên` },
  { icon: "📍", text: "2 cơ sở tại Đà Nẵng" },
];

export function FourSessions() {
  return (
    <section id="bon-buoi" className="section section--red four-sessions" style={{ scrollMarginTop: 80 }}>
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onred">Quà tặng dành cho ba mẹ</span>
          <h2 className="sticker sticker--light">
            {CAMPAIGN.totalSessions} buổi trải nghiệm <span className="hl">con học được gì?</span>
          </h2>
          <p>
            Không phải buổi tư vấn hay demo. Đây là {CAMPAIGN.totalSessions} buổi học thật
            trên lớp — con tự tay lắp ráp và lập trình robot trên phần mềm mô phỏng RoboSim,
            khép lại bằng 2 dự án con tự hoàn thành.
          </p>
        </div>

        <div className="grid-cards grid-4 sessions">
          {SESSIONS.map((s) => (
            <article className="session" key={s.no}>
              <span className={`badge-no ${s.color}`}>{s.no}</span>
              <h3>Buổi {s.no} · {s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>

        <div className="sessions-facts">
          {FACTS.map((f) => (
            <span className="fact" key={f.text}>
              <span aria-hidden>{f.icon}</span> {f.text}
            </span>
          ))}
        </div>

        <div className="sessions-cta">
          <a className="btn btn--white btn--lg" href="#dang-ky">
            🎁 Nhận {CAMPAIGN.totalSessions} buổi miễn phí cho con →
          </a>
          <p>Miễn phí 100% · Không ràng buộc học tiếp sau {CAMPAIGN.totalSessions} buổi</p>
        </div>
      </div>
    </section>
  );
}
