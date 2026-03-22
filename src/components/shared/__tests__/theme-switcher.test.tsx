import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { useUIStore } from "@/store/ui";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    useUIStore.setState({ theme: "light" });
    document.documentElement.classList.remove("dark");
  });

  it("renders a toggle button", () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows Sun icon when theme is light", () => {
    render(<ThemeSwitcher />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveClass("lucide-sun");
  });

  it("shows Moon icon when theme is dark", () => {
    useUIStore.setState({ theme: "dark" });
    render(<ThemeSwitcher />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveClass("lucide-moon");
  });

  it("toggles theme on click", async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    await user.click(screen.getByRole("button"));
    expect(useUIStore.getState().theme).toBe("dark");

    await user.click(screen.getByRole("button"));
    expect(useUIStore.getState().theme).toBe("light");
  });
});
