import { useMemo } from 'react';
import { ShoppingList } from '@/components/shopping/ShoppingList';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMealPlanner } from '@/context/MealPlannerContext';

export default function ShoppingListPage() {
  const { toast } = useToast();
  const { shoppingList, generateShoppingList, toggleShoppingItem, mealPlan } = useMealPlanner();

  const handleGenerateList = () => {
    const newList = generateShoppingList();

    if (newList.length > 0) {
      toast({
        title: "Lista generada",
        description: `Se agregaron ${newList.length} productos a tu lista de compras.`,
      });
    } else {
      toast({
        title: "Sin recetas",
        description: "Agrega recetas al planificador primero.",
        variant: "destructive",
      });
    }
  };

  const handleExport = (format: 'pdf' | 'whatsapp') => {
    if (format === 'whatsapp') {
      const text = shoppingList
        .filter((item) => item.status !== 'done')
        .map((item) => `• ${item.ingredient.name} - ${item.totalQuantity} ${item.unit}`)
        .join('\n');

      const message = `🛒 *Lista de Compras*\n\n${text}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Lista compartida",
        description: "Se abrió WhatsApp para compartir tu lista.",
      });
    } else if (format === 'pdf') {
      toast({
        title: "Exportando PDF",
        description: "La función de exportar PDF estará disponible próximamente.",
      });
    }
  };

  const hasPlannedMeals = useMemo(() => Object.keys(mealPlan).length > 0, [mealPlan]);

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Lista de Compras</h1>
          <p className="text-[#4B5563]">Generada automáticamente desde tu planificación de comidas</p>
        </div>

        <Button onClick={handleGenerateList} className="gap-2 bg-[#2F80ED] hover:bg-[#1C64CC] focus:ring-2 focus:ring-[#2F80ED] text-white">
          <RefreshCw className="h-4 w-4" />
          Generar Lista
        </Button>
      </div>

      {!hasPlannedMeals && (
        <Alert className="border-[#FCD34D] bg-[#FEF7C3]">
          <AlertCircle className="h-4 w-4 text-[#854D0E]" />
          <AlertDescription className="text-[#854D0E]">
            No hay recetas planificadas. Ve al <strong>Planificador</strong> y agrega algunas recetas para generar tu lista de compras automáticamente.
          </AlertDescription>
        </Alert>
      )}

      <ShoppingList items={shoppingList} onToggleItem={toggleShoppingItem} onExport={handleExport} />
    </div>
  );
}