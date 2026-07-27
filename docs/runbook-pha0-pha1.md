# Runbook Pha 0 + Pha 1 — quatang.edu.vn (Affiliate BRD-AFF-005)

> ## ⚠️ REPO NÀY LÀ PUBLIC — AI CŨNG ĐỌC ĐƯỢC FILE NÀY
> Không bao giờ đặt giá trị thật (FormKey, secret, token, ID/mã công ty của MISA…) vào bất kỳ
> file nào trong repo, kể cả docs. Trong tài liệu chỉ dùng placeholder `<TÊN_BIẾN>`; giá trị thật
> chỉ sống ở Vercel env và `.env.local` (đã gitignore).
> Lý do viết to ở đây: chính file này từng ghi thẳng giá trị thật vì tưởng repo là private.

> Toàn bộ runbook này áp dụng cho MỘT project duy nhất:
> repo GitHub **`hptkk29/LandingPageQuaTang`** (**public**) ↔ Vercel project **`landing-page-qua-tang`** ↔ domain **quatang.edu.vn**.
>
> Nguyên tắc xuyên suốt: **không được có thời điểm nào form mất khả năng gửi lead**. Vì vậy thứ tự các bước là bắt buộc — không đảo.

---

## Bước 1 — Set biến môi trường trên Vercel (làm TRƯỚC khi push/merge)

Vercel Dashboard → project **landing-page-qua-tang** → Settings → Environment Variables.
Mỗi biến tick cả **Production** và **Preview**.

### 1a. Bắt buộc ngay (thiếu là MISA channel tắt — lead chỉ vào Sheet)

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `MISA_FORM_ID` | `<MISA_FORM_ID>` | ID form quà tặng (không đổi khi xoay key) |
| `MISA_COMPANY_CODE` | `<MISA_COMPANY_CODE>` | |
| `MISA_FORM_KEY` | *(copy dòng `MISA_FORM_KEY` trong `.env.local` — là key ĐANG chạy; sẽ thay ở Bước 5)* | KHÔNG dán key vào file/chat/commit |
| `MISA_ALLOW_URL` | `https://quatang.edu.vn` | ✅ Đã siết (27/07/2026), khớp cấu hình AllowURL trên MISA admin. Code cũng không còn default `*` |
| `GOOGLE_SCRIPT_URL` | *(copy dòng `GOOGLE_SCRIPT_URL` trong `.env.local` — chính là URL cũ của `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`)* | Tên mới server-only |

> **Tra 3 giá trị MISA ở đâu**: MISA AMIS CRM → Cài đặt → Web form → form quà tặng → *Lấy mã nhúng*.
> Trong đoạn mã nhúng có đủ `ID` (= `MISA_FORM_ID`), `Companycode` (= `MISA_COMPANY_CODE`) và `FormKey`.
> Nếu đã cấu hình rồi thì đọc lại ở Vercel → Settings → Environment Variables, hoặc `.env.local`.
> Cả 3 là yếu tố xác thực của web-to-lead → coi như secret, không viết vào docs/commit/chat.
>
> ⚠️ Trước đây `MISA_FORM_ID` và `MISA_COMPANY_CODE` từng nằm thẳng trong file này. Xoá bây giờ
> **không** gỡ được chúng khỏi lịch sử git đã public — phải coi 2 giá trị đó là đã lộ vĩnh viễn.
> Lớp bảo vệ còn lại là FormKey (xoay ở Bước 5) + AllowURL (siết ở Bước 5c).

Kiểm tra biến **đã tồn tại sẵn** trên Vercel (không sửa):
- `GOOGLE_SCRIPT_SECRET` — phải có sẵn (backup Sheet đang chạy production bằng nó)

> `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` — ✅ đã xoá khỏi Vercel (27/07/2026) và code cũng đã bỏ fallback.
> Đừng tạo lại: đặt tên `NEXT_PUBLIC_` cho một URL server-only là quả mìn — chỉ cần một client
> component lỡ tham chiếu là Next inline thẳng giá trị vào bundle trình duyệt.

### 1b. Affiliate — set ngay với giá trị "chưa bật"

