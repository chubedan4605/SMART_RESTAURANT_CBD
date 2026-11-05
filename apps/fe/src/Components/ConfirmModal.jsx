import { useTranslation } from "react-i18next";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  cancelText,
  danger = false,
  onConfirm,
  onClose,
  loading = false,
}) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={() => !loading && onClose?.()}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-scale-in">
          <div className="p-6">
            <div className="font-serif font-bold text-lg text-foreground">
              {title || t("common.confirm")}
            </div>
            {description ? (
              <div className="text-muted-foreground text-sm mt-2">{description}</div>
            ) : null}
          </div>

          <div className="px-6 pb-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="min-h-11 px-4 py-2 rounded-xl bg-background border border-border text-xs font-semibold text-foreground hover:border-gold/40 hover:text-gold transition cursor-pointer"
            >
              {cancelText || t("common.cancel")}
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className={`min-h-11 px-5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                danger
                  ? "bg-destructive text-destructive-foreground border-destructive hover:opacity-90"
                  : "bg-gold text-ink border-gold hover:bg-gold-light"
              }`}
            >
              {loading
                ? t("common.processing")
                : confirmText || t("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
