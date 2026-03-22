import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth";

const mockUser = {
  id: 1,
  username: "testuser",
  first_name: "Test",
  last_name: "User",
  role: "admin",
  is_active: true,
} as const;

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it("starts unauthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated()).toBe(false);
  });

  it("setAuth stores user and tokens", () => {
    useAuthStore.getState().setAuth(mockUser, "access-123", "refresh-456");
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe("access-123");
    expect(state.refreshToken).toBe("refresh-456");
    expect(state.isAuthenticated()).toBe(true);
  });

  it("setTokens updates only tokens", () => {
    useAuthStore.getState().setAuth(mockUser, "old-access", "old-refresh");
    useAuthStore.getState().setTokens("new-access", "new-refresh");
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe("new-access");
    expect(state.refreshToken).toBe("new-refresh");
  });

  it("logout clears everything", () => {
    useAuthStore.getState().setAuth(mockUser, "access", "refresh");
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated()).toBe(false);
  });

  it("hasRole matches case-insensitively", () => {
    useAuthStore.getState().setAuth(mockUser, "access", "refresh");
    expect(useAuthStore.getState().hasRole(["ADMIN"])).toBe(true);
    expect(useAuthStore.getState().hasRole(["CASHIER"])).toBe(false);
    expect(useAuthStore.getState().hasRole(["ADMIN", "CASHIER"])).toBe(true);
  });

  it("hasRole returns false when no user", () => {
    expect(useAuthStore.getState().hasRole(["ADMIN"])).toBe(false);
  });
});
