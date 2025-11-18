// components/ui/StatCard.jsx
"use client";

import Card from "@/components/ui/Card.jsx";

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
          {icon}
        </div>
      </div>
    </Card>
  );
}