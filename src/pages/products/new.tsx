import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation("products");

  return (
    <div>
      <PageHeader title={t("newProduct.title")} description={t("newProduct.description")} />
      <p className="text-muted-foreground">{t("placeholder.form")}</p>
    </div>
  );
}
