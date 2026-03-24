import { LogOut, Menu, User } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useLogout } from "@/hooks/use-auth";
import { useUIStore } from "@/store/ui";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

export function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();
  const { toggleSidebarOpen } = useUIStore();
  const { t } = useTranslation("common");

  const displayName = user
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : "";

  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Mobile: hamburger to open sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebarOpen}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{displayName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.username}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              {t("header.profile")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
