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
    <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md shadow-xs py-2 md:py-4 transition-all duration-300">
      <div className="px-3 md:px-4 container mx-auto max-w-5xl">
        {/* --- DÒNG 1: SEARCH --- */}
        <div className="flex gap-2 items-center max-w-lg mx-auto mb-2 md:mb-3 transition-all">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-all"
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
              className="w-full bg-card border border-border rounded-none 
                         pl-10 md:pl-12 pr-4 py-2.5 
                         text-sm text-foreground placeholder:text-muted-foreground 
                         focus:outline-none focus:border-gold 
                         transition-all duration-300 shadow-xs font-sans min-h-11"
            />
            {/* Fuzzy search indicator */}
            {isFuzzySearchActive && searchInput.trim().length >= 2 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Sparkles size={14} className="text-gold" />
                <span className="text-xs text-gold font-medium font-sans">
                  {fuzzyResultCount}/{totalItemsCount}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={applySearch}
            disabled={disabledSearch}
            className={`hidden sm:inline-flex items-center justify-center min-h-11 px-6 py-2.5 rounded-none text-xs tracking-luxe uppercase font-sans font-semibold transition-all duration-300 whitespace-nowrap shadow-xs cursor-pointer ${
              disabledSearch
                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                : "bg-gold text-ink hover:bg-gold-soft border border-gold"
            }`}
          >
            {t("menu.searchButton")}
          </button>
        </div>

        {/* --- DÒNG 2: SORT & FILTER --- */}
        <div className="flex items-center justify-between gap-3 mt-3 max-w-5xl mx-auto mb-2 md:mb-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground hidden xs:inline font-sans uppercase tracking-luxe font-medium">
              {t("menu.sort")}:
            </span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-card border border-border text-foreground text-xs rounded-none px-3 py-2 outline-none focus:border-gold cursor-pointer font-sans min-h-11 pr-8"
              >
                <option value="newest">{t("menu.sortNewest")}</option>
                <option value="popularity">{t("menu.sortPopularity")}</option>
              </select>
            </div>
          </div>

          {/* Chef Pick Button */}
          <button
            type="button"
            onClick={() => setOnlyChef((v) => !v)}
            className={`inline-flex items-center gap-2 text-xs font-sans uppercase tracking-luxe rounded-none px-4 py-2 border transition-all duration-300 select-none min-h-11 cursor-pointer ${
              onlyChef
                ? "bg-gold border-gold text-ink font-semibold shadow-xs"
                : "bg-card border-border text-foreground hover:border-gold/50"
            }`}
          >
            <Flame
              size={14}
              className={`transition-colors duration-300 ${
                onlyChef ? "text-ink fill-ink" : "text-gold fill-gold"
              }`}
            />
            <span className="hidden xs:inline">Chef’s Picks</span>
            <span className="inline xs:hidden">{t("menu.chef")}</span>
          </button>
        </div>

        {/* --- DÒNG 3: CATEGORIES & CART --- */}
        <div className="relative group/cat mt-3">
          <div
            className="flex gap-2.5 overflow-x-auto scroll-elegant pb-2 pt-1 select-none pr-16 touch-pan-x"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.length > 0
              ? categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setActiveCategoryId(c.id)}
                    className={`whitespace-nowrap font-sans text-xs uppercase tracking-luxe transition-all duration-300 border shrink-0 px-4 md:px-5 py-2.5 rounded-none min-h-11 cursor-pointer ${
                      activeCategoryId === c.id
                        ? "bg-gold border-gold text-ink font-semibold shadow-xs"
                        : "bg-card border-border text-foreground hover:border-gold/50 hover:text-gold"
                    }`}
                  >
                    {c.name}
                  </button>
                ))
              : [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-11 w-24 bg-muted rounded-none animate-pulse border border-border shrink-0"
                  />
                ))}
          </div>

          {/* Right gradient fade */}
          <div className="absolute right-0 top-0 bottom-2 w-16 md:w-24 bg-gradient-to-l from-background via-background/90 to-transparent pointer-events-none z-10" />

          {/* Cart Action Button */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-20 pb-1">
            <Link
              to={tableCode ? `/cart/${tableCode}` : "/cart"}
              onClick={(e) => e.stopPropagation()}
              aria-label="View Cart"
              className="pointer-events-auto
                  h-11 w-11 md:h-12 md:w-12 rounded-none border border-border
                  bg-card shadow-xs
                  flex items-center justify-center
                  text-foreground hover:text-gold
                  hover:border-gold/60 hover:shadow-md
                  transition-all duration-300 active:scale-95 relative cursor-pointer"
            >
              <ShoppingBag size={18} className="md:w-5 md:h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1
            bg-gold text-ink text-[10px] font-sans font-bold
            rounded-full flex items-center justify-center
            shadow-sm"
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
