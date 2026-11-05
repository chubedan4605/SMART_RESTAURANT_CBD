import React, { useEffect, useMemo, useState } from "react";
import { X, UtensilsCrossed } from "lucide-react";
import { formatVND } from "../../../utils/adminFormat";
import { adminMenuApi } from "../../../services/adminMenuApi";
import ScrollArea from "../../../Components/ScrollArea";

const STATUS_META = {
  available: {
    label: "Có sẵn",
    className: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  },
  unavailable: {
    label: "Tạm ngưng",
    className: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20",
  },
  sold_out: {
    label: "Hết hàng",
    className: "bg-destructive/10 text-destructive border-destructive/20",
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

function InfoRow({ label, value, isPrice = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={`text-sm font-semibold text-right ${
          isPrice ? "font-serif text-gold text-base" : "text-foreground"
        }`}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

export default function AdminMenuItemDetailModal({ open, item, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [allGroups, setAllGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const itemId = item?.id;

  const selectedGroupIds = detail?.modifierGroupIds || item?.modifierGroupIds || [];

  const selectedGroups = useMemo(() => {
    if (!Array.isArray(selectedGroupIds) || !selectedGroupIds.length) return [];
    const set = new Set(selectedGroupIds);
    return (allGroups || []).filter((g) => set.has(g.id));
  }, [allGroups, selectedGroupIds]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !itemId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        setLoadingGroups(true);
        const [detailRes, groupsRes] = await Promise.all([
          adminMenuApi.getMenuItemDetail(itemId),
          adminMenuApi.getModifierGroups({ status: "ALL" }),
        ]);

        if (cancelled) return;

        setDetail(detailRes?.item || null);
        setAllGroups(groupsRes?.groups || groupsRes?.data?.groups || []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.response?.data?.message || e?.message || "Không tải được chi tiết món.");
        setDetail(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingGroups(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, itemId]);

  if (!open) return null;

  if (!itemId) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-foreground">
            Không tìm thấy thông tin món ăn.
          </div>
        </div>
      </div>
    );
  }

  const titleName = detail?.name ?? item?.name ?? "—";
  const view = detail ?? item;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={() => !loading && onClose?.()}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl border border-border bg-card text-foreground shadow-2xl overflow-hidden flex flex-col animate-scale-in">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <UtensilsCrossed size={18} />
              </div>
              <div>
                <div className="font-serif text-lg font-bold text-foreground leading-tight">
                  Chi tiết món <span className="text-gold">{titleName}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Thông tin định giá và cấu hình món ăn
                </div>
              </div>
            </div>

            <button
              onClick={() => !loading && onClose?.()}
              className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition disabled:opacity-40 flex items-center justify-center cursor-pointer"
              type="button"
              aria-label="Close"
              disabled={loading}
            >
              <X size={18} />
            </button>
          </div>

          <ScrollArea>
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-3" />
                <div className="font-serif font-bold text-foreground">Đang tải chi tiết...</div>
                <div className="text-xs text-muted-foreground mt-1">Vui lòng chờ giây lát</div>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={onClose}
                    className="min-h-11 px-5 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold"
                    type="button"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Meta info */}
                <div className="lg:col-span-5 rounded-2xl bg-background border border-border p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="font-serif font-bold text-foreground text-base">Thông tin món</div>
                    <StatusPill status={view?.status} />
                  </div>

                  <div className="mt-2 divide-y divide-border/60">
                    <InfoRow label="Tên món" value={view?.name} />
                    <InfoRow label="Danh mục" value={view?.categoryName} />
                    <InfoRow
                      label="Đơn giá"
                      value={typeof view?.price === "number" ? formatVND(view.price) : "—"}
                      isPrice
                    />
                    <InfoRow
                      label="Thời gian chế biến"
                      value={view?.prepTimeMinutes != null ? `${view.prepTimeMinutes} phút` : "—"}
                    />
                    <InfoRow
                      label="Chef khuyên dùng"
                      value={view?.isChefRecommended ? "Có" : "Không"}
                    />
                  </div>

                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="font-serif font-bold text-foreground text-sm mb-3">Nhóm Modifiers</div>

                    {loadingGroups ? (
                      <div className="text-xs text-muted-foreground">Đang tải modifiers...</div>
                    ) : Array.isArray(selectedGroupIds) && selectedGroupIds.length ? (
                      selectedGroups.length ? (
                        <div className="space-y-2.5">
                          {selectedGroups.map((g) => (
                            <div
                              key={g.id}
                              className="rounded-xl border border-border bg-card p-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-xs text-foreground font-semibold">{g.name}</div>
                                <div className="text-[11px] text-muted-foreground text-right">
                                  {g.isRequired ? "Bắt buộc" : "Tuỳ chọn"} • min {g.minSelections} / max {g.maxSelections}
                                </div>
                              </div>

                              {Array.isArray(g.options) && g.options.length ? (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {g.options.map((o) => (
                                    <span
                                      key={o.id}
                                      className="inline-flex items-center rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                                    >
                                      <span>{o.name}</span>
                                      {Number(o.priceAdjustment) > 0 ? (
                                        <span className="font-serif text-gold font-semibold ml-1">
                                          +{formatVND(Number(o.priceAdjustment))}
                                        </span>
                                      ) : null}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="mt-2 text-[11px] text-muted-foreground italic">Không có option</div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Món có gắn modifier nhưng không tìm thấy nhóm (có thể đã inactive).
                        </div>
                      )
                    ) : (
                      <div className="text-xs text-muted-foreground">Món này chưa gắn modifier group.</div>
                    )}
                  </div>
                </div>

                {/* Description & Image */}
                <div className="lg:col-span-7 rounded-2xl bg-background border border-border overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="px-5 py-3.5 border-b border-border bg-card font-serif font-bold text-foreground text-base">
                      Mô tả món ăn
                    </div>
                    <div className="p-5 text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap">
                      {view?.description || "Chưa có mô tả chi tiết cho món ăn này."}
                    </div>

                    {view?.imageUrl ? (
                      <div className="px-5 pb-5">
                        <img
                          src={view.imageUrl}
                          alt={view.name}
                          className="w-full max-h-70 object-cover rounded-2xl border border-border"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4 border-t border-border flex justify-end bg-card">
                    <button
                      onClick={onClose}
                      className="min-h-11 px-6 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer"
                      type="button"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
