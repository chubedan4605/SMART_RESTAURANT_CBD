import React, { useState, useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Printer,
  CreditCard,
  Banknote,
  FileDown,
  QrCode,
  Wallet,
  Loader2,
  ExternalLink,
  Tag,
  Check,
  XCircle,
} from "lucide-react";
import QRCodeReact from "react-qr-code";
import { billApi } from "../services/billApi";
import { stripeApi } from "../services/stripeApi";
import { couponApi } from "../services/couponApi";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import { formatMoneyVND } from "../utils/orders";

// Lazy load Stripe components - chỉ load khi cần thanh toán Stripe
const StripePaymentWrapper = lazy(() => import("./StripePaymentWrapper"));

// CẤU HÌNH TÀI KHOẢN NGÂN HÀNG
const BANK_INFO = {
  BANK_ID: import.meta.env.VITE_BANK_ID || "MB",
  ACCOUNT_NO: import.meta.env.VITE_ACCOUNT_NO || "21230907843010",
  TEMPLATE: import.meta.env.VITE_TEMPLATE || "compact",
  ACCOUNT_NAME: import.meta.env.VITE_ACCOUNT_NAME || "NHA HANG SMART",
};

// Stripe Promise - sẽ load khi cần (dynamic import)
let stripePromiseCache = null;
let loadStripeModule = null;

const getStripe = async () => {
  if (!stripePromiseCache) {
    try {
      // Dynamic import để không load Stripe SDK khi không cần
      if (!loadStripeModule) {
        const stripeJs = await import("@stripe/stripe-js");
        loadStripeModule = stripeJs.loadStripe;
      }
      const config = await stripeApi.getConfig();
      stripePromiseCache = loadStripeModule(config.publishableKey);
    } catch (err) {
      console.error("Failed to load Stripe config:", err);
    }
  }
  return stripePromiseCache;
};

