/**
 * "Sau 90 phút, ba mẹ sẽ biết con đang ở đâu" — section đặt ngay dưới hero để
 * trả lời câu hỏi đầu tiên của phụ huynh: buổi trải nghiệm 1 kèm 1 diễn ra thế nào.
 * Timeline 90 phút do trung tâm cung cấp (kịch bản thật của buổi trải nghiệm).
 */
const SESSIONS = [
  {
    no: 1,
    color: "b-blue",
    time: "0–15 phút",
    title: "Kiểm tra năng lực lập trình",
    desc: "Giáo viên đánh giá con đang ở đâu: đọc hiểu câu lệnh, tư duy logic và tốc độ xử lý.",
  },
  {
    no: 2,
    color: "b-orange",
    time: "15–30 phút",
    title: "Chọn đúng bài cho con",
    desc: "Dựa trên kết quả vừa đo, bài học được chọn vừa sức con thay vì dạy chung một giáo án.",
  },
  {
    no: 3,
    color: "b-green",
    time: "30–75 phút",
    title: "Con tự làm sản phẩm",
    desc: "Con lập trình xe robot trên RoboSim, đúng phần mềm dùng trong Cuộc thi Sáng tạo Robotics 2026.",
  },
  {
    no: 4,
    color: "b-yellow",
    time: "75–90 phút",
    title: "Con trình bày cho ba mẹ",
    desc: "Con chạy thử sản phẩm và tự giải thích cách mình đã làm, ba mẹ nghe trực tiếp từ con.",
  },
];

export function FourSessions() {
  return (
    <section id="bon-buoi" className="section section--red four-sessions" style={{ scrollMarginTop: 80 }}>
      <div className="container container--xl">
        <div className="head">
          <span className="kicker kicker--onred">Buổi trải nghiệm 1 kèm 1 · Miễn phí 100%</span>
          <h2 className="sticker sticker--light">
            Sau 90 phút, <span className="hl">ba mẹ sẽ biết con đang ở đâu</span>
          </h2>
          <p>
            Không phải buổi tư vấn hay demo. Một giáo viên kèm riêng một bạn trong 90 phút.
            Con được kiểm tra năng lực lập trình, tự hoàn thành một sản phẩm và chạy thử
            cho ba mẹ xem ngay tại lớp.
          </p>
        </div>

        <div className="grid-cards grid-4 sessions">
          {SESSIONS.map((s) => (
            <article className="session" key={s.no}>
              <span className={`badge-no ${s.color}`}>{s.no}</span>
              <span className={`session-time ${s.color}`}>{s.time}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>

        <div className="sessions-facts">
          <span className="fact">Cuối buổi ba mẹ nhận phiếu đánh giá năng lực của con</span>
        </div>

        <div className="sessions-cta">
          <a className="btn btn--white btn--lg" href="#dang-ky">
            🎁 Nhận suất trải nghiệm 1-1 miễn phí cho con →
          </a>
          <p>Miễn phí 100% · Không ràng buộc học tiếp sau buổi trải nghiệm</p>
        </div>
      </div>
    </section>
  );
}
