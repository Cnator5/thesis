// components/ui/EmptyState.jsx
"use client";

import Button from "@/components/ui/Button.jsx";

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {actionLabel && (
        <div className="mt-4 flex justify-center">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}