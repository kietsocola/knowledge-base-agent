# Bao Cao Danh Gia Source Code Va Dinh Huong San Pham Hackathon

Cap nhat: 2026-03-28

## 1. Muc tieu bao cao

Tai lieu nay duoc tao de phuc vu 3 muc dich:

- tong hop hien trang source code cua du an
- de xuat huong nang cap de san pham phu hop muc tieu "chatbot multi-agent hoc tap co tracking, thong ke, danh gia va ho tro"
- cung cap noi dung nhap co the tai su dung cho ho so du thi hackathon

## 2. Tom tat nhanh

Source code hien tai da hoan thanh mot MVP trinh dien kha tot cho bai thi hackathon, voi cac thanh phan chinh:

- portal mo phong luong vao tu LMS/LTI
- chat hoc tap theo mon hoc
- RAG dua tren tai lieu PDF
- citation de tang tinh minh bach
- luu lich su session
- evaluation sau hoi thoai

Tuy nhien, he thong hien tai chua phai la mot nen tang "multi-agent learning analytics" day du. Thuc chat, phien ban nay dang o muc:

- `AI tutor + RAG + session history + post-session evaluation`

Chu chua dat den muc:

- tracking nguoi hoc theo concept
- luu tien trinh hoc tap theo thoi gian
- phan tich muc do thong thao
- phat hien lo hong kien thuc
- de xuat intervention ca nhan hoa
- co nhieu agent voi vai tro tach biet va phoi hop ro rang

Neu dinh huong pitch dung cach, day van la mot bai thi co kha nang thuyet phuc cao vi:

- UI tot, de demo
- flow san pham ro rang
- co ung dung AI thuc te
- co huong mo rong ro rang thanh nen tang hoc tap thong minh

## 3. Hien trang ky thuat cua source code

### 3.1 Thanh phan da co

- Frontend Next.js 15 App Router
- UI demo dep va kha hoan chinh cho landing, portal, chat, evaluation
- DB dung PostgreSQL qua Drizzle
- Vector retrieval dung pgvector ngay trong bang `document_chunks`
- OpenAI cho chat, embedding va evaluation
- Session cookie thong qua `iron-session`
- upload PDF va ingest embedding truc tiep trong he thong

### 3.2 Cac luong nghiep vu da hoat dong

1. Chon sinh vien demo va mon hoc tai portal
2. Tao hoac mo lai chat session
3. Gui cau hoi hoc tap
4. Sinh embedding cho cau hoi
5. Retrieve chunk lien quan theo course
6. Tao cau tra loi co citation
7. Luu lich su chat
8. Sau mot nguong hoi dap, hien goi y xem danh gia
9. Trang evaluation sinh bao cao nang luc tu hoi thoai

### 3.3 Kiem tra build

Da kiem tra truc tiep trong repo:

- `pnpm exec tsc --noEmit`: pass
- `pnpm build`: pass

Co canh bao build lien quan den `pdf-parse` va workspace root cua Next.js, nhung chua gay loi chay demo.

## 4. Diem manh cua san pham hien tai

### 4.1 Diem manh san pham

- Trinh dien tot: giao dien hop voi hackathon, de gay an tuong khi demo
- Bai toan ro: hoc tap dua tren tai lieu mon hoc
- Co citation: tang do tin cay va tinh minh bach
- Co lich su chat: tao cam giac he thong "nho" qua trinh hoc
- Co evaluation: da vuot qua muc chatbot hoi dap thong thuong
- Co cau chuyen phat trien tiep: tu AI tutor thanh learning copilot va learning analytics platform

### 4.2 Diem manh ky thuat

- Tach duoc cac lop `llm`, `rag`, `db`, `lti`
- Data model MVP kha gon, de nang cap
- Duong dan mo rong sang Moodle that da duoc nghien cuu trong `docs/`
- Su dung stack pho bien, de recruit va mo rong sau hackathon

## 5. Khoang cach giua source code hien tai va muc tieu san pham mong muon

Muc tieu ban mong muon la:

- chatbot multi-agent hoc tap
- tracking lai user dang hoc gi
- xem lai lich su hoc va tien trinh
- thong ke, danh gia
- co phuong an ho tro phu hop

Source code hien tai moi dat mot phan:

### 5.1 Da co

- chat theo session
- luu hoi thoai
- danh gia tong quat theo hoi thoai
- citation theo tai lieu

### 5.2 Chua co

