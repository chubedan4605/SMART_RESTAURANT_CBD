import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { User, Camera, Save, RefreshCcw } from "lucide-react";
import { adminProfileApi } from "../../services/adminProfileApi";
import { SectionLabel } from "@/Components/site/primitives";

function Avatar({ url, name }) {
  const initial = useMemo(() => (name?.trim()?.[0] || "A").toUpperCase(), [name]);
  const [ok, setOk] = useState(!!url);

  useEffect(() => setOk(!!url), [url]);

  return (
    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/30 bg-background flex items-center justify-center shadow-xs">
      {url && ok ? (
        <img
          src={url}
          alt="avatar"
          className="w-full h-full object-cover"
          onError={() => setOk(false)}
        />
      ) : (
        <div className="text-3xl font-serif font-bold text-gold">{initial}</div>
      )}
    </div>
  );
}

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminProfileApi.getMyProfile();
      const item = res?.item || res?.data?.item || res;

      setProfile(item);
      setName(item?.name || "");
      setPreviewUrl("");
      setFile(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Không thể tải hồ sơ tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const canSaveName = useMemo(() => {
    const n = name.trim();
    return !!profile && n && n !== (profile.name || "");
  }, [name, profile]);

  const pickFile = (f) => {
    if (!f) return;
    const okType = ["image/png", "image/jpeg", "image/webp"].includes(f.type);
    if (!okType) return toast.error("Chỉ chấp nhận định dạng PNG/JPG/WEBP");

    if (f.size > 5 * 1024 * 1024) return toast.error("Kích thước file quá lớn (tối đa 5MB)");

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const saveName = async () => {
    const n = name.trim();
    if (!n) return toast.error("Tên không được để trống");

    setSavingName(true);
    try {
      const res = await adminProfileApi.updateMyProfile({ name: n });
      const item = res?.item || res?.data?.item || res;

      setProfile(item);
      toast.success("Đã cập nhật tên hiển thị thành công");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Cập nhật tên thất bại");
    } finally {
      setSavingName(false);
    }
  };

  const uploadAvatar = async () => {
    if (!file) return toast.error("Vui lòng chọn ảnh trước khi tải lên");

    setUploading(true);
    try {
      const res = await adminProfileApi.uploadAvatar(file);
      const item = res?.item || res?.data?.item || res;

      setProfile(item);
      toast.success("Đã cập nhật ảnh đại diện thành công");
      setFile(null);
      setPreviewUrl("");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Tải lên ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const avatarUrlToShow = previewUrl || profile?.avatar_url || "";

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <SectionLabel icon={User}>Executive Profile</SectionLabel>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 tracking-tight">
            Thông tin <span className="text-gold">tài khoản quản trị</span>
          </h1>
        </div>

        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold min-h-11 cursor-pointer"
          disabled={loading}
        >
          <RefreshCcw size={15} />
          Làm mới
        </button>
      </div>

      {/* Main */}
      <div className="mt-6 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="font-serif font-bold text-foreground text-base">Hồ sơ cá nhân</div>
          <div className="text-xs text-muted-foreground font-serif">{loading ? "Đang tải..." : profile?.email || ""}</div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Avatar */}
          <div className="lg:col-span-4 rounded-2xl bg-background border border-border p-5">
            <div className="flex flex-col items-center gap-3">
              <Avatar url={avatarUrlToShow} name={profile?.name} />

              <div className="text-center">
                <div className="font-serif font-bold text-foreground text-lg">{loading ? "—" : profile?.name}</div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mt-0.5">
                  {loading ? "" : `${profile?.role || "admin"} • ${profile?.is_verified ? "Đã xác thực" : "Chưa xác thực"}`}
                </div>
              </div>

              <div className="w-full mt-3 pt-3 border-t border-border">
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Thay đổi ảnh đại diện</label>

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-medium min-h-10">
                    <Camera size={15} />
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0])}
                      disabled={uploading || loading}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={uploadAvatar}
                    disabled={!file || uploading || loading}
                    className="px-4 py-2 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs min-h-10 cursor-pointer disabled:opacity-40"
                  >
                    {uploading ? "Đang tải..." : "Cập nhật"}
                  </button>
                </div>

                <div className="text-[11px] text-muted-foreground mt-2">Định dạng PNG/JPG/WEBP • tối đa 5MB</div>
              </div>
            </div>
          </div>

          {/* Right: Edit name */}
          <div className="lg:col-span-8 rounded-2xl bg-background border border-border p-5 flex flex-col justify-between">
            <div>
              <div className="font-serif font-bold text-foreground text-base">Chỉnh sửa thông tin</div>
              <div className="text-xs text-muted-foreground mt-0.5">Cập nhật tên hiển thị của tài khoản quản trị trên toàn hệ thống.</div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Tên hiển thị</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                    placeholder="Nhập tên..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-medium">Email hệ thống (Chỉ đọc)</label>
                  <input
                    value={loading ? "" : profile?.email || ""}
                    readOnly
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-muted-foreground min-h-11 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setName(profile?.name || "");
                  toast.info("Đã hoàn tác tên theo hồ sơ ban đầu");
                }}
                disabled={loading}
                className="min-h-11 px-5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold cursor-pointer"
              >
                Hoàn tác
              </button>

              <button
                type="button"
                onClick={saveName}
                disabled={!canSaveName || savingName || loading}
                className="inline-flex items-center gap-2 min-h-11 px-6 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer disabled:opacity-40"
              >
                <Save size={15} />
                {savingName ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
