import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">{t("notFound.title")}</h1>
      <p className="text-lg text-muted-foreground">{t("notFound.description")}</p>
      <Link to="/dashboard" className={buttonVariants()}>
        {t("actions.backToHome")}
      </Link>
    </div>
  );
}
