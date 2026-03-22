import { useEffect } from "react";
import { useUIStore } from "@/store/ui";

export function ThemeInitializer() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}