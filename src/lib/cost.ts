import { Recipe } from "@/types/recipe";

/**
 * Calcula precio estimado de una receta dadas `servings`.
 * - Usa recipe.originalServingsBase como base.
 * - Respeta unidades: 'g' y 'ml' son tratados como por 1000 (kg / L).
 */
export function computeEstimatedCost(recipe: Recipe, servings: number): number {
  const base = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;
  const factor = servings / base;

  const total = recipe.ingredients.reduce((sum, ing) => {
    const qty = (ing.quantity ?? 0) * factor;
    const unit = (ing.unit ?? "").toLowerCase();
    const pricePerUnit = ing.pricePerUnit ?? 0;

    if (!pricePerUnit) return sum;

    if (unit.includes("g") || unit.includes("gr") || unit.includes("ml")) {
      return sum + (pricePerUnit * qty) / 1000;
    }

    return sum + pricePerUnit * qty;
  }, 0);

  return Math.ceil(total);
}
