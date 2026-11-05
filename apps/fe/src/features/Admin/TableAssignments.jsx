import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { tableApi } from "../../services/tableApi";

import {
  ClipboardList,
  RefreshCcw,
  Save,
  Search,
  Filter,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { SectionLabel } from "@/Components/site/primitives";

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      <td className="py-4 pr-3 pl-5">
        <div className="h-4 w-4 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-4 w-28 bg-muted/40 rounded-sm animate-pulse" />
        <div className="mt-2 h-3 w-36 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 px-3">
        <div className="h-4 w-20 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="hidden sm:table-cell py-4 px-3">
        <div className="h-4 w-16 bg-muted/40 rounded-sm animate-pulse" />
      </td>
      <td className="py-4 pl-3 pr-5 text-right">
        <div className="h-6 w-24 bg-muted/40 rounded-full animate-pulse ml-auto" />
      </td>
    </tr>
  );
}

function StatusPill({ checked }) {
  return checked ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase bg-gold/15 text-gold border-gold/30">
      Đã phân công
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase bg-secondary text-muted-foreground border-border">
      Chưa gán
    </span>
  );
}

export default function TableAssignments() {
  const [waiters, setWaiters] = useState([]);
  const [tables, setTables] = useState([]);

  const [selectedWaiterId, setSelectedWaiterId] = useState("");

  const [q, setQ] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [onlyAssigned, setOnlyAssigned] = useState("ALL");

  const [assignedTableIds, setAssignedTableIds] = useState(new Set());
  const [initialAssignedIds, setInitialAssignedIds] = useState(new Set());

  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedWaiter = useMemo(
    () => waiters.find((w) => w.id === selectedWaiterId),
    [waiters, selectedWaiterId]
  );

  const dirty = useMemo(() => {
    if (assignedTableIds.size !== initialAssignedIds.size) return true;
    for (const id of assignedTableIds) if (!initialAssignedIds.has(id)) return true;
    return false;
  }, [assignedTableIds, initialAssignedIds]);

  const fetchInit = async () => {
    setLoadingInit(true);
    try {
      const [wItems, tItems] = await Promise.all([
        tableApi.getWaiters(),
        tableApi.getTables({ status: "active" }),
      ]);

      setWaiters(wItems);
      setTables(tItems);
    } catch {
      toast.error("Không tải được dữ liệu bàn & nhân viên");
    } finally {
      setLoadingInit(false);
    }
  };

  const fetchAssignments = async (waiterId) => {
    if (!waiterId) return;
    setLoadingAssign(true);
    try {
      const res = await tableApi.getTableAssignmentsByWaiter(waiterId);
      const ids = new Set((res.tableIds || []).map(String));
      setAssignedTableIds(ids);
      setInitialAssignedIds(new Set(ids));
    } catch {
      toast.error("Không tải được danh sách phân công");
    } finally {
      setLoadingAssign(false);
    }
  };

  useEffect(() => {
    fetchInit();
  }, []);

  useEffect(() => {
    if (!selectedWaiterId) {
      setAssignedTableIds(new Set());
      setInitialAssignedIds(new Set());
      return;
    }
    fetchAssignments(selectedWaiterId);
  }, [selectedWaiterId]);

  const toggleTable = (tableId) => {
    if (!selectedWaiterId) {
      toast.info("Vui lòng chọn nhân viên phục vụ trước");
      return;
    }
    setAssignedTableIds((prev) => {
      const next = new Set(prev);
      const key = String(tableId);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const save = async () => {
    if (!selectedWaiterId) {
      toast.error("Vui lòng chọn nhân viên phục vụ trước");
      return;
    }

    setSaving(true);
    try {
      const tableIds = Array.from(assignedTableIds);
      const res = await tableApi.saveTableAssignmentsByWaiter(selectedWaiterId, tableIds);

      const savedIds = new Set((res.tableIds || tableIds).map(String));
      setAssignedTableIds(savedIds);
      setInitialAssignedIds(new Set(savedIds));
      toast.success("Đã lưu phân công bàn thành công");
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Lưu phân công thất bại");
    } finally {
      setSaving(false);
    }
  };

  const resetToInitial = () => {
    setAssignedTableIds(new Set(initialAssignedIds));
    toast.info("Đã hoàn tác thay đổi");
  };

  const filteredTables = useMemo(() => {
    const kw = q.trim().toLowerCase();

    return (tables || [])
      .filter((t) => {
        if (locationFilter !== "ALL" && t.location !== locationFilter) return false;

        const isAssigned = assignedTableIds.has(String(t.id));
        if (onlyAssigned === "YES" && !isAssigned) return false;
        if (onlyAssigned === "NO" && isAssigned) return false;

        if (!kw) return true;

        const name = String(t.table_number || "").toLowerCase();
        const loc = String(t.location || "").toLowerCase();
        return name.includes(kw) || loc.includes(kw);
      })
      .sort((a, b) => String(a.table_number).localeCompare(String(b.table_number)));
  }, [tables, q, locationFilter, onlyAssigned, assignedTableIds]);

  const assignedCount = useMemo(() => assignedTableIds.size, [assignedTableIds]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <SectionLabel icon={ClipboardList}>Floor Operations</SectionLabel>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 tracking-tight">
            Phân công <span className="text-gold">bàn cho phục vụ</span>
          </h1>

          <div className="text-xs text-muted-foreground mt-2">
            {selectedWaiter ? (
              <>
                Phục vụ đang chọn:{" "}
                <span className="font-serif font-bold text-foreground text-sm">{selectedWaiter.name}</span>{" "}
                <span className="text-muted-foreground/80">({selectedWaiter.email})</span>
              </>
            ) : (
              <>Chọn một nhân viên phục vụ để bắt đầu cấu hình khu vực bàn quản lý.</>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground text-xs">
            Bàn được gán:{" "}
            <span className="font-serif font-bold text-gold text-sm">
              {selectedWaiterId ? assignedCount : "—"}
            </span>
          </div>

          <button
            onClick={fetchInit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-semibold min-h-11 cursor-pointer"
          >
            <RefreshCcw size={15} />
            Làm mới
          </button>

          <button
            onClick={save}
            disabled={!selectedWaiterId || saving || loadingInit || loadingAssign}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs min-h-11 cursor-pointer disabled:opacity-50"
            title={!dirty ? "Không có thay đổi mới" : "Lưu phân công"}
          >
            <Save size={15} />
            {saving ? "Đang lưu..." : "Lưu phân công"}
          </button>

          {dirty && (
            <button
              onClick={resetToInitial}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition text-xs font-semibold min-h-11 cursor-pointer"
            >
              <RotateCcw size={14} />
              Hoàn tác
            </button>
          )}
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
                Bộ chọn phục vụ & bộ lọc bàn
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* Waiter select */}
              <div className="md:col-span-4">
                <label className="text-xs text-muted-foreground mb-1 block font-medium">Nhân viên phục vụ *</label>
                <select
                  value={selectedWaiterId}
                  onChange={(e) => setSelectedWaiterId(e.target.value)}
                  disabled={loadingInit || saving}
                  className="w-full rounded-xl px-3.5 py-2 text-xs bg-background text-foreground border border-border focus:outline-hidden focus:border-gold/50 transition min-h-11 cursor-pointer"
                >
                  <option value="">-- Chọn nhân viên phục vụ --</option>
                  {waiters.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search table */}
              <div className="md:col-span-4">
                <label className="text-xs text-muted-foreground mb-1 block">Tìm bàn</label>
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="VD: Bàn 01, VIP 02..."
                    className="w-full bg-background border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50 min-h-11"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Khu vực</label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={15}
                  />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full rounded-xl pl-9 pr-3.5 py-2 text-xs bg-background text-foreground border border-border focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                  >
                    <option value="ALL">Tất cả</option>
                    <option value="Indoor">Trong nhà</option>
                    <option value="Outdoor">Ngoài trời</option>
                    <option value="Patio">Sân vườn</option>
                    <option value="VIP Room">Phòng VIP</option>
                  </select>
                </div>
              </div>

              {/* Only assigned */}
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">Bộ lọc hiển thị</label>
                <select
                  value={onlyAssigned}
                  onChange={(e) => setOnlyAssigned(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2 text-xs bg-background text-foreground border border-border focus:outline-hidden focus:border-gold/50 min-h-11 cursor-pointer"
                >
                  <option value="ALL">Tất cả bàn</option>
                  <option value="YES">Đã gán cho waiter này</option>
                  <option value="NO">Chưa gán cho waiter này</option>
                </select>
              </div>

              <div className="md:col-span-12 text-xs text-muted-foreground pt-1">
                Hướng dẫn: Chọn nhân viên phục vụ, tích chọn các bàn tương ứng và nhấn <b>Lưu phân công</b> để cập nhật hệ thống.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="mt-6 rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="font-serif font-bold text-foreground text-base">Danh sách bàn phân công</div>
          <div className="text-xs text-muted-foreground font-serif">
            {loadingInit || loadingAssign ? "Đang tải..." : `${filteredTables.length} bàn trong danh mục`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="py-3.5 pr-3 pl-5 w-[8%] text-center">Chọn</th>
                <th className="py-3.5 px-3 w-[35%]">Mã bàn</th>
                <th className="py-3.5 px-3 w-[25%]">Khu vực</th>
                <th className="hidden sm:table-cell py-3.5 px-3 w-[15%]">Sức chứa</th>
                <th className="py-3.5 pl-3 pr-5 text-right w-[17%]">Trạng thái gán</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40">
              {loadingInit || loadingAssign
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : filteredTables.map((t) => {
                  const checked = assignedTableIds.has(String(t.id));
                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-accent/40 transition ${!selectedWaiterId ? "opacity-50" : "cursor-pointer"}`}
                      onClick={() => selectedWaiterId && toggleTable(t.id)}
                    >
                      <td className="py-4 pr-3 pl-5 align-middle text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!selectedWaiterId || saving}
                          onChange={() => toggleTable(t.id)}
                          className="w-4.5 h-4.5 accent-gold cursor-pointer"
                        />
                      </td>

                      <td className="py-4 px-3 align-middle">
                        <div className="font-serif font-bold text-foreground text-base">{t.table_number}</div>
                        <div className="hidden sm:inline-block text-[11px] text-muted-foreground mt-0.5">
                          ID: {t.id}
                        </div>
                      </td>

                      <td className="py-4 px-3 align-middle">
                        <div className="text-xs text-foreground font-medium">{t.location || "—"}</div>
                      </td>

                      <td className="hidden sm:table-cell py-4 px-3 align-middle">
                        <div className="text-xs text-muted-foreground font-serif">{t.capacity ? `${t.capacity} chỗ` : "—"}</div>
                      </td>

                      <td className="py-4 pl-3 pr-5 align-middle text-right">
                        <StatusPill checked={checked} />
                      </td>
                    </tr>
                  );
                })}

              {!loadingInit && !loadingAssign && filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="font-serif font-bold text-foreground text-base">Không tìm thấy bàn phù hợp</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-border text-xs text-muted-foreground flex items-center justify-between bg-card">
          <div>
            {selectedWaiterId ? (
              <>
                Đang phân công: <span className="font-serif font-bold text-gold text-sm">{assignedCount}</span> bàn cho nhân viên này
              </>
            ) : (
              <>Vui lòng chọn nhân viên phục vụ để bắt đầu thao tác.</>
            )}
          </div>
          <div className={dirty ? "text-gold font-semibold" : "text-muted-foreground"}>
            {dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ với hệ thống"}
          </div>
        </div>
      </div>
    </div>
  );
}
