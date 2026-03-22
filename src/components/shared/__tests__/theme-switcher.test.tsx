import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { useUIStore } from "@/store/ui";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    useUIStore.setState({ theme: "light" });
    document.documentElement.classList.remove("dark");
  });

  it("renders the toggle button", () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders Sun icon when theme is light", () => {
    render(<ThemeSwitcher />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveClass("lucide-sun");
  });

  it("renders Moon icon when theme is dark", () => {
    useUIStore.setState({ theme: "dark" });
    render(<ThemeSwitcher />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveClass("lucide-moon");
  });
});