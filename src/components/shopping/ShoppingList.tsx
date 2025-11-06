import { useState, useMemo } from 'react';
import { computeEstimatedCost } from "@/lib/cost";
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
    const totalCost = items.reduce((sum, item) => {
      const pricePerUnit = item.ingredient.pricePerUnit || 0;
      if (!pricePerUnit) return sum;
      
      const unit = (item.unit || "").toLowerCase();
      // Si es g/gr/ml, dividir entre 1000
      if (unit.includes("g") || unit.includes("gr") || unit.includes("ml")) {
        return sum + (pricePerUnit * item.totalQuantity) / 1000;
      }
      // Si es kg/L u otra unidad, multiplicar directo
      return sum + pricePerUnit * item.totalQuantity;
    }, 0);
    
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
                <span className="[&>svg]:h-5 [&>svg]:w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 448 512">
                    <path
                      d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </span>
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
                  ${Math.round(stats.totalCost).toLocaleString('es-CL')}
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
                          {item.ingredient.pricePerUnit && (() => {
                            const pricePerUnit = item.ingredient.pricePerUnit;
                            const unit = (item.unit || "").toLowerCase();
                            let itemCost = 0;
                            
                            if (unit.includes("g") || unit.includes("gr") || unit.includes("ml")) {
                              itemCost = (pricePerUnit * item.totalQuantity) / 1000;
                            } else {
                              itemCost = pricePerUnit * item.totalQuantity;
                            }
                            
                            return (
                              <Badge variant="outline">
                                ${Math.ceil(itemCost).toLocaleString('es-CL')}
                              </Badge>
                            );
                          })()}
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