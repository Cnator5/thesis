// components/auth/RegisterForm.jsx
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
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(["RESEARCHER", "STUDENT"]).default("STUDENT")
});

export default function RegisterForm({ onClose }) {
  const { register: doRegister } = useAuth();
  const [show, setShow] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema), defaultValues: { role: "STUDENT" } });

  return (
    <Card className="glass-panel rounded-3xl px-8 py-10">
      <h2 className="mb-6 text-center text-2xl font-semibold text-slate-900">Create account</h2>
      <form
        onSubmit={handleSubmit(async (v) => {
          await doRegister(v);
          const url = new URL(window.location.href); url.searchParams.set("auth","verify"); history.pushState(null,"",url); window.dispatchEvent(new Event("popstate"));
        })}
        className="grid gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" error={errors.name?.message} {...register("name")} />
          <Input label="Username" error={errors.username?.message} {...register("username")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone" placeholder="+237…" {...register("phone")} />
        </div>
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
              onClick={() => setShow((p) => !p)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password?.message && <span className="text-xs text-rose-500">{errors.password.message}</span>}
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">Role</span>
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold"
            {...register("role")}
          >
            <option value="STUDENT">Student / Reader</option>
            <option value="RESEARCHER">Researcher / Author</option>
          </select>
        </label>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (<><Loader size="sm" /> Creating…</>) : "Register"}
        </Button>
      </form>
    </Card>
  );
}