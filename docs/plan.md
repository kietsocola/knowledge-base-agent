# Kế Hoạch Triển Khai: KB Agent MVP

> **Trạng thái:** Chờ duyệt
> **Ngày lập:** 2026-03-26
> **Deadline:** ~4 ngày

---

## Đánh Giá Ý Tưởng Gốc

| Điểm | Ý kiến |
|------|--------|
| Next.js + Shadcn/ui | ✅ Giữ nguyên |
| Framer Motion + Recharts | ✅ Giữ nguyên |
| Vercel AI SDK | ✅ Giữ nguyên, dùng `@ai-sdk/openai` |
| LLM: Gemini / Groq | 🔄 **Đổi sang GPT-4o-mini** (theo yêu cầu) |
| Cloudflare Vectorize | ✅ Giữ nguyên — free tier an toàn |
| Cloudflare D1 | ✅ Giữ nguyên — free tier an toàn |
| Workers AI (embeddings) | ❌ **Bỏ hoàn toàn** — free tier chỉ đủ cho ~1-2 calls/ngày (xem phân tích bên dưới) |
| Simulate LTI 1.3 | ✅ Hợp lý — design clean interface để nâng cấp sau |
| 4 ngày sprint | ✅ Khả thi |

**Thay đổi chính:**
- **LLM:** GPT-4o-mini — nhanh, rẻ, streaming tốt với Vercel AI SDK
- **Embeddings:** OpenAI `text-embedding-3-small` (thay Workers AI) — gọi qua HTTP fetch(), không tốn CPU Workers, rất rẻ (~$0.02/million tokens, demo gần như free)
- **Citations:** Vì OpenAI không có native citations như Claude, dùng prompt engineering với `[SOURCE_X]` markers + post-processing (xem chi tiết bên dưới)

---

## Cloudflare Free Tier — Đánh Giá Chi Tiết

> Phân tích này quyết định có nên giữ Cloudflare hay cần backup stack.

| Dịch vụ | Giới hạn Free | Demo OK? | Kết luận |
|---------|--------------|----------|----------|
| **Workers** | 100k req/day, **10ms CPU time** | ✅ AN TOÀN | `fetch()` đến OpenAI KHÔNG tính vào CPU time. CPU time chỉ tính JS execution. Demo ~100 requests = không đáng kể |
| **Workers AI** | 10,000 neurons/day | ❌ **NGUY HIỂM** | `@cf/baai/bge-base-en-v1.5` tốn ~6,058 neurons/million tokens. 100 embedding queries ≈ 60,000+ neurons → **vượt giới hạn 6x**. Bỏ hoàn toàn |
| **D1** | 5M reads/day, 100k writes/day, 10GB storage | ✅ AN TOÀN | Demo ~100 queries = không đáng kể |
| **Vectorize** | 30M dimensions queried/month (~39k queries cho 768-dim) | ✅ AN TOÀN | Demo thoải mái, metadata filtering hỗ trợ free |
| **Pages** | 500 builds/month, unlimited bandwidth | ✅ AN TOÀN | Cần `export const runtime = 'edge'` trên các API routes |

**Kết luận:** Cloudflare free tier **ổn** nếu thay Workers AI bằng OpenAI embeddings. Không cần nâng cấp paid.

### Giải thích 10ms CPU limit

```
Workers free: 10ms CPU execution
                │
                ├── Tính vào CPU: JS processing, JSON parsing, business logic
                │
                └── KHÔNG tính: await fetch() → OpenAI API
                               await env.DB.prepare().all()  → D1
                               await env.VECTORIZE.query()   → Vectorize
```

Vì RAG pipeline chủ yếu là I/O (gọi OpenAI + query D1 + query Vectorize), **10ms là đủ**.

---

## Backup Stack (Nếu Cloudflare Gặp Vấn Đề)

> Dùng khi: Workers CPU limit bị hit do SSR phức tạp, hoặc deployment Cloudflare Pages không tương thích.

**Vercel + Supabase + OpenAI** — toàn bộ free tier, setup trong 1 giờ.

