import { api } from "./axios";
import type { Order } from "@/types";
import type { PaginatedResponse } from "@/types/api";

interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
  discount?: number;
  paymentMethod: Order["paymentMethod"];
  note?: string;
}

export const ordersApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Order>>("/orders", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`).then((r) => r.data),

  create: (data: CreateOrderPayload) =>
    api.post<Order>("/orders", data).then((r) => r.data),

  cancel: (id: string) =>
    api.patch<Order>(`/orders/${id}/cancel`).then((r) => r.data),
};
