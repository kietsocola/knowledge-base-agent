# Trạng Thái Dự Án KB Agent

> Cập nhật lần cuối: 2026-03-26 (session 3)
> Dùng file này để onboard session Claude mới

---

## Tổng Quan Dự Án

**Mục tiêu:** Demo AI Knowledge Base Agent cho ban giám khảo cuộc thi. Sinh viên hỏi đáp kiến thức môn học, AI trả lời có trích dẫn nguồn, sau 4 câu tự đánh giá năng lực sinh viên bằng Radar Chart.

**Nguồn tài liệu:** PDF giáo trình/slide môn học (ingest vào Cloudflare Vectorize).

**Tích hợp:** Moodle qua LTI 1.3 (hiện dùng simulation cho demo, sau nâng cấp real).

**Deadline:** ~4 ngày từ 2026-03-26.

**Tài liệu thiết kế:** `docs/plan.md` — đọc trước khi code.

---

## Cấu Trúc Thư Mục

```
D:\FreeLancer\VnExpress\KB_Agent\
├── docs/
│   ├── idea.md          # Ý tưởng gốc
│   ├── plan.md          # Kế hoạch chi tiết (đã duyệt)
│   └── progress.md      # File này
└── kb-agent/            # Next.js project root — MỌI LỆNH CHẠY TỪ ĐÂY
    ├── app/             # Next.js App Router pages + API routes
    ├── components/      # React components (ui/, chat/, evaluation/, portal/, layout/)
    ├── lib/             # Business logic (db/, rag/, llm/, lti/, utils/)
    ├── types/           # TypeScript type definitions
    ├── scripts/         # Offline scripts (ingest-pdf.ts, seed-demo-data.sql)
    ├── drizzle/migrations/
    ├── public/sample-docs/  # PDF files cho demo (CẦN BỔ SUNG)
    └── .dev.vars        # Local env vars (không commit)
```

---

## Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Framework | Next.js 16.2.1 App Router | Không có `src/` dir |
| UI | Shadcn/ui v4 (Base UI) + Tailwind v4 | Dark mode default |
| Animation | Framer Motion v12 | ThinkingIndicator, transitions |
| Charts | Recharts v3 | RadarChart evaluation |
| AI SDK | Vercel AI SDK v6 + `@ai-sdk/openai` v3 | Breaking changes vs v3/v4! |
| React hooks | `@ai-sdk/react` v3 | `useChat` moved here |
| LLM | OpenAI `gpt-4o-mini` | `lib/llm/client.ts` |
| Embeddings | OpenAI `text-embedding-3-small` dim=768 | `lib/rag/embedder.ts` |
| Vector DB | Cloudflare Vectorize `kb-embeddings` (768-dim cosine) | ✅ Created |
| Database | Cloudflare D1 `kb-agent-db` + Drizzle ORM | ✅ Migrated |
| Session | `iron-session` v8 + cookie | `lib/session.ts` |
| JWT (LTI) | `jose` | `lib/lti/validator.ts` |
| Deploy | Cloudflare Pages via `@opennextjs/cloudflare` | Chưa deploy |

---

## Cloudflare Resources (Đã Tạo)

```
D1 Database:    kb-agent-db    ID: 1f3d03a7-4ead-4116-9b58-6b2092ae5e8e
Vectorize:      kb-embeddings  768-dim, cosine metric
```

**D1 hiện tại có:**
- 7 tables: students, courses, documents, document_chunks, chat_sessions, messages, evaluations
- 3 courses seeded (CTDL, OOP, CSDL)
- 3 students seeded (Nguyễn Văn An, Trần Thị Bình, Lê Minh Cường)
- Vectorize: RỖNG — cần chạy ingestion script sau khi có PDF

---

## Trạng Thái Sprint

| Ngày | Nội dung | Trạng thái |
|------|----------|------------|
| **Ngày 1** | Setup, packages, config, schema, lib code, migrations, seed | ✅ XONG |
| **Ngày 2** | API routes (lti/launch, chat, eval, docs, health), portal, session, layout | ✅ XONG |
| **Ngày 3** | Chat UI, ThinkingIndicator, CitationCard, Evaluation page, RadarChart, AppShell | ✅ XONG |
| **Ngày 4** | Polish, deploy Cloudflare Pages, demo prep, video backup | ⏳ ĐANG LÀM |

