"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wrapper next-themes + bật transition mượt SAU khi first paint.
 *
 * - `attribute="class"`: thêm/xóa class "dark" trên <html>.
 * - `defaultTheme`: theme mặc định (đặt ở layout.tsx).
 * - `suppressHydrationWarning` ở <html>: tránh warning hydration mismatch
 *   vì theme được apply trước khi React hydrate.
 *
 * Transition mượt: thêm class "theme-ready" sau 300ms — tránh flash
 * animated colors ở initial load.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      document.documentElement.classList.add("theme-ready");
    }, 300);
    return () => window.clearTimeout(t);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
