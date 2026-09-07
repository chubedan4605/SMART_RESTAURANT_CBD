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
import FoodDetailPopup from "./DetailFoodPopup";
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
      navigate(`/menu/`);
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

    console.log("Session validation:", isValidSession);

    if (!sessionToken) {
      toast.warning(t("cart.sessionExpired"));
      navigate(tableCode ? `/menu/${tableCode}` : "/scan");
      return;
    }

    const sessionId = localStorage.getItem("tableSessionId");

    // Lấy userId từ localStorage hoặc Redux store (nếu user đã đăng nhập)
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).id
      : null;

    console.log("Checking out with:", { qrToken, sessionId, userId });

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
      toast.error(e?.message || t("cart.orderFailed"));
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
      <div className="min-h-screen bg-bistro-cream text-bistro-charcoal flex items-center justify-center p-4 font-sans">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white border border-bistro-wine/10 flex items-center justify-center shadow-lg">
            <ShoppingCart size={64} className="text-bistro-wine/40" />
          </div>
          <h2 className="text-3xl font-display text-bistro-charcoal mb-3">
            {t("cart.empty")}
          </h2>
          <p className="text-bistro-charcoal/60 mb-8 font-sans leading-relaxed">
            {t("cart.emptyDescription")}
          </p>
          <Link
            to={tableCode ? `/menu/${tableCode}` : "/menu"}
            className="inline-flex items-center gap-3 px-8 py-4 bg-bistro-charcoal hover:bg-black text-white font-sans text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-lg active:scale-95"
          >
            <ShoppingBag size={18} />
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
    <div className="min-h-screen bg-bistro-cream text-bistro-charcoal pb-32 font-sans">
      <div className="sticky top-0 z-20 bg-bistro-cream/95 backdrop-blur-2xl border-b border-bistro-wine/10 py-5 shadow-sm">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display text-bistro-charcoal">
                {t("cart.title").toUpperCase()}
              </h1>
              <p className="text-xs font-sans text-bistro-charcoal/50 mt-1 uppercase tracking-widest font-bold">
                {t("cart.items", { count: totalItems })}
              </p>
            </div>

            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-xs font-sans text-red-500 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all uppercase tracking-wider font-bold"
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
              onClick={() => setEditingItem(item)} // ✅ click mở popup sửa
              className="cursor-pointer group bg-white hover:bg-bistro-cream/30 rounded-sm p-4 transition-all duration-300 border border-bistro-charcoal/10 hover:border-bistro-wine/30 shadow-sm hover:shadow-md"
              title={t("cart.clickToEdit")}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-display text-bistro-charcoal group-hover:text-bistro-wine transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <button
                        onClick={(e) => handleRemoveItem(e, item)}
                        className="p-1.5 text-bistro-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {Array.isArray(item.modifiers) &&
                    item.modifiers.length > 0 ? (
                      <div className="mt-2 text-xs text-bistro-charcoal/70 space-y-1 font-sans">
                        {item.modifiers.map((m, i) => (
                          <div
                            key={`${item.lineKey}-m-${i}`}
                            className="flex justify-between gap-2"
                          >
                            <span className="text-bistro-charcoal/60">
                              • {m.group_name ? `${m.group_name}: ` : ""}
                              <span className="text-bistro-charcoal font-medium">
                                {m.name}
                              </span>
                            </span>
                            <span className="text-bistro-wine font-bold">
                              {Number(m.price || 0) > 0
                                ? `+${formatMoneyVND(m.price)}`
                                : "+0₫"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-bistro-charcoal/40 italic font-sans">
                        (Nhấn để chọn tuỳ chọn)
                      </div>
                    )}

                    {item.note ? (
                      <div className="mt-2 text-[11px] text-bistro-charcoal/50 italic font-sans">
                        Ghi chú: {item.note}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex flex-col">
                      <span className="text-xl font-sans font-bold text-bistro-charcoal">
                        {formatMoneyVND(item.lineTotal)}
                      </span>
                      <span className="text-xs text-bistro-charcoal/50 font-sans mt-0.5">
                        {formatMoneyVND(item.unit)} × {item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 border border-bistro-charcoal/10">
                      <button
                        onClick={(e) => handleDecrement(e, item)}
                        className="w-8 h-8 rounded-full bg-white hover:bg-bistro-wine text-bistro-charcoal hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="text-sm font-sans font-bold w-6 text-center text-bistro-charcoal">
                        {item.quantity}
                      </span>

                      <button
                        onClick={(e) => handleIncrement(e, item)}
                        className="w-8 h-8 rounded-full bg-bistro-wine hover:bg-bistro-wine-light text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-sm p-8 border border-bistro-wine/10 shadow-xl">
          <h3 className="text-xl font-display mb-6 text-bistro-charcoal">
            {t("cart.orderDetails")}
          </h3>

          <div className="flex justify-between text-bistro-charcoal/70 font-sans text-sm mb-3">
            <span>{t("cart.itemsTotal", { count: totalItems })}</span>
            <span className="font-medium text-bistro-charcoal">{formatMoneyVND(subtotal)}</span>
          </div>

          <div className="flex justify-between text-bistro-charcoal/70 font-sans text-sm">
            <span>{t("cart.serviceFee")}</span>
            <span className="font-medium text-bistro-charcoal">{formatMoneyVND(serviceFee)}</span>
          </div>

          <div className="h-px bg-bistro-wine/10 my-6" />

          <div className="flex justify-between text-xl font-sans font-bold items-end">
            <span className="text-bistro-charcoal text-sm uppercase tracking-widest">{t("cart.total")}</span>
            <span className="text-2xl text-bistro-wine">
              {formatMoneyVND(grandTotal)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-8 flex items-center justify-center gap-3 px-6 py-4 bg-bistro-charcoal hover:bg-black text-white font-sans text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-lg active:scale-95"
          >
            <span>{t("cart.placeOrder")}</span>
            <ArrowRight size={18} />
          </button>

          <Link
            to={tableCode ? `/menu/${tableCode}` : "/menu"}
            className="block text-center mt-6 text-[11px] uppercase tracking-widest font-sans font-bold text-bistro-charcoal/50 hover:text-bistro-wine transition-colors"
          >
            {t("cart.continueShopping")}
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
