# Bao Cao Trang Thai Hien Tai Cua Source Code

Cap nhat: 2026-03-29

## 1. Muc tieu

Tai lieu nay dung de danh gia nhanh source code hien tai dang o muc nao, manh o diem gi, thieu o diem gi, va co phu hop de nop hackathon hay chua.

## 2. Ket luan ngan

Source code hien tai dang o muc:

**Hackathon-ready MVP da duoc hardening co ban**

Neu quy doi thanh thang muc do 5 cap:

- Muc 1: y tuong / mock UI
- Muc 2: MVP demo duoc
- Muc 3: MVP demo duoc + co backend that + co guard rails co ban
- Muc 4: beta noi bo, co tracking va van hanh on dinh hon
- Muc 5: production-ready

Thi source code nay dang o:

**Muc 3+/5**

Ly do:

- da co san pham chay duoc end-to-end
- da co chat, RAG, citation, session history, evaluation
- da duoc bo sung mot so hardening ve quyen truy cap va cache
- da co test cho nhom logic quan trong
- da bat dau co concept tracking va learning events o muc nen tang
- nhung chua co learning analytics day du, chua co multi-agent that, chua co production LTI that, chua dat muc production

## 3. Nhung gi da co trong source hien tai

### 3.1 Product flow da co

- landing page va portal demo
- mock LTI launch
- tao chat session
- chat dua tren tai lieu mon hoc
- citation tu tai lieu
- lich su session theo mon hoc
- evaluation sau hoi thoai
- support plan tren trang evaluation
- concept tracking foundation
- concept mastery persistence
- learning event timeline foundation

### 3.2 Backend va data da co

- Next.js App Router
- PostgreSQL qua `postgres` + Drizzle
- `pgvector` ngay trong bang `document_chunks`
- session cookie qua `iron-session`
- upload PDF va ingest embedding
- luu messages, sessions, evaluations
- luu `course_concepts`, `student_concept_mastery`, `learning_events`

### 3.3 Hardening moi da duoc them tren branch hien tai

- khoa quyen `chat` va `evaluation` theo session sinh vien
- khoa `documents` va `upload` theo course dang active
- sua logic cache evaluation de cap nhat khi hoi thoai thay doi
- them support plan de xuat sau evaluation
- them `course_concepts` va `student_concept_mastery`
- persist concept mastery sau moi lan evaluation moi
- them `learning_events` cho `chat` va `evaluation`

### 3.4 Test da co

Hien da co testcase cho:

- session authorization
- course-scoped authorization
- evaluation cache freshness
- support plan logic
- concept tracking signal builder
- concept mastery merge logic
- learning event factory

Dieu nay nang du an tu muc "demo co code" len muc "MVP co logic kiem thu mot phan".

## 4. Diem manh hien tai

### 4.1 Manh ve demo hackathon

- giao dien kha hoan chinh, de trinh bay
- flow san pham ro, de ban giam khao trai nghiem
- bai toan giao duc ro rang
- citation tang do tin cay
- evaluation, support plan va concept tracking giup san pham vuot qua chatbot hoi dap don thuan

### 4.2 Manh ve ky thuat

- code da tach thanh cac module `db`, `llm`, `rag`, `lti`, `evaluation`, `security`
- data model MVP de doc va de nang cap
- co script push schema, seed, ingest
- build va typecheck da qua

## 5. Nhan dinh chinh xac ve muc do hien tai

Day chua phai la:

- multi-agent learning system day du
- nen tang tracking hoc tap theo concept
- san pham san sang production
- he thong LTI 1.3 tich hop that voi Moodle

Day dang la:

- AI learning assistant MVP co RAG
- co session history
- co evaluation theo hoi thoai
- co de xuat ho tro o muc rule-based
- co concept tracking o muc persisted foundation
- co learning event timeline o muc persisted foundation
- du tot de di thi hackathon neu pitch dung

## 6. Muc do hoan thien theo tung nhom

### 6.1 UI/UX

Muc do: **Tot cho hackathon**

Nhan xet:

- landing, portal, chat, evaluation da kha day du
- giao dien de demo
- co tinh thong nhat va de thuyet trinh

### 6.2 AI/RAG

