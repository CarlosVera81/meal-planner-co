import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4 md:inline-flex hidden" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Menú Familiar</h1>
              <span className="text-sm text-muted-foreground hidden sm:inline">• Planificación de comidas</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </SidebarProvider>
  );
}