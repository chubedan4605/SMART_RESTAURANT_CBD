import React from "react";

export default function TopListCard({
  title,
  subtitle,
  badge,
  columns = [],
  rows = [],
  rightAlignLast = true,
}) {
  return (
    <div className="rounded-none bg-card text-card-foreground border border-border shadow-xs overflow-hidden font-sans">
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-foreground font-serif text-lg font-medium">{title}</div>
            {subtitle ? <div className="text-muted-foreground text-xs font-light mt-0.5">{subtitle}</div> : null}
          </div>
          {badge ? (
            <div className="px-2.5 py-0.5 rounded-none bg-gold/15 border border-gold/30 text-gold text-[10px] uppercase tracking-luxe font-semibold">
              {badge}
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 text-[10px] text-muted-foreground uppercase tracking-luxe font-medium mb-3">
          {columns.map((c, idx) => (
            <div
              key={idx}
              className={[
                c.span ? `col-span-${c.span}` : "col-span-6",
                rightAlignLast && idx === columns.length - 1 ? "text-right" : "",
                rightAlignLast && idx === columns.length - 3 ? "text-right" : "",
              ].join(" ")}
            >
              {c.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div
              key={r.key || i}
              className="grid grid-cols-12 gap-3 items-center p-3 rounded-none bg-background border border-border hover:border-gold/40 transition-colors"
            >
              {/* Rank */}
              <div className="col-span-1">
                <div className="w-7 h-7 rounded-none bg-gold/15 border border-gold/30 text-gold font-serif font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </div>
              </div>

              {/* Main */}
              <div className="col-span-7 min-w-0 pl-3">
                <div className="text-foreground font-serif text-sm font-medium truncate">{r.title}</div>
                {r.subtitle ? <div className="text-muted-foreground text-xs truncate font-light">{r.subtitle}</div> : null}
              </div>

              {/* Value */}
              <div className="col-span-4 text-right">
                <div className="text-gold font-serif text-sm font-semibold">{r.value}</div>
                {r.valueHint ? <div className="text-muted-foreground text-[10px] uppercase tracking-wider">{r.valueHint}</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
