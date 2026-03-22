import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation("settings");

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <p className="text-muted-foreground">{t("placeholder.content")}</p>
    </div>
  );
}
