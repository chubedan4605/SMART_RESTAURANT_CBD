import React, { useEffect, useMemo, useState } from "react";
import { X, User, Shield, BadgeCheck, BadgeX, Pencil, Save, Ban } from "lucide-react";
import { toast } from "react-toastify";
import { adminAccountApi } from "../../../services/adminAccountApi";
import ToggleSwitch from "../../../Components/ToggleSwitch";

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border/50">
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="text-xs text-foreground font-semibold text-right break-all">
        {value ?? "—"}
      </div>
    </div>
  );
}

function AvatarBlock({ name, avatarUrl }) {
  const initial = useMemo(() => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const lastWord = parts[parts.length - 1];
    return lastWord[0]?.toUpperCase() || "U";
  }, [name]);

  const [imgOk, setImgOk] = useState(!!avatarUrl);

  useEffect(() => {
    setImgOk(!!avatarUrl);
  }, [avatarUrl]);

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold/30 bg-background flex items-center justify-center shadow-xs">
        {avatarUrl && imgOk ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-serif font-bold text-gold">
            {initial}
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="font-serif font-bold text-foreground text-xl">{name || "—"}</div>
        <div className="text-muted-foreground text-xs">{avatarUrl ? "Ảnh đại diện tùy chỉnh" : "Ảnh mặc định"}</div>
      </div>
    </div>
  );
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Quản trị viên (admin)" },
  { value: "waiter", label: "Phục vụ (waiter)" },
  { value: "kitchen", label: "Bếp (kitchen)" },
];

export default function AccountDetailModal({ open, item, onClose, onUpdated }) {
  const [loadingActive, setLoadingActive] = useState(false);
  const [activeLocal, setActiveLocal] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState({ name: "", role: "" });

  const roleLower = String(item?.role || "").toLowerCase();
  const isCustomer = roleLower === "customer";
  const canEditRole = useMemo(() => roleLower !== "customer", [roleLower]);

  useEffect(() => {
    if (!item) return;
    setActiveLocal(Boolean(item.is_actived));
    setDraft({
      name: item.name ?? "",
      role: item.role ?? "",
    });
    setEditing(false);
    setSaving(false);
  }, [item]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtml || "";
      document.body.style.overflow = prevBody || "";
    };
  }, [open]);

  if (!open || !item) return null;

  const setActive = async (next) => {
    if (!item?.id) return;
    const prev = activeLocal;
    setActiveLocal(next);
    setLoadingActive(true);

    try {
      const res = await adminAccountApi.setActived(item.id, next);
      const updated = res?.item || res || { ...item, is_actived: next };
      const finalValue = Boolean(updated?.is_actived);

      setActiveLocal(finalValue);
      toast.success(finalValue ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hoá tài khoản");
      onUpdated?.(updated);
    } catch (e) {
      setActiveLocal(prev);
      toast.error(e?.response?.data?.message || "Không thể đổi trạng thái. Vui lòng thử lại.");
    } finally {
      setLoadingActive(false);
    }
  };

  const startEdit = () => {
    if (isCustomer) return;
    setDraft({
      name: item.name ?? "",
      role: item.role ?? "",
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft({
      name: item.name ?? "",
      role: item.role ?? "",
    });
    setEditing(false);
  };

  const saveEdit = async () => {
    const nameTrim = String(draft.name || "").trim();
    if (!nameTrim) {
      toast.error("Tên không được để trống");
      return;
    }

    const payload = {
      name: nameTrim,
      ...(canEditRole ? { role: String(draft.role || "").toLowerCase() } : {}),
    };

    setSaving(true);
    try {
      const res = await adminAccountApi.updateAccount(item.id, payload);
      toast.success("Đã cập nhật tài khoản thành công");
      setEditing(false);
      onUpdated?.(res?.item || { ...item, ...payload });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-xs" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="w-full max-w-xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <User size={18} />
              </div>
              <div className="font-serif font-bold text-foreground text-lg">Chi tiết tài khoản</div>
            </div>

            <button
              onClick={onClose}
              className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center cursor-pointer"
              type="button"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <AvatarBlock name={item.name} avatarUrl={item.avatar_url} />

            {/* Edit actions */}
            <div className="flex items-center justify-end gap-2">
              {!isCustomer &&
                (!editing ? (
                  <button
                    type="button"
                    onClick={startEdit}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground hover:border-gold/40 hover:text-gold transition cursor-pointer"
                  >
                    <Pencil size={14} />
                    Chỉnh sửa
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer disabled:opacity-50"
                    >
                      <Ban size={14} />
                      Huỷ
                    </button>
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer disabled:opacity-50"
                    >
                      <Save size={14} />
                      {saving ? "Đang lưu..." : "Lưu"}
                    </button>
                  </>
                ))}
            </div>

            <div className="rounded-2xl bg-background border border-border p-4">
              <Row
                label="Họ và tên"
                value={
                  editing ? (
                    <input
                      value={draft.name}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      className="w-64 max-w-full bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:border-gold/50"
                      placeholder="Tên tài khoản..."
                      disabled={saving}
                    />
                  ) : (
                    item.name
                  )
                }
              />

              <Row label="Địa chỉ Email" value={item.email} />

              <Row
                label="Vai trò"
                value={
                  editing ? (
                    <select
                      value={String(draft.role || "").toLowerCase()}
                      onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                      disabled={saving}
                      className="rounded-xl px-3 py-1.5 text-xs bg-card text-foreground border border-border focus:outline-hidden focus:border-gold/50 cursor-pointer"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-gold">
                      <Shield size={13} />
                      {item.role || "—"}
                    </span>
                  )
                }
              />

              <Row
                label="Trạng thái xác thực"
                value={
                  item.is_verified ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-500 font-semibold text-xs">
                      <BadgeCheck size={14} /> Đã xác thực
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-amber-500 font-semibold text-xs">
                      <BadgeX size={14} /> Chưa xác thực
                    </span>
                  )
                }
              />

              <Row
                label="Ngày tạo tài khoản"
                value={item.created_at ? new Date(item.created_at).toLocaleString("vi-VN") : "—"}
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-2xl bg-background border border-border p-4">
              <div>
                <div className="text-foreground font-semibold text-xs">Kích hoạt tài khoản</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Cho phép người dùng đăng nhập vào hệ thống</div>
              </div>

              <div className="flex items-center gap-3">
                <ToggleSwitch
                  checked={!!activeLocal}
                  disabled={loadingActive}
                  onChange={(next) => setActive(next)}
                  label="Trạng thái hoạt động"
                />

                <span
                  className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider
                    ${activeLocal
                      ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                >
                  {loadingActive ? "..." : activeLocal ? "Hoạt động" : "Khoá"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end bg-card">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-6 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
