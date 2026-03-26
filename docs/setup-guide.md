# Hướng Dẫn Setup Từ A-Z — KB Agent

> Sau khi làm xong hướng dẫn này, bạn sẽ có:
> - App chạy trên Cloudflare Pages (URL public, test được)
> - RAG hoạt động với tài liệu PDF thật
> - Toàn bộ flow: Portal → Chat → Evaluation

---

## Điều Kiện Trước (Đã Có)

- [x] Wrangler đã login: `vankiet27012004@gmail.com`
- [x] Account ID: `17ef0773d67cc95ac1c7cd390fbf47cc`
- [x] D1 database `kb-agent-db` (ID: `1f3d03a7-4ead-4116-9b58-6b2092ae5e8e`) — đã migrate, đã seed
- [x] Vectorize index `kb-embeddings` — đã tạo, **chưa có data**
- [x] Code build thành công (`pnpm build` không lỗi)

---

## Bước 1 — Lấy OpenAI API Key

Truy cập: https://platform.openai.com/api-keys → **Create new secret key**

Copy key (dạng `sk-proj-...` hoặc `sk-...`). Giữ để dùng ở các bước sau.

---

## Bước 2 — Điền Env Vars

### 2a. File `.env.local` (dùng cho `pnpm dev`)

Mở file `kb-agent/.env.local`, điền:

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
LTI_MOCK_SECRET=kb-agent-mock-secret-demo-2026-abcd1234
LTI_MODE=mock
SESSION_SECRET=kb-agent-session-secret-demo-2026-xyz9876
```

> **Lưu ý:** `LTI_MOCK_SECRET` và `SESSION_SECRET` phải dài ≥ 32 ký tự. Có thể dùng bất kỳ chuỗi nào.

### 2b. File `.dev.vars` (dùng cho wrangler dev / deploy)

Mở file `kb-agent/.dev.vars`, điền **giống hệt** `.env.local`:

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
LTI_MOCK_SECRET=kb-agent-mock-secret-demo-2026-abcd1234
LTI_MODE=mock
SESSION_SECRET=kb-agent-session-secret-demo-2026-xyz9876
```

---

## Bước 3 — Test Local Nhanh (UI Only, Không Cần PDF)

Chạy lệnh sau để test giao diện trước khi deploy:

```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent
pnpm dev
```

Mở trình duyệt: **http://localhost:3000**

**Flow test:**
1. Trang portal Moodle hiện ra — chọn sinh viên + môn học → click **Launch AI Knowledge Base**
2. Được redirect vào trang chat
3. Gửi câu hỏi — AI sẽ trả lời (nhưng chưa có RAG context vì Vectorize chưa có data, sẽ thấy thông báo "Không tìm thấy tài liệu liên quan")
4. Hỏi 4 câu → banner "Xem đánh giá" hiện ra → nhấn xem trang evaluation

> **Nếu gặp lỗi DB** khi launch: chạy thêm lệnh khởi tạo local DB ở cuối trang (Phụ lục A).

---

## Bước 4 — Chuẩn Bị PDF Và Ingest (BẮT BUỘC cho RAG)

### 4a. Lấy Cloudflare API Token

1. Truy cập: https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token** → chọn template **Edit Cloudflare Workers**
3. Trong phần **Permissions**, thêm:
   - `Cloudflare D1` → `Edit`
   - `Vectorize` → `Edit`
4. **Account Resources**: chọn account của bạn
5. Click **Continue to summary** → **Create Token**
6. Copy token (chỉ hiện 1 lần)

### 4b. Đặt PDF vào thư mục

```
kb-agent/public/sample-docs/
├── giao-trinh-ctdl.pdf      ← bài giảng CTDL & Giải Thuật
├── giao-trinh-oop.pdf       ← bài giảng Lập Trình Hướng Đối Tượng
└── giao-trinh-db.pdf        ← bài giảng Cơ Sở Dữ Liệu
```

> Dùng **bất kỳ PDF nào** liên quan đến môn học. Slide bài giảng hoặc giáo trình đều ổn.
> Tối thiểu 1 file cũng đủ để demo.

### 4c. Chạy Ingestion

