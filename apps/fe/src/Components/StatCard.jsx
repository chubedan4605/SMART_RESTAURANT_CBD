import React from "react";

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-none bg-card text-card-foreground border border-border shadow-xs overflow-hidden font-sans">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-luxe text-gold font-medium font-sans">
              {label}
            </div>
            <div className="mt-2 text-foreground font-sans text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">{value}</div>
            {hint ? <div className="mt-1 text-xs text-muted-foreground font-light">{hint}</div> : null}
          </div>

          {Icon ? (
            <div className="w-12 h-12 rounded-none bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
              <Icon size={20} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="h-0.5 bg-gold/30" />
    </div>
  );
}
