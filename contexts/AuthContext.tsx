"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { JWTPayload } from "@/types";

interface AuthContextType {
  user: JWTPayload | null;
  loading: boolean;
  logout: () => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthResponse {
  user: JWTPayload;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  setLoading: () => {},
});

const FETCH_TIMEOUT = 5000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const response = await fetch("/api/auth/check", {
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as AuthResponse;
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Auth check error:", error.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      await router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout error:", error.message);
      }
    }
  }, [router]);

  useEffect(() => {
    const abortController = new AbortController();
    checkAuth();
    return () => {
      abortController.abort();
    };
  }, [checkAuth]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      logout,
      setLoading,
    }),
    [user, loading, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
