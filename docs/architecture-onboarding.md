# KB Agent - Kiến trúc hệ thống và hướng dẫn onboarding

Tài liệu này dùng cho dev mới join dự án. Mục tiêu là giúp đọc xong có thể:

- hiểu được bài toán sản phẩm và phạm vi MVP hiện tại
- nắm được kiến trúc tổng thể và trách nhiệm của từng phần
- theo được end-to-end flow từ lúc student vào portal đến lúc chat, retrieve tài liệu, lưu tin nhắn và tạo evaluation
- biết D1 và Vectorize đang được dùng như thế nào
- chạy dự án local lần đầu mà không bị mất ngữ cảnh

## 1. Mục tiêu sản phẩm

`KB Agent` là một trợ lý học tập cho mỗi môn học. Ở phiên bản MVP hiện tại, sản phẩm tập trung vào 3 khả năng:

1. mô phỏng flow vào học qua LTI 1.3 từ LMS
2. chat hỏi đáp dựa trên tài liệu môn học bằng RAG
3. đánh giá năng lực học tập sau một số lượt hỏi đáp

MVP ưu tiên trải nghiệm demo và tính thông suốt của flow hơn là đầy đủ tính năng production.

## 2. Tổng quan kiến trúc

Hệ thống hiện tại được xây trên `Next.js App Router`, chạy local bằng Node/Next dev và deploy lên `Cloudflare Pages + OpenNext`. Phần data và retrieval dùng dịch vụ Cloudflare.

```mermaid
flowchart LR
    A[Portal / LMS mock] --> B[/api/lti/launch]
    B --> C[iron-session cookie]
    B --> D[(D1: students, courses, chat_sessions)]
    C --> E[/chat/[sessionId]]
    E --> F[/api/chat]
    F --> G[OpenAI embeddings]
    G --> H[Cloudflare Vectorize]
    H --> I[(D1: documents, document_chunks)]
    I --> F
    F --> J[OpenAI chat model]
    J --> E
    F --> K[(D1: messages, chat_sessions)]
    E --> L[/evaluation]
    L --> M[/api/evaluation]
    M --> N[OpenAI eval model]
    M --> O[(D1: evaluations)]
```

## 3. Thành phần chính trong repo

### 3.1 Frontend và page

- `kb-agent/app/portal/page.tsx`: trang vào hệ thống, hiện portal mock
- `kb-agent/components/portal/MockMoodlePortal.tsx`: UI chọn student, chọn course, gọi launch
- `kb-agent/app/chat/[sessionId]/page.tsx`: server page load session, messages lịch sử, session list
- `kb-agent/components/chat/ChatInterface.tsx`: giao diện chat chính, stream AI response, trigger evaluation banner
- `kb-agent/app/evaluation/page.tsx`: trang xem evaluation của session hiện tại hoặc session cũ

### 3.2 API route

- `kb-agent/app/api/lti/launch/route.ts`: nhận thông tin launch, upsert student/course, tạo chat session, set cookie
- `kb-agent/app/api/chat/route.ts`: nhận message mới, retrieve context, gọi LLM, stream kết quả, lưu messages
- `kb-agent/app/api/evaluation/route.ts`: đọc lịch sử chat, gọi LLM tạo đánh giá, cache vào D1
- `kb-agent/app/api/documents/route.ts`: trả về danh sách tài liệu theo course
- `kb-agent/app/api/health/route.ts`: health check runtime, D1 và binding Vectorize

### 3.3 Database và retrieval

- `kb-agent/lib/db/schema.ts`: schema D1/SQLite
- `kb-agent/lib/db/index.ts`: adapter DB cho local và Cloudflare
- `kb-agent/lib/rag/embedder.ts`: tạo embedding query bằng OpenAI
- `kb-agent/lib/rag/retriever.ts`: query Vectorize, join với D1 để lấy chunk text và metadata

### 3.4 LLM

