# Component Guidelines — Khi nào dùng component nào

> Trước khi viết markup, đọc file này. Nếu đã có component phù hợp → dùng, không tạo mới.

---

## Component có sẵn

### shadcn/ui (`src/components/ui/`)

| Component | Khi dùng | Lưu ý |
|-----------|----------|-------|
| `Button` | Mọi nút bấm | Có variant: `default`, `outline`, `ghost`, `secondary`, `link`. Mở rộng `gold` cho CTA chính. |
| `Input` | Text input, date, number | `className="h-11 bg-transparent"` cho cao cấp. |
| `Textarea` | Multi-line input | `resize-none` + `rows={2-4}`. |
| `Label` | Form label | Luôn `htmlFor` khớp `id` input. |
| `Select` | Dropdown | Dùng cho giờ, số khách, danh mục. |
| `Dialog` | Modal center-screen | Form đặt bàn, confirm. |
| `Sheet` | Drawer trượt từ cạnh | Mobile menu (`side="right"`). |
| `Tabs` | Tab ngang | Hoặc tự build với `role="tablist"` cho custom. |
| `Toast` / `useToast` | Thông báo ngắn | Sau submit, action thành công. |
| `Tooltip` | Hint nhỏ | Icon info, abbreviation. |
| `Accordion` | FAQ, collapsible | |
| `Avatar` | Ảnh user profile | |
| `Badge` | Tag nhỏ | |
| `Card` | Container có border | Ít dùng — prefer tự build `<article>` cho flexibility. |
| `Separator` | Đường phân cách ngang | Hoặc `border-t border-border/60`. |
| `ScrollArea` | Vùng scroll custom | |
| `Carousel` | Slider ảnh | Gallery, testimonial. |

### Primitive app (`src/components/site/`)

| Component | Khi dùng | Props |
|-----------|----------|-------|
| `Reveal` | Bọc mọi section content cho fade-in | `delay` (ms), `as` (tag), `className` |
| `SectionLabel` | Eyebrow label (hairline + uppercase gold) | `align` ("left"\|"center"), `children` |
| `ThemeToggle` | Nút chuyển dark/light | `className` |
| `ReservationProvider` | Context quản lý dialog đặt bàn | Wrap app. Dùng `useReservation()` để mở. |

---

## Quy tắc sử dụng

### Button

```tsx
// CTA chính (vàng)
<Button variant="gold" className="h-12 px-8">Đặt bàn</Button>

// Secondary (outline)
<Button variant="outline" className="h-11 px-7">Xem thêm</Button>

// Ghost (icon only)
<Button variant="ghost" size="icon" aria-label="Đóng"><X /></Button>

// Link button
<Button variant="link">Quên mật khẩu?</Button>
```

> **Không** tự tạo `<button className="bg-gold text-ink px-4">` — luôn qua `Button` để có focus state, disabled, variant nhất quán.

### Form field pattern

Mọi form field bọc trong helper `Field`:

```tsx
function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[0.7rem] uppercase tracking-wide-sm text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

// Dùng:
<Field label="Họ và tên" htmlFor="name">
  <Input id="name" className="h-11 bg-transparent" required />
</Field>
```

> **Lý do**: Tránh lặp Label + spacing. Nếu field xuất hiện ≥ 2 lần → tách thành component.

### Image

```tsx
import Image from "next/image";

// Fill (container relative)
<div className="relative aspect-[4/5] overflow-hidden rounded-sm">
  <Image src={img} alt="Mô tả ảnh" fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
</div>

// Width/height (ảnh standalone)
<Image src={logo} alt="Logo" width={120} height={40} />
```

> **Bắt buộc**: `alt` mô tả (không "image"), `sizes` cho responsive loading, `className="object-cover"` cho fill.

### Section structure

```tsx
<section id="feature" className="py-24 md:py-36">
  <div className="mx-auto max-w-7xl px-6 md:px-8">
    <Reveal>
      <SectionLabel>Feature</SectionLabel>
      <h2 className="mt-5 font-serif text-3xl font-light tracking-tight md:text-5xl">
        Tiêu đề
      </h2>
    </Reveal>
    <Reveal delay={120}>
      {/* nội dung */}
    </Reveal>
  </div>
</section>
```

### Block immersive (tối cả 2 theme)

```tsx
<section className="grain relative overflow-hidden bg-ink text-cream">
  <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
    {/* text dùng text-cream, accent dùng text-gold */}
  </div>
</section>
```

### Card / Article

```tsx
<article className="group">
  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
    <Image src={img} alt={name} fill sizes="..." className="object-cover transition-transform duration-700 group-hover:scale-105" />
  </div>
  <div className="mt-5">
    <h4 className="font-serif text-xl font-medium tracking-tight">{name}</h4>
    <p className="mt-1 text-[0.7rem] uppercase tracking-wide-sm text-gold">{role}</p>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{bio}</p>
  </div>
</article>
```

### Tabs (custom, cho control đầy đủ)

```tsx
<div role="tablist" aria-label="Danh mục" className="scroll-elegant flex gap-x-7 overflow-x-auto">
  {items.map((item) => (
    <button
      key={item.id}
      role="tab"
      aria-selected={active === item.id}
      onClick={() => setActive(item.id)}
      className={cn(
        "shrink-0 border-b-2 pb-4 text-left transition-colors",
        active === item.id ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground/80"
      )}
    >
      <span className="block font-serif text-lg font-medium">{item.label}</span>
    </button>
  ))}
</div>
```

> Dùng `border-b-2` thay vì `absolute` underline — tránh bị `overflow-x-auto` clip.

### Grid không void (masonry tiling)

```tsx
// Mỗi hàng tổng col-span = 12 → không khoảng trống
const SPANS = ["md:col-span-5", "md:col-span-4", "md:col-span-3", "md:col-span-4", "md:col-span-5", "md:col-span-3"];
<div className="grid auto-rows-[260px] grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
  {items.map((img, i) => (
    <figure key={i} className={cn("relative col-span-1 overflow-hidden rounded-sm", SPANS[i])}>
      <Image ... />
    </figure>
  ))}
</div>
```

> **Tránh** CSS `columns` cho masonry — sinh void khi cột cao không đều.

---

## Khi tạo component mới

**Chỉ tạo khi**: không có component trong `src/components/ui/` và `src/components/site/` đáp ứng được.

**Quy trình**:
1. Báo user: "Cần tạo component `X` vì lý do `Y`. Tạo không?".
2. Được phép → tạo file trong `src/components/site/`.
3. Đặt tên file kebab-case: `theme-toggle.tsx`, `reservation-form.tsx`.
4. Export named (không default): `export function ThemeToggle() {}`.
5. Props TypeScript interface rõ ràng.
6. ≤ 250 dòng. Vượt → tách primitive.

**Không tạo**:
- Modal/Dialog/Menu thủ công → dùng shadcn/ui (Radix).
- Button/Input/Form thủ công → dùng shadcn/ui.
- Icon tự vẽ → dùng `lucide-react`.
