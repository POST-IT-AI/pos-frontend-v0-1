import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ProtectedRoute } from "./protected-route";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", lazy: () => import("@/pages/login") },
      { path: "/register", lazy: () => import("@/pages/register") },
      {
        path: "/forgot-password",
        lazy: () => import("@/pages/forgot-password"),
      },
      {
        path: "/reset-password",
        lazy: () => import("@/pages/reset-password"),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, lazy: () => import("@/pages/dashboard") },
      { path: "dashboard", lazy: () => import("@/pages/dashboard") },
      { path: "pos", lazy: () => import("@/pages/pos") },
      { path: "products", lazy: () => import("@/pages/products/index") },
      { path: "products/new", lazy: () => import("@/pages/products/new") },
      { path: "orders", lazy: () => import("@/pages/orders/index") },
      {
        element: <ProtectedRoute requiredRoles={["ADMIN"]} />,
        children: [
          { path: "users", lazy: () => import("@/pages/users/index") },
          { path: "settings", lazy: () => import("@/pages/settings") },
        ],
      },
    ],
  },
  { path: "*", lazy: () => import("@/pages/not-found") },
]);
