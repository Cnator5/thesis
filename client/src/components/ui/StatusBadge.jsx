// components/ui/StatusBadge.jsx
"use client";

import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  PUBLISHED: "bg-emerald-50 text-emerald-600",
  PENDING: "bg-amber-50 text-amber-600",
  REJECTED: "bg-rose-50 text-rose-600",
  DRAFT: "bg-slate-100 text-slate-600",
  AVAILABLE: "bg-emerald-50 text-emerald-600",
  BORROWED: "bg-sky-50 text-sky-600",
  OVERDUE: "bg-rose-50 text-rose-600",
  RETURNED: "bg-slate-100 text-slate-600"
};

export default function StatusBadge({ status }) {
  const normalized = status ?? "PUBLISHED";
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        STATUS_STYLES[normalized] ?? "bg-slate-100 text-slate-600"
      )}
    >
      {normalized}
    </span>
  );
}