import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "./authStore";
import {
  authApi,
  type ILoginInput,
  type IRegisterInput,
} from "@/services/auth.api.ts";

export const useAuth = () => {
  const {
    isAuthenticated,
    isInitializing,
    user,
    setIsAuthenticated,
    setUser,
    setAccessToken,
    logoutLocal,
  } = useAuthStore();

  const login = useCallback(
    async (credentials: ILoginInput) => {
      const res = await authApi.login(credentials);
      setAccessToken(res.data.accessToken);
      // login response only carries {id, name, role} — fetch the full record
      const me = await authApi.getMe();
      setUser(me.data);
      setIsAuthenticated(true);
      return me.data;
    },
    [setAccessToken, setUser, setIsAuthenticated],
  );

  const register = useCallback(async (data: IRegisterInput) => {
    return authApi.register(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      logoutLocal();
    }
  }, [logoutLocal]);

  return {
    isAuthenticated,
    isLoading: isInitializing,
    user,
    login,
    register,
    logout,
    setIsAuthenticated,
    setUser,
  };
};

// Call once at the app root. Restores a session from the httpOnly refresh
// cookie on page load, since the access token only lives in memory and is
// lost on every hard refresh.
export const useAuthInit = () => {
  const ran = useRef(false);
  const { setAccessToken, setUser, setIsAuthenticated, setIsInitializing } =
    useAuthStore();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const refreshed = await authApi.refreshToken();
        setAccessToken(refreshed.data.accessToken);
        const me = await authApi.getMe();
        setUser(me.data);
        setIsAuthenticated(true);
      } catch {
        // No valid refresh cookie — just means logged out, not an error.
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, [setAccessToken, setUser, setIsAuthenticated, setIsInitializing]);
};
