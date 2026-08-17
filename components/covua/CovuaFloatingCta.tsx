"use client";

import { useEffect, useState } from "react";
import { covuaContent } from "@/content/covua";

/**
 * Nút nổi "Đăng ký nhận quà" → cuộn tới #dang-ky.
 * Theo pattern FloatingZalo của trang cũ: chỉ hiện khi form KHÔNG nằm trong
 * tầm nhìn — nếu luôn hiện, nút sẽ đè lên chính cái form mà nó trỏ tới.
 */
export function CovuaFloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("dang-ky");
    if (!target) return;
    // IntersectionObserver bắn callback ngay sau observe → trạng thái đúng
    // từ lần đầu, không cần khởi tạo tay.
    const io = new IntersectionObserver(
      (entries) => setShow(!entries.some((e) => e.isIntersecting)),
      { threshold: 0.15 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`covua-fab ${show ? "covua-fab--show" : ""}`} aria-hidden={!show}>
      <a
        className="btn btn--cta btn--pulse"
        href="#dang-ky"
        tabIndex={show ? undefined : -1}
      >
        🎁 {covuaContent.form.title}
      </a>
    </div>
  );
}
