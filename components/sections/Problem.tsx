const PAIN_POINTS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="11" x2="10" y2="11" /><line x1="8" y1="9" x2="8" y2="13" /><line x1="15" y1="12" x2="15" y2="12" /><line x1="18" y1="10" x2="18" y2="10" /><rect x="2" y="6" width="20" height="12" rx="6" /></svg>
    ),
    titleBefore: "Con ",
    tag: "chơi game",
    titleAfter: " cả ngày không chán",
    desc: "Màn hình chỉ để tiêu khiển, không tạo ra giá trị cho con.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2.5" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
    ),
    titleBefore: "",
    tag: "Nghiện máy tính, điện thoại",
    titleAfter: " nhưng không biết ứng dụng vào việc học",
    desc: "Phụ thuộc thiết bị mà thiếu hoạt động phát triển trí tuệ.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08A2.5 2.5 0 0 1 2 14.5a2.5 2.5 0 0 1 1.32-2.2A2.5 2.5 0 0 1 5 7.5 2.5 2.5 0 0 1 7 5a2.5 2.5 0 0 1 2.5-3Z" /></svg>
    ),
    titleBefore: "Con dễ ",
    tag: "mất tập trung",
    titleAfter: ", ảnh hưởng đến việc học",
    desc: "Khó ngồi yên, ngại những môn đòi hỏi tư duy và kiên nhẫn.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9" y2="9" /><line x1="15" y1="9" x2="15" y2="9" /></svg>
    ),
    titleBefore: "",
    tag: "Thiếu kỹ năng mềm:",
    titleAfter: " giải quyết vấn đề, giao tiếp, làm việc nhóm, thuyết trình",
    desc: "Chưa có thành quả thật để tự hào và tin vào bản thân.",
  },
];

function PCard({ p }: { p: (typeof PAIN_POINTS)[number] }) {
  return (
    <article className="p-card">
      <span className="gear-chip">{p.icon}</span>
      <div>
        <h3>{p.titleBefore}<span className="tagword">{p.tag}</span>{p.titleAfter}</h3>
        <p>{p.desc}</p>
      </div>
    </article>
  );
}

export function Problem() {
  return (
    <section id="van-de" className="section section--red" style={{ scrollMarginTop: 80 }}>
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onred">Ba mẹ có đang lo lắng?</span>
          <h2 className="sticker sticker--light">Nếu con thường xuyên<br />gặp phải các <span className="hl">vấn đề sau</span>:</h2>
        </div>
        <div className="problem-stage">
          <div className="problem-col">
            <PCard p={PAIN_POINTS[0]} />
            <PCard p={PAIN_POINTS[1]} />
          </div>
          <div className="problem-kid"><span>ảnh học viên · PNG nền trong</span></div>
          <div className="problem-col">
            <PCard p={PAIN_POINTS[2]} />
            <PCard p={PAIN_POINTS[3]} />
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: 40, fontFamily: "var(--fontd)", fontWeight: 700, fontSize: "clamp(1.1rem,2.2vw,1.5rem)", color: "#fff", position: "relative", zIndex: 2 }}>
          → Lập trình Robot RoboSim biến những nỗi lo đó thành cơ hội phát triển ↓
        </p>
      </div>
    </section>
  );
}