---

## Tất Cả File Đã Viết

### Config & Setup
- `wrangler.toml` — D1 + Vectorize bindings, database_id đã điền
- `open-next.config.ts` — Cloudflare adapter config
- `drizzle.config.ts` — SQLite/D1 schema path
- `.dev.vars` — template (cần điền OPENAI_API_KEY)
- `.env.local` — template (cần điền OPENAI_API_KEY)
- `lib/session.ts` — SESSION_OPTIONS cho iron-session
- `types/cloudflare.d.ts` — augment CloudflareEnv (DB, VECTORIZE)

### Types
- `types/lti.ts` — `LTILaunchClaims`, `SessionData`
- `types/chat.ts` — `Citation`, `MessageWithCitations`
- `types/evaluation.ts` — `RadarScores`, `EvaluationResult`

### Lib — Database
- `lib/db/schema.ts` — Drizzle schema tất cả 7 tables
- `lib/db/index.ts` — DB client factory (D1 cho CF, libsql cho local dev)

### Lib — LTI
- `lib/lti/types.ts` — re-export
- `lib/lti/mock.ts` — `MOCK_STUDENTS`, `MOCK_COURSES`, `buildMockLTIToken()`
- `lib/lti/validator.ts` — `validateLTIToken()` (mock HS256 hoạt động, prod TODO)

### Lib — RAG
- `lib/rag/embedder.ts` — `embedText()` qua OpenAI REST API
- `lib/rag/retriever.ts` — `retrieveRelevantChunks()` từ Vectorize + D1 join

### Lib — LLM
- `lib/llm/client.ts` — `getOpenAI()`, `CHAT_MODEL = "gpt-4o-mini"`
- `lib/llm/prompts.ts` — `buildChatSystemPrompt()`, `EVALUATION_SYSTEM_PROMPT`
- `lib/llm/citations.ts` — `parseCitations()`, `formatContextForPrompt()`
- `lib/llm/evaluator.ts` — `generateEvaluation()` dùng `generateObject` + Zod schema

### Lib — Utils
- `lib/utils/env.ts` — `Env` interface, `getEnvVar()`
- `lib/utils.ts` — `cn()` Tailwind merge (Shadcn tạo)

### Scripts
- `scripts/ingest-pdf.ts` — PDF → chunks → OpenAI embed → Vectorize + D1
- `scripts/seed-demo-data.sql` — 3 courses + 3 students (đã apply)

### Shadcn Components (`components/ui/`)
button, card, badge, avatar, sonner, skeleton, separator, input, textarea, popover, tooltip, scroll-area, sheet

### API Routes ✅
- `app/api/lti/launch/route.ts` — POST: mock (studentId+courseId) + JWT flow
- `app/api/chat/route.ts` — POST: streaming RAG, edge runtime, AI SDK v6
- `app/api/evaluation/route.ts` — POST: generateObject → persist → return
- `app/api/documents/route.ts` — GET: list docs by courseId
- `app/api/health/route.ts` — GET: D1 + Vectorize health check

### Pages & Components ✅
- `app/layout.tsx` — ThemeProvider dark + Sonner
- `app/page.tsx` — redirect → /portal
- `app/portal/page.tsx` + `components/portal/MockMoodlePortal.tsx` — Mock Moodle portal full UI
- `app/chat/[sessionId]/page.tsx` — session guard placeholder (cần thay bằng ChatInterface)
- `app/evaluation/page.tsx` — session guard placeholder (cần thay bằng EvaluationCard)

---

## Ngày 3 — ✅ Hoàn Thành

### Chat Components ✅
- `components/chat/ChatInterface.tsx` — useChat() container, sidebar, eval banner, "Hỏi giảng viên"
- `components/chat/MessageBubble.tsx` — message + citation badges [1][2], ReactMarkdown
- `components/chat/CitationCard.tsx` — popover: doc name, page, quote
- `components/chat/ThinkingIndicator.tsx` — Framer Motion step animations

