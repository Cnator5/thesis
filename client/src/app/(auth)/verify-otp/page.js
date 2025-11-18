// app/(auth)/verify-otp/page.js
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { useAuth } from "@/components/providers/AuthProvider.jsx";
import SummaryApi from "@/lib/SummaryApi";
import { callSummaryApi } from "@/lib/apiClient";
import { normalizeError } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter the email you registered with."),
  otp: z.string().length(6, "OTP must be 6 digits.")
});

export default function VerifyOtpPage() {
  const { verifyOtp } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      otp: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      await verifyOtp(values);
      toast.success("Account verified successfully. You can now sign in.");
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  const handleResend = async (email) => {
    if (!email) {
      toast.error("Provide your email first.");
      return;
    }
    try {
      await callSummaryApi(SummaryApi.auth.resendOtp, { payload: { email } });
      toast.success("OTP resent. Check your inbox or WhatsApp.");
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  return (
    <Card className="glass-panel mx-auto max-w-2xl rounded-4xl px-10 py-12 shadow-2xl shadow-indigo-100">
      <div className="mb-6 space-y-3 text-center">
        <span className="badge-pill bg-indigo-50 text-indigo-600">Verify account</span>
        <h1 className="text-3xl font-semibold text-slate-900">Confirm your OTP</h1>
        <p className="text-sm text-slate-600">
          Enter the six-digit code sent to your email or WhatsApp number to activate your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="OTP"
          placeholder="123456"
          error={errors.otp?.message}
          {...register("otp")}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader size="sm" />
              Verifying…
            </>
          ) : (
            "Verify account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Didn’t receive the code?{" "}
        <button
          className="font-semibold text-indigo-600 hover:text-indigo-500"
          onClick={() => handleResend(document.querySelector("input[name='email']").value)}
        >
          Resend OTP
        </button>
        <p className="mt-3">
          Ready to log in?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}