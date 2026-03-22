import { Outlet } from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
