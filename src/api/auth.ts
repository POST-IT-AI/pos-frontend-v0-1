import { authAxios } from "./axios";
import type {
  BackendResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  AuthUser,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
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

  forgotPassword: (data: ForgotPasswordRequest) =>
    authAxios
      .post<BackendResponse<ForgotPasswordResponse>>(
        "/api/v1/auth/forgot-password",
        data,
      )
      .then((r) => r.data.data),

  resetPassword: (data: ResetPasswordRequest) =>
    authAxios
      .post<BackendResponse<null>>("/api/v1/auth/reset-password", data)
      .then((r) => r.data),
};
