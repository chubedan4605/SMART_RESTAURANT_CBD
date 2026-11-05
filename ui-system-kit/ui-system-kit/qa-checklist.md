# QA Checklist — Kiểm soát chất lượng UI

> Chạy checklist này sau khi agent báo "xong". Đánh dấu ✅ cho mỗi mục đạt.
> Nguồn: 6 trụ nhất quán — visual / responsive / a11y / semantic / reuse / no-invent.

---

## 1. Visual Consistency

```
□ Không có hex/rgb hardcode
  → Kiểm tra: grep -rnE "#[0-9a-fA-F]{3,8}\b|rgb\(" src/
  → Trừ file config token (globals.css), KHÔNG chấp nhận ở component

□ Mọi màu đến từ token
  → bg-background, text-foreground, text-gold, bg-ink, text-cream, border-border
  → KHÔNG bg-amber-500, text-blue-600 (color Tailwind mặc định)

□ Typography đúng role
  → Heading: font-serif, font-light, tracking-tight
  → Body: font-sans (mặc định)
  → Eyebrow: text-[0.7rem] uppercase tracking-luxe text-gold

□ Spacing dùng scale Tailwind
  → gap-4 / gap-6 / gap-10, p-4 / p-6, py-24 md:py-36
  → KHÔNG gap-[23px] hay giá trị lạ

□ Radius nhất quán
  → rounded-sm / rounded-md (góc gần vuống, sang trọng)
  → rounded-full CHỈ cho CTA / avatar / pill badge
```

## 2. Responsive Behavior

```
□ Test 3 viewport
  → Mobile: 390px (iPhone 14)
  → Tablet: 768px (iPad)
  → Desktop: 1440px

□ Không horizontal scroll ở mobile
  → Kiểm tra: mở DevTools, xem không có thanh cuộn ngang

□ Touch target ≥ 44px
  → Mọi button/link interactive: h-11 (44px) tối thiểu
  → Icon-only button: size-11

□ Menu mobile dùng Sheet/Drawer
  → KHÔNG overflow:hidden để giấu menu

□ Tabs/danh sách dài cuộn ngang ở mobile
  → overflow-x-auto + class scroll-elegant
  → shrink-0 cho từng tab item

□ Grid không vỡ
  → grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  → KHÔNG grid-cols-3 cố định (vỡ mobile)
```

## 3. Accessibility

```
□ Tương phản đủ
  → Text trên dark: opacity ≥ 0.75 (text-cream/75 tối thiểu)
  → Text trên light: opacity ≥ 0.7
  → Kiểm tra: Chrome DevTools → Lighthouse → Accessibility

□ Mọi ảnh có alt mô tả
  → alt="Phòng ăn chính dưới ánh nến" (mô tả)
  → KHÔNG alt="image", alt="", hoặc bỏ alt

□ Interactive có aria-label khi text không đủ
  → Icon-only button: aria-label="Mở menu"
  → Tab: role="tab", aria-selected

□ Form accessibility
  → <Label htmlFor="x"> khớp <Input id="x">
  → required cho trường bắt buộc
  → inputMode="tel" / "email" cho SĐT/email (mobile hiện bàn phím đúng)

□ Keyboard navigation
  → Tab qua được mọi control theo thứ tự logic
  → Enter submit form, Space toggle button
  → Esc đóng dialog/sheet
  → Focus visible (outline-ring)
```

## 4. Semantic HTML

```
□ Cấu trúc semantic
  → <main> duy nhất, <header>, <footer>
  → <section> có id cho anchor nav
  → <article> cho nội dung độc lập (dish, chef, testimonial)
  → <nav> cho điều hướng
  → <address> cho địa chỉ liên hệ
  → <figure> + <figcaption> cho ảnh có chú thích

□ Heading hierarchy
  → <h1> duy nhất mỗi trang
  → <h2> cho section heading
  → <h3> cho subsection
  → KHÔNG nhảy cấp (h2 → h4)

□ Button vs Link đúng
  → <button> cho action (submit, toggle, open dialog)
  → <a href> cho navigation (chuyển trang, anchor)
  → KHÔNG <div onClick> cho interactive
```

## 5. Reusability

```
□ Không tạo component mới nếu đã có
  → Kiểm tra src/components/ui/ (shadcn/ui)
  → Kiểm tra src/components/site/ (primitive app)
  → Nếu đã có Input/Button/Dialog → dùng, không tạo lại

□ Component mới có props rõ ràng
  → TypeScript interface cho props
  → Không hardcode nội dung trong component tái sử dụng
  → Truyền dữ liệu qua props/children

□ Primitive được tái dùng, không copy-paste
  → <Reveal>, <SectionLabel> import từ @/components/site/primitives
  → KHÔNG copy logic Reveal vào mỗi file

□ Mỗi file ≤ 250 dòng
  → Vượt → tách primitive / sub-component
  → Giữ file dễ đọc, dễ review
```

## 6. Không phát minh token / component / dependency

```
□ Không thêm dependency mà không cần
  → Kiểm tra package.json trước khi import thư viện mới
  → Ưu tiên: framer-motion (animation), lucide-react (icon), radix (primitive)
  → Nếu cần thêm → hỏi user trước

□ Không tạo token màu mới
  → Token phải có trong skills/ui-system/design-tokens.md
  → Nếu cần token mới → thêm vào design-tokens.md VÀ globals.css trước, rồi mới dùng

□ Không tạo utility class mới
  → Utility phải có trong globals.css
  → Nếu cần → thêm vào globals.css, không inline style

□ Nếu agent muốn thêm bất kỳ cái trên → phải hỏi user trước
  → Ví dụ output: "Cần thêm token --olive cho accent mới. Thêm vào design-tokens.md không?"
```

---

## Tự động hóa kiểm tra (tuỳ chọn)

### Lớp 1: Tĩnh (ESLint)
```bash
bun run lint
```
Bắt: unused import, semantic HTML cơ bản, a11y rules của Next.js.

### Lớp 2: Runtime (Agent Browser / Playwright)
```bash
agent-browser open http://localhost:3000
agent-browser screenshot /tmp/shot.png
agent-browser errors   # console errors
```
Bắt: hydration mismatch, runtime error, blank page.

### Lớp 3: Visual (VLM)
```bash
z-ai vision -p "Screenshot of a website. Check: (1) watermarks? (2) text contrast readable? (3) layout breaks/voids? (4) premium feel 1-10? Be concise." -i /tmp/shot.png
```
Bắt: lỗi mắt người khó thấy (watermark ảnh, void grid, tương phản thấp).

---

## Định nghĩa "Done"

Task chỉ được báo "xong" khi:
- ✅ Tất cả 6 trụ checklist pass
- ✅ `bun run lint` sạch (không warning)
- ✅ Agent Browser mở trang không có console error
- ✅ VLM chấm ≥ 7/10 visual quality
- ✅ Không có hex hardcode trong component (trừ config token)
