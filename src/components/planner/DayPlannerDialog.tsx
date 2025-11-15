import { useMemo, useState } from "react";
import { addDays, format, startOfWeek, endOfWeek, parse } from "date-fns";
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
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
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
  breakfast: "border-[#FCD34D] bg-[#FEF7C3] text-[#854D0E]",
  lunch: "border-[#86EFAC] bg-[#E6F9E6] text-[#166534]",
  dinner: "border-[#38BDF8] bg-[#E0F2FE] text-[#075985]",
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
  weekMeals?: Record<string, DayMeals>;
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
  weekMeals = {},
}: DayPlannerDialogProps) {
  const formattedDate = useMemo(() => format(date, "EEEE d 'de' MMMM", { locale: es }), [date]);
  const allowedTypes = useMemo<MealType[]>(() => (activeMealType === 'breakfast' ? ['breakfast'] : ['lunch', 'dinner']), [activeMealType]);
  const panelTitle = useMemo(() => (activeMealType === 'breakfast' ? 'Desayunos de esta semana' : 'Almuerzos y Cenas de esta semana'), [activeMealType]);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());

  // Calcular las comidas de la semana actual agrupadas por receta
  const groupedRecipes = useMemo(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    const recipeMap = new Map<string, { recipeName: string; recipeId: string; occurrences: Array<{ day: string; type: string; date: Date }> }>();

    Object.entries(weekMeals).forEach(([dateKey, dayMeals]) => {
      const mealDate = parse(dateKey, "yyyy-MM-dd", new Date());
      if (mealDate >= weekStart && mealDate <= weekEnd) {
        Object.entries(dayMeals).forEach(([mealType, entry]) => {
          if (entry && allowedTypes.includes(mealType as MealType)) {
            const recipeId = entry.recipe.id;
            const recipeName = entry.recipe.name;
            
            if (!recipeMap.has(recipeId)) {
              recipeMap.set(recipeId, {
                recipeName,
                recipeId,
                occurrences: [],
              });
            }
            
            recipeMap.get(recipeId)!.occurrences.push({
              day: format(mealDate, "EEEE d", { locale: es }),
              type: mealTypeLabels[mealType as MealType],
              date: mealDate,
            });
          }
        });
      }
    });

    // Ordenar las ocurrencias de cada receta por fecha
    recipeMap.forEach((recipe) => {
      recipe.occurrences.sort((a, b) => a.date.getTime() - b.date.getTime());
    });

    // Convertir a array y ordenar por cantidad de ocurrencias (descendente)
    return Array.from(recipeMap.values()).sort((a, b) => b.occurrences.length - a.occurrences.length);
  }, [date, weekMeals, allowedTypes]);

  const toggleRecipe = (recipeId: string) => {
    setExpandedRecipes((prev) => {
      const next = new Set(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.add(recipeId);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full rounded-xl border-[#E5E7EB] bg-white shadow-2xl">
        <DialogHeader className="border-b border-[#E2E8F0] pb-2">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="icon" onClick={() => onNavigateDay("prev")} disabled={!canNavigatePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <DialogTitle className="flex items-center gap-2 text-base font-semibold capitalize text-[#1F2937]">
              <CalendarRange className="h-4 w-4 text-[#4B5563]" /> {formattedDate}
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
                    "flex min-w-[160px] items-center justify-between rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#2F80ED]",
                    activeMealType === mealType ? "ring-2 ring-[#2F80ED] shadow-sm" : "hover:shadow-sm border-[#E5E7EB]",
                    entry ? mealTypeAccent[mealType] : "bg-[#F1F5F9] border-[#E5E7EB] text-[#4B5563]"
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

        {/* contenido principal: panel izquierdo + info del slot + selector */}
        <div className="flex gap-4 p-4">
          {/* Panel izquierdo - Comidas de la semana */}
          <div className="w-64 border-r border-[#E2E8F0] pr-4 overflow-y-auto max-h-[70vh]">
            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2 text-[#1F2937]">
              <UtensilsCrossed className="h-4 w-4 text-[#2F80ED]" />
              {panelTitle}
            </h3>
            <div className="space-y-2">
              {groupedRecipes.length > 0 ? (
                groupedRecipes.map((recipe) => {
                  const isExpanded = expandedRecipes.has(recipe.recipeId);
                  const count = recipe.occurrences.length;
                  
                  return (
                    <div key={recipe.recipeId} className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => toggleRecipe(recipe.recipeId)}
                        className="w-full p-2 bg-[#F1F5F9] hover:bg-[#E5E7EB] text-xs transition-colors flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2F80ED]"
                      >
                        <div className="flex items-center gap-2 flex-1 text-left">
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3 shrink-0 text-[#4B5563]" />
                          ) : (
                            <ChevronDown className="h-3 w-3 shrink-0 text-[#4B5563]" />
                          )}
                          <span className="text-[#1F2937] font-medium line-clamp-1">{recipe.recipeName}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 shrink-0 bg-[#2F80ED] text-white border-0">
                          x{count}
                        </Badge>
                      </button>
                      
                      {isExpanded && (
                        <div className="bg-[#FAFAF7] border-t border-[#E5E7EB]">
                          {recipe.occurrences.map((occurrence, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-1.5 text-[11px] border-b border-[#E5E7EB] last:border-b-0 hover:bg-white transition-colors"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[#1F2937] capitalize font-medium">{occurrence.day}</span>
                                <span className="text-[#4B5563]">{occurrence.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-[#9CA3AF] text-xs">No hay comidas asignadas esta semana</p>
              )}
            </div>
          </div>

          {/* Contenedor central y derecho */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Columna central: tarjeta con imagen + info + controles de porciones / quitar */}
            <div className="col-span-1">
            <div className={cn("rounded-xl border border-[#E5E7EB] p-4", "bg-white shadow-sm")}>
              {(() => {
                const entry = dayMeals[activeMealType];
                if (!entry) {
                  return <div className="text-sm text-[#4B5563]">Sin receta asignada para {mealTypeLabels[activeMealType].toLowerCase()}.</div>;
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
                    <h3 className="text-sm font-semibold text-[#1F2937]">{recipe.name}</h3>
                    <p className="text-xs text-[#4B5563] mt-1">{recipe.difficulty} • {recipe.mealTypes.map(t => mealTypeLabels[t]).join(' / ')}</p>

                    {/* METRICAS */}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#4B5563]">
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-[#4B5563]" /> {adjustedTime} min</div>
                      <div className="flex items-center gap-1"><Users className="h-3 w-3 text-[#4B5563]" /> {servings} porciones</div>
                      {recipe.calories && <div className="flex items-center gap-1"><Flame className="h-3 w-3 text-[#4B5563]" /> {recipe.calories} cal</div>}
                      <div className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-[#4B5563]" /> ${estCost.toLocaleString('es-CL')}</div>
                    </div>

                    {/* TAGS */}
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] uppercase tracking-wide border-[#E5E7EB] bg-[#F1F5F9] text-[#4B5563]">
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
                          className="border-[#E5E7EB] hover:bg-[#F1F5F9] focus:ring-2 focus:ring-[#2F80ED] disabled:text-[#9CA3AF] disabled:border-[#E5E7EB]"
                        >
                          <Minus className="h-4 w-4 text-[#4B5563]" />
                        </Button>
                        <div className="text-sm font-semibold w-8 text-center text-[#1F2937]">{servings}</div>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onServingsChange?.(activeMealType, Math.min(12, servings + 1))}
                          disabled={servings >= 12}
                          className="border-[#E5E7EB] hover:bg-[#F1F5F9] focus:ring-2 focus:ring-[#2F80ED] disabled:text-[#9CA3AF] disabled:border-[#E5E7EB]"
                        >
                          <Plus className="h-4 w-4 text-[#4B5563]" />
                        </Button>
                      </div>

                      <div>
                        <Button size="sm" variant="ghost" className="text-[#EF4444] hover:bg-[#FEE2E2] hover:text-[#DC2626] focus:ring-2 focus:ring-[#EF4444]" onClick={() => onRemove?.(activeMealType)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Quitar
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            </div>

            {/* Columna derecha (span 2): selector de recetas */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
