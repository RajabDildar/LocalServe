import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import PageLoader from "@/components/common/PageLoader";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};