- concept graph hay taxonomy kien thuc cua tung mon hoc
- mastery tracking theo tung concept
- event log hoc tap theo thoi gian
- dashboard thong ke tien trinh hoc tap
- intervention engine de goi y hanh dong tiep theo
- rule de phat hien khi nao can chuyen giang vien that
- nhieu agent co vai tro rieng va output rieng

## 6. Cac van de va rui ro can uu tien

### 6.1 Rui ro bao mat va dung nghiep vu

1. API chat chua rang buoc session voi user hien tai.
- Route hien dang tin `sessionId` va `courseId` tu request body.
- Rui ro: ghi nham hoi thoai vao session khac hoac truy cap trai phep.

2. API evaluation chua kiem tra quyen so huu session.
- Rui ro: co the doc ket qua danh gia cua session khac neu biet `sessionId`.

3. Upload tai lieu cho phep truyen `courseId` tuy y.
- Rui ro: user dang nhap co the them tai lieu vao course khac, lam ban kho tri thuc.

### 6.2 Rui ro ve tracking hoc tap

4. Evaluation dang cache theo session mot cach qua tho.
- Neu session da co evaluation, he thong tra lai ban cu.
- Sau khi user hoc them, ket qua khong cap nhat theo tien trinh moi.

5. He thong chua co data model cho hoc tap theo concept.
- Chua biet user dang yeu o khai niem nao.
- Chua biet user dang tien bo hay thoai lui o ky nang nao.

### 6.3 Rui ro khi pitch truoc ban giam khao

6. Chua co LTI 1.3 production that.
- Validator production chua duoc implement.
- Nen pitch la "mock flow sat thuc te, san sang nang cap" thay vi "da ket noi that".

7. Tai lieu ky thuat dang lech voi implementation.
- Mot so docs cu van mo ta D1/Vectorize/Cloudflare.
- Code runtime hien tai lai dung PostgreSQL + pgvector.
- Neu BGK hoi sau, team can thong nhat mot cau tra loi duy nhat.

## 7. Danh gia muc do "multi-agent" cua san pham hien tai

Neu danh gia nghiem tuc, he thong hien tai chua phai multi-agent. No dang co:

- 1 agent chat hoc tap
- 1 tac vu evaluation dung model rieng

De co the tu tin goi la multi-agent, can tach vai tro nghiep vu ro rang. De xuat:

### 7.1 Tutor Agent

Nhiem vu:

- tra loi cau hoi
- giai thich theo tai lieu
- hoi nguoc lai de kiem tra hieu

Input:

- cau hoi hien tai
- lich su chat
- tai lieu retrieve duoc

Output:

- cau tra loi co citation
- cau hoi tiep noi

### 7.2 Diagnosis Agent

Nhiem vu:

- phan tich hoi thoai
- xac dinh user dang hoc concept nao
- danh gia muc do hieu va lo hong kien thuc

Input:

- lich su chat gan day
- taxonomy concept cua mon hoc

Output:

- danh sach concept dang hoc
- do tu tin theo concept
- canh bao lo hong kien thuc

### 7.3 Planner Agent

Nhiem vu:

- de xuat buoc hoc tiep theo
- tao lo trinh hoc ngan
- chon bai tap hoac tai lieu phu hop

Output:

- next step
- study plan ngan han
- recommended topics

### 7.4 Support Agent

Nhiem vu:

- quyet dinh co can chuyen giang vien that khong
- tao tom tat cau hoi kho
- de xuat cach ho tro phu hop

Output:

- de xuat "hoi giang vien"
- tom tat de gui giang vien
- muc do uu tien ho tro

## 8. Data model de xuat de bien MVP thanh he thong tracking hoc tap

Can bo sung cac bang sau:

### 8.1 `course_concepts`

Muc dich:

- dinh nghia cac concept/chuong/chu de trong tung mon hoc

Truong goi y:

- `id`
- `course_id`
- `name`
- `description`
- `parent_concept_id`
- `difficulty_level`

### 8.2 `learning_events`

Muc dich:

- ghi lai moi su kien hoc tap co y nghia

Truong goi y:

- `id`
- `student_id`
- `course_id`
- `session_id`
- `event_type`
- `event_payload`
- `created_at`

Vi du event:

- dat cau hoi
- nhan citation
- tra loi cau hoi nguoc
- xem evaluation
- hoi giang vien

### 8.3 `student_concept_mastery`

Muc dich:

