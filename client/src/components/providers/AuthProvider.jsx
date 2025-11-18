// components/providers/AuthProvider.jsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import SummaryApi from "@/lib/SummaryApi";
import { callSummaryApi } from "@/lib/apiClient";
import { normalizeError } from "@/lib/utils";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  register: async () => {},
  verifyOtp: async () => {},
  resendOtp: async () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  refreshProfile: async () => {},
  setUser: () => {}
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await callSummaryApi(SummaryApi.auth.me);
      setUser(response?.data ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const signIn = useCallback(
    async (payload) => {
      try {
        const response = await callSummaryApi(SummaryApi.auth.login, { payload });
        const loggedInUser = response?.data?.user ?? response?.data ?? null;
        setUser(loggedInUser);
        toast.success("Welcome back!");
        router.replace("/dashboard");
        return response;
      } catch (error) {
        toast.error(normalizeError(error));
        throw error;
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    try {
      await callSummaryApi(SummaryApi.auth.logout, { payload: {} });
    } finally {
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  const register = useCallback(async (payload) => {
    try {
      return await callSummaryApi(SummaryApi.auth.register, { payload });
    } catch (error) {
      toast.error(normalizeError(error));
      throw error;
    }
  }, []);

  const verifyOtp = useCallback(async (payload) => {
    try {
      const response = await callSummaryApi(SummaryApi.auth.verifyOtp, { payload });
      toast.success("Account verified. You can now sign in.");
      return response;
    } catch (error) {
      toast.error(normalizeError(error));
      throw error;
    }
  }, []);

  const resendOtp = useCallback(async (payload) => {
    try {
      const response = await callSummaryApi(SummaryApi.auth.resendOtp, { payload });
      toast.success("OTP resent. Check your inbox.");
      return response;
    } catch (error) {
      toast.error(normalizeError(error));
      throw error;
    }
  }, []);

  const requestPasswordReset = useCallback(async (payload) => {
    try {
      return await callSummaryApi(SummaryApi.auth.forgotPassword, { payload });
    } catch (error) {
      toast.error(normalizeError(error));
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (payload) => {
    try {
      const response = await callSummaryApi(SummaryApi.auth.resetPassword, { payload });
      toast.success("Password updated. Please sign in.");
      return response;
    } catch (error) {
      toast.error(normalizeError(error));
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
      register,
      verifyOtp,
      resendOtp,
      requestPasswordReset,
      resetPassword,
      refreshProfile
    }),
    [
      user,
      isLoading,
      signIn,
      signOut,
      register,
      verifyOtp,
      resendOtp,
      requestPasswordReset,
      resetPassword,
      refreshProfile
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}