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

  /* TẮT autoConfig — phải đứng TRƯỚC init.

     autoConfig là thứ bật Automatic Advanced Matching: pixel tự quét DOM lúc
     submit và gửi mọi thứ nó đoán là thông tin cá nhân về Meta. Trên form này
     nó vơ cả HỌ TÊN CON, TRƯỜNG và LỚP — dữ liệu trẻ dưới 16 (Nghị định
     13/2023), thứ không có lý do gì phải rời khỏi hệ thống của mình.

     Tắt nó KHÔNG làm mất sự kiện nào của trang: PageView, Lead,
     CompleteRegistration, ClickQuanTamOA, AutoRedirectOA đều đang được bắn
     tường minh bằng track/trackCustom. autoConfig chỉ thêm mấy sự kiện tự đoán
     (click nút, metadata trang) mà ta không dùng để tối ưu quảng cáo.

     Muốn giữ tỷ lệ khớp cho quảng cáo thì dùng setMetaUserData() bên dưới —
     gửi ĐÚNG thứ mình chọn, thay vì để pixel tự vét. */
  n("set", "autoConfig", false, PIXEL_ID);

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

/**
 * Manual Advanced Matching — bù lại tỷ lệ khớp đã mất khi tắt autoConfig,
 * nhưng CHỈ gửi đúng những gì mình chọn.
 *
 * CHƯA ĐƯỢC GỌI Ở ĐÂU. Bật bằng cách gọi hàm này ngay trước trackMetaEvent("Lead")
 * trong LeadForm, với ĐÚNG hai trường của PHỤ HUYNH:
 *
 *     setMetaUserData({ phone: data.sdt, email: data.email });
 *     trackMetaEvent("Lead", { ... });
 *
 * Cố ý KHÔNG nhận họ tên con / trường / lớp: đó là dữ liệu trẻ em, và cũng
 * chính là thứ Automatic Advanced Matching từng vét đi.
 *
 * Giá trị được fbevents.js băm SHA-256 tại trình duyệt trước khi gửi — Meta
 * không nhận số điện thoại/email dạng thô. Chuẩn hoá trước khi băm là bắt buộc,
 * nếu không hash sẽ không khớp với dữ liệu bên Meta:
 *   - điện thoại: chỉ chữ số, có mã quốc gia, 0901234567 → 84901234567
 *   - email: viết thường, bỏ khoảng trắng
 */
export function setMetaUserData(user: { phone?: string; email?: string }): void {
  if (typeof window === "undefined" || !window.fbq || !PIXEL_ID) return;

  const userData: Record<string, string> = {};

  if (user.phone) {
    const digits = user.phone.replace(/\D/g, "");
    // 0901234567 → 84901234567 ; giữ nguyên nếu đã có mã quốc gia
    const e164 = digits.startsWith("0") ? `84${digits.slice(1)}` : digits;
    if (e164) userData.ph = e164;
  }
  if (user.email) {
    const email = user.email.trim().toLowerCase();
    if (email) userData.em = email;
  }

  if (Object.keys(userData).length === 0) return;

  try {
    // init lại cùng pixel ID = cập nhật user data cho các sự kiện sau đó
    window.fbq("init", PIXEL_ID, userData);
  } catch {
    /* đo lường không bao giờ được làm hỏng luồng đăng ký */
  }
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
