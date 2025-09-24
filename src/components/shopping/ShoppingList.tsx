import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Download, Share2, Plus } from 'lucide-react';
import { ShoppingListItem } from '@/types/recipe';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggleItem?: (itemId: string) => void;
  onAddItem?: (item: Partial<ShoppingListItem>) => void;
  onExport?: (format: 'pdf' | 'whatsapp') => void;
}

const categoryOrder = [
  'Verdulería',
  'Frutas', 
  'Carnes',
  'Pescados',
  'Lácteos/Huevos',
  'Abarrotes/Granos',
  'Panadería',
  'Congelados',
  'Bebidas',
  'Limpieza/Higiene'
];

const categoryIcons: Record<string, string> = {
  'Verdulería': '🥬',
  'Frutas': '🍎',
  'Carnes': '🥩',
  'Pescados': '🐟',
  'Lácteos/Huevos': '🥛',
  'Abarrotes/Granos': '🌾',
  'Panadería': '🍞',
  'Congelados': '❄️',
  'Bebidas': '🧃',
  'Limpieza/Higiene': '🧽'
};

export function ShoppingList({ 
  items, 
  onToggleItem, 
  onAddItem, 
  onExport 
}: ShoppingListProps) {
  const groupedItems = useMemo(() => {
    const groups = items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);

    // Sort by category order
    return categoryOrder.reduce((acc, category) => {
      if (groups[category]) {
        acc[category] = groups[category].sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
      }
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);
  }, [items]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(item => item.status === 'done').length;
    const totalCost = items.reduce((sum, item) => 
      sum + (item.ingredient.pricePerUnit || 0) * item.totalQuantity / 1000, 0
    );
    
    return { total, completed, totalCost, progress: total > 0 ? (completed / total) * 100 : 0 };
  }, [items]);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Lista vacía
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Agrega recetas al planificador para generar tu lista de compras automáticamente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Lista de Compras
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport?.('whatsapp')}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport?.('pdf')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.completed}/{stats.total}
              </div>
              <p className="text-sm text-muted-foreground">
                Productos comprados
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                ${Math.round(stats.totalCost)}
              </div>
              <p className="text-sm text-muted-foreground">
                Costo estimado
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {Math.round(stats.progress)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Completado
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Shopping List by Category */}
      <div className="grid gap-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl">{categoryIcons[category]}</span>
                {category}
                <Badge variant="secondary">
                  {categoryItems.filter(item => item.status === 'done').length}/
                  {categoryItems.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {categoryItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={item.id}
                        checked={item.status === 'done'}
                        onCheckedChange={() => onToggleItem?.(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <label 
                          htmlFor={item.id}
                          className={`block text-sm font-medium cursor-pointer ${
                            item.status === 'done' ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {item.ingredient.name}
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {item.totalQuantity} {item.unit}
                          </span>
                          {item.ingredient.pricePerUnit && (
                            <Badge variant="outline">
                              ${Math.round(item.ingredient.pricePerUnit * item.totalQuantity / 1000)}
                            </Badge>
                          )}
                          {item.recipes.length > 1 && (
                            <Badge variant="secondary">
                              {item.recipes.length} recetas
                            </Badge>
                          )}
                        </div>
                        {item.recipes.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Para: {item.recipes.join(', ')}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < categoryItems.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}