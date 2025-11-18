// app/not-found.jsx
import Link from "next/link";

export const metadata = {
  title: "Page Not Found · Excellent Research"
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
        404 · Not Found
      </p>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-slate-900">We lost that page</h1>
        <p className="max-w-xl text-base text-slate-600">
          The resource you are trying to view does not exist or has been moved. Double‑check the URL or head back home.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Return home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          Contact support
        </Link>
      </div>
    </main>
  );
}