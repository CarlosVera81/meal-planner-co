import { WeeklyCalendar } from '@/components/planner/WeeklyCalendar';
import { MealType, Recipe, ShoppingListItem } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';
import { useMealPlanner } from '@/context/MealPlannerContext';

const Index = () => {
  const { toast } = useToast();
  const { selectRecipe } = useMealPlanner();

  const handleRecipeAssign = (date: string, mealType: MealType, recipe: Recipe) => {
    selectRecipe(recipe);
    
    toast({
      title: "Receta asignada",
      description: `${recipe.name} agregada para ${mealType === 'breakfast' ? 'desayuno' : mealType === 'lunch' ? 'almuerzo' : 'cena'} el ${date}`,
    });
  };

  const handleRecipeRemove = (date: string, mealType: MealType) => {
    toast({
      title: "Receta removida",
      description: `Comida removida del planificador`,
    });
  };

  const handleGenerateShoppingList = (items: ShoppingListItem[]) => {
    toast({
      title: "Lista de compras generada",
      description:
        items.length > 0
          ? "Tu lista de compras está lista. Ve a la sección 'Lista de Compras' para verla."
          : "Agrega recetas al planificador para generar una lista automáticamente.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-8">
        {/* Main Calendar */}
        <WeeklyCalendar
          onRecipeAssign={handleRecipeAssign}
          onRecipeRemove={handleRecipeRemove}
          onGenerateShoppingList={handleGenerateShoppingList}
        />
      </div>
    </div>
  );
};

export default Index;
