import React from "react";
import { useTranslation } from "react-i18next";

export default function MenuErrorState({ error, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
      <div className="text-muted-foreground text-sm font-sans max-w-md">
        {t("errors.error")}: {error}
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 px-6 py-2.5 bg-gold hover:bg-gold-soft text-ink font-sans text-xs tracking-luxe uppercase font-semibold transition-all shadow-md cursor-pointer rounded-none"
      >
        {t("common.retry")}
      </button>
    </div>
  );
}
