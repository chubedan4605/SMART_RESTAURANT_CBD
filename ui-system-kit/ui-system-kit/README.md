# UI System Kit — Bộ công cụ cho AI Agent tạo UI nhất quán

Bộ kit này chứa toàn bộ artifact cần thiết để một AI agent (như Z.ai Code, Claude, Cursor) tạo giao diện **nhất quán theo một UI system duy nhất**. Kit được thiết kế cho stack **Next.js (App Router) + Tailwind CSS + shadcn/ui + Radix**, nhưng nguyên tắc áp dụng được cho mọi React app.

---

## Cấu trúc kit

```
ui-system-kit/
├── README.md                      ← Bạn đang đọc file này
├── system-prompt.md               ← System prompt cho UI agent (paste vào cấu hình agent)
├── qa-checklist.md                ← Checklist kiểm soát chất lượng sau khi agent sinh code
│
├── skills/
│   └── ui-system/
│       ├── SKILL.md               ← Entry point agent đọc đầu tiên
│       ├── design-tokens.md       ← Bảng token: màu / font / radius / spacing
│       ├── component-guidelines.md← Danh sách component + khi nào dùng
│       ├── ux-accessibility.md    ← Quy tắc responsive + a11y
│       ├── examples/
│       │   ├── prompt-hero.md     ← Prompt mẫu → output kỳ vọng (few-shot)
│       │   ├── prompt-form.md
│       │   └── prompt-dashboard.md
│       └── templates/
│           └── section.tsx        ← Boilerplate section agent dùng làm điểm khởi đầu
│
├── config/
│   ├── globals.css                ← Tailwind v4 + token CSS (copy vào src/app/)
│   ├── tailwind.config.ts         ← Tailwind v3 tương đương (dự án cũ)
│   ├── layout.tsx                 ← Next.js layout: fonts + ThemeProvider
│   └── theme-provider.tsx         ← Wrapper next-themes + transition mượt
│
├── components/
│   ├── primitives.tsx             ← Reveal, SectionLabel, formatPrice (primitive nội bộ)
│   └── reservation-form.tsx       ← Component mẫu hoàn chỉnh (form + toast)
│
└── prompts/
    ├── user-prompt-hero.md        ← User prompt mẫu yêu cầu tạo hero
    ├── user-prompt-form.md        ← User prompt mẫu yêu cầu tạo form
    └── user-prompt-dashboard.md   ← User prompt mẫu yêu cầu tạo dashboard
```

---

## Cách sử dụng — 4 bước

### Bước 1: Cài đặt skill vào dự án

Copy thư mục `skills/ui-system/` vào gốc dự án:

```bash
cp -r skills/ui-system/ /path/to/your-project/skills/ui-system/
```

Skill là **tài liệu tham khảo** — agent đọc theo cần, không phải code chạy.

### Bước 2: Cài đặt config + components

Copy các file config vào đúng vị trí trong dự án Next.js:

```bash
cp config/globals.css        /path/to/your-project/src/app/globals.css
cp config/layout.tsx         /path/to/your-project/src/app/layout.tsx
cp config/theme-provider.tsx /path/to/your-project/src/components/theme-provider.tsx
mkdir -p /path/to/your-project/src/components/site
cp components/primitives.tsx /path/to/your-project/src/components/site/primitives.tsx
```

> Nếu dự án dùng Tailwind v3 (không có `@import "tailwindcss"`), dùng `config/tailwind.config.ts` thay vì `globals.css` cho phần token.

### Bước 3: Cấu hình agent với system prompt

Mở `system-prompt.md`, copy toàn bộ nội dung, dán vào:
- **Z.ai Code / Cursor**: phần system prompt hoặc `.cursorrules` / `CLAUDE.md`
- **API (OpenAI/Anthropic)**: tham số `system` khi gọi chat completion
- **Custom agent**: file config system prompt của framework

System prompt **ngắn và ổn định** — không nhét design system vào đây, chỉ trỏ tới skill.

### Bước 4: Viết user prompt + yêu cầu agent tuân thủ

Khi giao task UI cho agent, viết prompt tập trung vào **yêu cầu nghiệp vụ**, không lặp lại quy tắc design (system prompt + skill đã lo). Xem mẫu trong `prompts/`.

