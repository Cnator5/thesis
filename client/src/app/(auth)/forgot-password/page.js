// app/(auth)/forgot-password/page.js
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { useAuth } from "@/components/providers/AuthProvider.jsx";
import { normalizeError } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter the email associated with your account.")
});

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      await requestPasswordReset(values);
      toast.success("Reset OTP sent. Check your inbox.");
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  return (
    <Card className="glass-panel mx-auto max-w-2xl rounded-4xl px-10 py-12 shadow-2xl shadow-indigo-100">
      <div className="mb-6 space-y-3 text-center">
        <span className="badge-pill bg-indigo-50 text-indigo-600">Password reset</span>
        <h1 className="text-3xl font-semibold text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-600">
          We will send a one-time code to your registered email. You have 30 minutes before it expires.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email address"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader size="sm" />
              Sending reset code…
            </>
          ) : (
            "Email me the reset code"
          )}
        </Button>
      </form>
    </Card>
  );
}