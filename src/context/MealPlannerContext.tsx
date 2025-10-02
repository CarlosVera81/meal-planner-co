import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";

import { mockRecipes } from "@/data/mockRecipes";
import { Recipe, MealType, ShoppingListItem } from "@/types/recipe";

type MealPlanEntry = {
  recipe: Recipe;
  servings: number;
};

type MealPlanState = Record<string, Partial<Record<MealType, MealPlanEntry>>>;

type MealPlannerState = {
  mealPlan: MealPlanState;
  selectedRecipes: Recipe[];
  shoppingList: ShoppingListItem[];
};

type PersistedMealPlanEntry = {
  recipeId: string;
  servings: number;
};

type PersistedState = {
  mealPlan: Record<string, Partial<Record<MealType, PersistedMealPlanEntry>>>;
  selectedRecipes: string[];
  shoppingList: ShoppingListItem[];
};

type DuplicateWeekOptions = {
  startDate: Date;
  selectedWeek: number;
};

type MealPlannerContextValue = MealPlannerState & {
  assignMeal: (date: string, mealType: MealType, recipe: Recipe, servings?: number) => void;
  removeMeal: (date: string, mealType: MealType) => void;
  updateMealServings: (date: string, mealType: MealType, servings: number) => void;
  clearMealPlan: () => void;
  duplicateWeek: (options: DuplicateWeekOptions) => void;
  selectRecipe: (recipe: Recipe) => void;
  deselectRecipe: (recipeId: string) => void;
  isRecipeSelected: (recipeId: string) => boolean;
  generateShoppingList: () => ShoppingListItem[];
  toggleShoppingItem: (itemId: string) => void;
  resetShoppingList: () => void;
};

const STORAGE_KEY = "meal-planner-state";

const defaultState: MealPlannerState = {
  mealPlan: {},
  selectedRecipes: [],
  shoppingList: [],
};

const MealPlannerContext = createContext<MealPlannerContextValue | undefined>(undefined);

const getRecipeById = (id: string) => mockRecipes.find((recipe) => recipe.id === id);

const getIngredientKey = (ingredient: { id?: string; name: string; unit: string }) =>
  ingredient.id ? ingredient.id : `${ingredient.name.toLowerCase()}-${ingredient.unit.toLowerCase()}`;

function loadInitialState(): MealPlannerState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(stored) as PersistedState;

    const mealPlan: MealPlanState = {};
    Object.entries(parsed.mealPlan || {}).forEach(([date, meals]) => {
      const day: Partial<Record<MealType, MealPlanEntry>> = {};
      Object.entries(meals || {}).forEach(([type, entry]) => {
        if (!entry) return;
        const recipe = getRecipeById(entry.recipeId);
        if (!recipe) return;
        day[type as MealType] = {
          recipe,
          servings: entry.servings,
        };
      });
      if (Object.keys(day).length > 0) {
        mealPlan[date] = day;
      }
    });

    const selectedRecipes: Recipe[] = (parsed.selectedRecipes || [])
      .map((id) => getRecipeById(id))
      .filter((recipe): recipe is Recipe => Boolean(recipe));

    return {
      mealPlan,
      selectedRecipes,
      shoppingList: parsed.shoppingList || [],
    };
  } catch (error) {
    console.error("Error loading meal planner state", error);
    return defaultState;
  }
}