### Evaluation Components ✅
- `components/evaluation/RadarChart.tsx` — Recharts + entrance animation
- `components/evaluation/EvaluationCard.tsx` — score count-up, strengths, gaps, recommended topics
- `components/evaluation/EvaluationLoader.tsx` — animated loading steps, fetch /api/evaluation

### Layout Components ✅
- `components/layout/Sidebar.tsx` — course info, docs list, eval progress bar
- `components/layout/ThemeToggle.tsx` — dark/light toggle

### Pages ✅
- `app/chat/[sessionId]/page.tsx` — session guard + ChatInterface
- `app/evaluation/page.tsx` — session guard + EvaluationLoader

---

## Ngày 4 — ⏳ Đang Làm

### Polish ✅
- [x] "Hỏi giảng viên" button + theatrical loading→success toast
- [x] Sidebar duplicate bug fixed (was rendering twice on desktop)
- [ ] Mobile responsiveness final check
- [ ] Chuẩn bị câu hỏi demo "ăn tiền"

### Deploy
- [ ] Điền env vars vào `.dev.vars` và Cloudflare Pages secrets
- [ ] Chạy `pnpm ingest` với PDF mẫu
- [ ] `pnpm deploy` → Cloudflare Pages
- [ ] Test production URL, verify D1 + Vectorize bindings

### Demo Prep
- [ ] Clear test sessions: `wrangler d1 execute kb-agent-db --remote --command="DELETE FROM messages WHERE 1=1"`
- [ ] Chuẩn bị tab `/api/health` cho BGK
- [ ] Quay video backup (OBS/Loom)

---

## Lưu Ý Quan Trọng Khi Code

### 1. AI SDK v6 Breaking Changes
```typescript
// ❌ OLD (v3/v4):
import { useChat } from "ai/react"
const { messages, handleSubmit, isLoading } = useChat(...)
// messages[i].content = string

// ✅ NEW (v6):
import { useChat } from "@ai-sdk/react"
const { messages, sendMessage, status } = useChat(...)
// messages[i].parts = UIMessagePart[] (text parts have .text)
// messages[i].metadata = { citations, triggerEvaluation }
```

### 2. Citations
- Server: `writer.write({ type: "message-metadata", messageMetadata: { citations } })`
- Client: `message.metadata?.citations`
- Render: parse `[SOURCE_X]` trong text → badge `[1]`, `[2]`

### 3. D1 trong Cloudflare Workers vs local dev
- CF Workers: `getCloudflareContext().env.DB` → dùng `getCloudflareDb(env.DB)`
- Local `next dev`: `getDb()` → libsql file-based SQLite
- Chat route (edge runtime): chỉ có CF bindings — không có D1 local fallback

### 4. CloudflareEnv type
- `types/cloudflare.d.ts` augments global `interface CloudflareEnv`
- Không cần import — tự động được TypeScript nhận

### 5. Vectorize chưa có data
```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent
pnpm ingest -- --pdf ./public/sample-docs/file.pdf --course course-ctdl-001 --doc-name "Tên" --doc-id doc-001
```

### 6. Không có `src/` directory
Shadcn config dùng alias `@/*` → root. Components ở `components/`, không phải `src/components/`.

---

## Env Vars Cần Điền

```bash
# .dev.vars (cho wrangler dev) và .env.local (cho next dev)
OPENAI_API_KEY=sk-...
LTI_MOCK_SECRET=<32+ chars random string>
LTI_MODE=mock
SESSION_SECRET=<32+ chars random string>
```

---

## Commands Hay Dùng

```bash
cd D:\FreeLancer\VnExpress\KB_Agent\kb-agent

pnpm dev                    # Local dev server
pnpm build                  # Next.js build check
npx tsc --noEmit            # TypeScript check

# Database
npx wrangler d1 execute kb-agent-db --remote --command="SELECT * FROM courses"

# Ingestion (sau khi có PDF + env vars)
pnpm ingest -- --pdf ./public/sample-docs/file.pdf --course course-ctdl-001 --doc-name "Tên" --doc-id doc-001

# Deploy
pnpm build:cf               # Build cho Cloudflare
pnpm deploy                 # Build + deploy lên CF Pages
```