```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent

# Điền các giá trị vào đây trước khi chạy:
set OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
set CLOUDFLARE_ACCOUNT_ID=17ef0773d67cc95ac1c7cd390fbf47cc
set CLOUDFLARE_API_TOKEN=<token vừa tạo ở bước 4a>
set CLOUDFLARE_D1_DATABASE_ID=1f3d03a7-4ead-4116-9b58-6b2092ae5e8e
set CLOUDFLARE_VECTORIZE_INDEX=kb-embeddings

# Ingest từng file (chạy lần lượt):
pnpm ingest -- --pdf ./public/sample-docs/giao-trinh-ctdl.pdf --course course-ctdl-001 --doc-name "Giáo trình CTDL" --doc-id doc-ctdl-001

pnpm ingest -- --pdf ./public/sample-docs/giao-trinh-oop.pdf --course course-oop-001 --doc-name "Giáo trình OOP" --doc-id doc-oop-001

pnpm ingest -- --pdf ./public/sample-docs/giao-trinh-db.pdf --course course-db-001 --doc-name "Giáo trình CSDL" --doc-id doc-db-001
```

**Kết quả mong đợi:**
```
📄 Loading PDF: ./public/sample-docs/giao-trinh-ctdl.pdf
   Pages: 45, Text length: 89432 chars
💾 Inserting document record in D1...
🔪 Chunked into 47 chunks
   ✓ 10/47 chunks processed
   ✓ 20/47 chunks processed
   ...
✅ Done! Ingested 47 chunks for "Giáo trình CTDL"
```

> **Mỗi file mất khoảng 1-2 phút** tùy số trang. Nếu lỗi rate limit OpenAI thì đợi 1 phút rồi chạy lại.

---

## Bước 5 — Build Cho Cloudflare

```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent
pnpm build:cf
```

Lệnh này chạy `next build` rồi `@opennextjs/cloudflare build`. Kết quả ở thư mục `.open-next/`.

**Thời gian:** ~30-60 giây. Kết quả bình thường nếu không có dòng `error`.

---

## Bước 6 — Deploy Lên Cloudflare Pages

```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent
pnpm deploy
```

Lệnh này tự động:
1. Build Next.js
2. Build Cloudflare adapter
3. Upload lên Cloudflare Pages

**Kết quả:** Wrangler sẽ hiển thị URL dạng:
```
✨ Deployment complete!
   https://kb-agent.pages.dev
   (hoặc dạng: https://abc123.kb-agent.pages.dev)
```

> **Lần đầu deploy** sẽ hỏi tên project — gõ `kb-agent` rồi Enter.

---

## Bước 7 — Thêm Secrets Lên Cloudflare Pages

Sau khi deploy lần đầu, vào **Cloudflare Dashboard** để thêm env vars:

1. Mở: https://dash.cloudflare.com
2. Vào **Workers & Pages** → chọn project `kb-agent`
3. Vào tab **Settings** → **Variables and Secrets**
4. Click **Add variable** và thêm lần lượt:

| Variable Name | Value | Type |
|---|---|---|
| `OPENAI_API_KEY` | `sk-proj-...` | Secret |
| `LTI_MOCK_SECRET` | `kb-agent-mock-secret-demo-2026-abcd1234` | Secret |
| `SESSION_SECRET` | `kb-agent-session-secret-demo-2026-xyz9876` | Secret |
| `LTI_MODE` | `mock` | Plain text |

5. Click **Save**
6. **Trigger redeploy**: vào tab **Deployments** → chọn deployment mới nhất → **Retry deployment**

> Tại sao cần redeploy? Env vars chỉ có tác dụng sau khi app được deploy lại với secrets mới.

---

## Bước 8 — Test Production

Mở URL Cloudflare Pages của bạn (từ Bước 6).

### Checklist test:

**1. Portal**
- [ ] Trang hiển thị giao diện Moodle (header xanh)
- [ ] Dropdown sinh viên + môn học hoạt động
- [ ] Click **Launch AI Knowledge Base** → spinner "Đang xác thực LTI 1.3..." → redirect vào chat

**2. Chat**
- [ ] Trang chat hiện ra với tên sinh viên + môn học
- [ ] Gửi câu hỏi → ThinkingIndicator chạy → AI trả lời
- [ ] Nếu đã ingest PDF: câu trả lời có badge `[1]` `[2]` → click xem popover citation (tên doc + trang + trích dẫn)
- [ ] Sidebar bên phải: thấy danh sách tài liệu đã ingest
- [ ] Gửi 4 câu → banner evaluation hiện ra

