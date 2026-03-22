import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: Array<"ADMIN" | "MANAGER" | "CASHIER">;
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, accessToken } = useAuthStore();

  if (!accessToken) return <Navigate to="/login" replace />;

  const upperRole = user?.role.toUpperCase() as "ADMIN" | "MANAGER" | "CASHIER";
  if (requiredRoles && user && !requiredRoles.includes(upperRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ?? <Outlet />;
}
