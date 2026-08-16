"use client";

import { useState } from "react";
import { covuaContent } from "@/content/covua";

// Accordion FAQ cho trang cờ vua — cùng bộ class .faq-* của v2.css
// (components/sections/FAQ.tsx của trang cũ hardcode câu hỏi quatang nên
// không import trực tiếp được; markup và hành vi giữ y hệt).
export function CovuaFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-wrap">
      {covuaContent.faq.items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq-item ${isOpen ? "open" : ""}`} key={f.q}>
            <button
              type="button"
              className="faq-q"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
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
  );
}
