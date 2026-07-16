import { create } from "zustand";
import { type IUser } from "../../types/user.types";

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  setIsAuthenticated: (val: boolean) => void;
  setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  setUser: (user) => set({ user }),
}));
