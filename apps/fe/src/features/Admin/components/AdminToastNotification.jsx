import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, ClipboardList, Receipt, ExternalLink } from "lucide-react";
import { MdOutlineTableBar } from "react-icons/md";
import { useSocket } from "../../../context/SocketContext";
import { useNotificationSound } from "../../../hooks/useNotificationSound";
import { SOCKET_EVENTS } from "../../../constants/socketEvents";

function ToastItem({ notification, onClose, onNavigate }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(notification.id), 300);
  }, [onClose, notification.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  const getIcon = () => {
    switch (notification.type) {
      case "new_order":
      case "order_update":
        return <ClipboardList className="w-5 h-5" />;
      case "table_update":
        return <MdOutlineTableBar className="w-5 h-5" />;
      case "bill_request":
        return <Receipt className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case "new_order":
        return "border-gold/50 bg-card/95 text-foreground";
      case "bill_request":
        return "border-gold/50 bg-card/95 text-foreground";
      case "order_update":
        return "border-blue-500/40 bg-card/95 text-foreground";
      case "table_update":
        return "border-emerald-500/40 bg-card/95 text-foreground";
      default:
        return "border-border bg-card/95 text-foreground";
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case "new_order":
        return "text-gold bg-gold/15 border-gold/30";
      case "bill_request":
        return "text-gold bg-gold/15 border-gold/30";
      case "order_update":
        return "text-blue-500 bg-blue-500/15 border-blue-500/30";
      case "table_update":
        return "text-emerald-500 bg-emerald-500/15 border-emerald-500/30";
      default:
        return "text-muted-foreground bg-secondary border-border";
    }
  };

  return (
    <div
      className={`
        relative p-4 rounded-2xl border shadow-2xl backdrop-blur-xl
        transition-all duration-300 cursor-pointer overflow-hidden
        ${getStyles()}
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
      `}
      onClick={() => onNavigate(notification)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-2.5 right-2.5 p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getIconColor()}`}
        >
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-serif font-bold text-sm text-foreground">{notification.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gold font-medium">
            <ExternalLink className="w-3 h-3" />
            <span>Nhấn để xem chi tiết</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/40 overflow-hidden">
        <div
          className="h-full bg-gold animate-shrink-width"
          style={{ animationDuration: "5s" }}
        />
      </div>
    </div>
  );
}

export default function AdminToastNotification() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  const { play: playNewOrderSound } = useNotificationSound(
    "/sounds/new-order.mp3",
  );
  const { play: playUpdateSound } = useNotificationSound(
    "/sounds/notification.mp3",
  );

  const addToast = (notification) => {
    const newToast = {
      id: Date.now() + Math.random(),
      ...notification,
    };
    setToasts((prev) => [...prev, newToast].slice(-5));
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (notification) => {
    removeToast(notification.id);

    switch (notification.type) {
      case "new_order":
      case "order_update":
      case "bill_request":
        navigate("/admin/orders");
        break;
      case "table_update":
        navigate("/admin/tables");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      playNewOrderSound();
      addToast({
        type: "new_order",
        title: "🍽️ Đơn hàng mới!",
        message:
          data.message ||
          `Có đơn hàng mới từ Bàn ${data.order?.table_number || data.order?.table_id}`,
        data: data.order,
      });
    };

    const handleOrderUpdate = (data) => {
      playUpdateSound();
      const statusLabels = {
        received: "Đã tiếp nhận",
        preparing: "Đang chuẩn bị",
        ready: "Sẵn sàng phục vụ",
        completed: "Hoàn thành",
        rejected: "Đã hủy",
      };
      addToast({
        type: "order_update",
        title: "📋 Cập nhật đơn hàng",
        message:
          data.message ||
          `Đơn #${data.order?.id} - ${statusLabels[data.order?.status] || data.order?.status}`,
        data: data.order,
      });
    };

    const handleTableUpdate = (data) => {
      playUpdateSound();
      addToast({
        type: "table_update",
        title: "🪑 Cập nhật bàn",
        message:
          data.message || `Bàn ${data.table?.table_number} đã được cập nhật`,
        data: data.table,
      });
    };

    const handleBillRequest = (data) => {
      if (data.type === "new") {
        playNewOrderSound();
        addToast({
          type: "bill_request",
          title: "💰 Yêu cầu thanh toán",
          message: `Bàn ${data.request?.table_number} yêu cầu thanh toán`,
          data: data.request,
        });
      }
    };

    const handleTableSession = (data) => {
      playUpdateSound();
      const isStarted = data.type === "session_started";
      addToast({
        type: "table_update",
        title: isStarted ? "🟢 Khách mới vào bàn" : "⚪ Bàn đã trống",
        message: isStarted
          ? `Bàn ${data.table?.table_number} có khách mới!`
          : `Bàn ${data.table?.table_number} đã kết thúc phục vụ`,
        data: data.table,
      });
    };

    socket.on(SOCKET_EVENTS.ADMIN_NEW_ORDER, handleNewOrder);
    socket.on(SOCKET_EVENTS.ADMIN_ORDER_UPDATE, handleOrderUpdate);
    socket.on(SOCKET_EVENTS.ADMIN_TABLE_UPDATE, handleTableUpdate);
    socket.on(SOCKET_EVENTS.BILL_REQUEST, handleBillRequest);
    socket.on(SOCKET_EVENTS.TABLE_SESSION_UPDATE, handleTableSession);

    return () => {
      socket.off(SOCKET_EVENTS.ADMIN_NEW_ORDER, handleNewOrder);
      socket.off(SOCKET_EVENTS.ADMIN_ORDER_UPDATE, handleOrderUpdate);
      socket.off(SOCKET_EVENTS.ADMIN_TABLE_UPDATE, handleTableUpdate);
      socket.off(SOCKET_EVENTS.BILL_REQUEST, handleBillRequest);
      socket.off(SOCKET_EVENTS.TABLE_SESSION_UPDATE, handleTableSession);
    };
  }, [socket, playNewOrderSound, playUpdateSound]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 w-80">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          notification={toast}
          onClose={removeToast}
          onNavigate={handleNavigate}
        />
      ))}
    </div>
  );
}
