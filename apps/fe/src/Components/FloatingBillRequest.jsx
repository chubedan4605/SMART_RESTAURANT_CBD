import React, { useState, useEffect } from "react";
import { Receipt, CheckCircle, Bell, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { billRequestApi } from "../services/billRequestApi";
import { orderApi } from "../services/orderApi";
import { useSocket } from "../context/SocketContext";

const FloatingBillRequest = ({ tableId, sessionId }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | pending | acknowledged
  const socket = useSocket();

  // Kiểm tra trạng thái ban đầu
  useEffect(() => {
    if (!tableId) return;

    const checkStatus = async () => {
      try {
        const res = await billRequestApi.getStatus(tableId);
        if (res.hasPendingRequest) {
          setStatus(
            res.request?.status === "acknowledged" ? "acknowledged" : "pending",
          );
        }
      } catch (err) {
        console.error("Check status error:", err);
      }
    };

    checkStatus();
  }, [tableId]);

  // Lắng nghe socket
  useEffect(() => {
    if (!socket || !tableId) return;

    const handleUpdate = (data) => {
      if (String(data.tableId) === String(tableId)) {
        if (data.type === "acknowledged") {
          setStatus("acknowledged");
          toast.info(t("bill.staffComing"));
        }
      }
    };

    socket.on("bill_request_update", handleUpdate);
    return () => socket.off("bill_request_update", handleUpdate);
  }, [socket, tableId, t]);

  const handleRequest = async () => {
    if (status !== "idle") return;

    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;

    const response = await orderApi.getUnpaidOrderByUserId(
      userId,
      tableId,
      sessionId,
    );

    if (response && response.success === false) {
      toast.error(response.message || t("bill.noOrderToRequest"));
      return;
    }

    setLoading(true);
    try {
      const res = await billRequestApi.requestBill({ tableId, sessionId });
      setStatus("pending");
      setIsOpen(false);

      if (res.alreadyRequested) {
        toast.info(t("bill.alreadyRequested"));
      } else {
        toast.success(t("bill.requestSent"));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("bill.requestError"));
    } finally {
      setLoading(false);
    }
  };

  if (!tableId) return null;

  // Hiển thị trạng thái acknowledged
  if (status === "acknowledged") {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <div className="px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-2 shadow-lg backdrop-blur-md animate-pulse">
          <CheckCircle size={20} />
          <span className="text-sm">{t("bill.staffOnTheWay")}</span>
        </div>
      </div>
    );
  }

  // Hiển thị trạng thái pending
  if (status === "pending") {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <div className="px-4 py-3 rounded-2xl bg-gold/15 border border-gold/30 text-gold font-medium flex items-center gap-2 shadow-lg backdrop-blur-md">
          <Bell size={20} className="animate-bounce" />
          <span className="text-sm">{t("bill.waitingForStaff")}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Request Bill"
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gold text-ink font-semibold shadow-lg shadow-gold/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border border-gold/40"
      >
        <Receipt size={24} />
      </button>

      {/* Modal xác nhận */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground rounded-2xl border border-border w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {t("bill.requestBill")}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {t("bill.staffWillCome")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-muted-foreground text-sm text-center mb-6 leading-relaxed">
                {t("bill.confirmRequestMessage")}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 min-h-11 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border text-foreground text-sm font-medium transition-all cursor-pointer"
                >
                  {t("bill.later")}
                </button>
                <button
                  onClick={handleRequest}
                  disabled={loading}
                  className="flex-1 min-h-11 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-soft text-ink text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-gold/20"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Receipt size={18} />
                  )}
                  {loading ? t("bill.sending") : t("bill.sendRequest")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingBillRequest;
