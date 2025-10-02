export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'Verdulería' | 'Frutas' | 'Carnes' | 'Pescados' | 'Lácteos/Huevos' | 'Abarrotes/Granos' | 'Panadería' | 'Congelados' | 'Bebidas' | 'Limpieza/Higiene';
  pricePerUnit?: number;
  allergens?: string[];
}

export interface Recipe {
  description?: string;
  instructions?: string[];
  id: string;
  name: string;
  servingsBase: number;         // lo de antes, puede ser usado internamente
  originalServingsBase?: number; // nueva propiedad para la regla de 3
  servings: number;             // cantidad que puede cambiar dinámicamente
  timeMin: number;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  price?: number;
  tags: string[];
  allergens: string[];
  calories?: number;
  mealTypes: ('breakfast' | 'lunch' | 'dinner')[];
  ingredients: Ingredient[];
  steps: string[];
  imageUrl?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealSlot {
  date: string;
  mealType: MealType;
  recipe?: Recipe;
  servings?: number;
  notes?: string;
}

export interface MealPlan {
  id: string;
  startDate: string;
  days: {
    date: string;
    meals: {
      breakfast?: MealSlot;
      lunch?: MealSlot;
      dinner?: MealSlot;
    };
  }[];
}

export interface ShoppingListItem {
  id: string;
  ingredient: Ingredient;
  totalQuantity: number;
  unit: string;
  category: string;
  status: 'todo' | 'done' | 'substituted' | 'unavailable';
  note?: string;
  recipes: string[]; // Recipe names that need this ingredient
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  category: string;
}

export interface FamilyPreferences {
  members: number;
  allergens: string[];
  dislikes: string[];
  weeklyBudget?: number;
  equipment: string[];
}