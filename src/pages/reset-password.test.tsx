import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock react-router-dom — useLocation returns empty state by default
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
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
import { Component as ResetPasswordPage } from "./reset-password";

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockNavigate.mockClear();
  });

  it("renders all form fields", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText("Reset Token")).toBeInTheDocument();
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

  it("shows validation errors when all fields are empty", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(
      await screen.findByText("กรุณากรอก reset token"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows error when password is too short", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("Reset Token"), "sometoken");
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
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("Reset Token"), "sometoken");
    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "password1");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "password2");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(await screen.findByText("รหัสผ่านไม่ตรงกัน")).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls mutate with token and new_password when form is valid", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("Reset Token"), "abc123token");
    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "newpass123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "newpass123");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({
      token: "abc123token",
      new_password: "newpass123",
    });
  });

  it("accepts password at boundary (6 chars)", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordPage />);

    await user.type(screen.getByLabelText("Reset Token"), "sometoken");
    await user.type(screen.getByLabelText("รหัสผ่านใหม่"), "abc123");
    await user.type(screen.getByLabelText("ยืนยันรหัสผ่านใหม่"), "abc123");
    await user.click(screen.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }));

    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith({
      token: "sometoken",
      new_password: "abc123",
    });
  });
});
