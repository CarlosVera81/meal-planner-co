import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Recipe } from "@/types/recipe";
import { X } from "lucide-react";
import { computeEstimatedCost } from "@/lib/cost";

interface RecipeDetailProps {
  recipe: Recipe;
  servings: number;
  onServingsChange: (value: number) => void;
  onClose: () => void;
}

export function RecipeDetail({ recipe, servings, onServingsChange, onClose }: RecipeDetailProps) {
  const base = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;
  const scaleFactor = servings / base;

  const adjustedIngredients = recipe.ingredients.map((ing) => ({
    ...ing,
    adjustedQuantity: ing.quantity * scaleFactor,
  }));

  const totalPrice = computeEstimatedCost(recipe, servings);
  const adjustedTime = Math.round(recipe.timeMin * scaleFactor);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle>{recipe.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        {/* Contenido */}
        <CardContent className="overflow-y-auto p-4 space-y-4">
          {recipe.imageUrl && (
            <img src={recipe.imageUrl} alt={recipe.name} className="rounded-lg mb-4 w-full" />
          )}

          <p><strong>Tiempo:</strong> {adjustedTime} min</p>
          <p><strong>Dificultad:</strong> {recipe.difficulty}</p>
         
          {/* Ingredientes */}
          <div>
            <h3 className="mt-4 font-semibold">Ingredientes</h3>
            <ul className="list-disc pl-5 space-y-1">
              {adjustedIngredients.map((ing) => (
                <li key={ing.id}>
                  {ing.adjustedQuantity % 1 === 0
                    ? ing.adjustedQuantity
                    : ing.adjustedQuantity.toFixed(2)}{" "}
                  {ing.unit || ""} {ing.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Precio estimado */}
          {totalPrice > 0 && (
            <p className="mt-2 font-medium">
              <strong>Precio estimado:</strong> ${totalPrice}
            </p>
          )}

          {/* Pasos */}
          <div>
            <h3 className="mt-4 font-semibold">Pasos</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {recipe.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

