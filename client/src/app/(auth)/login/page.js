"use client";

import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { useAuth } from "@/components/providers/AuthProvider.jsx";
import { normalizeError } from "@/lib/utils";

const schema = z.object({
  identifier: z.string().min(3, "Email or username is required."),
  password: z.string().min(6, "Password is required.")
});

function LoginScreen() {
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const onSubmit = async (values) => {
    try {
      await signIn(values);
      const redirect = searchParams.get("redirect");
      router.replace(redirect || "/dashboard");
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  return (
    <Card className="glass-panel mx-auto max-w-3xl rounded-4xl px-10 py-12 shadow-2xl shadow-indigo-100">
      <div className="mb-8 space-y-3 text-center">
        <span className="badge-pill bg-indigo-50 text-indigo-600">Welcome back</span>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Sign in to Research Guru
        </h1>
        <p className="text-sm text-slate-600">
          Access your articles, courses, and library dashboards with secure institutional credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email or username"
          placeholder="researcher@university.cm"
          autoComplete="username"
          error={errors.identifier?.message}
          {...register("identifier")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </Link>
          <Link href="/register" className="text-slate-500 hover:text-slate-700">
            Create account
          </Link>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader size="sm" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-slate-500">Loading login…</div>}>
      <LoginScreen />
    </Suspense>
  );
}