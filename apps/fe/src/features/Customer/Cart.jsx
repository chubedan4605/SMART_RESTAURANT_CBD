import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectTotalItems,
  clearCartLocal,
  removeFromCartLocal,
  incrementLocal,
  decrementLocal,
  syncCartToDb,
  buildLineKey,
  updateCartLineLocal,
} from "../../store/slices/cartSlice";

import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FoodDetailPopup from "./components/DetailFoodPopup";
import tableApi from "../../services/tableApi";
import { formatMoneyVND } from "../../utils/orders";

const calcModifierExtra = (modifiers = []) =>
  (modifiers || []).reduce(
    (sum, m) => sum + Number(m.price || m.price_adjustment || 0),
    0,
  );

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tableCode } = useParams();

  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);

  // ✅ state mở popup edit
  const [editingItem, setEditingItem] = useState(null);

  const handleRemoveItem = (e, item) => {
    e.stopPropagation();
    const lineKey = item.lineKey || buildLineKey(item.id, item.modifiers);
    dispatch(removeFromCartLocal({ lineKey }));
    toast.info(t("cart.removeItem"));
  };

  const handleIncrement = (e, item) => {
    e.stopPropagation();
    const lineKey = item.lineKey || buildLineKey(item.id, item.modifiers);
    dispatch(incrementLocal({ lineKey }));
  };

  const handleDecrement = (e, item) => {
    e.stopPropagation();
    const lineKey = item.lineKey || buildLineKey(item.id, item.modifiers);
    dispatch(decrementLocal({ lineKey }));
  };

  const handleClearCart = () => {
    if (window.confirm(t("cart.clearCartConfirm"))) {
      dispatch(clearCartLocal());
      toast.success(t("cart.clearCart"));
    }
  };

  const handleCheckout = async () => {
    const qrToken = localStorage.getItem("qrToken");
    if (!qrToken) {
      toast.warning(t("cart.scanQRFirst"));
      navigate(`/menu`);
      return;
    }

    const sessionToken = localStorage.getItem("sessionToken");
    const tableCode = localStorage.getItem("tableCode");

    const isValidSession = await tableApi.validateSession(
      tableCode,
      sessionToken,
    );

    if (isValidSession && isValidSession.data.valid === false) {
      localStorage.removeItem("qrToken");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("tableSessionId");
      localStorage.removeItem("tableCode");
      localStorage.removeItem("tableNumber");
      localStorage.removeItem("tableSession");
      toast.warning(t("cart.sessionExpired"));
      navigate(tableCode ? `/menu/${tableCode}` : "/scan");
      return;
    }

    if (!sessionToken) {
      toast.warning(t("cart.sessionExpired"));
      navigate(tableCode ? `/menu/${tableCode}` : "/scan");
      return;
    }

    const sessionId = localStorage.getItem("tableSessionId");
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).id
      : null;

    try {
      await dispatch(
        syncCartToDb({
          qrToken,
          sessionId: sessionId,
          userId,
        }),
      ).unwrap();
      toast.success(t("cart.orderSuccess"));
      navigate("/menu");
    } catch (e) {
      const errorMsg =
        (typeof e === "string" ? e : null) ||
        e?.message ||
        e?.response?.data?.message ||
        t("cart.orderFailed");
      toast.error(errorMsg);
    }
  };

  const computed = useMemo(() => {
    const items = (cartItems || []).map((it) => {
      const base = Number(it.price || 0);
      const extra = calcModifierExtra(it.modifiers);
      const unit = base + extra;
      const qty = Number(it.quantity || 0);
      return {
        ...it,
        extra,
        unit,
        lineTotal: unit * qty,
        lineKey: it.lineKey || buildLineKey(it.id, it.modifiers),
      };
    });

    const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
    return { items, subtotal };
  }, [cartItems]);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans">
        <div className="text-center max-w-md">
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
            <ShoppingCart size={48} className="text-gold/50" />
          </div>
          <h2 className="text-3xl font-serif text-foreground mb-3 font-medium">
            {t("cart.empty")}
          </h2>
          <p className="text-muted-foreground mb-8 font-sans text-sm leading-relaxed font-light">
            {t("cart.emptyDescription")}
          </p>
          <Link
            to={tableCode ? `/menu/${tableCode}` : "/menu"}
            className="inline-flex items-center gap-3 min-h-11 px-8 py-3.5 bg-gold hover:bg-gold-soft text-ink font-sans text-xs uppercase tracking-luxe font-semibold rounded-none transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ShoppingBag size={16} />
            {t("cart.goToMenu")}
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = computed.subtotal;
  const serviceFee = subtotal * 0.1;
  const grandTotal = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 font-sans selection:bg-gold/30 selection:text-gold">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border py-4 shadow-xs">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-foreground font-medium">
                {t("cart.title")}
              </h1>
              <p className="text-[10px] font-sans text-gold mt-0.5 uppercase tracking-luxe font-semibold">
                {t("cart.items", { count: totalItems })}
              </p>
            </div>

            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-3 py-2 text-xs font-sans text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-none transition-all uppercase tracking-luxe cursor-pointer min-h-11 font-medium"
            >
              <Trash2 size={16} />
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 pt-6">
        <div className="space-y-4">
          {computed.items.map((item) => (
            <div
              key={item.lineKey}
              onClick={() => setEditingItem(item)}
              className="cursor-pointer group bg-card text-card-foreground hover:border-gold/50 rounded-none p-4 transition-all duration-300 border border-border shadow-xs hover:shadow-md"
              title={t("cart.clickToEdit")}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 shrink-0 rounded-none overflow-hidden bg-muted">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base sm:text-lg font-sans font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <button
                        onClick={(e) => handleRemoveItem(e, item)}
                        aria-label="Remove item"
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none transition-all cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {Array.isArray(item.modifiers) &&
                    item.modifiers.length > 0 ? (
                      <div className="mt-1 text-xs text-muted-foreground space-y-0.5 font-sans">
                        {item.modifiers.map((m, i) => (
                          <div
                            key={`${item.lineKey}-m-${i}`}
                            className="flex justify-between gap-2"
                          >
                            <span className="text-muted-foreground">
                              • {m.group_name ? `${m.group_name}: ` : ""}
                              <span className="text-foreground font-medium">
                                {m.name}
                              </span>
                            </span>
                            <span className="text-gold font-sans font-medium tabular-nums">
                              {Number(m.price || 0) > 0
                                ? `+${formatMoneyVND(m.price)}`
                                : "+0₫"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-muted-foreground/60 italic font-sans font-light">
                        (Nhấn để chỉnh sửa tùy chọn)
                      </div>
                    )}

                    {item.note ? (
                      <div className="mt-1.5 text-[11px] text-muted-foreground italic font-sans">
                        Ghi chú: {item.note}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-between items-end mt-4 pt-2 border-t border-border/40">
                    <div className="flex flex-col">
                      <span className="text-lg sm:text-xl font-sans font-bold text-gold tabular-nums">
                        {formatMoneyVND(item.lineTotal)}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-sans mt-0.5 tabular-nums">
                        {formatMoneyVND(item.unit)} × {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-muted rounded-none p-1 border border-border">
                      <button
                        onClick={(e) => handleDecrement(e, item)}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 rounded-none bg-card hover:bg-gold hover:text-ink text-foreground flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="text-sm font-sans font-semibold w-7 text-center text-foreground tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => handleIncrement(e, item)}
                        aria-label="Increase quantity"
                        className="w-8 h-8 rounded-none bg-gold hover:bg-gold-soft text-ink flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-card rounded-none p-6 md:p-8 border border-border shadow-xl">
          <h3 className="text-xl font-serif mb-6 text-foreground font-medium">
            {t("cart.orderDetails")}
          </h3>

          <div className="flex justify-between text-muted-foreground font-sans text-sm mb-3">
            <span>{t("cart.itemsTotal", { count: totalItems })}</span>
            <span className="font-sans font-semibold text-foreground text-sm sm:text-base tabular-nums">{formatMoneyVND(subtotal)}</span>
          </div>

          <div className="flex justify-between text-muted-foreground font-sans text-sm">
            <span>{t("cart.serviceFee")} (10%)</span>
            <span className="font-sans font-semibold text-foreground text-sm sm:text-base tabular-nums">{formatMoneyVND(serviceFee)}</span>
          </div>

          <div className="hairline my-6" />

          <div className="flex justify-between items-end">
            <span className="text-foreground text-xs uppercase tracking-luxe font-medium">{t("cart.total")}</span>
            <span className="text-2xl sm:text-3xl font-sans font-bold text-gold tabular-nums tracking-tight">
              {formatMoneyVND(grandTotal)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-8 min-h-11 flex items-center justify-center gap-3 px-6 py-4 bg-gold hover:bg-gold-soft text-ink font-sans text-xs uppercase tracking-luxe font-semibold rounded-none transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
          >
            <span>{t("cart.placeOrder")}</span>
            <ArrowRight size={16} />
          </button>

          <Link
            to={tableCode ? `/menu/${tableCode}` : "/menu"}
            className="block text-center mt-6 text-xs uppercase tracking-luxe font-sans text-muted-foreground hover:text-gold transition-colors min-h-11 inline-flex items-center justify-center w-full"
          >
            {t("cart.continueShopping")} &rarr;
          </Link>
        </div>
      </div>

      {/* ✅ Popup edit modifiers */}
      {editingItem && (
        <FoodDetailPopup
          food={{
            id: editingItem.id,
            name: editingItem.name,
            price: editingItem.price,
            image: editingItem.image,
            status: "available",
          }}
          mode="edit"
          initial={{
            quantity: editingItem.quantity,
            note: editingItem.note || "",
            modifiers: editingItem.modifiers || [],
          }}
          onClose={() => setEditingItem(null)}
          onConfirm={(payload) => {
            dispatch(
              updateCartLineLocal({
                fromLineKey: editingItem.lineKey,
                next: payload,
              }),
            );
            setEditingItem(null);
            toast.success(t("cart.optionsUpdated"));
          }}
        />
      )}
    </div>
  );
};

export default Cart;