- `kb-agent/lib/llm/client.ts`: singleton OpenAI client và model config
- `kb-agent/lib/llm/prompts.ts`: system prompt cho chat và evaluation
- `kb-agent/lib/llm/citations.ts`: map `[SOURCE_X]` trong response thành citation metadata hiện trên UI
- `kb-agent/lib/llm/evaluator.ts`: tạo JSON evaluation từ lịch sử hội thoại

### 3.5 Script và setup

- `kb-agent/scripts/ingest-pdf.ts`: ingest PDF vào D1 + Vectorize
- `kb-agent/scripts/init-local-db.ts`: tạo `local.db` và seed data local
- `kb-agent/scripts/seed-demo-data.sql`: seed course/student demo cho remote D1
- `kb-agent/wrangler.toml`: khai báo binding D1 và Vectorize

## 4. Môi trường chạy

Dự án có 2 mode runtime chính:

### 4.1 Local dev

- chạy bằng `pnpm dev`
- DB dùng file SQLite local qua `@libsql/client`, file `kb-agent/local.db`
- không có Cloudflare Worker binding thật sự
- vì vậy route chat sẽ fallback local DB và bỏ qua RAG retrieval
- kết quả: UI, flow portal, lưu lịch sử, evaluation vẫn chạy; nhưng chat local thường không có context từ tài liệu

### 4.2 Cloudflare / production-like

- chạy qua OpenNext + Cloudflare Pages/Workers
- DB dùng D1 binding `DB`
- retrieval dùng Vectorize binding `VECTORIZE`
- đây là môi trường cần để test RAG đầy đủ

## 5. Data model và ý nghĩa bảng D1

Schema nằm ở `kb-agent/lib/db/schema.ts`.

### 5.1 Các bảng nghiệp vụ

- `students`: thông tin student sau launch
- `courses`: thông tin môn học/LTI context
- `chat_sessions`: mỗi lần vào chat tạo một session mới
- `messages`: lưu từng tin nhắn user và assistant
- `evaluations`: lưu kết quả đánh giá của một session

### 5.2 Các bảng phục vụ RAG

- `documents`: metadata tài liệu, gắn với `course_id`
- `document_chunks`: text chunk của mỗi document

### 5.3 Quan hệ quan trọng

- `documents.course_id -> courses.id`
- `document_chunks.document_id -> documents.id`
- `chat_sessions.student_id -> students.id`
- `chat_sessions.course_id -> courses.id`
- `messages.session_id -> chat_sessions.id`
- `evaluations.session_id -> chat_sessions.id`

Ý nghĩa thực tế:

- Vectorize giữ vector và metadata để tìm kiếm nhanh
- D1 giữ text chunk gốc, metadata và lịch sử nghiệp vụ
- khi retrieve, hệ thống query Vectorize trước, sau đó join sang D1 để lấy nội dung chunk thật sự

## 6. Vectorize được dùng như thế nào

Cloudflare Vectorize hiện đang đóng vai trò retrieval index cho RAG.

### 6.1 Khi ingest

Script `kb-agent/scripts/ingest-pdf.ts` làm các bước:

1. load file PDF
2. parse text từ PDF
3. chunk text thành các đoạn nhỏ
4. tạo embedding cho từng chunk bằng `text-embedding-3-small` với `dimensions: 768`
5. upsert vector vào Vectorize index `kb-embeddings`
6. insert metadata document vào D1
7. insert từng `document_chunk` vào D1

Metadata vector đang được lưu trong Vectorize gồm:

- `courseId`
- `documentId`
- `pageNumber`
- `chunkIndex`

Chunk ID trong D1 và vector ID trong Vectorize là cùng một giá trị. Đây là key để join 2 hệ thống.

### 6.2 Khi chat

Trong `kb-agent/app/api/chat/route.ts`, hệ thống:

1. lấy last user message
2. tạo query embedding
3. query Vectorize theo `topK` và `filter: { courseId }`
4. lọc match theo score tối thiểu
5. lấy `chunkIds`
6. query D1 bằng `document_chunks` + `documents`
7. format thành context cho prompt với marker `[SOURCE_1]`, `[SOURCE_2]`, ...