**3. Evaluation**
- [ ] Nhấn "Xem ngay" → trang evaluation tải với animation
- [ ] Radar chart hiện ra với 5 trục điểm
- [ ] Score count-up animation chạy
- [ ] Thấy điểm mạnh, cần cải thiện, chủ đề ôn luyện

**4. Health check**
- [ ] Mở `https://<your-url>/api/health` trong tab mới → hiển thị JSON `{"status":"ok",...}`

---

## Bước 9 — Clear Data Cho Demo Thật

Trước khi demo cho ban giám khảo, xóa toàn bộ test data:

```bash
# Xóa messages test
npx wrangler d1 execute kb-agent-db --remote --command="DELETE FROM messages WHERE 1=1"

# Xóa evaluations test
npx wrangler d1 execute kb-agent-db --remote --command="DELETE FROM evaluations WHERE 1=1"

# Xóa chat sessions test
npx wrangler d1 execute kb-agent-db --remote --command="DELETE FROM chat_sessions WHERE 1=1"
```

> Không xóa `students`, `courses`, `documents`, `document_chunks` — đây là data cần thiết.

---

## Xử Lý Lỗi Thường Gặp

### "Launch failed" khi click portal
- Kiểm tra `OPENAI_API_KEY` đã được thêm vào Cloudflare Pages secrets chưa
- Kiểm tra `LTI_MOCK_SECRET` và `SESSION_SECRET` đã được thêm chưa
- Sau khi thêm secrets, phải **retry deployment**

### Chat trả lời nhưng không có citation
- Vectorize chưa có data → chạy lại Bước 4
- Xác nhận: `npx wrangler vectorize get-vectors kb-embeddings --ids=test` (nếu không lỗi thì index tồn tại)

### Evaluation bị lỗi "Không thể tạo đánh giá"
- Cần ít nhất 1 user message trong session
- Kiểm tra `OPENAI_API_KEY` hợp lệ và có balance

### Build:cf thất bại
```bash
# Xóa cache rồi build lại
rm -rf .open-next .next
pnpm build:cf
```

### Deploy lỗi "No project found"
```bash
# Chỉ định tên project rõ ràng
npx wrangler pages deploy .open-next/assets --project-name=kb-agent
```

---

## Phụ Lục A — Khởi Tạo Local DB (chỉ cho `pnpm dev`)

Nếu `pnpm dev` báo lỗi DB khi launch từ portal:

```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent

# Tạo local.db từ migration file
npx wrangler d1 execute kb-agent-db --local --file=drizzle/migrations/0000_cloudy_doctor_spectrum.sql
npx wrangler d1 execute kb-agent-db --local --file=scripts/seed-demo-data.sql
```

> Lưu ý: `pnpm dev` dùng local SQLite (`local.db`), không kết nối Vectorize thật. RAG sẽ trả về "không tìm thấy tài liệu" — đây là bình thường. Để test RAG đầy đủ, cần deploy lên CF Pages.

---

## Phụ Lục B — Câu Hỏi Demo "Ăn Tiền"

Chuẩn bị sẵn các câu hỏi này để demo cho ban giám khảo:

**Môn CTDL & Giải Thuật:**
1. "Giải thích độ phức tạp thuật toán O(n log n) là gì?"
2. "Cây nhị phân tìm kiếm khác gì với cây nhị phân thường?"
3. "Khi nào nên dùng stack, khi nào dùng queue?"
4. "Thuật toán sắp xếp nào tốt nhất cho mảng gần như đã được sắp xếp?"

*(Sau câu 4 → evaluation tự động trigger)*

**Điểm nhấn cho BGK:**
- Chỉ vào badge `[1]` `[2]` trong câu trả lời → click → popover hiện tên tài liệu + số trang
- Sidebar bên phải: thấy danh sách tài liệu thật đã ingest
- Trang `/api/health` trong tab khác: hiện live infrastructure status
- Trang evaluation: radar chart animate, score count-up

---

## Tóm Tắt Lệnh

```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent

# Test local (UI only)
pnpm dev

# Ingest PDF (cần env vars set)
pnpm ingest -- --pdf ./public/sample-docs/file.pdf --course course-ctdl-001 --doc-name "Tên" --doc-id doc-001

# Deploy lên Cloudflare Pages
pnpm deploy

# Xem logs production
npx wrangler pages deployment tail

# Query D1 remote
npx wrangler d1 execute kb-agent-db --remote --command="SELECT COUNT(*) FROM document_chunks"
```
