/**
 * Lead Handler — Landing Page Quà Tặng Giải Cờ Vua (covua.quatang.edu.vn)
 * Owner: Sata Robo
 * Version: 1.0.0
 *
 * Apps Script RIÊNG cho lead cờ vua — không dùng chung deployment với script
 * quà tặng cũ (docs/apps-script-lead-handler.gs) để hai luồng không lẫn cột.
 * Nhận POST từ /api/lead-covua (server landing), ghi 1 dòng vào tab 'Leads'.
 *
 * SETUP (1 lần, trên script.google.com — theo đúng chuẩn script quà tặng):
 *   1. Tạo spreadsheet MỚI cho lead cờ vua (đừng dùng chung file với quà tặng).
 *   2. Project Settings > Script Properties:
 *        SHEET_ID       = <ID spreadsheet cờ vua>  (KHÔNG hardcode — file này nằm trong repo)
 *        WEBHOOK_SECRET = <chuỗi ngẫu nhiên dài>   (trùng env COVUA_SHEET_SECRET trên Vercel)
 *   3. Chọn hàm setupHeaders > Run (ghi dòng tiêu đề cột).
 *   4. Deploy > New deployment > Web app:
 *        Execute as: Me · Who has access: Anyone
 *      → URL nhận được là env COVUA_SHEET_WEBHOOK_URL trên Vercel.
 *
 * Cột: mỗi trường thô một cột (bản gốc đối soát — docs covua 04 §5, đã bỏ
 * misaStatus theo quyết định không đẩy MISA). sataroboStatus = sent /
 * duplicated / failed — cuối tuần lọc failed để nhập bù vào satarobo.vn.
 */

// ============ CONFIG ============
const SHEET_NAME = 'Leads';

// Thứ tự CỘT — key trùng tên field trong payload từ /api/lead-covua.
// Sửa ở đây là cả header lẫn append đổi theo.
const COLUMNS = [
  { key: 'timestamp',          header: 'Thời gian' },            // A
  { key: 'programCode',        header: 'Chương trình' },         // B
  { key: 'studentName',        header: 'Họ tên thí sinh' },      // C
  { key: 'parentName',         header: 'Họ tên phụ huynh' },     // D
  { key: 'parentPhone',        header: 'SĐT phụ huynh' },        // E
  { key: 'parentEmail',        header: 'Email phụ huynh' },      // F
  { key: 'province',           header: 'Tỉnh/TP' },              // G
  { key: 'address',            header: 'Địa chỉ' },              // H
  { key: 'achievement',        header: 'Thành tích' },           // I
  { key: 'achievementGroup',   header: 'Nhóm quà (A/B)' },       // J
  { key: 'category',           header: 'Bảng/hạng mục' },        // K
  { key: 'registrationNumber', header: 'Số báo danh' },          // L
  { key: 'techInterest',       header: 'Tư duy công nghệ' },     // M
  { key: 'studyMode',          header: 'Hình thức học' },        // N
  { key: 'campus',             header: 'Cơ sở' },                // O
  { key: 'ref',                header: 'Mã NV giới thiệu' },     // P
  { key: 'utmSource',          header: 'UTM Source' },           // Q
  { key: 'utmMedium',          header: 'UTM Medium' },           // R
  { key: 'utmCampaign',        header: 'UTM Campaign' },         // S
  { key: 'userAgent',          header: 'User Agent' },           // T
  { key: 'sataroboStatus',     header: 'Satarobo Status' },      // U
  { key: 'sataroboLeadId',     header: 'Satarobo Lead ID' },     // V
  { key: 'idempotencyKey',     header: 'Idempotency Key' },      // W
];

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Chưa cấu hình Script Property SHEET_ID (ID spreadsheet Leads cờ vua)');
  return SpreadsheetApp.openById(id);
}

function getSheet_() {
  const ss = getSpreadsheet_();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Chạy 1 lần sau khi paste (hoặc sau khi đổi COLUMNS): ghi dòng tiêu đề. */
function setupHeaders() {
  const sheet = getSheet_();
  const headers = COLUMNS.map(function (c) { return c.header; });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!secret) throw new Error('Chưa cấu hình Script Property WEBHOOK_SECRET');
    if (data.secret !== secret) {
      // Không lộ chi tiết — sai secret trả lỗi chung
      return json_({ ok: false, error: 'UNAUTHORIZED' });
    }

    // Ghi đúng thứ tự COLUMNS; key thiếu → ô trống. SĐT ép về text để
    // Google Sheets không nuốt số 0 đầu.
    const row = COLUMNS.map(function (c) {
      const v = data[c.key];
      return v == null ? '' : String(v);
    });
    const sheet = getSheet_();
    sheet.appendRow(row);
    const r = sheet.getLastRow();
    sheet.getRange(r, 5).setNumberFormat('@'); // cột E — SĐT dạng text

    // Execution log không in PII: che SĐT, không in họ tên
    const phone = String(data.parentPhone || '');
    Logger.log('[covua] lead OK ' + phone.slice(0, 4) + '*** satarobo=' + (data.sataroboStatus || ''));

    return json_({ ok: true });
  } catch (err) {
    Logger.log('[covua] ERROR: ' + err);
    return json_({ ok: false, error: 'INTERNAL' });
  }
}

/** Health check nhanh trên trình duyệt (không ghi gì). */
function doGet() {
  return json_({ ok: true, service: 'lead-covua', time: new Date().toISOString() });
}
