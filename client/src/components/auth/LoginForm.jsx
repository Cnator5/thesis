"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { Loader } from "../ui/Loader.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6)
});

export default function LoginForm({ onClose }) {
  const router = useRouter();
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const [show, setShow] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "" }
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
      onClose?.();
    }
  }, [isAuthenticated, isLoading, onClose, router]);

  return (
    <Card className="glass-panel rounded-3xl px-8 py-10">
      <h2 className="mb-6 text-center text-2xl font-semibold text-slate-900">
        Sign in
      </h2>
      <form
        onSubmit={handleSubmit(async (values) => {
          await signIn(values);
        })}
        className="space-y-5"
      >
        <Input
          label="Email or username"
          error={errors.identifier?.message}
          {...register("identifier")}
        />
        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">Password</span>
          <div className="relative">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              type={show ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password?.message && (
            <span className="text-xs text-rose-500">
              {errors.password.message}
            </span>
          )}
        </label>
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            className="text-indigo-600 hover:text-[#ffbf00]"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("auth", "forgot");
              history.pushState(null, "", url);
              window.dispatchEvent(new Event("popstate"));
            }}
          >
            Forgot password?
          </button>
          <button
            type="button"
            className="text-slate-600 hover:text-[#ffbf00]"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("auth", "register");
              history.pushState(null, "", url);
              window.dispatchEvent(new Event("popstate"));
            }}
          >
            Create account
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader size="sm" /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Card>
  );
}