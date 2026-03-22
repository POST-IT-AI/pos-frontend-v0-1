import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation("pos");

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-muted-foreground">
            {t("placeholder.productList")}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">
            {t("placeholder.cart")}
          </p>
        </div>
      </div>
    </div>
  );
}