---

## Phân biệt trách nhiệm — cái gì đặt ở đâu

| Lớp | File / Vị trí | Nội dung | Khi đổi |
|-----|---------------|----------|---------|
| **System prompt** | `system-prompt.md` → cấu hình agent | Vai trò, workflow, nguyên tắc cứng | Hiếm |
| **Skill** | `skills/ui-system/*.md` | Design tokens, component rules, UX checklist | Khi DS tiến hóa |
| **Source code** | `src/components/ui/*`, `src/components/site/*` | Implementation thực tế | Mỗi feature |
| **Tailwind config** | `config/globals.css` hoặc `tailwind.config.ts` | Map token → utility | Khi thêm token |
| **User prompt** | `prompts/*.md` | Yêu cầu cụ thể | Mỗi task |

> **Nguyên tắc vàng**: System prompt = "cách agent hành xử". Skill = "sách tham khảo". Source code = "sự thật đang chạy". Không trộn lẫn.

---

## Quy trình làm việc khuyến nghị

```
User viết prompt (prompts/*.md)
        ↓
Agent đọc system-prompt.md (luật)
        ↓
Agent đọc skills/ui-system/SKILL.md (entry point)
        ↓
Agent đọc design-tokens.md + component-guidelines.md (theo cần)
        ↓
Agent kiểm tra src/components/ui + src/components/site (component có sẵn?)
        ↓
Agent sinh code theo token + primitive
        ↓
Agent chạy bun run lint
        ↓
Bạn chạy qa-checklist.md (6 trụ: visual / responsive / a11y / semantic / reuse / no-invent)
        ↓
✅ Giao diện nhất quán
```

---

## Điều kiện tiên quyết (giả định)

- **Next.js 14/15/16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (khuyến nghị) hoặc v3
- **shadcn/ui** đã init + add các component cơ bản (button, input, label, dialog, sheet, select, textarea, toast)
- **next-themes** đã cài (`bun add next-themes`)
- **framer-motion** + **lucide-react** đã cài
- Fonts Google: **Cormorant Garamond** + **Inter** (hoặc thay bằng serif/sans tương đương)

Nếu thiếu, chạy:
```bash
bun add next-themes framer-motion lucide-react
npx shadcn@latest init
npx shadcn@latest add button input label dialog sheet select textarea toast
```

---

## Tùy chỉnh cho thương hiệu của bạn

Kit này dùng palette "fine dining" (ivory/charcoal/champagne-gold light; espresso/cream/copper dark). Để đổi sang thương hiệu khác:

1. **Đổi token màu** trong `config/globals.css` (phần `:root` và `.dark`) — giữ nguyên **tên token**, chỉ đổi giá trị oklch.
2. **Đổi font** trong `config/layout.tsx` (import font Google khác) + `SKILL.md` (cập nhật tên font).
3. **Đổi direction words** trong `skills/ui-system/SKILL.md` (phong cách hình ảnh).
4. Giữ nguyên **cấu trúc token + quy tắc component + checklist** — đây là xương sống nhất quán.

---

## Kiểm tra nhanh sau cài đặt

Sau khi cài xong, yêu cầu agent tạo một section đơn giản:

```
Tạo section "Giới thiệu" cho trang chủ: heading + 1 đoạn mô tả + 2 nút CTA.
```

**Kỳ vọng output đúng**:
- Dùng `<Reveal>` + `<SectionLabel>` từ `@/components/site/primitives`
- Dùng `font-serif` cho heading, `bg-background` / `text-foreground` cho nền/text
- Dùng `<Button>` của shadcn/ui
- Semantic `<section>`, có `id`
- Mobile-first, `py-24 md:py-36`

**Nếu agent ra output khác** (hex hardcoded, tự tạo `<div className="bg-#f5f1ea">`, không dùng primitive) → system prompt chưa được agent nhận đúng. Kiểm tra lại Bước 3.

---

## Giấy phép

Bộ kit này dùng nội bộ. Tự do sửa đổi cho dự án của bạn. Token màu và font lấy cảm hứng từ palette fine-dining, không gắn với thương hiệu thật nào.
