"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";
import VerifyOtpForm from "./VerifyOtpForm.jsx";
import ForgotPasswordForm from "./ForgotPasswordForm.jsx";
import ResetPasswordForm from "./ResetPasswordForm.jsx";

function AuthModalsInner() {
  const router = useRouter();
  const search = useSearchParams();
  const modal = search.get("auth");

  const close = () => {
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      router.replace(url.pathname + (url.search ? url.search : ""), { scroll: false });
    }, 0);
  };

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  if (!modal) return null;

  const map = {
    login: <LoginForm onClose={close} />,
    register: <RegisterForm onClose={close} />,
    verify: <VerifyOtpForm onClose={close} />,
    forgot: <ForgotPasswordForm onClose={close} />,
    reset: <ResetPasswordForm onClose={close} />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="relative w-full max-w-2xl">
        <button
          className="absolute -right-2 -top-10 rounded-full bg-white/90 px-3 py-1 text-sm text-slate-600 shadow"
          onClick={close}
        >
          Close
        </button>
        {map[modal] ?? null}
      </div>
    </div>
  );
}

export default function AuthModals() {
  return (
    <Suspense fallback={null}>
      <AuthModalsInner />
    </Suspense>
  );
}