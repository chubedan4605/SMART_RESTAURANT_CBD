/**
 * Boilerplate section — điểm khởi đầu cho mọi section mới.
 * Copy file này, đổi id / heading / nội dung.
 *
 * Có 2 biến thể:
 * - Default (nền background, text foreground) — phần lớn section.
 * - Immersive (nền ink, text cream) — hero, experience, footer.
 */

import { Reveal, SectionLabel } from "@/components/site/primitives";

export function SectionTemplate() {
  return (
    // ✅ Biến thể default
    <section id="feature" className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal>
          <SectionLabel>Feature</SectionLabel>
          <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-tight md:text-5xl">
            Tiêu đề section
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[1.05rem]">
            Đoạn mô tả. Giữ ngắn gọn, giàu thông tin, không lorem ipsum.
          </p>
        </Reveal>

        <Reveal delay={200}>
          {/* Nội dung chính: grid / list / cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* items */}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Biến thể immersive (block tối cả 2 theme)
 * Bỏ comment khi cần — hero, experience, footer.
 */
// export function ImmersiveSection() {
//   return (
//     <section className="grain relative overflow-hidden bg-ink text-cream">
//       <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-36">
//         <Reveal>
//           <SectionLabel>Experience</SectionLabel>
//           <h2 className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
//             Tiêu đề immersive
//           </h2>
//         </Reveal>
//         {/* text dùng text-cream, accent dùng text-gold */}
//       </div>
//     </section>
//   );
// }
