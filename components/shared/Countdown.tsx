"use client";

import { useEffect, useState } from "react";

type Props = {
  targetDate: string;
  className?: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function Countdown({ targetDate, className = "" }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(targetDate);
    setTimeLeft(calculateTimeLeft(target));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className={`grid grid-cols-4 gap-2 md:gap-3 ${className}`}>
        {["Ngày", "Giờ", "Phút", "Giây"].map((label) => (
          <div
            key={label}
            className="aspect-square bg-urgency-700 rounded-button shadow-lg flex flex-col items-center justify-center text-white ring-2 ring-white/20"
          >
            <span className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl tabular-nums">
              --
            </span>
            <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-wider mt-1">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.expired) {
    return (
      <div
        className={`text-center bg-white/10 border-2 border-white/30 rounded-card p-4 ${className}`}
      >
        <p className="text-white font-display font-bold text-lg">
          ⏰ Đã hết hạn đăng ký
        </p>
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
      {blocks.map((block) => (
        <div
          key={block.label}
          className="aspect-square bg-urgency-700 rounded-button shadow-lg flex flex-col items-center justify-center text-white ring-2 ring-white/20"
        >
          <span className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl tabular-nums">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-wider mt-1">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
