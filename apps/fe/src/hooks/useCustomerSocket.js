// apps/fe/src/hooks/useCustomerSocket.js
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";
import { audioNotificationService } from "../services/audioNotificationService";
import { SOCKET_EVENTS } from "../constants/socketEvents";

const NOTIFICATION_SOUND = "/sounds/notification.mp3";

/**
 * Custom hook để lắng nghe socket events cho customer
 * @param {boolean} notify - Có hiển thị popup và phát âm thanh hay không?
 */
const useCustomerSocket = (notify = true) => {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Phát âm thanh qua AudioNotificationService (đã chống rung/vọng âm)
  const playSound = () => {
    audioNotificationService.play(NOTIFICATION_SOUND, { volume: 0.7, throttleMs: 300 });
  };

  useEffect(() => {
    if (!socket) {
      setIsConnected(false);
      return;
    }

    const handleConnect = () => {
      console.log("🟢 Customer Socket Connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("🔴 Customer Socket Disconnected");
      setIsConnected(false);
    };

    // 1. Cập nhật trạng thái Đơn hàng (Order Status)
    const handleOrderStatusUpdate = (data) => {
      console.log("📢 [Customer] Order Status Update:", data);
      setLastUpdate({ type: "order_status", data, timestamp: Date.now() });

      if (notify) {
        toast.info(
          `🍽️ ${data.message || "Đơn hàng của bạn đã được cập nhật!"}`,
          { position: "top-right", autoClose: 4000 }
        );
        playSound();
      }
    };

    // 2. Cập nhật trạng thái Món ăn (Item Status)
    const handleOrderItemStatusUpdate = (data) => {
      console.log("📢 [Customer] Order Item Status Update:", data);
      setLastUpdate({ type: "order_item_status", data, timestamp: Date.now() });

      if (notify) {
        const statusMessages = {
          preparing: "🔥 Món của bạn đang được chuẩn bị!",
          ready: "✅ Món của bạn đã sẵn sàng!",
          served: "🍽️ Món của bạn đã được phục vụ!",
          rejected: "❌ Món của bạn đã bị từ chối",
        };

        const message = statusMessages[data.status] || "Cập nhật món ăn!";

        if (data.status === "rejected") {
          toast.error(message, { position: "top-right", autoClose: 4000 });
        } else {
          toast.success(message, { position: "top-right", autoClose: 3000 });
        }

        if (["ready", "served", "rejected"].includes(data.status)) {
          playSound();
        }
      }
    };

    // 3. Cập nhật Hóa đơn (Bill Update)
    const handleBillUpdate = (data) => {
      console.log("📢 [Customer] Bill Update:", data);
      setLastUpdate({ type: "bill_update", data, timestamp: Date.now() });

      if (notify) {
        toast.success(data.message || "💰 Hóa đơn đã được cập nhật!", {
          position: "top-right",
          autoClose: 3000,
        });
        playSound();
      }
    };

    // 4. Xác nhận yêu cầu thanh toán
    const handleBillRequestConfirmed = (data) => {
      console.log("📢 [Customer] Bill Request Confirmed:", data);
      setLastUpdate({
        type: "bill_request_confirmed",
        data,
        timestamp: Date.now(),
      });

      if (notify) {
        toast.success(
          "✅ Yêu cầu thanh toán đã được xác nhận! Nhân viên sẽ đến ngay.",
          { position: "top-right", autoClose: 5000 }
        );
        playSound();
      }
    };

    // 5. Thông báo chung (Table Notification)
    const handleTableNotification = (data) => {
      console.log("📢 [Customer] Table Notification:", data);
      setLastUpdate({
        type: "table_notification",
        data,
        timestamp: Date.now(),
      });

      if (notify) {
        toast.info(data.message || "📢 Thông báo từ nhà hàng", {
          position: "top-right",
          autoClose: 4000,
        });
        playSound();
      }
    };

    // --- Đăng ký listeners chuẩn hóa ---
    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATE, handleOrderStatusUpdate);
    socket.on(SOCKET_EVENTS.ORDER_ITEM_STATUS_UPDATE, handleOrderItemStatusUpdate);
    socket.on(SOCKET_EVENTS.BILL_UPDATE, handleBillUpdate);
    socket.on(SOCKET_EVENTS.BILL_REQUEST_CONFIRMED, handleBillRequestConfirmed);
    socket.on(SOCKET_EVENTS.TABLE_NOTIFICATION, handleTableNotification);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATE, handleOrderStatusUpdate);
      socket.off(SOCKET_EVENTS.ORDER_ITEM_STATUS_UPDATE, handleOrderItemStatusUpdate);
      socket.off(SOCKET_EVENTS.BILL_UPDATE, handleBillUpdate);
      socket.off(SOCKET_EVENTS.BILL_REQUEST_CONFIRMED, handleBillRequestConfirmed);
      socket.off(SOCKET_EVENTS.TABLE_NOTIFICATION, handleTableNotification);
    };
  }, [socket, notify]);

  return {
    socket,
    isConnected,
    lastUpdate,
  };
};

export default useCustomerSocket;