| Thành phần | Cloudflare Stack | Backup: Vercel + Supabase |
|---|---|---|
| Hosting | Cloudflare Pages | **Vercel** (free, 10s timeout, streaming OK) |
| Database | Cloudflare D1 (SQLite) | **Supabase PostgreSQL** (free, 500MB) |
| Vector DB | Cloudflare Vectorize | **Supabase pgvector** (cùng instance với DB!) |
| Embeddings | OpenAI `text-embedding-3-small` | OpenAI `text-embedding-3-small` (giữ nguyên) |
| LLM | GPT-4o-mini | GPT-4o-mini (giữ nguyên) |

**Ưu điểm backup stack:**
- Supabase = PostgreSQL + pgvector trong 1 service → không cần Vectorize riêng
- Drizzle ORM hỗ trợ cả SQLite (D1) và PostgreSQL → **schema không đổi, chỉ đổi driver**
- Vercel native với Next.js, không cần `@opennextjs/cloudflare` config

**Để chuyển từ Cloudflare sang Vercel+Supabase:**
1. Đổi Drizzle driver: `drizzle(d1binding)` → `drizzle(postgres(connectionString))`
2. Đổi vector queries: `Vectorize.query()` → `supabase.rpc('match_documents', ...)`
3. Đổi env vars, xóa `wrangler.toml`
4. `git push` → Vercel auto-deploy

**Thiết kế code từ đầu** để việc chuyển này chỉ mất 2-3 giờ (xem abstraction layers bên dưới).

---

## Kiến Trúc Tổng Thể

```
[Mock Moodle Portal]  ──POST id_token──►  [/api/lti/launch]
                                                │
                                         validate JWT (jose)
                                         upsert student + course → D1
                                         create chat_session → D1
                                                │
                                         ◄── redirect + session cookie
                                                │
[Student Chat UI]  ──POST messages──►  [/api/chat]
     useChat() hook                          │
     streaming render                  embed question
     citation badges [1][2]            (OpenAI text-embedding-3-small, dim=768)
                                             │
                                       Vectorize.query(topK=5, filter={courseId})
                                             │
                                       D1 JOIN → chunk_text, page, doc name
                                             │
                                       build context with [SOURCE_X] markers
                                             │
                                       GPT-4o-mini streamText
                                             │
                                       parse [SOURCE_X] from stream
                                       ◄── stream text + citation annotations
                                             │
                                       persist message + citations → D1 [background]
                                       trigger eval if message #4 [background]

[/evaluation page]  ◄──  [/api/evaluation/route.ts]
                              │
                        fetch messages → D1
                        generateObject (GPT-4o-mini)
                              │
                         ◄── EvaluationResult JSON
                              │
                    RadarChart + EvaluationCard render
```

**Deploy:** Cloudflare Pages via `@opennextjs/cloudflare` (backup: Vercel)

---

## Tech Stack

| Thành phần | Công nghệ | Lý do |
|---|---|---|
| Frontend | Next.js 15 App Router + Tailwind | App Router, edge-compatible |
| UI Library | Shadcn/ui (slate theme, dark default) | Component sẵn, cực đẹp |
| Animation | Framer Motion | Thinking indicator, page transitions |
| Charts | Recharts RadarChart | Student evaluation |
| AI SDK | Vercel AI SDK v4 + `@ai-sdk/openai` | Streaming, `generateObject`, provider-agnostic |
| LLM | OpenAI `gpt-4o-mini` | Nhanh, rẻ, streaming tốt |
| Embeddings | OpenAI `text-embedding-3-small` (dim=768) | Thay Workers AI, gọi qua HTTP, free cho demo |
| Vector DB | Cloudflare Vectorize (768-dim, free) | Vectorize index giữ nguyên 768-dim |
| Database | Cloudflare D1 + Drizzle ORM | Type-safe, auto migrations, free |
| Session | `iron-session` + cookie | Nhẹ, không cần full auth |
| JWT (LTI) | `jose` | Verify HS256 (mock) → RS256 (prod) |
| Deploy (primary) | Cloudflare Pages + `@opennextjs/cloudflare` | Toàn bộ CF ecosystem |
| Deploy (backup) | Vercel + Supabase | Nếu CF có vấn đề |

