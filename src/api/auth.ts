import { authAxios } from "./axios";
import type {
  BackendResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  AuthUser,
} from "@/types/api";

export const authApi = {
  login: (data: LoginRequest) =>
    authAxios
      .post<BackendResponse<LoginResponse>>("/api/v1/auth/login", data)
      .then((r) => r.data.data),

  me: () =>
    authAxios
      .get<BackendResponse<AuthUser>>("/api/v1/auth/me")
      .then((r) => r.data.data),

  refresh: (data: RefreshRequest) =>
    authAxios
      .post<BackendResponse<LoginResponse>>("/api/v1/auth/refresh", data)
      .then((r) => r.data.data),
};
