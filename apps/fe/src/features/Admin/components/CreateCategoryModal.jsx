import React, { useEffect, useState } from "react";
import { X, Layers } from "lucide-react";
import { adminMenuApi } from "../../../services/adminMenuApi";
import { toast } from "react-toastify";

export default function CreateCategoryModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState("active");

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  if (!open) return null;

  const reset = () => {
    setName("");
    setDescription("");
    setDisplayOrder(0);
    setStatus("active");
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose?.();
    }
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    try {
      setLoading(true);
      await adminMenuApi.createCategory({
        name: trimmed,
        description,
        displayOrder: Number(displayOrder) || 0,
        status,
      });
      onSuccess?.();
      toast.success("Thêm danh mục thành công");
      reset();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Tạo danh mục thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-xs" onClick={handleClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Layers size={18} />
              </div>
              <div>
                <div className="font-serif font-bold text-foreground text-lg leading-tight">Tạo danh mục mới</div>
                <div className="text-xs text-muted-foreground mt-0.5">Thêm phân nhóm món ăn mới cho thực đơn</div>
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

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block font-medium">Tên danh mục *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Khai vị, Món chính, Đồ uống cao cấp..."
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block font-medium">Mô tả danh mục</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả phong cách ẩm thực của danh mục..."
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                >
                  <option value="active">Hoạt động (Active)</option>
                  <option value="inactive">Tạm ngưng (Inactive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
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
              {isLoading ? "Đang tạo..." : "Tạo danh mục"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
