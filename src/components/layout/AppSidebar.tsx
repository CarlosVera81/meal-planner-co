import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  ChefHat,
  ShoppingCart,
  Package,
  Settings,
  Share2,
  BarChart3,
  ChevronDown,
} from "lucide-react";

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

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

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
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
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
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
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

        {/* Herramientas (colapsable) */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium hover:bg-muted rounded-md">
              <span>Herramientas</span>
              <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>

            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryItems.map((item) => (
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
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
