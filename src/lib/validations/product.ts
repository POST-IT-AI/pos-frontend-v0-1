import { z } from "zod/v4";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export function useProductSchema() {
  const { t } = useTranslation("products");

  return useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.nameRequired")),
        description: z.string().optional(),
        price: z.number().min(0, t("validation.priceMin")),
        cost: z.number().min(0, t("validation.costMin")),
        sku: z.string().min(1, t("validation.skuRequired")),
        barcode: z.string().optional(),
        categoryId: z.string().min(1, t("validation.categoryRequired")),
        stock: z.number().int().min(0, t("validation.stockMin")),
        isActive: z.boolean(),
      }),
    [t],
  );
}

export type ProductFormValues = z.infer<ReturnType<typeof useProductSchema>>;
