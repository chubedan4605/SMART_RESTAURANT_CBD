import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { SlidersHorizontal, RefreshCcw, Search, Plus } from "lucide-react";

import ConfirmModal from "../../../Components/ConfirmModal";
import CreateModifierModal from "./CreateModifierModal";
import ModifierGroupDetailModal from "./ModifierGroupDetailModal";
import { adminModifierApi } from "../../../services/adminModifierApi";

function SkeletonItem() {
  return (
    <div className="py-3.5 px-4 flex items-start justify-between gap-3 border-b border-border/50">
      <div className="min-w-0 flex-1">
        <div className="h-4 w-40 bg-muted/40 rounded-sm animate-pulse" />
        <div className="mt-2 h-3 w-72 bg-muted/40 rounded-sm animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-muted/40 rounded-xl animate-pulse" />
    </div>
  );
}

export default function ModifierManagerPanel({ onReload }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const [openCreate, setOpenCreate] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailGroup, setDetailGroup] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminModifierApi.getGroups({ page: 1, limit: 200, sort: "NAME_ASC" });
      const data = res?.items ? res : res?.data;
      setItems(data?.items ?? []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Không thể tải modifier groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((x) => (x.name || "").toLowerCase().includes(keyword));
  }, [items, q]);

  return (
    <div className="mt-8 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <SlidersHorizontal size={18} />
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-foreground text-base leading-tight">Nhóm Modifiers</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {loading ? "Đang tải..." : `${items.length} nhóm modifier khả dụng`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên nhóm..."
              className="bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-10"
            />
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs min-h-10 cursor-pointer"
          >
            <Plus size={15} />
            Thêm nhóm Modifier
          </button>

          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-medium min-h-10 cursor-pointer"
          >
            <RefreshCcw size={14} />
            Làm mới
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-0">
        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="font-serif font-bold text-foreground text-base">Không có nhóm modifier phù hợp</div>
            <div className="text-muted-foreground text-xs mt-1">Thử đổi từ khóa tìm kiếm.</div>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filtered.map((it) => (
              <div
                key={it.id}
                className="p-4 flex items-start justify-between gap-3 hover:bg-accent/40 transition cursor-pointer group"
                onClick={() => {
                  setDetailGroup(it);
                  setDetailOpen(true);
                }}
              >
                <div className="min-w-0">
                  <div className="font-serif font-bold text-foreground text-base group-hover:text-gold transition truncate">
                    {it.name}
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    {it.selection_type === "single" ? "Chọn một (Single)" : "Chọn nhiều (Multiple)"} •{" "}
                    {it.is_required ? "Bắt buộc" : "Tuỳ chọn"} • Min {it.min_selections ?? 0} / Max{" "}
                    {it.max_selections ?? 0} •{" "}
                    <span className={`font-semibold ${it.status === "active" ? "text-emerald-500" : "text-amber-500"}`}>
                      {it.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </span>
                    {typeof it.options_count === "number" ? (
                      <> • {it.options_count} lựa chọn</>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/20 transition cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteItem(it);
                      setConfirmOpen(true);
                    }}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateModifierModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={async () => {
          setOpenCreate(false);
          await load();
          onReload?.();
        }}
      />

      <ModifierGroupDetailModal
        open={detailOpen}
        group={detailGroup}
        onClose={() => {
          setDetailOpen(false);
          setDetailGroup(null);
        }}
        onChanged={async () => {
          await load();
          onReload?.();
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        danger
        title="Xoá modifier group"
        description={`Bạn có chắc muốn xoá "${deleteItem?.name}" không? (các options liên quan sẽ bị xoá kèm)`}
        confirmText="Xoá nhóm"
        cancelText="Huỷ"
        loading={deleting}
        onClose={() => {
          if (deleting) return;
          setConfirmOpen(false);
          setDeleteItem(null);
        }}
        onConfirm={async () => {
          if (!deleteItem?.id) return;
          try {
            setDeleting(true);
            await adminModifierApi.deleteGroup(deleteItem.id);
            setItems((cur) => cur.filter((x) => x.id !== deleteItem.id));
            toast.success("Đã xoá nhóm modifier thành công");
            setConfirmOpen(false);
            setDeleteItem(null);
            onReload?.();
          } catch (e) {
            toast.error(e?.response?.data?.message || "Xoá thất bại");
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}
