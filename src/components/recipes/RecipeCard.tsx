import { Clock, Users, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/recipe";
import { computeEstimatedCost } from "@/lib/cost";

interface RecipeCardProps {
  recipe: Recipe;
  servings: number;
  onAdd?: (recipe: Recipe) => void;
  variant?: "default" | "compact";
  className?: string;
  isAdded?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const difficultyColors = {
  Fácil: "success",
  Medio: "warning",
  Difícil: "destructive",
} as const;

export function RecipeCard({
  recipe,
  servings,
  onAdd,
  variant = "default",
  className,
  isAdded = false,
  disabled = false,
  onClick,
}: RecipeCardProps) {
  const base = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;
  const estimatedCost = computeEstimatedCost(recipe, servings);
  const hasAllergens = recipe.allergens.length > 0;
  const factor = servings / base;
  const adjustedTime = Math.round(recipe.timeMin * factor);

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-all duration-200 hover:shadow-md cursor-pointer",
        isAdded && "ring-2 ring-success bg-success-light",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      draggable={!disabled}
      onClick={(e) => {
        if (disabled) return;
        onClick?.();   // 👈 ejecuta el callback que vino desde RecipeLibrary
      }}
    >
      <CardContent className="flex h-full flex-col p-4">
        {recipe.imageUrl && variant === "default" && (
          <div className="w-full h-32 bg-muted rounded-md mb-3 overflow-hidden">
            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm leading-tight">{recipe.name}</h3>
            {isAdded && (
              <Badge variant="outline" className="text-xs">
                Ya añadida
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {adjustedTime} min
            </Badge>

            <Badge variant={difficultyColors[recipe.difficulty]} className="text-xs">
              {recipe.difficulty}
            </Badge>

            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {servings} {/* 👈 usa servings global */}
            </Badge>

            {estimatedCost > 0 && (
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                ${estimatedCost}
              </Badge>
            )}
          </div>

          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="min-h-[20px]">
            {hasAllergens && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span className="text-xs text-muted-foreground">
                  Contiene: {recipe.allergens.join(", ")}
                </span>
              </div>
            )}
          </div>

          {recipe.calories && (
            <p className="text-xs text-muted-foreground">{recipe.calories} cal por porción</p>
          )}

          {onAdd && (
            <div className="mt-auto">
              <Button
                size="sm"
                variant={isAdded ? "secondary" : "default"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(recipe);
                }}
                disabled={disabled || isAdded}
              >
                {isAdded ? "Añadida al plan" : "Añadir al plan"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
