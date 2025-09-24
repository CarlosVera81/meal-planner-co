import { useState, useMemo } from 'react';
import { CalendarCell } from '@/components/calendar/CalendarCell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, ShoppingCart } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Recipe, MealType, MealPlan } from '@/types/recipe';
import { mockRecipes } from '@/data/mockRecipes';

interface WeeklyCalendarProps {
  startDate?: Date;
  onRecipeAssign?: (date: string, mealType: MealType, recipe: Recipe) => void;
  onRecipeRemove?: (date: string, mealType: MealType) => void;
  onGenerateShoppingList?: () => void;
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
  const [mealPlan, setMealPlan] = useState<Record<string, Record<MealType, { recipe: Recipe; servings: number } | undefined>>>({});
  
  const weekStart = useMemo(() => 
    startOfWeek(addDays(startDate, selectedWeek * 7), { weekStartsOn: 1 }), 
    [startDate, selectedWeek]
  );

  const weekDays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const handleRecipeAssign = (date: string, mealType: MealType, recipe: Recipe) => {
    const newMealPlan = { ...mealPlan };
    if (!newMealPlan[date]) newMealPlan[date] = {} as any;
    newMealPlan[date][mealType] = { recipe, servings: 4 };
    setMealPlan(newMealPlan);
    onRecipeAssign?.(date, mealType, recipe);
  };

  const generateShoppingList = () => {
    const consolidatedIngredients = new Map<string, {
      ingredient: any;
      totalQuantity: number;
      recipes: string[];
    }>();

    // Iterar sobre todas las comidas planificadas en las dos semanas
    Object.entries(mealPlan).forEach(([date, dayMeals]) => {
      Object.entries(dayMeals).forEach(([mealType, meal]) => {
        if (!meal) return;

        const { recipe, servings } = meal;
        const servingRatio = servings / recipe.servingsBase;

        recipe.ingredients.forEach(ingredient => {
          const key = `${ingredient.name}-${ingredient.unit}`;
          const scaledQuantity = ingredient.quantity * servingRatio;

          if (consolidatedIngredients.has(key)) {
            const existing = consolidatedIngredients.get(key)!;
            existing.totalQuantity += scaledQuantity;
            if (!existing.recipes.includes(recipe.name)) {
              existing.recipes.push(recipe.name);
            }
          } else {
            consolidatedIngredients.set(key, {
              ingredient,
              totalQuantity: scaledQuantity,
              recipes: [recipe.name]
            });
          }
        });
      });
    });

    // En una app real, aquí se navegaría a la página de lista de compras
    // y se pasarían los ingredientes consolidados
    console.log('Lista de compras generada:', Array.from(consolidatedIngredients.entries()));
    onGenerateShoppingList?.();
  };

  const handleRecipeRemove = (date: string, mealType: MealType) => {
    const newMealPlan = { ...mealPlan };
    if (newMealPlan[date]) {
      delete newMealPlan[date][mealType];
      if (Object.keys(newMealPlan[date]).length === 0) {
        delete newMealPlan[date];
      }
    }
    setMealPlan(newMealPlan);
    onRecipeRemove?.(date, mealType);
  };

  const duplicateWeek = () => {
    const newMealPlan = { ...mealPlan };
    const sourceWeekStart = selectedWeek === 0 ? weekStart : startOfWeek(startDate, { weekStartsOn: 1 });
    const targetWeekStart = selectedWeek === 0 
      ? addDays(weekStart, 7) 
      : weekStart;

    weekDays.forEach((_, dayIndex) => {
      const sourceDate = format(addDays(sourceWeekStart, dayIndex), 'yyyy-MM-dd');
      const targetDate = format(addDays(targetWeekStart, dayIndex), 'yyyy-MM-dd');
      
      if (newMealPlan[sourceDate]) {
        newMealPlan[targetDate] = { ...newMealPlan[sourceDate] };
      }
    });

    setMealPlan(newMealPlan);
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
                onClick={generateShoppingList}
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Generar Lista
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedWeek === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedWeek(0)}
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
                onClick={() => setSelectedWeek(1)}
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
                onClick={duplicateWeek}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Duplicar Semana
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMealPlan({})}
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
            {weekDays.map((day) => (
              <div key={day.toString()} className="text-center">
                <div className="font-medium text-sm">
                  {format(day, 'EEEE', { locale: es })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(day, 'dd/MM')}
                </div>
              </div>
            ))}

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
                      onDrop={(recipe) => handleRecipeAssign(dateKey, mealType, recipe)}
                      onRemove={() => handleRecipeRemove(dateKey, mealType)}
                      hasConflict={dayMeal?.recipe?.allergens.includes('gluten')} // Mock conflict
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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