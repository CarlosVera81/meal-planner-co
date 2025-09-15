import { useState } from 'react';
import { Clock, DollarSign, AlertTriangle, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MealSlot, MealType, Recipe } from '@/types/recipe';

interface CalendarCellProps {
  mealType: MealType;
  assignedRecipe?: Recipe;
  servings?: number;
  badges?: {
    time?: number;
    cost?: number;
    allergens?: string[];
  };
  onDrop?: (recipe: Recipe) => void;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  hasConflict?: boolean;
  isSelected?: boolean;
}

const mealTypeLabels = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo', 
  dinner: 'Cena'
};

const mealTypeColors = {
  breakfast: 'border-l-meal-breakfast',
  lunch: 'border-l-meal-lunch',
  dinner: 'border-l-meal-dinner'
};

export function CalendarCell({
  mealType,
  assignedRecipe,
  servings,
  badges,
  onDrop,
  onClick,
  onRemove,
  className,
  hasConflict = false,
  isSelected = false
}: CalendarCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const recipeData = e.dataTransfer.getData('application/json');
    if (recipeData && onDrop) {
      const recipe = JSON.parse(recipeData);
      onDrop(recipe);
    }
  };

  const isEmpty = !assignedRecipe;

  return (
    <Card
      className={cn(
        'min-h-[120px] p-3 border-l-4 cursor-pointer transition-all duration-200',
        mealTypeColors[mealType],
        isEmpty && 'bg-calendar-cell hover:bg-calendar-cell-hover',
        !isEmpty && 'bg-calendar-cell-occupied',
        hasConflict && 'bg-destructive-light border-destructive',
        isSelected && 'bg-calendar-cell-selected ring-2 ring-primary',
        isDragOver && 'bg-primary-light border-primary',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${mealTypeLabels[mealType]} - ${assignedRecipe ? assignedRecipe.name : 'Vacío'}`}
    >
      <div className="flex flex-col gap-2 h-full">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {mealTypeLabels[mealType]}
          </Badge>
          {servings && (
            <Badge variant="secondary" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              {servings}
            </Badge>
          )}
        </div>

        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              Arrastra una receta aquí
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight">
                {assignedRecipe.name}
              </h4>
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="h-6 w-6 p-0"
                  aria-label="Remover receta"
                >
                  ×
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {badges?.time && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {badges.time}min
                </Badge>
              )}
              
              {badges?.cost && (
                <Badge variant="secondary" className="text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${badges.cost}
                </Badge>
              )}

              {badges?.allergens && badges.allergens.length > 0 && (
                <Badge 
                  variant={hasConflict ? "destructive" : "warning"} 
                  className="text-xs"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {badges.allergens.length}
                </Badge>
              )}
            </div>

            {hasConflict && (
              <p className="text-xs text-destructive">
                ⚠️ Contiene alérgenos
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}