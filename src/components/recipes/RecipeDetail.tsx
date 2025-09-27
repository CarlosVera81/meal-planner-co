import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/types/recipe";
import { X } from "lucide-react"; // ícono de cerrar

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Contenedor del modal con scroll interno */}
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header fijo con botón de cerrar */}
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle>{recipe.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        {/* Contenido scrollable */}
        <CardContent className="overflow-y-auto p-4">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="rounded-lg mb-4 w-full"
          />
          <p><strong>Tiempo:</strong> {recipe.timeMin} min</p>
          <p><strong>Dificultad:</strong> {recipe.difficulty}</p>

          <h3 className="mt-4 font-semibold">Ingredientes</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>{ing.quantity} {ing.unit} {ing.name}</li>
            ))}
          </ul>

          <h3 className="mt-4 font-semibold">Pasos</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
