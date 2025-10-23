import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Oportunidades from "./pages/Oportunidades";
import Incubacoes from "./pages/Incubacoes";
import AnaliseFinanceira from "./pages/AnaliseFinanceira";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/oportunidades" element={<Oportunidades />} />
          <Route path="/incubacoes" element={<Incubacoes />} />
          <Route path="/analise-financeira" element={<AnaliseFinanceira />} />
          <Route
            path="/analise-territorial"
            element={
              <PlaceholderPage
                title="Análise Territorial"
                description="Mapa ZEIS/CIS e distribuição de artistas por região"
              />
            }
          />
          <Route
            path="/analise-artistas"
            element={
              <PlaceholderPage
                title="Análise de Artistas"
                description="Perfil demográfico e engajamento dos artistas"
              />
            }
          />
          <Route
            path="/analise-carreiras"
            element={
              <PlaceholderPage
                title="Análise de Carreiras"
                description="Progressão e dados pós-incubação"
              />
            }
          />
          <Route
            path="/aprovacoes"
            element={
              <PlaceholderPage
                title="Aprovações Individuais"
                description="Recursos aguardando decisão da SECULT"
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