---

## Citations với OpenAI (Không Có Native Citations)

OpenAI không tự động trả về structured citations như Claude. Giải pháp: **prompt engineering + post-processing**.

### Cách hoạt động

**Bước 1 — Format context với markers:**
```
[SOURCE_1] Giáo trình CTDL - Chương 2, Trang 14:
Mảng là cấu trúc dữ liệu tuyến tính...

[SOURCE_2] Slide bài giảng - Tuần 3, Trang 8:
Độ phức tạp O(n) có nghĩa là...
```

**Bước 2 — System prompt:**
```
Khi dùng thông tin từ tài liệu, hãy đặt [SOURCE_X] ngay sau câu đó.
Ví dụ: "Mảng có độ phức tạp O(1) khi truy cập [SOURCE_1]."
```

**Bước 3 — Parse stream:**
```typescript
// Sau khi stream hoàn tất, extract citations
const citationRegex = /\[SOURCE_(\d+)\]/g
const matches = [...text.matchAll(citationRegex)]
const citationIndices = [...new Set(matches.map(m => parseInt(m[1]) - 1))]
// Map index → chunk metadata từ D1 (đã có trong context lúc build prompt)
```

**Bước 4 — Gửi annotations về client:**
```typescript
// Dùng Vercel AI SDK experimental_streamData
dataStream.writeData({ citations: resolvedCitations })
```

**UI hiển thị:** Giống hệt với native citations — badge `[1]`, `[2]` inline, click mở popover. BGK không biết đây là prompt engineering hay native.

---

## Cấu Trúc Thư Mục

```
kb-agent/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                      # Redirect → /portal
│   │   │
│   │   ├── (portal)/
│   │   │   └── portal/page.tsx           # Mock Moodle portal
│   │   │
│   │   ├── (app)/
│   │   │   ├── layout.tsx                # App shell: sidebar + header
│   │   │   ├── chat/[sessionId]/page.tsx
│   │   │   └── evaluation/page.tsx
│   │   │
│   │   └── api/
│   │       ├── lti/launch/route.ts       # POST: validate JWT, create session
│   │       ├── chat/route.ts             # POST: streaming RAG (edge runtime)
│   │       ├── evaluation/route.ts       # POST: generate eval JSON
│   │       ├── documents/route.ts        # GET: list docs by courseId
│   │       └── health/route.ts           # GET: infra health check
│   │
│   ├── components/
│   │   ├── ui/                           # Shadcn/ui (không sửa thủ công)
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx         # useChat() hook container
│   │   │   ├── MessageBubble.tsx         # Message + citation badges [1][2]
│   │   │   ├── CitationCard.tsx          # Popover: doc name, page, quote
│   │   │   ├── ThinkingIndicator.tsx     # Framer Motion step animations
│   │   │   └── StreamingText.tsx
│   │   ├── evaluation/
│   │   │   ├── EvaluationCard.tsx        # Strengths, gaps, score count-up
│   │   │   └── RadarChart.tsx            # Recharts + entrance animation
│   │   ├── portal/
│   │   │   └── MockMoodlePortal.tsx      # Giả lập Moodle UI
│   │   └── layout/
│   │       ├── AppShell.tsx
│   │       ├── Sidebar.tsx               # Course info, docs, eval progress
│   │       └── ThemeToggle.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts                 # Drizzle schema — KHÔNG đổi khi migrate stack
│   │   │   ├── index.ts                  # Driver factory: D1 hoặc PostgreSQL
│   │   │   └── queries/
│   │   │       ├── sessions.ts
│   │   │       ├── messages.ts
│   │   │       └── evaluations.ts
│   │   ├── rag/
│   │   │   ├── embedder.ts               # OpenAI text-embedding-3-small (dim=768)
│   │   │   └── retriever.ts              # Interface + CloudflareVectorizeRetriever
│   │   ├── llm/
│   │   │   ├── client.ts                 # createOpenAI() singleton
│   │   │   ├── prompts.ts                # System prompts + citation format instructions
│   │   │   ├── citations.ts              # Parse [SOURCE_X] từ response text
│   │   │   └── evaluator.ts              # generateObject → EvaluationResult
│   │   ├── lti/
│   │   │   ├── types.ts                  # LTILaunchClaims interface
│   │   │   ├── validator.ts              # validateLTIToken() — mock + prod
│   │   │   └── mock.ts                   # Build + sign mock JWT
│   │   └── utils/
│   │       ├── env.ts                    # Env access: CF bindings hoặc process.env
│   │       └── cn.ts
│   │
│   └── types/
│       ├── lti.ts
│       ├── chat.ts                       # Message, Citation, Session
│       └── evaluation.ts
│
├── scripts/
│   ├── ingest-pdf.ts                     # PDF → chunks → OpenAI embed → Vectorize + D1
│   └── seed-demo-data.sql
│
├── drizzle/migrations/
├── public/sample-docs/                   # 2-3 PDF môn học
├── wrangler.toml                         # D1 + Vectorize bindings (không có [ai])
├── drizzle.config.ts
├── next.config.ts
└── open-next.config.ts
```

