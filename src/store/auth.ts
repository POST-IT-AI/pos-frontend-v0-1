import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/api";

type Role = "ADMIN" | "MANAGER" | "CASHIER";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
      isAuthenticated: () => get().accessToken !== null,
      hasRole: (roles) => {
        const user = get().user;
        if (!user) return false;
        const upperRole = user.role.toUpperCase() as Role;
        return roles.includes(upperRole);
      },
    }),
    {
      name: "pos-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
