"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CAMPAIGN } from "@/lib/constants/campaign";

const FAQS = [
  {
    q: "Con 6 tuổi học được không? Chưa biết gì về lập trình có theo kịp không?",
    a: "Hoàn toàn được. Lộ trình cấp Cơ bản (6–9 tuổi) bắt đầu từ lập trình kéo–thả trực quan, không cần biết trước kiến thức gì. Giáo viên kèm sát từng con trong lớp tối đa 12 học viên.",
  },
  {
    q: "Cam kết hoàn tiền 100% áp dụng thế nào?",
    a: "Sau buổi học đầu tiên, nếu ba mẹ thấy con không phù hợp hoặc không hài lòng, Sata Robo hoàn lại 100% học phí — không hỏi lý do, không ràng buộc.",
  },
  {
    q: "RoboSim là gì? Vì sao lại quan trọng?",
    a: "RoboSim là phần mềm mô phỏng robot chuẩn quốc tế, được dùng tại nhiều giải đấu robotics. Con học và lập trình trên RoboSim trước, nắm chắc nguyên lý rồi mới thực hành robot thật — học chắc, tiết kiệm và an toàn.",
  },
  {
    q: "Học phí bao nhiêu? Có chính sách gì không?",
    a: "Học phí hợp lý theo từng cấp, kèm nhiều ưu đãi tuyển sinh. Đặc biệt có cam kết hoàn tiền 100% sau buổi đầu, thưởng du lịch 3–7 triệu và hỗ trợ 3 triệu cho học viên thi quốc gia. Để lại thông tin để được tư vấn mức phí cụ thể.",
  },
  {
    q: "Lịch học như thế nào? Có linh hoạt không?",
    a: "Lịch học linh hoạt vào cuối tuần và các buổi tối trong tuần. Khi đăng ký, ba mẹ chọn cơ sở thuận tiện và Sata Robo sẽ sắp xếp ca học phù hợp với con.",
  },
  {
    q: "Con chưa có nền tảng công nghệ, có bị đuối so với bạn không?",
    a: "Không. Lớp được chia theo độ tuổi và trình độ, sĩ số tối đa 12 nên giáo viên có thể kèm riêng. Con đi từ cơ bản, tiến bộ theo tốc độ của mình — ba mẹ nhận báo cáo tiến độ sau mỗi chặng.",
  },
  {
    q: "Khoá học chuẩn bị cho kỳ thi 2026 ra sao?",
    a: "Lộ trình hướng tới giải đấu RoboSim 2026: từ nền tảng đến lập trình tự hành, chiến thuật và luyện tập theo thể lệ. Học viên được chuẩn bị toàn diện để tự tin tranh tài.",
  },
  {
    q: "Thưởng du lịch và hỗ trợ thi quốc gia cụ thể thế nào?",
    a: "Học viên có thành tích xuất sắc được thưởng chuyến du lịch trị giá 3–7 triệu. Học viên đủ điều kiện dự thi cấp quốc gia được Sata Robo hỗ trợ 3 triệu chi phí.",
  },
];

export function FAQ() {
  return (
    <section id="cau-hoi" className="py-14 md:py-24 bg-cta-50 scroll-mt-20">
      <Container size="md">
        <SectionHeading
          eyebrow="Câu hỏi thường gặp"
          title="Ba mẹ thường hỏi mình những câu này"
          description="Những thắc mắc phổ biến nhất trước khi đăng ký cho con."
        />

        <div className="bg-white rounded-card border border-[#F5C49A] shadow-soft p-2 md:p-3">
          <Accordion>
            {FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-gray-200 last:border-b-0"
              >
                <AccordionTrigger className="text-left font-display font-bold text-gray-900 hover:text-cta-600 text-base md:text-lg py-4 px-3 md:px-4 group">
                  <span className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-cta-50 text-cta-700 flex items-center justify-center font-bold text-sm group-hover:bg-cta-500 group-hover:text-white transition-colors">
                      ?
                    </span>
                    <span>{faq.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm md:text-base leading-relaxed pb-4 px-3 md:px-4 pl-12 md:pl-14">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm md:text-base mb-4">
            Còn câu hỏi khác? <strong>Inbox Zalo</strong> — Sata Robo phản hồi
            trong ít phút.
          </p>
          <a
            href={`https://zalo.me/${CAMPAIGN.hotlineDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cta-500 hover:bg-cta-600 text-white font-display font-bold text-sm md:text-base px-6 py-3 rounded-button shadow-cta transition-all hover:-translate-y-0.5"
          >
            💬 Chat Zalo ngay →
          </a>
        </div>
      </Container>
    </section>
  );
}