---

## Database Schema (D1 + Drizzle)

Schema dùng chung cho cả Cloudflare D1 (SQLite) và Supabase PostgreSQL — chỉ đổi Drizzle driver.

### `students`
```sql
id           TEXT PRIMARY KEY  -- từ LTI sub claim
lti_iss      TEXT NOT NULL
display_name TEXT
email        TEXT
created_at   INTEGER
updated_at   INTEGER
```

### `courses`
```sql
id         TEXT PRIMARY KEY  -- từ LTI context.id
title      TEXT NOT NULL
lti_iss    TEXT
created_at INTEGER
```

### `documents`
```sql
id          TEXT PRIMARY KEY
course_id   TEXT REFERENCES courses(id)
name        TEXT NOT NULL
source_url  TEXT              -- future: Cloudflare R2 / Supabase Storage URL
page_count  INTEGER
created_at  INTEGER
```

### `document_chunks`
```sql
id            TEXT PRIMARY KEY  -- UUID = vector ID trong Vectorize / pgvector
document_id   TEXT REFERENCES documents(id)
chunk_index   INTEGER
chunk_text    TEXT              -- lưu để hiển thị citation quote
page_number   INTEGER
created_at    INTEGER
```

### `chat_sessions`
```sql
id              TEXT PRIMARY KEY
student_id      TEXT REFERENCES students(id)
course_id       TEXT REFERENCES courses(id)
lti_launch_id   TEXT
status          TEXT DEFAULT 'active'
created_at      INTEGER
updated_at      INTEGER
```

### `messages`
```sql
id          TEXT PRIMARY KEY
session_id  TEXT REFERENCES chat_sessions(id)
role        TEXT NOT NULL  -- 'user' | 'assistant'
content     TEXT NOT NULL
citations   TEXT           -- JSON: [{chunkId, documentName, pageNumber, quote}]
created_at  INTEGER
```

### `evaluations`
```sql
id               TEXT PRIMARY KEY
session_id       TEXT REFERENCES chat_sessions(id)
triggered_at_msg INTEGER
radar_scores     TEXT   -- JSON object
strengths        TEXT   -- JSON array
gaps             TEXT   -- JSON array
overall_score    REAL
created_at       INTEGER
```

---

## API Endpoints

### `POST /api/lti/launch`
- Input: `{ id_token: string }` — JWT từ mock portal
- Validate JWT (HS256 mock hoặc RS256 real Moodle)
- Upsert student + course → D1, tạo `chat_sessions`
- Output: redirect URL `/chat/{sessionId}` + set session cookie

### `POST /api/chat` *(edge runtime)*
- Input: `{ sessionId, messages, courseId }`
- Flow:
  1. Embed user question → OpenAI `text-embedding-3-small` (dim=768)
  2. Vectorize.query(topK=5, filter={courseId})
  3. D1 JOIN → chunk_text + metadata
  4. Build context với `[SOURCE_X]` markers
  5. `streamText` GPT-4o-mini
  6. Parse citations từ stream
  7. Gửi kèm citation annotations qua `dataStream.writeData()`
