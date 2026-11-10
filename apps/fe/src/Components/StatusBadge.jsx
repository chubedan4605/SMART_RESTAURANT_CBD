import React from "react";

export default function StatusBadge({ status }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-gold/15 border border-gold/30 text-gold text-[10px] font-sans font-semibold uppercase tracking-luxe">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        Chờ xử lý
      </span>
    );
  }
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans font-semibold uppercase tracking-luxe">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Đã chấp nhận
      </span>
    );
  }
  if (status === "received") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-gold/15 border border-gold/30 text-gold text-[10px] font-sans font-semibold uppercase tracking-luxe">
        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
        Đã nhận đơn
      </span>
    );
  }
  if (status === "preparing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-gold/20 border border-gold/40 text-gold text-[10px] font-sans font-semibold uppercase tracking-luxe">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        Đang nấu
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans font-semibold uppercase tracking-luxe">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Hoàn tất
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-destructive/15 border border-destructive/30 text-destructive text-[10px] font-sans font-semibold uppercase tracking-luxe">
      <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
      Đã từ chối
    </span>
  );
}
