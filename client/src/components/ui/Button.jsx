// components/ui/Button.jsx
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-500",
  secondary:
    "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 focus-visible:outline-indigo-500",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-500",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-500"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base"
};

const Button = forwardRef(function Button(
  { asChild, className, variant = "primary", size = "md", ...props },
  ref
) {
  const Component = asChild ? "span" : "button";
  return (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

export default Button;