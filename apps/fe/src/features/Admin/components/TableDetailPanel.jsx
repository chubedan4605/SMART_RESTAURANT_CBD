import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import {
  X,
  Printer,
  Image as ImageIcon,
  FileText,
  RefreshCw,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import axiosClient from "../../../store/axiosClient";

const TableDetailPanel = ({ table: initialTable, onClose, onRefresh }) => {
  const [table, setTable] = useState(initialTable);
  const qrRef = useRef(null);

  useEffect(() => {
    setTable(initialTable);
  }, [initialTable]);

  if (!table) return null;

  const feBaseUrl = import.meta.env.VITE_FRONTEND_BASE_URL;
  const clientUrl = `${feBaseUrl}/menu?qrToken=${table.qr_token}`;

  const tokenDate = new Date(table.created_at).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownloadPNG = async () => {
    if (!qrRef.current) {
      toast.error("Lỗi giao diện, vui lòng thử lại");
      return;
    }

    try {
      const canvas = await html2canvas(qrRef.current, {
        scale: 3,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `QR_Ban_${table.table_number}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Đã tải ảnh PNG");
    } catch (err) {
      console.error("Lỗi html2canvas:", err);
      toast.error("Lỗi tạo ảnh");
    }
  };

  const handleDownloadPDF = async () => {
    if (!qrRef.current) return;
    try {
      const canvas = await html2canvas(qrRef.current, {
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a5");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`QR_Ban_${table.table_number}.pdf`);
      toast.success("Đã tải tệp PDF");
    } catch {
      toast.error("Lỗi xuất PDF");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>In mã QR Bàn ${table.table_number}</title>
          <style>
            body { font-family: 'Times New Roman', serif; text-align: center; padding: 40px; margin: 0; }
            h1 { font-size: 42px; margin-bottom: 5px; }
            p { font-size: 16px; color: #555; }
            .qr { margin: 20px auto; display: flex; justify-content: center; }
          </style>
        </head>
        <body>
          <h1>Bàn ${table.table_number}</h1>
          <p>${table.location || "Khu vực sảnh"}</p>
          <div class="qr">${document.getElementById("qr-svg-container")?.innerHTML || ""}</div>
          <h2>Quét mã để gọi món</h2>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleRegenerate = async () => {
    if (!window.confirm("CẢNH BÁO: Mã QR cũ sẽ bị vô hiệu hóa. Tiếp tục?")) return;
    try {
      const res = await axiosClient.post(
        `/admin/tables/${table.id}/regenerate`,
      );
      toast.success("Mã QR đã được làm mới!");
      setTable((prev) => ({ ...prev, qr_token: res.qr_token }));
      if (onRefresh) onRefresh();
    } catch {
      toast.error("Lỗi làm mới mã");
    }
  };

  return (
    <div className="w-full h-full bg-card text-card-foreground border-l border-border flex flex-col shadow-2xl font-sans">
      {/* Hidden container for print/download snapshot */}
      <div style={{ position: "fixed", left: "-9999px", top: "0" }}>
        <div
          ref={qrRef}
          style={{
            width: "600px",
            padding: "40px",
            backgroundColor: "white",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            color: "black",
          }}
        >
          <h1 style={{ fontSize: "60px", fontWeight: "bold", margin: "0 0 10px 0" }}>
            {table.table_number}
          </h1>
          <p style={{ fontSize: "24px", color: "#555", marginBottom: "30px" }}>
            {table.location}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <QRCode value={clientUrl} size={400} />
          </div>
          <p style={{ fontSize: "30px", fontWeight: "bold", marginTop: "30px", textTransform: "uppercase" }}>
            Scan to Order
          </p>
        </div>
      </div>

      {/* Header Panel */}
      <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
        <h3 className="text-base font-serif font-medium text-foreground">Chi Tiết Bàn Phục Vụ</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted-foreground hover:text-foreground w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body Panel */}
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <div className="text-center">
          <div className="inline-block bg-white p-4 rounded-none mb-6 border border-gold/40 shadow-sm">
            <div id="qr-svg-container">
              <QRCode
                value={clientUrl}
                size={190}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>

          <h2 className="text-3xl font-serif font-medium text-foreground mb-2">
            Bàn {table.table_number}
          </h2>

          <div className="flex flex-col gap-3 mt-6 bg-background p-4 rounded-none border border-border text-left">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-2">
                <Users size={14} className="text-gold" /> Sức chứa:
              </span>
              <span className="text-foreground font-serif text-sm font-semibold">
                {table.capacity} Khách
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin size={14} className="text-gold" /> Vị trí:
              </span>
              <span className="text-foreground font-serif text-sm font-semibold">{table.location}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-border pt-2 mt-1">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar size={14} className="text-gold" /> Ngày tạo:
              </span>
              <span className="text-foreground font-sans text-[11px]">{tokenDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-border bg-card space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="min-h-11 bg-muted hover:bg-muted/80 text-foreground rounded-none font-sans text-xs uppercase tracking-luxe font-medium flex items-center justify-center gap-2 border border-border cursor-pointer"
          >
            <ImageIcon size={15} /> PNG
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="min-h-11 bg-muted hover:bg-muted/80 text-foreground rounded-none font-sans text-xs uppercase tracking-luxe font-medium flex items-center justify-center gap-2 border border-border cursor-pointer"
          >
            <FileText size={15} /> PDF
          </button>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="w-full min-h-11 bg-gold hover:bg-gold-soft text-ink rounded-none font-sans text-xs uppercase tracking-luxe font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Printer size={16} /> In Mã QR
        </button>
        <button
          type="button"
          onClick={handleRegenerate}
          className="w-full min-h-11 text-destructive hover:bg-destructive/10 border border-destructive/30 rounded-none font-sans text-xs uppercase tracking-luxe font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={14} /> Làm Mới Mã QR
        </button>
      </div>
    </div>
  );
};

export default TableDetailPanel;
