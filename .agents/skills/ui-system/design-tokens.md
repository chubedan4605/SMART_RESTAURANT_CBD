# Design Tokens — Nguồn sự thật duy nhất

> Mọi quyết định màu / font / radius / spacing phải tham chiếu file này.
> Nếu cần token mới → thêm vào đây VÀ vào `config/globals.css`, rồi mới dùng.

---

## Màu — Semantic (đổi theo theme)

| Token | Light (oklch) | Dark (oklch) | Dùng cho |
|-------|---------------|--------------|----------|
| `--background` | `0.973 0.009 81` (ivory) | `0.17 0.011 52` (espresso) | Nền trang |
| `--foreground` | `0.22 0.012 55` (charcoal) | `0.92 0.014 82` (cream) | Text chính |
| `--card` | `0.988 0.005 85` | `0.21 0.012 52` | Nền card |
| `--card-foreground` | `0.22 0.012 55` | `0.92 0.014 82` | Text trong card |
| `--popover` | `0.988 0.005 85` | `0.21 0.012 52` | Nền popover/dialog |
| `--primary` | `0.22 0.012 55` | `0.92 0.014 82` | Button chính |
| `--primary-foreground` | `0.973 0.009 81` | `0.17 0.011 52` | Text trên primary |
| `--secondary` | `0.945 0.012 80` | `0.26 0.012 52` | Nền phụ |
| `--muted` | `0.945 0.012 80` | `0.25 0.012 52` | Nền muted |
| `--muted-foreground` | `0.48 0.018 60` | `0.70 0.016 75` | Text phụ, label |
| `--accent` | `0.935 0.014 78` | `0.30 0.014 52` | Nền accent |
| `--border` | `0.90 0.012 75` | `0.32 0.012 55` | Viền, divider |
| `--destructive` | `0.55 0.16 28` | `0.62 0.17 25` | Lỗi, xóa |

**Cách dùng trong code:**
```tsx
<div className="bg-background text-foreground border border-border">
<p className="text-muted-foreground">text phụ</p>
```

---

## Màu — Brand (cố định cả 2 theme)

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `--gold` | Light `0.68 0.095 80` / Dark `0.76 0.10 82` | CTA, accent, eyebrow, focus ring |
| `--gold-soft` | `0.82 0.06 85` / `0.86 0.06 85` | Hover CTA |
| `--ink` | `0.17 0.011 52` (luôn tối) | Block immersive (hero, footer, experience) |
| `--cream` | `0.965 0.009 81` (luôn sáng) | Text trên block ink |
| `--olive` | `0.52 0.06 130` / `0.66 0.07 130` | Accent phụ (chay/garden) |
| `--burgundy` | `0.42 0.11 25` / `0.58 0.13 25` | Accent phụ (rượu/dessert) |

**Cách dùng:**
```tsx
<button className="bg-gold text-ink hover:bg-gold-soft">CTA</button>
<section className="bg-ink text-cream">block immersive</section>
<span className="text-gold">accent</span>
```

> **Quy tắc**: `--ink` và `--cream` KHÔNG đổi theo theme. Đây là quyết định có chủ đích — block immersive (hero, tasting experience, footer) giữ "sân khấu tối" ở cả 2 theme để duy trì narrative.

---

## Typography

| Role | Font | Class | Size | Weight | Tracking |
|------|------|-------|------|--------|----------|
| H1 (hero) | Cormorant | `font-serif` | `text-5xl md:text-7xl lg:text-[5.5rem]` | `font-light` | `tracking-tight` |
| H2 (section) | Cormorant | `font-serif` | `text-3xl md:text-5xl` | `font-light` | `tracking-tight` |
| H3 (subsection) | Cormorant | `font-serif` | `text-xl md:text-2xl` | `font-medium` | `tracking-tight` |
| H4 (item) | Cormorant | `font-serif` | `text-lg` | `font-medium` | `tracking-tight` |
| Body large | Inter | `font-sans` | `text-base md:text-lg` | `font-normal` | normal |
| Body | Inter | `font-sans` | `text-sm` | `font-normal` | normal |
| Eyebrow | Inter | `font-sans` | `text-[0.7rem]` | `font-medium` | `tracking-luxe` (0.32em) |
| Label | Inter | `font-sans` | `text-[0.62rem]` | `font-normal` | `tracking-wide-sm` (0.18em) |
| Price | Cormorant | `font-serif` | `text-lg md:text-xl` | `font-medium` | `tabular-nums` |

**Font setup** (trong `layout.tsx`):
```tsx
import { Cormorant_Garamond, Inter } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
```

---

## Radius

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `--radius` | `0.25rem` | Mặc định (góc gần vuống — sang trọng) |
| `--radius-sm` | `calc(var(--radius) - 4px)` | Chip, badge nhỏ |
| `--radius-md` | `calc(var(--radius) - 2px)` | Input, button |
| `--radius-lg` | `var(--radius)` | Card |
| `rounded-full` | — | CHỈ CTA, avatar, pill badge |

> **Quy tắc**: KHÔNG dùng `rounded-full` ngoài CTA. Góc gần vuống (`rounded-sm`/`rounded-md`) tạo cảm giác cao cấp, không "bubble".

---

## Spacing

| Context | Class |
|---------|-------|
| Section padding | `py-24 md:py-36` |
| Container | `max-w-7xl px-6 md:px-8` |
| Card padding | `p-4` hoặc `p-6` |
| Grid gap | `gap-4` / `gap-6` / `gap-10` |
| Stack gap (flex col) | `gap-4` / `gap-6` |
| Element margin (heading → body) | `mt-5` / `mt-7` |

> **Quy tắc**: Dùng scale Tailwind chuẩn. KHÔNG giá trị lạ (`gap-[23px]`).

---

## Shadow

| Class | Dùng cho |
|-------|----------|
| `shadow-xs` | Button, input (mặc định shadcn) |
| `shadow-sm` | Card |
| `shadow-lg` | Dialog, popover |
| `shadow-2xl` | Ảnh nổi (overlay) |
| `shadow-[0_8px_30px_-8px_rgba(201,169,97,0.5)]` | Hover CTA gold (custom) |

> **Quy tắc**: Shadow nhẹ. Tránh `shadow-2xl` ngoài overlay ảnh — shadow nặng làm mất cảm giác tinh tế.

---

## Breakpoint

| Prefix | Min-width | Thiết bị |
|--------|-----------|----------|
| (mặc định) | 0 | Mobile |
| `sm:` | 640px | Mobile lớn / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop nhỏ |
| `xl:` | 1280px | Desktop |

> **Quy tắc**: Mobile-first. Viết mobile trước, thêm `md:` / `lg:` cho enhancement. KHÔNG `lg:hidden` để giấu mobile.

---

## Custom utility (đã có sẵn trong globals.css)

| Class | Tác dụng |
|-------|----------|
| `font-serif` | Dùng font Cormorant |
| `tracking-luxe` | letter-spacing 0.32em (eyebrow) |
| `tracking-wide-sm` | letter-spacing 0.18em (label) |
| `hairline` | Sợi chia vàng mờ (section divider) |
| `grain` | Texture noise cho block immersive |
| `scroll-elegant` | Scrollbar vàng mờ cho list/tabs |
| `reveal` / `is-visible` | Animation fade-up (dùng qua `<Reveal>`) |
| `nav-underline` | Underline animation cho nav link |
| `animate-ken-burns` | Zoom chậm cho hero image |
