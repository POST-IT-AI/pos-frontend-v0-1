import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/api/auth";
import { usersApi } from "@/api/users";
import type { LoginRequest, RegisterRequest } from "@/types/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      // 1. Login to get tokens
      const tokens = await authApi.login(data);

      // 2. Store tokens temporarily so /me can use the access_token
      useAuthStore
        .getState()
        .setTokens(tokens.access_token, tokens.refresh_token);

      // 3. Fetch user profile
      const user = await authApi.me();

      return { user, tokens };
    },
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens.access_token, tokens.refresh_token);
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/dashboard");
    },
    onError: (error) => {
      // Clear any partially-stored tokens
      useAuthStore.getState().logout();

      let message = "เกิดข้อผิดพลาด กรุณาลองใหม่";
      if (isAxiosError(error) && error.response?.status === 401) {
        message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      }
      toast.error(message);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => usersApi.register(data),
    onSuccess: () => {
      toast.success("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
      navigate("/login");
    },
    onError: (error) => {
      let message = "เกิดข้อผิดพลาด กรุณาลองใหม่";
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          message = "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว";
        } else if (error.response?.status === 400) {
          message = "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
        }
      }
      toast.error(message);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate("/login");
    toast.success("ออกจากระบบแล้ว");
  };
}
