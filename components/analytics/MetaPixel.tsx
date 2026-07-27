"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/* Stub `fbq` chuẩn của Meta: xếp mọi lời gọi vào `queue` cho tới khi
   fbevents.js nạp xong và gán `callMethod`. */
type FbqStub = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Vì sao tách stub ra khỏi <Script>:

   Trước đây cả snippet (stub + init + tải fbevents.js) nằm trong một inline
   <Script strategy="afterInteractive"> → trong ~1 giây đầu `window.fbq` chưa
   tồn tại, nên mọi lời gọi track* trong khoảng đó bị NUỐT (guard `!window.fbq`).
   Trang /thank-you bắn `ClickQuanTamOA` rồi điều hướng ngay sang Zalo OA, nên
   khách bấm sớm là mất sự kiện — trong khi CHECKLIST-SERVER.md mục 5 yêu cầu
   Events Manager phải thấy đủ PageView + ClickQuanTamOA + AutoRedirectOA.
   Bản mẫu tĩnh (yeucau-thankyou/index.html:281-289) chạy snippet fbq ĐỒNG BỘ
   trước khi gắn listener, nên fbq luôn sẵn sàng.

   `beforeInteractive` không dùng được: Next.js chỉ chấp nhận nó trong
   app/layout.tsx (root layout), mà file đó nằm ngoài phạm vi được sửa.

   Cách làm: dựng stub bằng TS ngay khi chunk client được nạp (sớm hơn hydrate,
   nên sớm hơn mọi onClick của React), rồi để <Script src=...> tải fbevents.js —
   thư viện tự flush hàng đợi. Đây đúng là việc mà snippet gốc làm, chỉ đổi bước
   chèn <script> sang cho next/script.
   ═══════════════════════════════════════════════════════════════════════════ */
function taoStubFbq(): void {
  if (typeof window === "undefined" || !PIXEL_ID) return;
  if (window.fbq) return;

  const n = function (...args: unknown[]) {
    /* gọi qua `n.` → `this` vẫn là `n`, tương đương `callMethod.apply(n, ...)`
       trong snippet gốc của Meta */
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as FbqStub;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  window.fbq = n;
  if (!window._fbq) window._fbq = n;

  /* init phải đứng trước mọi track/trackCustom — xếp hàng ngay tại đây */
  n("init", PIXEL_ID);
}

taoStubFbq();

/* PageView do useEffect bắn (kể cả lần đầu, vì stub đã có sẵn). Ghi lại đường
   dẫn đã bắn để StrictMode ở dev chạy effect 2 lần không tạo PageView trùng. */
let duongDanDaBanPageView: string | null = null;

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
    if (duongDanDaBanPageView === pathname) return;
    duongDanDaBanPageView = pathname;
    window.fbq("track", "PageView");
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel-lib"
        strategy="afterInteractive"
        src="https://connect.facebook.net/en_US/fbevents.js"
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

export function trackMetaEvent(
  eventName: string,
  parameters?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, parameters);
}

// Sự kiện tự định nghĩa (trackCustom) — dùng cho AutoRedirectOA / ClickQuanTamOA
// ở trang /thank-you. An toàn khi Pixel chưa nạp (fbq undefined) → không throw.
export function trackMetaCustomEvent(
  eventName: string,
  parameters?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("trackCustom", eventName, parameters);
  } catch {
    /* không để lỗi đo lường làm hỏng luồng chuyển trang */
  }
}
