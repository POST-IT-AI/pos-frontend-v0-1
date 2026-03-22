import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock the useLogin hook
const mockMutate = vi.fn();
vi.mock("@/hooks/use-auth", () => ({
  useLogin: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Import after mocks
import { Component as LoginPage } from "./index";

describe("LoginPage", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("renders username and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("ชื่อผู้ใช้")).toBeInTheDocument();
    expect(screen.getByLabelText("รหัสผ่าน")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("button", { name: "เข้าสู่ระบบ" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "เข้าสู่ระบบ" }));

    expect(
      await screen.findByText("ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls login mutate with valid data", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("ชื่อผู้ใช้"), "testuser");
    await user.type(screen.getByLabelText("รหัสผ่าน"), "12345678");
    await user.click(screen.getByRole("button", { name: "เข้าสู่ระบบ" }));

    expect(mockMutate).toHaveBeenCalledWith({
      username: "testuser",
      password: "12345678",
    });
  });

  it("shows validation error for short username", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("ชื่อผู้ใช้"), "ab");
    await user.type(screen.getByLabelText("รหัสผ่าน"), "12345678");
    await user.click(screen.getByRole("button", { name: "เข้าสู่ระบบ" }));

    expect(
      await screen.findByText("ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("ชื่อผู้ใช้"), "testuser");
    await user.type(screen.getByLabelText("รหัสผ่าน"), "1234567");
    await user.click(screen.getByRole("button", { name: "เข้าสู่ระบบ" }));

    expect(
      await screen.findByText("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    ).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
