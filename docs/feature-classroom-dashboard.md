# Feature Report: Classroom Dashboard

Cap nhat: 2026-03-29

## 1. Muc tieu

Bo sung mot dashboard theo quy mo lop hoc de bien he thong tu chatbot ca nhan thanh mot nen tang co goc nhin analytics cho giang vien va ban giam khao hackathon.

## 2. Van de truoc khi bo sung

Truoc thay doi nay, source da co:

- tracking theo session
- learning events
- concept mastery
- dashboard tracking cho tung sinh vien

Nhung van thieu:

- goc nhin toan lop
- danh sach sinh vien can chu y
- concept yeu chung cua lop
- thong ke tong quan de pitch use case giang vien / nha truong

## 3. Giai phap da them

Da bo sung mot classroom dashboard theo course hien tai, gom 4 lop thong tin:

- tong quan lop hoc: so sinh vien, sinh vien dang hoat dong, so phien hoc, so lan danh gia
- concept yeu chung: nhom concept co mastery trung binh thap nhat trong lop
- sinh vien can chu y: uu tien sinh vien chua co danh gia hoac co nhieu concept duoi nguong
- bang tien do: tom tat session, chat turns, evaluations, concept count, mastery trung binh va hoat dong gan nhat

## 4. Cach trien khai

### 4.1 Backend

- Them API: `GET /api/learning/classroom`
- Route nay chi cho phep truy cap course hien tai tu session cookie
- Du lieu duoc tong hop tu:
  - `chat_sessions`
  - `learning_events`
  - `student_concept_mastery`
  - `course_concepts`
  - `students`

### 4.2 Domain logic

- Them `buildClassroomOverview` de tong hop du lieu lop hoc
- Logic nay tinh:
  - chi so tong quan
  - danh sach concept yeu/manh
  - danh sach sinh vien can chu y
  - bang student snapshots

### 4.3 UI

- Them trang ` /classroom`
- Them loader va dashboard component rieng
- Them shortcut tu:
  - sidebar trong trang chat
  - trang evaluation

## 5. Test va xac minh

Da them testcase cho `buildClassroomOverview`:

- tong hop dung so lieu lop hoc
- xep hang dung sinh vien can chu y
- xu ly dung truong hop du lieu rong

Da xac minh:

- `pnpm test`
- `pnpm exec tsc --noEmit`
- `pnpm build`

Tat ca pass.

## 6. Gia tri mang lai

- Tang suc thuyet phuc khi demo hackathon vi khong chi co chatbot ca nhan
- Cho thay he thong co kha nang mo rong sang use case giang vien
- Dat nen cho cac buoc tiep theo nhu canh bao som, intervention workflow, va dashboard cap lop/toan khoa

## 7. Buoc tiep theo

- them timeline hoc tap theo ngay/tuan tu `learning_events`
- them bo loc theo sinh vien / concept
- them intervention workflow de giang vien biet can ho tro ai, luc nao
- tach ro `Tutor Agent`, `Diagnosis Agent`, `Planner Agent` de phan multi-agent thuyet phuc hon
