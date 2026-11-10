import React, { useMemo, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  ChefHat,
  Search,
  Flame,
  Volume2,
  VolumeX,
  AlertTriangle,
} from "lucide-react";
import axiosClient from "../../store/axiosClient";
import { useSocket } from "../../context/SocketContext";
import { useNotificationSound } from "../../hooks/useNotificationSound";
import { SOCKET_EVENTS } from "../../constants/socketEvents";
import KitchenOrderCard from "./components/KitchenOrderCard";
import KitchenOrderDetailModal from "./components/KitchenOrderDetailModal";

export default function KitchenPage() {
  const socket = useSocket();
  const { play: playNotificationSound } = useNotificationSound(
    "/sounds/kitchen-order.mp3",
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/orders?status=preparing");
      const list = Array.isArray(res) ? res : [];
      setOrders(
        list.map((order) => ({
          ...order,
          items: (order.items || []).filter(
            (item) => item.status === "preparing",
          ),
        })),
      );
    } catch {
      toast.error("Lỗi tải đơn bếp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateOrder = (updatedOrder) => {
      if (updatedOrder.status === "preparing") {
        const preparingItems = (updatedOrder.items || []).filter(
          (item) => item.status === "preparing",
        );

        if (preparingItems.length === 0) return;

        const orderWithFilteredItems = {
          ...updatedOrder,
          items: preparingItems,
        };

        setOrders((prev) => {
          const existingIndex = prev.findIndex((o) => o.id === updatedOrder.id);
          if (existingIndex !== -1) {
            const newOrders = [...prev];
            newOrders[existingIndex] = orderWithFilteredItems;
            return newOrders;
          }
          return [orderWithFilteredItems, ...prev];
        });

        if (soundEnabledRef.current) {
          playNotificationSound();
        }

        toast.info(`🍳 Nấu món mới: ${updatedOrder.table_number || "Mang về"}`);
      } else {
        setOrders((prev) => prev.filter((o) => o.id !== updatedOrder.id));
      }
    };

    const handlePaymentCompleted = (data) => {
      fetchOrders();
      toast.success(`💰 Thanh toán xong: ${data.table_number || "Mang về"}`);
    };

    socket.on(SOCKET_EVENTS.UPDATE_ORDER, handleUpdateOrder);
    socket.on(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePaymentCompleted);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_ORDER, handleUpdateOrder);
      socket.off(SOCKET_EVENTS.PAYMENT_COMPLETED, handlePaymentCompleted);
    };
  }, [socket, playNotificationSound]);

  const { urgentCount, filteredAndSorted } = useMemo(() => {
    const now = Date.now();
    const q = search.trim().toLowerCase();
    let result = orders;
    if (q) {
      result = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.table_number || "").toLowerCase().includes(q) ||
          (o.items || []).some((it) => it.item_name?.toLowerCase().includes(q)),
      );
    }

    const withUrgency = result.map((order) => {
      const items = order.items || [];
      const maxPrepTime = Math.max(
        ...items.map((it) => it.prep_time_minutes || 15),
        15,
      );
      const elapsedMins = (now - new Date(order.created_at).getTime()) / 60000;
      const isUrgent = elapsedMins >= maxPrepTime;

      return { ...order, isUrgent, elapsedMins, maxPrepTime };
    });

    const urgent = withUrgency.filter((o) => o.isUrgent).length;
    const sorted = withUrgency.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return b.elapsedMins - a.elapsedMins;
    });

    return { urgentCount: urgent, filteredAndSorted: sorted };
  }, [orders, search]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await axiosClient.patch(`/orders/${orderId}`, { status });
      if (res) toast.success("Món đã xong! ✅");
      setSelected(null);
      fetchOrders();
    } catch {
      toast.error("Lỗi cập nhật");
    }
  };

  const handleUpdateItemStatus = async (orderId, itemId, status) => {
    try {
      await axiosClient.patch(`/orders/items/${itemId}`, { status });

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            items: order.items.map((item) =>
              item.id === itemId ? { ...item, status } : item,
            ),
          };
        }),
      );

      if (selected?.id === orderId) {
        setSelected((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id === itemId ? { ...item, status } : item,
          ),
        }));
      }

      toast.success("Đã cập nhật món! ✅");
    } catch {
      toast.error("Lỗi cập nhật món");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-gold/30 selection:text-gold" style={{ scrollbarGutter: "stable" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md shadow-xs">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-gold/15 border border-gold/30">
                <ChefHat className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold font-sans font-semibold text-xs uppercase tracking-luxe">
                  Kitchen KDS Console
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-serif font-medium text-foreground mt-2">
                Danh Sách Đơn Cần Nấu
              </h1>
            </div>

            <div className="flex items-center gap-3">
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

              {urgentCount > 0 && (
                <div className="inline-flex items-center gap-2 px-4 min-h-11 bg-destructive/15 border border-destructive/30 text-destructive animate-pulse">
                  <AlertTriangle size={16} className="animate-bounce shrink-0" />
                  <span className="text-xs font-sans uppercase tracking-luxe font-semibold">
                    {urgentCount} Đơn Trễ
                  </span>
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-4 min-h-11 bg-card border border-border text-foreground">
                <Flame size={16} className="text-gold" />
                <span className="text-xs font-sans uppercase tracking-luxe">
                  Đang nấu: <strong className="font-serif text-base text-gold font-medium ml-1">{orders.length}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã đơn, số bàn, món ăn..."
                className="w-full bg-background border border-border rounded-none pl-11 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-gold min-h-11 font-sans placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 py-6 pb-24">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm font-sans">
            Đang tải dữ liệu chế biến...
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-base font-serif">
            Hết đơn! Bếp hiện không có món chờ ☕
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-fr">
            {filteredAndSorted.map((o) => (
              <KitchenOrderCard
                key={o.id}
                order={o}
                onView={() => setSelected(o)}
                onComplete={() => handleUpdateStatus(o.id, "ready")}
                onStart={() => toast.info("Bắt đầu nấu...")}
                onUpdateItemStatus={handleUpdateItemStatus}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <KitchenOrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onComplete={() => handleUpdateStatus(selected.id, "ready")}
          onUpdateItemStatus={handleUpdateItemStatus}
        />
      )}
    </div>
  );
}
