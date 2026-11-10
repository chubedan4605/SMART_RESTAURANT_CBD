import React, { useMemo } from "react";
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  X,
  AlertTriangle,
  Check,
  XCircle,
} from "lucide-react";
import { formatTime } from "../../../utils/orders";
import OrderTimer from "../../../Components/OrderTimer";

export default function KitchenOrderDetailModal({
  order,
  onClose,
  onStart,
  onComplete,
  onUpdateItemStatus,
}) {
  const items = order?.items || [];

  const { maxPrepTime, elapsed, isUrgent, overdueItems } = useMemo(() => {
    if (!order) return { maxPrepTime: 15, elapsed: 0, isUrgent: false, overdueItems: [] };
    const max = Math.max(...items.map((it) => it.prep_time_minutes || 15), 15);
    const elapsedMins =
      (Date.now() - new Date(order.created_at).getTime()) / 60000;
    const overdue = items.filter(
      (it) => elapsedMins >= (it.prep_time_minutes || 15),
    );

    return {
      maxPrepTime: max,
      elapsed: elapsedMins,
      isUrgent: elapsedMins >= max,
      overdueItems: overdue,
    };
  }, [order, items]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-60 font-sans">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="absolute left-1/2 top-1/2 w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2">
        <div
          className={`rounded-none bg-card text-card-foreground border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isUrgent
              ? "border-destructive/60 ring-1 ring-destructive/30"
              : "border-border"
          }`}
        >
          {/* Urgent Banner */}
          {isUrgent && (
            <div className="px-5 py-3 bg-destructive/15 border-b border-destructive/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={16}
                  className="text-destructive animate-bounce"
                />
                <span className="text-destructive text-xs font-semibold uppercase tracking-luxe">
                  Đơn trễ — {overdueItems.length} món vượt thời gian quy định!
                </span>
              </div>
              <OrderTimer
                createdAt={order.created_at}
                estimatedMinutes={maxPrepTime}
                size="small"
                showLabel={false}
              />
            </div>
          )}

          {/* Header */}
          <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-muted/30">
            <div>
              <div className="text-foreground font-serif text-2xl font-medium flex items-center gap-2">
                {order.table_number || "Mang về"}
                <span className="text-xs font-sans text-muted-foreground bg-muted border border-border px-2.5 py-0.5 rounded-none font-normal">
                  #{order.id.slice(0, 6)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-gold" />
                  <span>Thời gian đặt: {formatTime(order.created_at)}</span>
                </div>

                {!isUrgent && (
                  <OrderTimer
                    createdAt={order.created_at}
                    estimatedMinutes={maxPrepTime}
                    size="default"
                  />
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body (Scrollable) */}
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
            <div className="rounded-none bg-background border border-border overflow-hidden">
              <div className="p-3.5 flex items-center justify-between border-b border-border bg-muted/20">
                <div className="font-sans font-semibold text-foreground uppercase tracking-luxe text-xs">
                  Chi tiết món cần nấu
                </div>
                <div className="text-gold font-serif text-sm font-medium">
                  {items.length} món
                </div>
              </div>

              <div className="divide-y divide-border">
                {items.map((it, idx) => {
                  const itemPrepTime = it.prep_time_minutes || 15;
                  const itemOverdue = elapsed >= itemPrepTime;
                  const overtimeMinutes = Math.floor(elapsed - itemPrepTime);
                  const isItemReady = it.status === "ready";
                  const isItemRejected = it.status === "rejected";
                  const isItemPending = !isItemReady && !isItemRejected;

                  return (
                    <div
                      key={it.id || idx}
                      className={`p-4 transition-colors ${
                        isItemReady
                          ? "bg-emerald-500/10"
                          : isItemRejected
                          ? "bg-destructive/10 opacity-50"
                          : itemOverdue
                          ? "bg-destructive/10"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Quantity Badge */}
                        <div
                          className={`shrink-0 w-10 h-10 rounded-none flex items-center justify-center font-sans text-base font-bold tabular-nums border ${
                            isItemReady
                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                              : isItemRejected
                              ? "bg-destructive/20 border-destructive/30 text-destructive"
                              : itemOverdue
                              ? "bg-destructive/20 border-destructive/30 text-destructive"
                              : "bg-muted border-border text-foreground"
                          }`}
                        >
                          {it.qty}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div
                              className={`font-sans text-base sm:text-lg font-semibold leading-tight ${
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

                            {/* Status badge */}
                            {isItemReady && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans font-semibold uppercase tracking-luxe">
                                <Check size={10} /> Đã Xong
                              </span>
                            )}
                            {isItemRejected && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-destructive/20 border border-destructive/30 text-destructive text-[10px] font-sans font-semibold uppercase tracking-luxe">
                                <XCircle size={10} /> Từ Chối
                              </span>
                            )}
                            {isItemPending && itemOverdue && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-destructive/20 border border-destructive/30 text-destructive text-[10px] font-sans font-semibold uppercase tracking-luxe">
                                <AlertTriangle size={10} />+{overtimeMinutes}m
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-xs text-muted-foreground font-light">
                            Thời gian chuẩn bị: {itemPrepTime} phút
                          </div>

                          {it.modifiers && it.modifiers.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {it.modifiers.map((mod, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="text-xs text-muted-foreground flex items-center gap-2"
                                >
                                  <span className="w-1.5 h-1.5 bg-gold/60"></span>
                                  {mod.name || mod.modifier_name}
                                </div>
                              ))}
                            </div>
                          )}

                          {it.note && (
                            <div className="mt-2 text-xs text-gold italic bg-gold/10 px-2 py-1 rounded-none border border-gold/20 inline-block font-sans">
                              Ghi chú: {it.note}
                            </div>
                          )}
                        </div>

                        {/* Nút hoàn thành từng item */}
                        {isItemPending && onUpdateItemStatus && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateItemStatus(order.id, it.id, "ready")
                            }
                            className="shrink-0 min-h-11 min-w-11 rounded-none bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                            title="Đánh dấu hoàn thành món này"
                            aria-label="Mark item ready"
                          >
                            <Check size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ghi chú chung toàn đơn */}
            {order.note && (
              <div className="mt-4 p-4 rounded-none bg-gold/10 border border-gold/25 text-foreground">
                <div className="text-[10px] font-sans font-semibold uppercase tracking-luxe text-gold mb-1">
                  Ghi chú toàn đơn
                </div>
                <div className="text-sm font-medium">{order.note}</div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-border bg-card flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-6 py-2.5 rounded-none bg-muted hover:bg-muted/80 border border-border text-foreground font-sans text-xs uppercase tracking-luxe font-medium transition-all cursor-pointer"
            >
              Đóng
            </button>

            {order.status !== "preparing" ? (
              <button
                type="button"
                onClick={onStart}
                className="flex-1 min-h-11 px-6 py-2.5 rounded-none bg-gold hover:bg-gold-soft text-ink font-sans text-xs uppercase tracking-luxe font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle size={18} />
                Bắt đầu nấu
              </button>
            ) : (
              <button
                type="button"
                onClick={onComplete}
                className={`flex-1 min-h-11 px-6 py-2.5 rounded-none font-sans text-xs uppercase tracking-luxe font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isUrgent
                    ? "bg-destructive hover:bg-destructive/90 text-white animate-pulse"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                <CheckCircle2 size={18} />
                {isUrgent ? "Hoàn thành gấp!" : "Hoàn tất đơn"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
