# User Prompt — Hero Section

> Copy prompt dưới đây, dán cho agent. Prompt tập trung vào yêu cầu nghiệp vụ,
> không lặp lại quy tắc design (system prompt + skill đã lo).

---

```
Tạo hero section cho trang chủ với yêu cầu:

Nội dung:
- Ảnh full-bleed nền (lấy từ /images/hero.png hoặc ảnh tương đương).
- Eyebrow label: "Sài Gòn · Kể từ 2019".
- Tiêu đề h1: "Vị của tĩnh lặng" (chữ "tĩnh lặng" in nghiêng, màu gold-soft).
- Đoạn mô tả: "Bảy món nếm thử theo mùa — viết lại ký ức ẩm thực Việt."
- 2 CTA: "Đặt bàn" (nút gold chính) + "Xem thực đơn" (link text có underline animation).

Yêu cầu kỹ thuật:
- Dark immersive: bg-ink + text-cream.
- Ảnh dùng next/image priority, có ken-burns animation chậm.
- Overlay gradient để đảm bảo độ tương phản text.
- CTA "Đặt bàn" mở reservation dialog (dùng useReservation()).
- CTA "Xem thực đơn" link đến #menu.
- Mobile-first: CTA stack dọc trên mobile, ngang trên sm+.
- Có cue "Cuộn xuống" ở bottom center (desktop only).

Đặt component tại src/components/site/hero.tsx, export named Hero.
```

---

## Kỳ vọng agent sẽ làm

1. Đọc `skills/ui-system/SKILL.md` + `component-guidelines.md`.
2. Kiểm tra `src/components/site/` → thấy `primitives.tsx` (Reveal, SectionLabel) và `reservation.tsx` (useReservation).
3. Dùng `<Image>` + `<Reveal>` + `bg-ink text-cream` + `animate-ken-burns`.
4. Tạo file `hero.tsx`, ≤ 250 dòng.
5. Chạy `bun run lint`.
6. Báo "xong" + tóm tắt.

## Kỳ vọng KHÔNG làm

- ❌ Tạo button primitive mới (dùng `<button>` trực tiếp vì CTA custom, không qua `<Button>` shadcn — đây là ngoại lệ hợp lý cho hero).
- ❌ Hardcode hex.
- ❌ `<img>` thay `<Image>`.
- ❌ CSS-in-JS inline.
