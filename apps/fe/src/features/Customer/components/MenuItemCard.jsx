import React from "react";
import { Flame } from "lucide-react";
import { formatMoneyVND } from "../../../utils/orders";

export default function MenuItemCard({ item, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="text-left w-full group flex gap-4 bg-card text-card-foreground p-3 sm:p-4 rounded-none transition-all duration-300 border border-border hover:border-gold/50 hover:shadow-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold"
    >
      <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-none overflow-hidden relative bg-muted">
        <img
          src={
            item.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80"
          }
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {item.status && item.status !== "available" && (
          <div className="absolute inset-0 bg-ink/75 backdrop-blur-xs flex items-center justify-center text-[10px] font-bold text-cream uppercase tracking-widest font-sans px-1 text-center">
            {item.status}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg sm:text-xl font-serif text-foreground group-hover:text-gold transition-colors line-clamp-2 leading-tight font-medium">
              {item.name}
            </h3>
            {item.is_chef_recommended && (
              <Flame
                size={16}
                className="text-gold fill-gold shrink-0 mt-1"
                aria-label="Chef's Recommended"
              />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2 font-sans leading-relaxed font-light">
            {item.description}
          </p>
        </div>

        <div className="flex justify-between items-end mt-3 pt-2 border-t border-border/50">
          <span className="text-lg sm:text-xl font-serif font-normal text-gold tracking-wide">
            {formatMoneyVND(Number(item.price))}
          </span>
          <span className="text-[10px] font-sans tracking-luxe uppercase text-muted-foreground group-hover:text-gold transition-colors font-medium">
            Tùy chọn &rarr;
          </span>
        </div>
      </div>
    </button>
  );
}
