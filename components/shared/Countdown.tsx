"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Function returning the current target Date. Called on every tick so the
   * countdown can auto-reset (e.g. for recurring weekly deadlines). */
  getTarget: () => Date;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ getTarget, className = "" }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const getTargetRef = useRef(getTarget);

  useEffect(() => {
    getTargetRef.current = getTarget;
  }, [getTarget]);

  useEffect(() => {
    function tick() {
      setTimeLeft(calculateTimeLeft(getTargetRef.current()));
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className={`grid grid-cols-4 gap-2 md:gap-3 ${className}`}>
        {["Ngày", "Giờ", "Phút", "Giây"].map((label) => (
          <div
            key={label}
            className="aspect-square bg-gradient-to-br from-cta-500 to-cta-600 rounded-card shadow-cta flex flex-col items-center justify-center text-white"
          >
            <span className="font-display font-extrabold text-2xl md:text-3xl tabular-nums">
              --
            </span>
            <span className="text-[10px] md:text-xs opacity-90 uppercase tracking-wider mt-0.5 font-semibold">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: "Ngày" },
    { value: timeLeft.hours, label: "Giờ" },
    { value: timeLeft.minutes, label: "Phút" },
    { value: timeLeft.seconds, label: "Giây" },
  ];

  return (
    <div className={`grid grid-cols-4 gap-2 md:gap-3 ${className}`}>
      {blocks.map((block, idx) => (
        <div
          key={block.label}
          className="relative aspect-square bg-gradient-to-br from-cta-500 to-cta-600 rounded-card shadow-cta flex flex-col items-center justify-center text-white overflow-hidden group hover:shadow-cta-glow transition-shadow"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <span className="relative font-display font-extrabold text-2xl md:text-3xl lg:text-4xl tabular-nums">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="relative text-[10px] md:text-xs opacity-90 uppercase tracking-wider mt-1 font-semibold">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
