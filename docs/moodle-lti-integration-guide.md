# Kết nối LTI 1.3 với Moodle và chiến lược Sync khóa học/tài liệu

Cập nhật: 2026-03-27

## 1) Kết luận nhanh

- Trạng thái hiện tại: hệ thống **chưa kết nối Moodle LTI 1.3 thật**.
- Hiện có: luồng demo/mock LTI để tạo session học và vào chat.
- Chưa có: OIDC login initiation chuẩn LTI 1.3, verify JWKS RS256 từ Moodle, validate đầy đủ claim chuẩn IMS, quản lý nonce/state chống replay.
- Tài liệu môn học hiện tại: lấy bằng cách upload PDF thủ công vào hệ thống (`/api/documents/upload`), chưa kéo tự động từ Moodle.
- Quan trọng: LTI 1.3 chủ yếu để SSO + context khóa học; **không tự mang file tài liệu**. Muốn sync tài liệu phải tích hợp thêm Moodle Web Service hoặc plugin push.

## 2) Hiện trạng trong codebase

### 2.1 Các phần đã có

- Route launch: `app/api/lti/launch/route.ts`
- Validator token: `lib/lti/validator.ts`
- Mock data sinh viên/môn học: `lib/lti/mock.ts`
- Session cookie: `lib/session.ts`
- Sidebar + upload tài liệu: `components/layout/Sidebar.tsx`, `components/chat/UploadModal.tsx`
- API upload tài liệu vào DB vector: `app/api/documents/upload/route.ts`

### 2.2 Đánh giá chi tiết

1. `app/api/lti/launch/route.ts`
- Có 2 nhánh:
- `mock` mode nhận `studentId + courseId` từ UI demo.
- nhận `id_token` và gọi `validateLTIToken`.
- Có upsert `students`, `courses`, tạo/reuse `chat_sessions`, set cookie session.
- Vấn đề:
- Chưa xử lý chuẩn kiểu POST form từ Moodle launch (thường `application/x-www-form-urlencoded`).
- Claim mapping đang dùng kiểu đơn giản (`claims.context.id`, `claims.ltiVersion`, ...), không theo URI claim chuẩn IMS.
- Chưa lưu thông tin registration/platform/deployment để kiểm soát multi-tenant.

2. `lib/lti/validator.ts`
- `mock`: verify HS256 bằng `LTI_MOCK_SECRET`.
- `production`: đang `throw new Error("Production LTI mode not yet implemented")`.
- Chưa có:
- `createRemoteJWKSet` từ Moodle JWKS URL.
- Verify `iss/aud/azp/exp/iat/nonce`.
- Check message type `LtiResourceLinkRequest`.
- Check deployment id hợp lệ.

3. UI portal
- `components/portal/WellStudyPortal.tsx` đang gọi trực tiếp `/api/lti/launch` với dữ liệu mock.
- Đây là portal demo, không phải điểm vào chuẩn từ Moodle.

4. Luồng tài liệu
- Hiện chỉ có 2 cách:
- Upload tay bằng modal trên sidebar.
- Script ingest từ file cục bộ (`scripts/ingest-pdf.ts`).
- Chưa có API sync khóa học/tài liệu từ Moodle.

## 3) LTI 1.3 và tài liệu Moodle: hiểu đúng vai trò

- LTI 1.3 cung cấp chủ yếu:
- xác thực người dùng từ LMS sang Tool
- context học phần (course/resource link)
- dịch vụ liên quan điểm số/roster (AGS/NRPS) nếu có scope
- LTI 1.3 **không** tự động gửi toàn bộ file khóa học cho tool.
- Để lấy file tài liệu Moodle cần một lớp tích hợp khác:
- Moodle REST Web Service token (khuyến nghị cho MVP)
- hoặc plugin Moodle đẩy metadata/file về tool (phức tạp hơn)

## 4) Kiến trúc mục tiêu đề xuất

```mermaid
flowchart LR
  A[Moodle Course Page] --> B[/lti/login-init]
  B --> C[Redirect to Moodle OIDC Auth]
  C --> D[/lti/launch]
  D --> E[Verify id_token via Moodle JWKS]
  E --> F[Upsert student/course/session]
  F --> G[/chat/{sessionId}]

  H[Admin click: Sync Courses] --> I[/api/moodle/sync/courses]
  I --> J[Moodle REST API]
  J --> K[(courses + mappings)]

  L[Teacher click: Sync Docs] --> M[/api/moodle/sync/course/:id/documents]
  M --> J
  M --> N[Download file + parse + embedding]
  N --> O[(documents + document_chunks + vector)]
```