- luu muc do thong thao theo tung concept

Truong goi y:

- `id`
- `student_id`
- `course_id`
- `concept_id`
- `mastery_score`
- `confidence_score`
- `last_evidence_at`
- `last_updated_by_agent`

### 8.4 `interventions`

Muc dich:

- luu cac goi y ho tro da de xuat cho user

Truong goi y:

- `id`
- `student_id`
- `course_id`
- `session_id`
- `intervention_type`
- `reason`
- `status`
- `created_at`

### 8.5 `evaluation_snapshots`

Muc dich:

- luu anh chup tien trinh theo thoi diem

Truong goi y:

- `id`
- `student_id`
- `course_id`
- `session_id`
- `snapshot_json`
- `generated_at`

## 9. Dashboard va thong ke nen co cho ban demo tiep theo

De ban giam khao nhin thay "tracking hoc tap" ro hon, nen them 1 dashboard co 4 khoi:

### 9.1 Ban do kien thuc dang hoc

Hien thi:

- 3-5 concept user dang hoc
- concept nao da nam
- concept nao con yeu

### 9.2 Tien trinh theo thoi gian

Hien thi:

- so phien hoc
- tong so cau hoi
- chu de da hoc trong tuan
- xu huong diem so danh gia

### 9.3 Canh bao va ho tro

Hien thi:

- nhung lo hong kien thuc lon nhat
- de xuat bai tap bo sung
- de xuat hoi giang vien khi can

### 9.4 Hanh dong tiep theo

Hien thi:

- hom nay nen hoc gi
- tai lieu nen doc tiep
- cau hoi nen tu kiem tra

## 10. Lo trinh nang cap thuc dung cho hackathon

### Phase 1: Chot ban nop thi

Muc tieu:

- demo muot
- cau chuyen san pham ro
- khong de lo cac diem yeu de tranh hoi kho

Can lam:

- fix kiem tra quyen session cho chat va evaluation
- khoa upload tai lieu theo dung course/session
- bo sung dashboard "dang hoc gi"
- cap nhat tai lieu ky thuat cho dung voi implementation thuc te

### Phase 2: Nang cap thanh "multi-agent MVP"

Can lam:

- them `Diagnosis Agent`
- luu `student_concept_mastery`
- tao `Planner Agent`
- hien next-step card ngay trong chat

### Phase 3: Tich hop LMS that

Can lam:

- LTI 1.3 production flow
- Moodle Web Service de sync course va tai lieu
- log audit va quan tri tenant

## 11. De xuat cach pitch san pham

Khong nen pitch la:

- "mot chatbot hoi dap AI thong thuong"
- "da ket noi Moodle that va day du multi-agent"

Nen pitch la:

> Nen tang tro ly hoc tap thong minh cho LMS, ket hop RAG, citation, danh gia nang luc va kien truc multi-agent de ca nhan hoa lo trinh hoc va ho tro nguoi hoc theo tien trinh thuc te.

Thong diep chinh nen nhan manh:

- day khong chi la chat bot
- day la he thong theo doi va ho tro qua trinh hoc
- AI khong chi tra loi, ma con chan doan, danh gia va de xuat hanh dong tiep theo
- kien truc cho phep mo rong phu hop voi bai toan giao duc tai Viet Nam

## 12. Noi dung nhap cho cac tieu chi tu danh gia san pham du thi

Luu y:

- Phan duoi day la ban nhap de su dung trong form du thi
- Co the chinh sua lai cho phu hop tone cua doi thi

### 12.1 Tinh sang tao, doi moi va cong nghe

San pham duoc phat trien theo dinh huong tro ly hoc tap thong minh da tac tu cho moi mon hoc, khac biet voi cac chatbot hoi dap thong thuong o cho he thong khong chi tra loi cau hoi ma con phan tich tien trinh hoc, xac dinh lo hong kien thuc va de xuat huong ho tro tiep theo cho tung nguoi hoc. Giai phap ket hop Retrieval-Augmented Generation tren hoc lieu mon hoc, co trich dan nguon ro rang, giup tang tinh minh bach va do tin cay cua noi dung AI. Cung voi do, he thong duoc thiet ke theo huong tach vai tro thanh cac lop agent nhu tro giang AI, agent chan doan muc do hieu, agent lap ke hoach hoc tap va agent ho tro chuyen giang vien, tao nen mot kien truc co tinh mo rong cao cho giao duc so.

