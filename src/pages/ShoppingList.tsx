import { useState, useMemo } from 'react';
import { ShoppingList } from '@/components/shopping/ShoppingList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { ShoppingListItem, Recipe, MealType } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';

// Simulamos datos del meal plan - en una app real esto vendría del contexto/estado global
const mockMealPlan: Record<string, Record<MealType, { recipe: Recipe; servings: number } | undefined>> = {};

export default function ShoppingListPage() {
  const { toast } = useToast();
  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>([]);

  // Función para consolidar ingredientes de todas las recetas planificadas
  const generateShoppingList = useMemo(() => {
    const consolidatedIngredients = new Map<string, {
      ingredient: any;
      totalQuantity: number;
      recipes: string[];
    }>();

    // Iterar sobre todas las comidas planificadas en las dos semanas
    Object.entries(mockMealPlan).forEach(([date, dayMeals]) => {
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

    // Convertir a array de ShoppingListItem
    return Array.from(consolidatedIngredients.entries()).map(([key, data], index) => ({
      id: `item-${index}`,
      ingredient: data.ingredient,
      totalQuantity: Math.round(data.totalQuantity * 100) / 100, // Redondear a 2 decimales
      unit: data.ingredient.unit,
      category: data.ingredient.category,
      status: 'todo' as const,
      recipes: data.recipes
    }));
  }, []);

  const handleGenerateList = () => {
    const newList = generateShoppingList;
    setShoppingItems(newList);
    
    if (newList.length > 0) {
      toast({
        title: "Lista generada",
        description: `Se agregaron ${newList.length} productos a tu lista de compras.`
      });
    } else {
      toast({
        title: "Sin recetas",
        description: "Agrega recetas al planificador primero.",
        variant: "destructive"
      });
    }
  };

  const handleToggleItem = (itemId: string) => {
    setShoppingItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: item.status === 'done' ? 'todo' : 'done' }
        : item
    ));
  };

  const handleExport = (format: 'pdf' | 'whatsapp') => {
    if (format === 'whatsapp') {
      const text = shoppingItems
        .filter(item => item.status !== 'done')
        .map(item => `• ${item.ingredient.name} - ${item.totalQuantity} ${item.unit}`)
        .join('\n');
      
      const message = `🛒 *Lista de Compras*\n\n${text}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Lista compartida",
        description: "Se abrió WhatsApp para compartir tu lista."
      });
    } else if (format === 'pdf') {
      // En una app real, aquí se generaría un PDF
      toast({
        title: "Exportando PDF",
        description: "La función de exportar PDF estará disponible próximamente."
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lista de Compras</h1>
          <p className="text-muted-foreground">
            Generada automáticamente desde tu planificación de comidas
          </p>
        </div>
        
        <Button onClick={handleGenerateList} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Generar Lista
        </Button>
      </div>

      {Object.keys(mockMealPlan).length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay recetas planificadas. Ve al <strong>Planificador</strong> y agrega algunas recetas para generar tu lista de compras automáticamente.
          </AlertDescription>
        </Alert>
      )}

      <ShoppingList
        items={shoppingItems}
        onToggleItem={handleToggleItem}
        onExport={handleExport}
      />
    </div>
  );
}