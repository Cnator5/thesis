// components/auth/ForgotPasswordForm.jsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { Loader } from "../ui/Loader.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordForm({ onClose }) {
  const { requestPasswordReset } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <Card className="glass-panel rounded-3xl px-8 py-10">
      <h2 className="mb-6 text-center text-2xl font-semibold text-slate-900">Reset password</h2>
      <form
        onSubmit={handleSubmit(async (v) => {
          await requestPasswordReset(v);
          const url = new URL(window.location.href); url.searchParams.set("auth","reset"); history.pushState(null,"",url); window.dispatchEvent(new Event("popstate"));
        })}
        className="space-y-5"
      >
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (<><Loader size="sm" /> Sending…</>) : "Send reset code"}
        </Button>
      </form>
    </Card>
  );
}