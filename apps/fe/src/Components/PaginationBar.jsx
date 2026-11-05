import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationBar({
  page,
  totalPages,
  total,
  limit,
  onPrev,
  onNext,
  onChangeLimit,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-3.5 border-t border-border bg-card">
      <div className="text-xs text-muted-foreground">
        Tổng <span className="font-serif font-bold text-foreground text-sm">{total ?? "—"}</span> • Trang{" "}
        <span className="font-serif font-bold text-gold text-sm">{page}</span> /{" "}
        <span className="font-serif font-bold text-foreground text-sm">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
          className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10 cursor-pointer"
        >
          {[10, 20, 30, 50].map((n) => (
            <option key={n} value={n} className="bg-background text-foreground">
              {n} / trang
            </option>
          ))}
        </select>

        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground hover:border-gold/40 hover:text-gold transition disabled:opacity-30 disabled:pointer-events-none min-h-10"
          type="button"
        >
          <ChevronLeft size={15} />
          <span>Trước</span>
        </button>

        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground hover:border-gold/40 hover:text-gold transition disabled:opacity-30 disabled:pointer-events-none min-h-10"
          type="button"
        >
          <span>Sau</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
