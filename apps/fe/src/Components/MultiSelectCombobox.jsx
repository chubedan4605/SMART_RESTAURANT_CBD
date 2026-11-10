import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X, Check } from "lucide-react";

export default function MultiSelectCombobox({
  options = [],
  value = [],
  onChange,
  placeholder = "Chọn lựa chọn...",
  disabled = false,
  maxHeight = 260,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectedSet = useMemo(() => new Set(value || []), [value]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => {
      const text = `${o.label} ${o.subLabel || ""}`.toLowerCase();
      return text.includes(s);
    });
  }, [options, q]);

  const selectedLabels = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]));
    return (value || []).map((v) => map.get(v)).filter(Boolean);
  }, [options, value]);

  const toggle = (v) => {
    if (disabled) return;
    const next = selectedSet.has(v)
      ? (value || []).filter((x) => x !== v)
      : [...(value || []), v];
    onChange?.(next);
  };

  const clearAll = (e) => {
    e?.stopPropagation();
    if (disabled) return;
    onChange?.([]);
  };

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground hover:border-gold/40 transition disabled:opacity-50 min-h-11 cursor-pointer"
      >
        <div className="flex-1 text-left">
          {selectedLabels.length ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedLabels.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-lg border border-border bg-card px-2 py-0.5 text-[11px] text-foreground font-medium"
                >
                  {t}
                </span>
              ))}
              {selectedLabels.length > 3 ? (
                <span className="text-[11px] text-muted-foreground self-center">
                  +{selectedLabels.length - 3} nữa
                </span>
              ) : null}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedLabels.length ? (
            <span
              onClick={clearAll}
              className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
              aria-label="Xóa chọn"
              role="button"
            >
              <X size={13} />
            </span>
          ) : null}
          <ChevronDown size={15} className="text-muted-foreground" />
        </div>
      </button>

      {/* Dropdown */}
      {open ? (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-scale-in">
          <div className="p-3 border-b border-border bg-secondary/20">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-gold/50"
            />
          </div>

          <div
            className="overflow-auto divide-y divide-border/30"
            style={{ maxHeight }}
          >
            {filtered.length ? (
              filtered.map((o) => {
                const checked = selectedSet.has(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => toggle(o.value)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-accent/40 transition flex items-start gap-3 cursor-pointer"
                  >
                    <div
                      className={`mt-0.5 h-4 w-4 rounded-sm border flex items-center justify-center shrink-0 transition ${
                        checked
                          ? "bg-gold border-gold text-ink"
                          : "bg-transparent border-border"
                      }`}
                    >
                      {checked && <Check size={11} strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-foreground font-medium">
                        {o.label}
                      </div>
                      {o.subLabel ? (
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {o.subLabel}
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3.5 py-4 text-xs text-muted-foreground text-center">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border flex items-center justify-between bg-card">
            <div className="text-[11px] text-muted-foreground">
              Đã chọn: <span className="font-bold text-foreground font-serif">{(value || []).length}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded-xl bg-gold text-ink font-semibold hover:bg-gold-light transition text-xs cursor-pointer"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
