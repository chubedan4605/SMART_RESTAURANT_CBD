# Example: Dashboard

## User prompt

```
Tạo dashboard admin: sidebar nav + topbar + 4 KPI cards (doanh thu, đơn hàng,
khách, đánh giá) + bảng đơn hàng gần đây. Responsive: sidebar collapse mobile.
Dark theme default.
```

## Output kỳ vọng

```tsx
// src/components/site/admin-dashboard.tsx
"use client";

import * as React from "react";
import { Menu, X, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Reveal } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Tổng quan", href: "#", active: true },
  { label: "Đơn hàng", href: "#" },
  { label: "Khách hàng", href: "#" },
  { label: "Thực đơn", href: "#" },
  { label: "Báo cáo", href: "#" },
];

const KPIS = [
  { label: "Doanh thu", value: "486.2M₫", delta: "+12.4%", up: true },
  { label: "Đơn hàng", value: "1,284", delta: "+8.1%", up: true },
  { label: "Khách hàng", value: "642", delta: "+3.2%", up: true },
  { label: "Đánh giá TB", value: "4.8", delta: "-0.1", up: false },
];

const ORDERS = [
  { id: "#1024", customer: "Nguyễn Văn A", time: "19:30", guests: 2, total: "2.8M₫", status: "Đã xác nhận" },
  { id: "#1023", customer: "Trần Thị B", time: "19:00", guests: 4, total: "5.6M₫", status: "Đang phục vụ" },
  { id: "#1022", customer: "Lê Hoàng C", time: "18:30", guests: 2, total: "1.4M₫", status: "Hoàn thành" },
  { id: "#1021", customer: "Phạm D", time: "18:00", guests: 6, total: "8.2M₫", status: "Hoàn thành" },
];

export function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border/60 bg-secondary/30 p-4 lg:block">
          <SidebarContent />
        </aside>

        {/* Sidebar mobile */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-4 top-4 z-40 lg:hidden"
              aria-label="Mở menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-border/60 p-0">
            <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
            <div className="border-b border-border/60 p-4">
              <span className="font-serif text-lg tracking-[0.18em]">TỊNH</span>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Reveal>
            <header className="mb-8">
              <h1 className="font-serif text-2xl font-light tracking-tight md:text-3xl">
                Tổng quan
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Hôm nay · 24 tháng 11</p>
            </header>
          </Reveal>

          {/* KPI cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {KPIS.map((kpi, i) => (
              <Reveal key={kpi.label} delay={i * 80}>
                <article className="rounded-sm border border-border/60 bg-card p-5">
                  <p className="text-[0.62rem] uppercase tracking-wide-sm text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className="mt-2 font-serif text-2xl font-medium tabular-nums">
                    {kpi.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {kpi.up ? (
                      <TrendingUp className="size-3.5 text-gold" />
                    ) : (
                      <TrendingDown className="size-3.5 text-destructive" />
                    )}
                    <span className={cn("text-xs", kpi.up ? "text-gold" : "text-destructive")}>
                      {kpi.delta}
                    </span>
                    <span className="text-xs text-muted-foreground">so với hôm qua</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Orders table */}
          <Reveal delay={200}>
            <section className="mt-8 rounded-sm border border-border/60 bg-card">
              <div className="border-b border-border/60 p-5">
                <h2 className="font-serif text-lg font-medium tracking-tight">
                  Đơn hàng gần đây
                </h2>
              </div>
              <div className="overflow-x-auto scroll-elegant">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-[0.62rem] uppercase tracking-wide-sm text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Mã</th>
                      <th className="px-5 py-3 font-medium">Khách</th>
                      <th className="px-5 py-3 font-medium">Giờ</th>
                      <th className="px-5 py-3 font-medium">Số khách</th>
                      <th className="px-5 py-3 font-medium text-right">Tổng</th>
                      <th className="px-5 py-3 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-border/40 last:border-0">
                        <td className="px-5 py-4 font-medium tabular-nums">{order.id}</td>
                        <td className="px-5 py-4">{order.customer}</td>
                        <td className="px-5 py-4 tabular-nums">{order.time}</td>
                        <td className="px-5 py-4 tabular-nums">{order.guests}</td>
                        <td className="px-5 py-4 text-right tabular-nums">{order.total}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[0.55rem] uppercase tracking-wide-sm text-gold">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </Reveal>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-2" aria-label="Điều hướng admin">
      {NAV.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "rounded-sm px-3 py-2.5 text-sm transition-colors",
            item.active
              ? "bg-gold/10 text-gold"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

## Tiêu chí đánh giá

- ✅ Sidebar desktop `hidden lg:block`, mobile dùng `Sheet side="left"`.
- ✅ KPI grid `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` responsive.
- ✅ Bảng `overflow-x-auto scroll-elegant` cho mobile.
- ✅ Token: `bg-card`, `border-border/60`, `text-muted-foreground`, `text-gold`, `text-destructive`.
- ✅ `tabular-nums` cho số liệu.
- ✅ Status badge `rounded-full border border-gold/40` (pill, hợp quy tắc).
- ✅ Icon `lucide-react` (TrendingUp/Down, Menu).
- ✅ `<SheetTitle className="sr-only">` cho a11y (Radix yêu cầu).
- ✅ Touch target `py-2.5` cho nav item (≥ 40px).
- ❌ KHÔNG tự tạo table component. KHÔNG hex. KHÔNG `lg:hidden` giấu sidebar.
