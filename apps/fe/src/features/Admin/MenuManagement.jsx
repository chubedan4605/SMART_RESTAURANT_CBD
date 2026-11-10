import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  UtensilsCrossed,
  Search,
  Filter,
  RefreshCcw,
  Tag,
  ArrowUpDown,
  Star,
  Plus,
} from "lucide-react";

import { useAdminMenuItems } from "./hooks/useAdminMenuItems";
import { useAdminMenuCategories } from "./hooks/useAdminMenuCategories";
import { formatVND } from "../../utils/adminFormat";
import AdminMenuItemDetailModal from "./components/AdminMenuItemDetailModal";
import PaginationBar from "../../Components/PaginationBar";
import ToggleSwitch from "../../Components/ToggleSwitch";
import { useToggleChefRecommended } from "../../hooks/useToggleChefRecommended";
import CreateMenuItemModal from "./components/CreateMenuItemModal";
import EditMenuItemModal from "./components/EditMenuItemModal";
import ConfirmModal from "../../Components/ConfirmModal";
import CategoryManagerPanel from "./components/CategoryManagerPanel";
import ModifierManagerPanel from "./components/ModifierManagerPanel";
import { adminMenuApi } from "../../services/adminMenuApi";
import { SectionLabel } from "@/Components/site/primitives";

