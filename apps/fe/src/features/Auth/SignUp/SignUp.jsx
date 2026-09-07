import React, { useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  ShieldCheck,
  Star,
  Utensils,
} from "lucide-react";
import Input from "../../../Components/Input";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getSignUpSchema } from "./schema/schemaSignUp";
import { registerThunk, setCredentials } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { authApi } from "../../../services/authApi";
import axiosClient from "../../../store/axiosClient";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = useMemo(() => getSignUpSchema(t), [t]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const debounceRef = useRef(null);

  const checkEmailRealtime = (rawEmail) => {
    const email = String(rawEmail || "")
      .trim()
      .toLowerCase();

    // nếu đang lỗi format email thì không check server
    const okFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !okFormat) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await authApi.checkEmail(email);

        if (res?.exists) {
          setError("email", {
            type: "manual",
            message: t("auth.emailExists"),
          });
        } else {
          // chỉ clear nếu lỗi hiện tại là do exists
          if (errors.email?.message === t("auth.emailExists")) {
            clearErrors("email");
          }
        }
      } catch (e) {
        // không block user nếu API lỗi
      }
    }, 500); // 400-700ms tuỳ bạn
  };

  const dispatch = useDispatch();
  const onSubmit = async (values) => {
    const { fullName, password, email } = values;
    const data = {
      name: fullName,
      password,
      email,
    };
    const res = await dispatch(registerThunk(data));
  };

  const googleBtnRef = useRef(null);
  useEffect(() => {
    if (!window.google || !googleBtnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await axiosClient.post("/auth/google", {
            credential: response.credential,
          });

          dispatch(
            setCredentials({ accessToken: res.accessToken, user: res.user }),
          );

          const role = res?.user?.role;
          if (role === "admin") navigate("/admin");
          else if (role === "waiter") navigate("/waiter");
          else if (role === "kitchen") navigate("/kitchen");
          else navigate("/");
        } catch (e) {
          console.log("Google signup/signin failed:", e);
        }
      },
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "signup_with",
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans bg-bistro-cream dark:bg-neutral-900">
      {/* 1. Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
          alt="Fine Dining"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-bistro-cream dark:bg-neutral-900/90 lg:bg-linear-to-r lg:from-bistro-cream/90 lg:via-bistro-cream/50 lg:to-transparent"></div>
      </div>

      {/* 2. Left Desktop */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-24 lg:p-32 z-10 overflow-hidden h-screen">
        <div className="flex flex-col leading-none">
          <span className="font-display text-5xl text-bistro-charcoal dark:text-gray-100">Lumière</span>
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase mt-2 text-bistro-wine font-black">
            Bistro
          </span>
        </div>

        <div className="max-w-md space-y-8 mt-16">
          <h2 className="text-4xl font-display text-bistro-charcoal dark:text-gray-100 leading-tight">
            {t("auth.becomeMember")} <span className="italic text-bistro-wine"></span>{" "}
            <br />
            {t("auth.getMemberBenefits")}
          </h2>

          <div className="space-y-5 text-bistro-charcoal dark:text-gray-100/70">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-bistro-wine/5 rounded-lg text-bistro-wine mt-1">
                <Star size={20} />
              </div>
              <div>
                <p className="font-medium text-bistro-charcoal dark:text-gray-100">
                  {t("auth.firstOrderDiscount")}
                </p>
                <p className="text-xs text-bistro-charcoal dark:text-gray-100/50 mt-1">{t("auth.applyToMenu")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-bistro-wine/5 rounded-lg text-bistro-wine mt-1">
                <Utensils size={20} />
              </div>
              <div>
                <p className="font-medium text-bistro-charcoal dark:text-gray-100">
                  {t("auth.earnPoints")}
                </p>
                <p className="text-xs text-bistro-charcoal dark:text-gray-100/50 mt-1">
                  {t("auth.pointsBenefit")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-bistro-charcoal dark:text-gray-100/30 text-[10px] tracking-widest uppercase mt-auto">
          Join the Elite Taste — Since 2026
        </div>
      </div>

      {/* 3. Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex justify-center items-center px-4 py-10 h-full">
        <div className="w-full max-w-md bg-white dark:bg-neutral-950 border border-bistro-wine/10 rounded-sm p-8 md:p-10 shadow-2xl">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <p className="font-display text-4xl text-bistro-charcoal dark:text-gray-100">Lumière</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display text-bistro-charcoal dark:text-gray-100 leading-tight">
              {t("auth.createAccount")}
            </h2>
            <p className="text-bistro-charcoal dark:text-gray-100/50 text-xs mt-2 uppercase tracking-[0.2em] font-sans">
              {t("auth.startJourney")}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="bg-white dark:bg-neutral-950 text-bistro-charcoal dark:text-gray-100">
              <Input
                label={t("auth.fullName")}
                type="text"
                placeholder="John Doe"
                icon={User}
                error={errors.fullName?.message}
                {...register("fullName")}
                className="!bg-white dark:!bg-neutral-950 !text-bistro-charcoal dark:!text-gray-100 !border-bistro-charcoal/20 dark:!border-white/20 focus:!border-bistro-wine"
                labelClassName="!text-bistro-charcoal dark:!text-gray-100/70 font-sans text-xs uppercase tracking-wider"
                iconClassName="!text-bistro-wine dark:!text-gray-100/70"
                inputClassName="!text-bistro-charcoal dark:!text-gray-100"
              />
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-neutral-950 text-bistro-charcoal dark:text-gray-100">
              <Input
                label={t("auth.email")}
                type="email"
                placeholder="example@lumiere.com"
                icon={Mail}
                error={errors.email?.message}
                {...register("email", {
                  onChange: (e) => checkEmailRealtime(e.target.value),
                })}
                className="!bg-white dark:!bg-neutral-950 !text-bistro-charcoal dark:!text-gray-100 !border-bistro-charcoal/20 dark:!border-white/20 focus:!border-bistro-wine"
                labelClassName="!text-bistro-charcoal dark:!text-gray-100/70 font-sans text-xs uppercase tracking-wider"
                iconClassName="!text-bistro-wine dark:!text-gray-100/70"
                inputClassName="!text-bistro-charcoal dark:!text-gray-100"
              />
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="bg-white dark:bg-neutral-950 text-bistro-charcoal dark:text-gray-100">
                <Input
                  label={t("auth.confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  icon={ShieldCheck}
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                  className="!bg-white dark:!bg-neutral-950 !text-bistro-charcoal dark:!text-gray-100 !border-bistro-charcoal/20 dark:!border-white/20 focus:!border-bistro-wine"
                  labelClassName="!text-bistro-charcoal dark:!text-gray-100/70 font-sans text-xs uppercase tracking-wider"
                  iconClassName="!text-bistro-wine dark:!text-gray-100/70"
                  inputClassName="!text-bistro-charcoal dark:!text-gray-100"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 px-1 mt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 w-4 h-4 accent-bistro-wine rounded border-bistro-charcoal/20 dark:border-white/20"
                {...register("terms")}
              />
              <label
                htmlFor="terms"
                className="text-xs text-bistro-charcoal dark:text-gray-100/60 leading-relaxed font-sans"
              >
                {t("auth.agreeTerms")}{" "}
                <span className="text-bistro-wine font-medium underline cursor-pointer hover:text-bistro-wine-light transition-colors">
                  {t("auth.termsAndPolicy")}
                </span>{" "}
                {t("auth.ofRestaurant")}
              </label>
            </div>
            {errors.terms?.message ? (
              <p className="text-xs text-red-500 px-1 mt-1 font-medium">
                {errors.terms.message}
              </p>
            ) : null}

            {/* Submit */}
            <button
              disabled={isSubmitting}
              className={[
                "w-full py-4 bg-bistro-charcoal hover:bg-black",
                "text-white font-sans text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300",
                "transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg mt-6",
                isSubmitting ? "opacity-70 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {isSubmitting ? t("auth.creating") : t("auth.registerMember")}{" "}
              <ArrowRight size={16} />
            </button>

            {/* Divider */}
            <div className="relative py-4 mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-bistro-wine/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-sans tracking-[0.2em]">
                <span className="bg-white dark:bg-neutral-950 px-3 text-bistro-charcoal dark:text-gray-100/40">
                  {t("auth.orFasterWith")}
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="w-full">
                <div
                  ref={googleBtnRef}
                  className="w-full flex justify-center"
                />
              </div>
            </div>
          </form>

          <p className="text-center text-bistro-charcoal dark:text-gray-100/60 text-[13px] mt-8 font-sans">
            {t("auth.haveAccount")}
            <Link
              to="/signin"
              className="text-bistro-wine ml-2 font-bold hover:text-bistro-wine-light transition-colors"
            >
              {t("auth.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
