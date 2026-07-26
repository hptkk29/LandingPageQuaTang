# Runbook Pha 0 + Pha 1 — quatang.edu.vn (Affiliate BRD-AFF-005)

> Toàn bộ runbook này áp dụng cho MỘT project duy nhất:
> repo GitHub **`hptkk29/LandingPageQuaTang`** (private) ↔ Vercel project **`landing-page-qua-tang`** ↔ domain **quatang.edu.vn**.
>
> Nguyên tắc xuyên suốt: **không được có thời điểm nào form mất khả năng gửi lead**. Vì vậy thứ tự các bước là bắt buộc — không đảo.

---

## Bước 1 — Set biến môi trường trên Vercel (làm TRƯỚC khi push/merge)

Vercel Dashboard → project **landing-page-qua-tang** → Settings → Environment Variables.
Mỗi biến tick cả **Production** và **Preview**.

### 1a. Bắt buộc ngay (thiếu là MISA channel tắt — lead chỉ vào Sheet)

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `MISA_FORM_ID` | `adaa2ae1-2b96-d740-131b-c6020c5c6c7e` | ID form quà tặng (không đổi khi xoay key) |
| `MISA_COMPANY_CODE` | `uys4eef4` | |
| `MISA_FORM_KEY` | *(copy dòng `MISA_FORM_KEY` trong `.env.local` — là key ĐANG chạy; sẽ thay ở Bước 5)* | KHÔNG dán key vào file/chat/commit |
| `MISA_ALLOW_URL` | `*` | Khớp cấu hình MISA hiện tại. Đổi thành `https://quatang.edu.vn` ở Bước 5c |
| `GOOGLE_SCRIPT_URL` | *(copy dòng `GOOGLE_SCRIPT_URL` trong `.env.local` — chính là URL cũ của `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`)* | Tên mới server-only |

Kiểm tra 2 biến **đã tồn tại sẵn** trên Vercel (không sửa):
- `GOOGLE_SCRIPT_SECRET` — phải có sẵn (backup Sheet đang chạy production bằng nó)
- `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` — giữ nguyên làm fallback 1 release, xoá sau

### 1b. Affiliate — set ngay với giá trị "chưa bật"

| Biến | Giá trị bây giờ | Bật khi nào |
|---|---|---|
| `AFF_STORE` | `sheet` | Pha 4 đổi thành `satarobo` |
| `AFF_SHEET_API_URL` | *(để trống — điền sau Bước 4)* | Sau khi deploy Apps Script AffLinks |
| `AFF_SHEET_SECRET` | *(để trống — điền sau Bước 4)* | Như trên |
| `MISA_AFF_FIELD_NAME` | *(để trống)* | Set `CustomField26` SAU khi form quà tặng trên MISA đã có field này (Bước 5b) |
| `MISA_AFF_LEAD_SOURCE_ID` | *(để trống)* | Set sau khi chốt giá trị "Nguồn gốc Leads" cho affiliate (tham khảo: form sale có value `7` = "Nguồn từ nhân viên giới thiệu") |

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

## Bước 3 — Cập nhật Apps Script lead-handler lên v2.2 (script ĐANG chạy)

Trên script.google.com, mở project Apps Script hiện tại (cái nhận lead backup):

1. **Project Settings → Script Properties**, thêm:
   - `WEBHOOK_SECRET` = giá trị hiện tại của `GOOGLE_SCRIPT_SECRET` (copy từ `.env.local`)
   - `ALERT_EMAIL` = `satarobo.it@gmail.com`
   ⚠️ Làm bước này TRƯỚC khi paste code mới — v2.2 không còn secret hardcode, thiếu property là script từ chối mọi lead (`NOT_CONFIGURED`).
2. Thay toàn bộ code bằng `docs/apps-script-lead-handler.gs` (v2.2).
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
   - `AFF_SECRET` = chuỗi ngẫu nhiên dài tự sinh (ví dụ chạy trong PowerShell: `-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | % {[char]$_})`)
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

### 5a. Gộp 1 lần re-publish form quà tặng trên MISA AMIS
Vào MISA AMIS CRM → Cài đặt → Web form → form quà tặng (`adaa2ae1-...`), trong MỘT lần chỉnh sửa:
1. **Thêm field "Mã số NV nhập dữ liệu"** (`CustomField26`) vào form — để dạng ẩn/không bắt buộc.
2. (Nếu được) thêm field **"Nguồn gốc Leads"** (`LeadSourceID`) + bổ sung giá trị cho nhóm affiliate.
3. **Cấp lại/regenerate FormKey** (key cũ đã lộ trong git history public trước đây).
4. Lưu + lấy mã nhúng mới → ghi lại **FormKey mới** (chỉ lưu vào Vercel env + `.env.local`, KHÔNG commit).

### 5b. Đổi env trên Vercel (project landing-page-qua-tang)
1. `MISA_FORM_KEY` = key mới
2. `MISA_AFF_FIELD_NAME` = `CustomField26`
3. `MISA_AFF_LEAD_SOURCE_ID` = giá trị đã chốt (hoặc tiếp tục để trống)
4. **Redeploy** → gửi lead test qua link affiliate → kiểm tra trong MISA lead có ô "Mã số NV nhập dữ liệu" = mã NV → xoá lead test.
5. Kiểm tra key cũ đã chết:
   `curl -s -X POST https://amisapp.misa.vn/crm/gc/api/open/WebForm/savecollection -d "ID=adaa2ae1-2b96-d740-131b-c6020c5c6c7e&Companycode=uys4eef4&FormKey=<KEY-CŨ>&LastName=test-key-cu"` → phải bị từ chối.
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
