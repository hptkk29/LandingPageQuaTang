/**
 * Lead Handler — Landing Page Quà Tặng RoboSim
 * Owner: Sata Robo (hptkk29)
 * Version: 2.4.0
 *
 * v2.5: tự tra MÃ NV (cột Q) + TÊN (cột V) từ tab 'Links' của sheet AffLinks
 *   theo MÃ LINK (cột O) — chạy phía Google nên KHÔNG dính timeout mạng như
 *   resolve từ server (nguyên nhân mã NV hay rớt). Dùng thẳng dữ liệu Links tab
 *   (đã có Mã NV + Người sử dụng), KHÔNG cần tab NhanVien. Setup:
 *     1. Project Settings > Script Properties: AFFLINKS_SHEET_ID = <ID spreadsheet AffLinks>.
 *     2. XOÁ sạch cột V (bỏ công thức ARRAYFORMULA cũ nếu còn).
 *     3. Paste bản này > Save > chạy setupHeaders() (ghi tiêu đề cột V).
 *     4. Chạy backfillAff() 1 lần để điền mã NV + tên cho lead CŨ.
 *     5. Deploy > New version (để lead MỚI tự có mã NV + tên).
 *   Tab Links cần có tiêu đề: 'Mã link', 'Mã NV', và cột tên ('Người sử dụng'
 *   / 'Người dùng' / 'Tên'). Đổi Links rồi thì chạy lại backfillAff() để làm mới.
 *
 * v2.4 (đã thay): tra tên từ tab 'NhanVien' theo mã NV — bỏ vì mã NV hay rớt
 *   do resolve server timeout; v2.5 tra thẳng theo mã link.
 *
 * v2.3: SHEET_ID KHÔNG còn hardcode (file này nằm trong repo public) + Execution
 *   log thôi in PII (che SĐT, bỏ họ tên).
 *   ⚠️ BẮT BUỘC TRƯỚC KHI DEPLOY BẢN NÀY — Project Settings > Script Properties:
 *     SHEET_ID = <ID spreadsheet Leads>   (lấy từ URL: /spreadsheets/d/<ID>/edit)
 *   Thiếu property này script sẽ THROW và NGỪNG ghi lead — không có fallback,
 *   vì ghi nhầm sang spreadsheet khác còn tệ hơn là báo lỗi to.
 *   Lưu ý: gỡ ID khỏi file này KHÔNG xoá được nó khỏi lịch sử git đã public —
 *   đây chỉ là vệ sinh. Hàng rào thật là quyền chia sẻ của chính spreadsheet:
 *   phải rà lại Share của file Leads (bỏ "Anyone with the link"), và cân nhắc
 *   tạo spreadsheet mới nếu ID cũ đã bị lộ đủ lâu.
 *
 * v2.2: thêm cột attribution affiliate O–U (BRD-AFF-005 FR-B09) + email cảnh
 *   báo khi MISA thất bại (misa_status khác OK — tinh thần FR-E04, không im lặng).
 *   Script Properties bổ sung (tuỳ chọn):
 *     ALERT_EMAIL = satarobo.it@gmail.com   (rỗng = không gửi mail)
 *   ⚠️ Sau khi paste v2.2: chạy lại setupHeaders() để ghi thêm cột O–U.
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
// SHEET_ID nằm trong Script Properties, KHÔNG hardcode: file .gs này được commit
// vào repo public, mà spreadsheet Leads chứa toàn bộ PII của phụ huynh.
const SHEET_NAME = 'Leads';

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Chưa cấu hình Script Property SHEET_ID (ID spreadsheet Leads)');
  return SpreadsheetApp.openById(id);
}

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
  'Aff mã link cuối',       // O — mã link THÔ lần chạm cuối (truy ngược được kể cả khi resolve fail)
  'Aff mã link đầu',        // P
  'Aff mã NV',              // Q — mã NV người giới thiệu đã resolve (rỗng = không có)
  'Aff clickId',            // R — nối với tab Clicks của sheet AffLinks
  'Aff thời điểm click',    // S
  'Aff UTM',                // T
  'MISA status',            // U — OK / FAIL_xxx / SKIPPED_CONFIG
  'Tên NV giới thiệu',      // V — tra từ tab NhanVien theo cột Q (Aff mã NV)
];

// ============ MAIN HANDLER ============

function doGet(e) {
  return jsonResponse({
    ok: true,
    service: 'Lead Handler - QuaTang',
    version: '2.5.0',
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
    if (validSecrets.length === 0) {
      // Phân biệt với UNAUTHORIZED để chẩn đoán nhanh khi quên set Script Properties
      return jsonResponse({ ok: false, error: 'NOT_CONFIGURED', message: 'Chưa set Script Property WEBHOOK_SECRET' }, 500);
    }
    if (validSecrets.indexOf(data.secret) === -1) {
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

    // Tra mã NV + tên theo MÃ LINK (cột O) từ Links tab của AffLinks — nguồn
    // đáng tin, không dính timeout. Mã NV lấy từ đây trước, chỉ fallback về
    // giá trị resolve của server (data.aff_ma_nv) khi Links không có.
    const affInfo = findAffLink_(data.aff_ma_link_cuoi);
    const maNV = (affInfo && affInfo.maNV) || String(data.aff_ma_nv || '').trim();
    const tenNV = affInfo ? affInfo.tenNV : '';

    const timestamp = new Date();
    sheet.appendRow([
      timestamp,                                  // A: Thời gian
      safeCell_(data.ho_ten_con),                 // B: Họ tên con
      safeCell_(data.ho_ten),                     // C: Họ tên phụ huynh
      safeCell_(sdtClean),                        // D: SĐT phụ huynh
      safeCell_(data.email),                      // E: Email phụ huynh
      safeCell_(data.truong),                     // F: Trường con đang học
      safeCell_(data.lop),                        // G: Lớp con đang học
      safeCell_(data.co_so),                      // H: Cơ sở
      safeCell_(data.tinh),                       // I: Tỉnh/Thành phố
      safeCell_(data.source || 'quatang.edu.vn'), // J: Nguồn
      safeCell_(data.ip),                         // K: IP
      safeCell_(data.user_agent),                 // L: User Agent
      'Mới',                                      // M: Trạng thái
      '',                                         // N: Ghi chú
      safeCell_(data.aff_ma_link_cuoi),           // O: Aff mã link cuối
      safeCell_(data.aff_ma_link_dau),            // P: Aff mã link đầu
      safeCell_(maNV),                            // Q: Aff mã NV (tra từ Links tab)
      safeCell_(data.aff_click_id),               // R: Aff clickId
      safeCell_(data.aff_thoi_diem_click),        // S: Aff thời điểm click
      safeCell_(data.aff_utm),                    // T: Aff UTM
      safeCell_(data.misa_status),                // U: MISA status
      safeCell_(tenNV),                           // V: Tên NV giới thiệu (tra từ Links tab)
    ]);

    // MISA thất bại → email cảnh báo (không im lặng — FR-E04), throttle 15 phút
    // để MISA sập hàng loạt không đốt hết quota MailApp (100 mail/ngày).
    // Lỗi gửi mail không được làm hỏng việc lưu lead.
    try {
      const misaStatus = String(data.misa_status || '');
      if (misaStatus && misaStatus !== 'OK') {
        const alertTo = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL');
        const cache = CacheService.getScriptCache();
        const throttled = cache.get('misa_alert_sent');
        if (alertTo && !throttled) {
          cache.put('misa_alert_sent', '1', 900); // 15 phút
          MailApp.sendEmail({
            to: alertTo,
            subject: '[MISA-FAIL] Lead quatang.edu.vn chỉ vào Sheet — cần nhập lại MISA',
            body:
              'Một lead vừa KHÔNG vào được MISA CRM (misa_status=' + misaStatus + ').\n\n' +
              'Họ tên con: ' + (data.ho_ten_con || '') + '\n' +
              'SĐT: ' + sdtClean + '\n' +
              'Thời điểm: ' + new Date().toISOString() + '\n\n' +
              'Lead đã được lưu an toàn trong Google Sheet (cột U = ' + misaStatus + ').\n' +
              'Runbook: lọc cột U khác OK, nhập tay vào MISA rồi ghi chú cột N.\n' +
              '(Email này throttle 15 phút — kiểm tra Sheet để thấy TOÀN BỘ row lỗi.)',
          });
        }
      }
    } catch (mailErr) {
      Logger.log('ALERT_EMAIL error (bỏ qua): ' + mailErr.toString());
    }

    // Execution log của Apps Script bị giữ lâu và ai có quyền sửa script đều đọc
    // được → KHÔNG ghi PII vào đây. Che SĐT như phía Next.js (4 số đầu + ***),
    // bỏ hẳn họ tên; chỗ này chỉ cần đủ để soi sự cố, dữ liệu đầy đủ đã ở Sheet.
    Logger.log('Lead saved: sdt=' + sdtClean.slice(0, 4) + '***' +
      ' | cs=' + (data.co_so || '-') + ' | tinh=' + (data.tinh || '-') +
      ' | misa=' + (data.misa_status || '-'));

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

/**
 * Chống formula injection: giá trị bắt đầu bằng = + - @ hoặc tab/CR sẽ được
 * Sheets hiểu là công thức khi mở file — prefix dấu nháy đơn để ép thành text.
 */
