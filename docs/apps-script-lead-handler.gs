/**
 * Lead Handler — Landing Page Quà Tặng RoboSim
 * Owner: Sata Robo (hptkk29)
 * Version: 2.1.0
 *
 * v2.1: secret KHÔNG còn hardcode — đọc từ Script Properties.
 *   Setup (1 lần, trên script.google.com): Project Settings > Script Properties:
 *     WEBHOOK_SECRET      = <secret mới>
 *     WEBHOOK_SECRET_OLD  = <secret cũ — chỉ giữ trong giai đoạn xoay, xong thì XOÁ>
 *   Trình tự xoay không downtime:
 *     1. Thêm cả 2 property trên → Deploy "New version" (giữ nguyên URL)
 *     2. Đổi GOOGLE_SCRIPT_SECRET trên Vercel = secret mới → redeploy
 *     3. Xoá WEBHOOK_SECRET_OLD khỏi Script Properties → Deploy "New version"
 *
 * Cột sheet khớp form (MISA + backup Sheet):
 *   Họ tên con* · Họ tên phụ huynh · ĐT di động phụ huynh* · Email phụ huynh ·
 *   Trường con đang học · Lớp con đang học · Chọn cơ sở · Tỉnh/Thành phố
 *
 * ⚠️ SAU KHI PASTE: chạy 1 lần hàm  setupHeaders()  (chọn hàm này rồi bấm Run)
 *    để ghi lại dòng tiêu đề cột cho khớp. Sau đó Deploy > Manage deployments >
 *    chọn deployment hiện tại > Edit > Version: New version > Deploy (giữ nguyên URL).
 */

// ============ CONFIG ============
const SHEET_ID = '1CHX3GmjVXb69cng5Ogve2ATgP2FbqLRPVWMwsNxt3hQ';
const SHEET_NAME = 'Leads';

/** Secret hợp lệ: WEBHOOK_SECRET (+ WEBHOOK_SECRET_OLD trong giai đoạn xoay). */
function getValidSecrets_() {
  const props = PropertiesService.getScriptProperties();
  return [props.getProperty('WEBHOOK_SECRET'), props.getProperty('WEBHOOK_SECRET_OLD')]
    .filter(function (s) { return s && s.length > 0; });
}

// Thứ tự CỘT (khớp thứ tự field trên form). Sửa ở đây là cả header + append đổi theo.
const HEADERS = [
  'Thời gian',              // A
  'Họ tên con',             // B  (bắt buộc)
  'Họ tên phụ huynh',       // C
  'SĐT phụ huynh',          // D  (bắt buộc)
  'Email phụ huynh',        // E
  'Trường con đang học',    // F
  'Lớp con đang học',       // G
  'Cơ sở',                  // H
  'Tỉnh/Thành phố',         // I
  'Nguồn',                  // J
  'IP',                     // K
  'User Agent',             // L
  'Trạng thái',             // M
  'Ghi chú',                // N
];

// ============ MAIN HANDLER ============