Lúc này Vectorize chỉ giúp tìm vector gần nhất. Nội dung trích dẫn và metadata hiện trên UI vẫn đến từ D1.

## 7. Tin nhắn được lưu như thế nào

Đây là một trong những flow quan trọng nhất cần hiểu.

### 7.1 Seed message trong UI

Khi vào `app/chat/[sessionId]/page.tsx`, server page:

1. đọc `iron-session` từ cookie
2. verify `sessionId` đang xem có thuộc student hiện tại không
3. query D1 lấy message history theo `sessionId`
4. query danh sách các session cùng student + course để hiện sidebar
5. truyền `initialMessages` vào `ChatInterface`

### 7.2 Gửi message mới

Trong `components/chat/ChatInterface.tsx`:

1. UI dùng `@ai-sdk/react`
2. message mới được gửi tới `/api/chat`
3. body gửi kèm `sessionId`, `courseId`, `courseName`

### 7.3 Persist message

Trong `app/api/chat/route.ts`, sau khi LLM stream xong:

1. insert user message vào bảng `messages`
2. insert assistant message vào bảng `messages`
3. nếu có citation thì lưu vào cột `citations` dưới dạng JSON string
4. update `chat_sessions.updated_at`

Cột `messages` hiện có:

- `role`: `user` hoặc `assistant`
- `content`: text thuần
- `citations`: JSON string, chỉ có ý nghĩa với assistant message

### 7.4 Trigger evaluation

Sau khi persist, route chat đếm số message `role = user` trong session.

Nếu số câu hỏi user chia hết cho 4, route sẽ gửi metadata `triggerEvaluation: true` lên stream. UI nhận metadata này để hiện banner mời user xem evaluation.

Lưu ý:

- evaluation hiện đang không chạy tự động ngầm trong background
- nó được tạo khi user vào trang `/evaluation`

## 8. Citation flow

Hệ thống citation hiện không dùng function calling phức tạp. Nó chạy theo pattern nhẹ và hợp với MVP:

1. prompt bắt buộc model đánh dấu câu có nguồn bằng `[SOURCE_X]`
2. context đưa vào prompt cũng được đánh số `[SOURCE_1]`, `[SOURCE_2]`
3. sau khi model trả lời, `parseCitations()` quét regex `[SOURCE_X]`
4. map lại index đó sang `contextChunks`
5. tạo metadata citation gồm tên document, page, quote
6. stream metadata về UI để render card citation

Ưu điểm:

- đơn giản, dễ debug
- phù hợp MVP

Hạn chế:

- model có thể không đặt marker đều tay
- citation đúng theo chunk trong context hiện tại, chưa có verify sau sinh

## 9. End-to-end flow chi tiết

### 9.1 Flow 1 - Student launch từ portal vào chat

1. student mở `/portal`
2. UI `MockMoodlePortal` cho chọn student và course demo
3. frontend gọi `POST /api/lti/launch`
4. route launch xác định mode:
   - `mock`: lấy student/course từ `lib/lti/mock.ts`
   - `production`: nhận `id_token` và validate LTI
5. route upsert `students`
6. route upsert `courses`
7. route tạo `chat_sessions`
8. route lưu `iron-session` cookie với:
   - `studentId`
   - `courseId`
   - `courseName`
   - `sessionId`
   - `displayName`
9. route trả `redirectUrl`
10. frontend chuyển sang `/chat/[sessionId]`

### 9.2 Flow 2 - User chat và hệ thống retrieve tài liệu

1. `ChatPage` load lịch sử message từ D1
2. `ChatInterface` tạo `Chat` instance seed bằng `initialMessages`
3. user nhập câu hỏi
4. frontend gọi `POST /api/chat`
5. backend convert UI messages thành model messages
6. backend lấy message user cuối cùng để embed
7. nếu có Cloudflare context:
   - tạo query embedding bằng OpenAI
   - query Vectorize theo `courseId`
   - join qua D1 để lấy text chunk và document name