| Biến | Giá trị bây giờ | Bật khi nào |
|---|---|---|
| `AFF_STORE` | `sheet` | Pha 4 đổi thành `satarobo` |
| `AFF_SHEET_API_URL` | *(để trống — điền sau Bước 4)* | Sau khi deploy Apps Script AffLinks |
| `AFF_SHEET_SECRET` | *(để trống — điền sau Bước 4)* | Như trên |
| `MISA_AFF_FIELD_NAME` | *(để trống)* | Set `CustomField26` SAU khi form quà tặng trên MISA đã có field này (Bước 5b) |
| `MISA_AFF_LEAD_SOURCE_FIELD` | *(để trống)* | Tên field "Nguồn gốc Leads" trên form quà tặng — là `FacebookID`, KHÔNG phải `LeadSourceID` (mỗi form MISA map một kiểu) |
| `MISA_AFF_LEAD_SOURCE_ID` | *(để trống)* | Set sau khi chốt giá trị "Nguồn gốc Leads" cho affiliate (tham khảo: form sale có value `7` = "Nguồn từ nhân viên giới thiệu") |

> Phải set **CẢ HAI** `MISA_AFF_LEAD_SOURCE_FIELD` và `MISA_AFF_LEAD_SOURCE_ID` thì field mới được
> gửi — thiếu một trong hai là khối gửi ở `lib/server/misa.ts:97-101` bị bỏ qua **im lặng**
> (fail-safe: thà không gửi còn hơn gửi giá trị giả). Đây là bẫy dễ tưởng "đã bật xong".

> Để trống = tính năng tự tắt an toàn: không gửi field giả sang MISA (FR-B08), /r/ vẫn redirect bình thường (fail-open).

### 1c. Tuỳ chọn (có default, không cần set)
`MISA_ENDPOINT`, `MISA_REDIRECT_URL`.

---

## Bước 2 — Push + merge (repo LandingPageQuaTang)

```bash
cd "D:\Web Quatang\LandingPageQuaTang"
git push -u origin feat/aff-pha0-pha1
```

1. Vercel tự tạo **Preview deploy** cho branch → mở URL preview, kiểm tra:
   - Trang chủ hiển thị bình thường, form không đổi giao diện (AC-10)
   - `https://<preview>/r/testcode1234567890` → về trang chủ, DevTools thấy 3 cookie `aff_*` (Max-Age 7776000)
2. Merge vào `main` (tạo PR trên GitHub hoặc `git checkout main && git merge feat/aff-pha0-pha1 && git push`) → Vercel deploy production.
3. **Ngay sau deploy production**: gửi 1 lead test trên quatang.edu.vn với tên **"TEST - xoá"** + SĐT nội bộ:
   - Lead phải xuất hiện trong MISA CRM → xoá lead trong CRM
   - Vercel → Logs → tìm `[misa]` — đọc body response thật của savecollection (lần đầu tiên nhìn thấy format thật). Nếu log `[MISA-FAIL]` mà lead VẪN vào CRM (hoặc ngược lại) → báo dev tinh chỉnh hàm `classifyMisaResponse` trong `lib/server/misa.ts`
   - Google Sheet "Leads" có row mới, cột U (`MISA status`) = `OK`

---

## Bước 3 — Cập nhật Apps Script lead-handler lên v2.3 (script ĐANG chạy)

Trên script.google.com, mở project Apps Script hiện tại (cái nhận lead backup):

1. **Project Settings → Script Properties**, thêm:
   - `WEBHOOK_SECRET` = giá trị hiện tại của `GOOGLE_SCRIPT_SECRET` (copy từ `.env.local`)
   - `SHEET_ID` = ID spreadsheet "Leads", lấy từ URL `https://docs.google.com/spreadsheets/d/<ID-NÀY>/edit`
   - `ALERT_EMAIL` = `satarobo.it@gmail.com`
   ⚠️ Làm bước này TRƯỚC khi paste code mới. v2.2 đã bỏ secret hardcode và v2.3 bỏ nốt `SHEET_ID`
   hardcode — thiếu `WEBHOOK_SECRET` là script từ chối mọi lead (`NOT_CONFIGURED`), thiếu `SHEET_ID`
   là script **throw ở mọi lead** và kênh backup Sheet chết câm. Cố ý không có giá trị mặc định:
   ghi nhầm sang spreadsheet khác tệ hơn nhiều so với báo lỗi to.
