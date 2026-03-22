import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/lib/env";
import { useAuthStore } from "@/store/auth";

// ──── Instances ────

/** General API instance (user-service / other services) */
export const api = axios.create({
  baseURL: env.API_BASE_URL || env.USER_SERVICE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/** Auth-service instance (login, me, refresh) */
export const authAxios = axios.create({
  baseURL: env.AUTH_SERVICE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ──── Request interceptors: attach Bearer token ────

function attachToken(config: InternalAxiosRequestConfig) {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

api.interceptors.request.use(attachToken, (e) => Promise.reject(e));
authAxios.interceptors.request.use(attachToken, (e) => Promise.reject(e));

// ──── Token refresh logic (only on `api` instance) ────

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  // Reuse in-flight refresh to avoid parallel refresh calls
  if (!refreshPromise) {
    refreshPromise = authAxios
      .post<{ status: string; data: { access_token: string; refresh_token: string } }>(
        "/api/v1/auth/refresh",
        { refresh_token: refreshToken },
      )
      .then((res) => {
        const { access_token, refresh_token } = res.data.data;
        useAuthStore.getState().setTokens(access_token, refresh_token);
        return access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

// authAxios: simple 401 handler — no auto-refresh (prevents infinite loop)
authAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
);
