// app/(auth)/layout.js
import "@/app/globals.css";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-12">
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}