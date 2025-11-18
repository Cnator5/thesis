// components/ui/Loader.jsx
"use client";

export function Loader({ size = "md" }) {
  const dimensions = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-6 w-6 border-2"
  }[size];

  return (
    <span
      className={`inline-block animate-spin rounded-full border-slate-300 border-t-indigo-500 ${dimensions}`}
    />
  );
}

export function FullscreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
      <Loader size="lg" />
      <span className="ml-3 text-sm font-semibold">Loading…</span>
    </div>
  );
}