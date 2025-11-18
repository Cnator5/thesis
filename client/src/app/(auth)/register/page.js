// app/(auth)/register/page.js
"use client";

import { useForm, useWatch } from "react-hook-form";
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
  name: z.string().min(3, "Name must be at least 3 characters."),
  username: z.string().min(3, "Username is required."),
  email: z.string().email("Provide a valid institutional email."),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  role: z.enum(["RESEARCHER", "STUDENT"]).default("STUDENT")
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "STUDENT"
    }
  });

  const role = useWatch({ control, name: "role" });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success("Registration successful. Check your inbox for the OTP.");
    } catch (error) {
      toast.error(normalizeError(error));
    }
  };

  return (
    <Card className="glass-panel mx-auto max-w-3xl rounded-4xl px-10 py-12 shadow-2xl shadow-indigo-100">
      <div className="mb-8 space-y-3 text-center">
        <span className="badge-pill bg-indigo-50 text-indigo-600">Become a contributor</span>
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Join the Research Guru network
        </h1>
        <p className="text-sm text-slate-600">
          Create groundbreaking projects, curate departmental topics, and manage library resources.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" error={errors.name?.message} {...register("name")} />
          <Input
            label="Username"
            placeholder="researchguru"
            error={errors.username?.message}
            {...register("username")}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Institutional email"
            type="email"
            placeholder="firstname.lastname@domain.cm"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Phone (WhatsApp for OTP)"
            placeholder="+237600000000"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">Role</span>
          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            {...register("role")}
          >
            <option value="STUDENT">Student / Reader</option>
            <option value="RESEARCHER">Researcher / Author</option>
          </select>
          <span className="text-xs text-slate-500">
            {role === "RESEARCHER"
              ? "Researchers can create topics, submit articles, and design courses."
              : "Students can explore articles, enrol in courses, and monitor library borrows."}
          </span>
        </label>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader size="sm" />
              Creating account…
            </>
          ) : (
            "Register"
          )}
        </Button>
        <p className="text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}