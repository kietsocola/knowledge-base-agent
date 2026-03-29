# Feature Report: Planner Flow

Cap nhat: 2026-03-29

## 1. Muc tieu

Bo sung `planner flow` de san pham tien gan hon toi mo hinh `AI multi-step learning copilot`, thay vi chi dung lai o chat + analytics + canh bao.

## 2. Giai phap

Da them mot study planner engine sinh ke hoach hoc tiep theo dua tren:

- `evaluation result`
- `learning overview`
- `support plan`
- `focus concepts`

Planner sinh ra:

- horizon cua ke hoach
- tom tat muc tieu
- 3 buoc hoc theo agent
- prompt goi y cho phien hoc tiep theo
- tin hieu thanh cong de biet khi nao ke hoach co hieu qua

## 3. Cau truc agent trong planner

Planner flow hien thi ro 3 vai:

- `Diagnosis Agent`
- `Planner Agent`
- `Tutor Agent`

Muc tieu la cho thay san pham khong chi phan tich hien trang, ma con de xuat chuoi hanh dong hoc tap co thu tu.

## 4. UI

Da bo sung panel moi tren trang evaluation:

- ten ke hoach
- 3 buoc hoc
- prompt goi y
- success signal

## 5. Gia tri mang lai

- tang tinh thuyet phuc cho pitch `multi-agent learning copilot`
- giup nguoi hoc biet hoc gi tiep theo, theo thu tu nao
- bien insight thanh lo trinh hanh dong co cau truc

## 6. Xac minh

Da them test cho:

- remediation-first plan
- expansion plan cho nguoi hoc manh hon

Da chay:

- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
