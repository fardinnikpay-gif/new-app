import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AUTH_EXPIRED_EVENT } from "../api/axios";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

const SESSION_EXPIRED_TOAST_ID = "session-expired";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);
  const initialCheckRef = useRef(null);

  // applyUser(user | null) | single place that changes auth state; it also cancels the initial /auth/me check
  const applyUser = useCallback((nextUser) => {
    initialCheckRef.current?.abort();
    userRef.current = nextUser;
    setUser(nextUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    initialCheckRef.current = controller;

    authApi
      .getMe({ signal: controller.signal })
      .then(({ user: me }) => {
        if (!controller.signal.aborted) applyUser(me);
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.canceled) return;
        applyUser(null); // 401 (guest) or network error: treat as logged out
      });

    return () => controller.abort();
  }, [applyUser]);

  useEffect(() => {
    const handleExpired = () => {
      if (userRef.current) {
        toast.error("Your session has expired. Please log in again.", { id: SESSION_EXPIRED_TOAST_ID });
      }
      applyUser(null);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, [applyUser]);

  const login = useCallback(
    async (identifier, password) => {
      const { user: nextUser } = await authApi.login({ identifier, password });
      applyUser(nextUser);
      return nextUser;
    },
    [applyUser]
  );

  const register = useCallback(
    async (payload) => {
      const { user: nextUser } = await authApi.register(payload);
      applyUser(nextUser);
      return nextUser;
    },
    [applyUser]
  );

  // logout() | the local user is cleared even if the request fails; the error is still thrown to the caller
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      applyUser(null);
    }
  }, [applyUser]);

  const refreshUser = useCallback(async () => {
    try {
      const { user: nextUser } = await authApi.getMe();
      applyUser(nextUser);
      return nextUser;
    } catch (error) {
      if (error.status === 401) {
        applyUser(null);
        return null;
      }
      throw error;
    }
  }, [applyUser]);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}