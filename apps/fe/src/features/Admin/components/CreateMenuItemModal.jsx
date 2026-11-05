import React, { useEffect, useMemo, useState } from "react";
import { X, PlusSquare } from "lucide-react";
import { adminMenuApi } from "../../../services/adminMenuApi";
import { formatVND } from "../../../utils/adminFormat";
import ScrollArea from "../../../Components/ScrollArea";
import MultiSelectCombobox from "../../../Components/MultiSelectCombobox";
import { toast } from "react-toastify";

const ITEM_STATUS = [
  { value: "available", label: "Có sẵn (Available)" },
  { value: "unavailable", label: "Tạm ngưng (Unavailable)" },
  { value: "sold_out", label: "Hết hàng (Sold out)" },
];

export default function CreateMenuItemModal({
  open,
  onClose,
  onSuccess,
  categories = [],
}) {
  const firstCat = useMemo(() => categories?.[0]?.id || "ALL", [categories]);

  const [categoryId, setCategoryId] = useState(firstCat);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [modifierGroups, setModifierGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(0);
  const [status, setStatus] = useState("available");
  const [isChefRecommended, setChefRecommended] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setLoading] = useState(false);

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
      document.body.style.overflow = prev || "auto";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingGroups(true);
        const res = await adminMenuApi.getModifierGroups({ status: "active" });
        setModifierGroups(res?.groups || res?.data?.groups || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingGroups(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const reset = () => {
    setCategoryId(firstCat);
    setName("");
    setDescription("");
    setPrice("");
    setPrepTimeMinutes(0);
    setStatus("available");
    setChefRecommended(false);
    setSelectedGroupIds([]);
    setModifierGroups([]);
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose?.();
    }
  };

  if (!open) return null;

  const handleSubmit = async () => {
    const trimmed = name.trim();
    const numPrice = Number(price);

    if (!categoryId || categoryId === "ALL")
      return toast.error("Vui lòng chọn danh mục.");
    if (!trimmed) return toast.error("Vui lòng nhập tên món.");
    if (!Number.isFinite(numPrice) || numPrice <= 0)
      return toast.error("Đơn giá phải là số dương > 0.");
    if (!status) return toast.error("Vui lòng chọn trạng thái.");
    if (!imageFile) return toast.error("Vui lòng chọn ảnh món ăn.");

    try {
      setLoading(true);

      const created = await adminMenuApi.createMenuItem({
        categoryId,
        name: trimmed,
        description: description?.trim() || null,
        price: numPrice,
        prepTimeMinutes: Number(prepTimeMinutes) || 0,
        status,
        isChefRecommended,
      });

      const newId =
        created?.item?.id ||
        created?.data?.item?.id ||
        created?.id ||
        created?.data?.id;

      if (!newId) throw new Error("Tạo món thành công nhưng không nhận được ID.");

      await adminMenuApi.uploadMenuItemPhotos(newId, [imageFile]);

      if (selectedGroupIds?.length) {
        await adminMenuApi.setMenuItemModifierGroups(newId, selectedGroupIds);
      }

      toast.success("Thêm món ăn thành công");
      onSuccess?.();
      reset();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Tạo món ăn thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-xs" onClick={handleClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-scale-in">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <PlusSquare size={18} />
              </div>
              <div>
                <div className="font-serif font-bold text-foreground text-lg leading-tight">Thêm món mới vào menu</div>
                <div className="text-xs text-muted-foreground mt-0.5">Cấu hình thông tin, giá bán và modifiers</div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center cursor-pointer"
              type="button"
              aria-label="Close"
              disabled={isLoading}
            >
              <X size={18} />
            </button>
          </div>

          <ScrollArea>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Danh mục *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                  >
                    <option value="ALL">Chọn danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Trạng thái *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                  >
                    {ITEM_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Tên món *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Wagyu Steak A5, Lobster Bisque..."
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Mô tả món ăn</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả nguyên liệu, hương vị, phong cách ẩm thực..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Đơn giá (VND) *</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="VD: 250000"
                    inputMode="numeric"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                  />
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Hiển thị:{" "}
                    <span className="font-serif font-bold text-gold text-sm">
                      {Number.isFinite(Number(price)) && Number(price) > 0
                        ? formatVND(Number(price))
                        : "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Prep (phút)</label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-foreground text-sm">Nhóm Modifiers tuỳ chọn</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Chọn các nhóm tuỳ chọn áp dụng (Độ chín, Topping, Sốt…)
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
                    placeholder="Chọn các nhóm modifier..."
                    disabled={loadingGroups || isLoading}
                  />
                </div>

                {selectedGroupIds.length ? (
                  <div className="mt-2.5 text-[11px] text-muted-foreground">
                    Đã chọn:{" "}
                    <span className="text-foreground font-medium">
                      {modifierGroupOptions
                        .filter((o) => selectedGroupIds.includes(o.value))
                        .map((o) => o.label)
                        .join(", ")}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Photo input */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Ảnh đại diện món *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setImageFile(f);
                    if (f) {
                      setPreviewUrl(URL.createObjectURL(f));
                    } else {
                      setPreviewUrl("");
                    }
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                />

                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="mt-3 w-full h-40 object-cover rounded-2xl border border-border"
                  />
                ) : (
                  <div className="mt-1.5 text-[11px] text-muted-foreground">Vui lòng chọn ảnh đại diện cho món ăn</div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                <div>
                  <div className="text-foreground font-semibold text-xs">Món Chef khuyên dùng</div>
                  <div className="text-muted-foreground text-[11px] mt-0.5">
                    Hiển thị huy hiệu đề xuất của Bếp trưởng
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChefRecommended((v) => !v)}
                  className={`min-h-10 px-4 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    isChefRecommended
                      ? "bg-gold/15 border-gold/40 text-gold"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isChefRecommended ? "BẬT" : "TẮT"}
                </button>
              </div>
            </div>
          </ScrollArea>

          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-card">
            <button
              onClick={handleClose}
              className="min-h-11 px-5 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer"
              type="button"
              disabled={isLoading}
            >
              Huỷ
            </button>

            <button
              onClick={handleSubmit}
              className="min-h-11 px-6 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer disabled:opacity-50"
              type="button"
              disabled={isLoading}
            >
              {isLoading ? "Đang tạo món..." : "Thêm món ăn"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
