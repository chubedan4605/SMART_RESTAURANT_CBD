// apps/fe/src/context/AdminSocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useSocket } from "./SocketContext";
import { SOCKET_EVENTS } from "../constants/socketEvents";

/**
 * AdminSocketContext
 * Quản lý tập trung các socket events cho phân hệ Admin / Management.
 * Sử dụng Set Subscriber Refs để loại bỏ hoàn toàn hiện tượng Effect Thrashing (re-subscribe vòng lặp).
 */
const AdminSocketContext = createContext(null);

export const AdminSocketProvider = ({ children }) => {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);

  // State lưu trữ bản ghi cập nhật gần nhất
  const [orderUpdate, setOrderUpdate] = useState(null);
  const [tableUpdate, setTableUpdate] = useState(null);
  const [paymentUpdate, setPaymentUpdate] = useState(null);
  const [billRequestUpdate, setBillRequestUpdate] = useState(null);

  // Dùng Ref dạng Set để lưu subscriber callbacks, tránh re-trigger Effect khi thêm/bớt subscriber
  const orderSubscribersRef = useRef(new Set());
  const tableSubscribersRef = useRef(new Set());
  const paymentSubscribersRef = useRef(new Set());
  const dashboardSubscribersRef = useRef(new Set());

  const subscribeToOrders = useCallback((callback) => {
    orderSubscribersRef.current.add(callback);
    return () => {
      orderSubscribersRef.current.delete(callback);
    };
  }, []);

  const subscribeToTables = useCallback((callback) => {
    tableSubscribersRef.current.add(callback);
    return () => {
      tableSubscribersRef.current.delete(callback);
    };
  }, []);

  const subscribeToPayments = useCallback((callback) => {
    paymentSubscribersRef.current.add(callback);
    return () => {
      paymentSubscribersRef.current.delete(callback);
    };
  }, []);

  const subscribeToDashboard = useCallback((callback) => {
    dashboardSubscribersRef.current.add(callback);
    return () => {
      dashboardSubscribersRef.current.delete(callback);
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      setIsConnected(false);
      return;
    }

    const handleConnect = () => {
      console.log("🟢 Admin Socket Connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("🔴 Admin Socket Disconnected");
      setIsConnected(false);
    };

    // Helper phát tin cho các subscribers
    const notifySubscribers = (subscribersSet, update) => {
      subscribersSet.forEach((cb) => {
        try {
          cb(update);
        } catch (err) {
          console.error("AdminSocketContext subscriber error:", err);
        }
      });
    };

    // === ORDER EVENTS ===
    const handleNewOrder = (data) => {
      console.log("📢 [AdminSocket] New Order:", data);
      const update = { type: "new_order", data, timestamp: Date.now() };
      setOrderUpdate(update);
      notifySubscribers(orderSubscribersRef.current, update);
      notifySubscribers(dashboardSubscribersRef.current, update);
    };

    const handleOrderUpdate = (data) => {
      console.log("📢 [AdminSocket] Order Update:", data);
      const update = { type: "order_update", data, timestamp: Date.now() };
      setOrderUpdate(update);
      notifySubscribers(orderSubscribersRef.current, update);
      notifySubscribers(dashboardSubscribersRef.current, update);
    };

    // === TABLE EVENTS ===
    const handleTableUpdate = (data) => {
      console.log("📢 [AdminSocket] Table Update:", data);
      const update = { type: "table_update", data, timestamp: Date.now() };
      setTableUpdate(update);
      notifySubscribers(tableSubscribersRef.current, update);
      notifySubscribers(dashboardSubscribersRef.current, update);
    };

    const handleTableSessionUpdate = (data) => {
      console.log("📢 [AdminSocket] Table Session Update:", data);
      const update = {
        type: "table_session_update",
        data,
        timestamp: Date.now(),
      };
      setTableUpdate(update);
      notifySubscribers(tableSubscribersRef.current, update);
      notifySubscribers(dashboardSubscribersRef.current, update);
    };

    // === PAYMENT EVENTS ===
    const handlePaymentCompleted = (data) => {
      console.log("📢 [AdminSocket] Payment Completed:", data);
      const update = { type: "payment_completed", data, timestamp: Date.now() };
      setPaymentUpdate(update);
      notifySubscribers(paymentSubscribersRef.current, update);
      notifySubscribers(dashboardSubscribersRef.current, update);
      notifySubscribers(orderSubscribersRef.current, update);
    };

    // === BILL REQUEST EVENTS ===
    const handleBillRequest = (data) => {
      console.log("📢 [AdminSocket] Bill Request:", data);
      const update = { type: "bill_request", data, timestamp: Date.now() };
      setBillRequestUpdate(update);
      notifySubscribers(orderSubscribersRef.current, update);
    };

    // Đăng ký listeners
    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);

    // Orders
    socket.on(SOCKET_EVENTS.ADMIN_NEW_ORDER, handleNewOrder);
    socket.on(SOCKET_EVENTS.ADMIN_ORDER_UPDATE, handleOrderUpdate);

    // Tables
    socket.on(SOCKET_EVENTS.TABLE_UPDATE, handleTableUpdate);
    socket.on(SOCKET_EVENTS.ADMIN_TABLE_UPDATE, handleTableUpdate);
    socket.on(SOCKET_EVENTS.TABLE_SESSION_UPDATE, handleTableSessionUpdate);

    // Payments
    socket.on(SOCKET_EVENTS.ADMIN_PAYMENT_COMPLETED, handlePaymentCompleted);
    socket.on(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePaymentCompleted);

    // Bill Request
    socket.on(SOCKET_EVENTS.BILL_REQUEST, handleBillRequest);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(SOCKET_EVENTS.ADMIN_NEW_ORDER, handleNewOrder);
      socket.off(SOCKET_EVENTS.ADMIN_ORDER_UPDATE, handleOrderUpdate);
      socket.off(SOCKET_EVENTS.TABLE_UPDATE, handleTableUpdate);
      socket.off(SOCKET_EVENTS.ADMIN_TABLE_UPDATE, handleTableUpdate);
      socket.off(SOCKET_EVENTS.TABLE_SESSION_UPDATE, handleTableSessionUpdate);
      socket.off(SOCKET_EVENTS.ADMIN_PAYMENT_COMPLETED, handlePaymentCompleted);
      socket.off(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePaymentCompleted);
      socket.off(SOCKET_EVENTS.BILL_REQUEST, handleBillRequest);
    };
  }, [socket]); // Chỉ phụ thuộc vào socket instance duy nhất

  const value = {
    socket,
    isConnected,
    orderUpdate,
    tableUpdate,
    paymentUpdate,
    billRequestUpdate,
    subscribeToOrders,
    subscribeToTables,
    subscribeToPayments,
    subscribeToDashboard,
  };

  return (
    <AdminSocketContext.Provider value={value}>
      {children}
    </AdminSocketContext.Provider>
  );
};

export const useAdminSocketContext = () => {
  const context = useContext(AdminSocketContext);
  if (!context) {
    return {
      socket: null,
      isConnected: false,
      orderUpdate: null,
      tableUpdate: null,
      paymentUpdate: null,
      billRequestUpdate: null,
      subscribeToOrders: () => () => {},
      subscribeToTables: () => () => {},
      subscribeToPayments: () => () => {},
      subscribeToDashboard: () => () => {},
    };
  }
  return context;
};

export default AdminSocketContext;