2. Thay toàn bộ code bằng `docs/apps-script-lead-handler.gs` (v2.3).
3. Chọn hàm `setupHeaders` → Run (ghi thêm cột O–U, không mất dữ liệu cũ).
4. Deploy → Manage deployments → Edit → Version: **New version** → Deploy (GIỮ NGUYÊN URL).
5. Test: gửi lại 1 lead test → row mới đủ 21 cột.

*(Xoay secret Sheet — không gấp, làm sau khi mọi thứ ổn: sinh secret mới → thêm `WEBHOOK_SECRET` = mới, `WEBHOOK_SECRET_OLD` = cũ → New version → đổi `GOOGLE_SCRIPT_SECRET` trên Vercel → redeploy → xoá `WEBHOOK_SECRET_OLD` → New version.)*

---

## Bước 4 — Tạo kho mã AffLinks (spreadsheet + Apps Script MỚI, tách riêng script cũ)

1. **Tạo spreadsheet mới** trên Google Drive, đặt tên `AffLinks`. Copy ID từ URL
   (`https://docs.google.com/spreadsheets/d/<ID-NÀY>/edit`).
2. **script.google.com → New project**, đặt tên `AffLinks API`, paste toàn bộ `docs/apps-script-aff-links.gs`.
3. **Project Settings → Script Properties**:
   - `AFF_SHEET_ID` = ID spreadsheet ở bước 1
   - `AFF_SECRET` = chuỗi ngẫu nhiên dài tự sinh. Chạy trong PowerShell (dự án đã có Node sẵn):

     ```powershell
     node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
     ```

     > Vì sao không dùng `Get-Random`: đó là PRNG thường, không phải nguồn ngẫu nhiên mật mã —
     > đoán được state là đoán được secret. Ngoài ra cách viết `Get-Random -Count 48` lấy 48 ký tự
     > **không lặp** từ tập 62, tức là hoán vị chứ không phải chọn tự do → không gian khoá hẹp hơn
     > nhiều so với vẻ ngoài "48 ký tự". `crypto.randomBytes` cho đủ 256 bit entropy thật.
     > (Không có Node trong tay thì dùng CSPRNG của .NET:
     > `[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`)
4. Chọn hàm `setupSheets` → Run (cấp quyền khi hỏi) → spreadsheet có 2 tab **Links** + **Clicks** với header màu cam.
5. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone** → Deploy → copy **Web app URL**.
6. Quay lại Vercel env (Bước 1b): điền `AFF_SHEET_API_URL` = Web app URL, `AFF_SHEET_SECRET` = giá trị `AFF_SECRET` → **Redeploy** production (env change cần redeploy).
7. **Tạo link đầu tiên**: trong Apps Script editor chọn hàm `generateLinkCode` → Run → xem Logs lấy mã 20 ký tự → thêm dòng vào tab Links:
   | Mã link | Mã NV | Nhãn kênh | Trang đích | Trạng thái | Ngày tạo | Người tạo | Số click |
   |---|---|---|---|---|---|---|---|
   | *(mã vừa sinh)* | SR-MK-004 | Zalo | Trang quà tặng | `Đang chạy` | 24/07/2026 | *(tên bạn)* | 0 |
8. Test end-to-end (AC-03): mở `https://quatang.edu.vn/r/<mã>` → về trang chủ → tab Clicks có row mới, `Hợp lệ = TRUE`, Số click = 1 → điền form lead test → Sheet Leads: cột O = mã link, **cột Q = SR-MK-004** → xoá lead test trong MISA.

> Trạng thái link chỉ nhận đúng 4 giá trị: `Đang chạy` / `Tạm dừng` / `Đã thu hồi` / `Đã xoay mã`. Chỉ `Đang chạy` mới được gán người giới thiệu.

---

## Bước 5 — MISA admin: xoay FormKey + thêm field affiliate + siết AllowURL

⚠️ Chỉ làm SAU khi Bước 2 đã xong và lead test đầu tiên đã vào CRM qua đường server mới. Xoay key trước khi deploy đường server = **mất lead** (bundle cũ trên trình duyệt khách vẫn gửi key cũ).

