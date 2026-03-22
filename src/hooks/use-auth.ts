import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/api/auth";
import { usersApi } from "@/api/users";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/api";
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

export function useForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (data, variables) => {
      if (data.reset_token) {
        toast.success(t("toast.forgotPasswordSent"));
        navigate("/reset-password", {
          state: { token: data.reset_token, username: variables.username },
        });
      } else {
        toast.info(t("toast.forgotPasswordNotFound"));
      }
    },
    onError: () => {
      toast.error(t("toast.forgotPasswordError"));
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success(t("toast.resetPasswordSuccess"));
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (error) => {
      let message = t("toast.resetPasswordError");
      if (isAxiosError(error) && error.response?.data) {
        const apiMessage = (
          error.response.data as { message?: string }
        ).message?.toLowerCase();
        if (apiMessage?.includes("invalid reset token")) {
          message = t("toast.tokenInvalid");
        } else if (apiMessage?.includes("reset token has expired")) {
          message = t("toast.tokenExpired");
        } else if (apiMessage?.includes("reset token has already been used")) {
          message = t("toast.tokenUsed");
        }
      }
      toast.error(message);
    },
  });
}
