import { WeeklyCalendar } from '@/components/planner/WeeklyCalendar';
import { RecipeLibrary } from '@/components/recipes/RecipeLibrary';
import { useState } from 'react';
import { Recipe, MealType } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();

  const handleRecipeAssign = (date: string, mealType: MealType, recipe: Recipe) => {
    if (!selectedRecipes.some(r => r.id === recipe.id)) {
      setSelectedRecipes(prev => [...prev, recipe]);
    }
    
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

  const handleGenerateShoppingList = () => {
    toast({
      title: "Lista de compras generada",
      description: "Tu lista de compras está lista. Ve a la sección 'Lista de Compras' para verla.",
    });
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (!selectedRecipes.some(r => r.id === recipe.id)) {
      setSelectedRecipes(prev => [...prev, recipe]);
      toast({
        title: "Receta seleccionada",
        description: `${recipe.name} está lista para ser arrastrada al calendario`,
      });
    }
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

        {/* Recipe Library */}
        <RecipeLibrary
          onRecipeSelect={handleRecipeSelect}
          selectedRecipes={selectedRecipes}
        />
      </div>
    </div>
  );
};

export default Index;
