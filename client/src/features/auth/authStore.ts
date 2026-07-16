import { create } from "zustand";
import { type IUser } from "../../types/user.types";

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  setIsAuthenticated: (val: boolean) => void;
  setUser: (user: IUser | null) => void;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
}));
