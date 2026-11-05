import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCcw,
  Shield,
  BadgeCheck,
  BadgeX,
} from "lucide-react";

import PaginationBar from "../../Components/PaginationBar";
import ConfirmModal from "../../Components/ConfirmModal";
import ToggleSwitch from "../../Components/ToggleSwitch";
import CreateStaffAccountModal from "./components/CreateStaffAccountModal";
import AccountDetailModal from "./components/AccountDetailModal";
import { adminAccountApi } from "../../services/adminAccountApi";
import { SectionLabel } from "@/Components/site/primitives";

const ROLE_META = {
  superadmin: { label: "Super Admin", className: "bg-destructive/10 text-destructive border-destructive/20" },
  admin: { label: "Admin", className: "bg-gold/15 text-gold border-gold/30" },
  waiter: { label: "Waiter", className: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20" },
  kitchen: { label: "Kitchen", className: "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20" },
  customer: { label: "Customer", className: "bg-secondary text-muted-foreground border-border" },
};

function RolePill({ role }) {
  const meta = ROLE_META[role] || { label: role || "—", className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function VerifyPill({ isVerified }) {
  return isVerified ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20">
      <BadgeCheck size={13} />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20">
      <BadgeX size={13} />
      Unverified
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      <td className="py-4 pr-3 pl-5">
        <div className="h-4 w-40 bg-muted/40 rounded-sm animate-pulse" />
        <div className="mt-2 h-3 w-28 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 w-24 bg-muted/40 rounded-full animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 w-28 bg-muted/40 rounded-full animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-6 w-20 bg-muted/40 rounded-full animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-8 w-16 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 pl-3 pr-5 text-right">
        <div className="ml-auto h-4 w-24 bg-muted/40 rounded-sm animate-pulse" />
      </td>
    </tr>
  );
}

const STAFF_ROLES = ["admin", "waiter", "kitchen", "superadmin"];
const USER_ROLES = ["customer"];

export default function AccountsManagement() {
  const [tab, setTab] = useState("USER");

  const [q, setQ] = useState("");
  const [role, setRole] = useState("ALL");
  const [verified, setVerified] = useState("ALL");
  const [sort, setSort] = useState("NEWEST");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [openCreateStaff, setOpenCreateStaff] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [uiAccounts, setUiAccounts] = useState([]);

  const params = useMemo(() => {
    const roleScope = tab === "STAFF" ? "STAFF" : "USER";
    return {
      scope: roleScope,
      q,
      role: role === "ALL" ? "" : role,
      verified: verified === "ALL" ? "" : verified,
      sort,
      page,
      limit,
    };
  }, [tab, q, role, verified, sort, page, limit]);

  const resetPage = () => setPage(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAccountApi.getAccounts(params);
      setData(res);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Không thể tải danh sách tài khoản";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [params]);

  const accounts = data?.items ?? [];
  const pagination = data?.pagination ?? { page, limit, total: 0, totalPages: 1 };
  const totalPages = pagination.totalPages || 1;

  useEffect(() => {
    setUiAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    setRole("ALL");
    setVerified("ALL");
    setQ("");
    setSort("NEWEST");
    setPage(1);
  }, [tab]);

  const roleOptions = useMemo(() => {
    const list = tab === "STAFF" ? STAFF_ROLES : USER_ROLES;
    return list;
  }, [tab]);

  const [togglingActiveMap, setTogglingActiveMap] = useState({});

  const toggleActive = async (u, nextChecked) => {
    const id = u.id;
    const prev = !!u.is_actived;

    setUiAccounts((cur) =>
      cur.map((x) => (x.id === id ? { ...x, is_actived: nextChecked } : x))
    );
    setTogglingActiveMap((m) => ({ ...m, [id]: true }));

    try {
      await adminAccountApi.setActived(id, nextChecked);
      toast.success(nextChecked ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hoá tài khoản");
    } catch (e) {
      setUiAccounts((cur) =>
        cur.map((x) => (x.id === id ? { ...x, is_actived: prev } : x))
      );
      toast.error(e?.response?.data?.message || "Đổi trạng thái thất bại");
    } finally {
      setTogglingActiveMap((m) => {
        const clone = { ...m };
        delete clone[id];
        return clone;
      });
    }
  };

  const requestDelete = (u) => {
    setConfirmTarget(u);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!confirmTarget?.id) return;
    setConfirmLoading(true);
    try {
      await adminAccountApi.deleteAccount(confirmTarget.id);
      setUiAccounts((cur) => cur.filter((x) => x.id !== confirmTarget.id));
      toast.success("Đã xoá tài khoản thành công");
      setConfirmOpen(false);
      setConfirmTarget(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Xoá thất bại");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <SectionLabel icon={Users}>Account Directory</SectionLabel>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 tracking-tight">
            Quản lý <span className="text-gold">tài khoản & phân quyền</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground text-xs">
            Tổng cộng:{" "}
            <span className="font-serif font-bold text-gold text-sm">
              {loading ? "—" : pagination.total}
            </span>{" "}
            tài khoản
          </div>

          {tab === "STAFF" && (
            <button
              onClick={() => setOpenCreateStaff(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs min-h-11 cursor-pointer"
            >
              <UserPlus size={16} />
              Thêm nhân viên
            </button>
          )}

          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold min-h-11 cursor-pointer"
          >
            <RefreshCcw size={15} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setTab("USER")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer min-h-11
            ${tab === "USER"
              ? "bg-gold/15 border-gold/40 text-gold shadow-xs"
              : "bg-card border-border text-muted-foreground hover:border-gold/30 hover:text-foreground"
            }`}
        >
          <Users size={16} />
          Khách hàng (Customer)
        </button>

        <button
          type="button"
          onClick={() => setTab("STAFF")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer min-h-11
            ${tab === "STAFF"
              ? "bg-gold/15 border-gold/40 text-gold shadow-xs"
              : "bg-card border-border text-muted-foreground hover:border-gold/30 hover:text-foreground"
            }`}
        >
          <Shield size={16} />
          Đội ngũ nhân sự (Staff)
        </button>

        {error ? (
          <div className="ml-auto text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
            {error}
          </div>
        ) : null}
      </div>

      {/* Filters */}
      <div className="mt-4 rounded-2xl bg-card border border-border p-5 shadow-xs">
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
              <div className="md:col-span-5">
                <label className="text-xs text-muted-foreground mb-1 block">Tìm theo tên / email</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      resetPage();
                    }}
                    placeholder="VD: Nguyen Van A, admin@restaurant.com..."
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition min-h-11"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="md:col-span-3">
                <label className="text-xs text-muted-foreground mb-1 block">Vai trò</label>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    resetPage();
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                >
                  <option value="ALL">Tất cả vai trò</option>
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_META[r]?.label || r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Xác thực</label>
                <select
                  value={verified}
                  onChange={(e) => {
                    setVerified(e.target.value);
                    resetPage();
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="true">Đã xác thực (Verified)</option>
                  <option value="false">Chưa xác thực</option>
                </select>
              </div>

              {/* Sort */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Sắp xếp</label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    resetPage();
                  }}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                >
                  <option value="NEWEST">Mới nhất</option>
                  <option value="OLDEST">Cũ nhất</option>
                  <option value="NAME_ASC">Tên A → Z</option>
                  <option value="NAME_DESC">Tên Z → A</option>
                </select>
              </div>

              <div className="md:col-span-12 text-xs text-muted-foreground pt-1">
                Gợi ý: Nhấp vào dòng để xem chi tiết tài khoản. Với nhân sự, bạn có thể tạo và phân quyền ngay trong modal.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="font-serif font-bold text-foreground text-base">
            {tab === "USER" ? "Danh sách khách hàng" : "Danh sách nhân sự hệ thống"}
          </div>
          <div className="text-xs text-muted-foreground">Nhấp 1 dòng để xem chi tiết</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="py-3.5 pr-3 pl-5 w-[40%] sm:w-[25%]">Tài khoản</th>
                <th className="hidden sm:table-cell py-3.5 px-3 w-[15%]">Vai trò</th>
                <th className="hidden sm:table-cell py-3.5 px-3 w-[15%]">Xác thực</th>
                <th className="py-3.5 px-3 w-[15%] sm:w-[15%]">Trạng thái</th>
                <th className="hidden sm:table-cell py-3.5 px-3 w-[15%] text-center">Thao tác</th>
                <th className="hidden sm:table-cell py-3.5 pl-3 pr-5 text-right w-[15%]">Ngày tạo</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {loading
                ? Array.from({ length: limit }).slice(0, 8).map((_, i) => <SkeletonRow key={i} />)
                : uiAccounts.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setDetailUser(u)}
                    className="hover:bg-accent/40 transition cursor-pointer group"
                  >
                    <td className="py-4 pr-3 pl-5 align-top">
                      <div className="font-serif font-bold text-foreground group-hover:text-gold transition text-base">{u.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 break-all sm:break-normal">{u.email}</div>
                    </td>

                    <td className="hidden sm:table-cell py-4 px-3 align-top">
                      <RolePill role={u.role} />
                    </td>

                    <td className="hidden sm:table-cell py-4 px-3 align-top">
                      <VerifyPill isVerified={!!u.is_verified} />
                    </td>

                    <td className="py-4 px-3 align-top" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2.5">
                        <ToggleSwitch
                          checked={!!u.is_actived}
                          disabled={!!togglingActiveMap[u.id]}
                          onChange={(next) => toggleActive(u, next)}
                          label="Trạng thái hoạt động"
                        />
                        <span
                          className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider
                          ${u.is_actived
                              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                            }`}
                        >
                          {u.is_actived ? "Hoạt động" : "Khóa"}
                        </span>
                      </div>
                    </td>

                    <td className="hidden sm:table-cell py-4 px-3 align-top text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 text-xs font-medium transition cursor-pointer"
                        onClick={() => requestDelete(u)}
                      >
                        Xoá
                      </button>
                    </td>

                    <td className="hidden sm:table-cell py-4 pl-3 pr-5 align-top text-right">
                      <div className="text-muted-foreground text-xs font-serif">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString("vi-VN") : "—"}
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && uiAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="font-serif font-bold text-foreground text-base">Không có tài khoản phù hợp</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
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

      {/* Modals */}
      <CreateStaffAccountModal
        open={openCreateStaff}
        onClose={() => setOpenCreateStaff(false)}
        onSuccess={() => {
          setOpenCreateStaff(false);
          refetch();
        }}
      />

      <AccountDetailModal
        open={!!detailUser}
        item={detailUser}
        onClose={() => setDetailUser(null)}
        onUpdated={(updated) => {
          setDetailUser(updated);
          setUiAccounts((cur) => cur.map((x) => x.id === updated.id ? { ...x, ...updated } : x));
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        danger
        title="Xoá tài khoản"
        description={`Bạn có chắc muốn xoá tài khoản "${confirmTarget?.email}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xoá tài khoản"
        cancelText="Huỷ"
        loading={confirmLoading}
        onClose={() => {
          if (confirmLoading) return;
          setConfirmOpen(false);
          setConfirmTarget(null);
        }}
        onConfirm={doDelete}
      />
    </div>
  );
}
