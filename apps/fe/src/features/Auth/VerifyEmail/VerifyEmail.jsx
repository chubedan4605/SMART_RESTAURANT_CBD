import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosClient from "../../../store/axiosClient";
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = params.get("token");
        const email = params.get("email");
        const res = await axiosClient.post("/auth/verify-email", {
          token,
          email,
        });
        setMsg(res?.message || t("auth.verifySuccess"));
        setStatus("ok");
      } catch (e) {
        setMsg(e?.response?.data?.message || t("auth.verifyFailed"));
        setStatus("fail");
      }
    })();
  }, [params, t]);

  if (status === "loading")
    return (
      <div className="p-6 min-h-screen bg-bistro-cream dark:bg-neutral-900 text-bistro-charcoal dark:text-gray-100 flex items-center justify-center">
        {t("auth.verifying")}
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-bistro-cream dark:bg-neutral-900 text-bistro-charcoal dark:text-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-neutral-950 border border-bistro-wine/10 rounded-sm p-8 shadow-2xl text-center">
        <p className="mb-6 text-lg font-medium">{msg}</p>
        <Link
          className="inline-block px-6 py-2.5 bg-bistro-wine text-white font-bold rounded-lg hover:bg-bistro-wine/90 transition-colors"
          to="/signin"
        >
          {t("auth.goToLogin")}
        </Link>
      </div>
    </div>
  );
}
