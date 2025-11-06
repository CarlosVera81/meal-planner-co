import { useMemo } from "react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Flame,
  Minus,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import { computeEstimatedCost } from "@/lib/cost";
import { RecipeSelectorPanel } from "@/components/recipes/RecipeSelectorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MealType, Recipe } from "@/types/recipe";

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
};

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

type DayMeals = Partial<Record<MealType, { recipe: Recipe; servings: number }>>;

type DayPlannerDrawerProps = {
  open: boolean;
  date: Date;
  activeMealType: MealType;
  dayMeals: DayMeals;
  onOpenChange: (open: boolean) => void;
  onMealTypeChange: (mealType: MealType) => void;
  onAssign: (mealType: MealType, recipe: Recipe, servings: number) => void;
  onRemove: (mealType: MealType) => void;
  onServingsChange: (mealType: MealType, servings: number) => void;
  onNavigateDay: (direction: "prev" | "next") => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
};

const mealTypeHelpers: Record<MealType, string> = {
  breakfast: "Empieza el día con energía",
  lunch: "Planifica un almuerzo balanceado",
  dinner: "Termina el día con algo rico y liviano",
};

const mealTypeAccent: Record<MealType, string> = {
  breakfast: "border-amber-200 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/15",
  lunch: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/15",
  dinner: "border-indigo-200 bg-indigo-50 dark:border-indigo-500/60 dark:bg-indigo-500/15",
};

export function DayPlannerDrawer({
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
}: DayPlannerDrawerProps) {
  const formattedDate = useMemo(() => format(date, "EEEE d 'de' MMMM", { locale: es }), [date]);
  const formattedShort = useMemo(() => format(date, "dd/MM", { locale: es }), [date]);

  const assignedMealsCount = useMemo(
    () => Object.values(dayMeals).filter(Boolean).length,
    [dayMeals],
  );

  const nextDayLabel = useMemo(() => format(addDays(date, 1), "EEEE", { locale: es }), [date]);
  const previousDayLabel = useMemo(() => format(addDays(date, -1), "EEEE", { locale: es }), [date]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-hidden border-t border-border/60 bg-background/95 shadow-2xl backdrop-blur">
        <div className="flex h-full flex-col">
          {/* HEADER: flechas + fecha + bloque de 3 comidas */}
          <DrawerHeader className="border-b bg-muted/40 pb-4 text-left">
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onNavigateDay("prev")}
                disabled={!canNavigatePrev}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Día anterior ({previousDayLabel})</span>
              </Button>

              <div className="flex flex-col items-center text-center">
                <DrawerTitle className="flex items-center gap-2 text-lg font-semibold capitalize">
                  <CalendarRange className="h-4 w-4" aria-hidden="true" />
                  {formattedDate}
                </DrawerTitle>
                <p className="text-xs text-muted-foreground">{formattedShort} • {assignedMealsCount} de 3 comidas</p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onNavigateDay("next")}
                disabled={!canNavigateNext}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Día siguiente ({nextDayLabel})</span>
              </Button>
            </div>

            {/* Bloques de comida (píldoras) justo debajo del título — clic cambia activeMealType */}
            <div className="mt-3 flex items-center justify-center gap-3">
              {mealTypes.map((mealType) => {
                const entry = dayMeals[mealType];
                const servings = entry?.servings ?? entry?.recipe?.servingsBase ?? undefined;
                return (
                  <button
                    key={mealType}
                    type="button"
                    onClick={() => onMealTypeChange(mealType)}
                    className={cn(
                      "flex min-w-[150px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                      activeMealType === mealType ? "shadow-md ring-2 ring-primary" : "hover:shadow-sm hover:border-border/70",
                      entry ? mealTypeAccent[mealType] : "bg-muted/30"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-semibold uppercase">{mealTypeLabels[mealType]}</span>
                      <span className="text-sm font-medium line-clamp-1">
                        {entry ? entry.recipe.name : mealTypeHelpers[mealType]}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      {servings !== undefined ? (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="mr-1 h-3 w-3" />
                          {servings}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Agregar</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </DrawerHeader>

          {/* CONTENT: tabs para el mealType seleccionado + selector */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 overscroll-contain">
            {/* Tabs controla contenido, pero el header superior ya hace switch también */}
            <Tabs value={activeMealType} onValueChange={(value) => onMealTypeChange(value as MealType)} className="mt-4 space-y-4">
              <TabsList className="hidden" /> {/* ocultamos los triggers por defecto (usamos las píldoras) */}

              {mealTypes.map((mealType) => {
                const entry = dayMeals[mealType];
                const recipe = entry?.recipe;
                const servings = entry?.servings ?? recipe?.servingsBase ?? 1;

                const estimatedCost = recipe ? computeEstimatedCost(recipe, servings) : 0;
                const base = recipe?.originalServingsBase ?? recipe?.servingsBase ?? 4;
                const factor = servings / base;
                const adjustedTime = recipe ? Math.round(recipe.timeMin * factor) : 0;

                const handleServingsAdjust = (delta: number) => {
                  const next = Math.min(12, Math.max(1, servings + delta));
                  if (next !== servings) {
                    onServingsChange(mealType, next);
                  }
                };

                return (
                  <TabsContent key={mealType} value={mealType} className="space-y-4">
                    <Card
                      className={cn(
                        "border transition",
                        recipe ? cn(mealTypeAccent[mealType], "shadow-sm") : "border-dashed bg-muted/20"
                      )}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-base leading-tight">
                          {recipe ? recipe.name : `Sin receta para ${mealTypeLabels[mealType].toLowerCase()}`}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground dark:text-slate-300">
                          {recipe
                            ? `${recipe.difficulty} • ${recipe.mealTypes.map((type) => mealTypeLabels[type]).join(" / ")}`
                            : mealTypeHelpers[mealType]}
                        </CardDescription>
                      </CardHeader>

                      {recipe && (
                        <CardContent className="space-y-4 border-t border-border/60 p-4 text-xs text-muted-foreground dark:text-slate-300">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              {adjustedTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" aria-hidden="true" />
                              {servings} porciones
                            </span>
                            {recipe.calories && (
                              <span className="flex items-center gap-1">
                                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                                {recipe.calories} cal
                              </span>
                            )}
                            {estimatedCost > 0 && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                                ${Math.round(estimatedCost).toLocaleString('es-CL')} aprox.
                              </span>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {recipe.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wide">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/80 p-3 text-xs text-foreground md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground dark:text-slate-200">Porciones</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleServingsAdjust(-1)}
                                  disabled={servings <= 1}
                                >
                                  <Minus className="h-4 w-4" aria-hidden="true" />
                                  <span className="sr-only">Restar porciones</span>
                                </Button>
                                <span className="text-sm font-semibold w-6 text-center">{servings}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleServingsAdjust(1)}
                                  disabled={servings >= 12}
                                >
                                  <Plus className="h-4 w-4" aria-hidden="true" />
                                  <span className="sr-only">Sumar porciones</span>
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-destructive"
                                onClick={() => onRemove(mealType)}
                              >
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                Quitar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>

                    {/* Recipe selector: pasamos currentServings y recogemos (recipe, servings) al seleccionar */}
                    <RecipeSelectorPanel
                      fixedMealType={mealType}
                      currentRecipe={recipe}
                      currentServings={servings}
                      onSelect={(selectedRecipe, selectedServings) => {
                        // IMPORTANTE: onSelect devuelve recipe + servings => los propagamos al parent
                        onAssign(mealType, selectedRecipe, selectedServings);
                      }}
                      onClear={recipe ? () => onRemove(mealType) : undefined}
                      showTitle={false}
                      compact
                    />
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
