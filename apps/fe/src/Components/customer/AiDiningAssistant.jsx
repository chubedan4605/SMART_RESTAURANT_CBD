import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Plus,
  Check,
  ChefHat,
  Flame,
  Leaf,
  RotateCcw,
} from "lucide-react";
import {
  addToCartLocal,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from "../../store/slices/cartSlice";
import { aiApi } from "../../services/aiApi";

const DEFAULT_FOOD_IMG =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";

function formatVnd(amount) {
  return `${(Number(amount) || 0).toLocaleString("vi-VN")}đ`;
}

function renderFormattedText(text = "") {
  const lines = String(text || "").split("\n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p
        key={lineIdx}
        className={line.trim() === "" ? "h-2" : "leading-relaxed mb-1 last:mb-0"}
      >
        {parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={partIdx} className="font-semibold text-orange-300">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={partIdx}>{part}</span>;
        })}
      </p>
    );
  });
}

export default function AiDiningAssistant() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { tableCode: routeTableCode } = useParams();

  const cartItems = useSelector(selectCartItems);
  const totalCartItems = useSelector(selectTotalItems);
  const totalCartPrice = useSelector(selectTotalPrice);

  const tableCode =
    routeTableCode || localStorage.getItem("tableCode") || "Khách tại bàn";
  const currentLang = i18n?.language?.startsWith("en") ? "en" : "vi";

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [agentStatus, setAgentStatus] = useState("");
  const [interactionId, setInteractionId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [justAddedIds, setJustAddedIds] = useState({});

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text:
        currentLang === "en"
          ? "Hello! I'm your **AI Sommelier & Dining Assistant**. Tell me your taste, budget, or dietary needs (e.g., *combo for 2 under 300k, non-spicy*), or ask me to add dishes directly to your cart!"
          : "Xin chào! Mình là **AI Sommelier — Trợ lý Ẩm thực** của nhà hàng. Bạn có thể hỏi mình tư vấn món theo khẩu vị, ngân sách (*VD: Combo 2 người dưới 300k, không cay, dị ứng hải sản*) hoặc nhắn mình đặt món thẳng vào giỏ hàng nhé!",
      recommendedDishes: [],
      cartActions: [],
      comboSummary: null,
    },
  ]);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    aiApi
      .getSuggestions(currentLang)
      .then((res) => {
        if (mounted && Array.isArray(res?.suggestions)) {
          setSuggestions(res.suggestions);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [currentLang]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, agentStatus]);

  const handleAddDishToCart = (dish, quantity = 1, note = "") => {
    if (!dish?.id) return;

    dispatch(
      addToCartLocal({
        id: dish.id,
        menuItemId: dish.id,
        name: dish.name,
        price: Number(dish.price) || 0,
        image: dish.image_url || dish.image || null,
        quantity: Math.max(1, Number(quantity) || 1),
        modifiers: [],
        note: note || "",
      }),
    );

    setJustAddedIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setJustAddedIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 1500);

    toast.success(`Đã thêm ${quantity}x "${dish.name}" vào giỏ hàng!`, {
      position: "top-right",
      autoClose: 1800,
    });
  };

  const handleAddEntireCombo = (comboItems = []) => {
    if (!Array.isArray(comboItems) || comboItems.length === 0) return;
    comboItems.forEach((item) => {
      dispatch(
        addToCartLocal({
          id: item.id,
          menuItemId: item.id,
          name: item.name,
          price: Number(item.price) || 0,
          image: item.image_url || item.image || null,
          quantity: Math.max(1, Number(item.quantity) || 1),
          modifiers: [],
          note: "Combo AI gợi ý",
        }),
      );
    });
    toast.success("Đã thêm toàn bộ Combo vào giỏ hàng của bạn!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const executeAutoCartActions = (actions = []) => {
    if (!Array.isArray(actions) || actions.length === 0) return;
    for (const act of actions) {
      if (act.action === "add" && act.dish) {
        dispatch(
          addToCartLocal({
            id: act.dish.id,
            menuItemId: act.dish.id,
            name: act.dish.name,
            price: Number(act.dish.price) || 0,
            image: act.dish.image_url || null,
            quantity: Math.max(1, Number(act.quantity) || 1),
            modifiers: [],
            note: act.note || "",
          }),
        );
      }
    }
    toast.success("AI Sommelier đã cập nhật món vào giỏ hàng của bạn!", {
      position: "top-right",
      autoClose: 2200,
    });
  };

  const sendMessage = async (rawText) => {
    const text = String(rawText ?? input).trim();
    if (!text || isStreaming) return;

    setInput("");
    setIsStreaming(true);
    setAgentStatus("Đang kết nối AI Sommelier...");

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `ai-${Date.now() + 1}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", text },
      {
        id: assistantMsgId,
        role: "assistant",
        text: "",
        recommendedDishes: [],
        cartActions: [],
        comboSummary: null,
      },
    ]);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let executedCartOnce = false;

    try {
      await aiApi.streamChat(
        {
          message: text,
          previousInteractionId: interactionId,
          tableCode,
          cartItems: (cartItems || []).map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          language: currentLang,
        },
        {
          signal: controller.signal,
          onStatus: (statusText) => {
            setAgentStatus(statusText);
          },
          onGrounding: (grounding) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      recommendedDishes: grounding.recommendedDishes || [],
                      cartActions: grounding.cartActions || [],
                      comboSummary: grounding.comboSummary || null,
                    }
                  : m,
              ),
            );

            if (!executedCartOnce && grounding.cartActions?.length > 0) {
              executedCartOnce = true;
              executeAutoCartActions(grounding.cartActions);
            }
          },
          onDelta: (chunk) => {
            setAgentStatus("");
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, text: m.text + chunk } : m,
              ),
            );
          },
          onDone: (finalPayload) => {
            setAgentStatus("");
            setIsStreaming(false);
            if (finalPayload?.interactionId) {
              setInteractionId(finalPayload.interactionId);
            }
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      text: finalPayload?.reply || m.text,
                      recommendedDishes:
                        finalPayload?.recommendedDishes ||
                        m.recommendedDishes ||
                        [],
                      cartActions:
                        finalPayload?.cartActions || m.cartActions || [],
                      comboSummary:
                        finalPayload?.comboSummary || m.comboSummary || null,
                    }
                  : m,
              ),
            );

            if (!executedCartOnce && finalPayload?.cartActions?.length > 0) {
              executedCartOnce = true;
              executeAutoCartActions(finalPayload.cartActions);
            }
          },
          onError: () => {
            setAgentStatus("");
            setIsStreaming(false);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      text: "Xin lỗi bạn, kết nối đến trợ lý AI đang bận. Bạn vui lòng thử lại sau giây lát nhé!",
                    }
                  : m,
              ),
            );
          },
        },
      );
    } finally {
      setIsStreaming(false);
      setAgentStatus("");
    }
  };

  const handleResetChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setInteractionId(null);
    setIsStreaming(false);
    setAgentStatus("");
    setMessages((prev) => [prev[0]]);
  };

  return (
    <>
      {/* Nút Floating AI Sommelier */}
      <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Mở Trợ lý Ẩm thực AI"
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-4 py-3 text-white shadow-xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 active:scale-95"
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-4 w-4 animate-pulse text-white" />
            </span>
            <span className="text-sm font-semibold tracking-wide pr-1">
              AI Sommelier
            </span>
            {totalCartItems > 0 && (
              <span className="ml-0.5 rounded-full bg-neutral-950/80 px-2 py-0.5 text-xs font-bold text-orange-300">
                {totalCartItems}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Khung Chat Drawer Glassmorphic */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-4 z-50 mx-auto flex h-[78vh] max-h-[680px] w-auto max-w-md flex-col overflow-hidden rounded-2xl border border-orange-500/30 bg-neutral-950/95 text-gray-100 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-neutral-900 via-neutral-900 to-orange-950/60 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-md shadow-orange-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    AI Sommelier & Dining Assistant
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Giỏ hiện tại: {totalCartItems} món ({formatVnd(totalCartPrice)})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Làm mới cuộc trò chuyện"
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng Trợ lý AI"
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          {suggestions.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto border-b border-white/5 bg-neutral-900/60 px-3 py-2 no-scrollbar">
              {suggestions.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  disabled={isStreaming}
                  onClick={() => sendMessage(chip.prompt)}
                  className="shrink-0 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-200 transition hover:border-orange-400 hover:bg-orange-500/20 disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Danh sách tin nhắn */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md"
                      : "border border-white/10 bg-neutral-900/90 text-gray-100"
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>

                {/* Banner xác nhận AI đã tự động thêm món vào giỏ */}
                {Array.isArray(msg.cartActions) && msg.cartActions.length > 0 && (
                  <div className="mt-2 flex w-full max-w-[92%] items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-200">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>
                        Đã tự động thêm{" "}
                        <strong>
                          {msg.cartActions
                            .map((a) => `${a.quantity}x ${a.dish?.name}`)
                            .join(", ")}
                        </strong>{" "}
                        vào giỏ hàng!
                      </span>
                    </div>
                  </div>
                )}

                {/* Nút thêm nhanh toàn bộ Combo nếu là gợi ý Combo */}
                {msg.comboSummary?.valid &&
                  Array.isArray(msg.comboSummary?.items) &&
                  msg.comboSummary.items.length > 1 && (
                    <div className="mt-2 flex w-full max-w-[92%] items-center justify-between rounded-xl border border-orange-500/30 bg-orange-950/30 px-3 py-2 text-xs">
                      <div>
                        <span className="font-semibold text-orange-300">
                          Tổng Combo ({msg.comboSummary.partySize} người):{" "}
                          {formatVnd(msg.comboSummary.totalPrice)}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          Ngân sách: {formatVnd(msg.comboSummary.budgetVnd)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddEntireCombo(msg.comboSummary.items)
                        }
                        className="rounded-lg bg-orange-500 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                      >
                        + Thêm cả Combo
                      </button>
                    </div>
                  )}

                {/* Grounded Dish Cards */}
                {Array.isArray(msg.recommendedDishes) &&
                  msg.recommendedDishes.length > 0 && (
                    <div className="mt-2.5 grid w-full max-w-[94%] grid-cols-1 gap-2">
                      {msg.recommendedDishes.map((dish) => {
                        const isAdded = Boolean(justAddedIds[dish.id]);
                        return (
                          <div
                            key={dish.id}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/95 p-2.5 transition hover:border-orange-500/40"
                          >
                            <img
                              src={dish.image_url || DEFAULT_FOOD_IMG}
                              alt={dish.name}
                              className="h-14 w-14 shrink-0 rounded-lg object-cover bg-neutral-800"
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_FOOD_IMG;
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="truncate text-xs font-semibold text-white">
                                  {dish.name}
                                </h4>
                                {dish.is_chef_recommended && (
                                  <span
                                    title="Bếp trưởng khuyên dùng"
                                    className="inline-flex items-center rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300"
                                  >
                                    <ChefHat className="mr-0.5 h-3 w-3" />
                                    Chef
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                                <span className="font-bold text-orange-400">
                                  {formatVnd(dish.price)}
                                </span>
                                {dish.quantity > 1 && (
                                  <span className="text-gray-300">
                                    • Gợi ý: {dish.quantity} phần
                                  </span>
                                )}
                                {dish.isSpicy && (
                                  <span className="inline-flex items-center text-red-400">
                                    <Flame className="h-3 w-3" />
                                  </span>
                                )}
                                {dish.isVegetarian && (
                                  <span className="inline-flex items-center text-emerald-400">
                                    <Leaf className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleAddDishToCart(dish, dish.quantity || 1)
                              }
                              className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                                isAdded
                                  ? "bg-emerald-600 text-white"
                                  : "bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500 hover:text-white"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Đã thêm</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>Thêm</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}

            {agentStatus && (
              <div className="flex items-center gap-2 text-xs text-orange-300/90 animate-pulse px-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{agentStatus}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập câu hỏi */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-white/10 bg-neutral-900 p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  currentLang === "en"
                    ? "Ask for recommendations or order dishes..."
                    : "Hỏi món ngon, tính combo hoặc nhắn đặt món..."
                }
                disabled={isStreaming}
                className="flex-1 rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label="Gửi tin nhắn"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md transition hover:opacity-95 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

