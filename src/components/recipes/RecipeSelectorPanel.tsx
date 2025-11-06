import { useEffect, useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { computeEstimatedCost } from "@/lib/cost";
import { RecipeDetailModal } from "@/components/recipes/RecipeDetailModal";
import { Trash2 } from "lucide-react";
import { mockRecipes } from "@/data/mockRecipes";
import {
  calorieRanges,
  difficultyOptions,
  mealTypeOptions,
  timeRanges,
  useRecipeSearch,
} from "@/hooks/useRecipeSearch";
import { MealType, Recipe } from "@/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
};

const mealTypeThemes: Record<MealType | "default", { header: string; badge: string; container: string }> = {
  breakfast: {
    header:
      "border-amber-200 bg-gradient-to-r from-amber-50 via-orange-100 to-amber-50 text-amber-900 dark:border-amber-500/60 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-amber-500/20 dark:text-amber-100",
    badge: "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-400/60 dark:bg-amber-400/25 dark:text-amber-50",
    container: "ring-amber-200/50 dark:ring-amber-500/40",
  },
  lunch: {
    header:
      "border-emerald-200 bg-gradient-to-r from-emerald-50 via-lime-100 to-emerald-50 text-emerald-900 dark:border-emerald-500/60 dark:from-emerald-500/20 dark:via-lime-500/20 dark:to-emerald-500/20 dark:text-emerald-100",
    badge: "border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-400/60 dark:bg-emerald-400/25 dark:text-emerald-50",
    container: "ring-emerald-200/50 dark:ring-emerald-500/40",
  },
  dinner: {
    header:
      "border-indigo-200 bg-gradient-to-r from-indigo-50 via-blue-100 to-indigo-50 text-indigo-900 dark:border-indigo-500/60 dark:from-indigo-500/20 dark:via-blue-500/20 dark:to-indigo-500/20 dark:text-indigo-100",
    badge: "border-indigo-400 bg-indigo-100 text-indigo-900 dark:border-indigo-400/60 dark:bg-indigo-400/25 dark:text-indigo-50",
    container: "ring-indigo-200/50 dark:ring-indigo-500/40",
  },
  default: {
    header: "border-muted bg-muted/50 text-muted-foreground dark:border-muted/70 dark:bg-muted/40 dark:text-muted-foreground",
    badge: "border-muted bg-muted text-foreground dark:border-muted/70 dark:bg-muted/40 dark:text-foreground",
    container: "ring-border/60 dark:ring-border/40",
  },
};

interface RecipeSelectorPanelProps {
  onSelect: (recipe: Recipe, servings: number) => void;
  onClear?: () => void;
  currentRecipe?: Recipe | null;
  currentServings?: number;
  // Notifica al padre cuando el usuario cambia las porciones desde el panel
  onServingsChange?: (servings: number) => void;
  recipes?: Recipe[];
  fixedMealType?: MealType;
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function RecipeSelectorPanel({
  onSelect,
  onClear,
  currentRecipe,
  currentServings,
  onServingsChange,
  recipes = mockRecipes,
  fixedMealType,
  className,
  showTitle = true,
  compact = false,
}: RecipeSelectorPanelProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null);
  const [detailServings, setDetailServings] = useState<number>(4);
  const { filters, filteredRecipes, tags, updateFilter, clearFilters, activeFiltersCount, setFilters } = useRecipeSearch({
    recipes,
    initialMealType: fixedMealType,
  });

  const theme = fixedMealType ? mealTypeThemes[fixedMealType] : mealTypeThemes.default;
  const paddingClass = compact ? "p-3" : "p-4";
  const listHeightClass = compact
    ? "max-h-[34vh] sm:max-h-[38vh] lg:max-h-[44vh]"
    : "max-h-[42vh] sm:max-h-[48vh] lg:max-h-[54vh]";

  useEffect(() => {
    if (fixedMealType) {
      setFilters((prev) => ({
        ...prev,
        mealType: fixedMealType,
      }));
    }
  }, [fixedMealType, setFilters]);

  // panelServings mantiene la selección del usuario dentro del panel
  const [panelServings, setPanelServings] = useState<number>(() => currentServings ?? 4);

