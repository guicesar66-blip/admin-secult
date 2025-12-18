import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Lightbulb,
  Megaphone,
  Play,
  Trophy,
  Settings,
  Users,
  Calendar,
} from "lucide-react";
import { FaseConstrucao } from "@/components/projeto/FaseConstrucao";
import { FaseDivulgacao } from "@/components/projeto/FaseDivulgacao";
import { FaseExecucao } from "@/components/projeto/FaseExecucao";
import { FaseResultados } from "@/components/projeto/FaseResultados";

type FaseType = "construcao" | "divulgacao" | "execucao" | "resultados";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  fase: FaseType;
  dataInicio: string;
  prazo: string;
  membros: { id: string; nome: string; papel: string; avatar?: string }[];
  progresso: number;
  responsavel: string;
}

interface LocationState {
  novoProjeto?: Projeto;
  faseInicial?: FaseType;
}

const projetosData: Record<string, Projeto> = {
  "1": {
    id: "1",
    titulo: "Festival de Jazz da Praça",
    descricao: "Festival de música jazz ao ar livre com artistas locais e nacionais",
    tipo: "festival",
    fase: "execucao",
    dataInicio: "2024-01-15",
    prazo: "2024-06-20",
    membros: [
      { id: "1", nome: "Maria Silva", papel: "Produtora" },
      { id: "2", nome: "João Santos", papel: "Diretor Artístico" },
      { id: "3", nome: "Ana Costa", papel: "Marketing" },
    ],
    progresso: 65,
    responsavel: "Maria Silva",
  },
  "2": {
    id: "2",
    titulo: "EP Raízes Urbanas",
    descricao: "EP com 5 faixas misturando hip-hop com elementos regionais",
    tipo: "ep",
    fase: "construcao",
    dataInicio: "2024-02-01",
    prazo: "2024-08-15",
    membros: [
      { id: "1", nome: "João Santos", papel: "Artista" },
      { id: "2", nome: "Pedro Lima", papel: "Produtor Musical" },
    ],
    progresso: 20,
    responsavel: "João Santos",
  },
  "3": {
    id: "3",
    titulo: "Documentário Vozes da Periferia",
    descricao: "Documentário sobre artistas independentes das periferias",
    tipo: "filme",
    fase: "divulgacao",
    dataInicio: "2023-09-10",
    prazo: "2024-04-30",
    membros: [
      { id: "1", nome: "Ana Costa", papel: "Diretora" },
      { id: "2", nome: "Lucas Alves", papel: "Cinegrafista" },
    ],
    progresso: 45,
    responsavel: "Ana Costa",
  },
};

const faseConfig: Record<FaseType, { label: string; icon: React.ReactNode; color: string; step: number }> = {
  construcao: { label: "Construção", icon: <Lightbulb className="h-4 w-4" />, color: "bg-amber-500", step: 1 },
  divulgacao: { label: "Divulgação", icon: <Megaphone className="h-4 w-4" />, color: "bg-blue-500", step: 2 },
  execucao: { label: "Execução", icon: <Play className="h-4 w-4" />, color: "bg-emerald-500", step: 3 },
  resultados: { label: "Resultados", icon: <Trophy className="h-4 w-4" />, color: "bg-purple-500", step: 4 },
};

const fases: FaseType[] = ["construcao", "divulgacao", "execucao", "resultados"];

const ProjetoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  // Verifica se é um novo projeto vindo do fluxo de criação
  const novoProjetoData = state?.novoProjeto;
  const faseInicial = state?.faseInicial;
  
  // Usa o projeto do state se disponível, senão busca dos dados existentes
  const projeto = novoProjetoData || projetosData[id || ""];
  const [activeTab, setActiveTab] = useState<FaseType>(faseInicial || projeto?.fase || "construcao");

  // Atualiza a tab ativa se vier do fluxo de criação
  useEffect(() => {
    if (faseInicial) {
      setActiveTab(faseInicial);
    }
  }, [faseInicial]);

  if (!projeto) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground">Projeto não encontrado</p>
          <Button onClick={() => navigate("/oportunidades")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentStep = faseConfig[projeto.fase].step;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit gap-2"
            onClick={() => navigate("/oportunidades")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos projetos
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{projeto.titulo}</h1>
                <Badge variant="outline" className={`${faseConfig[projeto.fase].color} text-white border-0`}>
                  {faseConfig[projeto.fase].label}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">{projeto.descricao}</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Progresso do Projeto</h3>
            <span className="text-sm text-muted-foreground">{projeto.progresso}% concluído</span>
          </div>
          
          <div className="relative">
            <div className="flex justify-between mb-2">
              {fases.map((fase, index) => {
                const config = faseConfig[fase];
                const isCompleted = config.step < currentStep;
                const isCurrent = config.step === currentStep;
                
                return (
                  <div
                    key={fase}
                    className={`flex flex-col items-center z-10 cursor-pointer transition-opacity ${
                      isCompleted || isCurrent ? "opacity-100" : "opacity-50"
                    }`}
                    onClick={() => setActiveTab(fase)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? config.color + " text-white"
                          : isCurrent
                          ? config.color + " text-white ring-4 ring-offset-2 ring-offset-background " + config.color + "/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {config.icon}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Início: {new Date(projeto.dataInicio).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Prazo: {new Date(projeto.prazo).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{projeto.membros.length} membros</span>
            </div>
          </div>
        </div>

        {/* Tabs de Fases */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FaseType)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {fases.map((fase) => (
              <TabsTrigger key={fase} value={fase} className="gap-2">
                {faseConfig[fase].icon}
                <span className="hidden sm:inline">{faseConfig[fase].label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="construcao">
            <FaseConstrucao projeto={projeto} />
          </TabsContent>

          <TabsContent value="divulgacao">
            <FaseDivulgacao projeto={projeto} />
          </TabsContent>

          <TabsContent value="execucao">
            <FaseExecucao projeto={projeto} />
          </TabsContent>

          <TabsContent value="resultados">
            <FaseResultados projeto={projeto} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProjetoDetalhes;
