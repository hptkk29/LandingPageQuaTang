"use client";

import { useState } from "react";

const FAQS = [
  { q: "Con 6 tuổi học được không? Chưa biết gì về lập trình có theo kịp không?", a: "Hoàn toàn được. Lộ trình cấp Cơ bản (6–9 tuổi) bắt đầu từ lập trình kéo–thả trực quan, không cần biết trước kiến thức gì. Giáo viên kèm sát từng con trong lớp tối đa 12 học viên." },
  { q: "Cam kết hoàn tiền 100% áp dụng thế nào?", a: "Sau buổi học đầu tiên, nếu ba mẹ thấy con không phù hợp hoặc không hài lòng, Sata Robo hoàn lại 100% học phí — không hỏi lý do, không ràng buộc." },
  { q: "RoboSim là gì? Vì sao lại quan trọng?", a: "RoboSim là phần mềm mô phỏng robot chuẩn quốc tế, được dùng tại nhiều giải đấu robotics. Con học và lập trình trên RoboSim trước, nắm chắc nguyên lý rồi mới thực hành robot thật — học chắc, tiết kiệm và an toàn." },
  { q: "Học phí bao nhiêu? Có chính sách gì không?", a: "Học phí hợp lý theo từng cấp, kèm nhiều ưu đãi tuyển sinh. Đặc biệt có cam kết hoàn tiền 100% sau buổi đầu, thưởng du lịch 3–7 triệu và hỗ trợ 3 triệu cho học viên thi quốc gia. Để lại thông tin để được tư vấn mức phí cụ thể." },
  { q: "Lịch học như thế nào? Có linh hoạt không?", a: "Lịch học linh hoạt vào cuối tuần và các buổi tối trong tuần. Khi đăng ký, ba mẹ chọn cơ sở thuận tiện và Sata Robo sẽ sắp xếp ca học phù hợp với con." },
  { q: "Con chưa có nền tảng công nghệ, có bị đuối so với bạn không?", a: "Không. Lớp được chia theo độ tuổi và trình độ, sĩ số tối đa 12 nên giáo viên có thể kèm riêng. Con đi từ cơ bản, tiến bộ theo tốc độ của mình — ba mẹ nhận báo cáo tiến độ sau mỗi chặng." },
  { q: "Thưởng du lịch và hỗ trợ thi quốc gia cụ thể thế nào?", a: "Học viên có thành tích xuất sắc được thưởng chuyến du lịch trị giá 3–7 triệu. Học viên đủ điều kiện dự thi cấp quốc gia được Sata Robo hỗ trợ 3 triệu chi phí." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="cau-hoi" className="section section--cream" style={{ scrollMarginTop: 80 }}>
      <div className="container container--md">
        <div className="head">
          <span className="kicker kicker--onlight">Câu hỏi thường gặp</span>
          <h2 className="sticker sticker--red">Ba mẹ thường <span className="hl">hỏi</span> mình</h2>
        </div>

        <div className="faq-wrap">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={i}>
                <button type="button" className="faq-q" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                  <span className="qmark">?</span>
                  <span>{f.q}</span>
                  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                <div className="faq-a" style={{ maxHeight: isOpen ? 600 : 0 }}>
                  <div className="inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, position: "relative", zIndex: 2 }}>
          <p style={{ color: "var(--ink-600)", marginBottom: 16 }}>Còn câu hỏi khác? Để lại thông tin, Sata Robo sẽ gọi lại tư vấn ngay.</p>
          <a className="btn btn--cta" href="#dang-ky">📝 Đăng ký ngay →</a>
        </div>
      </div>
    </section>
  );
}
