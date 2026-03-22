import { api } from "./axios";
import type { Product } from "@/types";
import type { PaginatedResponse } from "@/types/api";

export const productsApi = {
  getAll: (params?: { categoryId?: string; search?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Product>>("/products", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (data: Omit<Product, "id" | "createdAt" | "updatedAt" | "category">) =>
    api.post<Product>("/products", data).then((r) => r.data),

  update: (id: string, data: Partial<Product>) =>
    api.patch<Product>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/products/${id}`),
};
