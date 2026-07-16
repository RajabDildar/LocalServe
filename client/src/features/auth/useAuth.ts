import { useAuthStore } from "./authStore";

export const useAuth = () => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuthStore();

  // Logic to fetch user or check auth would go here
  return { isAuthenticated, user, isLoading: false, setIsAuthenticated, setUser };
};
