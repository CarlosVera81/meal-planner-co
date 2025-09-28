import { useMemo, useRef, useState } from 'react';
import { CalendarCell } from '@/components/calendar/CalendarCell';
import { DayPlannerDrawer } from '@/components/planner/DayPlannerDrawer';
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
import { Copy, RotateCcw, Share2, ShoppingCart } from 'lucide-react';
import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import html2canvas from 'html2canvas';

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
  const calendarRef = useRef<HTMLDivElement>(null);
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

  const shareCalendarViaWhatsApp = async () => {
    if (!calendarRef.current) return;

    try {
      toast({
        title: "Generando imagen...",
        description: "Preparando el calendario para compartir",
      });

      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        height: calendarRef.current.scrollHeight,
        width: calendarRef.current.scrollWidth
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `calendario-familiar-${format(weekStart, 'yyyy-MM-dd')}.png`;
          link.href = url;
          link.click();
          
          // Crear mensaje para WhatsApp
          const totalMeals = getTotalMeals();
          const totalCost = Object.values(mealPlan).reduce((total, dayMeals) => {
            return total + Object.values(dayMeals).reduce((dayTotal, meal) => {
              if (!meal) return dayTotal;
              return dayTotal + meal.recipe.ingredients.reduce((sum, ing) => 
                sum + (ing.pricePerUnit || 0) * ing.quantity / 1000, 0);
            }, 0);
          }, 0);
          
          const message = encodeURIComponent(
            `🍽️ *Plan Familiar de Comidas* 🍽️\n\n` +
            `📅 Desde: ${format(weekStart, 'dd/MM/yyyy', { locale: es })}\n` +
            `🍴 Total comidas: ${totalMeals}\n` +
            `💰 Costo estimado: $${Math.round(totalCost).toLocaleString('es-CL')}\n\n` +
            `¡Revisa la imagen del calendario adjunta! 👆`
          );
          
          const whatsappUrl = `https://wa.me/?text=${message}`;
          window.open(whatsappUrl, '_blank');
          
          toast({
            title: "¡Calendario listo!",
            description: "Imagen descargada y WhatsApp abierto para compartir",
          });
        }
      }, 'image/png', 0.95);
    } catch (error) {
      toast({
        title: "Error al generar imagen",
        description: "No se pudo crear la imagen del calendario",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <Card ref={calendarRef}>
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
              <Button
                variant="outline"
                size="sm"
                onClick={shareCalendarViaWhatsApp}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
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
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(mealPlan).filter(date => {
                    const day = new Date(date);
                    const week1Start = startOfWeek(startDate, { weekStartsOn: 1 });
                    return day >= week1Start && day < addDays(week1Start, 7);
                  }).reduce((total, date) => total + Object.keys(mealPlan[date]).length, 0)}
                </Badge>
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
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(mealPlan).filter(date => {
                    const day = new Date(date);
                    const week2Start = addDays(startOfWeek(startDate, { weekStartsOn: 1 }), 7);
                    return day >= week2Start && day < addDays(week2Start, 7);
                  }).reduce((total, date) => total + Object.keys(mealPlan[date]).length, 0)}
                </Badge>
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
                {weekDays.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayMeal = mealPlan[dateKey]?.[mealType];
                  
                  return (
                    <CalendarCell
                      key={`${dateKey}-${mealType}`}
                      mealType={mealType}
                      assignedRecipe={dayMeal?.recipe}
                      servings={dayMeal?.servings}
                      badges={dayMeal?.recipe ? {
                        time: dayMeal.recipe.timeMin,
                        cost: Math.round(dayMeal.recipe.ingredients.reduce((sum, ing) => 
                          sum + (ing.pricePerUnit || 0) * ing.quantity / 1000, 0)),
                        allergens: dayMeal.recipe.allergens
                      } : undefined}
                      onAssign={(recipe) => handleRecipeAssign(dateKey, mealType, recipe)}
                      onRemove={() => handleRecipeRemove(dateKey, mealType)}
                      hasConflict={dayMeal?.recipe?.allergens?.includes('gluten')} // Mock conflict
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDay && selectedDateKey && (
        <DayPlannerDrawer
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
          onAssign={(mealType, recipe) => {
            handleRecipeAssign(selectedDateKey, mealType, recipe);

            const upcomingMeals = { ...(mealPlan[selectedDateKey] ?? {}) };
            upcomingMeals[mealType] = {
              recipe,
              servings: recipe.servingsBase,
            };

            const nextMealType = mealTypes.find((type) => !upcomingMeals[type]);
            if (nextMealType) {
              setDayPlannerMealType(nextMealType);
            }
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
                  return dayTotal + meal.recipe.ingredients.reduce((sum, ing) => 
                    sum + (ing.pricePerUnit || 0) * ing.quantity / 1000, 0);
                }, 0);
              }, 0).toFixed(0)}
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
              }, 0) / Math.max(getTotalMeals(), 1))}
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