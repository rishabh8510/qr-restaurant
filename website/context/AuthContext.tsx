"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const API_BASE =
  process.env.NODE_ENV === "production" && typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
      (typeof window !== "undefined" ? "/api" : "http://localhost:5000/api");

type User = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  role: string;
};

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  showLoginModal: boolean;
  openLoginModal: (onSuccess?: () => void) => void;
  closeLoginModal: () => void;
  requireAuth: (action: () => void) => void;
  sendOtp: (phone: string) => Promise<{ debugCode?: string }>;
  verifyOtp: (phone: string, code: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string }) => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

function readStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }
  try {
    const t = localStorage.getItem("customer_token");
    const u = localStorage.getItem("customer_user");
    if (t && u) {
      return { token: t, user: JSON.parse(u) as User };
    }
  } catch {
    /* ignore */
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Lazy init — no useEffect setState → no cascading render warning
  const [user, setUser] = useState<User | null>(() => readStoredAuth().user);
  const [token, setToken] = useState<string | null>(() => readStoredAuth().token);
  const [loading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const openLoginModal = useCallback((onSuccess?: () => void) => {
    pendingActionRef.current = onSuccess || null;
    setShowLoginModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    pendingActionRef.current = null;
  }, []);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (user && token) {
        action();
        return;
      }
      pendingActionRef.current = action;
      setShowLoginModal(true);
    },
    [user, token]
  );

  const sendOtp = useCallback(async (phone: string) => {
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to send OTP");
    return json as { message?: string; debugCode?: string };
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, code: string, name?: string) => {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Invalid OTP");

      const { user: u, accessToken, refreshToken } = json.data;
      localStorage.setItem("customer_token", accessToken);
      if (refreshToken) localStorage.setItem("customer_refresh", refreshToken);
      localStorage.setItem("customer_user", JSON.stringify(u));
      setToken(accessToken);
      setUser(u);
      setShowLoginModal(false);

      const pending = pendingActionRef.current;
      pendingActionRef.current = null;
      if (pending) {
        setTimeout(() => pending(), 50);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_refresh");
    localStorage.removeItem("customer_user");
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: { name?: string }) => {
      if (!user) return;
      const next = { ...user, ...data };
      setUser(next);
      localStorage.setItem("customer_user", JSON.stringify(next));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!user && !!token,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
        requireAuth,
        sendOtp,
        verifyOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}