Ve mat cong nghe, san pham ung dung cac thanh phan hien dai nhu Next.js App Router, giao dien tuong tac thoi gian thuc, OpenAI cho chat, embedding va danh gia, co so du lieu vector de truy xuat noi dung lien quan trong tai lieu mon hoc, va co kha nang tich hop LMS thong qua LTI. Diem doi moi cua san pham nam o viec dua AI vao trong ngu canh giao duc co cau truc, bo sung co che citation, session history va evaluation de phuc vu muc tieu hoc tap, thay vi chi cung cap cau tra loi tong quat. Giai phap phu hop voi dieu kien trien khai tai Viet Nam vi co the tan dung cac nen tang LMS dang pho bien nhu Moodle, giam chi phi xay dung moi va cho phep trien khai theo tung giai doan.

### 12.2 Tinh ung dung

San pham co tinh ung dung cao vi giai quyet mot van de rat pho bien trong moi truong giao duc hien nay: hoc lieu phan tan, sinh vien kho tim dung thong tin, kho tu hoc hieu qua va giang vien mat nhieu thoi gian tra loi cac cau hoi lap lai. He thong cho phep nguoi hoc tra cuu kien thuc theo tai lieu mon hoc mot cach nhanh chong, duoc AI giai thich theo ngu canh va co trich dan de de kiem chung. Dong thoi, he thong con luu lich su hoc tap va sinh bao cao danh gia de nguoi hoc biet minh dang yeu o dau va nen hoc tiep noi dung gi.

Ve trien vong kinh doanh va kha nang trien khai, san pham co the duoc dua vao su dung nhu mot lop AI mo rong cho cac he thong LMS da co san tai truong hoc, trung tam dao tao va doanh nghiep. Cach su dung don gian, giao dien than thien, khong doi hoi thay doi lon ve ha tang. Giai phap co the duoc ung dung rong cho nhieu mon hoc va nhieu cap do dao tao, tu dai hoc, cao dang den dao tao noi bo doanh nghiep. Gia tri kinh te xa hoi cua san pham den tu viec tang kha nang tu hoc, giam tai cho giang vien, toi uu hoa viec khai thac hoc lieu va nang cao chat luong day va hoc tren nen tang so.

### 12.3 Tinh hieu qua

San pham giup thay doi cach tiep can hoc tap tu mo hinh bi dong sang mo hinh tu hoc co huong dan, trong do nguoi hoc co the chu dong hoi dap, duoc goi y noi dung can bo sung va nhan danh gia nang luc ngay trong qua trinh hoc. Dieu nay giup giam thoi gian tim kiem tai lieu, giam do tre khi can ho tro, dong thoi nang cao kha nang nam bat lo hong kien thuc truoc khi buoc vao bai kiem tra hoac ky thi.

Ve hieu qua van hanh, he thong giup giam so luong cau hoi lap lai ma giang vien phai xu ly thu cong, ho tro giang vien nhin nhanh cac diem yeu pho bien cua nguoi hoc de co phuong an day bo sung phu hop. Ve phia nguoi hoc, he thong tao ra mot tro ly hoc tap 24/7, giup duy tri dong luc hoc, theo doi duoc qua trinh tien bo va nhan huong dan ca nhan hoa. Ve lau dai, giai phap co the dong vai tro nhu mot cong cu nang cao nang suat hoc tap, gop phan cai thien chat luong dao tao va toi uu chi phi ho tro hoc tap tren quy mo lon.

### 12.4 Tiem nang phat trien

San pham co tiem nang phat trien cao vi duoc xay dung tren kien truc mo rong, de bo sung them cac thanh phan nhu tracking theo concept, dashboard cho giang vien, goi y lo trinh hoc tap, canh bao som nguy co hoc yeu va tich hop day du voi LMS thong qua LTI va cac API dong bo hoc lieu. Phien ban hien tai da xac lap duoc flow co ban tu vao he thong, hoc voi AI, luu lich su, danh gia nang luc den trinh dien ket qua, tao nen mot nen mong ro rang de nang cap thanh he thong phan tich hoc tap thong minh.

Ve mat doi ngu, huong phat trien cua san pham la kha thi vi bai toan da duoc chia tach thanh cac module ro rang nhu giao dien, quan ly session, retrieval, danh gia va tich hop LMS. Dieu nay cho phep doi ngu tiep tuc mo rong san pham theo lo trinh ngan han va trung han mot cach kiem soat. San pham cung co kha nang thu hut dau tu va hop tac vi nam trong giao diem cua hai nhu cau lon: chuyen doi so giao duc va AI ca nhan hoa. Khi duoc bo sung day du tinh nang phan tich tien trinh va dashboard quan tri, day co the tro thanh mot giai phap co gia tri thuong mai cao cho cac co so giao duc va to chuc dao tao.

