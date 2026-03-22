import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock react-router-dom — useLocation is a fn so state can be changed per test
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
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

// Mock useResetPassword hook
const mockMutate = vi.fn();
vi.mock("@/hooks/use-auth", () => ({
  useResetPassword: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Import after mocks
import { Component as ResetPasswordPage } from "./index";

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockNavigate.mockClear();
    mockUseLocation.mockReturnValue({ state: null });
  });

  // ── Field rendering ──────────────────────────────────────────────────────────

  it("renders username field", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText("ชื่อผู้ใช้")).toBeInTheDocument();
  });

  it("username field is disabled", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText("ชื่อผู้ใช้")).toBeDisabled();
  });

  it("does not render a visible Reset Token field", () => {
    render(<ResetPasswordPage />);
    expect(screen.queryByLabelText("Reset Token")).not.toBeInTheDocument();
  });

  it("renders new password and confirm password fields", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText("รหัสผ่านใหม่")).toBeInTheDocument();
    expect(screen.getByLabelText("ยืนยันรหัสผ่านใหม่")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ResetPasswordPage />);
    expect(
      screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }),
    ).toBeInTheDocument();
  });

  it("renders back to login link pointing to /login", () => {
    render(<ResetPasswordPage />);
    const link = screen.getByRole("link", { name: "กลับไปหน้าเข้าสู่ระบบ" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  // ── Auto-fill from location.state ────────────────────────────────────────────

  it("pre-fills username from location.state", () => {
    mockUseLocation.mockReturnValue({
      state: { token: "tok123", username: "johndoe" },
    });
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText("ชื่อผู้ใช้")).toHaveValue("johndoe");
  });

  it("shows empty username when location.state has no username", () => {
    mockUseLocation.mockReturnValue({ state: null });
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText("ชื่อผู้ใช้")).toHaveValue("");
  });

  // ── Validation ───────────────────────────────────────────────────────────────

  it("shows validation error when new password is empty", async () => {
    const user = userEvent.setup();
    mockUseLocation.mockReturnValue({
      state: { token: "tok123", username: "johndoe" },
    });
    render(<ResetPasswordPage />);

    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(
      await screen.findByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows error when password is too short", async () => {
    const user = userEvent.setup();
    mockUseLocation.mockReturnValue({
      state: { token: "tok123", username: "johndoe" },
    });
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "12345");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "12345");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(
      await screen.findByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    mockUseLocation.mockReturnValue({
      state: { token: "tok123", username: "johndoe" },
    });
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "password1");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "password2");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(await screen.findByText("รหัสผ่านไม่ตรงกัน")).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  // ── Submission ───────────────────────────────────────────────────────────────

  it("submits with token from location.state", async () => {
    const user = userEvent.setup();
    mockUseLocation.mockReturnValue({
      state: { token: "tok-from-state", username: "johndoe" },
    });
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "newpass123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "newpass123");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({
      token: "tok-from-state",
      new_password: "newpass123",
    });
  });

  it("accepts password at boundary length (6 chars)", async () => {
    const user = userEvent.setup();
    mockUseLocation.mockReturnValue({
      state: { token: "sometoken", username: "user1" },
    });
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "abc123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "abc123");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({
      token: "sometoken",
      new_password: "abc123",
    });
  });

  it("does not call mutate when token is missing from state", async () => {
    const user = userEvent.setup();
    mockUseLocation.mockReturnValue({ state: null });
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "newpass123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "newpass123");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(mockMutate).not.toHaveBeenCalled();
  });
});