8. backend xây system prompt + context chunks
9. backend gọi model chat và stream response
10. backend parse `[SOURCE_X]` thành citations
11. backend persist user message + assistant message vào D1
12. backend cập nhật `chat_sessions.updated_at`
13. nếu đến ngưỡng 4 câu hỏi user thì gửi metadata trigger evaluation
14. UI hiện response và citation card

### 9.3 Flow 3 - Xem evaluation

1. user mở `/evaluation`
2. page đọc cookie session và xác định `targetSessionId`
3. frontend loader gọi `POST /api/evaluation`
4. backend tìm session trong D1
5. backend check `evaluations` xem đã có cache chưa
6. nếu đã có `result_json` thì trả về ngay
7. nếu chưa có:
   - query toàn bộ messages của session
   - gọi LLM evaluator
   - sinh JSON theo schema zod
   - insert vào bảng `evaluations`
8. frontend render radar chart, strengths, gaps, score

### 9.4 Flow 4 - Ingest tài liệu mới

1. dev chạy `pnpm ingest -- ...`
2. script load env từ `.env.local`
3. script parse PDF, chunk text
4. script đảm bảo `course` tồn tại trong D1
5. script insert `documents`
6. script tạo embedding cho từng chunk
7. script upsert vector vào Vectorize
8. script insert `document_chunks` vào D1
9. sau khi xong, chat route có thể retrieve theo `courseId` mới

## 10. Local dev lần đầu

Phần này là hướng dẫn chạy local cho dev mới. Mục tiêu là có thể chạy portal -> chat -> evaluation trên máy local nhanh nhất.

### 10.1 Yêu cầu

- Node.js 20+
- pnpm
- file `.env.local`
- file `.dev.vars` nếu muốn chạy với wrangler/dev binding sau này

### 10.2 Cài dependency

Chạy trong thư mục `kb-agent`:

```bash
pnpm install
```

### 10.3 Tạo env local tối thiểu

Tạo hoặc cập nhật `kb-agent/.env.local`:

```env
OPENAI_API_KEY=your_openai_key
LTI_MODE=mock
LTI_MOCK_SECRET=kb-agent-mock-secret-demo-2026-abcd1234
SESSION_SECRET=kb-agent-session-secret-demo-2026-xyz9876
```

Nếu dự định deploy hoặc chạy với wrangler, tạo thêm `kb-agent/.dev.vars` với bộ key tương tự.

Lưu ý:

- `LTI_MOCK_SECRET` và `SESSION_SECRET` nên dài từ 32 ký tự trở lên
- local dev thông thường chỉ cần `OPENAI_API_KEY`

### 10.4 Khởi tạo local DB

Chạy:

```bash
pnpm db:local-init
```

Script này sẽ:

1. tạo/kết nối `local.db`
2. apply tất cả migration trong `drizzle/migrations`
3. seed `courses` và `students` demo

### 10.5 Chạy app

```bash
pnpm dev
```

Mở `http://localhost:3000/portal`

### 10.6 Flow test local nên đi

1. vào `/portal`
2. chọn student
3. chọn môn học
4. launch vào `/chat/[sessionId]`
5. hỏi 1-2 câu để kiểm tra stream
6. hỏi đủ 4 câu để evaluation banner hiện ra
7. vào `/evaluation`
8. vào `/api/health` để check DB local

### 10.7 Giới hạn local dev hiện tại

Đây là điểm rất quan trọng cho dev mới:

- local `pnpm dev` không có binding `VECTORIZE`
- trong `app/api/chat/route.ts`, nếu không lấy được `getCloudflareContext()` thì route sẽ fallback local DB và bỏ qua RAG
- nghĩa là local UI và save history vẫn hoạt động, nhưng retrieval từ tài liệu thường không có

Nếu muốn test RAG thật sự, cần chạy ingest vào remote D1 + Vectorize và deploy lên Cloudflare, hoặc tự viết thêm local mock cho Vectorize.

## 11. Hướng dẫn ingest cho dev mới

Ingest là bước cần thiết nếu muốn chat có context tài liệu.

### 11.1 Env cần thêm

Ngoài `.env.local`, cần có:

