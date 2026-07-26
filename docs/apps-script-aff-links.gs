/**
 * AffLinks — Kho mã link affiliate tạm thời (Pha 1, BRD-AFF-005)
 * Owner: Sata Robo
 * Version: 1.0.0
 *
 * Vai trò: kho mã link + nhật ký click cho quatang.edu.vn cho tới khi kho mã
 * trung tâm trên satarobo.vn go-live (Pha 4). Sau đó chạy song song ~2 tuần
 * rồi đóng băng tab Links, migrate vào DB satarobo, tắt hẳn.
 *
 * SETUP (1 lần):
 *   1. Tạo Google Spreadsheet mới tên "AffLinks", copy ID của nó.
 *   2. script.google.com > New project > paste file này.
 *   3. Project Settings > Script Properties:
 *        AFF_SHEET_ID  = <ID spreadsheet vừa tạo>
 *        AFF_SECRET    = <chuỗi ngẫu nhiên dài — trùng env AFF_SHEET_SECRET trên Vercel>
 *        (AFF_SECRET_OLD chỉ dùng khi xoay secret, xong thì xoá)
 *   4. Chạy 1 lần hàm setupSheets() để tạo 2 tab + header.
 *   5. Deploy > New deployment > Web app: Execute as ME, access ANYONE.
 *      URL web app = env AFF_SHEET_API_URL trên Vercel.
 *
 * Nhập link mới (Pha 1 chưa có UI admin): thêm dòng vào tab Links,
 * dùng hàm generateLinkCode() (Run trong editor, xem Logs) để lấy mã ngẫu nhiên.
 *
 * Trạng thái link hợp lệ: "Đang chạy" | "Tạm dừng" | "Đã thu hồi" | "Đã xoay mã"
 * — chỉ "Đang chạy" mới được gán người giới thiệu (resolve trả employeeCode).
 */

// ============ CONFIG ============
const LINKS_SHEET = 'Links';
const CLICKS_SHEET = 'Clicks';
const STATUS_ACTIVE = 'Đang chạy';

const LINKS_HEADERS = [
  'Mã link',      // A — ngẫu nhiên ≥16 ký tự (generateLinkCode)
  'Mã NV',        // B — vd SR-MK-004
  'Nhãn kênh',    // C — Zalo / Facebook cá nhân / tờ rơi CS1…
  'Trang đích',   // D — Pha 1 luôn là trang quà tặng
  'Trạng thái',   // E — Đang chạy / Tạm dừng / Đã thu hồi / Đã xoay mã
  'Ngày tạo',     // F
  'Người tạo',    // G
  'Số click',     // H — tự tăng khi click hợp lệ
];

const CLICKS_HEADERS = [
  'ClickId',      // A
  'Mã link',      // B — mã thô trên URL (kể cả mã sai — soi dò mã FR-B04)
  'Hợp lệ',       // C — TRUE = mã tồn tại và Đang chạy
  'Thời điểm',    // D
  'Domain',       // E
  'UTM Source',   // F
  'UTM Medium',   // G
  'UTM Campaign', // H
  'Referrer',     // I
  'IP',           // J — giữ nguyên phục vụ BR-04.2 (đếm lead cùng IP/ngày)
  'User Agent',   // K
];

function getProps_() {
  return PropertiesService.getScriptProperties();
}

function getValidSecrets_() {
  const props = getProps_();
  return [props.getProperty('AFF_SECRET'), props.getProperty('AFF_SECRET_OLD')]
    .filter(function (s) { return s && s.length > 0; });
}

function getSpreadsheet_() {
  const id = getProps_().getProperty('AFF_SHEET_ID');
  if (!id) throw new Error('Chưa cấu hình Script Property AFF_SHEET_ID');
  return SpreadsheetApp.openById(id);
}

// ============ MAIN HANDLER ============

