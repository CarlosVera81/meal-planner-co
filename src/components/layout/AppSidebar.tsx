import { NavLink, useLocation } from "react-router-dom";
import { Calendar, ChefHat, ShoppingCart, Package, Settings, Share2, BarChart3 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Plan", url: "/", icon: Calendar },
  { title: "Recetas", url: "/recipes", icon: ChefHat },
  { title: "Lista de Compras", url: "/shopping", icon: ShoppingCart },
  { title: "Despensa", url: "/pantry", icon: Package },
];

const secondaryItems = [
  { title: "Preferencias", url: "/preferences", icon: Settings },
  { title: "Compartir", url: "/share", icon: Share2 },
  { title: "Reportes", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground font-medium"
        : "text-foreground hover:bg-muted"
    }`;

  return (
    <Sidebar
      className={`transition-[width] duration-300 ease-in-out ${collapsed ? "w-14" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarContent className={cn("transition-[gap] duration-300", collapsed && "!gap-1")}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            {!collapsed && (
              <div>
                <h1 className="font-semibold text-lg">Menú Familiar</h1>
                <p className="text-sm text-muted-foreground">
                  Planifica y organiza
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Principal */}
        <SidebarGroup
          className={cn("transition-[padding] duration-300", collapsed && "!px-1 !pt-1 !pb-1")}
        >
          {!collapsed && <SidebarGroupLabel>Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    aria-label={item.title}
                    className={getNavCls}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Herramientas */}
        <SidebarGroup
          className={cn("transition-[padding] duration-300", collapsed && "!px-1 !pt-0 !pb-1")}
        >
          {!collapsed && <SidebarGroupLabel>Herramientas</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end aria-label={item.title} className={getNavCls}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
