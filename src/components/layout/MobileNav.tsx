import { Calendar, ChefHat, ShoppingCart, Package } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Plan", url: "/", icon: Calendar },
  { title: "Recetas", url: "/recipes", icon: ChefHat },
  { title: "Lista", url: "/shopping", icon: ShoppingCart },
  { title: "Despensa", url: "/pantry", icon: Package },
];

export function MobileNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around py-2">
        {mainItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive: linkIsActive }) =>
              cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                linkIsActive || isActive(item.url)
                  ? "text-primary bg-primary-light"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
            aria-label={item.title}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}