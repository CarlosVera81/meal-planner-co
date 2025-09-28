import { Recipe } from '@/types/recipe';
import spaghettiImage from '@/assets/spaghetti-bolognesa.jpg';
import ensaladaPolloImage from '@/assets/ensalada-pollo.jpg';
import curryGarbanzosImage from '@/assets/curry-garbanzos.jpg';
import panquequesImage from '@/assets/panqueques.jpg';
import sopaVerdurasImage from '@/assets/sopa-verduras.jpg';
import omeletteImage from '@/assets/omelette-espinaca.jpg';
import avenaImage from '@/assets/avena-fruta.jpg';
import paltaImage from '@/assets/tostadas-palta.jpg';
import lasagnaImage from '@/assets/lasagna-veg.jpeg';
import tacosImage from '@/assets/tacos-carne.jpg';
import polloHornoImage from '@/assets/pollo-horno.jpg';
import pizzaImage from '@/assets/pizza.jpg';
import salmonImage from '@/assets/salmon-plancha.jpg';
import cesarImage from '@/assets/ensalada-cesar.jpg';
import batidoImage from '@/assets/batido-fruta.jpg';
import hummusImage from '@/assets/hummus.jpeg';
import yogurtGranolaImage from '@/assets/yogurt-granola.jpg';
import sandwichImage from '@/assets/sandwich.jpg';
import frutaPicadaImage from '@/assets/fruta-picada.jpg';
import palomitasImage from '@/assets/palomitas.jpg';

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
  },
  // Desayunos
  {
    id: '6',
    name: 'Omelette de Espinaca',
    servingsBase: 2,
    timeMin: 15,
    difficulty: 'Fácil',
    tags: ['Desayuno', 'Proteína'],
    allergens: ['huevo', 'lactosa'],
    calories: 220,
    mealTypes: ['breakfast'],
    imageUrl: omeletteImage,
    ingredients: [
      { id: '6-1', name: 'Huevos', quantity: 3, unit: 'unidades', category: 'Lácteos/Huevos', pricePerUnit: 300, allergens: ['huevo'] },
      { id: '6-2', name: 'Espinaca fresca', quantity: 50, unit: 'g', category: 'Verdulería', pricePerUnit: 400 },
      { id: '6-3', name: 'Queso rallado', quantity: 30, unit: 'g', category: 'Lácteos/Huevos', pricePerUnit: 1000, allergens: ['lactosa'] }
    ],
    steps: ['Batir los huevos con sal y pimienta','Saltear la espinaca','Agregar los huevos batidos','Añadir queso, doblar y servir']
  },
  {
    id: '7',
    name: 'Avena con Frutas',
    servingsBase: 2,
    timeMin: 10,
    difficulty: 'Fácil',
    tags: ['Desayuno', 'Saludable'],
    allergens: ['gluten'],
    calories: 180,
    mealTypes: ['breakfast'],
    imageUrl: avenaImage,
    ingredients: [
      { id: '7-1', name: 'Avena', quantity: 80, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 600, allergens: ['gluten'] },
      { id: '7-2', name: 'Leche', quantity: 200, unit: 'ml', category: 'Lácteos/Huevos', pricePerUnit: 1000, allergens: ['lactosa'] },
      { id: '7-3', name: 'Frutas mixtas', quantity: 150, unit: 'g', category: 'Frutas', pricePerUnit: 1200 }
    ],
    steps: ['Cocinar avena en leche','Servir en bol','Agregar frutas encima']
  },
  {
    id: '8',
    name: 'Tostadas con Palta',
    servingsBase: 2,
    timeMin: 8,
    difficulty: 'Fácil',
    tags: ['Desayuno', 'Rápido'],
    allergens: ['gluten'],
    calories: 250,
    mealTypes: ['breakfast'],
    imageUrl: paltaImage,
    ingredients: [
      { id: '8-1', name: 'Pan integral', quantity: 2, unit: 'rebanadas', category: 'Abarrotes/Granos', pricePerUnit: 500, allergens: ['gluten'] },
      { id: '8-2', name: 'Palta', quantity: 1, unit: 'unidad', category: 'Frutas', pricePerUnit: 800 }
    ],
    steps: ['Tostar pan','Pelar y aplastar la palta','Untar sobre las tostadas y servir']
  },

  // Almuerzos
  {
    id: '9',
    name: 'Lasaña Vegetariana',
    servingsBase: 6,
    timeMin: 60,
    difficulty: 'Medio',
    tags: ['Vegetariano', 'Italiano'],
    allergens: ['gluten', 'lactosa'],
    calories: 480,
    mealTypes: ['lunch', 'dinner'],
    imageUrl: lasagnaImage,
    ingredients: [
      { id: '9-1', name: 'Láminas de lasaña', quantity: 250, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 1500, allergens: ['gluten'] },
      { id: '9-2', name: 'Berenjena', quantity: 1, unit: 'unidad', category: 'Verdulería', pricePerUnit: 700 },
      { id: '9-3', name: 'Queso mozzarella', quantity: 200, unit: 'g', category: 'Lácteos/Huevos', pricePerUnit: 2500, allergens: ['lactosa'] }
    ],
    steps: ['Cortar berenjena en rodajas','Armar capas con pasta, berenjena y queso','Hornear 40 minutos a 180°C']
  },
  {
    id: '10',
    name: 'Tacos de Carne',
    servingsBase: 4,
    timeMin: 25,
    difficulty: 'Fácil',
    tags: ['Mexicano', 'Rápido'],
    allergens: ['gluten'],
    calories: 390,
    mealTypes: ['lunch', 'dinner'],
    imageUrl: tacosImage,
    ingredients: [
      { id: '10-1', name: 'Tortillas de maíz', quantity: 8, unit: 'unidades', category: 'Abarrotes/Granos', pricePerUnit: 1500, allergens: ['gluten'] },
      { id: '10-2', name: 'Carne de res', quantity: 400, unit: 'g', category: 'Carnes', pricePerUnit: 7000 },
      { id: '10-3', name: 'Cebolla', quantity: 1, unit: 'unidad', category: 'Verdulería', pricePerUnit: 150 }
    ],
    steps: ['Cocinar carne con especias','Calentar tortillas','Servir carne y toppings dentro']
  },
  {
    id: '11',
    name: 'Pollo al Horno con Papas',
    servingsBase: 4,
    timeMin: 50,
    difficulty: 'Fácil',
    tags: ['Clásico', 'Horneado'],
    allergens: [],
    calories: 450,
    mealTypes: ['lunch', 'dinner'],
    imageUrl: polloHornoImage,
    ingredients: [
      { id: '11-1', name: 'Pollo entero', quantity: 1, unit: 'unidad', category: 'Carnes', pricePerUnit: 8500 },
      { id: '11-2', name: 'Papas', quantity: 4, unit: 'unidades', category: 'Verdulería', pricePerUnit: 150 }
    ],
    steps: ['Colocar pollo en fuente','Agregar papas alrededor','Hornear 45 minutos a 200°C']
  },

  // Cenas
  {
    id: '12',
    name: 'Pizza Casera',
    servingsBase: 4,
    timeMin: 40,
    difficulty: 'Medio',
    tags: ['Italiano', 'Compartir'],
    allergens: ['gluten', 'lactosa'],
    calories: 500,
  mealTypes: ['lunch', 'dinner'],
    imageUrl: pizzaImage,
    ingredients: [
      { id: '12-1', name: 'Masa para pizza', quantity: 300, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 1200, allergens: ['gluten'] },
      { id: '12-2', name: 'Salsa de tomate', quantity: 200, unit: 'ml', category: 'Abarrotes/Granos', pricePerUnit: 700 },
      { id: '12-3', name: 'Queso mozzarella', quantity: 200, unit: 'g', category: 'Lácteos/Huevos', pricePerUnit: 2500, allergens: ['lactosa'] }
    ],
    steps: ['Extender masa','Agregar salsa y queso','Hornear 20 minutos a 220°C']
  },
  {
    id: '13',
    name: 'Salmón a la Plancha',
    servingsBase: 2,
    timeMin: 20,
    difficulty: 'Fácil',
    tags: ['Saludable', 'Proteína'],
    allergens: ['pescado'],
    calories: 350,
  mealTypes: ['lunch', 'dinner'],
    imageUrl: salmonImage,
    ingredients: [
      { id: '13-1', name: 'Filete de salmón', quantity: 2, unit: 'unidades', category: 'Pescados', pricePerUnit: 5000 },
      { id: '13-2', name: 'Limón', quantity: 1, unit: 'unidad', category: 'Frutas', pricePerUnit: 200 }
    ],
    steps: ['Calentar plancha','Cocinar salmón por ambos lados','Servir con limón exprimido']
  },
  {
    id: '14',
    name: 'Ensalada César',
    servingsBase: 3,
    timeMin: 15,
    difficulty: 'Fácil',
    tags: ['Clásico', 'Fresco'],
    allergens: ['gluten', 'lactosa'],
    calories: 280,
  mealTypes: ['lunch', 'dinner'],
    imageUrl: cesarImage,
    ingredients: [
      { id: '14-1', name: 'Lechuga romana', quantity: 1, unit: 'unidad', category: 'Verdulería', pricePerUnit: 900 },
      { id: '14-2', name: 'Crutones', quantity: 50, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 600, allergens: ['gluten'] },
      { id: '14-3', name: 'Queso parmesano', quantity: 40, unit: 'g', category: 'Lácteos/Huevos', pricePerUnit: 1800, allergens: ['lactosa'] }
    ],
    steps: ['Lavar y cortar lechuga','Agregar crutones y queso','Aliñar con salsa César']
  },

  // Snacks
  {
    id: '15',
    name: 'Batido de Frutas',
    servingsBase: 2,
    timeMin: 5,
    difficulty: 'Fácil',
    tags: ['Refrescante', 'Saludable'],
    allergens: ['lactosa'],
    calories: 150,
  mealTypes: ['breakfast', 'lunch', 'dinner'],
    imageUrl: batidoImage,
    ingredients: [
      { id: '15-1', name: 'Frutas variadas', quantity: 200, unit: 'g', category: 'Frutas', pricePerUnit: 1200 },
      { id: '15-2', name: 'Yogurt natural', quantity: 150, unit: 'ml', category: 'Lácteos/Huevos', pricePerUnit: 900, allergens: ['lactosa'] }
    ],
    steps: ['Agregar frutas y yogurt a la licuadora','Licuar hasta obtener textura suave','Servir frío']
  },
  {
    id: '16',
    name: 'Hummus con Verduras',
    servingsBase: 4,
    timeMin: 15,
    difficulty: 'Fácil',
    tags: ['Vegano', 'Dip'],
    allergens: ['sésamo'],
    calories: 180,
  mealTypes: ['lunch', 'dinner'],
    imageUrl: hummusImage,
    ingredients: [
      { id: '16-1', name: 'Garbanzos cocidos', quantity: 200, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 1000 },
      { id: '16-2', name: 'Tahini', quantity: 50, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 2000, allergens: ['sésamo'] },
      { id: '16-3', name: 'Zanahoria', quantity: 2, unit: 'unidades', category: 'Verdulería', pricePerUnit: 150 }
    ],
    steps: ['Procesar garbanzos con tahini y limón','Cortar verduras en bastones','Servir hummus como dip']
  },
  {
    id: '17',
    name: 'Yogurt con Granola',
    servingsBase: 1,
    timeMin: 5,
    difficulty: 'Fácil',
    tags: ['Rápido', 'Energético'],
    allergens: ['lactosa', 'gluten'],
    calories: 220,
  mealTypes: ['breakfast', 'lunch', 'dinner'],
    imageUrl: yogurtGranolaImage,
    ingredients: [
      { id: '17-1', name: 'Yogurt natural', quantity: 150, unit: 'ml', category: 'Lácteos/Huevos', pricePerUnit: 1000, allergens: ['lactosa'] },
      { id: '17-2', name: 'Granola', quantity: 40, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 1200, allergens: ['gluten'] }
    ],
    steps: ['Servir yogurt en bol','Agregar granola encima','Opcional: añadir miel']
  },
  {
    id: '18',
    name: 'Sandwich de Jamón y Queso',
    servingsBase: 1,
    timeMin: 7,
    difficulty: 'Fácil',
    tags: ['Clásico', 'Snack'],
    allergens: ['gluten', 'lactosa'],
    calories: 300,
  mealTypes: ['breakfast', 'lunch'],
    imageUrl: sandwichImage,
    ingredients: [
      { id: '18-1', name: 'Pan de molde', quantity: 2, unit: 'rebanadas', category: 'Abarrotes/Granos', pricePerUnit: 500, allergens: ['gluten'] },
      { id: '18-2', name: 'Jamón', quantity: 1, unit: 'rebanada', category: 'Carnes', pricePerUnit: 600 },
      { id: '18-3', name: 'Queso', quantity: 1, unit: 'rebanada', category: 'Lácteos/Huevos', pricePerUnit: 700, allergens: ['lactosa'] }
    ],
    steps: ['Colocar jamón y queso entre pan','Tostar si se desea','Servir caliente o frío']
  },
  {
    id: '19',
    name: 'Fruta Picada',
    servingsBase: 2,
    timeMin: 5,
    difficulty: 'Fácil',
    tags: ['Fresco', 'Saludable'],
    allergens: [],
    calories: 100,
  mealTypes: ['breakfast', 'lunch', 'dinner'],
    imageUrl: frutaPicadaImage,
    ingredients: [
      { id: '19-1', name: 'Frutas de temporada', quantity: 300, unit: 'g', category: 'Frutas', pricePerUnit: 1500 }
    ],
    steps: ['Lavar y pelar frutas','Cortar en trozos pequeños','Servir en bol']
  },
  {
    id: '20',
    name: 'Palomitas de Maíz',
    servingsBase: 4,
    timeMin: 10,
    difficulty: 'Fácil',
    tags: ['Snack', 'Compartir'],
    allergens: [],
    calories: 200,
  mealTypes: ['lunch', 'dinner'],
    imageUrl: palomitasImage,
    ingredients: [
      { id: '20-1', name: 'Maíz para palomitas', quantity: 100, unit: 'g', category: 'Abarrotes/Granos', pricePerUnit: 800 },
      { id: '20-2', name: 'Aceite', quantity: 20, unit: 'ml', category: 'Abarrotes/Granos', pricePerUnit: 300 }
    ],
    steps: ['Calentar aceite en olla','Agregar maíz y tapar','Esperar a que revienten todas las palomitas','Servir con sal al gusto']
  }

];