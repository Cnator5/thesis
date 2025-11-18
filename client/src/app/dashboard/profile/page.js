// app/(dashboard)/profile/page.js
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "@/components/ui/Card.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { Loader } from "@/components/ui/Loader.jsx";
import { useAuth } from "@/components/providers/AuthProvider.jsx";
import { callSummaryApi } from "@/lib/apiClient";
import SummaryApi from "@/lib/SummaryApi";
import { formatDate, formatDateTime, normalizeError } from "@/lib/utils";
import { toast } from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Name is required."),
  phone: z.string().optional()
});

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? ""
    }
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name ?? "",
      phone: user.phone ?? ""
    });
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      await callSummaryApi(SummaryApi.users.updateProfile, { payload: values });
      toast.success("Profile updated.");
      await refreshProfile();
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Account settings
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Profile
        </h1>
        <p className="text-sm text-slate-600">
          Update your identity and contact details to keep your account secure.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card as="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            error={errors.name?.message}
            {...register("name")}
            required
          />
          <Input label="Email address" value={user.email} disabled readOnly />
          <Input
            label="Phone number"
            placeholder="+237600000000"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader size="sm" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </Card>

        <Card className="space-y-3 text-sm text-slate-600">
          <div>
            <h2 className="text-sm font-semibold text-slate-500">Account overview</h2>
            <p className="mt-2 text-sm">
              Role: <span className="font-semibold text-slate-900">{user.role}</span>
            </p>
            <p className="text-sm">
              Status: <span className="font-semibold text-slate-900">{user.status}</span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500">Security</h3>
            <p className="mt-2 text-xs text-slate-500">
              Email verified: {user.emailVerified ? "Yes" : "No"}
            </p>
            <p className="text-xs text-slate-500">
              Phone verified: {user.phoneVerified ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500">Activity</h3>
            <p className="mt-2 text-xs text-slate-500">
              Member since {formatDate(user.createdAt)}
            </p>
            <p className="text-xs text-slate-500">
              Last login {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "—"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}