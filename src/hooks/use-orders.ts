import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/api/orders";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrders(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: orderKeys.list(filters ?? {}),
    queryFn: () => ordersApi.getAll(filters),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("orders");
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success(t("toast.createSuccess"));
    },
    onError: () => {
      toast.error(t("toast.createError"));
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("orders");
  return useMutation({
    mutationFn: ordersApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success(t("toast.cancelSuccess"));
    },
    onError: () => {
      toast.error(t("toast.cancelError"));
    },
  });
}
