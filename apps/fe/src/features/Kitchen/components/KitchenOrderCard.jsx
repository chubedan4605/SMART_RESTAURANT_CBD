import React from "react";
import {
  Clock,
  Table2,
  CheckCircle2,
  Eye,
  AlertTriangle,
  Check,
  XCircle,
} from "lucide-react";
import OrderTimer from "../../../Components/OrderTimer";

export default function KitchenOrderCard({
  order,
  onView,
  onComplete,
  onUpdateItemStatus,
}) {
  if (!order) return null;

  const items = order.items || [];

  const completedItems = items.filter(
    (it) => it.status === "ready" || it.status === "rejected",
  ).length;

  const allItemsDone = items.every(
    (it) => it.status === "ready" || it.status === "rejected",
  );

  const maxPrepTime = Math.max(
    ...items.map((it) => it.prep_time_minutes || 15),
    15,
  );

  const formatOrderTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMinutesElapsed = (isoString) => {
    if (!isoString) return 0;
    const diff = new Date() - new Date(isoString);
    return Math.floor(diff / 60000);
  };

  const elapsed = getMinutesElapsed(order.created_at);
  const isUrgent = elapsed >= maxPrepTime;
  const isWarning = elapsed >= maxPrepTime * 0.75 && !isUrgent;

  return (
    <div
      className={`rounded-none bg-card text-card-foreground border shadow-xs overflow-hidden h-full flex flex-col transition-all duration-300 ${
        isUrgent
          ? "border-destructive/60 ring-1 ring-destructive/30"
          : isWarning
            ? "border-gold/40"
            : "border-border hover:border-gold/40"
      }`}
    >
      {/* Urgent Banner */}
      {isUrgent && (
        <div className="px-4 py-2 bg-destructive/15 border-b border-destructive/30 flex items-center gap-2">
          <AlertTriangle size={15} className="text-destructive animate-bounce shrink-0" />
          <span className="text-destructive text-xs font-sans font-semibold uppercase tracking-luxe">
            Đơn trễ — Cần ưu tiên chế biến!
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col h-full font-sans">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-foreground font-serif text-xl font-medium">
              #{order.id.slice(0, 8)}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <Table2 size={15} className="text-gold" />
                <span className="font-serif text-sm font-semibold text-foreground">
                  {order.table_number || "Mang về"}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Clock size={15} className="text-gold" />
                <span>{formatOrderTime(order.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <OrderTimer
              createdAt={order.created_at}
              estimatedMinutes={maxPrepTime}
              size="default"
            />

            <div className="px-3 py-1 rounded-none bg-gold/15 border border-gold/30 text-gold text-[10px] font-sans uppercase tracking-luxe font-semibold">
              {completedItems}/{items.length} món xong
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-4 space-y-2">
          {(items || []).slice(0, 4).map((it, idx) => {
            const itemPrepTime = it.prep_time_minutes || 15;
            const itemOverdue = elapsed >= itemPrepTime;
            const isItemReady = it.status === "ready";
            const isItemRejected = it.status === "rejected";
            const isItemPending = !isItemReady && !isItemRejected;

            return (
              <div
                key={it.id || idx}
                className={`flex items-center justify-between gap-3 p-2.5 rounded-none border transition-all ${
                  isItemReady
                    ? "bg-emerald-500/10 border-emerald-500/25"
                    : isItemRejected
                      ? "bg-destructive/10 border-destructive/25 opacity-50"
                      : itemOverdue
                        ? "bg-destructive/10 border-destructive/30"
                        : "bg-background border-border"
                }`}
              >
                <div className="min-w-0 flex items-center gap-2">
                  {isItemReady && (
                    <Check size={14} className="text-emerald-500 shrink-0" />
                  )}
                  {isItemRejected && (
                    <XCircle size={14} className="text-destructive shrink-0" />
                  )}
                  {isItemPending && itemOverdue && (
                    <AlertTriangle
                      size={14}
                      className="text-destructive shrink-0"
                    />
                  )}
                  <div
                    className={`font-sans text-sm truncate font-semibold ${
                      isItemReady
                        ? "text-emerald-500 line-through"
                        : isItemRejected
                          ? "text-destructive line-through"
                          : itemOverdue
                            ? "text-destructive"
                            : "text-foreground"
                    }`}
                  >
                    {it.item_name || it.name}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isItemPending && itemOverdue && (
                    <span className="text-[10px] text-destructive font-mono">
                      +{elapsed - itemPrepTime}m
                    </span>
                  )}
                  <div className="px-2 py-0.5 rounded-none bg-muted border border-border text-foreground font-sans text-xs font-bold tabular-nums">
                    x{it.qty}
                  </div>
                  {isItemPending && onUpdateItemStatus && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateItemStatus(order.id, it.id, "ready");
                      }}
                      className="w-8 h-8 rounded-none bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                      title="Đánh dấu hoàn thành"
                      aria-label="Mark item ready"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {(items || []).length > 4 && (
            <div className="text-xs text-muted-foreground font-sans pt-1">
              +{items.length - 4} món khác trong đơn
            </div>
          )}
        </div>

        {order.note ? (
          <div className="mt-3 p-2.5 rounded-none bg-muted/40 border border-border text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Ghi chú: </span>
            {order.note}
          </div>
        ) : null}

        {/* Actions pinned bottom */}
        <div className="mt-auto pt-5 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onView}
            className="flex-1 min-h-11 px-4 py-2.5 rounded-none bg-muted hover:bg-muted/80 border border-border text-foreground font-sans text-xs uppercase tracking-luxe transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Eye size={16} className="text-gold" />
            Xem Chi Tiết
          </button>

          <button
            type="button"
            onClick={onComplete}
            disabled={!allItemsDone}
            className={`min-h-11 px-5 py-2.5 rounded-none font-sans text-xs uppercase tracking-luxe font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
              !allItemsDone
                ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                : isUrgent
                  ? "bg-destructive hover:bg-destructive/90 text-white shadow-md animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            }`}
          >
            <CheckCircle2 size={16} />
            {!allItemsDone
              ? `${completedItems}/${items.length} món`
              : isUrgent
                ? "Hoàn thành gấp!"
                : "Hoàn tất đơn"}
          </button>
        </div>
      </div>
    </div>
  );
}
