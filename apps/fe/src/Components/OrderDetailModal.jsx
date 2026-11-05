import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Table2,
  X,
  Check,
  Ban,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { calcTotal, formatMoneyVND, formatTime } from "../utils/orders";
import axiosClient from "../store/axiosClient";
import { toast } from "react-toastify";

export default function OrderDetailModal({
  order: initialOrder,
  onClose,
  onAccept,
  onReject,
}) {
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  if (!order) return null;

  const handleItemAction = async (itemId, status) => {
    try {
      const res = await axiosClient.patch(`/orders/items/${itemId}`, {
        status,
      });

      toast.success(status === "preparing" ? "Đã nhận món" : "Đã từ chối món");

      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === itemId ? { ...it, status: status } : it,
        ),
        total_amount: res.order ? res.order.total_amount : prev.total_amount,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Lỗi cập nhật món");
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 font-sans">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-card text-card-foreground border border-border rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-foreground font-serif text-2xl font-medium">
                #{order.id.slice(0, 8)}
              </div>
              <StatusBadge status={order.status} />
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
                <span>{formatTime(order.created_at)}</span>
              </div>
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
          {order.note && (
            <div className="mb-6 p-4 rounded-none bg-gold/10 border border-gold/25 text-foreground text-xs flex gap-3">
              <AlertCircle size={18} className="text-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-sans font-semibold uppercase tracking-luxe text-gold block mb-1">
                  Ghi chú của khách:
                </span>
                {order.note}
              </div>
            </div>
          )}

          {/* List Items */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-sans font-semibold text-gold uppercase tracking-luxe mb-2">
              Chi tiết món ăn ({order.items.length})
            </h4>

            {order.items.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-start p-4 rounded-none border transition-all ${
                  item.status === "rejected"
                    ? "bg-destructive/10 border-destructive/25 opacity-60"
                    : item.status === "preparing"
                      ? "bg-emerald-500/10 border-emerald-500/25"
                      : item.status === "ready"
                      ? "bg-emerald-500/10 border-emerald-500/25"
                      : "bg-background border-border hover:border-gold/40"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-muted text-foreground px-2 py-0.5 rounded-none text-xs font-serif font-bold">
                      {item.qty}x
                    </span>
                    <span
                      className={`font-serif text-lg font-medium ${item.status === "rejected" ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="mt-1 ml-9 text-xs text-muted-foreground">
                      + {item.modifiers.map((m) => m.name).join(", ")}
                    </div>
                  )}

                  {item.note && (
                    <div className="mt-1 ml-9 text-xs text-gold italic font-sans">
                      "{item.note}"
                    </div>
                  )}

                  <div className="ml-9 mt-2">
                    {item.status === "preparing" && (
                      <span className="text-[10px] font-sans uppercase tracking-luxe text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Đang nấu
                      </span>
                    )}
                    {item.status === "ready" && (
                      <span className="text-[10px] font-sans uppercase tracking-luxe text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Đã hoàn thành
                      </span>
                    )}
                    {item.status === "rejected" && (
                      <span className="text-[10px] font-sans uppercase tracking-luxe text-destructive font-semibold flex items-center gap-1">
                        <XCircle size={12} /> Đã từ chối
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`font-serif text-base font-medium ${item.status === "rejected" ? "text-muted-foreground line-through" : "text-gold"}`}
                  >
                    {formatMoneyVND(Number(item.subtotal))}
                  </div>

                  {(item.status === "received" || !item.status) &&
                    order.status !== "completed" &&
                    order.status !== "rejected" &&
                    order.status !== "ready" && (
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleItemAction(item.id, "rejected")}
                          className="w-8 h-8 bg-destructive/15 hover:bg-destructive/25 text-destructive rounded-none border border-destructive/30 transition-colors flex items-center justify-center cursor-pointer"
                          title="Từ chối món này (Hết hàng...)"
                          aria-label="Reject item"
                        >
                          <Ban size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleItemAction(item.id, "preparing")}
                          className="w-8 h-8 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-none border border-emerald-500/30 transition-colors flex items-center justify-center cursor-pointer"
                          title="Nhận món này"
                          aria-label="Accept item"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-card">
          <div className="flex justify-between items-center mb-5">
            <span className="text-muted-foreground text-xs uppercase tracking-luxe">Tổng cộng duyệt</span>
            <span className="text-3xl font-serif text-gold font-normal">
              {formatMoneyVND(Number(calcTotal(order)))}
            </span>
          </div>

          <div className="flex gap-3">
            {order.status === "received" ? (
              <>
                <button
                  type="button"
                  onClick={onReject}
                  className="flex-1 min-h-11 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive rounded-none font-sans text-xs uppercase tracking-luxe font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <XCircle size={16} />
                  Từ chối đơn
                </button>
                <button
                  type="button"
                  onClick={onAccept}
                  className="flex-2 min-h-11 bg-gold hover:bg-gold-soft text-ink rounded-none font-sans text-xs uppercase tracking-luxe font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  Chuyển Bếp Nấu
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-11 bg-muted hover:bg-muted/80 text-foreground rounded-none font-sans text-xs uppercase tracking-luxe font-medium transition-all cursor-pointer border border-border"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
