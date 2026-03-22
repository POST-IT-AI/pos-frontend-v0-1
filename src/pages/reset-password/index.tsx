import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useResetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";
import { useResetPassword } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Component() {
  const resetPassword = useResetPassword();
  const { t } = useTranslation("auth");
  const schema = useResetPasswordSchema();
  const location = useLocation();
  const state = location.state as { token?: string; username?: string } | null;
  const tokenFromState = state?.token ?? "";
  const usernameFromState = state?.username ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { token: tokenFromState },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword.mutate({ token: data.token, new_password: data.new_password });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("resetPassword.title")}</CardTitle>
        <CardDescription>{t("resetPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />

          <div className="space-y-2">
            <Label htmlFor="username">{t("resetPassword.username")}</Label>
            <Input
              id="username"
              type="text"
              value={usernameFromState}
              disabled
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">{t("resetPassword.newPassword")}</Label>
            <PasswordInput
              id="new_password"
              placeholder={t("resetPassword.newPassword")}
              autoComplete="new-password"
              {...register("new_password")}
            />
            {errors.new_password && (
              <p className="text-sm text-destructive">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("resetPassword.confirmPassword")}
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder={t("resetPassword.confirmPassword")}
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("resetPassword.submit")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">
            {t("resetPassword.backToLogin")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
