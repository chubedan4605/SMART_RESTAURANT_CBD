import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import Input from "../../../Components/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getForgotSchema } from "./schema/schemaForgot";
import { authApi } from "../../../services/authApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Forgot() {
  const { t } = useTranslation();
  const schema = useMemo(() => getForgotSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    try {
      await authApi.forgotPassword(email);
      toast.success(t("auth.resetLinkSent"));
    } catch (e) {
      toast.error(e?.response?.data?.message || t("auth.sendEmailFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-bistro-cream text-bistro-charcoal font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-bistro-wine/10 rounded-sm p-10 shadow-2xl">
        <h1 className="text-3xl font-display text-bistro-charcoal">{t("auth.forgotPasswordTitle")}</h1>
        <p className="text-sm text-bistro-charcoal/60 mt-3 font-sans leading-relaxed">
          {t("auth.forgotPasswordDesc")}
        </p>

        <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white text-bistro-charcoal">
            <Input
              label={t("auth.email")}
              type="email"
              placeholder="example@lumiere.com"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
              className="!bg-white !text-bistro-charcoal !border-bistro-charcoal/20 focus:!border-bistro-wine"
              labelClassName="!text-bistro-charcoal/70 font-sans text-xs uppercase tracking-wider"
              iconClassName="!text-bistro-wine"
            />
          </div>

          <button
            disabled={isSubmitting}
            className={[
              "w-full py-4 bg-bistro-charcoal hover:bg-black",
              "text-white font-sans text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300",
              "transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg mt-6",
              isSubmitting ? "opacity-70 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {isSubmitting ? t("auth.sending") : t("auth.sendResetLink")}{" "}
            <ArrowRight size={16} />
          </button>

          <div className="text-center text-sm font-sans mt-8">
            <Link
              to="/signin"
              className="text-bistro-wine font-bold hover:text-bistro-wine-light transition-colors uppercase tracking-widest text-[11px]"
            >
              {t("auth.backToLogin")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
