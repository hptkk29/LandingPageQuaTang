"use client";

import { useEffect } from "react";
import { trackGAEvent } from "@/components/analytics/GoogleAnalytics";
import { trackMetaCustomEvent } from "@/components/analytics/MetaPixel";

// Guard module-level: StrictMode dev chạy effect 2 lần — không bắn view trùng.
let daBanCovuaView = false;

/** Bắn covua_view khi tải trang, kèm ref + utm_source (docs covua 04 §8). */
export function CovuaTracking() {
  useEffect(() => {
    if (daBanCovuaView) return;
    daBanCovuaView = true;
    try {
      const params = new URLSearchParams(window.location.search);
      const payload = {
        ref: params.get("ref") ?? sessionStorage.getItem("covua_ref") ?? "",
        utm_source: params.get("utm_source") ?? "",
      };
      trackGAEvent("covua_view", payload);
      trackMetaCustomEvent("covua_view", payload);
    } catch {
      /* đo lường không bao giờ được làm hỏng trang */
    }
  }, []);

  return null;
}
