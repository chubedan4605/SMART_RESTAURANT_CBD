// src/pages/Menu/DetailFoodPopup.jsx (hoặc đúng path của bạn)
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  X,
  Star,
  Send,
  MessageSquare,
  Flame,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { menuApi } from "../../services/menuApi";
import { formatMoneyVND } from "../../utils/orders";

const REVIEWS_PAGE_SIZE = 5;

function StarsRow({ rating = 0, size = 10 }) {
  return (
    <div className="flex text-yellow-600 mb-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            fill={filled ? "currentColor" : "none"}
            className={filled ? "" : "opacity-40"}
          />
        );
      })}
    </div>
  );
}

function statusLabel(status) {
  if (!status || status === "available")
    return {
      text: "Available",
      cls: "bg-green-500/15 text-green-300 border-green-500/25",
    };
  if (status === "unavailable")
    return {
      text: "Unavailable",
      cls: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
    };
  if (status === "sold_out")
    return {
      text: "Sold out",
      cls: "bg-red-500/15 text-red-300 border-red-500/25",
    };
  return {
    text: String(status),
    cls: "bg-white/10 text-gray-200 border-white/10",
  };
}

function unwrapList(res) {
  const data = res?.data ?? res?.items ?? res?.data?.data ?? [];
  const meta = res?.meta ?? res?.data?.meta ?? null;
  return { data, meta };
}