function persistState(state: MealPlannerState) {
  if (typeof window === "undefined") {
    return;
  }

  const serializeMealPlan = () => {
    const serialized: PersistedState["mealPlan"] = {};
    Object.entries(state.mealPlan).forEach(([date, meals]) => {
      serialized[date] = {};
      Object.entries(meals).forEach(([type, entry]) => {
        if (!entry) return;
        serialized[date]![type as MealType] = {
          recipeId: entry.recipe.id,
          servings: entry.servings,
        };
      });
    });
    return serialized;
  };

  const payload: PersistedState = {
    mealPlan: serializeMealPlan(),
    selectedRecipes: state.selectedRecipes.map((recipe) => recipe.id),
    shoppingList: state.shoppingList,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function computeShoppingList(mealPlan: MealPlanState): ShoppingListItem[] {
  const consolidated = new Map<
    string,
    {
      ingredient: ShoppingListItem["ingredient"];
      totalQuantity: number;
      recipes: string[];
    }
  >();

  Object.values(mealPlan).forEach((day) => {
    Object.values(day).forEach((entry) => {
      if (!entry) return;
      const { recipe, servings } = entry;
      const base = recipe.originalServingsBase ?? recipe.servingsBase ?? 4;
      const ratio = servings / base;
      recipe.ingredients.forEach((ingredient) => {
        const key = getIngredientKey(ingredient);
        const scaledQuantity = ingredient.quantity * ratio;
        const existing = consolidated.get(key);
        if (existing) {
          existing.totalQuantity += scaledQuantity;
          if (!existing.recipes.includes(recipe.name)) {
            existing.recipes.push(recipe.name);
          }
        } else {
          consolidated.set(key, {
            ingredient,
            totalQuantity: scaledQuantity,
            recipes: [recipe.name],
          });
        }
      });
    });
  });

  return Array.from(consolidated.entries()).map(([key, data]) => ({
    id: key,
    ingredient: data.ingredient,
    totalQuantity: Math.round(data.totalQuantity * 10) / 10,
    unit: data.ingredient.unit,
    category: data.ingredient.category,
    status: "todo",
    recipes: data.recipes,
  }));
}

export function MealPlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MealPlannerState>(() => loadInitialState());

  const updateState = useCallback((updater: (prev: MealPlannerState) => MealPlannerState) => {
    setState((prev) => {
      const next = updater(prev);
      persistState(next);
      return next;
    });
  }, []);

  const assignMeal = useCallback(
    (date: string, mealType: MealType, recipe: Recipe, servings?: number) => {
      const targetServings = servings ?? recipe.servingsBase ?? 4;
      updateState((prev) => {
        const nextMealPlan: MealPlanState = { ...prev.mealPlan };
        const day = { ...(nextMealPlan[date] || {}) };
        day[mealType] = { recipe, servings: targetServings };
        nextMealPlan[date] = day;

        const alreadySelected = prev.selectedRecipes.some((item) => item.id === recipe.id);

        return {
          ...prev,
          mealPlan: nextMealPlan,
          selectedRecipes: alreadySelected ? prev.selectedRecipes : [...prev.selectedRecipes, recipe],
        };
      });
    },
    [updateState],
  );

  const updateMealServings = useCallback(
    (date: string, mealType: MealType, servings: number) => {
      updateState((prev) => {
        const day = prev.mealPlan[date];
        const entry = day?.[mealType];
        if (!entry) {
          return prev;
        }

        const nextMealPlan: MealPlanState = { ...prev.mealPlan };
        nextMealPlan[date] = {
          ...day,
          [mealType]: {
            ...entry,
            servings,
          },
        };

        return {
          ...prev,
          mealPlan: nextMealPlan,
        };
      });
    },
    [updateState],
  );

  const removeMeal = useCallback(
    (date: string, mealType: MealType) => {
      updateState((prev) => {
        const nextMealPlan: MealPlanState = { ...prev.mealPlan };
        const day = { ...(nextMealPlan[date] || {}) };
        if (day[mealType]) {
          delete day[mealType];
        }
        if (Object.keys(day).length === 0) {
          delete nextMealPlan[date];
        } else {
          nextMealPlan[date] = day;
        }

        return {
          ...prev,
          mealPlan: nextMealPlan,
        };
      });
    },
    [updateState],
  );

  const clearMealPlan = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      mealPlan: {},
      shoppingList: [],
    }));
  }, [updateState]);

  const duplicateWeek = useCallback(
    ({ startDate, selectedWeek }: DuplicateWeekOptions) => {
      updateState((prev) => {
        const nextMealPlan: MealPlanState = { ...prev.mealPlan };

        const sourceWeekStart = selectedWeek === 0 ? startOfWeek(startDate, { weekStartsOn: 1 }) : addDays(startOfWeek(startDate, { weekStartsOn: 1 }), 7);
        const targetWeekStart = selectedWeek === 0 ? addDays(sourceWeekStart, 7) : startOfWeek(startDate, { weekStartsOn: 1 });

        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
          const sourceDate = format(addDays(sourceWeekStart, dayIndex), "yyyy-MM-dd");
          const targetDate = format(addDays(targetWeekStart, dayIndex), "yyyy-MM-dd");

          const sourceDay = nextMealPlan[sourceDate];
          if (sourceDay) {
            nextMealPlan[targetDate] = { ...sourceDay };
          }
        }

        return {
          ...prev,
          mealPlan: nextMealPlan,
        };
      });
    },
    [updateState],
  );

  const selectRecipe = useCallback(
    (recipe: Recipe) => {
      updateState((prev) => {
        if (prev.selectedRecipes.some((item) => item.id === recipe.id)) {
          return prev;
        }

        return {
          ...prev,
          selectedRecipes: [...prev.selectedRecipes, recipe],
        };
      });
    },
    [updateState],
  );

  const deselectRecipe = useCallback(
    (recipeId: string) => {
      updateState((prev) => ({
        ...prev,
        selectedRecipes: prev.selectedRecipes.filter((item) => item.id !== recipeId),
      }));
    },
    [updateState],
  );

  const isRecipeSelected = useCallback(
    (recipeId: string) => state.selectedRecipes.some((recipe) => recipe.id === recipeId),
    [state.selectedRecipes],
  );

  const generateShoppingList = useCallback(() => {
    let newList: ShoppingListItem[] = [];
    updateState((prev) => {
      const list = computeShoppingList(prev.mealPlan);
      const statusMap = new Map(prev.shoppingList.map((item) => [item.id, item.status]));
      newList = list.map((item) => ({
        ...item,
        status: statusMap.get(item.id) ?? "todo",
      }));
      return {
        ...prev,
        shoppingList: newList,
      };
    });
    return newList;
  }, [updateState]);

  const toggleShoppingItem = useCallback(
    (itemId: string) => {
      updateState((prev) => ({
        ...prev,
        shoppingList: prev.shoppingList.map((item) =>
          item.id === itemId
            ? { ...item, status: item.status === "done" ? "todo" : "done" }
            : item,
        ),
      }));
    },
    [updateState],
  );

  const resetShoppingList = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      shoppingList: [],
    }));
  }, [updateState]);

  const value = useMemo<MealPlannerContextValue>(
    () => ({
      mealPlan: state.mealPlan,
      selectedRecipes: state.selectedRecipes,
      shoppingList: state.shoppingList,
      assignMeal,
      removeMeal,
      updateMealServings,
      clearMealPlan,
      duplicateWeek,
      selectRecipe,
      deselectRecipe,
      isRecipeSelected,
      generateShoppingList,
      toggleShoppingItem,
      resetShoppingList,
    }),
    [
      state.mealPlan,
      state.selectedRecipes,
      state.shoppingList,
      assignMeal,
      removeMeal,
      updateMealServings,
      clearMealPlan,
      duplicateWeek,
      selectRecipe,
      deselectRecipe,
      isRecipeSelected,
      generateShoppingList,
      toggleShoppingItem,
      resetShoppingList,
    ],
  );

  return <MealPlannerContext.Provider value={value}>{children}</MealPlannerContext.Provider>;
}

export function useMealPlanner() {
  const context = useContext(MealPlannerContext);
  if (!context) {
    throw new Error("useMealPlanner debe usarse dentro de MealPlannerProvider");
  }
  return context;
}
