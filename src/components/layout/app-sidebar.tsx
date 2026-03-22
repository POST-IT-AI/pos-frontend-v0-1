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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "แดชบอร์ด", icon: LayoutDashboard, href: "/dashboard" },
  { label: "ขายสินค้า", icon: ShoppingCart, href: "/pos" },
  { label: "สินค้า", icon: Package, href: "/products" },
  { label: "ออเดอร์", icon: ClipboardList, href: "/orders" },
];

const adminItems = [
  { label: "ผู้ใช้", icon: Users, href: "/users" },
  { label: "ตั้งค่า", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role.toUpperCase() === "ADMIN";

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <span className="text-lg font-semibold">POS System</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto h-8 w-8"
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
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                sidebarCollapsed && "justify-center px-2",
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