function doGet(e) {
  return jsonResponse({
    ok: true,
    service: 'Lead Handler - QuaTang',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'EMPTY_BODY' }, 400);
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse({ ok: false, error: 'INVALID_JSON' }, 400);
    }

    // Verify secret (Script Properties — hỗ trợ 2 secret trong giai đoạn xoay)
    const validSecrets = getValidSecrets_();
    if (validSecrets.length === 0 || validSecrets.indexOf(data.secret) === -1) {
      return jsonResponse({ ok: false, error: 'UNAUTHORIZED' }, 401);
    }

    // Validate required fields — khớp form: chỉ Họ tên con + SĐT là bắt buộc
    const required = ['ho_ten_con', 'sdt'];
    const missing = required.filter(f => !data[f] || String(data[f]).trim() === '');
    if (missing.length > 0) {
      return jsonResponse({
        ok: false,
        error: 'MISSING_FIELDS',
        fields: missing,
      }, 400);
    }

    // Validate phone
    const sdtClean = String(data.sdt).replace(/[\s\-\.]/g, '');
    if (!/^(\+84|0)\d{8,10}$/.test(sdtClean)) {
      return jsonResponse({
        ok: false,
        error: 'INVALID_PHONE',
        message: 'Số điện thoại không hợp lệ',
      }, 400);
    }

    // Validate email if provided
    if (data.email && data.email.trim() !== '') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return jsonResponse({
          ok: false,
          error: 'INVALID_EMAIL',
          message: 'Email không hợp lệ',
        }, 400);
      }
    }

    // Bảo đảm có sheet + header đúng cột (tự tạo/ghi nếu thiếu)
    const sheet = ensureSheet_();

    const timestamp = new Date();
    sheet.appendRow([
      timestamp,                          // A: Thời gian
      data.ho_ten_con || '',              // B: Họ tên con
      data.ho_ten || '',                  // C: Họ tên phụ huynh
      sdtClean,                           // D: SĐT phụ huynh
      data.email || '',                   // E: Email phụ huynh
      data.truong || '',                  // F: Trường con đang học
      data.lop || '',                     // G: Lớp con đang học
      data.co_so || '',                   // H: Cơ sở
      data.tinh || '',                    // I: Tỉnh/Thành phố
      data.source || 'quatang.edu.vn',    // J: Nguồn
      data.ip || '',                      // K: IP
      data.user_agent || '',              // L: User Agent
      'Mới',                              // M: Trạng thái
      '',                                 // N: Ghi chú
    ]);

    Logger.log('Lead saved: con=' + data.ho_ten_con + ' | ph=' + (data.ho_ten || '-') +
      ' | ' + sdtClean + ' | ' + (data.truong || '-') + ' | ' + (data.co_so || '-') +
      ' | ' + (data.tinh || '-'));

    return jsonResponse({
      ok: true,
      message: 'Đăng ký thành công',
      timestamp: timestamp.toISOString(),
    });

  } catch (err) {
    Logger.log('ERROR: ' + err.toString() + '\n' + err.stack);
    return jsonResponse({
      ok: false,
      error: 'INTERNAL_ERROR',
      message: err.toString(),
    }, 500);
  }
}

// ============ HELPERS ============

function jsonResponse(obj, statusCode) {
  const payload = Object.assign({}, obj, { httpStatus: statusCode || 200 });
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Lấy sheet; nếu chưa có thì tạo. Nếu dòng 1 trống thì ghi header. */
function ensureSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    writeHeaders_(sheet);
  } else if (sheet.getLastRow() === 0) {
    writeHeaders_(sheet);
  }
  return sheet;
}

function writeHeaders_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#F26419')
    .setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}

// ============ CHẠY 1 LẦN SAU KHI PASTE ============
// Ghi/ghi đè dòng tiêu đề cột cho khớp form mới. KHÔNG xoá dữ liệu cũ bên dưới.
function setupHeaders() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  writeHeaders_(sheet);
  // Giãn cột cho dễ đọc
  sheet.autoResizeColumns(1, HEADERS.length);
  Logger.log('✅ Đã ghi ' + HEADERS.length + ' cột tiêu đề khớp form.');
}

// ============ TEST ============
function testAppendRow() {
  const sheet = ensureSheet_();
  sheet.appendRow([
    new Date(),
    'Nguyễn Minh Khoa (xoá được)',       // Họ tên con
    'Nguyễn Văn A',                       // Họ tên phụ huynh
    '0900000000',                         // SĐT
    'bame@example.com',                   // Email
    'Trường Tiểu học Hoàng Văn Thụ',      // Trường
    'Lớp 4',                              // Lớp
    'Cơ sở 1 - 211 Nguyễn Hữu Thọ, Đà Nẵng', // Cơ sở
    'Đà Nẵng',                            // Tỉnh/Thành phố
    'test-from-editor',                   // Nguồn
    '127.0.0.1',                          // IP
    'AppsScript Editor',                  // User Agent
    'Mới',                                // Trạng thái
    'Test data',                          // Ghi chú
  ]);
  Logger.log('✅ Test row appended (14 cột).');
}
