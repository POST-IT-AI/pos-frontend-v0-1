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
  },
}));

// Import after mocks
import { useForgotPassword } from "@/hooks/use-auth";
import { authApi } from "@/api/auth";

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