## 5) Hướng triển khai kết nối Moodle LTI 1.3 thật

## 5.1 Bổ sung env cấu hình

Đề xuất thêm:

- `LTI_MODE=production`
- `LTI_TOOL_CLIENT_ID=<from Moodle external tool config>`
- `LTI_TOOL_DEPLOYMENT_ID=<from Moodle>`
- `LTI_ISSUER=https://your-moodle-domain`
- `LTI_AUTH_LOGIN_URL=https://your-moodle-domain/mod/lti/auth.php`
- `LTI_JWKS_URL=https://your-moodle-domain/mod/lti/certs.php`
- `LTI_REDIRECT_URI=https://your-domain/api/lti/launch`

## 5.2 Bổ sung endpoint chuẩn

1. `GET/POST /api/lti/login` (OIDC login initiation)
- nhận `iss`, `login_hint`, `target_link_uri`, `lti_message_hint`, `client_id`
- tạo `state` + `nonce`, lưu DB TTL ngắn
- redirect về `LTI_AUTH_LOGIN_URL` với query params chuẩn OIDC

2. `POST /api/lti/launch`
- nhận `id_token` (form post từ Moodle)
- verify chữ ký RS256 bằng JWKS
- verify state/nonce/aud/iss/deployment
- parse claim chuẩn URI IMS
- upsert user/course/session
- redirect vào `/chat/:sessionId`

## 5.3 Claim chuẩn cần parse

Thay vì dùng object giản lược, cần parse từ key URI:

- `https://purl.imsglobal.org/spec/lti/claim/message_type`
- `https://purl.imsglobal.org/spec/lti/claim/version`
- `https://purl.imsglobal.org/spec/lti/claim/deployment_id`
- `https://purl.imsglobal.org/spec/lti/claim/context`
- `https://purl.imsglobal.org/spec/lti/claim/resource_link`
- `https://purl.imsglobal.org/spec/lti/claim/roles`
- `https://purl.imsglobal.org/spec/lti-nrps/claim/namesroleservice` (nếu bật)
- `https://purl.imsglobal.org/spec/lti-ags/claim/endpoint` (nếu bật)

## 5.4 Bổ sung bảng DB cho LTI production

Đề xuất thêm:

- `lti_registrations`
  - `issuer`, `client_id`, `deployment_id`, `auth_login_url`, `jwks_url`, `active`
- `lti_oidc_state`
  - `state`, `nonce`, `issuer`, `created_at`, `expires_at`, `used_at`
- `lti_launch_audit`
  - `id`, `issuer`, `sub`, `course_id`, `resource_link_id`, `launched_at`, `raw_claims_json`

Mục tiêu:
- chống replay attack
- multi-course/multi-deployment sạch
- audit/debug khi Moodle cấu hình sai

## 6) Thiết kế Sync khóa học/tài liệu từ Moodle

## 6.1 Quyết định kiến trúc

Khuyến nghị cho giai đoạn gần nhất:

- LTI để login/context
- Moodle REST Web Service để sync dữ liệu học phần/tài liệu

Lý do:
- thực dụng và triển khai nhanh
- tách bạch auth học tập và đồng bộ nội dung
- không bắt buộc plugin Moodle custom ngay

## 6.2 Cấu hình Moodle Web Service

Cần tạo service account/token có quyền đọc:

- danh sách khóa học
- nội dung khóa học/module
- danh sách file/resource URL

Thường dùng các function Moodle REST tương tự:

- `core_course_get_courses_by_field`
- `core_course_get_contents`
- `core_files_get_files` (hoặc API liên quan theo version/plugin)

Lưu ý:
- một số file URL của Moodle cần token/session hợp lệ để tải.
- cần xử lý file private/permission theo vai trò người dùng.

## 6.3 Luồng sync khóa học

1. UI admin nhấn `Sync khóa học từ Moodle`
2. `POST /api/moodle/sync/courses`
3. backend gọi Moodle API lấy danh sách course
4. map vào bảng `courses`
5. lưu mapping Moodle course id vào bảng mapping (đề xuất)

Đề xuất bảng:

- `moodle_course_map`
  - `moodle_course_id`
  - `local_course_id`
  - `issuer`
  - `synced_at`

## 6.4 Luồng sync tài liệu của 1 khóa học

1. Teacher/Admin nhấn `Sync tài liệu` ở course cụ thể
2. `POST /api/moodle/sync/course/:courseId/documents`
3. backend gọi Moodle API lấy sections/modules/resources
4. lọc tài liệu hỗ trợ ingest (`pdf` ưu tiên)
5. tải file về tạm thời
6. parse text + chunk + embedding
7. upsert vào `documents` và `document_chunks`
8. ghi `source_url`, `external_id`, `checksum`, `last_synced_at`

