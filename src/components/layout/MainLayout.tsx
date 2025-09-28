import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hidden md:inline-flex" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Menú Familiar</h1>
                <span className="hidden text-sm text-muted-foreground sm:inline">• Planificación de comidas</span>
              </div>
            </div>
            <ModeToggle />
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