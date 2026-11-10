import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  RefreshCcw,
  Tag,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAdminOrders } from "./hooks/useAdminOrders";
import { formatVND } from "../../utils/adminFormat";
import OrderDetailModal from "./components/AdminOrderDetailModal";
import { useAdminOrderDetail } from "./hooks/useAdminOrderDetail";
import PaginationBar from "../../Components/PaginationBar";
import { SectionLabel } from "@/Components/site/primitives";

const STATUS_META = {
  received: {
    label: "Chờ xử lý",
    className: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20",
  },
  preparing: {
    label: "Đang chuẩn bị",
    className: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20",
  },
  ready: {
    label: "Sẵn sàng",
    className: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  },
  completed: {
    label: "Hoàn tất",
    className: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const normalizeQuery = (s) =>
  String(s || "")
    .trim()
    .replace(/^#/, "")
    .toLowerCase();

function formatDateTime(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function StatusPill({ status }) {
  const meta =
    STATUS_META[status] || {
      label: status || "—",
      className: "bg-muted text-muted-foreground border-border",
    };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      <td className="py-4 pr-3 pl-5">
        <div className="h-4 w-36 bg-muted/40 rounded-sm animate-pulse" />
        <div className="mt-2 h-3 w-20 bg-muted/40 rounded-sm animate-pulse" />
      </td>

      <td className="hidden sm:table-cell py-4 px-3">
        <div className="h-4 w-28 bg-muted/40 rounded-sm animate-pulse" />
        <div className="mt-2 h-3 w-36 bg-muted/40 rounded-sm animate-pulse" />
      </td>

      <td className="py-4 px-3">
        <div className="h-6 w-24 bg-muted/40 rounded-full animate-pulse" />
      </td>

      <td className="hidden sm:table-cell py-4 px-3">
        <div className="h-4 w-14 bg-muted/40 rounded-sm animate-pulse" />
        <div className="mt-2 h-3 w-28 bg-muted/40 rounded-sm animate-pulse" />
      </td>

      <td className="py-4 pl-3 pr-5 text-right">
        <div className="ml-auto h-4 w-24 bg-muted/40 rounded-sm animate-pulse" />
        <div className="hidden sm:block mt-2 ml-auto h-3 w-20 bg-muted/40 rounded-sm animate-pulse" />
      </td>
    </tr>
  );
}

export default function OrderManagement() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const resetPage = () => setPage(1);

  const params = useMemo(
    () => ({
      q: normalizeQuery(q),
      status,
      from: fromDate || "",
      to: toDate || "",
      page,
      limit,
    }),
    [q, status, fromDate, toDate, page, limit]
  );

  const { data, isLoading, error, refetch } = useAdminOrders(params);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const orders = data?.orders ?? [];
  const pagination = data?.pagination ?? { page, limit, total: 0, totalPages: 1 };
  const totalPages = pagination.totalPages || 1;

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const {
    order: orderDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useAdminOrderDetail(selectedOrderId, !!selectedOrderId);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <SectionLabel icon={ClipboardList}>Order Console</SectionLabel>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 tracking-tight">
            Quản lý <span className="text-gold">đơn hàng</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground text-xs">
            Tổng cộng:{" "}
            <span className="font-serif font-bold text-gold text-sm">
              {isLoading ? "—" : pagination.total}
            </span>{" "}
            đơn
          </div>

          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold min-h-11"
            type="button"
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
              <div className="md:col-span-5">
                <label className="text-xs text-muted-foreground mb-1 block">Tìm kiếm</label>
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <input
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      resetPage();
                    }}
                    placeholder="Mã đơn hàng - Tên bàn..."
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition min-h-11"
                  />
                </div>
              </div>

              {/* From */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Từ ngày</label>
                <div className="relative">
                  <Calendar
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      resetPage();
                    }}
                    className="w-full bg-background border border-border rounded-xl pl-3 pr-10 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11"
                  />
                </div>
              </div>

              {/* To */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Đến ngày</label>
                <div className="relative">
                  <Calendar
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      resetPage();
                    }}
                    className="w-full bg-background border border-border rounded-xl pl-3 pr-10 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="md:col-span-3">
                <label className="text-xs text-muted-foreground mb-1 block">Trạng thái</label>
                <div className="relative">
                  <Tag
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={15}
                  />
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      resetPage();
                    }}
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="received">Chờ xử lý</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="ready">Sẵn sàng</option>
                    <option value="completed">Hoàn tất</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <div>
                Trang <span className="font-serif font-bold text-foreground">{pagination.page}</span> /{" "}
                <span className="font-serif font-bold text-foreground">{totalPages}</span>
              </div>
              <div>
                Hiển thị <span className="font-serif font-bold text-gold">{orders.length}</span> /{" "}
                <span className="font-serif font-bold text-foreground">{pagination.total}</span> đơn
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="font-serif font-bold text-foreground text-base">Danh sách đơn hàng</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-0 sm:min-w-225">
            <thead className="bg-secondary/30 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="py-3.5 pr-3 pl-5 w-[55%] sm:w-44">Mã / Bàn</th>
                <th className="hidden sm:table-cell py-3.5 px-3 w-55">Thời gian</th>
                <th className="py-3.5 px-3 w-[20%] sm:w-44">Trạng thái</th>
                <th className="hidden sm:table-cell py-3.5 px-3 w-36">Số món</th>
                <th className="py-3.5 pl-3 pr-5 text-right w-[25%] sm:w-48">Tổng tiền</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : orders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className="hover:bg-accent/40 transition cursor-pointer group"
                    title="Click để xem chi tiết"
                  >
                    <td className="py-4 pr-3 pl-5 align-top">
                      <div className="font-serif font-bold text-foreground group-hover:text-gold transition break-all sm:break-normal text-sm">
                        #{o?.id?.slice(0, 8) ?? "—"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {o.tableName ?? "—"}
                      </div>
                    </td>

                    <td className="hidden sm:table-cell py-4 px-3 align-top">
                      <div className="text-xs text-foreground">
                        {formatDateTime(o.createdAt)}
                      </div>
                      {o.updatedAt ? (
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Cập nhật: {formatDateTime(o.updatedAt)}
                        </div>
                      ) : null}
                    </td>

                    <td className="py-4 px-3 align-top">
                      <StatusPill status={o.status} />
                    </td>

                    <td className="hidden sm:table-cell py-4 px-3 align-top">
                      <div className="text-xs font-serif font-bold text-foreground">
                        {o.totalItems ?? "—"} món
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[140px]">
                        {o.note ? `Note: ${o.note}` : "—"}
                      </div>
                    </td>

                    <td className="py-4 pl-3 pr-5 align-top text-right">
                      <div className="font-serif font-bold text-gold text-base">
                        {typeof o.totalAmount === "number" ? formatVND(o.totalAmount) : "—"}
                      </div>
                      <div className="hidden sm:block text-[11px] text-muted-foreground mt-0.5">
                        {o.paymentMethod ? `PT: ${o.paymentMethod}` : "—"}
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="font-serif font-bold text-foreground text-base">Không có đơn phù hợp</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Thử đổi bộ lọc hoặc khoảng ngày, hoặc kiểm tra lại mã đơn.
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

      <OrderDetailModal
        open={!!selectedOrderId}
        order={orderDetail}
        loading={isDetailLoading}
        error={detailError}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
