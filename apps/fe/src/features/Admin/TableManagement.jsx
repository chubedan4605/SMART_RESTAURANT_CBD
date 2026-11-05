// src/pages/Admin/TableManagement/TableManagement.jsx
import React, { useMemo, useState, useEffect } from "react";
import axiosClient from "../../store/axiosClient";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { MdOutlineTableBar } from "react-icons/md";
import { useSocketEvent } from "../../hooks/useSocketEvent";
import { SOCKET_EVENTS } from "../../constants/socketEvents";

import {
  Plus,
  Filter,
  Edit,
  Power,
  Archive,
  Grid,
  Square,
  X,
  MapPin,
  Users,
  RefreshCw,
} from "lucide-react";

import TableDetailPanel from "./components/TableDetailPanel";

function TableDetailPopup({ open, table, onClose, onRefresh }) {
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
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* slide panel */}
      <div className="absolute inset-y-0 right-0 w-[92vw] max-w-[420px] sm:max-w-[520px]">
        <div className="h-full rounded-l-3xl border border-white/10 bg-neutral-950 shadow-2xl overflow-hidden">
          <TableDetailPanel
            table={table}
            onClose={onClose}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  );
}

const TableManagement = () => {

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [errors, setErrors] = useState({});

  const [filters, setFilters] = useState({
    status: "",
    location: "",
    sort: "name_asc",
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    table_number: "",
    capacity: 4,
    location: "",
    description: "",
    status: "active",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!String(formData.table_number || "").trim()) {
      newErrors.table_number = "Vui lòng nhập số bàn";
    } else if (String(formData.table_number).length > 10) {
      newErrors.table_number = "Tên bàn quá dài (tối đa 10 ký tự)";
    }

    const cap = parseInt(formData.capacity);
    if (!formData.capacity) {
      newErrors.capacity = "Nhập sức chứa";
    } else if (isNaN(cap) || cap < 1 || cap > 20) {
      newErrors.capacity = "Sức chứa từ 1-20 người";
    }

    if (!formData.location) {
      newErrors.location = "Vui lòng chọn vị trí";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateTableInState = (table) => {
    if (!table?.id) return;
    setTables((prev) => {
      const exists = prev.some((t) => t.id === table.id);
      if (exists) {
        return prev.map((t) => (t.id === table.id ? { ...t, ...table } : t));
      }
      return [...prev, table];
    });
  };

  useSocketEvent(SOCKET_EVENTS.TABLE_UPDATE, (payload) => {
    console.log("TableManagement: table_update", payload);
    const { type, table } = payload || {};
    if (!table?.id) return;

    if (type === "update") {
      setTables((prev) => prev.map((t) => (t.id === table.id ? table : t)));
      toast.info(`Bàn ${table.table_number} vừa cập nhật!`);
      setSelectedTable((cur) => (cur?.id === table.id ? table : cur));
    } else if (type === "create") {
      setTables((prev) => [...prev, table]);
    }
  });

  useSocketEvent(SOCKET_EVENTS.TABLE_SESSION_UPDATE, (payload) => {
    console.log("TableManagement: table_session_update", payload);
    const { type, table } = payload || {};
    if (!table?.id) return;

    updateTableInState(table);

    if (type === "session_started") {
      toast.info(`🟢 Bàn ${table.table_number} có khách mới!`, {
        icon: "🪑",
      });
    } else if (type === "session_ended") {
      toast.info(`⚪ Bàn ${table.table_number} đã trống`, {
        icon: "✅",
      });
    }
  });

  useSocketEvent(SOCKET_EVENTS.ADMIN_TABLE_UPDATE, (payload) => {
    console.log("TableManagement: admin_table_update", payload);
    const { table } = payload || {};
    if (!table?.id) return;
    updateTableInState(table);
  });

  const fetchTables = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axiosClient.get(`/admin/tables?${query}`);
      setTables(res);
    } catch (err) {
      toast.error("Lỗi tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [filters]);

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("SmartRestaurant_QR_Codes");
    toast.info("Đang nén file ZIP...");

    for (const table of tables) {
      const clientUrl = `${import.meta.env.VITE_FRONTEND_BASE_URL}/menu?qrToken=${table.qr_token}`;

      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
        clientUrl,
      )}`;

      try {
        const response = await fetch(qrApi);
        const blob = await response.blob();
        folder.file(`QR_${table.table_number}.png`, blob);
      } catch (err) {
        console.error(err);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "All_Tables_QR.zip");
      toast.success("Tải ZIP thành công!");
    });
  };

  const handleGeneratePDF = async (layoutType = "grid") => {
    toast.info("Đang tạo PDF...");
    const doc = new jsPDF();

    let x = 15,
      y = 20,
      size = 70,
      fontSize = 16,
      count = 0;

    if (layoutType === "single") {
      x = 35;
      y = 40;
      size = 140;
      fontSize = 30;
    }

    for (const table of tables) {
      const clientUrl = `${import.meta.env.VITE_FRONTEND_BASE_URL}/menu?qrToken=${table.qr_token}`;

      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
        clientUrl,
      )}`;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = qrApi;
      await new Promise((r) => (img.onload = r));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL("image/png");

      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "bold");

      const textWidth = doc.getTextWidth(String(table.table_number));
      doc.text(String(table.table_number), x + (size - textWidth) / 2, y - 5);
      doc.addImage(imgData, "PNG", x, y, size, size);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(String(table.location || ""), x + size / 2, y + size + 5, {
        align: "center",
      });

      if (layoutType === "grid") {
        count++;
        if (count % 2 !== 0) x += 100;
        else {
          x = 15;
          y += 120;
        }
        if (count % 4 === 0 && count < tables.length) {
          doc.addPage();
          x = 15;
          y = 20;
        }
      } else {
        if (tables.indexOf(table) < tables.length - 1) doc.addPage();
      }
    }

    window.open(doc.output("bloburl"), "_blank");
    toast.success("PDF sẵn sàng!");
  };

  const handleBulkRegenerate = async () => {
    const msg =
      "⚠️ CẢNH BÁO NGUY HIỂM:\n\nHành động này sẽ VÔ HIỆU HÓA TOÀN BỘ mã QR hiện tại đang dán trên bàn.\nKhách hàng sẽ không thể gọi món bằng mã cũ.\n\nBạn có chắc chắn muốn tạo mới tất cả không?";

    if (!window.confirm(msg)) return;

    try {
      toast.info("Đang xử lý làm mới hàng loạt...");
      const res = await axiosClient.post("/admin/tables/regenerate-all");
      toast.success(res.message || "Đã làm mới tất cả mã QR!");
      fetchTables();
    } catch (err) {
      toast.error("Lỗi hệ thống khi làm mới QR");
    }
  };

  // --- CRUD HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setFormData({
      id: null,
      table_number: "",
      capacity: 4,
      location: "",
      description: "",
      status: "active",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEdit = (table) => {
    setFormData(table);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      if (isEditing) {
        await axiosClient.put(`/admin/tables/${formData.id}`, formData);
        toast.success("Cập nhật thành công!");
      } else {
        await axiosClient.post("/admin/tables", formData);
        toast.success("Tạo bàn thành công!");
      }
      setShowModal(false);
      fetchTables();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi");
    }
  };

  const handleToggleStatus = async (table) => {
    const newStatus = table.status === "active" ? "inactive" : "active";

    if (newStatus === "inactive") {
      try {
        const res = await axiosClient.patch(
          `/admin/tables/${table.id}/status`,
          {
            status: newStatus,
          },
        );

        if (res.warning) {
          if (!window.confirm(`⚠️ ${res.message}\nBạn vẫn muốn tắt bàn này?`))
            return;

          await axiosClient.patch(
            `/admin/tables/${table.id}/status?force=true`,
            { status: newStatus },
          );
        }

        toast.success("Đã tắt bàn");
        fetchTables();
      } catch (err) {
        toast.error("Lỗi cập nhật");
      }
    } else {
      try {
        await axiosClient.patch(`/admin/tables/${table.id}/status`, {
          status: newStatus,
        });
        toast.success("Đã bật bàn");
        fetchTables();
      } catch (err) {
        toast.error("Lỗi cập nhật");
      }
    }
  };

  const totalActive = useMemo(
    () => (tables || []).filter((t) => t.status === "active").length,
    [tables],
  );

  const totalOccupied = useMemo(
    () => (tables || []).filter((t) => t.current_session_id).length,
    [tables],
  );

  const isTableOccupied = (table) => !!table.current_session_id;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-gold/15 border border-gold/30">
            <MdOutlineTableBar className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold font-sans font-semibold text-xs uppercase tracking-luxe">
              Table & QR Operations
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mt-2">
            Quản Lý <span className="text-gold italic font-normal">Sơ Đồ Bàn Ăn</span>
          </h1>

          <div className="text-xs font-sans text-muted-foreground mt-1.5">
            Tổng cộng: <span className="text-foreground font-serif text-sm font-semibold">{tables.length}</span>{" "}
            bàn • Hoạt động:{" "}
            <span className="text-foreground font-serif text-sm font-semibold">{totalActive}</span> • Đang phục vụ:{" "}
            <span className="text-gold font-serif text-sm font-semibold">{totalOccupied}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleBulkRegenerate}
            className="inline-flex items-center gap-2 px-4 min-h-11 rounded-none
              bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition text-xs font-sans uppercase tracking-luxe font-medium cursor-pointer"
            title="Vô hiệu hóa tất cả QR cũ và tạo mới"
          >
            <RefreshCw size={14} />
            Reset All
          </button>

          <button
            type="button"
            onClick={handleDownloadZip}
            className="inline-flex items-center gap-2 px-4 min-h-11 rounded-none
              bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-sans uppercase tracking-luxe cursor-pointer"
            title="Tải tất cả ảnh (ZIP)"
          >
            <Archive size={14} className="text-gold" />
            Tải ZIP
          </button>

          <button
            type="button"
            onClick={() => handleGeneratePDF("grid")}
            className="inline-flex items-center gap-2 px-4 min-h-11 rounded-none
              bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-sans uppercase tracking-luxe cursor-pointer"
            title="In lưới 4 bàn/trang"
          >
            <Grid size={14} className="text-gold" />
            PDF Lưới
          </button>

          <button
            type="button"
            onClick={() => handleGeneratePDF("single")}
            className="inline-flex items-center gap-2 px-4 min-h-11 rounded-none
              bg-card border border-border text-foreground hover:border-gold/40 hover:text-gold transition text-xs font-sans uppercase tracking-luxe cursor-pointer"
            title="In 1 bàn/trang"
          >
            <Square size={14} className="text-gold" />
            PDF Đơn
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 min-h-11 rounded-none
              bg-gold hover:bg-gold-soft border border-gold text-ink transition text-xs font-sans uppercase tracking-luxe font-semibold shadow-md cursor-pointer"
          >
            <Plus size={16} />
            Thêm Bàn
          </button>
        </div>
      </div>

      {/* Filters panel */}
      <div className="mt-6 rounded-none bg-card text-card-foreground border border-border p-5 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-none bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
            <Filter size={18} />
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Status */}
              <div className="md:col-span-3">
                <label className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium mb-1 block">
                  Trạng thái
                </label>
                <select
                  className="w-full rounded-none px-3 min-h-11 text-xs uppercase tracking-wider bg-background text-foreground
                    border border-border focus:outline-none focus:border-gold transition cursor-pointer"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, status: e.target.value }))
                  }
                >
                  <option value="">Tất cả</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Location */}
              <div className="md:col-span-4">
                <label className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium mb-1 block">
                  Khu vực
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gold"
                    size={16}
                  />
                  <select
                    className="w-full rounded-none pl-9 pr-3 min-h-11 text-xs uppercase tracking-wider bg-background text-foreground
                      border border-border focus:outline-none focus:border-gold transition cursor-pointer"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters((s) => ({ ...s, location: e.target.value }))
                    }
                  >
                    <option value="">Tất cả khu vực</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Patio">Patio</option>
                    <option value="VIP Room">VIP Room</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="md:col-span-5">
                <label className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium mb-1 block">
                  Sắp xếp
                </label>
                <select
                  className="w-full rounded-none px-3 min-h-11 text-xs uppercase tracking-wider bg-background text-foreground
                    border border-border focus:outline-none focus:border-gold transition cursor-pointer"
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, sort: e.target.value }))
                  }
                >
                  <option value="name_asc">Tên (A-Z)</option>
                  <option value="name_desc">Tên (Z-A)</option>
                  <option value="capacity_asc">Sức chứa (Tăng dần)</option>
                  <option value="capacity_desc">Sức chứa (Giảm dần)</option>
                  <option value="newest">Mới nhất (Creation Date)</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="mt-6">
        {loading ? (
          <div className="rounded-none bg-card border border-border p-10 text-center text-muted-foreground text-sm font-sans">
            Đang tải dữ liệu bàn ăn...
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables.map((table) => {
              const hasCustomer = isTableOccupied(table);

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`group relative rounded-none border p-5 cursor-pointer transition-all duration-300 font-sans shadow-xs
                ${
                  hasCustomer
                    ? "bg-gold/10 border-gold/40 hover:border-gold"
                    : "bg-card border-border hover:border-gold/50"
                }
                ${
                  selectedTable?.id === table.id
                    ? "border-gold ring-1 ring-gold/40 bg-card"
                    : ""
                }
                ${table.status === "inactive" ? "opacity-50 grayscale" : ""}
              `}
                >
                  {/* Badge "Có khách" */}
                  {hasCustomer && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="px-2.5 py-0.5 rounded-none bg-gold text-ink text-[10px] font-sans uppercase tracking-luxe font-semibold shadow-md">
                        Có khách
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-none flex items-center justify-center font-serif text-lg font-bold border
                      ${
                        hasCustomer
                          ? "bg-gold/20 text-gold border-gold/40"
                          : table.status === "active"
                            ? "bg-muted text-foreground border-border"
                            : "bg-muted text-muted-foreground border-border"
                      }`}
                      >
                        {String(table.table_number || "").replace(/\D/g, "") ||
                          "—"}
                      </div>

                      <div>
                        <div className="text-foreground font-serif text-xl font-medium">
                          Bàn {table.table_number}
                        </div>
                        <div
                          className={`text-[10px] uppercase tracking-luxe font-semibold mt-0.5 ${
                            hasCustomer
                              ? "text-gold"
                              : table.status === "active"
                                ? "text-emerald-400"
                                : "text-destructive"
                          }`}
                        >
                          {hasCustomer
                            ? "Đang phục vụ"
                            : table.status === "active"
                              ? "Online"
                              : "Offline"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground font-sans">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gold" />
                      <span>{table.capacity} khách</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gold" />
                      <span>{table.location || "—"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(table);
                      }}
                      className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-none
                    bg-muted hover:bg-muted/80 border border-border text-foreground transition cursor-pointer"
                      title="Chỉnh sửa bàn"
                    >
                      <Edit size={15} className="text-gold" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(table);
                      }}
                      className={`flex-1 min-h-11 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-none border transition cursor-pointer
                    ${
                      table.status === "active"
                        ? "bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                      title={table.status === "active" ? "Tắt bàn" : "Bật bàn"}
                      disabled={hasCustomer}
                    >
                      <Power size={15} />
                    </button>
                  </div>
                </div>
              );
            })}

            {tables.length === 0 && (
              <div className="col-span-full rounded-none bg-card border border-border p-10 text-center">
                <div className="text-foreground font-serif text-lg font-medium">Chưa có bàn nào</div>
                <div className="text-muted-foreground text-xs mt-1 font-sans">
                  Nhấn “Thêm Bàn” để tạo bàn phục vụ mới.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL FORM (Create/Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 font-sans">
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-none border border-border bg-card text-card-foreground shadow-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="text-foreground font-serif text-xl font-medium">
                  {isEditing ? "Cập Nhật Bàn" : "Thêm Bàn Mới"}
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium">Số bàn / Tên bàn</label>
                  <input
                    name="table_number"
                    type="text"
                    placeholder="VD: T-01"
                    className={`mt-1 w-full px-3.5 py-2.5 rounded-none bg-background text-foreground outline-none border transition min-h-11 text-sm
                      ${
                        errors.table_number
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-gold"
                      }`}
                    value={formData.table_number}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.table_number)
                        setErrors((s) => ({ ...s, table_number: "" }));
                    }}
                  />
                  {errors.table_number ? (
                    <div className="text-xs text-destructive mt-1">
                      {errors.table_number}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium">Sức chứa (Khách)</label>
                    <input
                      name="capacity"
                      type="number"
                      className={`mt-1 w-full px-3.5 py-2.5 rounded-none bg-background text-foreground outline-none border transition min-h-11 text-sm
                        ${
                          errors.capacity
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-gold"
                        }`}
                      value={formData.capacity}
                      onChange={(e) => {
                        handleChange(e);
                        if (errors.capacity)
                          setErrors((s) => ({ ...s, capacity: "" }));
                      }}
                    />
                    {errors.capacity ? (
                      <div className="text-xs text-destructive mt-1">
                        {errors.capacity}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium">Khu vực</label>
                    <select
                      name="location"
                      className={`mt-1 w-full px-3 py-2.5 rounded-none bg-background text-foreground outline-none border transition min-h-11 text-xs uppercase tracking-wider cursor-pointer
                        ${
                          errors.location
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-gold"
                        }`}
                      value={formData.location}
                      onChange={(e) => {
                        handleChange(e);
                        if (errors.location)
                          setErrors((s) => ({ ...s, location: "" }));
                      }}
                    >
                      <option value="">Chọn khu vực...</option>
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Patio">Patio</option>
                      <option value="VIP Room">VIP Room</option>
                    </select>
                    {errors.location ? (
                      <div className="text-xs text-destructive mt-1">
                        {errors.location}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium">Ghi chú bàn</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="mt-1 w-full px-3.5 py-2.5 rounded-none bg-background text-foreground outline-none border border-border focus:border-gold transition resize-none text-sm"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 min-h-11 px-4 py-2.5 rounded-none bg-muted hover:bg-muted/80 border border-border text-foreground font-sans text-xs uppercase tracking-luxe font-medium transition cursor-pointer"
                  >
                    Huỷ
                  </button>

                  <button
                    type="submit"
                    className="flex-1 min-h-11 px-4 py-2.5 rounded-none bg-gold hover:bg-gold-soft border border-gold text-ink transition font-sans text-xs uppercase tracking-luxe font-semibold shadow-md cursor-pointer"
                  >
                    {isEditing ? "Lưu Thay Đổi" : "Tạo Mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <TableDetailPopup
        open={!!selectedTable}
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
        onRefresh={fetchTables}
      />
    </div>
  );
};

export default TableManagement;