### 5a. Form quà tặng trên MISA AMIS — ✅ ĐÃ XONG (27/07/2026)

Đã xử lý dứt điểm theo hướng **mạnh hơn** phương án regenerate ban đầu: **2 form CŨ đã được XOÁ hẳn**
khỏi MISA AMIS, không còn nhận lead. Nghĩa là FormKey cũ (đã lộ vĩnh viễn trong git history public)
giờ vô hại — không còn form nào để nó mở. Site đang chạy trên form mới, credentials chỉ nằm ở
Vercel env + `.env.local`, chưa từng vào repo.

Còn lại trên form ĐANG DÙNG (làm khi cần bật affiliate):
1. **Thêm field "Mã số NV nhập dữ liệu"** (`CustomField26`) — để dạng ẩn/không bắt buộc.
2. Thêm field **"Nguồn gốc Leads"** + giá trị cho nhóm affiliate. Trên form quà tặng field này tên
   kỹ thuật là **`FacebookID`**, KHÔNG phải `LeadSourceID` (đã xác định ở commit `3d35dbf`) — ghi lại
   đúng tên để điền vào `MISA_AFF_LEAD_SOURCE_FIELD`.
3. Lưu + lấy mã nhúng mới → FormKey chỉ lưu vào Vercel env + `.env.local`, **KHÔNG commit**.

### 5b. Đổi env trên Vercel (project landing-page-qua-tang)
1. `MISA_FORM_KEY` = key mới
2. `MISA_AFF_FIELD_NAME` = `CustomField26`
3. `MISA_AFF_LEAD_SOURCE_FIELD` = `FacebookID` (hoặc tiếp tục để trống)
4. `MISA_AFF_LEAD_SOURCE_ID` = giá trị đã chốt (hoặc tiếp tục để trống) — **phải set cùng lúc với
   `MISA_AFF_LEAD_SOURCE_FIELD`**, thiếu một trong hai là field không được gửi
5. **Redeploy** → gửi lead test qua link affiliate → kiểm tra trong MISA lead có ô "Mã số NV nhập dữ liệu" = mã NV → xoá lead test.
6. ~~Kiểm tra key cũ đã chết~~ — **không còn cần**: 2 form cũ đã bị xoá khỏi MISA (5a), không
   còn form nào để key cũ mở.

   > Vì sao không dùng `curl -d "...FormKey=<KEY-CŨ>..."`: key nằm trên dòng lệnh sẽ đi vào history
   > của PowerShell (PSReadLine ghi ra `ConsoleHost_history.txt`) và hiện trong process list của máy —
   > đúng thứ mà nguyên tắc ở Bước 1a cấm ("KHÔNG dán key vào file/chat/commit"). Cách trên nhận key
   > qua `Read-Host` nên key chỉ nằm trong bộ nhớ tiến trình, không lưu lại ở đâu.
6. Cập nhật `MISA_FORM_KEY` trong `.env.local` local cho khớp.

### 5c. Siết AllowURL (P0-02) — làm sau cùng, khi 5a/5b đã ổn ≥1 ngày
1. Trên MISA admin: đổi cấu hình AllowURL của form từ `*` về `https://quatang.edu.vn`.
2. Trên Vercel: `MISA_ALLOW_URL` = `https://quatang.edu.vn` → Redeploy.
3. Gửi lead test ngay. Nếu MISA từ chối request từ server Vercel (kiểm tra origin thật) → tạm nới lại `*` ở CẢ hai nơi rồi báo dev (code đã gửi sẵn header `Origin/Referer` nên khả năng cao là qua).

---

## Sự cố & đối soát hằng ngày

- **Email `[MISA-FAIL]`** (throttle 15 phút) hoặc sáng ra lọc Sheet Leads **cột U ≠ OK** → nhập tay các lead đó vào MISA, ghi chú vào cột N.
- Vercel Logs lọc `[MISA-FAIL]` để xem chi tiết response.
- Nghi ngờ có người dò mã: Sheet AffLinks tab Clicks lọc `Hợp lệ = FALSE`.
- Rollback khẩn cấp: Vercel → Deployments → deployment trước đó → Promote to Production.