- Background: persist message → D1, trigger eval nếu message #4

### `POST /api/evaluation`
- Fetch messages từ D1
- `generateObject` GPT-4o-mini → typed `EvaluationResult`
- Persist → `evaluations` table
- Output: EvaluationResult JSON

### `GET /api/documents?courseId=xxx`
- Output: list documents của course

### `GET /api/health`
- Check D1 + Vectorize connectivity
- Hiện ở footer — show live infra cho BGK

---

## RAG Pipeline

### A. Ingestion — `scripts/ingest-pdf.ts` (chạy một lần)

```
PDF File
  → pdf-parse → text per page
  → RecursiveCharacterTextSplitter (512 tokens, 64 overlap)
  → OpenAI API: text-embedding-3-small, dimensions=768 → float32[768]
  → Cloudflare Vectorize REST API: upsert(id=chunkUUID, vector, metadata={courseId, docId, page})
  → D1: INSERT INTO document_chunks (same UUID, chunk_text, page_number, ...)
```

Script chạy offline từ máy local, gọi Cloudflare + OpenAI REST API trực tiếp qua env vars. Không cần Wrangler.

### B. Retrieval — mỗi chat message

```
User question
  → POST https://api.openai.com/v1/embeddings (text-embedding-3-small, dim=768)
  → float32[768]
  → env.VECTORIZE.query(vector, {topK:5, filter:{courseId}, returnMetadata:'all'})
  → drop chunks với score < 0.65
  → D1: SELECT chunk_text, page_number, name FROM document_chunks JOIN documents
  → format context:
      [SOURCE_1] {docName} - Trang {page}:
      {chunkText}
  → streamText(gpt-4o-mini, systemPrompt + context + messages)
  → parse [SOURCE_X] từ response → map về chunk metadata
  → stream text + citations về client
```

---

## LTI 1.3 Simulation

```typescript
// lib/lti/validator.ts — interface duy nhất, không đổi khi upgrade
export async function validateLTIToken(
  token: string,
  env: Env
): Promise<LTILaunchClaims>
```

- **Mock mode** (`LTI_MODE=mock`): verify HS256 symmetric secret
- **Prod mode** (`LTI_MODE=production`): fetch JWKS từ Moodle, verify RS256, validate nonce trong D1

**Nâng cấp lên real Moodle:** chỉ đổi 3 env vars. Không đổi dòng code nào khác.

**Mock Portal:** Trông giống trang Moodle thật (header xanh, course blocks), dropdown chọn student + course, button "Launch AI Knowledge Base" → spinner "Đang xác thực LTI 1.3..." → redirect.

---

## Kế Hoạch Sprint 4 Ngày

### Ngày 1 — Hạ tầng & Dữ liệu

**Sáng (4h): Setup**
1. `npx create-next-app@latest kb-agent --typescript --tailwind --app`
2. `npx shadcn@latest init` (slate, dark default)
3. Cài packages:
   ```bash
   npm install @opennextjs/cloudflare drizzle-orm drizzle-kit
   npm install @ai-sdk/openai ai jose iron-session
   npm install framer-motion recharts react-markdown
   npm install -D pdf-parse @types/pdf-parse
   ```
4. `wrangler d1 create kb-agent-db`
5. `wrangler vectorize create kb-embeddings --dimensions=768 --metric=cosine`
6. Config `wrangler.toml` — D1 + Vectorize bindings (**không có `[ai]`**)
7. Config `open-next.config.ts` + `next.config.ts` cho edge runtime

**Chiều (4h): Schema & Ingestion**
1. Viết `src/lib/db/schema.ts`
2. `npx drizzle-kit generate` → `wrangler d1 migrations apply --remote`
3. Viết `scripts/ingest-pdf.ts` — dùng OpenAI embedding thay Workers AI
4. Chuẩn bị 2-3 PDF (slide bài giảng hoặc giáo trình mẫu)
5. Chạy ingestion — verify trong Vectorize dashboard + D1
6. `seed-demo-data.sql` — demo students, courses

