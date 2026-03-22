import { api } from "./axios";
import type { BackendResponse, RegisterRequest, AuthUser } from "@/types/api";

export const usersApi = {
  register: (data: RegisterRequest) =>
    api
      .post<BackendResponse<AuthUser>>("/api/v1/users/register", data)
      .then((r) => r.data.data),
};
