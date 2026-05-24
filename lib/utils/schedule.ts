/**
 * Schedule helpers — khoá học khai giảng Thứ 7 hằng tuần.
 * Tất cả tính theo local time của browser (assumption: user ở VN, UTC+7).
 */

const DAYS_VN = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const SATURDAY = 6;

/**
 * Returns the end of the upcoming Saturday (23:59:59.999 local time).
 * - If today is Saturday and time < 23:59:59 → returns this Saturday's end.
 * - If today is Saturday and time >= 23:59:59 → returns next Saturday's end.
 * - Other days → returns coming Saturday's end.
 *
 * Countdown đếm tới giá trị này; khi tới 0, lần tick kế tiếp sẽ tự tính
 * Saturday tiếp theo → countdown reset mỗi tuần.
 */
export function getNextSaturdayEnd(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSat = day === SATURDAY ? 0 : (SATURDAY - day + 7) % 7;

  const target = new Date(now);
  target.setDate(target.getDate() + daysUntilSat);
  target.setHours(23, 59, 59, 999);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

/**
 * Returns the upcoming Saturday at noon (used as the canonical "khai giảng date"
 * for display — no specific class start time needed in label, just the date).
 */
export function getNextSaturday(): Date {
  const end = getNextSaturdayEnd();
  const d = new Date(end);
  d.setHours(12, 0, 0, 0);
  return d;
}

/**
 * Format a Date as "Thứ 7, DD/MM/YYYY" — Vietnamese day label + zero-padded date.
 */
export function formatVNSaturdayLabel(d: Date): string {
  const dayName = DAYS_VN[d.getDay()];
  return `${dayName}, ${formatVNDate(d)}`;
}

/**
 * Format a Date as DD/MM/YYYY (zero-padded day and month).
 */
export function formatVNDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}
