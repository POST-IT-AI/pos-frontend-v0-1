import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button-variants";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Component() {
  const { t } = useTranslation("products");

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <Link to="/products/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addProduct")}
        </Link>
      </PageHeader>
      <p className="text-muted-foreground">{t("placeholder.table")}</p>
    </div>
  );
}