const STATUS_META = {
  available: { label: "Có sẵn", className: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20" },
  unavailable: { label: "Tạm ngưng", className: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20" },
  sold_out: { label: "Hết hàng", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || { label: status || "—", className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function formatDate(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleDateString("vi-VN");
}

function MenuItemCard({
  it,
  onOpenDetail,
  onEdit,
  onDelete,
  statusLoading,
  chefLoading,
  onToggleStatus,
  onToggleChef,
}) {
  return (
    <div
      className="p-4 transition cursor-pointer hover:bg-accent/40 bg-card border-b border-border/50"
      onClick={onOpenDetail}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-serif font-bold text-foreground truncate text-base">{it.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">{it.categoryName || "—"}</div>
          <div className="text-[11px] text-muted-foreground/80 mt-1">
            Ngày tạo: {formatDate(it.createdAt || it.created_at)}
          </div>
        </div>

        <div className="text-right">
          <div className="font-serif font-bold text-gold text-base">
            {typeof it.price === "number" ? formatVND(it.price) : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Prep: {it.prepTimeMinutes ?? 0} phút</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={it.status === "available"}
            disabled={statusLoading || it.status === "sold_out"}
            onChange={onToggleStatus}
            label="Trạng thái món"
          />
          <StatusPill status={it.status} />
        </div>

        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={!!it.isChefRecommended}
            disabled={chefLoading}
            onChange={onToggleChef}
            label="Chef recommend"
          />
          <span className={`text-xs font-medium ${it.isChefRecommended ? "text-gold" : "text-muted-foreground"}`}>
            {it.isChefRecommended ? "Chef Pick" : "Thường"}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="min-h-9 px-3 rounded-lg bg-background border border-border text-xs font-medium text-foreground hover:border-gold/40 hover:text-gold transition cursor-pointer"
          onClick={onEdit}
        >
          Sửa
        </button>

        <button
          type="button"
          className="min-h-9 px-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/20 transition cursor-pointer"
          onClick={onDelete}
        >
          Xoá
        </button>
      </div>
    </div>
  );
}

function MenuItemCardSkeleton() {
  return (
    <div className="p-4 border-b border-border/50 bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-40 bg-muted/40 rounded-sm animate-pulse" />
          <div className="mt-2 h-3 w-24 bg-muted/40 rounded-sm animate-pulse" />
        </div>
        <div className="text-right">
          <div className="h-4 w-20 bg-muted/40 rounded-sm animate-pulse ml-auto" />
          <div className="mt-2 h-3 w-16 bg-muted/40 rounded-sm animate-pulse ml-auto" />
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="h-6 w-28 bg-muted/40 rounded-full animate-pulse" />
        <div className="h-6 w-24 bg-muted/40 rounded-full animate-pulse" />
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <div className="h-8 w-16 bg-muted/40 rounded-sm animate-pulse" />
        <div className="h-8 w-16 bg-muted/40 rounded-sm animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      <td className="py-4 pr-3 pl-5">
        <div className="h-4 w-40 bg-muted/40 rounded-sm animate-pulse" />
        <div className="mt-2 h-3 w-24 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 w-24 bg-muted/40 rounded-full animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 w-20 bg-muted/40 rounded-full animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-4 w-16 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-8 w-24 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 pl-3 pr-5 text-right">
        <div className="ml-auto h-4 w-24 bg-muted/40 rounded-sm animate-pulse" />
      </td>
    </tr>
  );
}

export default function MenuManagement() {
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [chefOnly, setChefOnly] = useState(false);
  const [sort, setSort] = useState("NEWEST");

  const [openCreateItem, setOpenCreateItem] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { toggle: toggleChef } = useToggleChefRecommended();

  const toggleStatus = async (it, nextChecked) => {
    const id = it.id;
    const prevStatus = it.status;
    const nextStatus = nextChecked ? "available" : "unavailable";

    setUiItems((cur) =>
      cur.map((x) => (x.id === id ? { ...x, status: nextStatus } : x))
    );
    setStatusMap((m) => ({ ...m, [id]: true }));

    try {
      await adminMenuApi.updateMenuItem(id, { status: nextStatus });
      toast.success(`Đã đổi trạng thái: ${nextStatus === "available" ? "Có sẵn" : "Tạm ngưng"}`);
    } catch (err) {
      setUiItems((cur) =>
        cur.map((x) => (x.id === id ? { ...x, status: prevStatus } : x))
      );
      toast.error(err?.response?.data?.message || "Đổi trạng thái thất bại");
    } finally {
      setStatusMap((m) => {
        const clone = { ...m };
        delete clone[id];
        return clone;
      });
    }
  };

  const params = useMemo(
    () => ({
      q,
      categoryId,
      status,
      chef: chefOnly ? "true" : "",
      sort,
      page,
      limit,
    }),
    [q, categoryId, status, chefOnly, sort, page, limit]
  );

  const {
    categories,
    isLoading: catLoading,
    refetch: refetchCategories,
  } = useAdminMenuCategories();
  const { data, isLoading, refetch } = useAdminMenuItems(params);

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { page, limit, total: 0, totalPages: 1 };

  const [uiItems, setUiItems] = useState([]);
  useEffect(() => {
    setUiItems(items);
  }, [items]);

  useEffect(() => {
    if (categoryId === "ALL") return;
    const exists = categories.some((c) => c.id === categoryId);
    if (!exists) setCategoryId("ALL");
  }, [categories, categoryId]);

  const [togglingMap, setTogglingMap] = useState({});
  const [statusMap, setStatusMap] = useState({});

  const totalPages = pagination.totalPages || 1;

  const refreshAll = () => {
    refetch();
  };

  const resetPage = () => setPage(1);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <SectionLabel icon={UtensilsCrossed}>Menu Catalog</SectionLabel>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 tracking-tight">
            Quản lý <span className="text-gold">thực đơn</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground text-xs">
            Tổng cộng:{" "}
            <span className="font-serif font-bold text-gold text-sm">
              {isLoading ? "—" : pagination.total}
            </span>{" "}
            món
          </div>

          <button
            onClick={() => setOpenCreateItem(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs min-h-11 cursor-pointer"
          >
            <Plus size={16} />
            Thêm món mới
          </button>

          <button
            onClick={refreshAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold min-h-11 cursor-pointer"
          >
            <RefreshCcw size={15} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl bg-card border border-border p-5 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Filter size={15} />
              </div>
              <span className="text-xs uppercase tracking-luxe text-muted-foreground font-semibold">
                Bộ lọc tìm kiếm
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* Search */}
              <div className="md:col-span-4">
                <label className="text-xs text-muted-foreground mb-1 block">Tìm theo tên</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      resetPage();
                    }}
                    placeholder="VD: Wagyu, Pasta, Rượu vang..."
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition min-h-11"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="md:col-span-3">
                <label className="text-xs text-muted-foreground mb-1 block">Danh mục</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      resetPage();
                    }}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                  >
                    <option value="ALL">Tất cả danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="md:col-span-3">
                <label className="text-xs text-muted-foreground mb-1 block">Trạng thái</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      resetPage();
                    }}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="available">Có sẵn</option>
                    <option value="unavailable">Tạm ngưng</option>
                    <option value="sold_out">Hết hàng</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Sắp xếp</label>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      resetPage();
                    }}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                  >
                    <option value="NEWEST">Mới nhất</option>
                    <option value="OLDEST">Cũ nhất</option>
                    <option value="PRICE_ASC">Giá tăng dần</option>
                    <option value="PRICE_DESC">Giá giảm dần</option>
                    <option value="NAME_ASC">Tên A → Z</option>
                    <option value="NAME_DESC">Tên Z → A</option>
                    <option value="POPULAR">Phổ biến</option>
                  </select>
                </div>
              </div>

              {/* Chef */}
              <div className="md:col-span-12 flex items-center justify-between gap-3 pt-2 border-t border-border mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setChefOnly((v) => !v);
                    resetPage();
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition cursor-pointer min-h-10
                    ${chefOnly
                      ? "bg-gold/15 border-gold/40 text-gold"
                      : "bg-background border-border text-foreground hover:border-gold/40 hover:text-gold"}`}
                >
                  <Star size={15} className={chefOnly ? "text-gold fill-gold" : "text-muted-foreground"} />
                  Chỉ món Chef khuyên dùng
                </button>

                <div className="text-xs text-muted-foreground">
                  {catLoading ? "Đang tải danh mục..." : `${categories.length} danh mục khả dụng`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="font-serif font-bold text-foreground text-base">Danh sách món ăn</div>
          <div className="text-xs text-muted-foreground">Nhấp vào dòng để xem chi tiết & modifiers</div>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-245">
            <thead className="bg-secondary/30 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="py-3.5 pr-3 pl-5 w-[38%]">Món / Danh mục</th>
                <th className="py-3.5 px-3 w-[16%]">Trạng thái</th>
                <th className="py-3.5 px-3 w-[14%]">Chef Pick</th>
                <th className="py-3.5 px-3 w-[12%]">Ngày tạo</th>
                <th className="py-3.5 px-3 w-[10%] text-center">Thao tác</th>
                <th className="py-3.5 pl-3 pr-5 text-right w-[10%]">Đơn giá</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {isLoading
                ? Array.from({ length: limit }).slice(0, 8).map((_, i) => <SkeletonRow key={i} />)
                : uiItems.map((it) => (
                  <tr
                    key={it.id}
                    onClick={() => setDetailItem(it)}
                    className="hover:bg-accent/40 transition cursor-pointer group"
                  >
                    <td className="py-4 pr-3 pl-5 align-top">
                      <div className="font-serif font-bold text-foreground group-hover:text-gold transition text-base">{it.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{it.categoryName || "—"}</div>
                    </td>

                    <td
                      className="py-4 px-3 align-top"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={it.status === "available"}
                          disabled={!!statusMap[it.id] || it.status === "sold_out"}
                          onChange={(nextChecked) => toggleStatus(it, nextChecked)}
                          label="Trạng thái món"
                        />
                        <StatusPill status={it.status} />
                      </div>
                    </td>

                    <td className="py-4 px-3 align-top">
                      <div
                        className="inline-flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ToggleSwitch
                          checked={!!it.isChefRecommended}
                          disabled={!!togglingMap[it.id]}
                          onChange={async (next) => {
                            const id = it.id;
                            const prev = !!it.isChefRecommended;

                            setUiItems((cur) =>
                              cur.map((x) =>
                                x.id === id ? { ...x, isChefRecommended: next } : x
                              )
                            );
                            setTogglingMap((m) => ({ ...m, [id]: true }));

                            try {
                              await toggleChef(id, next);
                            } catch {
                              setUiItems((cur) =>
                                cur.map((x) =>
                                  x.id === id ? { ...x, isChefRecommended: prev } : x
                                )
                              );
                            } finally {
                              setTogglingMap((m) => {
                                const clone = { ...m };
                                delete clone[id];
                                return clone;
                              });
                            }
                          }}
                          label="Chef recommended"
                        />

                        <span
                          className={`text-xs font-medium ${
                            it.isChefRecommended ? "text-gold" : "text-muted-foreground"
                          }`}
                        >
                          {it.isChefRecommended ? "Có" : "Không"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-3 align-top">
                      <div className="text-xs text-foreground">
                        {formatDate(it.createdAt || it.created_at)}
                      </div>
                    </td>

                    <td
                      className="py-4 px-3 align-top text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-background border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-medium cursor-pointer"
                          onClick={() => {
                            setEditItem(it);
                            setEditOpen(true);
                          }}
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition text-xs font-medium cursor-pointer"
                          onClick={() => {
                            setDeleteItem(it);
                            setConfirmOpen(true);
                          }}
                        >
                          Xoá
                        </button>
                      </div>
                    </td>

                    <td className="py-4 pl-3 pr-5 align-top text-right">
                      <div className="font-serif font-bold text-gold text-base">
                        {typeof it.price === "number" ? formatVND(it.price) : "—"}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Prep: {it.prepTimeMinutes ?? 0} phút
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="font-serif font-bold text-foreground text-base">Không có món phù hợp</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-border/50">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <MenuItemCardSkeleton key={i} />)
            : uiItems.map((it) => (
              <MenuItemCard
                key={it.id}
                it={it}
                onOpenDetail={() => setDetailItem(it)}
                onEdit={() => { setEditItem(it); setEditOpen(true); }}
                onDelete={() => { setDeleteItem(it); setConfirmOpen(true); }}
                statusLoading={!!statusMap[it.id]}
                chefLoading={!!togglingMap[it.id]}
                onToggleStatus={(next) => toggleStatus(it, next)}
                onToggleChef={async (next) => {
                  const id = it.id;
                  const prev = !!it.isChefRecommended;

                  setUiItems((cur) => cur.map((x) => x.id === id ? { ...x, isChefRecommended: next } : x));
                  setTogglingMap((m) => ({ ...m, [id]: true }));

                  try { await toggleChef(id, next); }
                  catch { setUiItems((cur) => cur.map((x) => x.id === id ? { ...x, isChefRecommended: prev } : x)); }
                  finally {
                    setTogglingMap((m) => { const c = { ...m }; delete c[id]; return c; });
                  }
                }}
              />
            ))}
        </div>

        <PaginationBar
          page={pagination.page}
          totalPages={totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onChangeLimit={(n) => {
            setLimit(n);
            setPage(1);
          }}
        />
      </div>

      <CategoryManagerPanel
        onReloadMenuItems={refetch}
        onReloadCategories={refetchCategories}
      />

      <ModifierManagerPanel onReload={refetch} />

      <AdminMenuItemDetailModal
        open={!!detailItem}
        item={detailItem}
        onClose={() => setDetailItem(null)}
      />

      <CreateMenuItemModal
        open={openCreateItem}
        categories={categories}
        onClose={() => setOpenCreateItem(false)}
        onSuccess={() => {
          setOpenCreateItem(false);
          refetch();
        }}
      />

      <EditMenuItemModal
        open={editOpen}
        item={editItem}
        categories={categories}
        onClose={() => { setEditOpen(false); setEditItem(null); }}
        onUpdated={(updated) => {
          setUiItems((cur) => cur.map((x) => x.id === updated.id ? { ...x, ...updated } : x));
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        danger
        title="Xoá món ăn"
        description={`Bạn có chắc muốn xoá món "${deleteItem?.name}" không?`}
        confirmText="Xoá món"
        cancelText="Huỷ"
        loading={deleting}
        onClose={() => {
          if (deleting) return;
          setConfirmOpen(false);
          setDeleteItem(null);
        }}
        onConfirm={async () => {
          try {
            setDeleting(true);
            await adminMenuApi.deleteMenuItem(deleteItem.id);
            setUiItems((cur) => cur.filter((x) => x.id !== deleteItem.id));
            toast.success("Đã xoá món ăn thành công");
            setConfirmOpen(false);
            setDeleteItem(null);
          } catch (e) {
            toast.error(e?.response?.data?.message || "Xoá thất bại");
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}
