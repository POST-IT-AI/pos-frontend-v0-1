import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

// Mock useForgotPassword hook
const mockMutate = vi.fn();
vi.mock("@/hooks/use-auth", () => ({
  useForgotPassword: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Import after mocks
import { Component as ForgotPasswordPage } from "./forgot-password";

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("renders username field", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByLabelText("ชื่อผู้ใช้")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ForgotPasswordPage />);
    expect(
      screen.getByRole("button", { name: "ขอรีเซ็ตรหัสผ่าน" }),
    ).toBeInTheDocument();
  });

  it("renders back to login link pointing to /login", () => {
    render(<ForgotPasswordPage />);
    const link = screen.getByRole("link", { name: "กลับไปหน้าเข้าสู่ระบบ" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("shows validation error when username is empty and form is submitted", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.click(screen.getByRole("button", { name: "ขอรีเซ็ตรหัสผ่าน" }));

    expect(
      await screen.findByText("กรุณากรอกชื่อผู้ใช้"),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls mutate with username when form is valid", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("ชื่อผู้ใช้"), "testuser");
    await user.click(screen.getByRole("button", { name: "ขอรีเซ็ตรหัสผ่าน" }));

    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({ username: "testuser" });
  });

  it("renders page title and description", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText("ลืมรหัสผ่าน")).toBeInTheDocument();
    expect(
      screen.getByText("กรอกชื่อผู้ใช้เพื่อรับ reset token"),
    ).toBeInTheDocument();
  });
});
