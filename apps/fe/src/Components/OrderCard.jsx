import React, { useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Table2,
  Eye,
  Bell,
  AlertTriangle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { calcTotal, formatMoneyVND, formatTime } from "../utils/orders";
import OrderTimer from "./OrderTimer";

export default function OrderCard({ order, onView, onAccept, onReject }) {
  const total = calcTotal(order);

  const { maxPrepTime, isUrgent, isWarning } = useMemo(() => {
    const items = order.items || [];
    const max = Math.max(...items.map((it) => it.prep_time_minutes || 15), 15);
    const elapsed = (Date.now() - new Date(order.created_at).getTime()) / 60000;

    return {
      maxPrepTime: max,
      isUrgent: elapsed >= max,
      isWarning: elapsed >= max * 0.75 && elapsed < max,
    };
  }, [order]);

  const showTimer = !["completed", "rejected"].includes(order.status);

  return (
    <div
      className={`rounded-none bg-card text-card-foreground border shadow-xs overflow-hidden h-full flex flex-col transition-all duration-300 ${
        isUrgent && showTimer
          ? "border-destructive/60 ring-1 ring-destructive/30"
          : isWarning && showTimer
            ? "border-gold/40"
            : "border-border hover:border-gold/40"
      }`}
    >
      {/* Urgent Banner */}
      {isUrgent && showTimer && (
        <div className="px-4 py-2 bg-destructive/15 border-b border-destructive/30 flex items-center gap-2">
          <AlertTriangle size={15} className="text-destructive animate-bounce shrink-0" />
          <span className="text-destructive text-xs font-sans font-semibold uppercase tracking-luxe">
            Đơn trễ — Cần xử lý ngay!
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col h-full font-sans">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-foreground font-serif text-lg font-medium">
                #{order.id.slice(0, 8)}
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <Table2 size={15} className="text-gold" />
                <span className="font-serif text-sm font-semibold text-foreground">
                  {order.table_number || "—"}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Clock size={15} className="text-gold" />
                <span>{formatTime(order.created_at)}</span>
              </div>

              {showTimer && (
                <OrderTimer
                  createdAt={order.created_at}
                  estimatedMinutes={maxPrepTime}
                  size="small"
                />
              )}
            </div>

            <div className="mt-3 text-muted-foreground text-xs space-y-1">
              {order.items.slice(0, 2).map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="truncate">
                    {it.qty}× {it.name}
                  </span>
                  <span className="text-foreground font-sans font-semibold tabular-nums">
                    {formatMoneyVND(it.qty * it.price)}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-[11px] text-muted-foreground/60 italic mt-0.5">
                  +{order.items.length - 2} món khác
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-muted-foreground text-[10px] uppercase tracking-luxe">Tổng tiền</div>
            <div className="text-gold font-sans text-xl sm:text-2xl font-bold tabular-nums mt-0.5">
              {formatMoneyVND(total)}
            </div>
          </div>
        </div>

        {order.note ? (
          <div className="mt-3 p-2.5 rounded-none bg-muted/40 border border-border text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Ghi chú: </span>
            {order.note}
          </div>
        ) : null}

        <div className="mt-auto pt-5 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex-1 min-h-11 px-4 py-2.5 rounded-none bg-muted hover:bg-muted/80 border border-border text-foreground font-sans text-xs uppercase tracking-luxe transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye size={16} className="text-gold" />
            Chi tiết
          </button>

          {order.status === "received" ? (
            <>
              <button
                type="button"
                onClick={onReject}
                className="min-h-11 px-4 py-2.5 rounded-none bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive font-sans text-xs uppercase tracking-luxe transition-all inline-flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <XCircle size={16} />
                Từ chối
              </button>
              <button
                type="button"
                onClick={onAccept}
                className={`min-h-11 px-5 py-2.5 rounded-none font-sans text-xs uppercase tracking-luxe font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer ${
                  isUrgent
                    ? "bg-destructive hover:bg-destructive/90 text-white shadow-md animate-pulse"
                    : "bg-gold hover:bg-gold-soft text-ink shadow-md"
                }`}
              >
                <CheckCircle2 size={16} />
                {isUrgent ? "Nhận ngay!" : "Nhận đơn"}
              </button>
            </>
          ) : (
            <div className="sm:ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-none bg-muted border border-border text-muted-foreground text-xs font-sans uppercase tracking-luxe">
              <Bell size={14} className="text-gold" />
              <span>Đang phục vụ</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
