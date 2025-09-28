import { useMemo, useState } from "react";

import { Recipe, MealType } from "@/types/recipe";

export const difficultyOptions: Array<"Todas" | Recipe["difficulty"]> = ["Todas", "Fácil", "Medio", "Difícil"];

export const mealTypeOptions: Array<{ value: "all" | MealType; label: string }> = [
  { value: "all", label: "Todas las comidas" },
  { value: "breakfast", label: "Desayuno" },
  { value: "lunch", label: "Almuerzo" },
  { value: "dinner", label: "Cena" },
];

export const timeRanges = [
  { value: "all", label: "Cualquier tiempo" },
  { value: "0-20", label: "Menos de 20 min" },
  { value: "20-45", label: "20-45 min" },
  { value: "45-90", label: "45-90 min" },
  { value: "90+", label: "Más de 90 min" },
];

export const calorieRanges = [
  { value: "all", label: "Todas las calorías" },
  { value: "0-300", label: "0 - 300 cal" },
  { value: "300-600", label: "300 - 600 cal" },
  { value: "600-900", label: "600 - 900 cal" },
  { value: "900+", label: "900+ cal" },
];

export interface RecipeSearchFilters {
  searchTerm: string;
  difficulty: "Todas" | Recipe["difficulty"];
  mealType: "all" | MealType;
  timeRange: string;
  tag: "all" | string;
  calorieRange: string;
}

export interface UseRecipeSearchOptions {
  recipes: Recipe[];
  initialMealType?: MealType;
  availableTags?: string[];
}

export function useRecipeSearch({ recipes, initialMealType, availableTags }: UseRecipeSearchOptions) {
  const [filters, setFilters] = useState<RecipeSearchFilters>({
    searchTerm: "",
    difficulty: "Todas",
    mealType: initialMealType ?? "all",
    timeRange: "all",
    tag: "all",
    calorieRange: "all",
  });

  const tags = useMemo(() => {
    if (availableTags && availableTags.length > 0) {
      return Array.from(new Set(availableTags)).sort();
    }

    const tagSet = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [availableTags, recipes]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (
        filters.searchTerm &&
        !recipe.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !recipe.tags.some((tag) => tag.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
        !recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      ) {
        return false;
      }

      if (filters.difficulty !== "Todas" && recipe.difficulty !== filters.difficulty) {
        return false;
      }

      if (filters.mealType !== "all" && !recipe.mealTypes.includes(filters.mealType)) {
        return false;
      }

      if (filters.tag !== "all" && !recipe.tags.includes(filters.tag)) {
        return false;
      }

      if (filters.timeRange !== "all") {
        const [min, maxRaw] = filters.timeRange.split("-");
        const minTime = parseInt(min, 10);
        const maxTime = maxRaw?.includes("+") ? Number.POSITIVE_INFINITY : parseInt(maxRaw, 10);

        if (recipe.timeMin < minTime || recipe.timeMin > maxTime) {
          return false;
        }
      }

      if (filters.calorieRange !== "all" && recipe.calories) {
        const [min, maxRaw] = filters.calorieRange.split("-");
        const minCalories = parseInt(min, 10);
        const maxCalories = maxRaw?.includes("+") ? Number.POSITIVE_INFINITY : parseInt(maxRaw, 10);

        if (recipe.calories < minCalories || recipe.calories > maxCalories) {
          return false;
        }
      }

      return true;
    });
  }, [filters, recipes]);

  const updateFilter = <Key extends keyof RecipeSearchFilters>(key: Key, value: RecipeSearchFilters[Key]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      difficulty: "Todas",
      mealType: initialMealType ?? "all",
      timeRange: "all",
      tag: "all",
      calorieRange: "all",
    });
  };

  const activeFiltersCount = useMemo(() => {
    return [
      filters.searchTerm,
      filters.difficulty !== "Todas",
      filters.mealType !== "all",
      filters.timeRange !== "all",
      filters.tag !== "all",
      filters.calorieRange !== "all",
    ].filter(Boolean).length;
  }, [filters]);

  return {
    filters,
    tags,
    filteredRecipes,
    updateFilter,
    clearFilters,
    activeFiltersCount,
    setFilters,
  };
}
