"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Tailwind grid-cols cho desktop, vd "md:grid-cols-3 lg:grid-cols-4" */
  className?: string;
  /** ms giữa các lần tự chuyển slide (mobile) */
  interval?: number;
};

/**
 * Mobile: carousel vuốt tay (scroll-snap) + tự động chuyển slide.
 * Desktop (md+): trở thành grid bình thường (không cuộn ngang, không auto).
 */
export function Carousel({ children, className, interval = 3500 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (typeof window === "undefined" || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobile = window.matchMedia("(max-width: 767px)");
    let paused = false;
    let resumeTimer: number | undefined;

    const advance = () => {
      if (paused || !mobile.matches) return;
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const gap = parseFloat(getComputedStyle(el).columnGap || "20") || 20;
      const step = first.getBoundingClientRect().width + gap;
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

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });

    return () => {
      window.clearInterval(id);
      if (resumeTimer) window.clearTimeout(resumeTimer);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [interval]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex md:grid gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {Children.map(children, (child, i) => (
        <div
          key={i}
          className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
