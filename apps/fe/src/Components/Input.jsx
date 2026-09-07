import React, { forwardRef } from "react";
import { CheckCircle2 } from "lucide-react";
const Input = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      labelClassName = "",
      iconClassName = "",
      inputClassName = "",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className={["text-xs font-bold uppercase tracking-wider", labelClassName || "text-gray-300"].join(" ")}>
            {label}
          </label>
        )}

        <div
          className={[
            "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl",
            error ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-white dark:bg-neutral-950/0",
            className,
          ].join(" ")}
        >
          {Icon ? <Icon className={[error ? "text-red-300" : "", iconClassName || (!error ? "text-orange-400" : "")].join(" ")} size={18} /> : null}

          <input
            ref={ref}
            {...props}
            className={["w-full bg-transparent outline-none placeholder:text-gray-500 text-sm outline-0", inputClassName || "text-white"].join(" ")}
          />
        </div>

        {error ? (
          <p className="text-xs text-red-300">{error}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
