# User Prompt — Dashboard

> Copy prompt dưới đây, dán cho agent.

---

```
Tạo trang dashboard admin cho nhà hàng, với yêu cầu:

Layout:
- Sidebar trái (nav: Tổng quan, Đơn hàng, Khách hàng, Thực đơn, Báo cáo).
- Topbar (title section + date).
- Khu nội dung chính: 4 KPI cards + bảng đơn hàng gần đây.

KPI cards (4):
- Doanh thu: 486.2M₫, +12.4% (trend up, gold)
- Đơn hàng: 1,284, +8.1% (up, gold)
- Khách hàng: 642, +3.2% (up, gold)
- Đánh giá TB: 4.8, -0.1 (down, destructive)

Mỗi card: label uppercase tracking-wide-sm + giá trị serif 2xl tabular-nums
+ trend icon (TrendingUp/Down từ lucide) + delta.

Bảng đơn hàng (4 row mẫu):
- Cột: Mã, Khách, Giờ, Số khách, Tổng, Trạng thái.
- Trạng thái: pill badge gold (Đã xác nhận / Đang phục vụ / Hoàn thành).
- Tabular-nums cho cột số.

Responsive:
- Sidebar: desktop (lg+) sticky w-60. Mobile: collapse, mở bằng Sheet side="left".
- KPI: grid 1 cột mobile, 2 cột sm, 4 cột xl.
- Bảng: overflow-x-auto + scroll-elegant trên mobile.

Theme: dark default. Dùng token semantic (bg-background, bg-card, border-border, text-muted-foreground, text-gold, text-destructive).

Đặt component tại src/components/site/admin-dashboard.tsx, export named AdminDashboard.
```

---

## Kỳ vọng agent sẽ làm

1. Đọc `component-guidelines.md` → thấy Sheet pattern cho mobile nav.
2. Dùng `<Sheet side="left">` + `<SheetTitle className="sr-only">` (a11y Radix).
3. Dùng `lucide-react` cho icon (Menu, TrendingUp, TrendingDown).
4. Grid responsive `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`.
5. Bảng `<table>` semantic + `overflow-x-auto scroll-elegant`.
6. Lint pass.

## Kỳ vọng KHÔNG làm

- ❌ Tạo table component riêng (dùng `<table>` HTML).
- ❌ Cài chart library (recharts) nếu chỉ cần KPI số — user không yêu cầu chart.
- ❌ `lg:hidden` giấu sidebar (dùng Sheet cho mobile).
- ❌ Hex color.
- ❌ Custom icon (dùng lucide).
