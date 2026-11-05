# User Prompt — Form (Reservation)

> Copy prompt dưới đây, dán cho agent.

---

```
Tạo form đặt bàn cho trang, với yêu cầu:

Trường:
- Họ và tên (text, required)
- Số điện thoại (tel, required, inputMode tel)
- Giờ (select: 18:00, 18:30, 19:00, 19:30, 20:00)
- Số khách (select: 1-8)
- Ghi chú (textarea, tuỳ chọn)

Hành vi:
- Sau submit → hiện toast "Đã ghi nhận yêu cầu đặt bàn" + tóm tắt (tên, số khách, giờ, SĐT).
- Reset form sau khi submit thành công.
- Validate: không submit nếu tên hoặc SĐT trống.

Layout:
- Center alignment, max-w-2xl.
- Responsive: 1 cột mobile, 2 cột desktop cho cặp tên/SĐT.
- Eyebrow "Đặt bàn" + heading serif "Để chúng tôi giữ bàn cho bạn."
- Submit button gold, full-width, h-12.

Yêu cầu kỹ thuật:
- Dùng Input, Label, Textarea, Select, Button của shadcn/ui.
- Dùng useToast cho thông báo.
- Bọc trong <Reveal> + <SectionLabel align="center">.
- Touch target ≥ h-11.

Đặt component tại src/components/site/reservation-form.tsx, export named ReservationForm.
```

---

## Kỳ vọng agent sẽ làm

1. Đọc `component-guidelines.md` → thấy pattern Form field (Field helper).
2. Dùng `<Button variant="gold">` → nếu `gold` chưa có trong buttonVariants, **hỏi user** trước khi thêm.
3. Tạo file `reservation-form.tsx`.
4. `Field` là helper nội bộ (không tách file).
5. Lint pass.

## Kỳ vọng KHÔNG làm

- ❌ Tạo system notification riêng (dùng `useToast`).
- ❌ Tạo modal riêng (form inline, không dialog).
- ❌ Custom select (dùng shadcn/ui Select).
- ❌ Form library (react-hook-form) nếu form đơn giản — useState đủ.
