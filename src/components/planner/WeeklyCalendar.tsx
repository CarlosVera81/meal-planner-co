import { useMemo, useState } from 'react';
import { computeEstimatedCost } from "@/lib/cost";
import { CalendarCell } from '@/components/calendar/CalendarCell';
import { DayPlannerDialog } from '@/components/planner/DayPlannerDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, RotateCcw, Share2, ShoppingCart } from 'lucide-react';
import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

import { useMealPlanner } from '@/context/MealPlannerContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MealType, Recipe, ShoppingListItem } from '@/types/recipe';

interface WeeklyCalendarProps {
  startDate?: Date;
  onRecipeAssign?: (date: string, mealType: MealType, recipe: Recipe) => void;
  onRecipeRemove?: (date: string, mealType: MealType) => void;
  onGenerateShoppingList?: (items: ShoppingListItem[]) => void;
}

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
const mealTypeLabels = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo', 
  dinner: 'Cena'
};

export function WeeklyCalendar({ 
  startDate = new Date(),
  onRecipeAssign,
  onRecipeRemove,
  onGenerateShoppingList
}: WeeklyCalendarProps) {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = week 1, 1 = week 2
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toast } = useToast();
  const { mealPlan, assignMeal, removeMeal, updateMealServings, clearMealPlan, duplicateWeek, generateShoppingList } = useMealPlanner();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [dayPlannerMealType, setDayPlannerMealType] = useState<MealType>('breakfast');
  const [pendingWeekChange, setPendingWeekChange] = useState<{ direction: 'prev' | 'next'; targetWeek: number; targetIndex: number } | null>(null);
  const totalWeeks = 2;
  
  const weekStart = useMemo(() => 
    startOfWeek(addDays(startDate, selectedWeek * 7), { weekStartsOn: 1 }), 
    [startDate, selectedWeek]
  );

  const weekDays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const dayPlannerOpen = selectedDayIndex !== null;
  const selectedDay = selectedDayIndex !== null ? weekDays[selectedDayIndex] : null;
  const selectedDateKey = selectedDay ? format(selectedDay, 'yyyy-MM-dd') : null;

  const selectedDayMeals = useMemo(() => {
    if (!selectedDateKey) {
      return {};
    }
    return mealPlan[selectedDateKey] ?? {};
  }, [mealPlan, selectedDateKey]);

  const handleOpenDayPlanner = (index: number, preferredMealType?: MealType) => {
    const targetDate = weekDays[index];
    const targetMeals = mealPlan[format(targetDate, 'yyyy-MM-dd')] ?? {};
    const nextMealType =
      preferredMealType ?? mealTypes.find((type) => !targetMeals[type]) ?? dayPlannerMealType;

    setDayPlannerMealType(nextMealType);
    setSelectedDayIndex(index);
  };

  const closeDayPlanner = () => {
    setSelectedDayIndex(null);
  };

  const handleNavigateDay = (direction: 'prev' | 'next') => {
    if (selectedDayIndex === null) return;

    const nextIndex = direction === 'prev' ? selectedDayIndex - 1 : selectedDayIndex + 1;
    if (nextIndex < 0) {
      if (selectedWeek > 0) {
        setPendingWeekChange({ direction, targetWeek: selectedWeek - 1, targetIndex: weekDays.length - 1 });
      }
      return;
    }

    if (nextIndex >= weekDays.length) {
      if (selectedWeek < totalWeeks - 1) {
        setPendingWeekChange({ direction, targetWeek: selectedWeek + 1, targetIndex: 0 });
      }
      return;
    }

    const targetDate = weekDays[nextIndex];
    const targetMeals = mealPlan[format(targetDate, 'yyyy-MM-dd')] ?? {};
    const nextMealType = mealTypes.find((type) => !targetMeals[type]) ?? dayPlannerMealType;

    setDayPlannerMealType(nextMealType);
    setSelectedDayIndex(nextIndex);
  };

  const canNavigatePrev = selectedDayIndex !== null && (selectedDayIndex > 0 || selectedWeek > 0);
  const canNavigateNext = selectedDayIndex !== null && (selectedDayIndex < weekDays.length - 1 || selectedWeek < totalWeeks - 1);

  const confirmWeekChange = () => {
    if (!pendingWeekChange) return;

    const { targetWeek, targetIndex } = pendingWeekChange;
    const newWeekStart = startOfWeek(addDays(startDate, targetWeek * 7), { weekStartsOn: 1 });
    const nextDate = addDays(newWeekStart, targetIndex);
    const dateKey = format(nextDate, 'yyyy-MM-dd');
    const targetMeals = mealPlan[dateKey] ?? {};
    const nextMealType = mealTypes.find((type) => !targetMeals[type]) ?? dayPlannerMealType;

    setSelectedWeek(targetWeek);
    setSelectedDayIndex(targetIndex);
    setDayPlannerMealType(nextMealType);
    setPendingWeekChange(null);
  };

  const cancelWeekChange = () => {
    setPendingWeekChange(null);
  };

  const handleRecipeAssign = (date: string, mealType: MealType, recipe: Recipe, servings?: number) => {
    assignMeal(date, mealType, recipe, servings ?? recipe.servingsBase);
    onRecipeAssign?.(date, mealType, recipe);
  };

  const handleGenerateShoppingList = () => {
    const items = generateShoppingList();
    onGenerateShoppingList?.(items);
  };

  const handleRecipeRemove = (date: string, mealType: MealType) => {
    removeMeal(date, mealType);
    onRecipeRemove?.(date, mealType);
  };

  const handleDuplicateWeek = () => {
    duplicateWeek({ startDate, selectedWeek });
  };

  const getTotalMeals = () => {
    return Object.values(mealPlan).reduce((total, dayMeals) => {
      return total + Object.keys(dayMeals).length;
    }, 0);
  };

  const getWeekMeals = () => {
    return weekDays.reduce((total, day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayMeals = mealPlan[dateKey];
      return total + (dayMeals ? Object.keys(dayMeals).length : 0);
    }, 0);
  };

  const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString('es-CL')}`;

  const capitalize = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

  const buildWeekShareBlock = (weekIndex: number) => {
    const weekStartDate = startOfWeek(addDays(startDate, weekIndex * 7), { weekStartsOn: 1 });
    const weekEndDate = addDays(weekStartDate, 6);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

    let weekAssignedMeals = 0;
    let weekCost = 0;

    const daySections = days.map((day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayMeals = mealPlan[dateKey] ?? {};
      let dayAssigned = 0;

      const mealLines = mealTypes.map((mealType) => {
        const entry = dayMeals[mealType];
        if (entry?.recipe) {
          dayAssigned += 1;
          weekAssignedMeals += 1;
          const mealServings = entry.servings ?? entry.recipe.servingsBase ?? 4;
          const recipeCost = computeEstimatedCost(entry.recipe, mealServings);
          weekCost += recipeCost;
          const servingsInfo = entry.servings ? ` (${entry.servings} porciones)` : '';
          const costInfo = recipeCost > 0 ? ` · ${formatCurrency(recipeCost)}` : '';
          return `• ${mealTypeLabels[mealType]}: ${entry.recipe.name}${servingsInfo}${costInfo}`;
        }

        return `• ${mealTypeLabels[mealType]}: Sin receta`;
      });

      mealLines.push(`↪ ${dayAssigned}/${mealTypes.length} comidas planificadas`);

      const dayLabel = capitalize(format(day, 'EEEE d/MM', { locale: es }));
        return `${dayLabel}
    ${mealLines.join('\n  ')}`;
      });

      const summary = `Resumen semana ${weekIndex + 1}: ${weekAssignedMeals}/${mealTypes.length * 7} comidas planificadas${
        weekCost > 0 ? ` · Costo aprox: ${formatCurrency(weekCost)}` : ''
      }`;

    return {
      header: `Semana ${weekIndex + 1} · ${format(weekStartDate, 'dd/MM')} - ${format(weekEndDate, 'dd/MM')}`,
      body: daySections,
      summary,
    };
  };

  const shareCalendarViaWhatsApp = (scope: 'current' | 'all') => {
    const targetWeeks = scope === 'all'
      ? Array.from({ length: totalWeeks }, (_, index) => index)
      : [selectedWeek];

    const blocks = targetWeeks.map(buildWeekShareBlock);
    const blockMessages = blocks.map((block) => {
      const sections = [`📆 *${block.header}*`, ...block.body, block.summary];
      return sections.join('\n\n');
    });

    const messageParts = [
      '🍽️ *Plan Familiar de Comidas*',
      `Generado el ${format(new Date(), 'dd/MM/yyyy', { locale: es })}`,
      ...blockMessages,
    ];

    const message = messageParts.filter(Boolean).join('\n\n');

    if (!message) {
      toast({
        title: 'No hay información para compartir',
        description: 'Planifica al menos una comida antes de compartir.',
        variant: 'destructive',
      });
      return;
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: 'Abriendo WhatsApp',
      description:
        scope === 'all'
          ? 'Mensaje con ambas semanas listo para enviar.'
          : `Mensaje de la semana ${selectedWeek + 1} listo para enviar.`,
    });

    setShareDialogOpen(false);
  };
  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Planificador Quincenal
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getTotalMeals()} comidas planificadas
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateShoppingList}
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Generar Lista
              </Button>
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <span className="[&>svg]:h-5 [&>svg]:w-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 448 512">
                        <path
                          d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>
                    </span>
                    Compartir
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <BaseDialogHeader>
                    <BaseDialogTitle>Compartir calendario</BaseDialogTitle>
                    <DialogDescription>
                      Elige si quieres compartir solo la semana actual o las dos semanas planificadas.
                    </DialogDescription>
                  </BaseDialogHeader>
                  <div className="grid gap-3 py-2">
                    <Button
                      className="justify-start gap-2"
                      onClick={() => shareCalendarViaWhatsApp('current')}
                    >
                      <Share2 className="h-4 w-4" />
                      Compartir semana {selectedWeek + 1}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {getWeekMeals()} comidas
                      </span>
                    </Button>
                    <Button
                      variant="secondary"
                      className="justify-start gap-2"
                      onClick={() => shareCalendarViaWhatsApp('all')}
                    >
                      <Share2 className="h-4 w-4" />
                      Compartir ambas semanas
                      <span className="ml-auto text-xs text-muted-foreground">
                        {getTotalMeals()} comidas
                      </span>
                    </Button>
                  </div>
                  <DialogFooter className="sm:justify-between">
                    <DialogClose asChild>
                      <Button variant="ghost" className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedWeek === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedWeek(0);
                  closeDayPlanner();
                }}
              >
                Semana 1
              </Button>
              <Button
                variant={selectedWeek === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedWeek(1);
                  closeDayPlanner();
                }}
              >
                Semana 2

              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicateWeek}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Duplicar Semana
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearMealPlan}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpiar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-8 gap-4">
            {/* Header Row */}
            <div className="font-medium text-sm text-muted-foreground">
              Comida
            </div>
            {weekDays.map((day, index) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayMeals = mealPlan[dateKey];
              const assignedCount = dayMeals ? Object.keys(dayMeals).length : 0;
              const isSelected = selectedDayIndex === index;

              return (
                <button
                  key={day.toString()}
                  type="button"
                  onClick={() => handleOpenDayPlanner(index)}
                  className={cn(
                    'flex w-full flex-col items-center rounded-md border border-transparent p-2 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isSelected ? 'border-primary bg-primary/10 shadow-sm' : 'hover:border-primary hover:bg-muted/60'
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Planificar ${format(day, 'EEEE', { locale: es })}`}
                >
                  <span className="text-sm font-medium capitalize">
                    {format(day, 'EEEE', { locale: es })}
                  </span>
                  <span className="text-xs text-muted-foreground">{format(day, 'dd/MM')}</span>
                  <Badge variant={assignedCount === mealTypes.length ? 'default' : 'outline'} className="mt-1 text-[11px]">
                    {assignedCount}/{mealTypes.length}
                  </Badge>
                </button>
              );
            })}

            {/* Meal Rows */}
            {mealTypes.map((mealType) => (
              <div key={mealType} className="contents">
                <div className="flex items-center justify-center py-4 font-medium text-sm bg-muted rounded-md">
                  {mealTypeLabels[mealType]}
                </div>
                {weekDays.map((day, index) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayMeal = mealPlan[dateKey]?.[mealType];
                  
                  // Calcula valores escalados
                  const base = dayMeal?.recipe?.originalServingsBase ?? dayMeal?.recipe?.servingsBase ?? 4;
                  const servings = dayMeal?.servings ?? base;
                  const factor = servings / base;
                  
                  const scaledTime = dayMeal?.recipe ? Math.round(dayMeal.recipe.timeMin * factor) : undefined;
                  const scaledCost = dayMeal?.recipe 
                    ? computeEstimatedCost(dayMeal.recipe, servings)
                    : undefined;
                  
                  return (
                    <CalendarCell
                      key={`${dateKey}-${mealType}`}
                      mealType={mealType}
                      assignedRecipe={dayMeal?.recipe}
                      servings={servings}
                      badges={dayMeal?.recipe ? {
                        time: scaledTime,
                        cost: scaledCost,
                        allergens: dayMeal.recipe.allergens
                      } : undefined}
                      onAssign={(recipe, newServings) => handleRecipeAssign(dateKey, mealType, recipe, newServings)}
                      onRemove={() => handleRecipeRemove(dateKey, mealType)}
                      hasConflict={dayMeal?.recipe?.allergens?.includes('gluten')}
                      onOpen={() => handleOpenDayPlanner(index, mealType)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDay && selectedDateKey && (
        <DayPlannerDialog
          open={dayPlannerOpen}
          date={selectedDay}
          activeMealType={dayPlannerMealType}
          dayMeals={selectedDayMeals}
          onOpenChange={(open) => {
            if (!open) {
              closeDayPlanner();
            }
          }}
          onMealTypeChange={(mealType) => setDayPlannerMealType(mealType)}
          onAssign={(mealType, recipe, servings) => {
            handleRecipeAssign(selectedDateKey, mealType, recipe);
            /*
            const upcomingMeals = { ...(mealPlan[selectedDateKey] ?? {}) };
            upcomingMeals[mealType] = {
              recipe,
              servings,
            };

            const nextMealType = mealTypes.find((type) => !upcomingMeals[type]);
            if (nextMealType) {
              setDayPlannerMealType(nextMealType);
            }
            */
          }}
          onRemove={(mealType) => {
            handleRecipeRemove(selectedDateKey, mealType);
          }}
          onServingsChange={(mealType, servings) => {
            updateMealServings(selectedDateKey, mealType, servings);
          }}
          onNavigateDay={handleNavigateDay}
          canNavigatePrev={canNavigatePrev}
          canNavigateNext={canNavigateNext}
        />
      )}

      <AlertDialog
        open={pendingWeekChange !== null}
        onOpenChange={(open) => {
          if (!open) {
            cancelWeekChange();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar de semana</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingWeekChange?.direction === 'next'
                ? `¿Quieres ir a la semana ${((pendingWeekChange?.targetWeek ?? 0) + 1).toString()} para seguir planificando?`
                : `¿Quieres volver a la semana ${((pendingWeekChange?.targetWeek ?? 0) + 1).toString()}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelWeekChange}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmWeekChange}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {getWeekMeals()}
            </div>
            <p className="text-sm text-muted-foreground">
              Comidas esta semana
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              ${Object.values(mealPlan).reduce((total, dayMeals) => {
                return total + Object.values(dayMeals).reduce((dayTotal, meal) => {
                  if (!meal) return dayTotal;
                  const mealServings = meal.servings ?? meal.recipe.servingsBase ?? 4;
                  return dayTotal + computeEstimatedCost(meal.recipe, mealServings);
                }, 0);
              }, 0).toLocaleString('es-CL')}
            </div>
            <p className="text-sm text-muted-foreground">
              Costo estimado total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {Math.round(Object.values(mealPlan).reduce((total, dayMeals) => {
                return total + Object.values(dayMeals).reduce((dayTotal, meal) => {
                  if (!meal) return dayTotal;
                  return dayTotal + (meal.recipe.calories || 0);
                }, 0);
              }, 0) / Math.max(getTotalMeals(), 1)).toLocaleString('es-CL')}
            </div>
            <p className="text-sm text-muted-foreground">
              Calorías promedio/comida
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}