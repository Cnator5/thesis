// hooks/useRequireRole.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/components/providers/AuthProvider.jsx";

export default function useRequireRole(requiredRole, redirectTo = "/dashboard") {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (requiredRole && user?.role !== requiredRole) {
      toast.error("You do not have permission to view that page.");
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, redirectTo]);
}