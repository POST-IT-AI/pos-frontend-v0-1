import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const navItems = [
  { labelKey: "nav.dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { labelKey: "nav.pos", icon: ShoppingCart, href: "/pos" },
  { labelKey: "nav.products", icon: Package, href: "/products" },
  { labelKey: "nav.orders", icon: ClipboardList, href: "/orders" },
];

const adminItems = [
  { labelKey: "nav.users", icon: Users, href: "/users" },
  { labelKey: "nav.settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, sidebarOpen, setSidebarOpen } =
    useUIStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role.toUpperCase() === "ADMIN";
  const { t } = useTranslation("common");

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <aside
      className={cn(
        // Base: fixed overlay for mobile, slides in/out
        "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        // Mobile: hide off-screen unless sidebarOpen
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        // md+: always visible, icon-only (w-16), relative positioning
        "md:relative md:translate-x-0 md:w-16",
        // lg+: full or collapsed based on user preference
        sidebarCollapsed ? "lg:w-16" : "lg:w-64",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {/* Title: visible on mobile and lg+ when not collapsed */}
        <span
          className={cn(
            "truncate text-lg font-semibold md:hidden",
            !sidebarCollapsed && "lg:inline",
          )}
        >
          {t("system.title")}
        </span>

        {/* Mobile: close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="ml-auto h-8 w-8 md:hidden"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Desktop: collapse toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto hidden h-8 w-8 lg:flex"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {allItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const label = t(item.labelKey);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                // Tablet: center icon
                "md:justify-center md:px-2",
                // Desktop not collapsed: restore left alignment
                !sidebarCollapsed && "lg:justify-start lg:px-3",
              )}
              title={label}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {/* Mobile: always show label; tablet: hide; desktop: show when not collapsed */}
              <span
                className={cn(
                  "truncate md:hidden",
                  !sidebarCollapsed && "lg:inline",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
