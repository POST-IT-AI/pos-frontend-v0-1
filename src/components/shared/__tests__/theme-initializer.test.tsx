import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { ThemeInitializer } from "@/components/shared/theme-initializer";
import { useUIStore } from "@/store/ui";

describe("ThemeInitializer", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("applies dark class when theme is dark", () => {
    useUIStore.setState({ theme: "dark" });
    render(<ThemeInitializer />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("does not apply dark class when theme is light", () => {
    useUIStore.setState({ theme: "light" });
    render(<ThemeInitializer />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("renders nothing", () => {
    useUIStore.setState({ theme: "light" });
    const { container } = render(<ThemeInitializer />);
    expect(container.innerHTML).toBe("");
  });
});