import React from "react";
import { Clock, ChefHat, CheckCircle, Loader2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const OrderItemStatus = ({ item }) => {
  const { t } = useTranslation();

  const statusConfig = {
    Queued: {
      icon: Clock,
      label: t("order.status.queued"),
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
      borderColor: "border-border",
      progressColor: "bg-muted-foreground/40",
      progressWidth: "33%",
    },
    Cooking: {
      icon: ChefHat,
      label: t("order.status.cooking"),
      bgColor: "bg-gold/15",
      textColor: "text-gold",
      borderColor: "border-gold/30",
      progressColor: "bg-gold",
      progressWidth: "66%",
    },
    Ready: {
      icon: CheckCircle,
      label: t("order.status.ready"),
      bgColor: "bg-emerald-500/15",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      progressColor: "bg-emerald-500",
      progressWidth: "100%",
    },
    Rejected: {
      icon: XCircle,
      label: t("order.status.rejected"),
      bgColor: "bg-destructive/15",
      textColor: "text-destructive",
      borderColor: "border-destructive/30",
      progressColor: "bg-destructive",
      progressWidth: "0%",
    },
  };

  const config = statusConfig[item.status] || statusConfig.Queued;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 bg-card text-card-foreground rounded-none border border-border shadow-xs">
      {/* Item Image */}
      <div className="w-14 h-14 rounded-none overflow-hidden bg-muted shrink-0 border border-border">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground shrink-0">
            <ChefHat size={22} />
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-serif text-base text-foreground font-medium truncate">{item.name}</h4>
          <span className="text-xs font-serif text-gold ml-2">x{item.quantity}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted rounded-none overflow-hidden mb-2">
          <div
            className={`h-full ${config.progressColor} transition-all duration-500 ease-out`}
            style={{ width: config.progressWidth }}
          />
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-[10px] font-sans uppercase tracking-luxe border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
          >
            {item.status === "Cooking" ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Icon size={11} />
            )}
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemStatus;
