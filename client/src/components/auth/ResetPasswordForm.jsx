// components/auth/ResetPasswordForm.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { Loader } from "../ui/Loader.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

export default function ResetPasswordForm({ onClose }) {
  const { resetPassword } = useAuth();
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <Card className="glass-panel rounded-3xl px-8 py-10">
      <h2 className="mb-6 text-center text-2xl font-semibold text-slate-900">Set new password</h2>
      <form
        onSubmit={handleSubmit(async (v) => {
          await resetPassword(v);
          onClose?.();
        })}
        className="space-y-5"
      >
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input label="OTP" placeholder="123456" error={errors.otp?.message} {...register("otp")} />
        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">New password</span>
          <div className="relative">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              type={show1 ? "text" : "password"}
              {...register("newPassword")}
              placeholder="••••••••"
            />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500" onClick={() => setShow1((p) => !p)}>
              {show1 ? "Hide" : "Show"}
            </button>
          </div>
          {errors.newPassword?.message && <span className="text-xs text-rose-500">{errors.newPassword.message}</span>}
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">Confirm password</span>
          <div className="relative">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              type={show2 ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="••••••••"
            />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500" onClick={() => setShow2((p) => !p)}>
              {show2 ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword?.message && <span className="text-xs text-rose-500">{errors.confirmPassword.message}</span>}
        </label>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (<><Loader size="sm" /> Updating…</>) : "Update password"}
        </Button>
      </form>
    </Card>
  );
}