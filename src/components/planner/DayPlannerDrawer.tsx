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
  onAssign: (mealType: MealType, recipe: Recipe) => void;
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
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <Tabs value={activeMealType} onValueChange={(value) => onMealTypeChange(value as MealType)} className="mt-4 space-y-4">
              <TabsList className="grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-2">
                {mealTypes.map((mealType) => {
                  const entry = dayMeals[mealType];
                  return (
                    <TabsTrigger
                      key={mealType}
                      value={mealType}
                      className={cn(
                        "group flex flex-col items-start gap-1 rounded-lg border border-transparent px-3 py-2 text-left text-xs capitalize transition",
                        "hover:border-border/70 hover:bg-background/70 hover:shadow-sm",
                        `data-[state=active]:${mealTypeAccent[mealType]}`,
                        "data-[state=active]:border-primary/40 data-[state=active]:text-foreground data-[state=active]:shadow-md",
                      )}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {mealTypeLabels[mealType]}
                      </span>
                      <span className="line-clamp-1 text-xs text-muted-foreground dark:text-slate-300 group-data-[state=active]:text-foreground/80 dark:group-data-[state=active]:text-slate-100">
                        {entry ? entry.recipe.name : mealTypeHelpers[mealType]}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {mealTypes.map((mealType) => {
                const entry = dayMeals[mealType];
                const recipe = entry?.recipe;
                const estimatedCost = recipe
                  ? recipe.ingredients.reduce(
                      (total, ingredient) => total + ((ingredient.pricePerUnit || 0) * ingredient.quantity) / 1000,
                      0,
                    )
                  : 0;
                const servings = entry?.servings ?? recipe?.servingsBase ?? 1;

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
                              {recipe.timeMin} min
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
                                ${Math.round(estimatedCost)} aprox.
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

                    <RecipeSelectorPanel
                      fixedMealType={mealType}
                      currentRecipe={recipe}
                      onSelect={(selectedRecipe) => onAssign(mealType, selectedRecipe)}
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
