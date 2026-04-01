import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WhiteLabelProvider } from "@/contexts/WhiteLabelContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Oportunidades from "./pages/Oportunidades";
import MarketplaceExplorar from "./pages/MarketplaceExplorar";
import OportunidadePublica from "./pages/OportunidadePublica";
import ProjetoDetalhes from "./pages/ProjetoDetalhes";
import NovoProjetoConstrucao from "./pages/NovoProjetoConstrucao";
import NovoProjetoOficina from "./pages/NovoProjetoOficina";
import NovoProjetoEvento from "./pages/NovoProjetoEvento";
import NovoProjetoVaga from "./pages/NovoProjetoVaga";
import NovoProjetoBairro from "./pages/NovoProjetoBairro";
import Incubacoes from "./pages/Incubacoes";
import IncubacaoDetalhes from "./pages/IncubacaoDetalhes";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import DadosDashboard from "./pages/DadosDashboard";
import MeuPerfil from "./pages/MeuPerfil";
import Investimentos from "./pages/Investimentos";
import InvestimentoDetalhes from "./pages/InvestimentoDetalhes";
import Configuracoes from "./pages/Configuracoes";
import ConfiguracoesEquipe from "./pages/ConfiguracoesEquipe";
import ConfiguracoesIntegracoes from "./pages/ConfiguracoesIntegracoes";
import SistemaTrocados from "./pages/SistemaTrocados";
import VitrineDetalhes from "./pages/VitrineDetalhes";
import ColetivosDetalhes from "./pages/ColetivosDetalhes";
import EspacoDetalhes from "./pages/EspacoDetalhes";
import ProjetoImpactoDetalhes from "./pages/ProjetoImpactoDetalhes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WhiteLabelProvider>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public route */}
                <Route path="/" element={<Login />} />
                
                {/* Protected routes - require admin */}
                <Route path="/dashboard" element={<ProtectedRoute><MarketplaceExplorar /></ProtectedRoute>} />
                <Route path="/oportunidades" element={<ProtectedRoute><Oportunidades /></ProtectedRoute>} />
                <Route path="/oportunidades/novo" element={<ProtectedRoute><NovoProjetoConstrucao /></ProtectedRoute>} />
                <Route path="/oportunidades/novo/evento" element={<ProtectedRoute><NovoProjetoEvento /></ProtectedRoute>} />
                <Route path="/oportunidades/novo/vaga" element={<ProtectedRoute><NovoProjetoVaga /></ProtectedRoute>} />
                <Route path="/oportunidades/novo/oficina" element={<ProtectedRoute><NovoProjetoOficina /></ProtectedRoute>} />
                <Route path="/oportunidades/novo/bairro" element={<ProtectedRoute><NovoProjetoBairro /></ProtectedRoute>} />
                <Route path="/oportunidades/:id" element={<ProtectedRoute><ProjetoDetalhes /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><MarketplaceExplorar /></ProtectedRoute>} />
                <Route path="/marketplace/:id" element={<ProtectedRoute><OportunidadePublica /></ProtectedRoute>} />
                <Route path="/vitrine/:id" element={<ProtectedRoute><VitrineDetalhes /></ProtectedRoute>} />
                <Route path="/incubacoes" element={<ProtectedRoute><Incubacoes /></ProtectedRoute>} />
                <Route path="/incubacoes/:id" element={<ProtectedRoute><IncubacaoDetalhes /></ProtectedRoute>} />
                <Route path="/usuarios" element={<ProtectedRoute><GestaoUsuarios /></ProtectedRoute>} />
                <Route path="/dados" element={<ProtectedRoute><DadosDashboard /></ProtectedRoute>} />
                <Route path="/dados/coletivo/:id" element={<ProtectedRoute><ColetivosDetalhes /></ProtectedRoute>} />
                <Route path="/dados/produtora/:id" element={<ProtectedRoute><ColetivosDetalhes /></ProtectedRoute>} />
                <Route path="/dados/espaco/:id" element={<ProtectedRoute><EspacoDetalhes /></ProtectedRoute>} />
                <Route path="/dados/projeto/:id" element={<ProtectedRoute><ProjetoImpactoDetalhes /></ProtectedRoute>} />
                <Route path="/investimentos" element={<ProtectedRoute><Investimentos /></ProtectedRoute>} />
                <Route path="/investimentos/:id" element={<ProtectedRoute><InvestimentoDetalhes /></ProtectedRoute>} />
                <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
                <Route path="/configuracoes/equipe" element={<ProtectedRoute><ConfiguracoesEquipe /></ProtectedRoute>} />
                <Route path="/configuracoes/integracoes" element={<ProtectedRoute><ConfiguracoesIntegracoes /></ProtectedRoute>} />
                <Route path="/perfil" element={<ProtectedRoute><MeuPerfil /></ProtectedRoute>} />
                <Route path="/trocados" element={<ProtectedRoute><SistemaTrocados /></ProtectedRoute>} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </WhiteLabelProvider>
  </QueryClientProvider>
);

export default App;
