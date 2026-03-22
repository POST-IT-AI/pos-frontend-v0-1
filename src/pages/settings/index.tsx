import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "react-i18next";
import { useUIStore } from "@/store/ui";
import { Moon, Sun } from "lucide-react";

export function Component() {
  const { t } = useTranslation("settings");
  const { theme, setTheme } = useUIStore();

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />

      <div className="mt-6">
        <h3 className="text-lg font-medium">{t("theme.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("theme.description")}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors ${
              theme === "light"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Sun className="h-8 w-8" />
            <div className="text-center">
              <p className="text-sm font-medium">{t("theme.light")}</p>
              <p className="text-xs text-muted-foreground">
                {t("theme.lightDescription")}
              </p>
            </div>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors ${
              theme === "dark"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Moon className="h-8 w-8" />
            <div className="text-center">
              <p className="text-sm font-medium">{t("theme.dark")}</p>
              <p className="text-xs text-muted-foreground">
                {t("theme.darkDescription")}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
