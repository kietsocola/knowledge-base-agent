# Feature Report: Activity Timeline

Cap nhat: 2026-03-29

## 1. Muc tieu

Bo sung timeline hoc tap theo ngay de he thong khong chi hien thi snapshot hien tai, ma con cho thay duoc nhịp do hoc va tan suat danh gia theo thoi gian.

## 2. Giai phap

Da them mot lop aggregate moi tu bang `learning_events`:

- group theo ngay hoat dong
- dem tong su kien
- tach rieng `chat_turn_recorded`
- tach rieng `evaluation_generated`

Timeline nay duoc dua vao:

- dashboard tracking ca nhan tren trang evaluation
- dashboard giang vien/lop hoc tren trang classroom

## 3. Thanh phan ky thuat

- helper moi: `lib/learning/timeline.ts`
- type moi: `LearningTimelinePoint`
- bo sung `activityTimeline` vao:
  - `LearningOverview`
  - `ClassroomOverview`
- chart component tai su dung:
  - `components/learning/ActivityTimelineChart.tsx`

## 4. Gia tri mang lai

- cho phep demo "tracking theo thoi gian" thay vi chi la thong ke tong
- lam ro hon hanh vi hoc tap gan day
- tang do thuyet phuc cho bai toan analytics va canh bao som

## 5. Xac minh

Da them test cho timeline grouping:

- group dung theo ngay
- dem dung chat turns va evaluations
- gioi han so bucket gan nhat khi can

Da chay:

- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
