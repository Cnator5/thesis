// app/(dashboard)/layout.js
"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout.jsx";

export default function DashboardGroupLayout({ children }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}