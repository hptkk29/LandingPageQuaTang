"use client";

import { motion } from "framer-motion";
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
    q: "Con bao nhiêu tuổi thì học được khoá này?",
    a: "Khoá 5 buổi miễn phí dành cho học sinh từ Lớp 1 đến Lớp 8 (6-14 tuổi). Giáo trình được thiết kế chia theo độ tuổi: nhóm 1-3 tập trung lắp ráp và tư duy logic cơ bản, nhóm 4-8 tập trung lập trình tự hành nâng cao.",
  },
  {
    q: "5 buổi học miễn phí thật không? Có thu phí ẩn hay điều kiện gì không?",
    a: "MIỄN PHÍ 100%. Không thu bất kỳ khoản phí ẩn nào. Không bắt buộc đăng ký khoá học tiếp theo. Ba mẹ chỉ cần đăng ký để giữ chỗ — có thể huỷ bất cứ lúc nào trước buổi học.",
  },
  {
    q: "Cơ sở học ở đâu?",
    a: `Sata Robo có 2 cơ sở tại Đà Nẵng:\n• ${CAMPAIGN.locations[0].address} (khai giảng ${CAMPAIGN.locations[0].khaiGiangLabel})\n• ${CAMPAIGN.locations[1].address} (khai giảng ${CAMPAIGN.locations[1].khaiGiangLabel})\nKhi đăng ký, ba mẹ chọn 1 trong 2 cơ sở thuận tiện.`,
  },
  {
    q: "Đăng ký rồi có bị gọi điện ép mua khoá học tiếp không?",
    a: "Không. Sata Robo cam kết KHÔNG telesale ép buộc. Sau buổi học, ba mẹ chỉ nhận tin nhắn báo cáo tiến độ học của con. Nếu muốn tìm hiểu khoá tiếp theo, ba mẹ chủ động liên hệ — Sata Robo không gọi spam.",
  },
  {
    q: "Lớp có tối đa bao nhiêu học viên? Con có được hỗ trợ riêng không?",
    a: `Mỗi lớp tối đa ${CAMPAIGN.totalSlotsPerLocation} học viên. Giáo viên đảm bảo hỗ trợ trực tiếp từng con — không có ai bị bỏ lại phía sau. Đây là lý do số suất giới hạn nghiêm ngặt theo cơ sở.`,
  },
  {
    q: "Nếu con vắng 1 buổi có học bù được không?",
    a: "Có. Sata Robo sắp xếp học bù miễn phí ở buổi tiếp theo trong tuần (nếu lịch trống). Vui lòng báo trước ít nhất 1 ngày qua hotline hoặc Zalo để giáo viên chuẩn bị.",
  },
];

export function FAQ() {
  return (
    <section
      id="cau-hoi"
      className="relative py-14 md:py-24 bg-surface-50 scroll-mt-20 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-32 w-96 h-96 bg-brand-100/50 rounded-full filter blur-3xl animate-blob-slow"
      />

      <Container className="relative max-w-3xl">
        <SectionHeading
          eyebrow="Câu hỏi thường gặp"
          title="Ba mẹ thường hỏi mình những câu này"
          description="Những thắc mắc phổ biến nhất trước khi đăng ký 5 buổi miễn phí."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-card border-2 border-brand-100 shadow-soft p-2 md:p-3"
        >
          <Accordion>
            {FAQS.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-gray-100 last:border-b-0"
              >
                <AccordionTrigger className="text-left font-display font-bold text-gray-900 hover:text-cta-600 text-base md:text-lg py-4 px-3 md:px-4 transition-colors group">
                  <span className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-cta-100 text-cta-700 flex items-center justify-center font-bold text-sm group-hover:bg-cta-500 group-hover:text-white transition-colors">
                      ?
                    </span>
                    <span>{faq.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-sm md:text-base leading-relaxed pb-4 px-3 md:px-4 pl-12 md:pl-14 whitespace-pre-line">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-gray-700 text-sm md:text-base mb-4">
            Còn câu hỏi khác? <strong>Inbox Zalo</strong> — Sata Robo phản hồi
            trong <strong>ít phút</strong>.
          </p>
          <a
            href={`https://zalo.me/${CAMPAIGN.hotlineDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0068FF] hover:bg-[#0055CC] text-white font-display font-bold text-sm md:text-base px-6 py-3 rounded-button shadow-md transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12c0 1.952.567 3.773 1.539 5.317L2 22l4.683-1.539A9.953 9.953 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2z" />
            </svg>
            Chat Zalo ngay →
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
