import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

// Mock auth API
vi.mock("@/api/auth", () => ({
  authApi: {
    forgotPassword: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock auth store
const mockStoreLogout = vi.fn();
vi.mock("@/store/auth", () => ({
  useAuthStore: (selector: (s: { logout: () => void }) => unknown) =>
    selector({ logout: mockStoreLogout }),
}));

// Import after mocks
import { useForgotPassword, useLogout } from "@/hooks/use-auth";
import { authApi } from "@/api/auth";
import { toast } from "sonner";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useForgotPassword", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(authApi.forgotPassword).mockClear();
  });

  it("navigates to /reset-password with token and username on success", async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue({
      message: "ok",
      reset_token: "tok-abc123",
    });

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ username: "johndoe" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockNavigate).toHaveBeenCalledWith("/reset-password", {
      state: { token: "tok-abc123", username: "johndoe" },
    });
  });

  it("does not navigate when reset_token is absent in response", async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue({
      message: "username not found",
    });

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ username: "unknown" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe("useLogout", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockStoreLogout.mockClear();
    vi.mocked(authApi.logout).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it("calls logout API and clears local state on success", async () => {
    vi.mocked(authApi.logout).mockResolvedValue({
      status: "success",
      message: "Logged out successfully",
      data: null,
    });

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(authApi.logout).toHaveBeenCalledTimes(1);
    expect(mockStoreLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(toast.success).toHaveBeenCalled();
  });

  it("clears local state even when API call fails", async () => {
    vi.mocked(authApi.logout).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockStoreLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to /login after logout", async () => {
    vi.mocked(authApi.logout).mockResolvedValue({
      status: "success",
      message: "Logged out successfully",
      data: null,
    });

    const { result } = renderHook(() => useLogout(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
