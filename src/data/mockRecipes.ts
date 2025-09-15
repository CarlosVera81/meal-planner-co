import { Recipe } from '@/types/recipe';
import spaghettiImage from '@/assets/spaghetti-bolognesa.jpg';
import ensaladaPolloImage from '@/assets/ensalada-pollo.jpg';
import curryGarbanzosImage from '@/assets/curry-garbanzos.jpg';
import panquequesImage from '@/assets/panqueques.jpg';
import sopaVerdurasImage from '@/assets/sopa-verduras.jpg';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Boloñesa',
    servingsBase: 4,
    timeMin: 45,
    difficulty: 'Medio',
    tags: ['Italiano', 'Reconfortante'],
    allergens: ['gluten'],
    calories: 520,
    mealTypes: ['lunch', 'dinner'],
    imageUrl: spaghettiImage,
    ingredients: [
      {
        id: '1-1',
        name: 'Pasta spaghetti',
        quantity: 400,
        unit: 'g',
        category: 'Abarrotes/Granos',
        pricePerUnit: 1200,
        allergens: ['gluten']
      },
      {
        id: '1-2',
        name: 'Carne molida',
        quantity: 500,
        unit: 'g',
        category: 'Carnes',
        pricePerUnit: 8000
      },
      {
        id: '1-3',
        name: 'Tomate triturado',
        quantity: 400,
        unit: 'ml',
        category: 'Abarrotes/Granos',
        pricePerUnit: 800
      },
      {
        id: '1-4',
        name: 'Cebolla',
        quantity: 1,
        unit: 'unidad',
        category: 'Verdulería',
        pricePerUnit: 150
      },
      {
        id: '1-5',
        name: 'Ajo',
        quantity: 2,
        unit: 'dientes',
        category: 'Verdulería',
        pricePerUnit: 50
      }
    ],
    steps: [
      'Picar cebolla y ajo finamente',
      'Calentar aceite en sartén y sofreír cebolla hasta transparente',
      'Agregar ajo y cocinar 1 minuto más',
      'Agregar carne molida y cocinar hasta dorar',
      'Incorporar tomate triturado y condimentar',
      'Cocinar pasta según instrucciones del paquete',
      'Servir pasta con salsa boloñesa'
    ]
  },
  {
    id: '2',
    name: 'Ensalada de Pollo',
    servingsBase: 4,
    timeMin: 25,
    difficulty: 'Fácil',
    tags: ['Saludable', 'Proteína', 'Fresco'],
    allergens: [],
    calories: 320,
    mealTypes: ['lunch', 'dinner'],
    imageUrl: ensaladaPolloImage,
    ingredients: [
      {
        id: '2-1',
        name: 'Pechuga de pollo',
        quantity: 400,
        unit: 'g',
        category: 'Carnes',
        pricePerUnit: 6500
      },
      {
        id: '2-2',
        name: 'Lechuga',
        quantity: 1,
        unit: 'unidad',
        category: 'Verdulería',
        pricePerUnit: 800
      },
      {
        id: '2-3',
        name: 'Tomate',
        quantity: 2,
        unit: 'unidades',
        category: 'Verdulería',
        pricePerUnit: 200
      },
      {
        id: '2-4',
        name: 'Aceite de oliva',
        quantity: 30,
        unit: 'ml',
        category: 'Abarrotes/Granos',
        pricePerUnit: 150
      },
      {
        id: '2-5',
        name: 'Limón',
        quantity: 1,
        unit: 'unidad',
        category: 'Frutas',
        pricePerUnit: 100
      }
    ],
    steps: [
      'Cocinar pechuga de pollo a la plancha',
      'Lavar y cortar lechuga en trozos',
      'Cortar tomates en rodajas',
      'Desmenuzar el pollo cocido',
      'Mezclar todos los ingredientes',
      'Aliñar con aceite de oliva y limón'
    ]
  },
  {
    id: '3',
    name: 'Curry de Garbanzos',
    servingsBase: 4,
    timeMin: 30,
    difficulty: 'Fácil',
    tags: ['Vegano', 'Sin Gluten', 'Especiado'],
    allergens: [],
    calories: 380,
    mealTypes: ['lunch', 'dinner'],
    imageUrl: curryGarbanzosImage,
    ingredients: [
      {
        id: '3-1',
        name: 'Garbanzos cocidos',
        quantity: 400,
        unit: 'g',
        category: 'Abarrotes/Granos',
        pricePerUnit: 1000
      },
      {
        id: '3-2',
        name: 'Leche de coco',
        quantity: 400,
        unit: 'ml',
        category: 'Abarrotes/Granos',
        pricePerUnit: 1500
      },
      {
        id: '3-3',
        name: 'Curry en polvo',
        quantity: 10,
        unit: 'g',
        category: 'Abarrotes/Granos',
        pricePerUnit: 2000
      },
      {
        id: '3-4',
        name: 'Arroz',
        quantity: 300,
        unit: 'g',
        category: 'Abarrotes/Granos',
        pricePerUnit: 800
      }
    ],
    steps: [
      'Cocinar arroz según instrucciones',
      'Sofreír especias en aceite',
      'Agregar garbanzos y cocinar 5 minutos',
      'Incorporar leche de coco',
      'Cocinar 15 minutos a fuego lento',
      'Servir sobre arroz'
    ]
  },
  {
    id: '4',
    name: 'Panqueques Clásicos',
    servingsBase: 4,
    timeMin: 20,
    difficulty: 'Fácil',
    tags: ['Desayuno', 'Dulce', 'Clásico'],
    allergens: ['gluten', 'huevo', 'lactosa'],
    calories: 280,
    mealTypes: ['breakfast'],
    imageUrl: panquequesImage,
    ingredients: [
      {
        id: '4-1',
        name: 'Harina',
        quantity: 200,
        unit: 'g',
        category: 'Abarrotes/Granos',
        pricePerUnit: 600,
        allergens: ['gluten']
      },
      {
        id: '4-2',
        name: 'Leche',
        quantity: 300,
        unit: 'ml',
        category: 'Lácteos/Huevos',
        pricePerUnit: 1000,
        allergens: ['lactosa']
      },
      {
        id: '4-3',
        name: 'Huevos',
        quantity: 2,
        unit: 'unidades',
        category: 'Lácteos/Huevos',
        pricePerUnit: 300,
        allergens: ['huevo']
      }
    ],
    steps: [
      'Mezclar harina con una pizca de sal',
      'Batir huevos con leche',
      'Incorporar líquidos a harina gradualmente',
      'Calentar sartén con un poco de aceite',
      'Verter masa y cocinar hasta dorar',
      'Voltear y cocinar del otro lado'
    ]
  },
  {
    id: '5',
    name: 'Sopa de Verduras',
    servingsBase: 4,
    timeMin: 35,
    difficulty: 'Fácil',
    tags: ['Saludable', 'Vegetariano', 'Reconfortante'],
    allergens: [],
    calories: 150,
    mealTypes: ['lunch', 'dinner'],
    imageUrl: sopaVerdurasImage,
    ingredients: [
      {
        id: '5-1',
        name: 'Zanahoria',
        quantity: 2,
        unit: 'unidades',
        category: 'Verdulería',
        pricePerUnit: 100
      },
      {
        id: '5-2',
        name: 'Papa',
        quantity: 2,
        unit: 'unidades',
        category: 'Verdulería',
        pricePerUnit: 150
      },
      {
        id: '5-3',
        name: 'Apio',
        quantity: 1,
        unit: 'tallo',
        category: 'Verdulería',
        pricePerUnit: 200
      },
      {
        id: '5-4',
        name: 'Caldo de verduras',
        quantity: 1,
        unit: 'litro',
        category: 'Abarrotes/Granos',
        pricePerUnit: 800
      }
    ],
    steps: [
      'Pelar y cortar verduras en cubos',
      'Sofreír verduras en aceite 5 minutos',
      'Agregar caldo y llevar a ebullición',
      'Cocinar 20 minutos hasta que verduras estén tiernas',
      'Condimentar con sal y pimienta',
      'Servir caliente'
    ]
  }
];