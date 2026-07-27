/**
 * Deadline helpers — mỗi đợt đăng ký chốt vào cuối tuần (hết Chủ nhật).
 *
 * LƯU Ý: lịch học của lớp là LINH HOẠT (cuối tuần & các buổi tối), không còn
 * ca cố định Thứ 7 — không dựng lại mốc "Thứ 7" ở bất kỳ đâu.
 * Tất cả tính theo local time của browser (assumption: user ở VN, UTC+7).
 */

const SUNDAY = 0;

/**
 * Returns the end of the upcoming Sunday (23:59:59.999 local time) — hạn chốt
 * đăng ký của đợt hiện tại.
 * - Chủ nhật, trước 23:59:59 → hết Chủ nhật hôm nay.
 * - Chủ nhật, sau 23:59:59 → hết Chủ nhật tuần sau.
 * - Các ngày khác → hết Chủ nhật sắp tới.
 *
 * Countdown đếm tới giá trị này; khi tới 0, lần tick kế tiếp tự tính Chủ nhật
 * tiếp theo → countdown tự reset mỗi tuần.
 */
export function getWeekDeadlineEnd(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSun = day === SUNDAY ? 0 : (SUNDAY - day + 7) % 7;

  const target = new Date(now);
  target.setDate(target.getDate() + daysUntilSun);
  target.setHours(23, 59, 59, 999);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

/**
 * Format a Date as DD/MM/YYYY (zero-padded day and month).
 */
export function formatVNDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}
