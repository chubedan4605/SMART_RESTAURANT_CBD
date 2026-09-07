import React, { useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  UtensilsCrossed,
  Star,
  Clock,
} from "lucide-react";
import Input from "../../../Components/Input";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getSignInSchema } from "./schema/schemaSignIn";
import { useDispatch } from "react-redux";
import { loginThunk, setCredentials } from "../../../store/slices/authSlice";
import axiosClient from "../../../store/axiosClient";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = useMemo(() => getSignInSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const result = await dispatch(loginThunk(values)).unwrap();

      // sleep 10s
      // await new Promise((resolve) => setTimeout(resolve, 10000));

      toast.success(t("auth.loginSuccess"));

      const role = result?.user?.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "waiter") {
        navigate("/waiter");
      } else if (role === "kitchen") {
        navigate("/kitchen");
      } else {
        
        navigate("/");
      }
    } catch (error) {
      const message =
        error ||
        error?.message ||
        error?.response?.data?.message ||
        t("auth.loginFailed");

      toast.error(`${message}`);
    }
  };
  const googleBtnRef = useRef(null);
  useEffect(() => {
    if (!window.google || !googleBtnRef.current) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        // response.credential = Google ID token
        const res = await axiosClient.post("/auth/google", {
          credential: response.credential,
        });

        // lưu token/user giống loginThunk
        dispatch(
          setCredentials({ accessToken: res.accessToken, user: res.user }),
        );

        // điều hướng theo role
        const role = res?.user?.role;
        if (role === "admin") navigate("/admin");
        else if (role === "waiter") navigate("/waiter");
        else if (role === "kitchen") navigate("/kitchen");
        else navigate("/");
      },
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans bg-bistro-cream dark:bg-neutral-900">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
          alt="Restaurant Interior"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-bistro-cream dark:bg-neutral-900/90" />
      </div>

      {/* Left column */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 z-10 overflow-hidden h-screen">
        <div className="relative z-10">
          <div className="flex flex-col leading-none">
            <span className="font-display text-5xl text-bistro-charcoal dark:text-gray-100">
              Lumière
            </span>
            <span className="font-sans text-[10px] tracking-[0.4em] uppercase mt-2 text-bistro-wine font-black">
              Bistro
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-8 mt-16">
          <h2 className="text-4xl font-display text-bistro-charcoal dark:text-gray-100 leading-tight">
            {t("auth.heroTitle1")}{" "}
            <span className="italic text-bistro-wine">{t("auth.heroTitle2")}</span>{" "}
            <br />
            {t("auth.heroTitle3")}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-bistro-charcoal dark:text-gray-100/70">
              <div className="p-2 bg-bistro-wine/5 rounded-lg text-bistro-wine">
                <Star size={20} />
              </div>
              <p className="text-sm font-medium">{t("auth.feature1")}</p>
            </div>
            <div className="flex items-center gap-4 text-bistro-charcoal dark:text-gray-100/70">
              <div className="p-2 bg-bistro-wine/5 rounded-lg text-bistro-wine">
                <UtensilsCrossed size={20} />
              </div>
              <p className="text-sm font-medium">{t("auth.feature2")}</p>
            </div>
            <div className="flex items-center gap-4 text-bistro-charcoal dark:text-gray-100/70">
              <div className="p-2 bg-bistro-wine/5 rounded-lg text-bistro-wine">
                <Clock size={20} />
              </div>
              <p className="text-sm font-medium">{t("auth.openingHours")}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-bistro-charcoal dark:text-gray-100/30 text-[10px] tracking-widest uppercase mt-auto">
          High Quality Hospitality — Since 2026
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 w-full lg:w-1/2 max-w-md px-4 flex flex-col justify-center h-full">
        <div className="bg-white dark:bg-neutral-950 border border-bistro-wine/10 rounded-sm p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display text-bistro-charcoal dark:text-gray-100 leading-tight">
              {t("auth.welcome")}{" "}
              <span className="italic text-bistro-wine">
                {t("auth.welcomeTo")}
              </span>
            </h2>
            <p className="text-bistro-charcoal dark:text-gray-100/50 text-sm mt-2 uppercase tracking-[0.2em] font-sans">
              Lumière Bistro
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Sửa UI Input theo light theme trong Input component hoặc css */}
            <div className="bg-white dark:bg-neutral-950 text-bistro-charcoal dark:text-gray-100">
              <Input
                label={t("auth.email")}
                type="email"
                placeholder="waiter@lumiere.com"
                icon={Mail}
                error={errors.email?.message}
                {...register("email")}
                className="!bg-white dark:!bg-neutral-950 !text-bistro-charcoal dark:!text-gray-100 !border-bistro-charcoal/20 dark:!border-white/20 focus:!border-bistro-wine"
                labelClassName="!text-bistro-charcoal dark:!text-gray-100/70 font-sans text-xs uppercase tracking-wider"
                iconClassName="!text-bistro-wine dark:!text-gray-100/70"
                inputClassName="!text-bistro-charcoal dark:!text-gray-100"
              />
            </div>
            
            <div className="bg-white dark:bg-neutral-950 text-bistro-charcoal dark:text-gray-100">
              <Input
                label={t("auth.password")}
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register("password")}
                className="!bg-white dark:!bg-neutral-950 !text-bistro-charcoal dark:!text-gray-100 !border-bistro-charcoal/20 dark:!border-white/20 focus:!border-bistro-wine"
                labelClassName="!text-bistro-charcoal dark:!text-gray-100/70 font-sans text-xs uppercase tracking-wider"
                iconClassName="!text-bistro-wine dark:!text-gray-100/70"
                inputClassName="!text-bistro-charcoal dark:!text-gray-100"
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot"
                className="text-xs font-medium text-bistro-charcoal dark:text-gray-100/50 hover:text-bistro-wine transition-colors uppercase tracking-wide"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <button
              disabled={isSubmitting}
              className={[
                "w-full py-4 bg-bistro-charcoal hover:bg-black",
                "text-white font-sans text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300",
                "transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg mt-4",
                isSubmitting ? "opacity-70 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
              <ArrowRight size={16} />
            </button>

            {/* Divider */}
            <div className="relative py-4 mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-bistro-wine/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="px-3 bg-white dark:bg-neutral-950 text-bistro-charcoal dark:text-gray-100/40 tracking-[0.3em]">
                  {t("auth.orLoginWith")}
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div ref={googleBtnRef} className="w-full flex justify-center" />
            </div>
          </form>

          <p className="text-center text-bistro-charcoal dark:text-gray-100/60 text-[13px] mt-8 font-sans">
            {t("auth.noAccount")}
            <Link
              to="/signup"
              className="text-bistro-wine ml-2 font-bold hover:text-bistro-wine-light transition-colors"
            >
              {t("auth.registerNow")}
            </Link>
          </p>

          {/* Dev tip for quick testing */}
          <p className="text-center text-bistro-charcoal dark:text-gray-100/40 text-[11px] mt-6 tracking-wide">
            {t("auth.devTip")}{" "}
            <span className="text-bistro-wine font-bold">waiter</span>{" "}
            {t("common.or")}{" "}
            <span className="text-bistro-wine font-bold">kitchen</span>{" "}
            {t("auth.devTipEnd")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
