import { create } from "zustand";
import { type IUser } from "../../types/user.types";

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: IUser | null;
  accessToken: string | null;
  setIsAuthenticated: (val: boolean) => void;
  setIsInitializing: (val: boolean) => void;
  setUser: (user: IUser | null) => void;
  setAccessToken: (token: string | null) => void;
  logoutLocal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitializing: true,
  user: null,
  accessToken: null,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  setIsInitializing: (val) => set({ isInitializing: val }),
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  logoutLocal: () =>
    set({ isAuthenticated: false, user: null, accessToken: null }),
}));
