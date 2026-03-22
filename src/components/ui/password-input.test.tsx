import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./password-input";

describe("PasswordInput", () => {
  it("renders as password type by default", () => {
    render(<PasswordInput placeholder="รหัสผ่าน" />);
    expect(screen.getByPlaceholderText("รหัสผ่าน")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("renders toggle button with aria-label ซ่อนรหัสผ่าน/แสดงรหัสผ่าน", () => {
    render(<PasswordInput />);
    expect(
      screen.getByRole("button", { name: "แสดงรหัสผ่าน" }),
    ).toBeInTheDocument();
  });

  it("toggles to text type when toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="รหัสผ่าน" />);

    const input = screen.getByPlaceholderText("รหัสผ่าน");
    const toggleBtn = screen.getByRole("button", { name: "แสดงรหัสผ่าน" });

    await user.click(toggleBtn);

    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "ซ่อนรหัสผ่าน" }),
    ).toBeInTheDocument();
  });

  it("toggles back to password type on second click", async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="รหัสผ่าน" />);

    const input = screen.getByPlaceholderText("รหัสผ่าน");
    const toggleBtn = screen.getByRole("button", { name: "แสดงรหัสผ่าน" });

    await user.click(toggleBtn);
    await user.click(screen.getByRole("button", { name: "ซ่อนรหัสผ่าน" }));

    expect(input).toHaveAttribute("type", "password");
  });

  it("forwards additional props to the input", () => {
    render(<PasswordInput placeholder="รหัสผ่าน" id="pw" autoComplete="current-password" />);
    const input = screen.getByPlaceholderText("รหัสผ่าน");
    expect(input).toHaveAttribute("id", "pw");
    expect(input).toHaveAttribute("autocomplete", "current-password");
  });

  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<PasswordInput placeholder="รหัสผ่าน" />);

    const input = screen.getByPlaceholderText("รหัสผ่าน");
    await user.type(input, "secret123");

    expect(input).toHaveValue("secret123");
  });
});
