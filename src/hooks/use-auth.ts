import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/api/auth";
import { usersApi } from "@/api/users";
import type { LoginRequest, RegisterRequest } from "@/types/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const tokens = await authApi.login(data);

      useAuthStore
        .getState()
        .setTokens(tokens.access_token, tokens.refresh_token);

      const user = await authApi.me();

      return { user, tokens };
    },
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens.access_token, tokens.refresh_token);
      toast.success(t("toast.loginSuccess"));
      navigate("/dashboard");
    },
    onError: (error) => {
      useAuthStore.getState().logout();

      let message = t("toast.loginError");
      if (isAxiosError(error) && error.response?.status === 401) {
        message = t("toast.invalidCredentials");
      }
      toast.error(message);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return useMutation({
    mutationFn: (data: RegisterRequest) => usersApi.register(data),
    onSuccess: () => {
      toast.success(t("toast.registerSuccess"));
      navigate("/login");
    },
    onError: (error) => {
      let message = t("toast.registerError");
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          message = t("toast.usernameTaken");
        } else if (error.response?.status === 400) {
          message = t("toast.invalidData");
        }
      }
      toast.error(message);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return () => {
    logout();
    navigate("/login");
    toast.success(t("toast.logoutSuccess"));
  };
}
