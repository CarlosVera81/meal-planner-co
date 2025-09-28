import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Recipe } from '@/types/recipe';
import { mockRecipes } from '@/data/mockRecipes';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import {
  calorieRanges,
  difficultyOptions,
  mealTypeOptions,
  timeRanges,
  useRecipeSearch,
} from '@/hooks/useRecipeSearch';

interface RecipeLibraryProps {
  onRecipeSelect?: (recipe: Recipe) => void;
  selectedRecipes?: Recipe[];
  showAddButton?: boolean;
}

export function RecipeLibrary({ 
  onRecipeSelect, 
  selectedRecipes = [],
  showAddButton = true 
}: RecipeLibraryProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const {
    filters,
    tags,
    filteredRecipes,
    updateFilter,
    clearFilters,
    activeFiltersCount,
  } = useRecipeSearch({ recipes: mockRecipes });

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
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <Select
                value={filters.difficulty}
                onValueChange={(value) => updateFilter('difficulty', value as typeof filters.difficulty)}
              >
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

              <Select
                value={filters.mealType}
                onValueChange={(value) => updateFilter('mealType', value as typeof filters.mealType)}
              >
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

              <Select
                value={filters.timeRange}
                onValueChange={(value) => updateFilter('timeRange', value)}
              >
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

              <Select value={filters.tag} onValueChange={(value) => updateFilter('tag', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etiquetas</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.calorieRange}
                onValueChange={(value) => updateFilter('calorieRange', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Calorías" />
                </SelectTrigger>
                <SelectContent>
                  {calorieRanges.map((range) => (
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
              className="h-full cursor-pointer"
            >
              <RecipeCard
                recipe={recipe}
                onAdd={showAddButton ? onRecipeSelect : undefined}
                isAdded={selectedRecipes.some(r => r.id === recipe.id)}
                className="h-full"
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
