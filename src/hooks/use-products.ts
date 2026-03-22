import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProducts(filters?: {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: productKeys.list(filters ?? {}),
    queryFn: () => productsApi.getAll(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("products");
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success(t("toast.createSuccess"));
    },
    onError: () => {
      toast.error(t("toast.createError"));
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("products");
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof productsApi.update>[1] }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(t("toast.updateSuccess"));
    },
    onError: () => {
      toast.error(t("toast.updateError"));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("products");
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success(t("toast.deleteSuccess"));
    },
    onError: () => {
      toast.error(t("toast.deleteError"));
    },
  });
}
