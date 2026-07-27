// Chặn cái bẫy "mất sạch CSS mà không có lỗi nào".
//
// Triệu chứng: chạy Chrome headless/CDP với --user-data-dir đặt TRONG thư mục
// project (vd .shots/cdp-profile) → Turbopack quét trúng file đang bị Chrome
// khoá (Default/Network/Cookies) → panic `os error 32` giữa lúc build CSS →
// app/v2.css + app/globals.css bị drop khỏi bundle. Trang render mất sạch style
// nhưng UI KHÔNG báo lỗi gì, rất dễ mất nửa buổi đi debug CSS mình vừa viết.
//
// Vì sao phải là script riêng: Next 16 không có cách nào loại trừ thư mục khỏi
// Turbopack — `watchOptions` chỉ có `pollIntervalMs`, và `turbopack` chỉ có
// resolveAlias/resolveExtensions/rules/root/debugIds. Không chặn được việc quét,
// nên đổi hướng: biến lỗi âm thầm thành lỗi TO, ngay trước khi nó kịp cắn.
//
// Fail-open: script này chỉ được phép chặn khi CHẮC CHẮN tìm thấy profile.
// Mọi lỗi ngoài dự kiến đều cho qua — không bao giờ để một cái guard làm hỏng
// việc chạy dev/build.

import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Bỏ qua trên Vercel/CI: profile chỉ sinh ra ở máy dev, và ở đó guard này chỉ
// là thêm một bề mặt hỏng build.
if (process.env.VERCEL || process.env.CI) process.exit(0);

const BO_QUA = new Set([
  "node_modules",
  ".git",
  ".next",
  ".vercel",
  "out",
  "build",
  "coverage",
  ".turbo",
]);

// File chỉ Chromium mới tạo — đủ đặc trưng để không báo nhầm
const DAU_HIEU = [
  "Local State",
  "SingletonLock",
  "DevToolsActivePort",
  "CrashpadMetrics-active.pma",
  "BrowserMetrics-spare.pma",
];

const DO_SAU_TOI_DA = 4;

function laProfileChrome(duongDan) {
  if (DAU_HIEU.some((f) => existsSync(join(duongDan, f)))) return true;
  // Profile mới tinh (chưa chạy lần nào) có thể chưa có file nào ở trên,
  // nhưng luôn có Default/ chứa Preferences hoặc Network/
  const def = join(duongDan, "Default");
  return (
    existsSync(join(def, "Preferences")) || existsSync(join(def, "Network"))
  );
}

function quet(thuMuc, doSau, ketQua) {
  if (doSau > DO_SAU_TOI_DA) return;
  let mucCon;
  try {
    mucCon = readdirSync(thuMuc, { withFileTypes: true });
  } catch {
    return; // không đọc được thì thôi, không phải việc của guard
  }
  for (const muc of mucCon) {
    if (!muc.isDirectory() || BO_QUA.has(muc.name)) continue;
    const duongDan = join(thuMuc, muc.name);
    if (laProfileChrome(duongDan)) {
      ketQua.push(duongDan);
      continue; // đã bắt được thì không cần đào sâu thêm vào chính nó
    }
    quet(duongDan, doSau + 1, ketQua);
  }
}

try {
  const timThay = [];
  quet(process.cwd(), 1, timThay);

  if (timThay.length > 0) {
    console.error("");
    console.error(
      "  ✖ Có profile trình duyệt nằm TRONG project — dừng lại trước khi nó phá build."
    );
    console.error("");
    for (const p of timThay) console.error(`      ${p}`);
    console.error("");
    console.error(
      "  Vì sao nguy hiểm: Turbopack sẽ quét trúng file đang bị Chrome khoá"
    );
    console.error(
      "  (Default/Network/Cookies) → panic `os error 32` → app/v2.css và"
    );
    console.error(
      "  app/globals.css bị drop khỏi bundle. Trang mất sạch style mà KHÔNG"
    );
    console.error("  báo lỗi gì trên UI — rất dễ chẩn đoán nhầm thành lỗi CSS.");
    console.error("");
    console.error("  Cách sửa: đóng Chrome đang dùng profile đó, xoá thư mục,");
    console.error(
      "  rồi chạy lại với --user-data-dir đặt NGOÀI project, ví dụ:"
    );
    console.error(
      "      --user-data-dir=C:\\Users\\ADMIN\\AppData\\Local\\Temp\\cdp-profile-quatang"
    );
    console.error("");
    process.exit(1);
  }
} catch (err) {
  // Guard hỏng thì cho qua, không được cản dev/build
  console.warn(
    "[check-no-browser-profile] bỏ qua do lỗi ngoài dự kiến:",
    err instanceof Error ? err.message : err
  );
}