export default function FoodDetailPopup({
  food,
  onClose,
  onSelectFood,
  onConfirm,
  mode = "add",
  initial = null,
}) {
  const { t } = useTranslation();
  const aliveRef = useRef(true);

  // lock body scroll
  useEffect(() => {
    aliveRef.current = true;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      aliveRef.current = false;
      document.body.style.overflow = prev;
    };
  }, []);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ===== detail(modifiers) =====
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  // selection state
  const [singlePick, setSinglePick] = useState({}); // { [groupId]: optionId }
  const [multiPick, setMultiPick] = useState({}); // { [groupId]: Set<optionId> }
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);

  // ===== reviews =====
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsHasMore, setReviewsHasMore] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  // ===== related =====
  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const foodId = food?.id;

  const canOrder = useMemo(
    () => !food?.status || food?.status === "available",
    [food?.status],
  );
  const canReview = useMemo(
    () => !food?.status || food?.status === "available",
    [food?.status],
  );
  const statusMeta = useMemo(() => statusLabel(food?.status), [food?.status]);

  const heroImage = useMemo(() => {
    return (
      food?.image ||
      food?.image_url ||
      "https://via.placeholder.com/900x900?text=No+Image"
    );
  }, [food]);

  // reset when food changes
  useEffect(() => {
    if (!foodId) return;

    setDetail(null);
    setDetailError("");
    setSinglePick({});
    setMultiPick({});
    setNote("");
    setQty(1);

    setReviews([]);
    setReviewsPage(1);
    setReviewsHasMore(true);
    setReviewsError("");

    setRelated([]);
  }, [foodId]);

  // ===== load detail =====
  useEffect(() => {
    if (!foodId) return;
    let abort = false;

    const run = async () => {
      setLoadingDetail(true);
      setDetailError("");

      try {
        const res = await menuApi.getMenuItemById(foodId);
        const item = res?.data ?? res ?? null;
        if (!aliveRef.current || abort) return;

        const normalized = {
          ...food,
          ...item,
          image: item?.image_url ?? food?.image ?? food?.image_url,
          modifier_groups: item?.modifier_groups ?? [],
        };

        setDetail(normalized);

        if (initial) {
          setQty(Number(initial.quantity) > 0 ? Number(initial.quantity) : 1);
          setNote(initial.note || "");

          const initMods = initial.modifiers || [];
          const nextSingle = {};
          const nextMulti = {};

          // initMods: [{ option_id, group_id?, group_name?, name, price }]
          // nếu bạn không có group_id trong modifier, ta match bằng option_id lookup
          initMods.forEach((m) => {
            const optId = m.option_id || m.id || m.modifier_option_id;
            if (!optId) return;

            // tìm group của optionId
            const found = (normalized.modifier_groups || [])
              .map((g) => ({
                g,
                opt: (g.options || []).find((o) => o.id === optId),
              }))
              .find((x) => x.opt);

            if (!found) return;

            const g = found.g;
            if (g.selection_type === "single") {
              nextSingle[g.id] = optId;
            } else {
              if (!nextMulti[g.id]) nextMulti[g.id] = new Set();
              nextMulti[g.id].add(optId);
            }
          });

          setSinglePick((prev) => ({ ...prev, ...nextSingle }));
          setMultiPick((prev) => {
            const merged = { ...prev };
            Object.entries(nextMulti).forEach(([gid, setVal]) => {
              merged[gid] = new Set(setVal);
            });
            return merged;
          });
        }

        // auto preselect required single groups if only 1 option
        const groups = normalized.modifier_groups || [];
        const nextSingle = {};
        groups.forEach((g) => {
          if (g.selection_type === "single" && g.is_required) {
            const opts = g.options || [];
            if (opts.length === 1) nextSingle[g.id] = opts[0].id;
          }
        });
        setSinglePick(nextSingle);
      } catch (e) {
        if (!aliveRef.current || abort) return;
        setDetailError(e?.message || "Load item detail failed");
      } finally {
        if (!aliveRef.current || abort) return;
        setLoadingDetail(false);
      }
    };

    run();
    return () => {
      abort = true;
    };
  }, [foodId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== load reviews page 1 =====
  useEffect(() => {
    if (!foodId) return;
    let abort = false;

    const run = async () => {
      setLoadingReviews(true);
      setReviewsError("");

      try {
        const res = await menuApi.getItemReviews(foodId, {
          page: 1,
          limit: REVIEWS_PAGE_SIZE,
        });
        const { data, meta } = unwrapList(res);
        if (!aliveRef.current || abort) return;

        setReviews(data);

        const hasMore =
          meta && typeof meta.hasMore === "boolean"
            ? meta.hasMore
            : (data?.length || 0) === REVIEWS_PAGE_SIZE;

        setReviewsHasMore(hasMore);
        setReviewsPage(1);
      } catch (e) {
        if (!aliveRef.current || abort) return;
        setReviewsError(e?.message || "Load reviews failed");
        setReviewsHasMore(false);
      } finally {
        if (!aliveRef.current || abort) return;
        setLoadingReviews(false);
      }
    };

    run();
    return () => {
      abort = true;
    };
  }, [foodId]);

  const loadMoreReviews = useCallback(async () => {
    if (!foodId || loadingReviews || !reviewsHasMore) return;

    const nextPage = reviewsPage + 1;
    setLoadingReviews(true);
    setReviewsError("");

    try {
      const res = await menuApi.getItemReviews(foodId, {
        page: nextPage,
        limit: REVIEWS_PAGE_SIZE,
      });
      const { data, meta } = unwrapList(res);
      if (!aliveRef.current) return;

      setReviews((prev) => prev.concat(data));

      const hasMore =
        meta && typeof meta.hasMore === "boolean"
          ? meta.hasMore
          : (data?.length || 0) === REVIEWS_PAGE_SIZE;

      setReviewsHasMore(hasMore);
      setReviewsPage(nextPage);
    } catch (e) {
      if (!aliveRef.current) return;
      setReviewsError(e?.message || "Load reviews failed");
      setReviewsHasMore(false);
    } finally {
      if (!aliveRef.current) return;
      setLoadingReviews(false);
    }
  }, [foodId, loadingReviews, reviewsHasMore, reviewsPage]);

  // ===== load related =====
  useEffect(() => {
    if (!foodId) return;
    let abort = false;

    const run = async () => {
      setLoadingRelated(true);
      try {
        const res = await menuApi.getRelatedMenuItems(foodId);
        const data = res?.data ?? res ?? [];
        if (!aliveRef.current || abort) return;

        const normalized = (data || []).map((it) => ({
          ...it,
          image: it.image_url ?? it.image,
        }));

        setRelated(normalized);
      } catch {
        // ignore
      } finally {
        if (!aliveRef.current || abort) return;
        setLoadingRelated(false);
      }
    };

    run();
    return () => {
      abort = true;
    };
  }, [foodId]);

  useEffect(() => {
    if (!detail?.modifier_groups?.length) return;
    if (!initial) return;

    const nextSingle = {};
    const nextMulti = {};

    setQty(Number(initial.quantity) > 0 ? Number(initial.quantity) : 1);
    setNote(initial.note || "");

    const initMods = Array.isArray(initial.modifiers) ? initial.modifiers : [];

    initMods.forEach((m) => {
      const optId =
        m.option_id || m.id || m.modifier_option_id || m.modifierOptionId;

      if (!optId) return;

      const group = detail.modifier_groups.find((g) =>
        (g.options || []).some((o) => o.id === optId),
      );

      if (!group) return;

      if (group.selection_type === "single") {
        nextSingle[group.id] = optId;
      } else {
        if (!nextMulti[group.id]) nextMulti[group.id] = new Set();
        nextMulti[group.id].add(optId);
      }
    });

    // ✅ SET MỚI HOÀN TOÀN
    setSinglePick(nextSingle);
    setMultiPick(nextMulti);
  }, [detail?.id, initial]);

  // ===== rating meta =====
  const avgRating = useMemo(() => {
    const fromFood =
      detail?.avg_rating ?? detail?.rating ?? food?.avg_rating ?? food?.rating;
    if (typeof fromFood === "number") return fromFood;
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [detail, food, reviews]);

  const totalReviews = useMemo(() => {
    const fromFood =
      detail?.reviews_count ??
      detail?.total_reviews ??
      food?.reviews_count ??
      food?.total_reviews;
    if (typeof fromFood === "number") return fromFood;
    return reviews?.length || 0;
  }, [detail, food, reviews?.length]);

  // ===== modifiers helpers =====
  const groups = detail?.modifier_groups || [];

  const optionById = useMemo(() => {
    const map = new Map();
    groups.forEach((g) =>
      (g.options || []).forEach((o) => map.set(o.id, { ...o, group: g })),
    );
    return map;
  }, [groups]);

  const selectedModifiers = useMemo(() => {
    const out = [];

    // single
    Object.entries(singlePick).forEach(([groupId, optionId]) => {
      const opt = optionById.get(optionId);
      const group = groups.find((g) => g.id === groupId);
      if (opt && group) {
        out.push({
          group_id: groupId,
          group_name: group.name,
          option_id: opt.id,
          name: opt.name,
          price: Number(opt.price ?? opt.price_adjustment ?? 0),
        });
      }
    });

    // multiple
    Object.entries(multiPick).forEach(([groupId, setVal]) => {
      const group = groups.find((g) => g.id === groupId);
      const ids = Array.isArray(setVal) ? setVal : Array.from(setVal || []);
      ids.forEach((optionId) => {
        const opt = optionById.get(optionId);
        if (opt && group) {
          out.push({
            group_id: groupId,
            group_name: group.name,
            option_id: opt.id,
            name: opt.name,
            price: Number(opt.price ?? opt.price_adjustment ?? 0),
          });
        }
      });
    });

    return out;
  }, [singlePick, multiPick, optionById, groups]);

  const extraPrice = useMemo(
    () => selectedModifiers.reduce((s, m) => s + Number(m.price || 0), 0),
    [selectedModifiers],
  );

  const unitPrice = useMemo(
    () => Number(detail?.price ?? food?.price ?? 0) + extraPrice,
    [detail?.price, food?.price, extraPrice],
  );

  const totalPrice = useMemo(() => unitPrice * qty, [unitPrice, qty]);

  const validateSelections = useCallback(() => {
    for (const g of groups) {
      const isReq = !!g.is_required;
      const type = g.selection_type;

      if (type === "single") {
        if (isReq && !singlePick[g.id])
          return t("foodDetail.pleaseSelect", { name: g.name });
      } else if (type === "multiple") {
        const picked = multiPick[g.id];
        const count = picked
          ? Array.isArray(picked)
            ? picked.length
            : picked.size
          : 0;

        const min = Number(g.min_selections ?? 0);
        const max = Number(g.max_selections ?? 0);

        if (isReq && min <= 0 && count === 0)
          return t("foodDetail.pleaseSelect", { name: g.name });
        if (min > 0 && count < min)
          return t("foodDetail.selectAtLeast", { min, name: g.name });
        if (max > 0 && count > max)
          return t("foodDetail.selectAtMost", { max, name: g.name });
      }
    }
    return "";
  }, [groups, singlePick, multiPick, t]);

  const toggleMulti = (groupId, optionId, maxSelections = 0) => {
    setMultiPick((prev) => {
      const next = { ...prev };
      const curSet = new Set(prev[groupId] ? Array.from(prev[groupId]) : []);

      if (curSet.has(optionId)) curSet.delete(optionId);
      else {
        if (maxSelections > 0 && curSet.size >= maxSelections) {
          toast.info(
            t("foodDetail.maxSelectionsReached", { max: maxSelections }),
          );
          return prev;
        }
        curSet.add(optionId);
      }

      next[groupId] = curSet;
      return next;
    });
  };

  const handleSubmitReview = async () => {
    if (!foodId) return;
    if (!userRating) return toast.error(t("foodDetail.selectRating"));
    if (!comment.trim()) return toast.error(t("foodDetail.enterComment"));
    if (!canReview) return toast.error(t("foodDetail.itemUnavailable"));

    try {
      await menuApi.createReview({
        menu_item_id: foodId,
        rating: userRating,
        comment: comment.trim(),
      });
      toast.success(t("foodDetail.reviewSuccess"));
      setUserRating(0);
      setComment("");

      const res = await menuApi.getItemReviews(foodId, {
        page: 1,
        limit: REVIEWS_PAGE_SIZE,
      });
      const { data, meta } = unwrapList(res);
      setReviews(data);
      setReviewsPage(1);
      setReviewsHasMore(
        meta && typeof meta.hasMore === "boolean"
          ? meta.hasMore
          : (data?.length || 0) === REVIEWS_PAGE_SIZE,
      );
    } catch (e) {
      toast.error(e?.response?.data?.message || t("foodDetail.reviewFailed"));
    }
  };

  const handleConfirm = () => {
    if (!canOrder) return toast.warning(t("foodDetail.itemCannotOrder"));

    const err = validateSelections();
    if (err) return toast.error(err);

    if (!onConfirm) return toast.info(t("foodDetail.noConfirmHandler"));

    onConfirm({
      id: foodId,
      name: detail?.name ?? food?.name ?? "",
      price: Number(detail?.price ?? food?.price ?? 0),
      image: detail?.image ?? heroImage,
      quantity: qty,
      note: note.trim(),
      modifiers: selectedModifiers.map((m) => ({
        option_id: m.option_id,
        name: m.name,
        price: m.price,
        group_name: m.group_name,
      })),
    });
  };

  if (!foodId) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 ">
      <div
        className="absolute inset-0 bg-bistro-charcoal/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-bistro-wine/10 rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl font-sans text-bistro-charcoal">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-bistro-charcoal rounded-full transition-colors shadow-sm"
        >
          <X size={20} />
        </button>

        {/* LEFT */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img
            src={detail?.image ?? heroImage}
            alt={detail?.name ?? food?.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 z-10">
            <span
              className={`text-[11px] font-extrabold px-3 py-1 rounded-sm border ${statusMeta.cls}`}
            >
              {statusMeta.text}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-white via-white/80 to-transparent">
            <h2 className="text-3xl font-display text-bistro-charcoal uppercase tracking-widest leading-tight">
              {detail?.name ?? food?.name}
            </h2>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-2xl font-bold text-bistro-wine font-sans">
                {formatMoneyVND(Number(detail?.price ?? food?.price ?? 0))}
              </span>
              <div className="h-4 w-px bg-bistro-charcoal/20 mx-2" />
              <div className="flex items-center text-bistro-charcoal/70 gap-1 text-sm font-sans">
                <Star size={14} fill="currentColor" className="text-yellow-500" />
                <span className="font-medium text-bistro-charcoal">{avgRating ? `${avgRating}` : "0.0"}</span> ({totalReviews}+)
              </div>

              {(detail?.is_chef_recommended ?? food?.is_chef_recommended) && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-bistro-wine font-sans">
                  <Flame
                    size={14}
                    className="fill-bistro-wine text-bistro-wine"
                  />{" "}
                  {t("foodDetail.chefPick")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex flex-col bg-white p-6 md:p-8 overflow-y-auto no-scrollbar">
          <div className="space-y-8">
            {/* description */}
            <section>
              <h4 className="text-xs uppercase tracking-[0.2em] text-bistro-wine font-bold mb-3 font-sans">
                {t("foodDetail.description")}
              </h4>
              <p className="text-bistro-charcoal/70 text-sm leading-relaxed font-sans">
                {detail?.description ?? food?.description}
              </p>
            </section>

            {/* ===== modifiers UI ===== */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-bistro-wine font-bold font-sans">
                {t("foodDetail.modifiers")}
              </h4>

              {loadingDetail ? (
                <div className="text-xs text-bistro-charcoal/50 font-sans">
                  {t("foodDetail.loadingModifiers")}
                </div>
              ) : detailError ? (
                <div className="text-xs text-red-500 font-sans">
                  {t("foodDetail.error")}: {detailError}
                </div>
              ) : groups.length ? (
                <div className="space-y-4">
                  {groups.map((g) => {
                    const req = g.is_required ? " *" : "";
                    const max = Number(g.max_selections ?? 0);

                    return (
                      <div
                        key={g.id}
                        className="bg-bistro-cream/30 border border-bistro-wine/10 rounded-sm p-5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold text-bistro-charcoal uppercase tracking-widest font-sans">
                              {g.name}
                              <span className="text-bistro-wine">{req}</span>
                            </div>
                            <div className="text-xs text-bistro-charcoal/50 mt-1 font-sans">
                              {g.selection_type === "single"
                                ? t("foodDetail.selectOne")
                                : max > 0
                                  ? t("foodDetail.selectMax", { max })
                                  : t("foodDetail.selectMultiple")}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {(g.options || []).map((o) => {
                            const price = Number(
                              o.price ?? o.price_adjustment ?? 0,
                            );
                            const isSingle = g.selection_type === "single";
                            const isPicked = isSingle
                              ? singlePick[g.id] === o.id
                              : multiPick[g.id]
                                ? Array.from(multiPick[g.id]).includes(o.id)
                                : false;

                            const onPick = () => {
                              if (isSingle) {
                                setSinglePick((prev) => ({
                                  ...prev,
                                  [g.id]: o.id,
                                }));
                              } else {
                                toggleMulti(g.id, o.id, max);
                              }
                            };

                            return (
                              <button
                                type="button"
                                key={o.id}
                                onClick={onPick}
                                className={`text-left p-3 rounded-sm border transition-all duration-200 ${
                                  isPicked
                                    ? "bg-white border-bistro-wine shadow-sm"
                                    : "bg-white border-bistro-charcoal/10 hover:border-bistro-wine/30"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-xs font-bold text-bistro-charcoal line-clamp-1 font-sans">
                                    {o.name}
                                  </div>
                                  {isPicked ? (
                                    <Check
                                      size={14}
                                      className="text-bistro-wine"
                                    />
                                  ) : null}
                                </div>
                                <div className="text-[11px] mt-1 font-bold text-bistro-wine font-sans">
                                  {price > 0
                                    ? `+ ${formatMoneyVND(price)}`
                                    : "+ 0₫"}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-bistro-charcoal/50 font-sans">
                  {t("foodDetail.noModifiers")}
                </div>
              )}
            </section>

            {/* note + qty + confirm */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-bistro-wine font-bold font-sans">
                {t("foodDetail.notes")}
              </h4>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("foodDetail.notesPlaceholder")}
                className="w-full bg-white border border-bistro-charcoal/20 rounded-sm p-4 text-sm text-bistro-charcoal focus:outline-none focus:border-bistro-wine min-h-24 resize-none font-sans"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 border border-bistro-charcoal/10">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full bg-white hover:bg-bistro-wine text-bistro-charcoal hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm font-sans">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 rounded-full bg-bistro-wine hover:bg-bistro-wine-light text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs text-bistro-charcoal/50 font-sans uppercase tracking-widest font-bold">
                    {t("foodDetail.unitPrice")}
                  </div>
                  <div className="text-xl font-bold text-bistro-charcoal font-sans mt-0.5">
                    {formatMoneyVND(unitPrice)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canOrder}
                className="w-full mt-4 px-6 py-4 rounded-sm font-sans font-bold text-xs uppercase tracking-[0.2em] text-white bg-bistro-charcoal hover:bg-black disabled:opacity-50 transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {mode === "edit"
                  ? t("foodDetail.update")
                  : t("foodDetail.addToCart")}{" "}
                • {formatMoneyVND(totalPrice)}
              </button>
            </section>

            {/* related */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-bistro-wine font-bold font-sans">
                {t("foodDetail.relatedItems")}
              </h4>

              {loadingRelated ? (
                <div className="text-xs text-bistro-charcoal/50 font-sans">
                  {t("foodDetail.loadingRelated")}
                </div>
              ) : related.length ? (
                <div className="grid grid-cols-2 gap-4">
                  {related.slice(0, 4).map((it) => (
                    <button
                      type="button"
                      key={it.id}
                      onClick={() => onSelectFood?.(it.id)} // ✅ QUAN TRỌNG: gọi lên Menu đổi món
                      className="text-left bg-white border border-bistro-charcoal/10 rounded-sm overflow-hidden hover:border-bistro-wine/30 hover:shadow-md transition-all duration-300 group"
                      title={it.name}
                    >
                      <div className="h-24 bg-gray-100 overflow-hidden relative">
                        <img
                          src={
                            it.image ||
                            "https://via.placeholder.com/400x400?text=No+Image"
                          }
                          alt={it.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-xs font-bold text-bistro-charcoal line-clamp-1 font-sans">
                          {it.name}
                        </div>
                        <div className="text-xs text-bistro-charcoal/60 font-bold mt-1 font-sans">
                          {formatMoneyVND(Number(it.price || 0))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-bistro-charcoal/50 font-sans">
                  {t("foodDetail.noRelated")}
                </div>
              )}
            </section>

            {/* reviews */}
            <section className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-bistro-wine font-bold flex items-center gap-2 font-sans">
                <MessageSquare size={14} /> {t("foodDetail.customerReviews")}
              </h4>

              <div className="space-y-4 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                {loadingReviews && reviews.length === 0 ? (
                  <div className="text-xs text-bistro-charcoal/50 font-sans">
                    {t("foodDetail.loadingReviews")}
                  </div>
                ) : reviewsError && reviews.length === 0 ? (
                  <div className="text-xs text-red-500 font-sans">
                    {t("foodDetail.error")}: {reviewsError}
                  </div>
                ) : reviews.length ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-bistro-cream/30 p-4 rounded-sm border border-bistro-wine/10"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-bistro-charcoal font-sans">
                          {rev.user_name || t("foodDetail.anonymous")}
                        </span>
                        <span className="text-[10px] text-bistro-charcoal/50 italic font-sans uppercase tracking-wider">
                          {rev.created_at || ""}
                        </span>
                      </div>
                      <StarsRow rating={Number(rev.rating || 0)} size={10} />
                      <p className="text-xs text-bistro-charcoal/70 font-sans mt-2 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-bistro-charcoal/50 font-sans">
                    {t("foodDetail.noReviews")}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-[11px] text-bistro-charcoal/50 font-sans">
                  {reviews.length
                    ? t("foodDetail.loadedReviews", { count: reviews.length })
                    : ""}
                </div>

                {reviewsHasMore ? (
                  <button
                    type="button"
                    onClick={loadMoreReviews}
                    disabled={loadingReviews}
                    className={`text-xs font-bold font-sans uppercase tracking-wider ${
                      loadingReviews
                        ? "text-bistro-charcoal/40"
                        : "text-bistro-wine hover:text-bistro-wine-light transition-colors"
                    }`}
                  >
                    {loadingReviews
                      ? t("foodDetail.loading")
                      : t("foodDetail.loadMore")}
                  </button>
                ) : (
                  <span className="text-[11px] text-bistro-charcoal/40 font-sans uppercase tracking-wider">
                    {t("foodDetail.noMoreReviews")}
                  </span>
                )}
              </div>
            </section>

            {/* review form */}
            <section className="pt-6 border-t border-bistro-charcoal/10">
              <h4 className="text-xs uppercase tracking-[0.2em] text-bistro-charcoal font-bold mb-4 font-sans">
                {t("foodDetail.yourReview")}
              </h4>

              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setUserRating(s)}
                    disabled={!canReview}
                    className={`${
                      userRating >= s ? "text-yellow-500" : "text-gray-300"
                    } hover:scale-110 transition-transform disabled:opacity-40`}
                  >
                    <Star
                      size={20}
                      fill={userRating >= s ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    canReview
                      ? t("foodDetail.reviewPlaceholder")
                      : t("foodDetail.reviewDisabled")
                  }
                  disabled={!canReview}
                  className="w-full bg-white border border-bistro-charcoal/20 rounded-sm p-4 text-sm text-bistro-charcoal focus:outline-none focus:border-bistro-wine min-h-24 resize-none disabled:opacity-50 font-sans"
                />

                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={!canReview}
                  className="absolute bottom-4 right-4 p-2 bg-bistro-charcoal text-white rounded-sm hover:bg-black transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Send size={16} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