**Deliverable:** Data sẵn, project chạy trang trắng.

---

### Ngày 2 — Backend Core

**Sáng (4h): LTI + Session**
1. `lib/lti/types.ts`, `lib/lti/mock.ts`, `lib/lti/validator.ts`
2. `/api/lti/launch/route.ts`
3. Trang `/portal` — mock Moodle UI
4. Test flow: Launch → D1 session → redirect `/chat/{sessionId}`

**Chiều (4h): RAG Chat API**
1. `lib/rag/embedder.ts` — OpenAI `text-embedding-3-small`
2. `lib/rag/retriever.ts` — Vectorize query + D1 join
3. `lib/llm/prompts.ts` — system prompt + citation format instructions
4. `lib/llm/citations.ts` — parse `[SOURCE_X]` patterns
5. `/api/chat/route.ts` — full streaming RAG pipeline với `export const runtime = 'edge'`
6. Test với curl: verify streaming + citations được parse đúng

**Deliverable:** Backend hoạt động, RAG trả về câu trả lời có citations.

---

### Ngày 3 — Frontend & Evaluation

**Sáng (3h): Chat UI**
1. `ChatInterface.tsx` — `useChat()` + handle `data` annotations cho citations
2. `MessageBubble.tsx` + ReactMarkdown + citation badge render
3. `CitationCard.tsx` — popover khi click badge
4. `ThinkingIndicator.tsx` — Framer Motion steps:
   - "Đang phân tích câu hỏi..."
   - "Tìm kiếm trong *{docName}*..."
   - "Tìm được {n} đoạn liên quan..."
   - "Đang soạn câu trả lời..."
5. Test end-to-end trong browser

**Chiều (3h): Evaluation**
1. `lib/llm/evaluator.ts` — `generateObject` → `EvaluationResult` schema
2. `/api/evaluation/route.ts`
3. `RadarChart.tsx` — Recharts + Framer entrance animation
4. `EvaluationCard.tsx` — score count-up, strengths, gaps, CTA
5. `/evaluation` page
6. Trigger banner sau message #4

**Tối (2h): Polish lần 1**
1. Dark mode + theme nhất quán
2. Page transitions
3. Sidebar: course info, docs list, eval progress counter
4. Typography + spacing

**Deliverable:** Demo chạy đầy đủ end-to-end.

---

### Ngày 4 — Hoàn thiện & Deploy

**Sáng (3h): Final polish**
1. Loading skeletons
2. Error states thân thiện
3. Nút "Hỏi giảng viên thật" + success toast (theatrical)
4. Mobile responsiveness check
5. `/api/health` + footer status indicator
6. Chuẩn bị 3-5 câu hỏi demo "ăn tiền" — test trước

**Chiều (2h): Deploy Cloudflare**
1. `npm run build && npx @opennextjs/cloudflare build`
2. Deploy lên Cloudflare Pages
3. Test production URL, verify D1 + Vectorize bindings
4. Nếu Pages gặp vấn đề → **chuyển sang backup: `vercel deploy`** (xem bên dưới)

**Tối (2h): Demo preparation**
1. Quay video backup 2-3 phút (OBS/Loom)
2. Clear sessions trong D1
3. Chuẩn bị tab thứ hai `/api/health` — BGK thấy live infra

---

## Backup Deploy: Chuyển Sang Vercel + Supabase

Thực hiện khi Cloudflare Pages gặp vấn đề không giải quyết được trong thời gian ngắn.

