import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  ClipboardList,
  Receipt,
  Clock,
} from "lucide-react";
import { MdOutlineTableBar } from "react-icons/md";
import { useAdminNotification } from "../hooks/useAdminNotification";
import { formatVNTimeOnly } from "../../../utils/timezone";

const getNotificationIcon = (type) => {
  switch (type) {
    case "new_order":
    case "order_update":
      return <ClipboardList className="w-4 h-4" />;
    case "table_update":
      return <MdOutlineTableBar className="w-4 h-4" />;
    case "bill_request":
      return <Receipt className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

const getPriorityStyles = (priority, type) => {
  if (type === "new_order" || type === "bill_request") {
    return "bg-gold/15 border-gold/30 text-gold";
  }
  switch (priority) {
    case "high":
      return "bg-destructive/15 border-destructive/30 text-destructive";
    case "medium":
      return "bg-blue-500/15 border-blue-500/30 text-blue-500 dark:text-blue-400";
    default:
      return "bg-emerald-500/15 border-emerald-500/30 text-emerald-500 dark:text-emerald-400";
  }
};

function NotificationItem({ notification, onRead, onRemove, onClick }) {
  const iconStyles = getPriorityStyles(
    notification.priority,
    notification.type,
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;

      return formatVNTimeOnly
        ? formatVNTimeOnly(timestamp)
        : date.toLocaleString("vi-VN");
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer hover:border-gold/40 ${
        notification.read
          ? "bg-secondary/20 border-border/40 opacity-70"
          : "bg-background border-border shadow-xs"
      }`}
      onClick={() => onClick?.(notification)}
    >
      {!notification.read && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold animate-pulse" />
      )}

      <div className="flex gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${iconStyles}`}
        >
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-serif font-bold text-sm text-foreground truncate">
              {notification.title}
            </h4>
          </div>

          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              {formatTime(notification.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead?.(notification.id);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition cursor-pointer"
          >
            <Check className="w-3 h-3" />
            Đã đọc
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(notification.id);
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          Xóa
        </button>
      </div>
    </div>
  );
}

export default function AdminNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useAdminNotification();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    switch (notification.type) {
      case "new_order":
      case "order_update":
        navigate("/admin/orders");
        break;
      case "table_update":
        navigate("/admin/tables");
        break;
      case "bill_request":
        navigate("/admin/orders");
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative min-h-11 min-w-11 rounded-xl bg-card hover:bg-accent/40 border border-border hover:border-gold/40 text-foreground hover:text-gold transition flex items-center justify-center cursor-pointer"
        aria-label="Thông báo hệ thống"
      >
        <Bell className="w-4.5 h-4.5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-gold text-ink text-[10px] font-bold flex items-center justify-center shadow-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[85vw] sm:w-96 max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
            <div>
              <h3 className="font-serif font-bold text-foreground text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" />
                Thông báo vận hành
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : "Không có thông báo mới"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-emerald-500 transition cursor-pointer"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-destructive transition cursor-pointer"
                  title="Xóa tất cả"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[calc(70vh-80px)] p-3 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="font-serif font-bold text-foreground text-sm">Chưa có thông báo nào</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  Các thông báo về đơn hàng và bàn ăn sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onRemove={removeNotification}
                  onClick={handleNotificationClick}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