function doGet(e) {
  return jsonResponse_({
    ok: true,
    service: 'AffLinks - QuaTang (Pha 1)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonResponse_({ ok: false, error: 'EMPTY_BODY' });
    }
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse_({ ok: false, error: 'INVALID_JSON' });
    }

    const validSecrets = getValidSecrets_();
    if (validSecrets.length === 0) {
      return jsonResponse_({ ok: false, error: 'NOT_CONFIGURED', message: 'Chưa set Script Property AFF_SECRET' });
    }
    if (validSecrets.indexOf(data.secret) === -1) {
      return jsonResponse_({ ok: false, error: 'UNAUTHORIZED' });
    }

    switch (data.action) {
      case 'resolve':
        return handleResolve_(data);
      case 'click':
        return handleClick_(data);
      default:
        return jsonResponse_({ ok: false, error: 'UNKNOWN_ACTION' });
    }
  } catch (err) {
    Logger.log('ERROR: ' + err.toString() + '\n' + err.stack);
    return jsonResponse_({ ok: false, error: 'INTERNAL_ERROR', message: err.toString() });
  }
}

// ============ ACTIONS ============

/** Tra mã link. employeeCode CHỈ trả khi link "Đang chạy" (link thu hồi → không gán). */
function handleResolve_(data) {
  const code = String(data.code || '').trim();
  if (!code) return jsonResponse_({ ok: false, error: 'MISSING_CODE' });

  const link = findLink_(code);
  if (!link) return jsonResponse_({ ok: true, found: false });

  const isActive = link.status === STATUS_ACTIVE;
  return jsonResponse_({
    ok: true,
    found: true,
    status: link.status,
    employeeCode: isActive ? link.employeeCode : '',
    channel: link.channel,
  });
}

/** Ghi 1 lượt click vào tab Clicks; click hợp lệ thì tăng Số click của link. */
function handleClick_(data) {
  const ss = getSpreadsheet_();
  const clicksSheet = ensureSheet_(ss, CLICKS_SHEET, CLICKS_HEADERS);

  const code = String(data.code || '').trim();
  const link = data.syntaxValid === false ? null : findLink_(code);
  const isValid = !!(link && link.status === STATUS_ACTIVE);

  clicksSheet.appendRow([
    safeCell_(data.clickId),
    safeCell_(code),
    isValid,
    data.occurredAt ? new Date(Number(data.occurredAt)) : new Date(),
    safeCell_(data.domain),
    safeCell_(data.utmSource),
    safeCell_(data.utmMedium),
    safeCell_(data.utmCampaign),
    safeCell_(data.referrer),
    safeCell_(data.ip),
    safeCell_(data.userAgent),
  ]);

  if (isValid && link) {
    // Cột H (Số click) — read-modify-write cần lock, doPost chạy concurrent
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(5000);
      const linksSheet = ss.getSheetByName(LINKS_SHEET);
      const cell = linksSheet.getRange(link.rowIndex, 8);
      cell.setValue((Number(cell.getValue()) || 0) + 1);
    } catch (lockErr) {
      Logger.log('Lock timeout — bỏ qua tăng Số click (row Clicks vẫn đủ để đếm lại): ' + lockErr);
    } finally {
      try { lock.releaseLock(); } catch (e) {}
    }
  }

  return jsonResponse_({ ok: true, valid: isValid });
}

// ============ HELPERS ============

function findLink_(code) {
  if (!code) return null;
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(LINKS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return null;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === code) {
      return {
        rowIndex: i + 2,
        code: code,
        employeeCode: String(rows[i][1]).trim(),
        channel: String(rows[i][2]).trim(),
        target: String(rows[i][3]).trim(),
        status: String(rows[i][4]).trim(),
      };
    }
  }
  return null;
}

/** Chống formula injection khi mở Sheet — prefix ' nếu bắt đầu bằng = + - @ tab/CR. */
function safeCell_(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    writeHeaders_(sheet, headers);
  } else if (sheet.getLastRow() === 0) {
    writeHeaders_(sheet, headers);
  }
  return sheet;
}

function writeHeaders_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#F26419')
    .setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}

// ============ CHẠY 1 LẦN SAU KHI PASTE ============
function setupSheets() {
  const ss = getSpreadsheet_();
  ensureSheet_(ss, LINKS_SHEET, LINKS_HEADERS);
  ensureSheet_(ss, CLICKS_SHEET, CLICKS_HEADERS);
  Logger.log('✅ Đã tạo 2 tab Links + Clicks với header.');
}

/** Sinh mã link ngẫu nhiên 20 ký tự base64url (FR-A02: ≥16, không chứa mã NV). */
function generateLinkCode() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let code = '';
  for (let i = 0; i < 20; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  Logger.log('Mã link mới: ' + code + '  →  https://quatang.edu.vn/r/' + code);
  return code;
}
