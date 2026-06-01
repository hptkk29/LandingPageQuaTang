const COMMITMENTS = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>,
    title: "Hoàn tiền 100%",
    desc: "Không hài lòng sau buổi học đầu tiên — hoàn lại toàn bộ học phí.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: "Lớp ≤ 12 học viên",
    desc: "Sĩ số nhỏ, giáo viên kèm sát từng con, không ai bị bỏ lại.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V4" /><circle cx="9" cy="14" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="14" r="1.3" fill="currentColor" stroke="none" /></svg>,
    title: "RoboSim bắt buộc thi 2026",
    desc: "Mọi học viên được chuẩn bị và tham gia giải đấu RoboSim 2026.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z" /></svg>,
    title: "Thưởng du lịch 3–7 triệu",
    desc: "Phần thưởng hấp dẫn cho học viên có thành tích xuất sắc.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>,
    title: "Thuyết trình cuối học phần",
    desc: "Con trình bày sản phẩm trước ba mẹ — rèn sự tự tin và kỹ năng nói.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>,
    title: "Hỗ trợ thi quốc gia 3 triệu",
    desc: "Hỗ trợ chi phí cho học viên tham gia các kỳ thi cấp quốc gia.",
  },
];

export function Commitments() {
  return (
    <section id="cam-ket" className="section section--white" style={{ scrollMarginTop: 80 }}>
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onlight">Cam kết của Sata Robo</span>
          <h2 className="sticker sticker--red">6 cam kết cho hành trình<br />học của <span className="hl">con</span></h2>
        </div>
        <div className="grid-cards grid-3">
          {COMMITMENTS.map((c, i) => (
            <article className="commit" key={c.title}>
              <div className="top"><span className="no">{i + 1}</span><span className="gear-chip">{c.icon}</span></div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