function safeCell_(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function jsonResponse(obj, statusCode) {
  const payload = Object.assign({}, obj, { httpStatus: statusCode || 200 });
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Đọc toàn bộ Links tab của AffLinks → map { maLink: { maNV, tenNV } }.
 * Nhận diện cột theo TÊN TIÊU ĐỀ nên không vỡ khi thêm/đổi thứ tự cột.
 * Đọc trực tiếp mỗi lần (volume thấp) → thay đổi Links có hiệu lực ngay.
 */
function getAffLinksMap_() {
  const map = {};
  const id = PropertiesService.getScriptProperties().getProperty('AFFLINKS_SHEET_ID');
  if (!id) { Logger.log('Chưa set AFFLINKS_SHEET_ID — bỏ qua tra mã NV/tên.'); return map; }
  try {
    const sheet = SpreadsheetApp.openById(id).getSheetByName('Links');
    if (!sheet || sheet.getLastRow() < 2) return map;
    const values = sheet.getDataRange().getValues();
    const header = values[0].map(function (h) { return String(h).trim().toLowerCase(); });
    const iCode = header.indexOf('mã link');
    const iMaNV = header.indexOf('mã nv');
    let iTen = header.indexOf('người sử dụng');
    if (iTen === -1) iTen = header.indexOf('người dùng');
    if (iTen === -1) iTen = header.indexOf('tên');
    if (iCode === -1) { Logger.log("Links tab thiếu cột 'Mã link'."); return map; }
    for (let r = 1; r < values.length; r++) {
      const code = String(values[r][iCode]).trim();
      if (!code) continue;
      map[code] = {
        maNV: iMaNV > -1 ? String(values[r][iMaNV]).trim() : '',
        tenNV: iTen > -1 ? String(values[r][iTen]).trim() : '',
      };
    }
  } catch (err) {
    Logger.log('getAffLinksMap_ error (bỏ qua): ' + err);
  }
  return map;
}

/** Tra 1 link theo mã. null nếu không có mã / không tìm thấy. */
function findAffLink_(linkCode) {
  const key = String(linkCode == null ? '' : linkCode).trim();
  if (!key) return null;
  const info = getAffLinksMap_()[key];
  return info || null;
}

/** Lấy sheet; nếu chưa có thì tạo. Nếu dòng 1 trống thì ghi header. */
function ensureSheet_() {
  const ss = getSpreadsheet_();
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
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  writeHeaders_(sheet);
  // Giãn cột cho dễ đọc
  sheet.autoResizeColumns(1, HEADERS.length);
  Logger.log('✅ Đã ghi ' + HEADERS.length + ' cột tiêu đề khớp form.');
}

// ============ CHẠY 1 LẦN — ĐIỀN MÃ NV + TÊN CHO LEAD CŨ ============
// Đọc MÃ LINK ở cột O, tra Links tab AffLinks, ghi mã NV (cột Q) + tên (cột V)
// cho toàn bộ dòng đã có. Chạy lại bất cứ lúc nào để làm mới sau khi sửa Links.
function backfillAff() {
  const sheet = getSpreadsheet_().getSheetByName(SHEET_NAME);
  const last = sheet.getLastRow();
  if (last < 2) { Logger.log('Không có dòng dữ liệu.'); return; }
  const n = last - 1;
  const map = getAffLinksMap_();
  const linkCodes = sheet.getRange(2, 15, n, 1).getValues();    // cột O = 15 (mã link cuối)
  const existingMaNV = sheet.getRange(2, 17, n, 1).getValues(); // cột Q = 17 (giữ nếu link không có trong map)
  const maNVs = [];
  const tens = [];
  let filled = 0;
  for (let i = 0; i < n; i++) {
    const code = String(linkCodes[i][0]).trim();
    const info = code ? map[code] : null;
    if (info) {
      maNVs.push([info.maNV]);
      tens.push([info.tenNV]);
      filled++;
    } else {
      maNVs.push([existingMaNV[i][0]]); // không khớp → giữ nguyên mã NV cũ (nếu có)
      tens.push(['']);
    }
  }
  sheet.getRange(2, 17, n, 1).setValues(maNVs); // Q
  sheet.getRange(2, 22, n, 1).setValues(tens);  // V
  Logger.log('✅ Backfill: ' + filled + '/' + n + ' dòng khớp link trong AffLinks.');
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
