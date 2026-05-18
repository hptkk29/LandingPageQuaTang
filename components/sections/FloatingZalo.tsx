"use client";

import { useEffect, useState } from "react";
import { CAMPAIGN } from "@/lib/constants/campaign";

export function FloatingZalo() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (visible && expanded) {
      const timer = setTimeout(() => setExpanded(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, expanded]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50">
      <a
        href={`https://zalo.me/${CAMPAIGN.hotlineDigits}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo Sata Robo"
        onMouseEnter={() => setExpanded(true)}
        onFocus={() => setExpanded(true)}
        className="relative flex items-center gap-3 bg-[#0068FF] hover:bg-[#0055CC] text-white shadow-2xl rounded-pill transition-all duration-300 hover:scale-105 overflow-hidden"
        style={{
          paddingLeft: expanded ? "20px" : "16px",
          paddingRight: expanded ? "20px" : "16px",
          paddingTop: "14px",
          paddingBottom: "14px",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-pill bg-[#0068FF] animate-ping opacity-20"
        />

        <span className="relative shrink-0 w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-[#0068FF] text-sm">
          Z
        </span>

        <span
          className="relative font-display font-bold text-sm md:text-base whitespace-nowrap overflow-hidden transition-all duration-300"
          style={{
            maxWidth: expanded ? "200px" : "0px",
            opacity: expanded ? 1 : 0,
          }}
        >
          Chat tư vấn ngay
        </span>
      </a>

      {expanded && (
        <div className="absolute -top-2 -right-2 bg-cta-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-pill shadow-md animate-bounce-in">
          24/7
        </div>
      )}
    </div>
  );
}
