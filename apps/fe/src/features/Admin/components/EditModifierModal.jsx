import React, { useEffect, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import { adminModifierApi } from "../../../services/adminModifierApi";

export default function EditModifierModal({ open, item, onClose, onUpdated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !item) return;
    setName(item.name || "");
    setDescription(item.description || "");
    setSaving(false);
  }, [open, item]);

  if (!open || !item) return null;

  const submit = async () => {
    const n = name.trim();
    if (!n) return toast.error("Tên modifier không được để trống");

    setSaving(true);
    try {
      const res = await adminModifierApi.updateModifier(item.id, {
        name: n,
        description: description.trim(),
      });
      toast.success("Đã cập nhật modifier thành công");
      onUpdated?.(res?.item || { ...item, name: n, description: description.trim() });
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs px-4">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <div className="font-serif font-bold text-foreground text-lg leading-tight">Chỉnh sửa Modifier</div>
              <div className="text-xs text-muted-foreground mt-0.5">Cập nhật thông tin tuỳ chọn món ăn</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Tên modifier *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-card">
          <button
            onClick={onClose}
            className="min-h-11 px-5 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer"
            disabled={saving}
          >
            Huỷ
          </button>
          <button
            onClick={submit}
            className="min-h-11 px-6 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