const BillModal = ({ tableId, tableName, onClose, onPaymentSuccess }) => {
  const { t } = useTranslation();
  const [billData, setBillData] = useState(null);
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(true);
  const [qrBankUrl, setQrBankUrl] = useState("");

  // Stripe states
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Stripe QR states
  const [stripePaymentUrl, setStripePaymentUrl] = useState("");
  const [stripeSessionId, setStripeSessionId] = useState("");
  const [showStripeQR, setShowStripeQR] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { coupon, discount_amount }
  const [couponError, setCouponError] = useState("");

  // 1. Fetch Bill Preview
  useEffect(() => {
    if (!tableId) return;
    const fetchBill = async () => {
      setCalculating(true);
      try {
        // Tính discount từ coupon hoặc manual discount
        let finalDiscountType = discountType;
        let finalDiscountValue = Number(discountValue);

        // Nếu có coupon đã áp dụng, sử dụng coupon thay vì manual discount
        if (appliedCoupon) {
          finalDiscountType = appliedCoupon.coupon.discount_type;
          finalDiscountValue = appliedCoupon.coupon.discount_value;
        }

        const res = await billApi.previewBill(tableId, {
          discount_type: finalDiscountType,
          discount_value: finalDiscountValue,
        });
        setBillData(res);
      } catch (err) {
        toast.error(err.response?.data?.message || t("errors.loadFailed"));
        onClose();
      } finally {
        setCalculating(false);
      }
    };
    const timeoutId = setTimeout(fetchBill, 500);
    return () => clearTimeout(timeoutId);
  }, [tableId, discountType, discountValue, appliedCoupon]);

  // 2. Tạo QR Chuyển khoản
  useEffect(() => {
    if (billData && billData.final_amount > 0) {
      const amount = Math.ceil(billData.final_amount);
      const description = `TT BAN ${tableName}`;
      const url = `https://img.vietqr.io/image/${BANK_INFO.BANK_ID}-${
        BANK_INFO.ACCOUNT_NO
      }-${BANK_INFO.TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(
        description,
      )}&accountName=${encodeURIComponent(BANK_INFO.ACCOUNT_NAME)}`;
      setQrBankUrl(url);
    }
  }, [billData, tableName]);

  // 3. Hàm Tạo PDF (Đã tối ưu giao diện & sửa lỗi font)
  // 3. Hàm Tạo PDF (Đã thêm cột Đơn giá)
  const generateReceiptPDF = () => {
    if (!billData) return null;

    // CẤU HÌNH KHỔ GIẤY K80
    const PAPER_WIDTH = 80;
    const MARGIN = 4;

    // --- CẤU HÌNH CỘT MỚI (Đã căn chỉnh lại) ---
    // SL: Căn phải tại 48mm
    // Đơn giá: Căn phải tại 63mm
    // Thành tiền: Căn phải tại 77mm (Sát lề phải)
    const COL_QTY_X = 48;
    const COL_PRICE_UNIT_X = 63;
    const COL_PRICE_X = 77;

    // Helper: Xử lý tiếng Việt không dấu
    const removeAccents = (str) => {
      return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
    };

    // Helper: Format tiền riêng cho PDF (Chỉ số)
    const formatCurrencyPDF = (amount) => {
      if (amount === undefined || amount === null) return "0";
      return new Intl.NumberFormat("vi-VN").format(amount);
    };

    // --- TÍNH TOÁN CHIỀU CAO TRANG ---
    const docTest = new jsPDF({ unit: "mm", format: [PAPER_WIDTH, 2000] });
    docTest.setFont("helvetica", "normal");
    docTest.setFontSize(9);

    let itemsHeight = 0;
    billData.items.forEach((item) => {
      // Giảm chiều rộng tên món xuống còn 35mm để chừa chỗ cho các cột số liệu
      const nameLines = docTest.splitTextToSize(removeAccents(item.name), 35);
      itemsHeight += nameLines.length * 4.5;
      if (item.modifiers && item.modifiers.length > 0)
        itemsHeight += item.modifiers.length * 3.5;
      if (item.note) itemsHeight += 4;
      itemsHeight += 2;
    });

    const headerHeight = 45;
    const footerHeight = 45;
    const pageHeight = headerHeight + itemsHeight + footerHeight;

    // --- KHỞI TẠO DOC ---
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [PAPER_WIDTH, pageHeight < 60 ? 60 : pageHeight],
    });

    let y = 8;

    // HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SMART RESTAURANT", PAPER_WIDTH / 2, y, { align: "center" });
    y += 5;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("123 Duong ABC, Quan 1, TP.HCM", PAPER_WIDTH / 2, y, {
      align: "center",
    });
    y += 4;
    doc.text("Hotline: 0909.123.456", PAPER_WIDTH / 2, y, { align: "center" });
    y += 7;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PHIEU THANH TOAN", PAPER_WIDTH / 2, y, { align: "center" });
    y += 6;

    // INFO
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Ban: ${removeAccents(tableName)}`, MARGIN, y);
    y += 4;
    doc.text(`Ngay: ${new Date().toLocaleString("en-GB")}`, MARGIN, y);
    y += 4;

    // Phương thức thanh toán
    const paymentMethodText = {
      cash: "Tien mat",
      card: "The",
      transfer: "Chuyen khoan",
      stripe: "Stripe",
    };
    doc.text(
      `PT Thanh toan: ${paymentMethodText[paymentMethod] || "Tien mat"}`,
      MARGIN,
      y,
    );
    y += 4;

    // Thông tin session (nếu có)
    if (billData.session_started_at) {
      const startTime = new Date(
        billData.session_started_at,
      ).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      doc.text(`Gio vao: ${startTime}`, MARGIN, y);
      y += 4;
    }

    if (billData.session_ended_at) {
      const endTime = new Date(billData.session_ended_at).toLocaleTimeString(
        "en-GB",
        { hour: "2-digit", minute: "2-digit" },
      );
      doc.text(`Gio ra: ${endTime}`, MARGIN, y);
      y += 4;
    }

    doc.setLineDash([1, 1], 0);
    doc.line(MARGIN, y, PAPER_WIDTH - MARGIN, y);
    doc.setLineDash([]);
    y += 5;

    // TITLE COLUMNS (Đã thêm Đ.Gia)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8); // Giảm font tiêu đề chút cho đỡ chật
    doc.text("Ten mon", MARGIN, y);
    doc.text("SL", COL_QTY_X, y, { align: "right" });
    doc.text("DGia", COL_PRICE_UNIT_X, y, { align: "right" }); // Cột mới
    doc.text("TTien", COL_PRICE_X, y, { align: "right" });
    y += 5;

    // ITEMS LIST
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    billData.items.forEach((item) => {
      // Tên món (Wrap text với độ rộng 35mm)
      const name = removeAccents(item.name);
      const nameLines = doc.splitTextToSize(name, 35);

      doc.text(nameLines, MARGIN, y);

      // IN CÁC CỘT SỐ LIỆU (SL - Đơn Giá - Thành Tiền)
      // Tính đơn giá (nếu API không trả về price gốc thì lấy subtotal / qty)
      const unitPrice = item.price_base
        ? item.price_base
        : item.subtotal / item.qty;

      doc.text(String(item.qty), COL_QTY_X, y, { align: "right" });
      doc.text(formatCurrencyPDF(unitPrice), COL_PRICE_UNIT_X, y, {
        align: "right",
      }); // In Đơn giá
      doc.text(formatCurrencyPDF(item.subtotal), COL_PRICE_X, y, {
        align: "right",
      });

      y += nameLines.length * 4.5;

      // Topping
      // 2. In Modifiers (Topping) kèm giá
      if (item.modifiers && item.modifiers.length > 0) {
        doc.setFontSize(8); // Font nhỏ hơn cho topping
        doc.setTextColor(80); // Màu xám đậm

        item.modifiers.forEach((mod) => {
          // Tên Topping
          const modName = `+ ${removeAccents(mod.name)}`;
          const modLines = doc.splitTextToSize(modName, 35); // Wrap text nếu tên dài

          doc.text(modLines, MARGIN + 2, y); // Thụt đầu dòng 2mm

          // Giá Topping (In vào cột Đơn giá)
          const modPrice = Number(mod.price);
          if (modPrice > 0) {
            doc.text(`+${formatCurrencyPDF(modPrice)}`, COL_PRICE_UNIT_X, y, {
              align: "right",
            });
          }

          y += modLines.length * 3.5; // Tăng y theo số dòng topping
        });

        doc.setTextColor(0); // Reset màu đen
        doc.setFontSize(9); // Reset font size
      }
      // 3. In Note (Nếu có)
      if (item.note) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        const noteText = `Note: ${removeAccents(item.note)}`;
        const noteLines = doc.splitTextToSize(noteText, 35);
        doc.text(noteLines, MARGIN + 2, y);
        y += noteLines.length * 3.5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
      }

      y += 1.5; // Khoảng cách giữa các món
    });

    // DIVIDER
    y += 1;
    doc.setLineDash([1, 1], 0);
    doc.line(MARGIN, y, PAPER_WIDTH - MARGIN, y);
    doc.setLineDash([]);
    y += 5;

    // TOTALS
    const drawRow = (label, value, isBold = false, fontSize = 9) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      doc.text(label, MARGIN + 10, y); // Lùi label vào ít hơn chút để đẹp

      const displayValue =
        typeof value === "number" ? formatCurrencyPDF(value) : value;
      doc.text(displayValue, COL_PRICE_X, y, { align: "right" });
      y += 5;
    };

    drawRow("Tam tinh:", billData.subtotal);
    if (billData.discount_amount > 0) {
      drawRow("Giam gia:", `-${formatCurrencyPDF(billData.discount_amount)}`);
    }
    drawRow("VAT (10%):", billData.tax_amount);

    y += 2;
    drawRow("TONG CONG:", billData.final_amount, true, 14);

    // FOOTER
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Cam on quy khach & Hen gap lai!", PAPER_WIDTH / 2, y, {
      align: "center",
    });

    return doc;
  };

  // 4. Handlers
  const handlePrint = () => {
    const doc = generateReceiptPDF();
    if (doc) {
      // Dùng iframe để in trực tiếp, tránh lỗi scale nhỏ
      const blob = doc.output("bloburl");
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blob;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.URL.revokeObjectURL(blob);
        }, 60000);
      };
    }
  };

  const handleDownload = () => {
    const doc = generateReceiptPDF();
    if (doc) {
      const fileName = `Bill_${tableName}_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      toast.success(t("bill.downloaded"));
    }
  };

  // Khởi tạo Stripe Payment Intent
  const handleInitStripe = async () => {
    if (!billData) return;

    setStripeLoading(true);
    try {
      // 1. Load Stripe
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error(t("bill.stripeConnectFailed"));
      }
      setStripePromise(stripe);

      // 2. Tạo Payment Intent
      const result = await stripeApi.createPaymentIntent(tableId, {
        discount_type: discountType,
        discount_value: Number(discountValue),
      });

      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setShowStripeForm(true);
      } else {
        throw new Error(t("bill.stripeSessionFailed"));
      }
    } catch (err) {
      console.error("Stripe init error:", err);
      toast.error(err.message || t("bill.stripeError"));
    } finally {
      setStripeLoading(false);
    }
  };

  // Tạo Stripe QR Code (Payment Link)
  const handleCreateStripeQR = async () => {
    if (!billData) return;

    setStripeLoading(true);
    try {
      const result = await stripeApi.createPaymentLink(tableId, {
        discount_type: discountType,
        discount_value: Number(discountValue),
      });

      if (result.url) {
        setStripePaymentUrl(result.url);
        setStripeSessionId(result.sessionId);
        setShowStripeQR(true);
        setPaymentStatus(null);
        toast.success(t("bill.stripeQRCreated"));
      } else {
        throw new Error(t("bill.stripePaymentLinkFailed"));
      }
    } catch (err) {
      console.error("Stripe QR error:", err);
      toast.error(err.message || t("bill.stripeQRError"));
    } finally {
      setStripeLoading(false);
    }
  };

  // Kiểm tra trạng thái thanh toán Stripe
  const handleCheckStripePayment = async () => {
    if (!stripeSessionId) return;

    setCheckingPayment(true);
    try {
      const result = await stripeApi.checkSessionStatus(stripeSessionId);

      if (result.status === "complete") {
        setPaymentStatus("complete");
        toast.success(t("bill.paymentSuccess"));

        // Xử lý thanh toán thành công
        await billApi.checkoutBill(tableId, {
          payment_method: "stripe",
          discount_type: discountType,
          discount_value: Number(discountValue),
          stripe_session_id: stripeSessionId,
        });

        handlePrint();
        if (onPaymentSuccess) onPaymentSuccess();

        // Đóng modal sau khi xử lý xong
        setTimeout(() => {
          onClose();
        }, 1000);

        return true; // Trả về true để dừng polling
      } else if (result.status === "open") {
        setPaymentStatus("pending");
        return false; // Tiếp tục polling
      } else {
        setPaymentStatus("failed");
        toast.error(t("bill.paymentFailedOrCancelled"));
        return true; // Dừng polling
      }
    } catch (err) {
      console.error("Check payment error:", err);
      toast.error(t("bill.checkError"));
      return false;
    } finally {
      setCheckingPayment(false);
    }
  };

  // Auto-polling khi QR được hiển thị
  useEffect(() => {
    if (!showStripeQR || !stripeSessionId) return;

    let isActive = true;
    const interval = setInterval(async () => {
      if (!isActive) return;

      const shouldStop = await handleCheckStripePayment();
      if (shouldStop) {
        clearInterval(interval);
        isActive = false;
      }
    }, 5000); // Check mỗi 5 giây

    return () => {
      clearInterval(interval);
      isActive = false;
    };
  }, [showStripeQR, stripeSessionId]);

  // Validate và áp dụng coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError(t("bill.enterCouponPlease"));
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const result = await couponApi.validate(
        couponCode.trim(),
        billData?.subtotal || 0,
      );

      if (result.valid) {
        setAppliedCoupon(result);
        // Reset manual discount khi dùng coupon
        setDiscountType("none");
        setDiscountValue(0);
        toast.success(result.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t("bill.invalidCode");
      setCouponError(errorMsg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // Xóa coupon đã áp dụng
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleCheckout = async () => {
    if (!billData) return;
    if (
      !window.confirm(
        t("bill.confirmPaymentAmount", {
          amount: formatMoneyVND(billData.final_amount),
        }),
      )
    )
      return;

    // Tính discount cuối cùng
    let finalDiscountType = discountType;
    let finalDiscountValue = Number(discountValue);
    if (appliedCoupon) {
      finalDiscountType = appliedCoupon.coupon.discount_type;
      finalDiscountValue = appliedCoupon.coupon.discount_value;
    }


    
    setLoading(true);
    try {
      await billApi.checkoutBill(tableId, {
        payment_method: paymentMethod,
        discount_type: finalDiscountType,
        discount_value: finalDiscountValue,
        coupon_id: appliedCoupon?.coupon?.id || null,
      });

      toast.success(t("bill.paymentSuccess"));
      handlePrint();
      if (onPaymentSuccess) onPaymentSuccess();
      onClose();
    } catch (err) {
      toast.error(t("bill.paymentFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!billData && calculating)
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center text-white">
        {t("bill.calculating")}
      </div>
    );
  if (!billData) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white dark:bg-neutral-950/5">
          <div>
            <h3 className="text-white font-bold text-lg">
              {t("bill.paymentFor")}: {tableName}
            </h3>
            <p className="text-gray-400 text-xs">{t("bill.checkBefore")}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {/* List Items Summary - Redesigned */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("bill.orderDetails")}
              </span>
              <span className="text-xs text-gray-500">
                {t("bill.items", { count: billData.items.length })}
              </span>
            </div>

            <div className="bg-white dark:bg-neutral-950/5 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
              {billData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group p-4 border-b border-white/5 last:border-0 hover:bg-white dark:bg-neutral-950/2 transition-colors"
                >
                  {/* HÀNG TRÊN: Thông tin chính món ăn */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      {/* Badge Số lượng */}
                      <div className="  shrink-0 w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-sm">
                        {item.qty}
                      </div>

                      {/* Tên món & Đơn giá */}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200 leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium mt-0.5">
                          {t("bill.unitPrice")}:{" "}
                          {formatMoneyVND(item.price_base)}
                        </span>
                      </div>
                    </div>

                    {/* Thành tiền (Tổng dòng) */}
                    <div className="text-sm font-bold text-white whitespace-nowrap">
                      {formatMoneyVND(item.subtotal)}
                    </div>
                  </div>

                  {/* HÀNG DƯỚI: Modifiers & Note */}
                  {(item.modifiers?.length > 0 || item.note) && (
                    <div className="mt-3 pl-11 space-y-2">
                      {/* List Modifiers */}
                      {item.modifiers?.length > 0 && (
                        <div className="space-y-1">
                          {item.modifiers.map((mod, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs text-gray-400 group/mod"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="w-1 h-1 rounded-full bg-gray-600 shrink-0" />
                                <span className="truncate">{mod.name}</span>
                              </div>
                              {/* Dòng kẻ nối mờ */}
                              <div className="flex-1 border-b border-dashed border-white/10 mx-2 relative top-px opacity-30"></div>
                              <span className="font-medium text-gray-300">
                                +{formatMoneyVND(mod.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Note riêng của món */}
                      {item.note && (
                        <div className="text-[11px] text-orange-400/90 italic bg-orange-500/5 px-2 py-1.5 rounded border border-orange-500/10 inline-block max-w-full truncate">
                          📝 {item.note}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Code Input */}
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-purple-400" />
              <label className="text-sm font-bold text-purple-300">
                {t("bill.couponCode")}
              </label>
            </div>

            {appliedCoupon ? (
              // Hiển thị coupon đã áp dụng
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check size={16} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-green-400 font-bold text-sm">
                      {appliedCoupon.coupon.code}
                    </div>
                    <div className="text-green-300/70 text-xs">
                      {appliedCoupon.coupon.description ||
                        (appliedCoupon.coupon.discount_type === "percent"
                          ? `${t("bill.reduce")} ${appliedCoupon.coupon.discount_value}%`
                          : `${t("bill.reduce")} ${formatMoneyVND(appliedCoupon.coupon.discount_value)}`)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                  title={t("bill.removeCoupon")}
                >
                  <XCircle size={18} />
                </button>
              </div>
            ) : (
              // Form nhập mã
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyCoupon();
                    }}
                    placeholder={t("bill.enterCoupon")}
                    className={`flex-1 bg-black/40 text-white border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
                      couponError
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-purple-500"
                    }`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white rounded-lg font-bold text-sm transition-all disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {couponLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      t("bill.applyCoupon")
                    )}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <XCircle size={12} />
                    {couponError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Discount & Payment Method Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manual Discount - Disabled when coupon applied */}
            <div
              className={`bg-white dark:bg-neutral-950/5 p-3 rounded-xl border border-white/5 space-y-2 ${appliedCoupon ? "opacity-50" : ""}`}
            >
              <label className="text-xs font-bold text-gray-400 uppercase">
                {t("bill.manualDiscount")}{" "}
                {appliedCoupon && t("bill.usingCoupon")}
              </label>
              {/* Thêm min-w-0 để tránh lỗi tràn layout trên grid */}
              <div className="flex gap-2 min-w-0">
                <select
                  className="bg-black/40 text-white border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none w-20 cursor-pointer disabled:cursor-not-allowed"
                  value={discountType}
                  onChange={(e) => {
                    setDiscountType(e.target.value);
                    setDiscountValue(0);
                  }}
                  disabled={!!appliedCoupon}
                >
                  <option value="none">{t("bill.none")}</option>
                  <option value="percent">{t("bill.percent")}</option>
                  <option value="fixed">{t("bill.fixed")}</option>
                </select>
                <input
                  type="number"
                  className="flex-1 min-w-0 bg-black/40 text-white border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-orange-500 transition-colors disabled:cursor-not-allowed"
                  placeholder="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  disabled={discountType === "none" || !!appliedCoupon}
                />
              </div>
            </div>

            {/* Payment Method - Đã thêm background để cân đối với bên trái */}
            <div className="bg-white dark:bg-neutral-950/5 p-3 rounded-xl border border-white/5 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase block">
                {t("bill.paymentBy")}
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  {
                    id: "cash",
                    icon: <Banknote size={16} />,
                    label: t("bill.cash"),
                  },
                  {
                    id: "card",
                    icon: <CreditCard size={16} />,
                    label: t("bill.card"),
                  },
                  {
                    id: "transfer",
                    icon: <QrCode size={16} />,
                    label: t("bill.transfer"),
                  },
                  {
                    id: "stripe",
                    icon: <Wallet size={16} />,
                    label: t("bill.stripe"),
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setPaymentMethod(m.id);
                      setShowStripeForm(false);
                      setShowStripeQR(false);
                      setStripePaymentUrl("");
                    }}
                    className={`flex-1 min-w-15 flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      paymentMethod === m.id
                        ? "bg-orange-600 text-white border-orange-500"
                        : "bg-white dark:bg-neutral-950/5 text-gray-400 border-white/5 hover:bg-white dark:bg-neutral-950/10"
                    }`}
                  >
                    {m.icon}
                    <span className="text-[10px] mt-1">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          {paymentMethod === "transfer" && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="bg-white dark:bg-neutral-950 p-3 rounded-xl shadow-lg">
                {qrBankUrl ? (
                  <img
                    src={qrBankUrl}
                    alt={t("bill.qrTransfer")}
                    className="w-48 h-48 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-black">
                    {t("bill.creatingQR")}
                  </div>
                )}
              </div>
              <div className="mt-2 text-center space-y-1">
                <p className="text-gray-400 text-xs">{t("bill.scanToPayQR")}</p>
                <p className="text-orange-500 font-bold text-lg">
                  {formatMoneyVND(billData.final_amount)}
                </p>
                <p className="text-gray-500 text-xs font-mono">
                  {t("bill.content")}: TT BAN {tableName}
                </p>
              </div>
            </div>
          )}

          {/* Stripe Checkout Section */}
          {paymentMethod === "stripe" && !showStripeForm && !showStripeQR && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 p-4 bg-white dark:bg-neutral-950/5 rounded-xl border border-white/10">
              <Wallet size={48} className="text-purple-500 mb-3" />
              <h4 className="text-white font-bold mb-2">
                {t("bill.stripePayment")}
              </h4>
              <p className="text-gray-400 text-sm text-center mb-4">
                {t("bill.stripeSupport")}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCreateStripeQR}
                  disabled={stripeLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {stripeLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t("bill.creating")}
                    </>
                  ) : (
                    <>
                      <QrCode size={18} />
                      {t("bill.qrCodeBtn")}
                    </>
                  )}
                </button>

                <button
                  onClick={handleInitStripe}
                  disabled={stripeLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {stripeLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t("bill.creating")}
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      {t("bill.enterCard")}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Stripe QR Code Display */}
          {paymentMethod === "stripe" && showStripeQR && stripePaymentUrl && (
            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/30">
              <h4 className="text-white font-bold mb-2 text-lg">
                {t("bill.scanStripeQR")}
              </h4>
              <p className="text-gray-300 text-sm text-center mb-4">
                {t("bill.scanStripeDesc")}
              </p>

              <div className="bg-white dark:bg-neutral-950 p-4 rounded-xl shadow-lg">
                <QRCodeReact
                  value={stripePaymentUrl}
                  size={200}
                  level="H"
                  fgColor="#000000"
                />
              </div>

              <div className="mt-4 text-center space-y-2">
                <p className="text-purple-400 font-bold text-xl">
                  {formatMoneyVND(billData.final_amount)}
                </p>
                {paymentStatus === "pending" && (
                  <p className="text-yellow-400 text-xs animate-pulse">
                    {t("bill.waitingPayment")}
                  </p>
                )}
                {paymentStatus === "complete" && (
                  <p className="text-green-400 text-xs">
                    {t("bill.paidSuccess")}
                  </p>
                )}
                {!paymentStatus && (
                  <p className="text-gray-400 text-xs">
                    {t("bill.securePayment")}
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2 w-full">
                <button
                  onClick={() => window.open(stripePaymentUrl, "_blank")}
                  className="flex-1 px-4 py-2 bg-white dark:bg-neutral-950/10 hover:bg-white dark:bg-neutral-950/20 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  {t("bill.openLink")}
                </button>
                <button
                  onClick={() => {
                    setShowStripeQR(false);
                    setStripePaymentUrl("");
                    setPaymentStatus(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                >
                  {t("bill.cancel")}
                </button>
              </div>

              {/* Nút kiểm tra thủ công */}
              <button
                onClick={handleCheckStripePayment}
                disabled={checkingPayment}
                className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {checkingPayment ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t("bill.checking")}
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    {t("bill.checkPayment")}
                  </>
                )}
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                {t("bill.autoCheckHint")}
              </div>
            </div>
          )}

          {/* Stripe Payment Form */}
          {paymentMethod === "stripe" &&
            showStripeForm &&
            stripePromise &&
            clientSecret && (
              <div className="animate-in zoom-in-95 duration-300">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8 text-orange-500">
                      <Loader2 className="animate-spin mr-2" size={24} />
                      <span>{t("bill.loadingPaymentForm")}</span>
                    </div>
                  }
                >
                  <StripePaymentWrapper
                    stripePromise={stripePromise}
                    clientSecret={clientSecret}
                    amount={billData.final_amount}
                    tableId={tableId}
                    tableName={tableName}
                    onSuccess={(result) => {
                      if (onPaymentSuccess) onPaymentSuccess();
                      onClose();
                    }}
                    onCancel={() => {
                      setShowStripeForm(false);
                      setClientSecret("");
                    }}
                  />
                </Suspense>
              </div>
            )}

          {/* Totals */}
          <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{t("bill.subtotal")}</span>{" "}
              <span>{formatMoneyVND(billData.subtotal)}</span>
            </div>
            {billData.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span className="flex items-center gap-1">
                  {t("bill.discount")}
                  {appliedCoupon && (
                    <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                      {appliedCoupon.coupon.code}
                    </span>
                  )}
                </span>
                <span>-{formatMoneyVND(billData.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-400">
              <span>{t("bill.vat")}</span>
              <span>{formatMoneyVND(billData.tax_amount)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-orange-500 pt-2 border-t border-white/10">
              <span>{t("bill.grandTotal")}</span>
              <span>{formatMoneyVND(billData.final_amount)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/10 bg-black/40 flex gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-3 bg-white dark:bg-neutral-950/10 hover:bg-white dark:bg-neutral-950/20 text-white rounded-xl transition-all"
            title={t("bill.downloadPDF")}
          >
            <FileDown size={20} />
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-3 bg-white dark:bg-neutral-950/10 hover:bg-white dark:bg-neutral-950/20 text-white rounded-xl transition-all"
            title={t("bill.printBill")}
          >
            <Printer size={20} />
          </button>

          {/* Ẩn nút checkout khi đang dùng Stripe form hoặc QR */}
          {!(
            paymentMethod === "stripe" &&
            (showStripeForm || showStripeQR)
          ) && (
            <button
              onClick={handleCheckout}
              disabled={loading || paymentMethod === "stripe"}
              className="flex-1 bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 disabled:opacity-50 transition-all"
            >
              {loading
                ? t("bill.processing")
                : paymentMethod === "stripe"
                  ? t("bill.useStripeAbove")
                  : t("bill.confirmPayment")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillModal;
