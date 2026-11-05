// apps/fe/src/context/SocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  // State thông tin bàn & qrToken
  const [tableInfo, setTableInfo] = useState({
    tableCode: localStorage.getItem("tableCode"),
    qrToken: localStorage.getItem("qrToken"),
  });

  // Lấy user & accessToken từ Redux
  const { user, accessToken } = useSelector((state) => state.auth);

  // Hàm cập nhật tableInfo
  const updateTableInfo = useCallback(() => {
    const currentTableCode = localStorage.getItem("tableCode");
    const currentQrToken = localStorage.getItem("qrToken");
    setTableInfo((prev) => {
      if (
        prev.tableCode === currentTableCode &&
        prev.qrToken === currentQrToken
      ) {
        return prev;
      }
      return {
        tableCode: currentTableCode,
        qrToken: currentQrToken,
      };
    });
  }, []);

  // Lắng nghe sự thay đổi của localStorage (cross-tab hoặc custom event)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "qrToken" || e.key === "tableCode" || e.key === "accessToken") {
        updateTableInfo();
      }
    };

    const handleQrTokenSet = () => {
      updateTableInfo();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("qrTokenSet", handleQrTokenSet);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("qrTokenSet", handleQrTokenSet);
    };
  }, [updateTableInfo]);

  // Cập nhật auth token vào socket đang mở khi token được refresh
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.auth = {
        ...socketRef.current.auth,
        token: accessToken || localStorage.getItem("accessToken") || undefined,
        qrToken: tableInfo.qrToken || undefined,
        tableCode: tableInfo.tableCode || undefined,
      };
    }
  }, [accessToken, tableInfo]);

  // Quản lý khởi tạo & vòng đời kết nối Socket
  useEffect(() => {
    const { tableCode, qrToken } = tableInfo;
    const token = accessToken || localStorage.getItem("accessToken");

    // Chỉ kết nối nếu có user đã đăng nhập HOẶC khách đã quét QR
    const shouldConnect = user || qrToken;

    if (!shouldConnect) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    // Nếu đã có socket kết nối
    if (socketRef.current?.connected) {
      if (tableCode && !user) {
        socketRef.current.emit("join_table", { tableCode });
        console.log("🪑 Re-joined table:", tableCode);
      }
      return;
    }

    // Đóng socket cũ nếu có
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Khởi tạo kết nối Socket.IO kèm Auth Payload
    const newSocket = io(import.meta.env.VITE_APP_BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: token || undefined,
        qrToken: qrToken || undefined,
        tableCode: tableCode || undefined,
      },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🟢 Socket Connected:", newSocket.id);

      // Backend đã tự động join room qua handshake middleware,
      // emit dưới đây nhằm tương thích ngược và thông báo chủ động
      if (user) {
        const role = (user.role || "").toLowerCase();
        if (role === "admin" || role === "superadmin") {
          newSocket.emit("join_admin");
        } else if (role === "kitchen") {
          newSocket.emit("join_kitchen");
        } else if (role === "waiter") {
          newSocket.emit("join_waiter");
        } else if (role === "customer" && tableCode) {
          newSocket.emit("join_table", { tableCode, userId: user.id });
        }
      } else if (qrToken && tableCode) {
        newSocket.emit("join_table", { tableCode });
      }
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [user, tableInfo, accessToken]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;
