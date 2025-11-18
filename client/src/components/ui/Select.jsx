// components/ui/Select.jsx
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Select = forwardRef(function Select(
  { label, error, hint, className, children, ...props },
  ref
) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-600">
      {label && <span className="font-semibold text-slate-700">{label}</span>}
      <select
        ref={ref}
        className={cn(
          "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-200",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </label>
  );
});

export default Select;