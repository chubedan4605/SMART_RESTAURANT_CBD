# Example: Hero Section

## User prompt

```
Tạo hero section cho trang chủ: ảnh full-bleed nền, tiêu đề "Vị của tĩnh lặng",
đoạn mô tả ngắn, 2 CTA (Đặt bàn + Xem thực đơn). Có eyebrow label "Sài Gòn · Kể từ 2019".
Dark immersive, text cream. Mobile-first.
```

## Output kỳ vọng

```tsx
// src/components/site/hero.tsx
"use client";

import Image from "next/image";
import { images } from "@/components/site/data";
import { useReservation } from "@/components/site/reservation";
import { Reveal } from "@/components/site/primitives";

export function Hero() {
  const { openReservation } = useReservation();

  return (
    <section id="top" className="relative h-svh min-h-[640px] w-full overflow-hidden bg-ink">
      <Image
        src={images.hero}
        alt="Món nếm thử trên bàn đá tối, ánh nến"
        fill
        priority
        sizes="100vw"
        className="object-cover animate-ken-burns"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-8 md:pb-28">
        <Reveal delay={120}>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold/70" />
            <span className="text-[0.7rem] uppercase tracking-luxe text-cream/85">
              Sài Gòn · Kể từ 2019
            </span>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <h1 className="font-serif text-[2.9rem] font-light leading-[1.04] tracking-tight text-cream sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Vị của <span className="italic font-light text-gold-soft">tĩnh lặng</span>
          </h1>
        </Reveal>

        <Reveal delay={380} className="mt-8 max-w-xl">
          <p className="text-base leading-relaxed text-cream/85 md:text-lg">
            Bảy món nếm thử theo mùa — viết lại ký ức ẩm thực Việt.
          </p>
        </Reveal>

        <Reveal delay={520} className="mt-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={openReservation}
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-8 text-[0.7rem] uppercase tracking-luxe font-medium text-ink transition-all duration-300 hover:bg-gold-soft"
            >
              Đặt bàn
            </button>
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-luxe text-cream/90 transition-colors hover:text-cream"
            >
              Xem thực đơn
              <span className="h-px w-6 bg-cream/60 transition-all duration-300 group-hover:w-10 group-hover:bg-gold" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

## Tiêu chí đánh giá

- ✅ Dùng `bg-ink` + `text-cream` (token cố định, không đổi theme).
- ✅ `<Image priority>` cho LCP.
- ✅ `<Reveal>` bọc content, `delay` tăng dần.
- ✅ Eyebrow `text-[0.7rem] uppercase tracking-luxe text-gold` (qua `bg-gold/70` hairline).
- ✅ CTA `bg-gold text-ink` (contrast cao), secondary là link có underline animation.
- ✅ Mobile: CTA stack dọc (`flex-col sm:flex-row`).
- ✅ Semantic `<section id="top">`.
- ❌ KHÔNG hardcode hex. KHÔNG tự tạo button primitive. KHÔNG `<img>`.