### 12.5 Tinh cong dong

San pham mang gia tri cong dong ro rang vi huong den viec nang cao kha nang tiep can ho tro hoc tap chat luong cho dong dao nguoi hoc, dac biet trong boi canh su chenh lech ve dieu kien hoc tap giua cac khu vuc. Voi mot tro ly hoc tap hoat dong lien tuc, nguoi hoc co the duoc ho tro ngay ca khi khong co dieu kien hoc them, khong the tiep can giang vien thuong xuyen, hoac dang hoc tai cac khu vuc con thieu nguon luc giao duc.

He thong giup khai thac hieu qua hoc lieu san co cua nha truong, chuyen hoa hoc lieu thanh tri thuc de tra cuu, giai thich va huong dan theo ngu canh. Neu duoc trien khai rong, giai phap co the gop phan thuc day hoc tap suot doi, nang cao nang luc tu hoc, thu hep khoang cach ve co hoi hoc tap va tao ra tac dong tich cuc doi voi cong dong hoc sinh, sinh vien, giao vien va cac don vi dao tao. Dac biet, mo hinh nay phu hop voi xu huong pho cap cong cu ho tro hoc tap so den nhieu doi tuong khac nhau, trong do loi ich xa hoi lon nhat la giup moi nguoi hoc co co hoi nhan duoc su ho tro kip thoi, ca nhan hoa va chi phi hop ly.

## 13. Tai lieu mo ta ky thuat co ban va huong dan su dung

Ban co the dung doan mo ta ngan sau trong phan dinh kem tai lieu:

> San pham la nen tang tro ly hoc tap thong minh tich hop voi he thong quan ly hoc tap, cho phep nguoi hoc hoi dap dua tren hoc lieu mon hoc, nhan cau tra loi co trich dan, duoc danh gia muc do hieu va nhan goi y noi dung can hoc tiep. He thong gom cac thanh phan chinh: cong vao tu LMS mo phong LTI, kho tri thuc tai lieu PDF, bo may RAG truy xuat ngu canh, AI tutor, module danh gia nang luc va giao dien dashboard. Nguoi dung co the truy cap portal, chon mon hoc, dat cau hoi, xem lich su hoc tap va nhan bao cao danh gia sau moi chuoi hoi dap.

Neu nop link Google Drive hoac YouTube, nen chuan bi:

- 1 file PDF mo ta san pham
- 1 video demo 3-5 phut
- 1 file PNG tong hop architecture va flow

### 13.1 Goi y kich ban video demo

1. Vao portal va chon mon hoc
2. Mo chat session
3. Hoi 2-3 cau hoi hoc tap
4. Cho thay citation tu tai lieu
5. Hien evaluation
6. Hien dashboard "dang hoc gi" va "can ho tro gi"
7. Ket bang tam nhin multi-agent va tich hop Moodle that

## 14. Kien nghi hanh dong ngay

Neu chi con it thoi gian truoc khi nop bai, uu tien dung thu tu sau:

1. Sua cac lo hong quyen truy cap cho chat, evaluation, upload tai lieu
2. Them dashboard tracking toi thieu theo concept
3. Bo sung 1 agent chan doan + 1 agent lap ke hoach o muc MVP
4. Cap nhat tai lieu va loi pitch cho thong nhat
5. Quay video demo phong truong hop mang hoi truong khong on dinh

## 15. Ket luan

Du an hien tai da co mot nen mong MVP rat phu hop de nop hackathon, dac biet manh o khia canh trinh dien, chat dua tren tai lieu va danh gia nguoi hoc. Diem can nang cap khong nam o viec lam giao dien dep hon, ma nam o viec bien he thong tu chatbot co them evaluation thanh mot nen tang tracking hoc tap va ho tro ca nhan hoa theo kien truc multi-agent.

Neu duoc pitch dung cach, san pham nen duoc dinh vi la:

> Nen tang AI learning copilot cho LMS, co kha nang mo rong thanh he thong multi-agent phan tich hoc tap va ho tro ca nhan hoa cho nguoi hoc tai Viet Nam.

