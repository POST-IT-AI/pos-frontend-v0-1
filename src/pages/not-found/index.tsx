import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-4xl font-bold sm:text-6xl">{t("notFound.title")}</h1>
      <p className="text-base text-muted-foreground sm:text-lg">{t("notFound.description")}</p>
      <Link to="/dashboard" className={buttonVariants()}>
        {t("actions.backToHome")}
      </Link>
    </div>
  );
}
