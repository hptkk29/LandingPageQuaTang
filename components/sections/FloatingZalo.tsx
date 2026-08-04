"use client";

import { useEffect, useState } from "react";

/**
 * CTA nổi — chỉ hiện khi form đăng ký KHÔNG nằm trong tầm nhìn.
 * Form giờ nằm ngay đầu trang nên nếu luôn hiện, nút sẽ đè lên chính cái form
 * mà nó trỏ tới.
 */
export function FloatingZalo() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = ["dang-ky", "dang-ky-2"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

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
      className={`fixed right-5 bottom-5 z-[60] transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!show}
    >
      <a
        href="#dang-ky"
        tabIndex={show ? undefined : -1}
        className="animate-zoom-breathe motion-reduce:animate-none inline-flex items-center gap-2 rounded-full bg-[#f26419] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_26px_-6px_rgba(242,100,25,0.6)] transition-transform hover:scale-105 md:px-6 md:py-4 md:text-base"
      >
        🎁 Nhận suất trải nghiệm 1-1
      </a>
    </div>
  );
}
