import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MealType, Recipe } from "@/types/recipe";

interface CalendarCellProps {
  mealType: MealType;
  assignedRecipe?: Recipe;
  servings?: number;
  badges?: {
    time?: number;
    cost?: number;
    allergens?: string[];
  };
  onRemove?: () => void;
  className?: string;
  hasConflict?: boolean;
  isSelected?: boolean;
  onOpen?: () => void;
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
};

const mealTypeColors: Record<MealType, string> = {
  breakfast: "border-l-meal-breakfast",
  lunch: "border-l-meal-lunch",
  dinner: "border-l-meal-dinner",
};

export function CalendarCell({
  mealType,
  assignedRecipe,
  servings,
  badges,
  onRemove,
  className,
  hasConflict = false,
  isSelected = false,
  onOpen,
}: CalendarCellProps) {
  const isEmpty = !assignedRecipe;

  return (
    <Card
      className={cn(
        "min-h-[120px] cursor-pointer border-l-4 p-3 shadow-sm transition-all duration-200 hover:shadow-md",
        mealTypeColors[mealType],
        isEmpty && "bg-calendar-cell hover:bg-calendar-cell-hover",
        !isEmpty && "bg-calendar-cell-occupied",
        hasConflict && "border-destructive bg-destructive-light",
        isSelected && "bg-calendar-cell-selected ring-2 ring-primary",
        className,
      )}
      role="button"
      tabIndex={0}
      aria-label={`${mealTypeLabels[mealType]} - ${assignedRecipe ? assignedRecipe.name : "Vacío"}`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen?.();
        }
      }}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {mealTypeLabels[mealType]}
          </Badge>
          {servings && (
            <Badge variant="secondary" className="text-xs">
              <Users className="mr-1 h-3 w-3" />
              {servings}
            </Badge>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">Haz clic para planificar esta comida</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium leading-tight">{assignedRecipe.name}</h4>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemove();
                  }}
                  className="h-6 w-6 p-0"
                  aria-label="Remover receta"
                >
                  ×
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {badges?.time && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  {badges.time}min
                </Badge>
              )}

              {badges?.cost && (
                <Badge variant="secondary" className="text-xs">
                  <DollarSign className="mr-1 h-3 w-3" />
                  ${badges.cost}
                </Badge>
              )}

              {badges?.allergens && badges.allergens.length > 0 && (
                <Badge variant={hasConflict ? "destructive" : "warning"} className="text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {badges.allergens.length}
                </Badge>
              )}
            </div>

            {hasConflict && <p className="text-xs text-destructive">⚠️ Contiene alérgenos</p>}
          </div>
        )}
      </div>
    </Card>
  );
}