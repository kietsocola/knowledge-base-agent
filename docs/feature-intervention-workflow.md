# Feature Report: Intervention Workflow

Cap nhat: 2026-03-29

## 1. Muc tieu

Bo sung lop `canh bao som + hanh dong de xuat` de bien cac chi so tracking thanh cac quyet dinh ho tro cu the cho sinh vien va giang vien.

## 2. Giai phap

Da them rule engine intervention dua tren:

- `learning_events`
- `concept mastery`
- `evaluation checkpoints`
- `classroom attention ratio`

He thong sinh ra alert theo 3 muc:

- `high`
- `medium`
- `low`

Moi alert gom:

- tieu de
- tom tat
- hanh dong de xuat

## 3. Pham vi hien tai

### 3.1 Cap ca nhan

Canh bao duoc tao khi:

- da chat nhieu nhung chua co evaluation
- co concept duoi nguong an toan
- co nhieu focus concept cung luc
- chat lien tuc nhung thieu checkpoint

### 3.2 Cap lop hoc

Canh bao duoc tao khi:

- ty le sinh vien can chu y qua cao
- xuat hien concept nghen chung cua lop
- co nhom sinh vien chua tham gia du nhiep hoc

## 4. UI

Da hien thi panel intervention moi tren:

- dashboard tracking ca nhan
- dashboard giang vien / lop hoc

## 5. Gia tri mang lai

- bien analytics thanh hanh dong
- giup san pham ro hon vai tro `ho tro hoc tap chu dong`
- tang do thuyet phuc khi demo hackathon vi khong chi do luong, ma con goi y can thiệp

## 6. Xac minh

Da them test cho:

- learner intervention alerts
- classroom intervention alerts
- su tich hop cua alerts vao learning overview
- su tich hop cua alerts vao classroom overview

Da chay:

- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
