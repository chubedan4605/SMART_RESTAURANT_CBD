import React from "react";
import { Flame, Check, ShoppingBag } from "lucide-react";
import { formatMoneyVND } from "../../../utils/orders";

export default function MenuItemCard({ item, onSelect, onAddToCart, added }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group flex gap-4 bg-white dark:bg-neutral-950 p-3 md:p-4 rounded-sm transition-all duration-300 border border-bistro-charcoal/10 dark:border-white/10 hover:border-bistro-wine/30 hover:shadow-lg cursor-pointer"
    >
      <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-sm overflow-hidden relative bg-gray-100">
        <img
          src={
            item.image || "https://via.placeholder.com/400x400?text=No+Image"
          }
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {item.status && item.status !== "available" && (
          <div className="absolute inset-0 bg-white dark:bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-bistro-charcoal dark:text-gray-100 uppercase tracking-widest font-sans">
            {item.status}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg md:text-xl font-display text-bistro-charcoal dark:text-gray-100 group-hover:text-bistro-wine transition-colors line-clamp-2 leading-tight">
              {item.name}
            </h3>
            {item.is_chef_recommended && (
              <Flame
                size={16}
                className="text-bistro-wine fill-bistro-wine shrink-0 mt-1"
              />
            )}
          </div>
          <p className="text-xs md:text-sm text-bistro-charcoal dark:text-gray-100/60 line-clamp-2 mt-2 font-sans leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex justify-between items-end mt-3">
          <span className="text-lg md:text-xl font-sans font-bold text-bistro-charcoal dark:text-gray-100 tracking-wide">
            {formatMoneyVND(Number(item.price))}
          </span>
        </div>
      </div>
    </div>
  );
}
