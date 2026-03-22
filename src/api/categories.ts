import { api } from "./axios";
import type { Category } from "@/types";

export const categoriesApi = {
  getAll: () => api.get<Category[]>("/categories").then((r) => r.data),

  getById: (id: string) =>
    api.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (data: Omit<Category, "id" | "createdAt" | "updatedAt">) =>
    api.post<Category>("/categories", data).then((r) => r.data),

  update: (id: string, data: Partial<Category>) =>
    api.patch<Category>(`/categories/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/categories/${id}`),
};
