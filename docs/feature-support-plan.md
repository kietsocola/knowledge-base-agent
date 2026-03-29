# Ke Hoach Tinh Nang Moi: Support Plan Sau Danh Gia

Cap nhat: 2026-03-28

## 1. Van de

Trang evaluation hien tai da co:

- diem tong the
- radar chart
- diem manh
- diem yeu
- recommended topics

Nhung van chua tra loi ro cau hoi quan trong nhat cua nguoi hoc:

- vay toi can duoc ho tro nhu the nao ngay bay gio?

## 2. Muc tieu tinh nang

Bo sung mot khoi `Phuong an ho tro de xuat` tren trang evaluation de:

- chuyen ket qua danh gia thanh hanh dong cu the
- the hien gia tri "ho tro" thay vi chi "nhan xet"
- lam ro hon dinh huong san pham learning copilot

## 3. Cach lam

Tinh nang se suy luan support plan tu `EvaluationResult` hien co, khong can thay doi schema.

Input:

- `overallScore`
- `gaps`
- `recommendedTopics`

Output:

- muc do uu tien ho tro
- thong diep tong quat
- danh sach hanh dong de xuat
- co nen khuyen nghi trao doi voi giang vien hay khong

## 4. Rule nghiep vu

### Muc cao

Dieu kien:

- `overallScore < 5`
- hoac `gaps.length >= 3`

Hanh vi:

- muc uu tien cao
- khuyen nghi tao cau hoi cu the de trao doi voi giang vien
- uu tien on lai cac chu de trong `recommendedTopics`

### Muc trung binh

Dieu kien:

- `overallScore < 7.5`
- hoac co `gaps`

Hanh vi:

- muc uu tien trung binh
- khuyen nghi tu on co huong dan
- tiep tuc chat them de lap lo hong kien thuc

### Muc thap

Dieu kien:

- diem kha tot va it lo hong kien thuc

Hanh vi:

- muc uu tien thap
- tiep tuc mo rong bai tap va ung dung

## 5. Tieu chi hoan thanh

- co helper thuan de sinh support plan
- co testcase cho 3 muc ho tro
- trang evaluation hien thi support plan ro rang
- test pass, typecheck pass, build pass

## 6. Loi ich cho bai thi

- tang tinh ung dung
- tang tinh hieu qua
- sat hon voi bai toan "co phuong an ho tro"
- giup ban giam khao thay day khong chi la chatbot, ma la he thong dong hanh hoc tap

