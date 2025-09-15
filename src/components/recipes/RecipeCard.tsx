import { Clock, Users, DollarSign, AlertTriangle, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onAdd?: (recipe: Recipe) => void;
  variant?: 'default' | 'compact';
  className?: string;
  isAdded?: boolean;
  disabled?: boolean;
}

const difficultyColors = {
  'Fácil': 'success',
  'Medio': 'warning', 
  'Difícil': 'destructive'
} as const;

export function RecipeCard({ 
  recipe, 
  onAdd, 
  variant = 'default',
  className,
  isAdded = false,
  disabled = false
}: RecipeCardProps) {
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(recipe));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const estimatedCost = recipe.ingredients.reduce((total, ingredient) => {
    return total + (ingredient.pricePerUnit || 0) * ingredient.quantity / 1000; // Rough calculation
  }, 0);

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md cursor-pointer',
        isAdded && 'ring-2 ring-success bg-success-light',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      draggable={!disabled}
      onDragStart={handleDragStart}
      role="button"
      tabIndex={0}
      aria-label={`Receta: ${recipe.name}. ${recipe.timeMin} minutos, ${recipe.difficulty}`}
    >
      <CardContent className="p-4">
        {recipe.imageUrl && variant === 'default' && (
          <div className="w-full h-32 bg-muted rounded-md mb-3 overflow-hidden">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm leading-tight">
              {recipe.name}
            </h3>
            {isAdded && (
              <Badge variant="outline" className="text-xs">
                ✓ Añadida
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {recipe.timeMin} min
            </Badge>
            
            <Badge 
              variant={difficultyColors[recipe.difficulty]} 
              className="text-xs"
            >
              {recipe.difficulty}
            </Badge>
            
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {recipe.servingsBase}
            </Badge>

            {estimatedCost > 0 && (
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                ${Math.round(estimatedCost)}
              </Badge>
            )}
          </div>

          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {recipe.allergens.length > 0 && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-warning" />
              <span className="text-xs text-muted-foreground">
                Contiene: {recipe.allergens.join(', ')}
              </span>
            </div>
          )}

          {recipe.calories && (
            <p className="text-xs text-muted-foreground">
              {recipe.calories} cal por porción
            </p>
          )}

          {onAdd && (
            <Button 
              size="sm" 
              variant={isAdded ? "secondary" : "default"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(recipe);
              }}
              disabled={disabled || isAdded}
            >
              {isAdded ? 'Añadida al plan' : 'Añadir al plan'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}