// app/(auth)/reset-password/page.js
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
import { normalizeError } from "@/lib/utils";

const schema = z
  .object({
    email: z.string().email("Provide the email used for registration."),
    otp: z.string().length(6, "OTP must be 6 digits."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Include an uppercase letter.")
      .regex(/[a-z]/, "Include a lowercase letter.")
      .regex(/[0-9]/, "Include a number."),
    confirmPassword: z.string().min(8, "Confirm your new password.")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      await resetPassword(values);
      toast.success("Password updated. You can log in with your new password.");
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  return (
    <Card className="glass-panel mx-auto max-w-2xl rounded-4xl px-10 py-12 shadow-2xl shadow-indigo-100">
      <div className="mb-6 space-y-3 text-center">
        <span className="badge-pill bg-indigo-50 text-indigo-600">Secure account</span>
        <h1 className="text-3xl font-semibold text-slate-900">Set a new password</h1>
        <p className="text-sm text-slate-600">
          Enter the OTP from your email and choose a new strong password for your Research Guru account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
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
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader size="sm" />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </p>
    </Card>
  );
}