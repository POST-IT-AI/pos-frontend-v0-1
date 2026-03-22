import { z } from "zod/v4";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export function useLoginSchema() {
  const { t } = useTranslation("auth");

  return useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(3, t("validation.usernameMin"))
          .max(255, t("validation.usernameMax")),
        password: z.string().min(8, t("validation.passwordMin")),
      }),
    [t],
  );
}

export type LoginFormValues = z.infer<ReturnType<typeof useLoginSchema>>;

export function useRegisterSchema() {
  const { t } = useTranslation("auth");

  return useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(3, t("validation.usernameMin"))
          .max(255, t("validation.usernameMax")),
        password: z.string().min(8, t("validation.passwordMin")),
        first_name: z
          .string()
          .min(1, t("validation.firstNameRequired"))
          .max(255, t("validation.firstNameMax")),
        last_name: z
          .string()
          .max(255, t("validation.lastNameMax"))
          .optional()
          .or(z.literal("")),
      }),
    [t],
  );
}

export type RegisterFormValues = z.infer<ReturnType<typeof useRegisterSchema>>;

export function useForgotPasswordSchema() {
  const { t } = useTranslation("auth");

  return useMemo(
    () =>
      z.object({
        username: z.string().min(1, t("validation.usernameRequired")),
      }),
    [t],
  );
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof useForgotPasswordSchema>
>;

export function useResetPasswordSchema() {
  const { t } = useTranslation("auth");

  return useMemo(
    () =>
      z
        .object({
          token: z.string().min(1, t("validation.tokenRequired")),
          new_password: z.string().min(6, t("validation.passwordMin6")),
          confirmPassword: z.string().min(1, t("validation.passwordMismatch")),
        })
        .refine((data) => data.new_password === data.confirmPassword, {
          message: t("validation.passwordMismatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );
}

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof useResetPasswordSchema>
>;
