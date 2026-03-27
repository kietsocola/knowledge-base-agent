# Hướng Dẫn Triển Khai KB Agent — Vercel + Supabase

> Làm theo đúng thứ tự. Mỗi bước phụ thuộc vào bước trước.

---

## Mục lục

1. [Yêu cầu trước khi bắt đầu](#1-yêu-cầu-trước-khi-bắt-đầu)
2. [Tạo project Supabase](#2-tạo-project-supabase)
3. [Lấy connection string và enable pgvector](#3-lấy-connection-string-và-enable-pgvector)
4. [Chuẩn bị env local](#4-chuẩn-bị-env-local)
5. [Cài dependency và push schema](#5-cài-dependency-và-push-schema)
6. [Seed dữ liệu demo](#6-seed-dữ-liệu-demo)
7. [Ingest PDF tài liệu](#7-ingest-pdf-tài-liệu)
8. [Test local trước khi deploy](#8-test-local-trước-khi-deploy)
9. [Tạo project Vercel và deploy](#9-tạo-project-vercel-và-deploy)
10. [Test production hoàn chỉnh](#10-test-production-hoàn-chỉnh)
11. [Xử lý sự cố thường gặp](#11-xử-lý-sự-cố-thường-gặp)

---

## 1. Yêu cầu trước khi bắt đầu

Kiểm tra các công cụ đã cài:

```bash
node --version      # cần >= 20
pnpm --version      # cần >= 9
git --version
```

Cần có tài khoản tại:

- [supabase.com](https://supabase.com) — free tier là đủ
- [vercel.com](https://vercel.com) — free tier là đủ
- [platform.openai.com](https://platform.openai.com) — cần API key có credit

---

## 2. Tạo project Supabase

1. Đăng nhập [app.supabase.com](https://app.supabase.com)
2. Nhấn **New project**
3. Điền thông tin:
   - **Name:** `kb-agent` (hoặc tên tuỳ ý)
   - **Database Password:** đặt mật khẩu mạnh, **lưu lại ngay** — dùng sau
   - **Region:** chọn gần nhất (Southeast Asia → Singapore)
4. Nhấn **Create new project** — đợi khoảng 1–2 phút để Supabase khởi tạo

---

## 3. Lấy connection string và enable pgvector

### 3.1 Lấy DATABASE_URL

Trong Supabase dashboard của project vừa tạo:

1. Vào **Settings** (icon bánh răng ở sidebar trái)
2. Chọn **Database**
3. Kéo xuống phần **Connection string**
4. Chọn tab **URI**
5. Copy chuỗi có dạng:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. **Thay `[YOUR-PASSWORD]`** bằng mật khẩu đã đặt ở bước 2

> **Lưu ý:** Nếu mật khẩu có ký tự đặc biệt (như `@`, `#`, `!`), cần URL-encode chúng.
> Ví dụ: `p@ss!` → `p%40ss%21`

### 3.2 Enable pgvector extension

Vẫn trong Supabase dashboard:

1. Vào **Database** → **Extensions** (ở sidebar)
2. Tìm `vector` trong thanh tìm kiếm
3. Bật toggle **Enable** cho extension `vector`
4. Xác nhận trong popup

Hoặc chạy SQL trực tiếp qua **SQL Editor** (Database → SQL Editor):

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 4. Chuẩn bị env local

Trong thư mục `kb-agent/`, tạo file `.env.local`:

```bash
# Vào thư mục project
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent
```

Tạo file `.env.local` với nội dung sau (thay các giá trị `...` bằng thực tế):

```env
# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres

# OpenAI
OPENAI_API_KEY=sk-...

# LTI (giữ nguyên như này cho demo)
LTI_MODE=mock
LTI_MOCK_SECRET=kb-agent-mock-secret-demo-2026-abcd1234efgh5678

# Session cookie
SESSION_SECRET=kb-agent-session-secret-demo-2026-xyz9876uvwx1234
```

> `LTI_MOCK_SECRET` và `SESSION_SECRET` phải dài ít nhất 32 ký tự.
> Có thể giữ nguyên giá trị mẫu ở trên cho môi trường demo.

---

## 5. Cài dependency và push schema

```bash
# Trong thư mục kb-agent/
pnpm install
```

Push schema lên Supabase (tạo tất cả các bảng):

```bash
pnpm db:push
```

Lệnh này sẽ kết nối vào Supabase bằng `DATABASE_URL` và tạo các bảng:
- `students`
- `courses`
- `documents`
- `document_chunks` (có cột `embedding vector(768)`)
- `chat_sessions`
- `messages`
- `evaluations`

Kết quả thành công trông như sau:

```
[✓] Changes applied
```

> Nếu gặp lỗi `type "vector" does not exist` → quay lại bước 3.2, chưa enable extension.

---

## 6. Seed dữ liệu demo

```bash
pnpm db:seed
```

Script sẽ insert vào Supabase:

**3 môn học:**
| ID | Tên |
|---|---|
| `course-ctdl-001` | Cấu Trúc Dữ Liệu & Giải Thuật |
| `course-oop-001` | Lập Trình Hướng Đối Tượng |
| `course-db-001` | Cơ Sở Dữ Liệu |

**3 sinh viên demo:**
| ID | Tên |
|---|---|
| `student-001` | Nguyễn Văn An |
| `student-002` | Trần Thị Bình |
| `student-003` | Lê Minh Cường |

Kiểm tra data đã vào Supabase: **Supabase dashboard → Table Editor → courses**

---

## 7. Ingest PDF tài liệu

Đây là bước đưa tài liệu PDF vào hệ thống để chat có context. Không ingest thì chat vẫn hoạt động nhưng AI không có tài liệu để trích dẫn.

### 7.1 Sử dụng PDF mẫu có sẵn

Project đã có sẵn 1 PDF mẫu:

```bash
pnpm ingest -- \
  --pdf ./public/sample-docs/sach-giao-khoa-tin-hoc-12-khmt-canh-dieu-trang-2.pdf \
  --course course-ctdl-001 \
  --course-title "Cấu Trúc Dữ Liệu & Giải Thuật" \
  --doc-name "Sách Giáo Khoa Tin Học 12" \
  --doc-id doc-tinhoc-001
```

### 7.2 Ingest PDF của riêng bạn

Đặt file PDF vào `public/sample-docs/` rồi chạy:

```bash
pnpm ingest -- \
  --pdf ./public/sample-docs/ten-file.pdf \
  --course course-ctdl-001 \
  --course-title "Tên môn học" \
  --doc-name "Tên tài liệu hiển thị" \
  --doc-id doc-001
```

Các flag:

| Flag | Bắt buộc | Mô tả |
|---|---|---|
| `--pdf` | ✅ | Đường dẫn tới file PDF |
| `--course` | ✅ | ID môn học (phải khớp với ID trong bảng `courses`) |
| `--course-title` | Không | Tên môn học (chỉ dùng khi cần tạo mới course) |
| `--doc-name` | Không | Tên hiển thị của tài liệu |
| `--doc-id` | Không | ID document (tự sinh nếu không điền) |

Kết quả thành công:

```
📄 Loading PDF: ./public/sample-docs/...
   Pages: 15, Text length: 42000 chars
💾 Inserting document record...
🔪 Chunked into 22 chunks
   ✓ 10/22 chunks processed
   ✓ 20/22 chunks processed
   ✓ 22/22 chunks processed
✅ Done! Ingested 22 chunks for "Sách Giáo Khoa Tin Học 12"
```

> **Lưu ý phí OpenAI:** Mỗi chunk gọi 1 lần API embedding. File 20 trang ≈ 20–30 chunks ≈ $0.001. Rất rẻ.

### 7.3 Ingest cho nhiều môn học

Chạy lệnh ingest nhiều lần với `--course` khác nhau:

```bash
# Môn OOP
pnpm ingest -- --pdf ./public/sample-docs/oop.pdf \
  --course course-oop-001 --doc-name "Giáo trình OOP" --doc-id doc-oop-001

# Môn CSDL
pnpm ingest -- --pdf ./public/sample-docs/database.pdf \
  --course course-db-001 --doc-name "Giáo trình CSDL" --doc-id doc-db-001
```

---

## 8. Test local trước khi deploy

```bash
pnpm dev
```

Mở trình duyệt: **http://localhost:3000**

### Checklist test local:

- [ ] **Portal:** Vào `/portal` — hiện danh sách 3 sinh viên và 3 môn học
- [ ] **Launch:** Chọn sinh viên + môn học → nhấn "Vào học" → redirect sang `/chat/[sessionId]`
- [ ] **Chat:** Gõ câu hỏi liên quan tài liệu → AI trả lời có `[SOURCE_X]` nếu đã ingest
- [ ] **Citation:** Badge `[1]` `[2]` hiện dưới message → click vào hiện popover tên tài liệu + trang
- [ ] **Evaluation trigger:** Hỏi đủ 4 câu → banner "Xem đánh giá" xuất hiện
- [ ] **Evaluation:** Nhấn banner hoặc vào `/evaluation` → radar chart render
- [ ] **Health check:** Vào `/api/health` → `"overall": "healthy"`

---

## 9. Tạo project Vercel và deploy

### 9.1 Push code lên GitHub (nếu chưa có)

```bash
# Tại thư mục gốc D:\FreeLancer\VnExpress\KB_Agent
git init
git add .
git commit -m "feat: KB Agent initial deploy"

# Tạo repo trên github.com rồi:
git remote add origin https://github.com/YOUR_USERNAME/kb-agent.git
git push -u origin main
```

### 9.2 Import project vào Vercel

1. Đăng nhập [vercel.com](https://vercel.com)
2. Nhấn **Add New → Project**
3. Chọn repo GitHub vừa push (`kb-agent`)
4. Vercel tự detect Next.js — giữ nguyên các cài đặt mặc định
5. **Root Directory:** set thành `kb-agent` (vì repo gốc có folder `kb-agent/` chứa Next.js app)

### 9.3 Cấu hình Environment Variables trên Vercel

Trước khi nhấn Deploy, vào phần **Environment Variables** và thêm 5 biến sau:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres` |
| `OPENAI_API_KEY` | `sk-...` |
| `LTI_MODE` | `mock` |
| `LTI_MOCK_SECRET` | `kb-agent-mock-secret-demo-2026-abcd1234efgh5678` |
| `SESSION_SECRET` | `kb-agent-session-secret-demo-2026-xyz9876uvwx1234` |

> **Quan trọng:** `DATABASE_URL` dùng **cùng connection string** với local. Vercel kết nối thẳng vào Supabase.

### 9.4 Deploy

Nhấn **Deploy**.

Vercel sẽ chạy `pnpm build` và deploy. Quá trình mất khoảng 1–2 phút.

Sau khi xong, Vercel cấp URL dạng: `https://kb-agent-xxx.vercel.app`

---

## 10. Test production hoàn chỉnh

Mở URL Vercel vừa được cấp và test lại toàn bộ checklist:

### 10.1 Health check

Vào `https://kb-agent-xxx.vercel.app/api/health`

Kết quả kỳ vọng:

```json
{
  "overall": "healthy",
  "timestamp": "2026-03-27T...",
  "runtime": "vercel",
  "db": {
    "status": "connected ✓",
    "provider": "supabase-postgresql",
    "courses_sample": 3
  }
}
```

### 10.2 Flow đầy đủ

1. `/portal` → chọn **Nguyễn Văn An** + **Cấu Trúc Dữ Liệu & Giải Thuật** → **Vào học**
2. Hỏi câu liên quan tài liệu đã ingest, ví dụ: *"Stack là gì? Cho ví dụ thực tế."*
3. Kiểm tra AI trả lời có citation badge `[1]`
4. Click badge `[1]` → hiện tên tài liệu + số trang
5. Hỏi thêm 3 câu nữa (tổng 4 câu) → banner evaluation xuất hiện
6. Nhấn banner → vào `/evaluation` → radar chart hiển thị 5 chiều năng lực
7. Quay lại chat, xem sidebar bên trái → hiện lịch sử session

### 10.3 Kiểm tra Supabase có data

Trong Supabase dashboard → **Table Editor**:

- `students` → có record sinh viên vừa đăng nhập
- `chat_sessions` → có session mới tạo
- `messages` → có các tin nhắn vừa chat
- `evaluations` → có kết quả đánh giá

---

## 11. Xử lý sự cố thường gặp

### ❌ `type "vector" does not exist`

**Nguyên nhân:** Chưa enable pgvector extension trên Supabase.

**Fix:** Vào Supabase → SQL Editor → chạy:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```
Rồi chạy lại `pnpm db:push`.

---

### ❌ `DATABASE_URL environment variable is not set`

**Nguyên nhân:** Thiếu file `.env.local` hoặc biến chưa được đặt trên Vercel.

**Fix local:** Kiểm tra file `.env.local` có tồn tại và `DATABASE_URL` đúng format.

**Fix Vercel:** Vào Vercel → project → Settings → Environment Variables → kiểm tra `DATABASE_URL`.

---

### ❌ Chat trả lời nhưng không có citation

**Nguyên nhân:** Chưa ingest PDF, hoặc ingest nhầm `courseId`.

**Fix:** Chạy lại `pnpm ingest` với `--course` đúng với môn học đang chat. Kiểm tra bảng `document_chunks` trong Supabase có records chưa và cột `embedding` không phải NULL.

---

### ❌ Evaluation báo "Not enough messages"

**Nguyên nhân:** Session có ít hơn 2 tin nhắn.

**Fix:** Chat thêm ít nhất 1 cặp user + assistant trước khi vào evaluation.

---

### ❌ Vercel build fail: `Cannot find module ...`

**Nguyên nhân:** Vercel chưa set root directory đúng.

**Fix:** Vercel → project → Settings → General → **Root Directory** → đặt thành `kb-agent`.

---

### ❌ Session không giữ sau khi refresh

**Nguyên nhân:** `SESSION_SECRET` trên Vercel khác với lúc tạo cookie, hoặc cookie domain không khớp.

**Fix:** Đảm bảo `SESSION_SECRET` giống nhau giữa các lần deploy. Không thay đổi sau khi user đã login.

---

### ❌ Ingest lỗi `Embed error: 401`

**Nguyên nhân:** `OPENAI_API_KEY` sai hoặc hết credit.

**Fix:** Kiểm tra key tại [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Kiểm tra credit tại [platform.openai.com/usage](https://platform.openai.com/usage).

---

## Lệnh tham khảo nhanh

```bash
# Tất cả lệnh chạy trong thư mục kb-agent/

pnpm install               # Cài dependencies
pnpm db:push               # Push schema lên Supabase
pnpm db:seed               # Seed 3 courses + 3 students
pnpm dev                   # Chạy local dev server

# Ingest PDF (thay giá trị phù hợp)
pnpm ingest -- \
  --pdf ./public/sample-docs/file.pdf \
  --course course-ctdl-001 \
  --doc-name "Tên tài liệu" \
  --doc-id doc-001

pnpm build                 # Build để kiểm tra trước khi deploy
```

## Thứ tự setup tóm gọn

```
Supabase: Tạo project → Enable pgvector → Copy DATABASE_URL
     ↓
Local: Tạo .env.local → pnpm install → pnpm db:push → pnpm db:seed
     ↓
Ingest: pnpm ingest (với PDF demo)
     ↓
Test: pnpm dev → http://localhost:3000 → test đủ flow
     ↓
Vercel: Push GitHub → Import project → Thêm env vars → Deploy
     ↓
Test production: /api/health → /portal → chat → evaluation ✅
```
