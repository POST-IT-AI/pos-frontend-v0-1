import { api } from "./axios";
import type { User } from "@/types";
import type { PaginatedResponse } from "@/types/api";

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<User>>("/users", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`).then((r) => r.data),

  create: (data: Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string }) =>
    api.post<User>("/users", data).then((r) => r.data),

  update: (id: string, data: Partial<User>) =>
    api.patch<User>(`/users/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/users/${id}`),
};
