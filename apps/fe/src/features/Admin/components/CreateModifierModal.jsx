import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Trash2, SlidersHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import { adminModifierApi } from "../../../services/adminModifierApi";
import ScrollArea from "../../../Components/ScrollArea";

function toNumberSafe(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function OptionRow({ value, onChange, onRemove, disabled }) {
  return (
    <div className="grid grid-cols-12 gap-2.5 items-start">
      <div className="col-span-5">
        <label className="text-[11px] text-muted-foreground mb-1 block font-medium">Tên lựa chọn</label>
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10"
          placeholder="VD: Size L, Thêm phô mai..."
          disabled={disabled}
        />
      </div>

      <div className="col-span-3">
        <label className="text-[11px] text-muted-foreground mb-1 block font-medium">Giá cộng thêm (+)</label>
        <input
          value={value.price_adjustment}
          onChange={(e) => onChange({ ...value, price_adjustment: e.target.value })}
          inputMode="decimal"
          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10"
          placeholder="0"
          disabled={disabled}
        />
      </div>

      <div className="col-span-2">
        <label className="text-[11px] text-muted-foreground mb-1 block font-medium">Trạng thái</label>
        <select
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value })}
          className="w-full rounded-xl px-2.5 py-2 text-xs bg-background text-foreground border border-border focus:outline-hidden focus:border-gold/50 transition min-h-10 cursor-pointer"
          disabled={disabled}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="col-span-2 flex justify-end pt-5">
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition min-h-10 min-w-10 flex items-center justify-center cursor-pointer"
          disabled={disabled}
          title="Xoá option"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function CreateModifierModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [selectionType, setSelectionType] = useState("single");
  const [isRequired, setIsRequired] = useState(false);
  const [minSelections, setMinSelections] = useState(0);
  const [maxSelections, setMaxSelections] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState("active");

  const [options, setOptions] = useState([
    { name: "", price_adjustment: "0", status: "active" },
  ]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setSelectionType("single");
    setIsRequired(false);
    setMinSelections(0);
    setMaxSelections(0);
    setDisplayOrder(0);
    setStatus("active");
    setOptions([{ name: "", price_adjustment: "0", status: "active" }]);
    setSaving(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  const computed = useMemo(() => {
    const min = toNumberSafe(minSelections, 0);
    const max = toNumberSafe(maxSelections, 0);
    return { min, max };
  }, [minSelections, maxSelections]);

  if (!open) return null;

  const addOptionRow = () => {
    setOptions((cur) => [...cur, { name: "", price_adjustment: "0", status: "active" }]);
  };

  const updateOptionRow = (idx, next) => {
    setOptions((cur) => cur.map((x, i) => (i === idx ? next : x)));
  };

  const removeOptionRow = (idx) => {
    setOptions((cur) => cur.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    const groupName = name.trim();
    if (!groupName) return toast.error("Tên nhóm modifier không được để trống");

    const min = toNumberSafe(minSelections, 0);
    const max = toNumberSafe(maxSelections, 0);
    const order = toNumberSafe(displayOrder, 0);

    if (min < 0 || max < 0) return toast.error("Min/Max phải >= 0");
    if (max && min > max) return toast.error("Min không được lớn hơn Max");
    if (selectionType === "single" && max > 1) return toast.error("Single choice thì Max không được > 1");

    const cleanedOptions = options
      .map((o) => ({
        name: (o.name || "").trim(),
        price_adjustment: toNumberSafe(o.price_adjustment, 0),
        status: (o.status || "active").toLowerCase(),
      }))
      .filter((o) => o.name.length > 0);

    if (cleanedOptions.length === 0) {
      return toast.error("Cần ít nhất 1 lựa chọn cho nhóm");
    }
    for (const o of cleanedOptions) {
      if (o.price_adjustment < 0) return toast.error("Giá điều chỉnh phải >= 0");
      if (o.status !== "active" && o.status !== "inactive") return toast.error("Trạng thái lựa chọn không hợp lệ");
    }

    setSaving(true);
    try {
      const groupRes = await adminModifierApi.createGroup({
        name: groupName,
        selection_type: selectionType,
        is_required: isRequired,
        min_selections: min,
        max_selections: max,
        display_order: order,
        status,
      });

      const createdGroup = groupRes?.item || groupRes?.data?.item || groupRes;
      const groupId = createdGroup?.id;
      if (!groupId) throw new Error("Không lấy được ID nhóm sau khi tạo");

      await Promise.all(
        cleanedOptions.map((o) =>
          adminModifierApi.createOption({
            group_id: groupId,
            name: o.name,
            price_adjustment: o.price_adjustment,
            status: o.status,
          })
        )
      );

      toast.success("Đã tạo nhóm modifier & các lựa chọn thành công");
      onSuccess?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Tạo nhóm thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <div className="font-serif font-bold text-foreground text-lg leading-tight">Tạo nhóm Modifier mới</div>
              <div className="text-xs text-muted-foreground mt-0.5">Định nghĩa thuộc tính và danh sách tuỳ chọn cho món</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center cursor-pointer"
            disabled={saving}
          >
            <X size={18} />
          </button>
        </div>

        <ScrollArea>
          <div className="max-h-[75vh] overflow-x-auto p-6 space-y-4">
            {/* GROUP INFO */}
            <div className="rounded-2xl bg-background border border-border p-5">
              <div className="font-serif font-bold text-foreground text-base">Thông tin nhóm modifier</div>

              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-3.5">
                <div className="md:col-span-6">
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Tên nhóm *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10"
                    placeholder="VD: Kích cỡ, Độ ngọt, Topping..."
                    disabled={saving}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Kiểu chọn</label>
                  <select
                    value={selectionType}
                    onChange={(e) => setSelectionType(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs bg-card text-foreground border border-border focus:outline-hidden focus:border-gold/50 transition min-h-10 cursor-pointer"
                    disabled={saving}
                  >
                    <option value="single">Chọn một (single)</option>
                    <option value="multiple">Chọn nhiều (multiple)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Trạng thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-xs bg-card text-foreground border border-border focus:outline-hidden focus:border-gold/50 transition min-h-10 cursor-pointer"
                    disabled={saving}
                  >
                    <option value="active">Hoạt động (active)</option>
                    <option value="inactive">Tạm ngưng (inactive)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Số chọn tối thiểu</label>
                  <input
                    value={minSelections}
                    onChange={(e) => setMinSelections(e.target.value)}
                    inputMode="numeric"
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10"
                    disabled={saving}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Số chọn tối đa</label>
                  <input
                    value={maxSelections}
                    onChange={(e) => setMaxSelections(e.target.value)}
                    inputMode="numeric"
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10"
                    disabled={saving}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Thứ tự hiển thị</label>
                  <input
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    inputMode="numeric"
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-10"
                    disabled={saving}
                  />
                </div>

                <div className="md:col-span-3 flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 text-foreground text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRequired}
                      onChange={(e) => setIsRequired(e.target.checked)}
                      disabled={saving}
                      className="w-4.5 h-4.5 accent-gold"
                    />
                    Bắt buộc chọn (Required)
                  </label>
                </div>

                <div className="md:col-span-12 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                  Cấu hình: Tối thiểu {computed.min} / Tối đa {computed.max} • Kiểu {selectionType === "single" ? "Chọn 1" : "Chọn nhiều"}
                </div>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="rounded-2xl bg-background border border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="font-serif font-bold text-foreground text-base">Danh sách lựa chọn *</div>
                <button
                  type="button"
                  onClick={addOptionRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer min-h-10"
                  disabled={saving}
                >
                  <Plus size={15} />
                  Thêm lựa chọn
                </button>
              </div>

              <div className="mt-3.5 space-y-3">
                {options.map((opt, idx) => (
                  <OptionRow
                    key={idx}
                    value={opt}
                    disabled={saving}
                    onChange={(next) => updateOptionRow(idx, next)}
                    onRemove={() => removeOptionRow(idx)}
                  />
                ))}
              </div>

              <div className="mt-3 text-[11px] text-muted-foreground">
                Gợi ý: Dòng lựa chọn nào để trống tên sẽ được tự động bỏ qua khi lưu.
              </div>
            </div>
          </div>
        </ScrollArea>

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
            {saving ? "Đang tạo..." : "Tạo nhóm & lựa chọn"}
          </button>
        </div>
      </div>
    </div>
  );
}
