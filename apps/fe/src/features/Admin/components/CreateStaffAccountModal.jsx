import React, { useEffect, useMemo, useState } from "react";
import { X, Shield, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { adminAccountApi } from "../../../services/adminAccountApi";

const STAFF_ROLE_OPTIONS = [
  { value: "waiter", label: "Phục vụ (Waiter)" },
  { value: "kitchen", label: "Bếp trưởng/Phụ bếp (Kitchen)" },
  { value: "admin", label: "Quản trị viên (Admin)" },
];

export default function CreateStaffAccountModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("waiter");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return name.trim() && email.trim() && password.trim() && role;
  }, [name, email, password, role]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  const reset = () => {
    setName("");
    setEmail("");
    setRole("waiter");
    setPassword("");
    setIsVerified(true);
  };

  const submit = async () => {
    if (!canSubmit) return toast.error("Vui lòng nhập đầy đủ thông tin");
    setLoading(true);
    try {
      await adminAccountApi.createStaffAccount({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        is_verified: isVerified,
      });
      toast.success("Tạo tài khoản nhân sự thành công");
      reset();
      onSuccess?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Tạo tài khoản thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs px-4">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-scale-in">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <Shield size={18} />
            </div>
            <div>
              <div className="font-serif font-bold text-foreground text-lg leading-tight">
                Tạo tài khoản nhân sự
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Cấp quyền truy cập hệ thống phân hệ Staff / Admin
              </div>
            </div>
          </div>

          <button
            onClick={() => !loading && onClose?.()}
            className="min-h-11 min-w-11 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition flex items-center justify-center cursor-pointer"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Họ và tên *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block font-medium">Email đăng nhập *</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
              placeholder="VD: staff@restaurant.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block font-medium">Vai trò hệ thống *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2 text-xs bg-background text-foreground border border-border focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
              >
                {STAFF_ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block font-medium">Mật khẩu ban đầu *</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-background border border-border px-4 py-3">
            <div>
              <div className="text-foreground text-xs font-semibold">Tự động xác thực tài khoản</div>
              <div className="text-muted-foreground text-[11px] mt-0.5">Cho phép nhân viên đăng nhập ngay lập tức</div>
            </div>
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-5 h-5 accent-gold cursor-pointer"
              disabled={loading}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-card">
          <button
            type="button"
            onClick={() => !loading && onClose?.()}
            className="min-h-11 px-5 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer"
          >
            Huỷ
          </button>

          <button
            type="button"
            disabled={!canSubmit || loading}
            onClick={submit}
            className={`inline-flex items-center gap-2 px-6 rounded-xl transition text-xs font-semibold min-h-11 cursor-pointer
              ${(!canSubmit || loading)
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gold text-ink hover:bg-gold-light"
              }`}
          >
            <UserPlus size={16} />
            {loading ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );
}