```env
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_D1_DATABASE_ID=...
CLOUDFLARE_VECTORIZE_INDEX=kb-embeddings
```

### 11.2 Lệnh ingest mẫu

```bash
pnpm ingest -- --pdf ./public/sample-docs/sach-giao-khoa-tin-hoc-12-khmt-canh-dieu-trang-2.pdf --course course-tin-hoc-12-bai1 --course-title "Tin hoc 12 - Bai 1" --doc-name "Tin hoc 12 bai 1" --doc-id doc-tinhoc-001
```

Script sẽ tự:

- load `.env.local`
- parse `pdf-parse` theo API version hiện tại
- upsert course nếu course đó chưa có
- insert document và chunks vào D1
- upsert vectors vào Vectorize

## 12. Điểm cần biết khi debug

### 12.1 Chat không có citation

Kiểm tra:

- đã ingest document cho đúng `courseId` chưa
- route có đang chạy trong môi trường có binding `VECTORIZE` không
- score retrieval có vượt `MIN_SCORE` không

### 12.2 Launch thành công nhưng không vào được session cũ

`app/chat/[sessionId]/page.tsx` có verify session đang xem phải thuộc student hiện tại trong cookie. Nếu không đúng student, page sẽ redirect về `/portal`.

### 12.3 Evaluation không tạo được

Kiểm tra:

- session có ít nhất 2 messages
- `OPENAI_API_KEY` hợp lệ
- bảng `evaluations` đã có cột `result_json`

### 12.4 Health check nên dùng để check gì

`/api/health` hiện:

- runtime hiện tại là local hay Cloudflare
- D1 có kết nối được không
- Vectorize có bind hay không

## 13. Giới hạn MVP hiện tại

Những điểm dưới đây là có chủ ý, không phải bug bất ngờ:

- local dev chưa có local retrieval path, nên RAG đầy đủ chỉ test tốt trên Cloudflare
- citation dựa trên marker prompt, chưa có post-verification
- evaluation hiện là on-demand, không phải async job background
- LTI 1.3 production path đã có skeleton, nhưng demo hiện tại vẫn xoay quanh mock mode
- script ingest đang parse text theo kiểu đơn giản, page number là xấp xỉ khi PDF parser không trả về text theo page thật

## 14. Hướng nâng cấp tiếp theo

Nếu team tiếp tục phát triển sau MVP, thứ tự hợp lý nên là:

1. tạo local/dev path cho retrieval để developer test RAG mà không cần deploy
2. bổ sung local/session auth và guard rõ ràng hơn
3. tách message persistence và evaluation sang background job
4. nâng cấp citation từ marker sang structured output hoặc tool-call
5. hoàn thiện LTI 1.3 production integration với JWKS, client_id, deployment config thật

## 15. Lệnh thường dùng

Trong thư mục `kb-agent`:

```bash
pnpm install
pnpm db:local-init
pnpm dev
pnpm ingest -- --pdf ./public/sample-docs/your.pdf --course your-course-id --course-title "Your Course" --doc-name "Your Doc" --doc-id your-doc-id
pnpm build
pnpm build:cf
pnpm deploy
```

## 16. File nên đọc đầu tiên nếu mới vào repo

Thứ tự đọc để hiểu dự án nhanh nhất:

1. `docs/architecture-onboarding.md`
2. `kb-agent/lib/db/schema.ts`
3. `kb-agent/app/api/lti/launch/route.ts`
4. `kb-agent/app/api/chat/route.ts`
5. `kb-agent/lib/rag/retriever.ts`
6. `kb-agent/app/chat/[sessionId]/page.tsx`
7. `kb-agent/components/chat/ChatInterface.tsx`
8. `kb-agent/app/api/evaluation/route.ts`

Nếu cần tóm tắt một câu: dự án này là một ứng dụng Next.js mô phỏng entry qua LTI, lưu session và message trong D1, retrieve tài liệu bằng Vectorize + D1, stream chat bằng OpenAI, và sinh evaluation từ lịch sử hội thoại để phục vụ demo AI Knowledge Base cho môn học.
