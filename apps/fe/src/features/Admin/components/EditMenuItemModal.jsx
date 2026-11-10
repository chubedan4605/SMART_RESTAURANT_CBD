import React, { useMemo, useEffect, useRef, useState } from "react";
import { X, Upload, Trash2, UtensilsCrossed } from "lucide-react";
import { adminMenuApi } from "../../../services/adminMenuApi";
import MultiSelectCombobox from "../../../Components/MultiSelectCombobox";
import ScrollArea from "../../../Components/ScrollArea";
import { toast } from "react-toastify";

export default function EditMenuItemModal({
  open,
  item,
  categories = [],
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    prepTimeMinutes: 0,
    status: "available",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [modifierGroups, setModifierGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const fileRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [inventory, setInventory] = useState({
    track_inventory: false,
    stock_quantity: "",
    low_stock_threshold: 3,
  });

  const modifierGroupOptions = useMemo(() => {
    return (modifierGroups || []).map((g) => ({
      value: g.id,
      label: g.name,
      subLabel: `${g.selectionType} • ${g.isRequired ? "bắt buộc" : "tuỳ chọn"} • min ${g.minSelections} / max ${g.maxSelections}`,
    }));
  }, [modifierGroups]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !item?.id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setLoadingGroups(true);
        setLoadingPhotos(true);

        const [groupsRes, detailRes, photosRes, invRes] = await Promise.all([
          adminMenuApi.getModifierGroups({ status: "active" }),
          adminMenuApi.getMenuItemDetail(item.id),
          adminMenuApi.getMenuItemPhotos(item.id),
          adminMenuApi.getItemInventory(item.id).catch(() => null),
        ]);

        if (cancelled) return;

        setModifierGroups(groupsRes?.groups || groupsRes?.data?.groups || []);
        setPhotos(photosRes?.photos || []);

        const full = detailRes?.item;

        setForm({
          name: full?.name ?? "",
          categoryId: full?.categoryId ?? "",
          price: full?.price ?? "",
          prepTimeMinutes: full?.prepTimeMinutes ?? 0,
          status: full?.status ?? "available",
          description: full?.description ?? "",
        });

        setSelectedGroupIds(
          Array.isArray(full?.modifierGroupIds) ? full.modifierGroupIds : []
        );

        const inv = invRes?.data || invRes;
        if (inv) {
          setInventory({
            track_inventory: Boolean(inv.track_inventory),
            stock_quantity:
              inv.stock_quantity !== null && inv.stock_quantity !== undefined
                ? inv.stock_quantity
                : "",
            low_stock_threshold: inv.low_stock_threshold || 3,
          });
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(e?.response?.data?.message || "Không tải được chi tiết món");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingGroups(false);
          setLoadingPhotos(false);
          setUploadingImage(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, item?.id]);

  if (!open) return null;

  const disabledAll = loading || uploadingImage || loadingPhotos;

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    for (const f of files) {
      if (!okTypes.includes(f.type)) {
        toast.error("Chỉ hỗ trợ JPG / PNG / WEBP");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error("Mỗi ảnh tối đa 5MB");
        return;
      }
    }

    try {
      setUploadingImage(true);
      const res = await adminMenuApi.uploadMenuItemPhotos(item.id, files);
      setPhotos(res?.photos || []);
      toast.success("Đăng tải ảnh thành công");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đăng tải ảnh thất bại");
    } finally {
      setUploadingImage(false);
    }
  };

  const setPrimary = async (photoId) => {
    try {
      const res = await adminMenuApi.setPrimaryMenuItemPhoto(item.id, photoId);
      setPhotos(res?.photos || []);
      toast.success("Đã đổi ảnh hiển thị chính");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Không thể đổi ảnh hiển thị");
    }
  };

  const deletePhoto = async (photoId) => {
    if (!window.confirm("Xoá ảnh này?")) return;

    try {
      const res = await adminMenuApi.deleteMenuItemPhoto(item.id, photoId);
      setPhotos(res?.photos || []);
      toast.success("Đã xoá ảnh thành công");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Không thể xoá ảnh");
    }
  };

  const submit = async () => {
    try {
      setLoading(true);

      const payload = {
        name: form.name,
        categoryId: form.categoryId,
        price: Number(form.price),
        prepTimeMinutes: Number(form.prepTimeMinutes || 0),
        status: form.status,
        description: form.description,
      };

      await adminMenuApi.updateMenuItem(item.id, payload);
      await adminMenuApi.setMenuItemModifierGroups(item.id, selectedGroupIds);
      await adminMenuApi.setItemInventory(item.id, {
        track_inventory: inventory.track_inventory,
        stock_quantity: inventory.track_inventory
          ? Number(inventory.stock_quantity) || 0
          : null,
        low_stock_threshold: Number(inventory.low_stock_threshold) || 3,
      });

      onUpdated?.({
        ...item,
        ...payload,
        modifierGroupIds: selectedGroupIds,
      });

      onClose?.();
      toast.success("Chỉnh sửa món ăn thành công");
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Chỉnh sửa thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-xs"
        onClick={() => !disabledAll && onClose?.()}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl max-h-[90vh] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-scale-in">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <UtensilsCrossed size={18} />
              </div>
              <div>
                <div className="font-serif font-bold text-foreground text-lg leading-tight">Chỉnh sửa món ăn</div>
                <div className="text-xs text-muted-foreground mt-0.5">Cập nhật định giá, hình ảnh và phân nhóm</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => !disabledAll && onClose?.()}
              className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <ScrollArea>
            <div className="max-h-[75vh] overflow-auto p-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Tên món *</label>
                <input
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  disabled={disabledAll}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Danh mục</label>
                  <select
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                    value={form.categoryId ?? ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, categoryId: e.target.value }))
                    }
                    disabled={disabledAll}
                  >
                    <option value="">
                      {item?.categoryName ? `${item.categoryName}` : "-- Chọn danh mục --"}
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Trạng thái</label>
                  <select
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                    value={form.status}
                    onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                    disabled={disabledAll}
                  >
                    <option value="available">Có sẵn (Available)</option>
                    <option value="unavailable">Tạm ngưng (Unavailable)</option>
                    <option value="sold_out">Hết hàng (Sold out)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Đơn giá (VND)</label>
                  <input
                    type="number"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                    value={form.price}
                    onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                    disabled={disabledAll}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Prep (phút)</label>
                  <input
                    type="number"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                    value={form.prepTimeMinutes}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, prepTimeMinutes: e.target.value }))
                    }
                    disabled={disabledAll}
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-foreground text-sm">Bộ sưu tập ảnh</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Đăng tải nhiều ảnh • chọn 1 ảnh làm ảnh đại diện chính
                    </div>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={onFileChange}
                  />

                  <button
                    type="button"
                    onClick={onPickFile}
                    disabled={disabledAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer min-h-10 disabled:opacity-50"
                  >
                    <Upload size={14} />
                    {uploadingImage ? "Đang tải..." : "Thêm ảnh"}
                  </button>
                </div>

                {loadingPhotos ? (
                  <div className="mt-3 text-xs text-muted-foreground py-3 text-center">Đang tải ảnh...</div>
                ) : (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {photos.map((p) => (
                      <div
                        key={p.id}
                        className={`relative group rounded-xl overflow-hidden border shadow-xs
                        ${p.isPrimary ? "border-gold ring-1 ring-gold/40" : "border-border"}`}
                      >
                        <img src={p.url} alt="" className="w-full h-20 object-cover" />

                        {p.isPrimary && (
                          <div className="absolute top-1 left-1 text-[9px] font-bold tracking-wider uppercase bg-gold text-ink px-1.5 py-0.5 rounded-sm">
                            CHÍNH
                          </div>
                        )}

                        <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition">
                          {!p.isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimary(p.id)}
                              className="px-2 py-0.5 text-[10px] font-semibold text-ink bg-gold rounded-sm hover:bg-gold-light cursor-pointer"
                              disabled={disabledAll}
                            >
                              Đặt chính
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deletePhoto(p.id)}
                            className="p-1 bg-destructive text-destructive-foreground rounded-sm hover:opacity-90 cursor-pointer"
                            disabled={disabledAll}
                            title="Xoá ảnh"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {!photos.length && (
                      <div className="col-span-4 text-xs text-muted-foreground py-4 text-center">
                        Chưa có ảnh. Bấm Thêm ảnh để tải lên.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modifiers */}
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-foreground text-sm">Nhóm Modifiers</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Chọn các nhóm tuỳ chọn áp dụng cho món ăn này
                    </div>
                  </div>
                  {loadingGroups ? (
                    <div className="text-xs text-muted-foreground">Đang tải...</div>
                  ) : null}
                </div>

                <div className="mt-3">
                  <MultiSelectCombobox
                    options={modifierGroupOptions}
                    value={selectedGroupIds}
                    onChange={setSelectedGroupIds}
                    placeholder="Chọn modifier groups..."
                    disabled={loadingGroups || disabledAll}
                  />
                </div>
              </div>

              {/* Quản lý Tồn kho F&B (track_inventory) */}
              <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold flex items-center gap-2">
                      <span>📦 Quản lý tồn kho (Track Inventory)</span>
                      {inventory.track_inventory && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Đang bật
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Bật cho món định lượng theo miếng/chai/lon (Wagyu, tôm hùm, nước ngọt, bia...)
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={inventory.track_inventory}
                      onChange={(e) =>
                        setInventory((prev) => ({
                          ...prev,
                          track_inventory: e.target.checked,
                        }))
                      }
                      disabled={disabledAll}
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                  </label>
                </div>

                {inventory.track_inventory && (
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10">
                    <div>
                      <label className="text-xs text-gray-300 font-medium">
                        Số lượng còn lại (Suất/Phần) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="mt-1 w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
                        placeholder="VD: 5"
                        value={inventory.stock_quantity}
                        onChange={(e) =>
                          setInventory((prev) => ({
                            ...prev,
                            stock_quantity: e.target.value,
                          }))
                        }
                        disabled={disabledAll}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 font-medium">
                        Cảnh báo khi còn lại (Low Stock)
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="mt-1 w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
                        placeholder="Mặc định: 3"
                        value={inventory.low_stock_threshold}
                        onChange={(e) =>
                          setInventory((prev) => ({
                            ...prev,
                            low_stock_threshold: e.target.value,
                          }))
                        }
                        disabled={disabledAll}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Mô tả chi tiết</label>
                <textarea
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  disabled={disabledAll}
                />
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-card">
            <button
              type="button"
              onClick={() => !disabledAll && onClose?.()}
              className="min-h-11 px-5 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer disabled:opacity-50"
              disabled={disabledAll}
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={submit}
              className="min-h-11 px-6 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer disabled:opacity-50"
              disabled={disabledAll}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
