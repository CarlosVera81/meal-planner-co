import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Recipe, MealType } from '@/types/recipe';
import { mockRecipes } from '@/data/mockRecipes';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';

interface RecipeLibraryProps {
  onRecipeSelect?: (recipe: Recipe) => void;
  selectedRecipes?: Recipe[];
  showAddButton?: boolean;
}

const difficultyOptions = ['Todas', 'Fácil', 'Medio', 'Difícil'];
const mealTypeOptions = [
  { value: 'all', label: 'Todas las comidas' },
  { value: 'breakfast', label: 'Desayuno' },
  { value: 'lunch', label: 'Almuerzo' },
  { value: 'dinner', label: 'Cena' }
];

const timeRanges = [
  { value: 'all', label: 'Cualquier tiempo' },
  { value: '0-20', label: 'Menos de 20 min' },
  { value: '20-45', label: '20-45 min' },
  { value: '45-90', label: '45-90 min' },
  { value: '90+', label: 'Más de 90 min' }
];

export function RecipeLibrary({ 
  onRecipeSelect, 
  selectedRecipes = [],
  showAddButton = true 
}: RecipeLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todas');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = useMemo(() => {
    return mockRecipes.filter(recipe => {
      if (
        searchTerm &&
        !recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return false;
      }

      if (selectedDifficulty !== 'Todas' && recipe.difficulty !== selectedDifficulty) {
        return false;
      }

      if (selectedMealType !== 'all' && !recipe.mealTypes.includes(selectedMealType as MealType)) {
        return false;
      }

      if (selectedTimeRange !== 'all') {
        const [min, max] = selectedTimeRange.split('-').map(t => t.replace('+', ''));
        const minTime = parseInt(min);
        const maxTime = max ? parseInt(max) : Infinity;

        if (recipe.timeMin < minTime || recipe.timeMin > maxTime) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedDifficulty, selectedMealType, selectedTimeRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('Todas');
    setSelectedMealType('all');
    setSelectedTimeRange('all');
  };

  const activeFiltersCount = [
    searchTerm,
    selectedDifficulty !== 'Todas',
    selectedMealType !== 'all',
    selectedTimeRange !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Biblioteca de Recetas</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredRecipes.length} recetas
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar recetas, ingredientes o etiquetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de comida" />
                </SelectTrigger>
                <SelectContent>
                  {mealTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tiempo de cocción" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium mb-2">No se encontraron recetas</h3>
              <p className="text-sm">
                Prueba ajustando los filtros o cambiando el término de búsqueda
              </p>
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe.id} 
              onClick={() => setSelectedRecipe(recipe)} 
              className="cursor-pointer"
            >
              <RecipeCard
                recipe={recipe}
                onAdd={showAddButton ? onRecipeSelect : undefined}
                isAdded={selectedRecipes.some(r => r.id === recipe.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Detalle */}
      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}
