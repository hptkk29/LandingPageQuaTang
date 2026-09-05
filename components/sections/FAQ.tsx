"use client";

import { useState } from "react";

const FAQS = [
  { q: "Buổi trải nghiệm 1-1 diễn ra như thế nào?", a: "Một chuyên gia kèm riêng một bạn trong 90 phút, không học chung với bạn khác. 15 phút đầu kiểm tra năng lực lập trình của con, sau đó chọn đúng bài vừa sức, con tự làm sản phẩm trên RoboSim và trình bày lại cho ba mẹ. Cuối buổi ba mẹ nhận phiếu đánh giá năng lực của con." },
  { q: "Vì sao chỉ có 29 suất? Hết suất thì sao?", a: "Vì mỗi suất là một chuyên gia kèm riêng một bạn trong 90 phút nên số suất mỗi đợt có hạn — 29 suất tính chung cho cả 2 cơ sở. Nếu đợt này hết suất, Sata Robo vẫn ghi nhận thông tin và ưu tiên xếp lịch cho con vào đợt kế tiếp." },
  { q: "Con 6 tuổi học được không? Chưa biết gì về lập trình có theo kịp không?", a: "Hoàn toàn được. Buổi trải nghiệm là 1 kèm 1 nên bài học được chọn đúng theo mức của con, không cần biết trước kiến thức gì. Khi vào khoá chính, lộ trình cấp Cơ bản (6–9 tuổi) cũng bắt đầu từ lập trình kéo–thả trực quan." },
  { q: "Cam kết hoàn tiền 100% áp dụng thế nào?", a: "Sau buổi học đầu tiên, nếu ba mẹ thấy con không phù hợp hoặc không hài lòng, Sata Robo hoàn lại 100% học phí — không hỏi lý do, không ràng buộc." },
  { q: "RoboSim là gì? Vì sao lại quan trọng?", a: "RoboSim là phần mềm mô phỏng robot chuẩn quốc tế, được dùng tại nhiều giải đấu robotics. Con học và lập trình trên RoboSim trước, nắm chắc nguyên lý rồi mới thực hành robot thật — học chắc, tiết kiệm và an toàn." },
  { q: "Học phí bao nhiêu? Có chính sách gì không?", a: "Học phí hợp lý theo từng cấp, kèm nhiều ưu đãi tuyển sinh. Đặc biệt có cam kết hoàn tiền 100% sau buổi đầu, thưởng du lịch 3–7 triệu và hỗ trợ 3 triệu cho học viên thi quốc gia. Để lại thông tin để được tư vấn mức phí cụ thể." },
  { q: "Lịch học như thế nào? Có linh hoạt không?", a: "Lịch học linh hoạt vào cuối tuần và các buổi tối trong tuần. Khi đăng ký, ba mẹ chọn cơ sở thuận tiện và Sata Robo sẽ sắp xếp ca học phù hợp với con." },
  { q: "Con chưa có nền tảng công nghệ, có bị đuối so với bạn không?", a: "Không. Buổi trải nghiệm là 1 kèm 1 nên con không bị so với ai. Vào khoá chính, lớp được chia theo độ tuổi và trình độ, sĩ số tối đa 12 nên giáo viên vẫn kèm sát từng con — ba mẹ nhận báo cáo tiến độ sau mỗi chặng." },
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
                <button
                  type="button"
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  id={`faq-q-${i}`}
                >
                  <span className="qmark">?</span>
                  <span>{f.q}</span>
                  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="m6 9 6 6 6-6" /></svg>
                </button>
                {/* Chiều cao do CSS lo (grid-template-rows 0fr→1fr) chứ không
                    còn max-height cứng 600px — con số đó cắt mất chữ khi người
                    dùng phóng to text. inert giữ 9 câu trả lời đang đóng ra
                    khỏi cây trợ năng và khỏi tab order. */}
                <div
                  className="faq-a"
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  inert={!isOpen}
                >
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
