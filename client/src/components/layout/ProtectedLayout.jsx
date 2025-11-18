// components/layout/ProtectedLayout.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "./AppShell.jsx";
import { useAuth } from "../providers/AuthProvider.jsx";
import { FullscreenLoader } from "../ui/Loader.jsx";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/?auth=login"); // open login popup but keep user on homepage if needed
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <FullscreenLoader />;
  if (!isAuthenticated) return null;

  return <AppShell>{children}</AppShell>;
}