Muc do: **MVP da dung duoc**

Nhan xet:

- co retrieve theo course
- co embedding
- co citation
- co evaluation bang model rieng

Han che:

- chua co verify citation sau sinh
- chua co concept mapping
- chua co orchestration nhieu agent

### 6.3 Bao mat va access control

Muc do: **Da tot hon ro ret so voi ban dau**

Nhan xet:

- cac route quan trong da co authorization helper
- da giam rui ro IDOR/noi dung bi lam ban

Han che:

- van la hardening cho MVP, chua phai security model day du

### 6.4 Tracking va learning analytics

Muc do: **Da co nen tang, chua day du**

Nhan xet:

- da co session history
- da co evaluation snapshot theo session
- da co support plan
- da co event log hoc tap o muc nen tang
- da co mastery theo concept o muc nen tang

Han che:

- chua co dashboard thong ke theo thoi gian
- chua hien thi ro user dang hoc gi o cap do chi tiet tren UI

### 6.5 Tich hop LMS/LTI

Muc do: **Mock-ready**

Nhan xet:

- flow mock kha on de demo

Han che:

- production validator cho LTI chua xong
- chua co OIDC login initiation that
- chua co sync tai lieu tu Moodle

## 7. Danh gia tong the cho muc tieu ban dau

Muc tieu ban dau la:

- chatbot multi-agent hoc tap
- tracking lai user dang hoc gi
- xem lai user dang hoc gi
- thong ke, danh gia
- co phuong an ho tro

Danh gia thang than:

### 7.1 Da dat

- chatbot hoc tap theo tai lieu
- luu lich su hoi thoai
- evaluation sau session
- co phuong an ho tro o muc co ban

### 7.2 Moi dat mot phan

- tracking qua session
- support cho nguoi hoc
- concept tracking o muc persisted data

### 7.3 Chua dat

- multi-agent dung nghia
- thong ke tien trinh hoc tap day du
- dashboard giang vien / analytics

## 8. Co phu hop de nop hackathon khong

**Co.**

Nhung cach pitch phai dung.

Nen pitch la:

> Nen tang AI learning copilot cho LMS, co RAG, citation, evaluation va support plan, san sang mo rong thanh he thong multi-agent learning analytics.

Khong nen pitch la:

- da la he thong multi-agent hoan chinh
- da tich hop Moodle LTI 1.3 production
- da tracking day du nang luc nguoi hoc theo thoi gian

## 9. Uu tien tiep theo neu con thoi gian

### Uu tien 1

Hien thi concept mastery len UI evaluation/dashboard

Tac dung:

- user thay duoc minh dang yeu o chu de nao
- BGK thay ngay gia tri tracking

### Uu tien 2

Them dashboard thong ke tu `learning_events`

Tac dung:

- tao timeline hoc tap
- thong ke duoc theo ngay/tuan

### Uu tien 3

Tach ro `Tutor Agent`, `Diagnosis Agent`, `Planner Agent`

Tac dung:

- co the pitch multi-agent thuyet phuc hon

### Uu tien 4

Them dashboard tien trinh cho giang vien / lop hoc

Tac dung:

- ban giam khao thay duoc gia tri tracking bang mat
- mo rong sang use case B2B/B2G

### Uu tien 5

Hoan thien LTI production va sync tai lieu Moodle

Tac dung:

- san sang de demo voi don vi giao duc that

## 10. Ket luan cuoi cung

Source code hien tai khong con o muc y tuong hay mock UI nua. No da la mot MVP hoat dong duoc, co backend that, co database that, co guard rails co ban, co test logic, va co kha nang demo rat on cho hackathon.

Danh gia tong quat:

- **Muc do hien tai:** Muc 3+/5
- **Tu khoa dung nhat:** Hackathon-ready MVP co nen tang learning analytics
- **Gia tri hien tai:** RAG learning assistant + evaluation + support plan + concept tracking foundation
- **Khoang cach lon nhat:** chua hien thi analytics day du tren UI va chua la multi-agent that

Neu tiep tuc nang cap dung huong, du an nay co the di tu MVP demo sang mot nen tang learning analytics thong minh trong cac buoc tiep theo.
