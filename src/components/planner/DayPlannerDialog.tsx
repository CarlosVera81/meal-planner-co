import { useMemo } from "react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  DollarSign,
  Flame,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { computeEstimatedCost } from "@/lib/cost";
import { RecipeSelectorPanel } from "@/components/recipes/RecipeSelectorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MealType, Recipe } from "@/types/recipe";

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
};

const mealTypeAccent: Record<MealType, string> = {
  breakfast: "border-amber-200 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/15",
  lunch: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/15",
  dinner: "border-indigo-200 bg-indigo-50 dark:border-indigo-500/60 dark:bg-indigo-500/15",
};

type DayMeals = Partial<Record<MealType, { recipe: Recipe; servings: number }>>;

type DayPlannerDialogProps = {
  open: boolean;
  date: Date;
  activeMealType: MealType;
  dayMeals: DayMeals;
  onOpenChange: (open: boolean) => void;
  onMealTypeChange: (mealType: MealType) => void;
  onAssign: (mealType: MealType, recipe: Recipe, servings: number) => void;
  onRemove?: (mealType: MealType) => void;
  onServingsChange?: (mealType: MealType, servings: number) => void;
  onNavigateDay: (direction: "prev" | "next") => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
};

export function DayPlannerDialog({
  open,
  date,
  activeMealType,
  dayMeals,
  onOpenChange,
  onMealTypeChange,
  onAssign,
  onRemove,
  onServingsChange,
  onNavigateDay,
  canNavigatePrev,
  canNavigateNext,
}: DayPlannerDialogProps) {
  const formattedDate = useMemo(() => format(date, "EEEE d 'de' MMMM", { locale: es }), [date]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full rounded-xl border bg-background/95 shadow-2xl backdrop-blur-lg">
        <DialogHeader className="border-b pb-2">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="icon" onClick={() => onNavigateDay("prev")} disabled={!canNavigatePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <DialogTitle className="flex items-center gap-2 text-base font-semibold capitalize">
              <CalendarRange className="h-4 w-4" /> {formattedDate}
            </DialogTitle>

            <Button variant="ghost" size="icon" onClick={() => onNavigateDay("next")} disabled={!canNavigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Tres botones arriba: desayuno/almuerzo/cena */}
          <div className="mt-3 flex justify-center gap-3">
            {mealTypes.map((mealType) => {
              const entry = dayMeals[mealType];
              return (
                <button
                  key={mealType}
                  onClick={() => onMealTypeChange(mealType)}
                  className={cn(
                    "flex min-w-[160px] items-center justify-between rounded-lg border px-3 py-2 text-sm transition",
                    activeMealType === mealType ? "ring-2 ring-primary" : "hover:shadow-sm",
                    entry ? mealTypeAccent[mealType] : "bg-muted/30"
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold uppercase">{mealTypeLabels[mealType]}</span>
                    <span className="text-sm line-clamp-1">{entry ? entry.recipe.name : "Sin receta"}</span>
                  </div>

                  {entry ? (
                    <div className="flex flex-col items-end">
                      <Badge variant="secondary" className="text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        {entry.servings}
                      </Badge>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* contenido principal: panel + info del slot seleccionado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Columna izq: tarjeta con imagen + info + controles de porciones / quitar */}
          <div className="col-span-1">
            <div className={cn("rounded-xl border p-4", "bg-card/95")}>
              {(() => {
                const entry = dayMeals[activeMealType];
                if (!entry) {
                  return <div className="text-sm text-muted-foreground">Sin receta asignada para {mealTypeLabels[activeMealType].toLowerCase()}.</div>;
                }

                const recipe = entry.recipe;
                const servings = entry.servings ?? recipe.servingsBase ?? 1;
                const base = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;
                const factor = servings / base;
                const adjustedTime = Math.round((recipe.timeMin || 0) * factor);
                const estCost = Math.round(computeEstimatedCost(recipe, servings) || 0);

                return (
                  <>
                    {/* IMAGEN */}
                    <div className="overflow-hidden rounded-md mb-3">
                      <img
                        src={(recipe as any).image ?? (recipe as any).imageUrl ?? "/images/placeholder-recipe.png"}
                        alt={recipe.name}
                        className="w-full h-44 object-cover rounded-md shadow-sm"
                        onError={(e: any) => {
                          e.currentTarget.src = "/images/placeholder-recipe.png";
                        }}
                      />
                    </div>

                    {/* TITULO + SUBTITULO */}
                    <h3 className="text-sm font-semibold">{recipe.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{recipe.difficulty} • {recipe.mealTypes.map(t => mealTypeLabels[t]).join(' / ')}</p>

                    {/* METRICAS */}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {adjustedTime} min</div>
                      <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {servings} porciones</div>
                      {recipe.calories && <div className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.calories} cal</div>}
                      <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${estCost.toLocaleString('es-CL')}</div>
                    </div>

                    {/* TAGS */}
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wide">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* controles de porciones */}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onServingsChange?.(activeMealType, Math.max(1, servings - 1))}
                          disabled={servings <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-semibold w-8 text-center">{servings}</div>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onServingsChange?.(activeMealType, Math.min(12, servings + 1))}
                          disabled={servings >= 12}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onRemove?.(activeMealType)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Quitar
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Columna central (span 2): selector de recetas */}
          <div className="col-span-1 lg:col-span-2">
            <div className="max-h-[70vh] overflow-y-auto">
              <RecipeSelectorPanel
                fixedMealType={activeMealType}
                currentRecipe={dayMeals[activeMealType]?.recipe ?? null}
                currentServings={dayMeals[activeMealType]?.servings}
                onSelect={(recipe, servings) => {
                  onAssign(activeMealType, recipe, servings);
                }}
                onClear={() => {
                  onRemove?.(activeMealType);
                }}
                // Pasamos el cambio de porciones hacia el padre con el mealType
                onServingsChange={(servings) => {
                  onServingsChange?.(activeMealType, servings);
                }}
                showTitle
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
