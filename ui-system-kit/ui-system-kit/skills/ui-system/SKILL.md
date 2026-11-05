---
name: ui-system
description: Hệ thiết kế cho ứng dụng React/Next.js + Tailwind + shadcn/ui. Dùng khi tạo, sửa, hoặc review giao diện trong src/components/site.
---

# UI System — Hệ thiết kế chuẩn

## Phong cách hình ảnh (Visual direction)

```
Phong cách: cao cấp, tối giản, giàu tính trải nghiệm, editorial.
Từ khóa: restraint, chiaroscuro, champagne-gold & charcoal, typography-led.
Tránh: gradient lòe loẹt, bo góc quá mức, shadow nặng, icon dư thừa,
       animation phô trương, template AI đại trà.
```

## Đọc theo thứ tự khi cần

| Khi nào | Đọc file |
|---------|----------|
| Bắt đầu task UI | `SKILL.md` (file này) |
| Chọn màu / font / radius / spacing | `design-tokens.md` |
| Trước khi viết markup / tạo component | `component-guidelines.md` |
| Trước khi báo "xong" | `ux-accessibility.md` |

## DO

- Dùng token: `bg-background`, `text-foreground`, `text-gold`, `bg-ink`, `text-cream`, `font-serif`, `font-sans`.
- Bọc section trong `<Reveal>` + `<SectionLabel>` (từ `@/components/site/primitives`).
- Dùng `<Image>` của `next/image`, có `alt` mô tả + `sizes`.
- Semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`, `<address>`, `<figure>`.
- Mobile-first. Touch target ≥ `h-11`. Tabs mobile: `overflow-x-auto` + `scroll-elegant`.
- Dùng component shadcn/ui (Radix) cho dialog/menu/select — không tự tạo.
- Mỗi file ≤ 250 dòng. Vượt → tách primitive.

## DON'T

- Không hardcode hex/rgb (`#f5f1ea`) hoặc color Tailwind mặc định (`bg-amber-500`).
- Không tự viết modal/dialog/menu thủ công bằng `<div fixed>`.
- Không dùng `<img>` (dùng `<Image>`).
- Không `<div onClick>` cho interactive — dùng `<button>` hoặc `<a>`.
- Không tạo component mới nếu `src/components/ui/` hoặc `src/components/site/` đã có.
- Không thêm dependency / token / utility mới mà không hỏi user.
- Không nhét `rounded-full` ngoài CTA / avatar / pill badge.

## Cấu trúc section chuẩn

Mọi section theo pattern:

```tsx
<section id="anchor" className="py-24 md:py-36">
  <div className="mx-auto max-w-7xl px-6 md:px-8">
    <Reveal>
      <SectionLabel>Tên eyebrow</SectionLabel>
      <h2 className="mt-5 font-serif text-3xl font-light tracking-tight md:text-5xl">
        Tiêu đề section
      </h2>
    </Reveal>
    <Reveal delay={120}>
      {/* nội dung */}
    </Reveal>
  </div>
</section>
```

## Block immersive (tối ở cả 2 theme)

Khi cần "sân khấu tối" (hero, footer, experience):

```tsx
<section className="grain relative overflow-hidden bg-ink text-cream">
  {/* nội dung dùng text-cream, text-gold cho accent */}
</section>
```

`bg-ink` và `text-cream` là token cố định — không đổi theo theme.

## Palette tóm tắt

- **Light**: nền ivory ấm, đen than, điểm nhấn vàng champagne.
- **Dark**: nền espresso/charcoal, chữ kem, điểm nhấn đồng cổ.
- **Brand (cố định)**: `--gold` (CTA/accent), `--ink` (block tối), `--cream` (text trên ink).

Chi tiết đầy đủ: `design-tokens.md`.

## Fonts

- **Serif** (Cormorant Garamond): tiêu đề, giá, quote. `font-serif`, `font-light`.
- **Sans** (Inter): body, label, button. Mặc định `font-sans`.
- **Eyebrow**: `text-[0.7rem] uppercase tracking-luxe text-gold`.

## Khi không chắc

- Hỏi user trước khi: tạo component mới, thêm dependency, đổi token, đổi cấu trúc thư mục.
- Ưu tiên tái sử dụng > tạo mới.
