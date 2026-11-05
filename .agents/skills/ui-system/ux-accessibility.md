# UX & Accessibility — Quy tắc bắt buộc

> Đọc file này trước khi báo "xong". Mỗi mục là checklist, không phải gợi ý.

---

## Responsive

### Nguyên tắc mobile-first

- Viết CSS cho mobile trước, thêm `sm:` / `md:` / `lg:` cho enhancement.
- KHÔNG dùng `lg:hidden` để giấu element mobile — đó là desktop-first.

### Breakpoint test

Test ở 3 viewport tối thiểu:
- **Mobile**: 390px (iPhone 14)
- **Tablet**: 768px (iPad)
- **Desktop**: 1440px

### Touch target

- Mọi button/link interactive: `h-11` (44px) tối thiểu.
- Icon-only button: `size-11`.
- KHÔNG `h-8` cho nút chính (quá nhỏ cho ngón tay).

### Navigation mobile

- Menu desktop: `hidden lg:flex`.
- Menu mobile: dùng `<Sheet side="right">` (Radix), KHÔNG `overflow:hidden` giấu div.
- Sau click nav item → đóng sheet (`setOpen(false)`).

### Tabs / list dài

```tsx
<div className="scroll-elegant flex gap-x-7 overflow-x-auto">
  {items.map(... => <button className="shrink-0">...</button>)}
</div>
```

- `overflow-x-auto` + `shrink-0` cho item → cuộn ngang mượt.
- `scroll-elegant` cho scrollbar vàng mờ.

### Grid responsive

```tsx
// ✅ Đúng
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// ❌ Sai (vỡ mobile)
<div className="grid grid-cols-3 gap-6">
```

### Không horizontal scroll

- Mở DevTools mobile → KHÔNG có thanh cuộn ngang.
- Nguyên nhân phổ biến: ảnh quá rộng, `w-screen` lạm dụng, `whitespace-nowrap` sai chỗ.

---

## Accessibility (a11y)

### Semantic HTML

| Element | Dùng cho |
|---------|----------|
| `<main>` | Nội dung chính, duy nhất mỗi trang |
| `<header>` | Đầu trang (logo + nav) |
| `<nav>` | Khối điều hướng |
| `<section>` | Section có id cho anchor |
| `<article>` | Nội dung độc lập (dish, chef, post) |
| `<aside>` | Sidebar, nội dung phụ |
| `<footer>` | Cuối trang |
| `<address>` | Địa chỉ liên hệ |
| `<figure>` + `<figcaption>` | Ảnh có chú thích |
| `<blockquote>` | Trích dẫn |
| `<time>` | Ngày giờ |

### Heading hierarchy

- `<h1>` duy nhất mỗi trang (thường là hero title).
- `<h2>` cho section heading.
- `<h3>` cho subsection / item title.
- `<h4>` cho sub-item.
- KHÔNG nhảy cấp (h2 → h4). KHÔNG dùng heading cho style (dùng `font-serif text-xl`).

### Button vs Link

- `<button>` cho **action**: submit form, toggle, open dialog, copy.
- `<a href>` cho **navigation**: chuyển trang, anchor (`#section`).
- KHÔNG `<div onClick>` cho interactive — không accessible.
- KHÔNG `<a href="#" onClick>` cho action — dùng `<button>`.

### Form a11y

```tsx
<div className="space-y-1.5">
  <Label htmlFor="email" className="text-[0.7rem] uppercase tracking-wide-sm text-muted-foreground">
    Email
  </Label>
  <Input id="email" type="email" required inputMode="email" className="h-11 bg-transparent" />
</div>
```

- `<Label htmlFor>` LUÔN khớp `<Input id>`.
- `required` cho trường bắt buộc.
- `inputMode="tel"` / `"email"` / `"numeric"` cho mobile hiện bàn phím đúng.
- `type="email"` / `"tel"` / `"date"` cho validation native.
- Error message: `aria-describedby` trỏ tới `<p id="error">`.

### Alt text

```tsx
// ✅ Mô tả
<Image alt="Phòng ăn chính TỊNH dưới ánh nến" ... />

// ❌ Kém
<Image alt="image" ... />
<Image alt="" ... />  // chỉ khi ảnh trang trí
<Image alt="TỊNH" ... />  // không mô tả
```

- Mô tả **nội dung + ngữ cảnh**, không chỉ tên.
- Ảnh trang trí (decorative): `alt=""` (screen reader bỏ qua).
- Ảnh có thông tin: alt đầy đủ.

### aria-label & aria-*

- Icon-only button: `aria-label="Mở menu"`.
- Tab: `role="tab"`, `aria-selected={isActive}`.
- Dialog: tự có từ Radix (DialogTitle, DialogDescription).
- Liveregion (toast): Radix Toast đã có `role="status"`.

### Tương phản (contrast)

- Text trên dark: opacity tối thiểu `0.75` (`text-cream/75`).
- Text trên light: opacity tối thiểu `0.7` (`text-foreground/70`).
- Eyebrow gold trên dark: `text-gold` (đủ), tránh `text-gold/50` (quá mờ).
- Kiểm tra: Chrome DevTools → Lighthouse → Accessibility score ≥ 90.

### Keyboard navigation

- Tab qua được mọi control theo thứ tự logic (không skip).
- Enter submit form.
- Space toggle button/checkbox.
- Esc đóng dialog/sheet/popover (Radix lo).
- Focus visible: `outline-ring` (không `outline-none` trừ khi có replacement).
- Focus trap trong dialog (Radix lo).

### Motion & animation

- Reveal: `0.9s cubic-bezier(0.22, 1, 0.36, 1)` — chậm, mượt.
- Hover: `duration-300` đến `duration-700`.
- KHÔNG `animate-spin` ngoài loading.
- Tôn trọng `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; }
  .animate-ken-burns { animation: none; }
}
```

---

## Loading & Empty state

- Loading: skeleton (`<Skeleton>`) hoặc spinner đơn giản, KHÔNG blank.
- Empty: message rõ ràng + CTA (ví dụ: "Chưa có đơn hàng → Đặt bàn ngay").
- Error: message + nút retry, KHÔNG chỉ stack trace.

---

## Performance

- `<Image>` luôn có `sizes` để Next.js tối ưu srcset.
- `loading="lazy"` cho ảnh dưới fold (mặc định Next.js).
- `priority` cho hero image (LCP).
- Tránh `next/dynamic` cho component trên fold (chậm hydration).
- Font: `display: "swap"` (đã có trong layout.tsx).
