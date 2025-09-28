import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    const isDark = (resolvedTheme ?? "light") === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9"
      aria-label={(resolvedTheme ?? "light") === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      disabled={!isMounted}
    >
      <Sun
        className={cn(
          "h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all",
          isMounted && (resolvedTheme ?? "light") === "dark" && "-rotate-90 scale-0"
        )}
      />
      <Moon
        className={cn(
          "absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all",
          isMounted && (resolvedTheme ?? "light") === "dark" && "rotate-0 scale-100"
        )}
      />
      <span className="sr-only">Alternar modo oscuro</span>
    </Button>
  );
}
