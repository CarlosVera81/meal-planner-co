import { Recipe } from "@/types/recipe";

/**
 * Normaliza metadatos mínimos sin mutar cantidades.
 * - Asegura que originalServingsBase exista.
 * - Deja las cantidades tal cual (no escala aquí).
 */
export function normalizeRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.map((recipe) => {
    const originalBase = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;

    return {
      ...recipe,
      originalServingsBase: originalBase,
      servingsBase: recipe.servingsBase ?? originalBase,
      servings: recipe.servings ?? recipe.servingsBase ?? originalBase,
      ingredients: recipe.ingredients.map((ing) => ({
        ...ing,
        pricePerUnit: ing.pricePerUnit ?? 0,
      })),
    };
  });
}
