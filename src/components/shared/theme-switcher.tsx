import { useUIStore } from "@/store/ui";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center rounded-md p-1.5 hover:bg-muted"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}