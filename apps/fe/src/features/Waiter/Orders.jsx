import React, { useMemo, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
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
import { SOCKET_EVENTS } from "../../constants/socketEvents";

import OrderCard from "../../Components/OrderCard";
import OrderDetailModal from "../../Components/OrderDetailModal";
import BillModal from "../../Components/BillModal";

export default function WaiterOrdersPage() {
  const socket = useSocket();
  const { play: playNotificationSound } = useNotificationSound(
    "/sounds/new-order.mp3",
  );

  const [activeTab, setActiveTab] = useState("orders");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [myTables, setMyTables] = useState([]);
  const [orders, setOrders] = useState([]);

  const ordersRef = useRef(orders);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("received");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTableForBill, setSelectedTableForBill] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [ordersRes, tablesRes] = await Promise.all([
        axiosClient.get("/orders"),
        axiosClient.get("/tables/my-tables"),
      ]);

      const list = Array.isArray(ordersRes) ? ordersRes : [];
      list.forEach((order) => {
        order.items = (order.items || []).filter((item) => item.status === "received");
      });

      setOrders(list);
      setMyTables(Array.isArray(tablesRes) ? tablesRes : []);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchAllData();
    setSelectedTableForBill(null);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      if (soundEnabledRef.current) {
        playNotificationSound();
      }
      toast.info(`🔔 Đơn mới từ bàn ${newOrder.table_number || "Mang về"}`);
    };

    const handleUpdateOrder = (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
      );
    };

    const handlePaymentCompleted = (data) => {
      fetchAllData();
      toast.success(`💰 Bàn ${data.table_number || ""} đã thanh toán xong`);
    };

    socket.on(SOCKET_EVENTS.NEW_ORDER, handleNewOrder);
    socket.on(SOCKET_EVENTS.UPDATE_ORDER, handleUpdateOrder);
    socket.on(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePaymentCompleted);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_ORDER, handleNewOrder);
      socket.off(SOCKET_EVENTS.UPDATE_ORDER, handleUpdateOrder);
      socket.off(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePaymentCompleted);
    };
  }, [socket, playNotificationSound]);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.table_number || "").toLowerCase().includes(q) ||
          (o.items || []).some((it) => it.name?.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [orders, statusFilter, search]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axiosClient.patch(`/orders/${orderId}`, { status });
      toast.success("Cập nhật đơn hàng thành công!");
      fetchAllData();
    } catch {
      toast.error("Lỗi cập nhật trạng thái đơn");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold/30 selection:text-gold" style={{ scrollbarGutter: "stable" }}>
      {/* Top Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md shadow-xs">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-luxe text-gold font-semibold mb-1">
                Waiter Service Dashboard
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground">
                Quản Lý Đơn Phục Vụ
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-11 h-11 flex items-center justify-center border transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-gold/15 border-gold/40 text-gold"
                    : "bg-muted border-border text-muted-foreground"
                }`}
                title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              <button
                type="button"
                onClick={fetchAllData}
                className="min-h-11 px-4 rounded-none bg-card hover:bg-muted border border-border text-foreground text-xs uppercase tracking-luxe font-medium transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={15} className="text-gold" /> Làm mới
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã đơn, số bàn, tên món..."
                className="w-full bg-background border border-border rounded-none pl-11 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold min-h-11 font-sans placeholder:text-muted-foreground"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 bg-background border border-border min-h-11">
              <Filter size={15} className="text-gold" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-foreground outline-none cursor-pointer font-sans uppercase tracking-wider"
              >
                <option value="received" className="bg-card text-foreground">
                  Chờ xử lý ({orders.filter((o) => o.status === "received").length})
                </option>
                <option value="preparing" className="bg-card text-foreground">
                  Đang nấu ({orders.filter((o) => o.status === "preparing").length})
                </option>
                <option value="ready" className="bg-card text-foreground">
                  Sẵn sàng ({orders.filter((o) => o.status === "ready").length})
                </option>
                <option value="completed" className="bg-card text-foreground">Đã xong</option>
                <option value="rejected" className="bg-card text-foreground">Đã hủy</option>
                <option value="all" className="bg-card text-foreground">Tất cả</option>
              </select>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex gap-8 mt-5 border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`pb-3 text-xs uppercase tracking-luxe font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "border-gold text-gold font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Đơn Hàng ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("my-tables")}
              className={`pb-3 text-xs uppercase tracking-luxe font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === "my-tables"
                  ? "border-gold text-gold font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
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
          <div className="flex items-center justify-center min-h-72">
            <div className="text-muted-foreground text-sm font-sans animate-pulse">
              Đang tải danh sách phục vụ...
            </div>
          </div>
        ) : (
          <>
            {/* VIEW: ORDERS */}
            <div className={activeTab === "orders" ? "block" : "hidden"}>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-none border border-border">
                  <p className="text-muted-foreground text-sm font-sans">
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

            {/* VIEW: MY TABLES */}
            <div className={activeTab === "my-tables" ? "block" : "hidden"}>
              {myTables.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground bg-card rounded-none border border-border text-sm font-sans">
                  Bạn chưa được phân công phụ trách bàn nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {myTables.map((table) => (
                    <div
                      key={table.id}
                      className="bg-card text-card-foreground border border-border p-5 rounded-none shadow-xs hover:border-gold/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-2xl font-serif font-medium text-foreground">
                            Bàn {table.table_number}
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-none font-sans uppercase tracking-luxe font-semibold border ${
                              table.status === "active"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : "bg-destructive/15 border-destructive/30 text-destructive"
                            }`}
                          >
                            {table.status}
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1 font-sans">
                          <MapPin size={13} className="text-gold" />
                          <span>{table.location}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-sans">
                          <User size={13} className="text-gold" />
                          <span>{table.capacity} Khách</span>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2 mt-4 border-t border-border/50">
                        <button
                          type="button"
                          onClick={() => {
                            setSearch(table.table_number);
                            setActiveTab("orders");
                          }}
                          className="w-full min-h-11 py-2 bg-muted hover:bg-muted/80 border border-border text-foreground text-xs uppercase tracking-luxe font-medium transition-all cursor-pointer rounded-none"
                        >
                          Xem Đơn Bàn Này
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTableForBill(table)}
                          className="w-full min-h-11 py-2 bg-gold hover:bg-gold-soft text-ink text-xs uppercase tracking-luxe font-semibold transition-all cursor-pointer rounded-none shadow-sm"
                        >
                          💰 Thanh Toán Bill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Order Detail */}
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

      {/* Bill Modal */}
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
