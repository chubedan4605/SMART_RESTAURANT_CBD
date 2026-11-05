import React, { useEffect, useState } from "react";
import { X, Plus, RefreshCcw, SlidersHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Components/ConfirmModal";
import ToggleSwitch from "../../../Components/ToggleSwitch";
import { adminModifierApi } from "../../../services/adminModifierApi";
import ScrollArea from "../../../Components/ScrollArea";
import { formatVND } from "../../../utils/adminFormat";

function Pill({ status }) {
  const cls =
    status === "active"
      ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
      : "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {status === "active" ? "Hoạt động" : "Tạm ngưng"}
    </span>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <div className="text-[11px] text-muted-foreground mb-1 font-medium">{label}</div>
      <input
        {...props}
        className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10"
      />
    </label>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      <div className="text-[11px] text-muted-foreground mb-1 font-medium">{label}</div>
      <select
        {...props}
        className="w-full rounded-xl px-3 py-2 text-xs bg-card text-foreground border border-border focus:outline-hidden focus:border-gold/50 transition min-h-10 cursor-pointer"
      >
        {children}
      </select>
    </label>
  );
}

export default function ModifierGroupDetailModal({
  open,
  group,
  onClose,
  onChanged,
}) {
  const groupId = group?.id;

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const options = detail?.options ?? [];

  const [createName, setCreateName] = useState("");
  const [createPrice, setCreatePrice] = useState("0");
  const [createStatus, setCreateStatus] = useState("active");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    name: "",
    price_adjustment: 0,
    status: "active",
  });
  const [savingMap, setSavingMap] = useState({});
  const [togglingMap, setTogglingMap] = useState({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canShow = open && !!groupId;

  const load = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const res = await adminModifierApi.getGroupDetail(groupId);
      const data = res?.group ? res : res?.data;
      setDetail(data);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Không thể tải chi tiết nhóm modifier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open]);

  useEffect(() => {
    if (!canShow) return;
    load();
    setCreateName("");
    setCreatePrice("0");
    setCreateStatus("active");
    setEditingId(null);
  }, [canShow, groupId]);

  const startEdit = (opt) => {
    setEditingId(opt.id);
    setEditDraft({
      name: opt.name ?? "",
      price_adjustment: Number(opt.price_adjustment ?? 0),
      status: opt.status ?? "active",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (optId) => {
    const name = (editDraft.name || "").trim();
    if (!name) return toast.error("Tên lựa chọn không được để trống");

    const price = Number(editDraft.price_adjustment);
    if (!Number.isFinite(price) || price < 0)
      return toast.error("Giá điều chỉnh phải >= 0");

    setSavingMap((m) => ({ ...m, [optId]: true }));
    try {
      const res = await adminModifierApi.updateOption(optId, {
        name,
        price_adjustment: price,
        status: editDraft.status,
      });
      const updated = res?.item || res?.data?.item || res;
      setDetail((cur) => {
        if (!cur) return cur;
        return {
          ...cur,
          options: cur.options.map((x) =>
            x.id === optId ? { ...x, ...updated } : x,
          ),
        };
      });
      toast.success("Đã cập nhật lựa chọn thành công");
      setEditingId(null);
      onChanged?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSavingMap((m) => {
        const c = { ...m };
        delete c[optId];
        return c;
      });
    }
  };

  const createOption = async () => {
    const name = (createName || "").trim();
    if (!name) return toast.error("Tên lựa chọn không được để trống");

    const price = Number(createPrice);
    if (!Number.isFinite(price) || price < 0)
      return toast.error("Giá điều chỉnh phải >= 0");

    setCreating(true);
    try {
      const res = await adminModifierApi.createOption({
        group_id: groupId,
        name,
        price_adjustment: price,
        status: createStatus,
      });
      const item = res?.item || res?.data?.item || res;
      setDetail((cur) => {
        if (!cur) return cur;
        return { ...cur, options: [item, ...(cur.options || [])] };
      });
      toast.success("Đã thêm lựa chọn thành công");
      setCreateName("");
      setCreatePrice("0");
      setCreateStatus("active");
      onChanged?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Thêm lựa chọn thất bại");
    } finally {
      setCreating(false);
    }
  };

  const toggleOptionStatus = async (opt, nextActive) => {
    const nextStatus = nextActive ? "active" : "inactive";
    setTogglingMap((m) => ({ ...m, [opt.id]: true }));

    setDetail((cur) => {
      if (!cur) return cur;
      return {
        ...cur,
        options: cur.options.map((x) =>
          x.id === opt.id ? { ...x, status: nextStatus } : x,
        ),
      };
    });

    try {
      const res = await adminModifierApi.updateOption(opt.id, {
        status: nextStatus,
      });
      const updated = res?.item || res?.data?.item || res;
      setDetail((cur) => {
        if (!cur) return cur;
        return {
          ...cur,
          options: cur.options.map((x) =>
            x.id === opt.id ? { ...x, ...updated } : x,
          ),
        };
      });
      onChanged?.();
    } catch (e) {
      setDetail((cur) => {
        if (!cur) return cur;
        return {
          ...cur,
          options: cur.options.map((x) =>
            x.id === opt.id ? { ...x, status: opt.status } : x,
          ),
        };
      });
      toast.error(e?.response?.data?.message || "Đổi trạng thái thất bại");
    } finally {
      setTogglingMap((m) => {
        const c = { ...m };
        delete c[opt.id];
        return c;
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-xs" onClick={onClose} />

      <div
        className="absolute left-1/2 top-1/2 w-[96vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl
          bg-card border border-border shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-3 bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
              <SlidersHorizontal size={18} />
            </div>
            <div className="min-w-0">
              <div className="font-serif font-bold text-foreground text-lg truncate">
                {group?.name || "Modifier group"}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                <span>{group?.selection_type === "single" ? "Chọn một (Single)" : "Chọn nhiều (Multiple)"}</span>
                <span>•</span>
                <span>{group?.is_required ? "Bắt buộc" : "Tuỳ chọn"}</span>
                <span>•</span>
                <span>Min {group?.min_selections ?? 0} / Max {group?.max_selections ?? 0}</span>
                <span>•</span>
                <Pill status={group?.status || "active"} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer min-h-10"
            >
              <RefreshCcw size={14} />
              Làm mới
            </button>
            <button
              onClick={onClose}
              className="min-h-10 min-w-10 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <ScrollArea>
          <div className="max-h-[75vh] overflow-x-auto p-6 space-y-5">
            {/* Create option */}
            <div className="rounded-2xl bg-background border border-border p-5">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/50">
                <div className="font-serif font-bold text-foreground text-base">Thêm lựa chọn mới</div>
                <div className="text-xs text-muted-foreground">Tuỳ chọn thuộc nhóm modifier này</div>
              </div>

              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-3.5">
                <div className="md:col-span-6">
                  <Input
                    label="Tên lựa chọn"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="VD: Size L, Thêm sốt đặc biệt..."
                  />
                </div>

                <div className="md:col-span-3">
                  <Input
                    label="Giá điều chỉnh (+ VND)"
                    value={createPrice}
                    onChange={(e) => setCreatePrice(e.target.value)}
                    placeholder="0"
                    inputMode="decimal"
                  />
                </div>

                <div className="md:col-span-3">
                  <Select label="Trạng thái" value={createStatus} onChange={(e) => setCreateStatus(e.target.value)}>
                    <option value="active">Hoạt động (Active)</option>
                    <option value="inactive">Tạm ngưng (Inactive)</option>
                  </Select>
                </div>

                <div className="md:col-span-12 flex justify-end">
                  <button
                    disabled={creating}
                    onClick={createOption}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs min-h-10 cursor-pointer disabled:opacity-50"
                  >
                    <Plus size={15} />
                    {creating ? "Đang thêm..." : "Thêm lựa chọn"}
                  </button>
                </div>
              </div>
            </div>

            {/* Options list */}
            <div className="rounded-2xl bg-background border border-border overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-card">
                <div className="font-serif font-bold text-foreground text-base">Danh sách lựa chọn khả dụng</div>
                <div className="text-xs text-muted-foreground font-serif">{loading ? "Đang tải..." : `${options.length} lựa chọn`}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/30 border-b border-border">
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <th className="py-3 px-4 w-[50%]">Lựa chọn</th>
                      <th className="hidden sm:table-cell py-3 px-4 w-[18%]">Giá cộng thêm</th>
                      <th className="hidden sm:table-cell py-3 px-4 w-[17%]">Trạng thái</th>
                      <th className="py-3 px-4 text-right w-[15%]">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/40">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-xs text-muted-foreground">
                          Đang tải danh sách lựa chọn...
                        </td>
                      </tr>
                    ) : options.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-10 text-center">
                          <div className="font-serif font-bold text-foreground">Chưa có lựa chọn nào</div>
                          <div className="text-muted-foreground text-xs mt-1">Hãy thêm lựa chọn ở biểu mẫu phía trên.</div>
                        </td>
                      </tr>
                    ) : (
                      options.map((opt) => {
                        const isEditing = editingId === opt.id;

                        return (
                          <React.Fragment key={opt.id}>
                            <tr className="hover:bg-accent/40 transition">
                              <td className="py-3.5 px-4 align-middle">
                                {isEditing ? (
                                  <input
                                    value={editDraft.name}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                                    className="w-full bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50"
                                  />
                                ) : (
                                  <div className="font-medium text-foreground text-xs">{opt.name}</div>
                                )}

                                {!isEditing ? (
                                  <div className="sm:hidden mt-1 text-[11px] text-muted-foreground space-y-0.5">
                                    <div>Giá: +{formatVND(Number(opt.price_adjustment ?? 0))}</div>
                                    <div className="inline-flex items-center gap-1.5">
                                      <span>Trạng thái:</span>
                                      <Pill status={opt.status} />
                                    </div>
                                  </div>
                                ) : null}
                              </td>

                              <td className="hidden sm:table-cell py-3.5 px-4 align-middle">
                                {isEditing ? (
                                  <input
                                    value={String(editDraft.price_adjustment)}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, price_adjustment: e.target.value }))}
                                    inputMode="decimal"
                                    className="w-full bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50"
                                  />
                                ) : (
                                  <div className="font-serif font-bold text-gold text-xs">
                                    +{formatVND(Number(opt.price_adjustment ?? 0))}
                                  </div>
                                )}
                              </td>

                              <td className="hidden sm:table-cell py-3.5 px-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <ToggleSwitch
                                    checked={opt.status === "active"}
                                    disabled={!!togglingMap[opt.id]}
                                    onChange={(next) => toggleOptionStatus(opt, next)}
                                    label="Active"
                                  />
                                  {isEditing ? (
                                    <select
                                      value={editDraft.status}
                                      onChange={(e) => setEditDraft((d) => ({ ...d, status: e.target.value }))}
                                      className="rounded-xl px-2.5 py-1 text-xs bg-card text-foreground border border-border focus:outline-hidden focus:border-gold/50 cursor-pointer"
                                    >
                                      <option value="active">Active</option>
                                      <option value="inactive">Inactive</option>
                                    </select>
                                  ) : (
                                    <Pill status={opt.status} />
                                  )}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-right align-middle">
                                {isEditing ? (
                                  <div className="inline-flex items-center gap-1.5 justify-end">
                                    <button
                                      disabled={!!savingMap[opt.id]}
                                      onClick={() => saveEdit(opt.id)}
                                      className="px-3 py-1 rounded-lg bg-gold text-ink font-semibold hover:bg-gold-light text-xs transition cursor-pointer disabled:opacity-50"
                                    >
                                      Lưu
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground hover:border-gold/40 text-xs transition cursor-pointer"
                                    >
                                      Huỷ
                                    </button>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5 justify-end">
                                    <button
                                      onClick={() => startEdit(opt)}
                                      className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold text-xs font-medium transition cursor-pointer"
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() => {
                                        setDeleteItem(opt);
                                        setConfirmOpen(true);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/20 transition cursor-pointer"
                                    >
                                      Xoá
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ScrollArea>

        <ConfirmModal
          open={confirmOpen}
          danger
          title="Xoá lựa chọn modifier"
          description={`Bạn có chắc muốn xoá lựa chọn "${deleteItem?.name}" không?`}
          confirmText="Xoá lựa chọn"
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
              await adminModifierApi.deleteOption(deleteItem.id);
              setDetail((cur) => {
                if (!cur) return cur;
                return {
                  ...cur,
                  options: cur.options.filter((x) => x.id !== deleteItem.id),
                };
              });
              toast.success("Đã xoá lựa chọn thành công");
              setConfirmOpen(false);
              setDeleteItem(null);
              onChanged?.();
            } catch (e) {
              toast.error(e?.response?.data?.message || "Xoá thất bại");
            } finally {
              setDeleting(false);
            }
          }}
        />
      </div>
    </div>
  );
}