**Bước 1 — Supabase (15 phút):**
```sql
-- Chạy trong Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
-- Chạy drizzle migrations (đã có sẵn)
-- Tạo pgvector index:
CREATE INDEX ON document_chunks
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

**Bước 2 — Đổi Drizzle driver (5 phút):**
```typescript
// lib/db/index.ts
// Cloudflare: drizzle(env.DB)
// Supabase:   drizzle(postgres(process.env.DATABASE_URL))
```

**Bước 3 — Đổi Vectorize → pgvector (30 phút):**
```typescript
// lib/rag/retriever.ts
// Thay CloudflareVectorizeRetriever bằng SupabasePgVectorRetriever
// Interface không đổi → chỉ thêm class mới
```

**Bước 4 — Deploy Vercel (10 phút):**
```bash
vercel deploy
# Add env vars: OPENAI_API_KEY, DATABASE_URL, LTI_MOCK_SECRET, SESSION_SECRET
```

**Tổng thời gian chuyển đổi: ~1 giờ** — chỉ đổi infra layer, business logic không đổi.

---

## Lộ Trình Nâng Cấp Sau Demo

| Giai đoạn | Nội dung | Thay đổi trong code |
|-----------|----------|---------------------|
| **V1.1** | Real LTI 1.3 với Moodle thật | Đổi 3 env vars + `lib/lti/validator.ts` prod mode |
| **V1.2** | Upload PDF từ giao diện | Thêm `lib/storage/r2.ts`, upload UI |
| **V2.0** | Multi-tenant (nhiều trường) | Thêm `tenants` table + `tenant_id` columns |
| **V2.1** | Teacher dashboard | Thêm routes `/teacher/*` |
| **V2.2** | Background jobs đáng tin cậy | `waitUntil` → Cloudflare Queues (1 dòng) |
| **V3.0** | Better auth | Swap `iron-session` → Clerk/Auth.js |

---

## Các Điểm "Wow" Cho BGK

1. **Thinking Indicator** — "Đang tìm trong *Giáo trình CTDL Chương 3*..." → AI có vẻ đang thực sự làm việc
2. **Inline Citations** — badge `[1]` click → hiện đúng đoạn văn + số trang → minh bạch, đáng tin
3. **Evaluation Radar Chart** — sau 4 câu: chart animation + điểm count-up → "Bạn hiểu 80% khái niệm A nhưng còn hổng B"
4. **Health endpoint** — tab phụ `/api/health` hiện green status → trông như production thật
5. **Dark mode mặc định** — professional hơn trong hội trường
6. **Mock Moodle Portal** — BGK hiểu use case ngay mà không cần giải thích

---

## Môi Trường & Secrets

```bash
# .dev.vars (local, không commit)
OPENAI_API_KEY=sk-...
LTI_MOCK_SECRET=your-dev-secret-32chars
LTI_MODE=mock
SESSION_SECRET=your-session-secret-32chars

# Cloudflare Dashboard → Settings → Environment Variables
OPENAI_API_KEY=sk-...
LTI_MOCK_SECRET=...
LTI_MODE=mock
SESSION_SECRET=...

# Nếu dùng backup Vercel: thêm DATABASE_URL=postgresql://...
```

```toml
# wrangler.toml — KHÔNG có [ai] binding
[[d1_databases]]
binding = "DB"
database_name = "kb-agent-db"
database_id = "..."

[[vectorize]]
binding = "VECTORIZE"
index_name = "kb-embeddings"

compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
```

---

## Rủi Ro & Giảm Thiểu

| Rủi ro | Mức độ | Giảm thiểu |
|--------|--------|------------|
| Workers AI neurons limit | ~~Cao~~ | ✅ **Đã loại bỏ** — không dùng Workers AI |
| Workers 10ms CPU limit | Thấp | fetch() không tính CPU time. Nếu bị hit: chuyển sang Vercel trong 1h |
| Cloudflare Pages + Next.js SSR conflict | Trung bình | Dùng `export const runtime = 'edge'` trên API routes. Nếu không đủ: Vercel backup |
| OpenAI API latency cao | Thấp | gpt-4o-mini rất nhanh (~1s TTFT). Có Thinking Indicator để fill thời gian chờ |
| Citations bị parse sai | Thấp | Test prompt với 10+ câu hỏi trước ngày 3. Fallback: hiện citations cuối response |
| PDF chất lượng thấp → answers kém | Trung bình | Test ingestion + Q&A ngay ngày 1, điều chỉnh chunk size nếu cần |
| Mạng hội trường lag | Thấp | Quay video backup, chuẩn bị offline demo nếu cần |
