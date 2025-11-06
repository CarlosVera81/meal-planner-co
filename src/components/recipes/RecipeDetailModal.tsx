import { Clock, Users, DollarSign, Flame, ChefHat, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Recipe } from "@/types/recipe";
import { computeEstimatedCost } from "@/lib/cost";

interface RecipeDetailModalProps {
  recipe: Recipe;
  servings: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: "Desayuno",
  lunch: "Almuerzo",
  dinner: "Cena",
};

export function RecipeDetailModal({ recipe, servings, open, onOpenChange }: RecipeDetailModalProps) {
  const base = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;
  const factor = servings / base;
  const adjustedTime = Math.round(recipe.timeMin * factor);
  const estimatedCost = computeEstimatedCost(recipe, servings);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold leading-tight mb-2">
                {recipe.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {recipe.difficulty} • {recipe.mealTypes.map((type) => mealTypeLabels[type]).join(" / ")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-120px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Tiempo</span>
                  <span className="text-sm font-semibold">{adjustedTime} min</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Porciones</span>
                  <span className="text-sm font-semibold">{servings}</span>
                </div>
              </div>

              {recipe.calories && (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <Flame className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Calorías</span>
                    <span className="text-sm font-semibold">{recipe.calories}</span>
                  </div>
                </div>
              )}

              {estimatedCost > 0 && (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Costo aprox.</span>
                    <span className="text-sm font-semibold">${Math.round(estimatedCost).toLocaleString('es-CL')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Allergens Warning */}
            {recipe.allergens.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/10 p-4">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Contiene alérgenos</p>
                  <p className="text-sm text-muted-foreground">
                    {recipe.allergens.join(", ")}
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Ingredients */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-5 w-5" />
                <h3 className="text-lg font-semibold">
                  Ingredientes ({servings} {servings === 1 ? 'porción' : 'porciones'})
                </h3>
              </div>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => {
                  const scaledQuantity = (ingredient.quantity * factor).toFixed(1);
                  const displayQuantity = parseFloat(scaledQuantity) % 1 === 0 
                    ? Math.round(parseFloat(scaledQuantity)) 
                    : scaledQuantity;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                    >
                      <span className="text-sm font-medium">{ingredient.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {displayQuantity} {ingredient.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Preparación</h3>
              <ol className="space-y-4">
                {(recipe.instructions || recipe.steps || []).map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed pt-0.5">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Description */}
            {recipe.description && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Acerca de esta receta</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
