import React, { useEffect } from "react";
import { X, ReceiptText } from "lucide-react";
import { formatVND } from "../../../utils/adminFormat";
import ScrollArea from "../../../Components/ScrollArea";

const STATUS_META = {
  received: {
    label: "Chờ xử lý",
    className: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20",
  },
  preparing: {
    label: "Đang chuẩn bị",
    className: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20",
  },
  ready: {
    label: "Sẵn sàng",
    className: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  },
  completed: {
    label: "Hoàn tất",
    className: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const ITEM_STATUS_STYLES = {
  received: {
    row: "bg-amber-500/5 border-l-4 border-l-amber-500",
    text: "text-amber-500 dark:text-amber-400",
  },
  preparing: {
    row: "bg-blue-500/5 border-l-4 border-l-blue-500",
    text: "text-blue-500 dark:text-blue-400",
  },
  ready: {
    row: "bg-emerald-500/5 border-l-4 border-l-emerald-500",
    text: "text-emerald-500 dark:text-emerald-400",
  },
  completed: {
    row: "bg-emerald-500/5 border-l-4 border-l-emerald-500/50",
    text: "text-emerald-500 dark:text-emerald-400",
  },
  cancelled: {
    row: "bg-destructive/5 border-l-4 border-l-destructive opacity-60",
    text: "text-destructive line-through",
  },
  rejected: {
    row: "bg-destructive/5 border-l-4 border-l-destructive opacity-60",
    text: "text-destructive line-through",
  },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || {
    label: status || "—",
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function formatDateTime(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function InfoRow({ label, value, isPrice = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold text-right ${isPrice ? "font-serif text-gold text-base" : "text-foreground"}`}>
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function OrderDetailModal({
  open,
  order,
  loading = false,
  error = "",
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  if (!open) return null;

  const items = order?.items ?? [];

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-3xl border border-border bg-card text-foreground shadow-2xl overflow-hidden animate-scale-in">
          {/* header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <ReceiptText size={18} />
              </div>
              <div>
                <div className="font-serif text-lg font-bold text-foreground leading-tight">
                  Chi tiết đơn{" "}
                  <span className="text-gold">
                    #{order?.id?.slice(0, 8) ?? "—"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Xem thông tin & danh sách món trong order
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center"
              type="button"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* content states */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
              <div className="font-serif text-base font-bold text-foreground">
                Đang tải chi tiết đơn...
              </div>
              <div className="text-muted-foreground text-xs mt-1">Vui lòng chờ giây lát</div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="min-h-11 px-6 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-sm font-medium"
                  type="button"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            /* body */
            <ScrollArea>
              <div className="max-h-[80vh] overflow-x-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* left: meta */}
                <div className="lg:col-span-5 rounded-2xl bg-background border border-border p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="font-serif font-bold text-foreground text-base">Thông tin đơn</div>
                    <StatusPill status={order?.status} />
                  </div>

                  <div className="mt-2 divide-y divide-border/60">
                    <InfoRow label="Mã đơn" value={`#${order?.id?.slice(0, 8)}`} />
                    <InfoRow label="Bàn phục vụ" value={order?.tableName} />
                    <InfoRow
                      label="Tạo lúc"
                      value={formatDateTime(order?.createdAt)}
                    />
                    <InfoRow
                      label="Cập nhật"
                      value={
                        order?.updatedAt
                          ? formatDateTime(order?.updatedAt)
                          : "—"
                      }
                    />
                    <InfoRow label="Số lượng món" value={order?.totalItems} />
                    <InfoRow
                      label="Tổng tiền"
                      value={
                        typeof order?.totalAmount === "number"
                          ? formatVND(order.totalAmount)
                          : "—"
                      }
                      isPrice
                    />
                    <InfoRow label="Thanh toán" value={order?.paymentMethod} />
                    <InfoRow label="Ghi chú" value={order?.note || "—"} />
                  </div>
                </div>

                {/* right: items */}
                <div className="lg:col-span-7 rounded-2xl bg-background border border-border overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-card">
                      <div className="font-serif font-bold text-foreground text-base">Danh sách món</div>
                      <div className="text-xs text-muted-foreground font-serif">
                        {items.length} món
                      </div>
                    </div>

                    <ScrollArea>
                      <div className="sm:max-h-[50vh] overflow-auto">
                        {items.length === 0 ? (
                          <div className="p-8 text-center">
                            <div className="font-serif font-bold text-foreground">
                              Chưa có món ăn
                            </div>
                            <div className="text-muted-foreground text-xs mt-1">
                              API chưa trả về món ăn hoặc order này không có món.
                            </div>
                          </div>
                        ) : (
                          <table className="w-full min-w-50">
                            <thead className="bg-secondary/30 border-b border-border text-xs text-muted-foreground">
                              <tr className="text-left">
                                <th className="py-2.5 pl-4 pr-3 w-[65%]">Món</th>
                                <th className="py-2.5 px-3 w-[35%] text-right">SL / Đơn giá</th>
                              </tr>
                            </thead>

                            <tbody>
                              {items.map((it, idx) => {
                                const key = it.id ?? `${order?.id}-item-${idx}`;
                                const total =
                                  typeof it.totalPrice === "number"
                                    ? it.totalPrice
                                    : typeof it.unitPrice === "number" &&
                                        typeof it.quantity === "number"
                                      ? it.unitPrice * it.quantity
                                      : null;

                                const itemStyle = ITEM_STATUS_STYLES[it.status] || {
                                  row: "bg-background",
                                  text: "text-foreground",
                                };
                                const statusMeta = STATUS_META[it.status] || {
                                  label: it.status || "—",
                                  className: "bg-muted text-muted-foreground border-border",
                                };

                                return (
                                  <React.Fragment key={key}>
                                    <tr className={`border-b border-border/40 ${itemStyle.row} transition-all`}>
                                      <td className="py-3 pl-4 pr-3 align-top">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className={`font-medium ${itemStyle.text}`}>
                                            {it.name ?? "—"}
                                          </span>
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusMeta.className}`}
                                          >
                                            {statusMeta.label}
                                          </span>
                                        </div>

                                        {it.note ? (
                                          <div className="text-xs text-muted-foreground mt-1 italic">
                                            Ghi chú: {it.note}
                                          </div>
                                        ) : null}

                                        {Array.isArray(it.modifiers) && it.modifiers.length > 0 ? (
                                          <div className="mt-2 space-y-1">
                                            <div className="flex flex-wrap gap-1.5">
                                              {it.modifiers.map((m, mi) => {
                                                const mKey = m.id ?? `${key}-m-${mi}`;
                                                const price = typeof m.price === "number" ? m.price : Number(m.price || 0);
                                                const modName = m.name || m.modifier_name || "—";

                                                return (
                                                  <span
                                                    key={mKey}
                                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-card text-[11px] text-muted-foreground"
                                                  >
                                                    <span>{modName}</span>
                                                    {price > 0 ? (
                                                      <span className="font-serif text-gold font-semibold">
                                                        +{formatVND(price)}
                                                      </span>
                                                    ) : null}
                                                  </span>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ) : null}
                                      </td>

                                      <td className="py-3 px-3 align-top text-right">
                                        <div className="text-foreground font-serif font-bold text-base">
                                          x{it.quantity ?? 1}
                                        </div>
                                        <div className="text-xs font-serif font-medium text-gold mt-1">
                                          {typeof total === "number" ? formatVND(total) : "—"}
                                        </div>
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="px-5 py-3.5 border-t border-border flex items-center justify-end bg-card">
                    <button
                      onClick={onClose}
                      className="min-h-11 px-6 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-sm cursor-pointer"
                      type="button"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
