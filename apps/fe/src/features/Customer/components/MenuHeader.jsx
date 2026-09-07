import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ShoppingBag, Flame, Sparkles } from "lucide-react";

export default function MenuHeader({
  tableCode,
  cartCount = 0,

  searchInput,
  setSearchInput,
  applySearch,
  disabledSearch,

  sort,
  setSort,

  onlyChef,
  setOnlyChef,

  categories = [],
  activeCategoryId,
  setActiveCategoryId,

  // Fuzzy search props
  fuzzyResultCount = null,
  isFuzzySearchActive = false,
  totalItemsCount = 0,
}) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-30 border-b border-bistro-wine/10 bg-bistro-cream/95 backdrop-blur-2xl shadow-sm py-2 md:py-4 transition-all duration-300">
      <div className="px-3 md:px-4 container mx-auto max-w-5xl">
        {/* --- DÒNG 1: SEARCH --- */}
        <div className="flex gap-2 items-center max-w-lg mx-auto mb-2 md:mb-3 transition-all">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-bistro-charcoal/50 transition-all"
              size={18}
            />
            <input
              type="text"
              placeholder={t("menu.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch();
              }}
              className="w-full bg-white border border-bistro-charcoal/20 rounded-sm 
                         pl-10 md:pl-12 pr-4 py-2 md:py-2.5 
                         text-sm text-bistro-charcoal placeholder-bistro-charcoal/40 
                         focus:outline-none focus:border-bistro-wine 
                         transition-all duration-300 shadow-sm font-sans"
            />
            {/* Fuzzy search indicator */}
            {isFuzzySearchActive && searchInput.trim().length >= 2 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Sparkles size={14} className="text-bistro-wine" />
                <span className="text-xs text-bistro-wine font-medium font-sans">
                  {fuzzyResultCount}/{totalItemsCount}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={applySearch}
            disabled={disabledSearch}
            className={`hidden sm:block px-6 py-2.5 rounded-sm text-xs tracking-widest uppercase font-sans transition-all duration-300 whitespace-nowrap shadow-sm ${
              disabledSearch
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-bistro-charcoal text-white hover:bg-black"
            }`}
          >
            {t("menu.searchButton")}
          </button>
        </div>

        {/* --- DÒNG 2: SORT & FILTER --- */}
        <div className="flex items-center justify-between gap-3 mt-4 max-w-5xl mx-auto mb-2 md:mb-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-bistro-charcoal/60 hidden xs:inline font-sans uppercase tracking-widest">
              {t("menu.sort")}:
            </span>{" "}
            {/* Ẩn chữ 'Sort:' nếu màn hình quá bé */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-bistro-charcoal/20 text-bistro-charcoal text-xs rounded-sm px-3 py-1.5 md:py-2 outline-none focus:border-bistro-wine cursor-pointer font-sans"
              >
                <option value="newest">{t("menu.sortNewest")}</option>
                <option value="popularity">{t("menu.sortPopularity")}</option>
              </select>
            </div>
          </div>

          {/* Chef Pick Button */}
          <button
            onClick={() => setOnlyChef((v) => !v)}
            className={`inline-flex items-center gap-1.5 md:gap-2 text-xs font-sans uppercase tracking-widest rounded-sm px-4 py-1.5 md:py-2 border transition-all duration-300 select-none ${
              onlyChef
                ? "bg-bistro-wine border-bistro-wine text-white shadow-md"
                : "bg-white border-bistro-charcoal/20 text-bistro-charcoal/70 hover:border-bistro-wine hover:text-bistro-wine"
            }`}
          >
            <Flame
              size={14}
              className={`transition-colors duration-300 ${
                onlyChef
                  ? "text-white fill-white"
                  : "text-bistro-wine fill-bistro-wine"
              }`}
            />
            <span className="hidden xs:inline">Chef’s picks</span>{" "}
            {/* Ẩn chữ trên màn hình cực nhỏ */}
            <span className="inline xs:hidden">{t("menu.chef")}</span>{" "}
            {/* Hiện chữ ngắn gọn */}
          </button>
        </div>

        {/* --- DÒNG 3: CATEGORIES & CART --- */}
        <div className="relative group/cat mt-4">
          <div
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 pt-1 select-none scroll-smooth pr-14 md:pr-16 touch-pan-x"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.length > 0
              ? categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategoryId(c.id)}
                    className={`whitespace-nowrap font-sans text-xs uppercase tracking-widest transition-all duration-300 border shrink-0 px-4 md:px-5 py-2 rounded-sm ${
                      activeCategoryId === c.id
                        ? "bg-bistro-charcoal border-bistro-charcoal text-white shadow-md"
                        : "bg-white border-bistro-charcoal/20 text-bistro-charcoal hover:border-bistro-charcoal/50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))
              : // Loading skeleton
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-24 bg-gray-200 rounded-sm animate-pulse border border-gray-300 shrink-0"
                  />
                ))}
          </div>

          {/* Gradient mờ bên phải để tạo cảm giác scroll */}
          <div className="absolute right-0 top-0 bottom-2 w-16 md:w-24 bg-gradient-to-l from-bistro-cream via-bistro-cream/90 to-transparent pointer-events-none z-10" />

          {/* Nút Cart */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-20 pb-0.5 md:pb-1">
            <Link
              to={tableCode ? `/cart/${tableCode}` : "/cart"}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto
                  h-10 w-10 md:h-12 md:w-12 rounded-sm border border-bistro-charcoal/10
                  bg-white/95 backdrop-blur-md shadow-sm
                  flex items-center justify-center
                  text-bistro-charcoal hover:text-bistro-wine
                  hover:border-bistro-wine/40 hover:shadow-md
                  transition-all duration-300 active:scale-95 relative"
            >
              <ShoppingBag size={18} className="md:w-5 md:h-5" />{" "}
              {/* Icon nhỏ hơn xíu trên mobile */}
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1
            bg-bistro-wine text-white text-[10px] font-sans font-bold
            rounded-full flex items-center justify-center
            shadow-md"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
