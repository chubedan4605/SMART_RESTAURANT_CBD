import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Components/ConfirmModal";
import CreateCategoryModal from "./CreateCategoryModal";
import { adminMenuApi } from "../../../services/adminMenuApi";
import { Archive, RefreshCcw, Search, Plus } from "lucide-react";

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1 font-medium">{label}</div>
      {children}
    </div>
  );
}

function CategoryEditModal({ open, initial, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name || "");
    setDescription(initial?.description || "");
    setDisplayOrder(Number(initial?.display_order ?? 0));
    setStatus(initial?.status || "active");
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <ConfirmModal
      open={open}
      title="Chỉnh sửa danh mục"
      confirmText="Lưu thay đổi"
      cancelText="Huỷ"
      loading={loading}
      description={
        <div className="space-y-3 mt-3">
          <Field label="Tên danh mục">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
            />
          </Field>

          <Field label="Mô tả">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Thứ tự hiển thị">
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value || 0))}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
              />
            </Field>

            <Field label="Trạng thái">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2 text-xs bg-background text-foreground border border-border focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
              >
                <option value="active">Hoạt động (active)</option>
                <option value="inactive">Ngưng hoạt động (inactive)</option>
              </select>
            </Field>
          </div>
        </div>
      }
      onClose={() => {
        if (loading) return;
        onClose?.();
      }}
      onConfirm={async () => {
        try {
          if (!initial?.id) return toast.error("Thiếu ID danh mục");
          if (!name.trim()) return toast.error("Tên danh mục không được để trống");

          setLoading(true);

          const payload = {
            name: name.trim(),
            description: description?.trim() || null,
            displayOrder: Number(displayOrder) || 0,
            status,
          };

          await adminMenuApi.updateCategory(initial.id, payload);
          toast.success("Đã cập nhật danh mục thành công");
          onSuccess?.();
        } catch (e) {
          toast.error(e?.response?.data?.message || "Thao tác thất bại");
        } finally {
          setLoading(false);
        }
      }}
    />
  );
}

export default function CategoryManagerPanel({ onReloadMenuItems, onReloadCategories }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editCat, setEditCat] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteCat, setDeleteCat] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [requireMove, setRequireMove] = useState(false);
  const [moveToCategoryId, setMoveToCategoryId] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminMenuApi.getListCategories({
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      });
      setCategories(res?.categories || res || []);
    } catch {
      toast.error("Không tải được danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return categories.filter((c) => {
      if (t && !String(c.name || "").toLowerCase().includes(t)) return false;
      return true;
    });
  }, [categories, q]);

  const closeDeleteModal = () => {
    if (deleting) return;
    setConfirmOpen(false);
    setDeleteCat(null);
    setMoveToCategoryId("");
    setRequireMove(false);
  };

  const afterDeleted = async () => {
    await fetchCategories();
    onReloadCategories?.();
    onReloadMenuItems?.();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCat?.id) return;

    try {
      setDeleting(true);

      if (!requireMove) {
        await adminMenuApi.deleteCategory(deleteCat.id);
        toast.success("Đã xoá danh mục");
        closeDeleteModal();
        await afterDeleted();
        return;
      }

      if (!moveToCategoryId) {
        toast.error("Vui lòng chọn danh mục thay thế");
        return;
      }

      await adminMenuApi.deleteCategory(deleteCat.id, { moveToCategoryId });
      toast.success("Đã xoá danh mục & chuyển món");
      closeDeleteModal();
      await afterDeleted();
    } catch (e) {
      const msg = e?.response?.data?.message || "Không thể xoá danh mục";
      const needMove = /chọn category thay thế|còn món|chuyển món/i.test(String(msg));

      if (needMove) {
        setRequireMove(true);
        toast.info("Danh mục còn món ăn — hãy chọn danh mục thay thế để chuyển món trước khi xoá.");
      } else {
        toast.error(msg);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
      <div className="px-5 py-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <Archive size={18} />
          </div>
          <div>
            <div className="font-serif font-bold text-foreground text-base leading-tight">Danh mục thực đơn</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {loading ? "Đang tải..." : `${categories.length} danh mục đã tạo`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm danh mục..."
              className="bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 min-h-10 cursor-pointer"
          >
            <option value="ALL">Tất cả</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs min-h-10 cursor-pointer"
          >
            <Plus size={15} />
            Thêm danh mục
          </button>
          <button
            onClick={() => fetchCategories()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-medium min-h-10 cursor-pointer"
          >
            <RefreshCcw size={14} />
            Làm mới
          </button>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="text-muted-foreground text-xs py-4 text-center">Đang tải danh mục...</div>
        ) : filtered.length === 0 ? (
          <div className="text-muted-foreground text-xs py-4 text-center">Không tìm thấy danh mục phù hợp</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="rounded-xl bg-background border border-border p-4 flex items-center justify-between hover:border-gold/30 transition group"
              >
                <div>
                  <div className="font-serif font-bold text-foreground text-base group-hover:text-gold transition">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Trạng thái: <span className="font-medium text-foreground">{c.status}</span> • Thứ tự: {c.display_order ?? 0}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    className="px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-medium text-foreground hover:border-gold/40 hover:text-gold transition cursor-pointer"
                    onClick={() => {
                      setEditCat(c);
                      setOpenEdit(true);
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    className="px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/20 transition cursor-pointer"
                    onClick={() => {
                      setDeleteCat(c);
                      setMoveToCategoryId("");
                      setRequireMove(false);
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

      <CreateCategoryModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          setOpenCreate(false);
          fetchCategories();
          onReloadCategories?.();
          onReloadMenuItems?.();
        }}
      />

      <CategoryEditModal
        open={openEdit}
        initial={editCat}
        onClose={() => {
          setOpenEdit(false);
          setEditCat(null);
        }}
        onSuccess={() => {
          setOpenEdit(false);
          setEditCat(null);
          fetchCategories();
          onReloadMenuItems?.();
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        danger
        title="Xoá danh mục"
        confirmText={requireMove ? "Chuyển món & xoá" : "Xoá danh mục"}
        cancelText="Huỷ"
        loading={deleting}
        description={
          <div className="space-y-3 mt-2">
            <div className="text-foreground text-sm">
              Bạn có chắc muốn xoá danh mục "<b>{deleteCat?.name}</b>" không?
            </div>

            {!requireMove ? (
              <div className="text-xs text-muted-foreground">
                Hệ thống sẽ tự kiểm tra: nếu danh mục còn món, bạn sẽ được yêu cầu chọn danh mục thay thế.
              </div>
            ) : (
              <>
                <div className="text-xs text-destructive font-medium">
                  Danh mục này còn món ăn. Hãy chọn danh mục thay thế để chuyển món sang trước khi xoá.
                </div>

                <select
                  value={moveToCategoryId}
                  onChange={(e) => setMoveToCategoryId(e.target.value)}
                  className="w-full bg-background text-foreground border border-border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                >
                  <option value="">-- Chọn danh mục thay thế --</option>
                  {categories
                    .filter((x) => x.id !== deleteCat?.id)
                    .map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                </select>
              </>
            )}
          </div>
        }
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
