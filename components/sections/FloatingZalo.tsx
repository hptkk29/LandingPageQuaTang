"use client";

import { useEffect, useState } from "react";

/**
 * CTA nổi — chỉ hiện khi KHÔNG có lối vào đăng ký nào khác đang trong tầm nhìn.
 *
 * Ngoài hai form (#dang-ky, #dang-ky-2) còn phải tính cả khối CTA cuối trang và
 * footer: ở đó nút nổi vừa thừa (đã có nút CTA to ngay trên màn) vừa đè che hẳn
 * dòng bản quyền và chính nút CTA cuối trang ở mọi bề rộng dưới ~1800px.
 */
export function FloatingZalo() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = ["dang-ky", "dang-ky-2", "cta-cuoi"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const footer = document.querySelector("footer");
    if (footer) targets.push(footer as HTMLElement);

    // IntersectionObserver bắn callback ngay sau khi observe → show được set
    // đúng ở lần callback đầu tiên, không cần khởi tạo thủ công.
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setShow(visible.size === 0);
      },
      { threshold: 0.25 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`floating-cta fixed right-5 bottom-5 z-[60] transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!show}
    >
      <a
        href="#dang-ky"
        tabIndex={show ? undefined : -1}
        className="animate-zoom-breathe motion-reduce:animate-none inline-flex items-center gap-2 rounded-full bg-[#f26419] px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_26px_-6px_rgba(242,100,25,0.6)] transition-transform hover:scale-105 sm:px-5 md:px-6 md:py-4 md:text-base"
      >
        {/* Nhãn ngắn trên điện thoại: bản đầy đủ rộng 239px ở màn 390px nên
            nút phủ gần hết một hàng nội dung (câu hỏi FAQ, link Google Maps).
            Nút nổi vẫn cố tình nằm đè lên nội dung — đó là bản chất của nó —
            nhưng ở kích thước này nó chiếm góc chứ không chiếm cả hàng. */}
        <span className="sm:hidden">🎁 Nhận suất 1-1</span>
        <span className="hidden sm:inline">🎁 Nhận suất trải nghiệm 1-1</span>
      </a>
    </div>
  );
}
