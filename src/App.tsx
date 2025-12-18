import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WhiteLabelProvider } from "@/contexts/WhiteLabelContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Oportunidades from "./pages/Oportunidades";
import MarketplaceExplorar from "./pages/MarketplaceExplorar";
import OportunidadePublica from "./pages/OportunidadePublica";
import ProjetoDetalhes from "./pages/ProjetoDetalhes";
import NovoProjetoConstrucao from "./pages/NovoProjetoConstrucao";
import Incubacoes from "./pages/Incubacoes";
import IncubacaoDetalhes from "./pages/IncubacaoDetalhes";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import AnaliseFinanceira from "./pages/AnaliseFinanceira";
import AnaliseTerritorial from "./pages/AnaliseTerritorial";
import AnaliseArtistas from "./pages/AnaliseArtistas";
import Analytics from "./pages/Analytics";
import Investimentos from "./pages/Investimentos";
import Configuracoes from "./pages/Configuracoes";
import ConfiguracoesEquipe from "./pages/ConfiguracoesEquipe";
import ConfiguracoesIntegracoes from "./pages/ConfiguracoesIntegracoes";
import SistemaTrocados from "./pages/SistemaTrocados";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WhiteLabelProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oportunidades" element={<Oportunidades />} />
            <Route path="/oportunidades/novo" element={<NovoProjetoConstrucao />} />
            <Route path="/oportunidades/:id" element={<ProjetoDetalhes />} />
            <Route path="/marketplace" element={<MarketplaceExplorar />} />
            <Route path="/marketplace/:id" element={<OportunidadePublica />} />
            <Route path="/incubacoes" element={<Incubacoes />} />
            <Route path="/incubacoes/:id" element={<IncubacaoDetalhes />} />
            <Route path="/usuarios" element={<GestaoUsuarios />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/analise-financeira" element={<AnaliseFinanceira />} />
            <Route path="/analise-territorial" element={<AnaliseTerritorial />} />
            <Route path="/analise-artistas" element={<AnaliseArtistas />} />
            <Route path="/investimentos" element={<Investimentos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/configuracoes/equipe" element={<ConfiguracoesEquipe />} />
            <Route path="/configuracoes/integracoes" element={<ConfiguracoesIntegracoes />} />
            <Route path="/trocados" element={<SistemaTrocados />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </WhiteLabelProvider>
  </QueryClientProvider>
);

export default App;
