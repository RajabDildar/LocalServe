import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { type IUser } from "@/types/user.types";
import PageLoader from "@/components/common/PageLoader";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: IUser["role"][];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
