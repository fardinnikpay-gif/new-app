import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as authApi from "../api/authApi";
import { AUTH_EXPIRED_EVENT } from "../api/axios";
import { AuthContext } from "./authContextValue";
import { ADMIN_ROLE } from "../utils/constants";

const NO_ACCESS_MESSAGE = "This account has no admin access";
const NO_ACCESS_STATUS = 403;
const EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";
const EXPIRED_TOAST_ID = "auth-expired";
const SIGN_OUT_FAILED_MESSAGE = "Could not sign out. Check your connection and try again.";
const UNAUTHORIZED_STATUS = 401;

const isAdmin = (user) => user?.role === ADMIN_ROLE;

// UX gate only. Real security is the backend adminOnly middleware.
export default function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session once on mount.
  useEffect(() => {
    const controller = new AbortController();

    const restoreSession = async () => {
      try {
        const user = await authApi.getMe(controller.signal);

        // A non-admin cookie is treated as signed out.
        // Do not log out the customer's own session.
        if (!controller.signal.aborted && isAdmin(user)) {
          setAdmin(user);
        }
      } catch {
        // Not signed in, or the server is unreachable.
      }

      if (!controller.signal.aborted) {
        setLoading(false);
      }
    };

    restoreSession();
    return () => controller.abort();
  }, []);

  // Any protected request that returns 401 signs the admin out.
  useEffect(() => {
    const handleExpired = () => {
      setAdmin(null);
      toast.error(EXPIRED_MESSAGE, { id: EXPIRED_TOAST_ID });
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, []);

  const login = useCallback(async (identifier, password) => {
    const user = await authApi.login(identifier, password);

    if (!isAdmin(user)) {
      try {
        await authApi.logout();
      } catch {
        // Ignore; backend authorization still protects admin routes.
      }

      const error = new Error(NO_ACCESS_MESSAGE);
      error.status = NO_ACCESS_STATUS;
      throw error;
    }

    setAdmin(user);
    return user;
  }, []);

  // Keep the admin signed in if logout fails due to a network error.
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      if (error.status !== UNAUTHORIZED_STATUS) {
        toast.error(SIGN_OUT_FAILED_MESSAGE);
        return false;
      }
    }

    setAdmin(null);
    return true;
  }, []);

  const value = useMemo(
    () => ({ admin, loading, login, logout }),
    [admin, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
