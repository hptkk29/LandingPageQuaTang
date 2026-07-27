"use client";

import { useEffect, useState } from "react";
import { getWeekDeadlineEnd } from "@/lib/utils/schedule";

/**
 * Dải khẩn cấp đặt trong thẻ form: số suất mỗi cơ sở + đồng hồ đếm tới hạn
 * chốt đơn của đợt (hết Chủ nhật tuần này). Tự reset sang tuần kế tiếp.
 *
 * Render "--" ở lần render đầu (server + hydrate) rồi mới tính giờ trong
 * useEffect — tránh hydration mismatch do lệch giờ server/client.
 */
export function DeadlineStrip({ slots = 12 }: { slots?: number }) {
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, getWeekDeadlineEnd().getTime() - Date.now());
      const total = Math.floor(diff / 1000);
      const d = Math.floor(total / 86400);
      const h = Math.floor((total % 86400) / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      const pad = (n: number) => String(n).padStart(2, "0");
      setLeft(d > 0 ? `${d} ngày ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="deadline-strip">
      <span className="ds-slots">
        🔥 Chỉ <b>{slots} suất</b>/cơ sở mỗi đợt
      </span>
      <span className="ds-time">
        Chốt đơn sau <b suppressHydrationWarning>{left ?? "--:--:--"}</b>
      </span>
    </div>
  );
}
