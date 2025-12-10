import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WhiteLabelProvider } from "@/contexts/WhiteLabelContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Oportunidades from "./pages/Oportunidades";
import Incubacoes from "./pages/Incubacoes";
import IncubacaoDetalhes from "./pages/IncubacaoDetalhes";
import AnaliseFinanceira from "./pages/AnaliseFinanceira";
import AnaliseTerritorial from "./pages/AnaliseTerritorial";
import AnaliseArtistas from "./pages/AnaliseArtistas";
import Configuracoes from "./pages/Configuracoes";
import GestaoPagamento from "./pages/GestaoPagamento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WhiteLabelProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oportunidades" element={<Oportunidades />} />
            <Route path="/incubacoes" element={<Incubacoes />} />
            <Route path="/incubacoes/:id" element={<IncubacaoDetalhes />} />
            <Route path="/analise-financeira" element={<AnaliseFinanceira />} />
            <Route path="/analise-territorial" element={<AnaliseTerritorial />} />
            <Route path="/analise-artistas" element={<AnaliseArtistas />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/gestao-pagamento" element={<GestaoPagamento />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WhiteLabelProvider>
  </QueryClientProvider>
);

export default App;
