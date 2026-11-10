import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

/**
 * Reveal — Scroll-triggered fade-in.
 * Bọc mọi section content. Content fade + lift up khi enter viewport.
 * Fallback visible nếu IntersectionObserver không có.
 *
 * @example
 * <Reveal>
 *   <h2>Tiêu đề</h2>
 * </Reveal>
 * <Reveal delay={120}>
 *   <p>Nội dung</p>
 * </Reveal>
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/**
 * SectionLabel — Eyebrow label (hairline + uppercase tracked gold).
 * Đặt trên mỗi section heading.
 *
 * @example
 * <SectionLabel>Feature</SectionLabel>
 * <SectionLabel align="center">Testimonials</SectionLabel>
 */
export function SectionLabel({
  children,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span className="h-px w-8 bg-gold/60" aria-hidden />
      <span className="text-[0.7rem] uppercase tracking-luxe text-gold font-medium">
        {children}
      </span>
    </div>
  );
}

/**
 * formatPrice — Format giá VND chuẩn.
 * "380.000" → "380.000₫"
 */
export function formatPrice(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    return `${value.toLocaleString("vi-VN")}₫`;
  }
  return `${value}₫`;
}

export default { Reveal, SectionLabel, formatPrice };

