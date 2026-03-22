import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/api/orders";
import { toast } from "sonner";

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
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success("สร้างออเดอร์สำเร็จ");
    },
    onError: () => {
      toast.error("ไม่สามารถสร้างออเดอร์ได้");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("ยกเลิกออเดอร์สำเร็จ");
    },
    onError: () => {
      toast.error("ไม่สามารถยกเลิกออเดอร์ได้");
    },
  });
}
