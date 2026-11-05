import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

/**
 * Font setup — Cormorant Garamond (serif, heading) + Inter (sans, body).
 * subset "vietnamese" BẮT BUỘC nếu nội dung tiếng Việt (để hiển thị dấu đúng).
 */
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

export const metadata: Metadata = {
  title: "App Title",
  description: "Mô tả ngắn gọn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* defaultTheme="dark" — đổi sang "light" hoặc "system" tuỳ ý */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