Đề xuất mở rộng bảng `documents`:

- `external_source` (`moodle` | `manual_upload`)
- `external_id` (id file/resource từ Moodle)
- `checksum`
- `last_synced_at`
- `sync_status`

## 6.5 Tránh ingest trùng

Cơ chế idempotent:

- Tạo key theo `courseId + external_id + checksum`
- Nếu checksum không đổi: bỏ qua
- Nếu đổi: re-ingest và cập nhật chunk/vector

## 6.6 UX đề xuất cho nút sync

Tại sidebar/course panel thêm:

- `Sync khóa học từ Moodle` (admin scope)
- `Sync tài liệu khóa học` (theo course đang mở)
- `Lần sync gần nhất` + trạng thái `Đang sync/Thành công/Lỗi`
- `Xem log sync`

Mẫu route UI/backend:

- `POST /api/moodle/sync/courses`
- `POST /api/moodle/sync/course/:courseId/documents`
- `GET /api/moodle/sync/jobs?courseId=...`

## 7) Kế hoạch triển khai theo phase

## Phase 1 - Production LTI 1.3 (bắt buộc)

- Implement `/api/lti/login` + `/api/lti/launch` chuẩn OIDC
- Implement verify JWKS RS256 + state/nonce
- Parse claim chuẩn URI IMS
- Test launch từ Moodle sandbox

Tiêu chí Done:
- launch từ Moodle vào thẳng đúng course chat
- không cần portal mock cho đường production

## Phase 2 - Sync course list từ Moodle

- Thêm client Moodle REST
- endpoint sync courses
- bảng mapping course
- UI nút sync courses

Tiêu chí Done:
- bấm sync xong, course từ Moodle xuất hiện đúng trong hệ thống

## Phase 3 - Sync tài liệu

- endpoint sync documents theo course
- download file + ingest pipeline
- dedupe/checksum + log job
- UI trạng thái sync

Tiêu chí Done:
- bấm sync tài liệu, documents/chunks xuất hiện và dùng được ngay trong chat

## Phase 4 - Hardening

- retry/backoff cho download + OpenAI embed
- job queue/background worker
- monitoring + alert
- kiểm soát quyền teacher/admin

## 8) Câu trả lời trực tiếp cho câu hỏi nghiệp vụ

1. Hiện tại kết nối Moodle thật được chưa?
- Chưa. Mới mock LTI, production validator chưa implement.

2. Cần bổ sung gì?
- OIDC login initiation chuẩn LTI
- verify JWKS RS256 + validate claim/nonce/state đầy đủ
- registration/deployment config + bảng DB hỗ trợ
- endpoint nhận launch từ Moodle dạng form post

3. Kết nối xong có tự lấy tài liệu Moodle không?
- Không tự động theo LTI mặc định.
- Cần tích hợp Moodle API/plugin riêng để sync.

4. Có nên có nút sync khóa học/tài liệu không?
- Có, rất nên.
- Nên có tối thiểu 2 nút: sync course list và sync tài liệu course hiện tại.

## 9) Checklist kiểm thử sau khi triển khai

- Launch từ Moodle thật vào đúng `courseId` và tạo/reuse session đúng user.
- Token không hợp lệ bị từ chối đúng (issuer, aud, nonce, exp).
- Sync courses tạo đúng course map, không trùng.
- Sync documents ingest đúng số file/chunk, bỏ qua file không đổi.
- Chat trả lời có citation từ tài liệu vừa sync.
- Quyền truy cập: user course A không xem được tài liệu course B.

## 10) Gợi ý chỉnh sửa code cụ thể (điểm chạm)

- `app/api/lti/launch/route.ts`: tách nhánh mock và production rõ ràng, parse claim chuẩn URI.
- `lib/lti/validator.ts`: implement RS256 JWKS + validate full.
- `types/lti.ts`: thêm model claim chuẩn IMS URI.
- `lib/db/schema.ts`: thêm các bảng registration/state/audit + mapping sync.
- `app/api/moodle/*`: thêm module sync courses/documents.
- `components/layout/Sidebar.tsx`: thêm nút sync và trạng thái job.

---

Nếu đi theo thứ tự Phase 1 -> Phase 2 -> Phase 3, hệ thống sẽ chuyển từ demo mock sang tích hợp Moodle thật một cách an toàn và ít rủi ro nhất.
