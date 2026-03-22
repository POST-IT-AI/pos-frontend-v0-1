import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/use-auth";
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
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Component() {
  const login = useLogin();
  const { t } = useTranslation("auth");
  const loginSchema = useLoginSchema();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t("login.username")}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t("login.username")}
              autoComplete="username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("login.password")}</Label>
            <PasswordInput
              id="password"
              placeholder={t("login.password")}
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("login.submit")}
          </Button>
        </form>
        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p>
            {t("login.noAccount")}{" "}
            <Link to="/register" className="text-primary hover:underline">
              {t("login.register")}
            </Link>
          </p>
          <Link to="/forgot-password" className="text-primary hover:underline">
            {t("login.forgotPassword")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
