// CalendarCell.tsx (modificado)
import { useState } from "react";
import { Users, Clock, DollarSign, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MealType, Recipe } from "@/types/recipe";
import { RecipeSelectorPanel } from "@/components/recipes/RecipeSelectorPanel";

interface CalendarCellProps {
  mealType: MealType;
  assignedRecipe?: Recipe | null;
  servings?: number;
  badges?: { time?: number; cost?: number; allergens?: string[] };
  onAssign: (recipe: Recipe, servings: number) => void;
  onRemove?: () => void;
  className?: string;
  hasConflict?: boolean;
  isSelected?: boolean;
  onOpen?: () => void; // si está presente, delega la apertura al padre
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
};

export function CalendarCell(props: CalendarCellProps) {
  const {
    mealType,
    assignedRecipe,
    servings,
    badges,
    onAssign,
    onRemove,
    onOpen,
    className,
    hasConflict = false,
    isSelected = false,
  } = props;

  const [open, setOpen] = useState(false);
  const isEmpty = !assignedRecipe;

  // tarjeta que ves siempre; en modo delegado se devuelve sola y llama onOpen()
  const card = (
    <Card
      onClick={() => {
        if (onOpen) {
          onOpen();
        } else {
          setOpen(true);
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "min-h-[120px] cursor-pointer border-l-4 p-3 shadow-sm transition-all duration-200 hover:shadow-md",
        className,
        isEmpty ? "bg-calendar-cell hover:bg-calendar-cell-hover" : "bg-calendar-cell-occupied",
        hasConflict && "border-destructive bg-destructive-light",
        isSelected && "bg-calendar-cell-selected ring-2 ring-primary"
      )}
      aria-label={`${mealTypeLabels[mealType]} - ${assignedRecipe ? assignedRecipe.name : "Vacío"}`}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {mealTypeLabels[mealType]}
          </Badge>

          {servings !== undefined && (
            <Badge variant="secondary" className="text-xs">
              <Users className="mr-1 h-3 w-3" />
              {servings}
            </Badge>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">Haz clic para elegir una receta</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium leading-tight">{assignedRecipe?.name}</h4>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="h-6 w-6 p-0"
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
                  ${Math.round(badges.cost).toLocaleString('es-CL')}
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

  // si se pasó onOpen: devolvemos SOLO la tarjeta (papá abre el DayPlannerDialog)
  if (onOpen) return card;

  // fallback: si no hay onOpen, usar dialog interno
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{card}</DialogTrigger>

      <DialogContent className="w-[92vw] max-w-3xl border-0 bg-transparent p-0 shadow-none sm:w-[640px]">
        <RecipeSelectorPanel
          fixedMealType={mealType}
          currentRecipe={assignedRecipe ?? null}
          currentServings={servings}
          className="max-h-[80vh]"
          onClear={() => {
            onRemove?.();
            setOpen(false);
          }}
          onSelect={(recipe, newServings) => {
            onAssign(recipe, newServings);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