  // Sincroniza panelServings cuando cambia currentServings o currentRecipe desde fuera
  useEffect(() => {
    if (currentServings !== undefined && currentServings !== panelServings) {
      setPanelServings(currentServings);

    //} else if (currentServings === undefined && currentRecipe) {
    //  const base = currentRecipe.originalServingsBase ?? currentRecipe.servingsBase ?? 4;
    //  if (base !== panelServings) setPanelServings(base);
    }
    // intentionally not depending on panelServings to avoid loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentServings]);

  const handleSelect = (recipe: Recipe) => {
    // Al seleccionar enviamos la receta junto a las porciones actualmente elegidas en el panel.
    onSelect(recipe, panelServings);
  };

  const hasResults = filteredRecipes.length > 0;

  // Muestra info de porciones actuales si existe
  const currentRecipeLabel = useMemo(() => {
    if (currentRecipe) {
      const base = currentRecipe.originalServingsBase ?? currentRecipe.servingsBase ?? 4;
      const servings = currentServings ?? base;
      return `${currentRecipe.name} (${servings} ${servings === 1 ? "porción" : "porciones"})`;
    }
    return "Haz clic en una receta para asignarla";
  }, [currentRecipe, currentServings]);

  return (
    <div className={cn("flex w-full max-h-full flex-col", className)}>
      {detailRecipe && (
        <RecipeDetailModal
          recipe={detailRecipe}
          servings={detailServings}
          open={!!detailRecipe}
          onOpenChange={(open) => !open && setDetailRecipe(null)}
        />
      )}

      <div
        className={cn(
          "flex w-full flex-col gap-4 rounded-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-sm",
          theme.container,
          paddingClass,
        )}
      >
        {(showTitle || fixedMealType) && (
          <div
            className={cn(
              "flex flex-col gap-2 rounded-xl border px-4 py-3",
              theme.header,
              compact ? "px-3 py-2" : "px-4 py-3",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  {fixedMealType ? mealTypeLabels[fixedMealType] : "Selector de recetas"}
                </span>
                <span className="text-sm font-semibold leading-tight text-foreground">{currentRecipeLabel}</span>
              </div>
              {fixedMealType && (
                <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", theme.badge)}>
                  {mealTypeLabels[fixedMealType]}
                </Badge>
              )}
            </div>
            {onClear && currentRecipe && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={onClear} className="h-8 rounded-lg px-3 shadow-sm hover:shadow">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={filters.searchTerm}
              onChange={(event) => updateFilter("searchTerm", event.target.value)}
              placeholder="Buscar recetas o ingredientes"
              className="h-11 rounded-xl border border-border/70 bg-background pl-10 shadow-sm"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-lg border-border/70 bg-background/90 shadow-sm hover:shadow"
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Selector de porciones */}
            <Select
              value={String(panelServings)}
              onValueChange={(value) => {
                const n = parseInt(value, 10);
                setPanelServings(n);
                onServingsChange?.(n);
              }}
            >
              <SelectTrigger className="hidden">
                <SelectValue placeholder="Porciones" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "porción" : "porciones"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" onClick={clearFilters} disabled={activeFiltersCount === 0} className="rounded-lg hover:bg-muted">
              Limpiar
            </Button>
          </div>

          {filtersOpen && (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/40 p-3 text-sm">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Select value={filters.difficulty} onValueChange={(value) => updateFilter("difficulty", value as typeof filters.difficulty)}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!fixedMealType && (
                  <Select value={filters.mealType} onValueChange={(value) => updateFilter("mealType", value as typeof filters.mealType)}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Tipo de comida" />
                    </SelectTrigger>
                    <SelectContent>
                      {mealTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={filters.timeRange} onValueChange={(value) => updateFilter("timeRange", value)}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Tiempo" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.calorieRange} onValueChange={(value) => updateFilter("calorieRange", value)}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Calorías" />
                  </SelectTrigger>
                  <SelectContent>
                    {calorieRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.tag} onValueChange={(value) => updateFilter("tag", value)}>
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Etiqueta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las etiquetas</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={cn("mt-4 flex-1 overflow-hidden rounded-2xl border border-border/50 bg-card/95 shadow-xl backdrop-blur-sm", theme.container)}>
        <div className={cn("relative h-full overflow-y-auto overscroll-contain pr-1", listHeightClass)}>
          <div className="space-y-2 p-3 pr-3">
            {!hasResults && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
                  <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                  <p>No se encontraron recetas con los filtros seleccionados.</p>
                </CardContent>
              </Card>
            )}

            {filteredRecipes.map((recipe) => {
              const isCurrent = currentRecipe?.id === recipe.id;
              const base = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;
              const servings = panelServings ?? base;
              const factor = servings / base;
              const adjustedTime = Math.round(recipe.timeMin * factor);
              const estimatedCost = computeEstimatedCost(recipe, servings);

              return (
                <button
                  key={recipe.id}
                  type="button"
                  className={cn(
                    "w-full rounded-xl border border-border/60 bg-background/95 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md",
                    isCurrent && "border-primary/70 ring-2 ring-primary/40",
                  )}
                  onClick={() => handleSelect(recipe)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-tight text-foreground">{recipe.name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{recipe.difficulty}</span>
                        <span>{adjustedTime} min</span>
                        <span>
                          {servings} {servings === 1 ? "porción" : "porciones"}
                        </span>
                        <span>{recipe.mealTypes.map((type) => mealTypeLabels[type]).join(" / ")}</span>
                        {recipe.calories && <span>{recipe.calories} cal</span>}
                        {estimatedCost > 0 && <span>${Math.round(estimatedCost).toLocaleString('es-CL')}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs">
                      {isCurrent && (
                        <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px]">
                          Asignada
                        </Badge>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailRecipe(recipe);
                          setDetailServings(panelServings);
                        }}
                        className="rounded-md border border-border/60 bg-background px-2 py-0.5 text-[11px] hover:bg-primary/10 transition-colors"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {recipe.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-md border-dashed px-2 py-0.5 text-[11px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
