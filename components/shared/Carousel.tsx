"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Tailwind grid-cols cho desktop, vd "md:grid-cols-3 lg:grid-cols-4" */
  className?: string;
  /** ms giữa các lần tự chuyển slide (mobile) */
  interval?: number;
  /** Nhãn cho vùng cuộn — trình đọc màn hình cần biết đây là băng gì */
  label?: string;
};

/**
 * Mobile: carousel vuốt tay (scroll-snap) + tự động chuyển slide.
 * Desktop (md+): trở thành grid bình thường (không cuộn ngang, không auto).
 */
export function Carousel({ children, className, interval = 3500, label = "Băng nội dung" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const stepWidth = useCallback(() => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "20") || 20;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const el = ref.current;
      const step = stepWidth();
      if (!el || !step) return;
      el.scrollTo({ left: i * step, behavior: "smooth" });
    },
    [stepWidth]
  );

  // Chỉ bật carousel dưới md — trên đó nó là lưới tĩnh, không có gì để chỉ báo.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Theo dõi vị trí cuộn để chấm chỉ báo luôn khớp với thẻ đang xem — kể cả
  // khi người dùng tự vuốt chứ không bấm chấm.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const step = stepWidth();
      if (!step) return;
      setIndex(Math.round(el.scrollLeft / step));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [stepWidth]);

  useEffect(() => {
    const el = ref.current;
    if (typeof window === "undefined" || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobile = window.matchMedia("(max-width: 767px)");
    let paused = false;
    let resumeTimer: number | undefined;

    const advance = () => {
      if (paused || !mobile.matches) return;
      const step = stepWidth();
      if (!step) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    };

    const id = window.setInterval(advance, interval);

    const pause = () => {
      paused = true;
      if (resumeTimer) window.clearTimeout(resumeTimer);
    };
    const resume = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, 4000);
    };
    // focusin/out: đang dùng bàn phím trong băng thì đừng tự kéo đi chỗ khác
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    return () => {
      window.clearInterval(id);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [interval, stepWidth]);

  return (
    <>
      <div
        ref={ref}
        // tabIndex=0: vùng cuộn ngang phải focus được thì mới cuộn bằng phím
        // mũi tên. role/aria-label để trình đọc màn hình biết đây là băng gì.
        tabIndex={isMobile ? 0 : -1}
        role={isMobile ? "group" : undefined}
        aria-label={isMobile ? label : undefined}
        className={cn(
          "flex md:grid gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-500",
          className
        )}
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            // w-[86%]: lộ mép thẻ kế tiếp để thấy ngay là còn thẻ nữa —
            // trước đây w-full khiến người dùng tưởng chỉ có 1 thẻ.
            className="snap-center shrink-0 w-[86%] sm:w-[70%] md:w-auto"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Chấm chỉ báo — chỉ có nghĩa ở chế độ băng cuộn (dưới md) */}
      {count > 1 && (
        <div className="flex md:hidden justify-center gap-2 -mt-1 mb-1">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Xem mục ${i + 1} trên ${count}`}
              aria-current={i === index}
              className="grid place-items-center w-11 h-11 cursor-pointer"
            >
              <span
                className={cn(
                  "block rounded-full transition-all",
                  i === index ? "w-6 h-2 bg-cta-500" : "w-2 h-2 bg-brand-200"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
