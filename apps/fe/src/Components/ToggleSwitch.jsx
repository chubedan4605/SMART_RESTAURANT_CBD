import React from "react";

export default function ToggleSwitch({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition cursor-pointer
        ${checked
          ? "bg-gold/20 border-gold/40"
          : "bg-secondary border-border"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-gold/30"}`}
      aria-pressed={checked}
      aria-label={label || "toggle"}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full transition shadow-xs
          ${checked ? "translate-x-5.5 bg-gold" : "translate-x-0.5 bg-muted-foreground/60"}`}
      />
    </button>
  );
}
