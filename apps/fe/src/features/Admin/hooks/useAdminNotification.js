import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../../../context/SocketContext";
import { useNotificationSound } from "../../../hooks/useNotificationSound";

/**
 * Hook quản lý thông báo real-time cho Admin
 * Lắng nghe các sự kiện: đơn hàng mới, cập nhật đơn, cập nhật bàn, yêu cầu thanh toán
 */
export function useAdminNotification() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sound effects
  const { play: playNewOrderSound } = useNotificationSound(
    "/sounds/new-order.mp3",
  );
  const { play: playUpdateSound } = useNotificationSound(
    "/sounds/notification.mp3",
  );

  // Thêm notification mới
  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: Date.now() + Math.random(),
      ...notification,
      read: false,
      createdAt: notification.timestamp || new Date().toISOString(),
    };

    setNotifications((prev) => [newNotif, ...prev].slice(0, 50)); // Giữ tối đa 50 thông báo
    setUnreadCount((prev) => prev + 1);

    return newNotif;
  }, []);

  // Đánh dấu đã đọc
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Xóa notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif && !notif.read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  // Xóa tất cả
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Lắng nghe socket events
  useEffect(() => {
    if (!socket) return;

    // 1. Đơn hàng mới
    const handleNewOrder = (data) => {
      console.log("🔔 Admin nhận đơn mới:", data);
      playNewOrderSound();
      addNotification({
        type: "new_order",
        title: "🍽️ Đơn hàng mới",
        message:
          data.message ||
          `Đơn hàng mới từ Bàn ${data.order?.table_number || data.order?.table_id}`,
        data: data.order,
        timestamp: data.timestamp,
        icon: "order",
        priority: "high",
      });
    };

    // 2. Cập nhật đơn hàng
    const handleOrderUpdate = (data) => {
      console.log("🔔 Admin nhận cập nhật đơn:", data);

      console.log("Table data:", data);

      playUpdateSound();

      const statusLabels = {
        received: "Đã tiếp nhận",
        preparing: "Đang chuẩn bị",
        ready: "Sẵn sàng phục vụ",
        completed: "Hoàn thành",
        rejected: "Đã hủy",
      };

      addNotification({
        type: "order_update",
        title: "📋 Cập nhật đơn hàng",
        message:
          data.message ||
          `Đơn #${data.order?.id} - ${statusLabels[data.order?.status] || data.order?.status}`,
        data: data.order,
        timestamp: data.timestamp,
        icon: "order",
        priority: data.order?.status === "rejected" ? "high" : "medium",
      });
    };

    // 3. Cập nhật bàn ăn
    const handleTableUpdate = (data) => {
      console.log("🔔 Admin nhận cập nhật bàn:", data);
      console.log("Table data:", data);

      playUpdateSound();

      const statusLabels = {
        available: "Trống",
        occupied: "Có khách",
        inactive: "Không hoạt động",
      };

      addNotification({
        type: "table_update",
        title: "🪑 Cập nhật bàn",
        message:
          data.message ||
          `Bàn ${data.table?.table_number || data.table?.id} - ${statusLabels[data.table?.status] || data.table?.status}`,
        data: data.table,
        timestamp: data.timestamp,
        icon: "table",
        priority: "low",
      });
    };

    // 4. Yêu cầu thanh toán
    const handleBillRequest = (data) => {
      console.log("🔔 Admin nhận yêu cầu thanh toán:", data);
      playNewOrderSound();

      if (data.type === "new") {
        addNotification({
          type: "bill_request",
          title: "💰 Yêu cầu thanh toán",
          message: `Bàn ${data.request?.table_number} yêu cầu thanh toán`,
          data: data.request,
          timestamp: new Date().toISOString(),
          icon: "bill",
          priority: "high",
        });
      }
    };

    // 5. Khách quét QR / Session bắt đầu
    const handleTableSession = (data) => {
      console.log("🔔 Admin nhận table session:", data);

      if (data.type === "session_started") {
        playUpdateSound();
        addNotification({
          type: "table_session",
          title: "🟢 Khách mới đến",
          message:
            data.message || `Bàn ${data.table?.table_number} có khách mới!`,
          data: data.table,
          timestamp: data.timestamp || new Date().toISOString(),
          icon: "table",
          priority: "medium",
        });
      }
    };

    // 6. Thanh toán hoàn tất
    const handlePaymentCompleted = (data) => {
      console.log("🔔 Admin nhận thanh toán hoàn tất:", data);
      playUpdateSound();

      addNotification({
        type: "payment_completed",
        title: "💰 Thanh toán thành công",
        message: data.message || `Bàn ${data.table_number} đã thanh toán xong`,
        data: data,
        timestamp: data.timestamp || new Date().toISOString(),
        icon: "bill",
        priority: "medium",
      });
    };

    // Đăng ký listeners
    socket.on("admin_new_order", handleNewOrder);
    socket.on("admin_order_update", handleOrderUpdate);
    socket.on("admin_table_update", handleTableUpdate);
    socket.on("bill_request", handleBillRequest);
    socket.on("table_session_update", handleTableSession);
    socket.on("admin_payment_completed", handlePaymentCompleted);

    // Cleanup
    return () => {
      socket.off("admin_new_order", handleNewOrder);
      socket.off("admin_order_update", handleOrderUpdate);
      socket.off("admin_table_update", handleTableUpdate);
      socket.off("bill_request", handleBillRequest);
      socket.off("table_session_update", handleTableSession);
      socket.off("admin_payment_completed", handlePaymentCompleted);
    };
  }, [socket, addNotification, playNewOrderSound, playUpdateSound]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}
