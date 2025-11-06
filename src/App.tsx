import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { MealPlannerProvider } from "@/context/MealPlannerContext";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import ShoppingList from "./pages/ShoppingList";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  
  <QueryClientProvider client={queryClient}>
    <MealPlannerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="shopping" element={<ShoppingList />} />
              <Route path="pantry" element={<div className="p-8">Despensa - Próximamente</div>} />
              <Route path="preferences" element={<div className="p-8">Preferencias - Próximamente</div>} />
              <Route path="share" element={<div className="p-8">Compartir - Próximamente</div>} />
              <Route path="reports" element={<div className="p-8">Reportes - Próximamente</div>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MealPlannerProvider>
  </QueryClientProvider>
);


export default App;
