import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";

interface UIState {
  sidebarCollapsed: boolean;
  language: "th" | "en";
  toggleSidebar: () => void;
  setLanguage: (lang: "th" | "en") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      language: "th",
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    { name: "pos-ui" },
  ),
);
