import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Receipt,
  Search,
  RefreshCw,
  Filter,
  User,
  MapPin,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import axiosClient from "../../store/axiosClient";
import { useSocket } from "../../context/SocketContext";
import { useNotificationSound } from "../../hooks/useNotificationSound";

// Import Components
import OrderCard from "../../Components/OrderCard";
import OrderDetailModal from "../../Components/OrderDetailModal";
import BillModal from "../../Components/BillModal";

export default function WaiterOrdersPage() {
  const socket = useSocket();
  const { play: playNotificationSound } = useNotificationSound(
    "/sounds/new-order.mp3",
  );

  const [activeTab, setActiveTab] = useState("orders");
  const [soundEnabled, setSoundEnabled] = useState(true); // Toggle âm thanh

  // State dữ liệu
  const [myTables, setMyTables] = useState([]);
  const [orders, setOrders] = useState([]);

  // Loading
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("received");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Bill Modal
  const [selectedTableForBill, setSelectedTableForBill] = useState(null);

  // 1. Tải TẤT CẢ dữ liệu cần thiết 1 lần khi vào trang (Parallel Fetching)
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Chạy song song cả 2 API để tiết kiệm thời gian
      const [ordersRes, tablesRes] = await Promise.all([
        axiosClient.get("/orders"),
        axiosClient.get("/tables/my-tables"),
      ]);

      // lọc chỉ lấy những items ở trạng thái received cho từng đơn
      ordersRes.forEach((order) => {
        order.items = order.items.filter((item) => item.status === "received");
      });

      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setMyTables(Array.isArray(tablesRes) ? tablesRes : []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh lại cả danh sách đơn và danh sách bàn
    // fetchOrders();
    fetchAllData();
    setSelectedTableForBill(null); // Đóng modal
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. Socket Real-time
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (newOrder) => {
      console.log("Received new_order via Socket.IO:", newOrder);

      newOrder.items = newOrder.items.filter(
        (item) => item.status === "received",
      );
      // lọc lấy những items có trạng thái là received
      setOrders((prev) => {
        // Kiểm tra xem đơn hàng này đã có trong danh sách chưa
        const exists = prev.find((o) => o.id === newOrder.id);

        if (exists) {
          // TRƯỜNG HỢP 1: Đơn đã tồn tại (khách gọi thêm món) -> Cập nhật lại đơn đó
          return prev.map((o) => (o.id === newOrder.id ? newOrder : o));
        } else {
          // TRƯỜNG HỢP 2: Đơn hoàn toàn mới -> Thêm vào đầu danh sách
          return [newOrder, ...prev];
        }
      });

      // 🔔 Phát âm thanh thông báo
      if (soundEnabled) {
        playNotificationSound();
      }

      const isUpdate = orders.some((o) => o.id === newOrder.id);
      toast.info(
        isUpdate
          ? `🔔 Bàn ${newOrder.table_number} vừa cập nhật/gọi thêm món!`
          : `🔔 Đơn mới: Bàn ${newOrder.table_number || "Mang về"}`,
      );
    };

    // 🆕 Handler cho event khi khách gọi thêm món vào đơn đang preparing
    const handleOrderItemsAdded = (orderData) => {
      console.log("Received order_items_added via Socket.IO:", orderData);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderData.id ? orderData : o)),
      );

      // 🔔 Phát âm thanh thông báo đặc biệt
      if (soundEnabled) {
        playNotificationSound();
      }

      toast.warning(
        `⚠️ Bàn ${orderData.table_number} gọi thêm món! Cần duyệt món mới.`,
        { autoClose: 5000 },
      );
    };

    const handleUpdateOrder = (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
      );
      if (updatedOrder.status === "ready") {
        // 🔔 Phát âm thanh khi món xong
        if (soundEnabled) {
          playNotificationSound();
        }
        toast.success(`✅ Món bàn ${updatedOrder.table_number} đã xong!`);
      }
    };

    // 💰 Handler cho thanh toán thành công
    const handlePaymentCompleted = (data) => {
      console.log("Received payment_completed via Socket.IO:", data);

      const { table_id, table_number, total_amount, message } = data;

      // 🔔 Phát âm thanh thông báo thanh toán
      if (soundEnabled) {
        playNotificationSound();
      }

      // Hiển thị thông báo thanh toán thành công
      toast.success(
        message || `💰 Bàn ${table_number} đã thanh toán thành công!`,
        {
          autoClose: 7000,
          position: "top-center",
        },
      );

      // Cập nhật trực tiếp orders của bàn vừa thanh toán thành "completed"
      setOrders((prev) =>
        prev.map((order) => {
          if (
            order.table_id === table_id ||
            order.table_id === String(table_id)
          ) {
            if (order.status !== "completed" && order.status !== "rejected") {
              return { ...order, status: "completed" };
            }
          }
          return order;
        }),
      );

      // Cũng refresh lại danh sách bàn
      fetchAllData();
    };

    // 🏷️ Handler cho cập nhật phân công bàn từ admin
    const handleTableAssignmentUpdate = (data) => {
      console.log("Received table_assignment_update via Socket.IO:", data);

      // Lấy userId từ localStorage để kiểm tra có phải waiter này không
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const currentUserId = currentUser?.id;

      // Nếu là waiter này được cập nhật
      if (String(data.waiterId) === String(currentUserId)) {
        // 🔔 Phát âm thanh thông báo
        if (soundEnabled) {
          playNotificationSound();
        }

        // Cập nhật trực tiếp danh sách bàn nếu có data
        if (data.tables && Array.isArray(data.tables)) {
          setMyTables(data.tables);
          toast.info(
            `📋 Admin đã cập nhật danh sách bàn của bạn! (${data.tables.length} bàn)`,
            { autoClose: 5000 },
          );
        } else {
          // Nếu không có tables chi tiết, fetch lại
          fetchAllData();
          toast.info(`📋 Danh sách bàn phụ trách đã được cập nhật!`, {
            autoClose: 5000,
          });
        }
      }
    };

    socket.on("new_order", handleNewOrder);
    socket.on("order_items_added", handleOrderItemsAdded);
    socket.on("update_order", handleUpdateOrder);
    socket.on("payment_completed", handlePaymentCompleted);
    socket.on("table_assignment_update", handleTableAssignmentUpdate);

    return () => {
      socket.off("new_order", handleNewOrder);
      socket.off("order_items_added", handleOrderItemsAdded);
      socket.off("update_order", handleUpdateOrder);
      socket.off("payment_completed", handlePaymentCompleted);
      socket.off("table_assignment_update", handleTableAssignmentUpdate);
    };
  }, [socket, soundEnabled, playNotificationSound, orders]);

  // 3. Logic Filter (Giữ nguyên)
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchStatus =
        statusFilter === "all" ? true : o.status === statusFilter;
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.table_number || "").toLowerCase().includes(q) ||
        (o.items || []).some((it) => it.name.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  // Actions
  const handleUpdateStatus = async (orderId, status) => {
    try {
      if (status === "rejected") {
        // kiểm tra xem có item nào đã được chuẩn bị không
        const order = orders.find((o) => o.id === orderId);
        const hasPreparingItems = order.items.some(
          (item) => item.status === "preparing" || item.status === "completed",
        );
        if (hasPreparingItems) {
          toast.error("Không thể hủy đơn đã có món được chuẩn bị.");
          return;
        }
      }
      await axiosClient.patch(`/orders/${orderId}`, { status });
      toast.success(
        status === "preparing" ? "Đã nhận đơn & Chuyển bếp" : "Đã cập nhật",
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
    } catch (e) {
      toast.error("Lỗi cập nhật");
    }
  };

  return (
    <div
      className=" bg-neutral-950 text-white font-sans"
      style={{ scrollbarGutter: "stable" }}
    >
      {/* Header */}
      <div className="top-0 z-30 border-b border-white/10 bg-neutral-950/95 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex pt-5 items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Receipt className="w-4 h-4 text-orange-500" />
                <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">
                  Waiter Console
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black mt-3 text-white">
                Quản lý Đơn Hàng
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* 🔔 Nút Toggle Âm Thanh */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border transition-all ${
                  soundEnabled
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
                    : "bg-white dark:bg-neutral-950/5 border-white/10 text-gray-500"
                }`}
                title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              <button
                onClick={fetchAllData}
                className="px-4 py-2 rounded-xl bg-white dark:bg-neutral-950/5 hover:bg-white dark:bg-neutral-950/10 border border-white/10 text-gray-200 transition-all inline-flex items-center gap-2"
              >
                <RefreshCw size={18} /> Làm mới
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-5 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã đơn, số bàn, tên món..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-white hover:bg-white dark:bg-neutral-950/10 transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-950/5 border border-white/10">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-200 outline-none cursor-pointer [&>option]:bg-neutral-900"
              >
                <option value="received">
                  ⏳ Chờ xử lý (
                  {orders.filter((o) => o.status === "received").length})
                </option>
                <option value="preparing">
                  🔥 Đang nấu (
                  {orders.filter((o) => o.status === "preparing").length})
                </option>
                <option value="ready">
                  ✅ Sẵn sàng (
                  {orders.filter((o) => o.status === "ready").length})
                </option>
                <option value="completed">💰 Đã xong</option>
                <option value="rejected">❌ Đã hủy</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex gap-6 mt-6 border-b border-white/5">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === "orders"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Đơn Hàng
            </button>
            <button
              onClick={() => setActiveTab("my-tables")}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === "my-tables"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Bàn Của Tôi ({myTables.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content List */}
      <div className="container mx-auto max-w-6xl px-4 py-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center min-h-75">
            <div className="text-gray-500 animate-pulse flex flex-col items-center">
              <span>Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : (
          <>
            {/* KEY CHANGE: Thay vì dùng {activeTab === '...' && ...}
               Ta dùng class 'hidden' vs 'block'. 
               Cả 2 tabs đều được render sẵn trong DOM, chỉ ẩn hiện bằng CSS.
               Chuyển tab sẽ mượt tức thì vì không có Unmount/Remount.
            */}

            {/* --- VIEW: ORDERS --- */}
            <div
              className={
                activeTab === "orders"
                  ? "block animate-in fade-in duration-300"
                  : "hidden"
              }
            >
              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-neutral-950/5 rounded-2xl border border-white/5">
                  <p className="text-gray-400">
                    Không tìm thấy đơn hàng nào ở trạng thái này.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onView={() => setSelectedOrder(order)}
                      onAccept={() => handleUpdateStatus(order.id, "preparing")}
                      onReject={() => handleUpdateStatus(order.id, "rejected")}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* --- VIEW: MY TABLES --- */}
            <div
              className={
                activeTab === "my-tables"
                  ? "block animate-in fade-in duration-300"
                  : "hidden"
              }
            >
              {myTables.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white dark:bg-neutral-950/5 rounded-2xl border border-white/5">
                  Bạn chưa được phân công bàn nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {myTables.map((table) => (
                    <div
                      key={table.id}
                      className="bg-neutral-900 border border-white/10 p-5 rounded-xl shadow-lg relative hover:border-orange-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl font-black text-white">
                          {table.table_number}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-1 rounded uppercase font-bold ${
                            table.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {table.status}
                        </span>
                      </div>

                      <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-orange-500" />{" "}
                        {table.location}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <User size={14} className="text-orange-500" />{" "}
                        {table.capacity} Khách
                      </div>

                      <button
                        onClick={() => {
                          setSearch(table.table_number);
                          setActiveTab("orders");
                        }}
                        className="w-full mt-4 py-2 bg-white dark:bg-neutral-950/5 hover:bg-white dark:bg-neutral-950/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-all active:scale-95"
                      >
                        Xem đơn bàn này
                      </button>

                      <button
                        onClick={() => setSelectedTableForBill(table)} // Mở BillModal
                        className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-all active:scale-95"
                      >
                        💰 Tính tiền
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAccept={() => {
            handleUpdateStatus(selectedOrder.id, "preparing");
            setSelectedOrder(null);
          }}
          onReject={() => {
            handleUpdateStatus(selectedOrder.id, "rejected");
            setSelectedOrder(null);
          }}
        />
      )}

      {/* 5. RENDER MODAL Ở CUỐI CÙNG (Trước thẻ đóng </div> chính) */}
      {selectedTableForBill && (
        <BillModal
          tableId={selectedTableForBill.id}
          tableName={selectedTableForBill.table_number}
          onClose={() => setSelectedTableForBill(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
