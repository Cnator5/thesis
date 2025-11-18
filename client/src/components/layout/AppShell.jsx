// components/layout/AppShell.jsx
"use client";

import Sidebar from "@/components/layout/Sidebar.jsx";
import Topbar from "@/components/layout/Topbar.jsx";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}