import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle2,
  ChefHat,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { orderApi } from "../../services/orderApi";
import useCustomerSocket from "../../hooks/useCustomerSocket";
import OrderItemStatus from "../../Components/customer/OrderItemStatus";

// Map status từ backend sang UI status
const mapItemStatus = (status) => {
  switch (status) {
    case "served":
    case "ready":
      return "Ready";
    case "rejected":
      return "Rejected";
    case "preparing":
      return "Cooking";
    default:
      return "Queued";
  }
};

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isConnected, lastUpdate } = useCustomerSocket(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const qrToken = localStorage.getItem("qrToken");

  const fetchOrders = useCallback(async () => {
    if (!qrToken) {
      setError(t("order.tracking.scanQRToView"));
      setLoading(false);
      return;
    }

    try {
      setError("");
      const response = await orderApi.getOrdersByTable(qrToken);

      const mappedOrders = (response || []).map((order) => ({
        id: order.id,
        code: order.code || `ORD-${order.id.slice(0, 8)}`,
        tableNumber: order.table_number || "—",
        status: order.status,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
        estimatedTime: 20,
        items: (order.items || []).map((item, index) => ({
          id: item.id || `item-${index}`,
          name: item.item_name || item.name,
          quantity: item.quantity || item.qty,
          status: mapItemStatus(item.status),
          image: item.image_url || "",
        })),
      }));

      setOrders(mappedOrders);

      if (!selectedOrderId && mappedOrders.length > 0) {
        setSelectedOrderId(mappedOrders[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err?.response?.data?.message || t("errors.loadFailed"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [qrToken, selectedOrderId, t]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (
      lastUpdate &&
      (lastUpdate.type === "order_status" ||
        lastUpdate.type === "order_item_status" ||
        lastUpdate.type === "bill_update")
    ) {
      fetchOrders();
    }
  }, [lastUpdate, fetchOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusSummary = (order) => {
    if (!order)
      return { ready: 0, cooking: 0, queued: 0, rejected: 0, total: 0 };

    const ready = order.items.filter((i) => i.status === "Ready").length;
    const cooking = order.items.filter((i) => i.status === "Cooking").length;
    const queued = order.items.filter((i) => i.status === "Queued").length;
    const rejected = order.items.filter((i) => i.status === "Rejected").length;

    return { ready, cooking, queued, rejected, total: order.items.length };
  };

  // No QR Token
  if (!qrToken) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mb-6 text-gold">
          <AlertCircle size={36} />
        </div>
        <h2 className="text-2xl font-serif text-foreground mb-2 font-medium">
          {t("order.tracking.noTableInfo")}
        </h2>
        <p className="text-muted-foreground text-center mb-6 text-sm max-w-sm font-light">
          {t("order.tracking.scanQRToView")}
        </p>
        <Link
          to="/booking"
          className="min-h-11 px-8 py-3 bg-gold hover:bg-gold-soft text-ink font-sans text-xs tracking-luxe uppercase font-semibold transition-all shadow-md rounded-none inline-flex items-center justify-center"
        >
          {t("order.tracking.viewTableMap")}
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
        <p className="text-muted-foreground mb-4 text-sm">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-gold hover:text-gold-soft font-sans text-xs uppercase tracking-luxe font-semibold min-h-11 inline-flex items-center cursor-pointer"
        >
          &larr; {t("order.tracking.goBack")}
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-20 h-20 bg-card border border-border rounded-full flex items-center justify-center mb-6 text-muted-foreground">
          <ChefHat size={36} />
        </div>
        <h2 className="text-2xl font-serif text-foreground mb-2 font-medium">
          {t("order.tracking.noOrders")}
        </h2>
        <p className="text-muted-foreground text-center mb-6 text-sm max-w-sm font-light">
          {t("order.tracking.noOrdersDesc")}
        </p>
        <Link
          to="/menu"
          className="min-h-11 px-8 py-3 bg-gold hover:bg-gold-soft text-ink font-sans text-xs tracking-luxe uppercase font-semibold transition-all shadow-md rounded-none inline-flex items-center justify-center"
        >
          {t("order.tracking.viewMenu")}
        </Link>
      </div>
    );
  }

  const summary = getStatusSummary(selectedOrder);
  const allReady =
    summary.ready === summary.total - summary.rejected && summary.total > 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-gold/30 selection:text-gold">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-xs">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="w-10 h-10 -ml-2 hover:bg-muted flex items-center justify-center transition-colors cursor-pointer text-foreground"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-serif font-medium text-foreground">
              {t("order.tracking.title")}
            </h1>
            {isConnected && (
              <span
                className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                title={t("order.tracking.realTimeConnected")}
              />
            )}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh"
            className="w-10 h-10 -mr-2 hover:bg-muted flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer text-foreground"
          >
            <RefreshCw
              size={18}
              className={`${refreshing ? "animate-spin text-gold" : ""}`}
            />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Order Tabs */}
        {orders.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scroll-elegant">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`shrink-0 px-4 py-2 text-xs font-sans uppercase tracking-luxe rounded-none border transition-all cursor-pointer min-h-11 ${
                  selectedOrderId === order.id
                    ? "bg-gold text-ink font-semibold border-gold shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-gold/40 hover:text-foreground"
                }`}
              >
                {order.code}
              </button>
            ))}
          </div>
        )}

        {selectedOrder && (
          <>
            {/* Order Info Card */}
            <div className="bg-card border border-border rounded-none p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium">
                    {t("order.orderCode")}
                  </p>
                  <p className="font-serif text-lg font-medium text-foreground">
                    {selectedOrder.code}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-luxe font-medium">
                    {t("order.tableNumber")}
                  </p>
                  <p className="font-serif text-lg font-medium text-gold">
                    {selectedOrder.tableNumber}
                  </p>
                </div>
              </div>

              {/* Overall Progress */}
              {allReady ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-none">
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                  <span className="font-serif text-sm font-medium text-emerald-400">
                    {t("order.tracking.allReady")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gold/10 border border-gold/25 rounded-none">
                  <Clock className="text-gold shrink-0" size={20} />
                  <div>
                    <p className="font-serif text-sm font-medium text-gold">
                      {t("order.tracking.preparing")} (
                      {t("order.tracking.itemsReady", {
                        ready: summary.ready,
                        total: summary.total - summary.rejected,
                      })}
                      )
                    </p>
                    <p className="text-xs text-muted-foreground font-light">
                      {t("order.tracking.estimated", {
                        time: selectedOrder.estimatedTime,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Summary Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-none p-3 text-center">
                <p className="text-2xl font-serif font-medium text-muted-foreground">
                  {summary.queued}
                </p>
                <p className="text-[10px] font-sans uppercase tracking-luxe text-muted-foreground mt-1">
                  {t("order.tracking.queued")}
                </p>
              </div>
              <div className="bg-card border border-border rounded-none p-3 text-center">
                <p className="text-2xl font-serif font-medium text-gold">
                  {summary.cooking}
                </p>
                <p className="text-[10px] font-sans uppercase tracking-luxe text-gold mt-1">
                  {t("order.tracking.cooking")}
                </p>
              </div>
              <div className="bg-card border border-border rounded-none p-3 text-center">
                <p className="text-2xl font-serif font-medium text-emerald-400">
                  {summary.ready}
                </p>
                <p className="text-[10px] font-sans uppercase tracking-luxe text-emerald-400 mt-1">
                  {t("order.tracking.ready")}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h2 className="text-[11px] font-sans font-medium text-gold uppercase tracking-luxe mb-3">
                {t("order.tracking.itemDetails", {
                  count: selectedOrder.items.length,
                })}
              </h2>
              <div className="space-y-3">
                {selectedOrder.items
                  .slice()
                  .sort((a, b) => {
                    const statusOrder = {
                      Ready: 1,
                      Cooking: 2,
                      Queued: 3,
                      Rejected: 4,
                    };
                    return (
                      (statusOrder[a.status] || 5) -
                      (statusOrder[b.status] || 5)
                    );
                  })
                  .map((item) => (
                    <OrderItemStatus key={item.id} item={item} />
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Auto-refresh notice */}
        <p className="text-center text-xs text-muted-foreground font-light pt-4">
          {isConnected
            ? t("order.tracking.connected")
            : t("order.tracking.disconnected")}
        </p>
      </main>
    </div>
  );
};

export default OrderTrackingPage;
