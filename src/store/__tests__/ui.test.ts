import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/store/ui";

describe("useUIStore - theme", () => {
  beforeEach(() => {
    useUIStore.setState({ theme: "light" });
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light theme", () => {
    expect(useUIStore.getState().theme).toBe("light");
  });

  it("setTheme changes theme to dark", () => {
    useUIStore.getState().setTheme("dark");
    expect(useUIStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("setTheme changes theme to light", () => {
    useUIStore.getState().setTheme("dark");
    useUIStore.getState().setTheme("light");
    expect(useUIStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggleTheme switches from light to dark", () => {
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggleTheme switches from dark to light", () => {
    useUIStore.setState({ theme: "dark" });
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});