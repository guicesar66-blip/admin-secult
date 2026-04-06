import { useState } from "react";
import { ArrowLeft, Plus, FileText, Clock, CheckCircle, XCircle, MessageSquare, Building2, AlertCircle, Calendar, Briefcase, GraduationCap, Lightbulb, ChevronDown, Film, ScrollText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock de projetos e inscrições
interface Projeto {
  id: string;
  nome: string;
  linguagem: string;
  territorio: string;
  orcamento: number;
  dataInscricao?: string;
  protocolo?: string;
  edital?: string;
  status: "ativo" | "rascunho" | "em-analise" | "aprovado" | "rejeitado";
}

interface ProjetoAprovacao {
  id: string;
  tipo: "projeto" | "edital";
  nome: string;
  criador: string;
  descricao: string;
  linguagem: string;
  territorio: string;
  orcamento: number;
  dataSubmissao: string;
  documentos: number;
  status: "pendente";
}

interface Aprovacao {
  id: string;
  itemId: string;
  tipo: "projeto" | "edital";
  resultado: "aprovado" | "rejeitado";
  motivo?: string;
  dataDecisao: string;
  servidor: string;
}

const projetosMock: Projeto[] = [
  {
    id: "proj-1",
    nome: "Orquestra Periférica do Recife",
    linguagem: "Música",
    territorio: "Recife",
    orcamento: 35000,
    status: "ativo",
  },
  {
    id: "proj-2",
    nome: "Festival de Teatro Comunitário",
    linguagem: "Teatro",
    territorio: "Olinda",
    orcamento: 45000,
    status: "ativo",
  },
];

const statusConfig = {
  "ativo": {
    label: "Ativo",
    color: "bg-success/10 text-success border-success/20",
    icon: "✓",
  },
  "rascunho": {
    label: "Rascunho",
    color: "bg-muted text-muted-foreground border-border",
    icon: "−",
  },
  "em-analise": {
    label: "Em Análise",
    color: "bg-amber/10 text-amber border-amber/20",
    icon: "⏳",
  },
  "aprovado": {
    label: "Aprovado",
    color: "bg-success/10 text-success border-success/20",
    icon: "✓",
  },
  "rejeitado": {
    label: "Rejeitado",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: "✕",
  },
};

// Dados mock de aprovações pendentes
const aprovacoesEmPendenteMock: ProjetoAprovacao[] = [
  {
    id: "apr-1",
    tipo: "projeto",
    nome: "Orquestra Periférica do Recife",
    criador: "Associação Cultural Recife Vivo",
    descricao: "Projeto de música erudita que leva cultura sinfônica às comunidades periféricas do Recife, formando jovens músicos e democratizando o acesso à arte.",
    linguagem: "Música",
    territorio: "Recife",
    orcamento: 35000,
    dataSubmissao: "05/04/2026",
    documentos: 5,
    status: "pendente",
  },
  {
    id: "apr-2",
    tipo: "projeto",
    nome: "Festival Maracatu das Nações",
    criador: "Federação Pernambucana de Maracatu",
    descricao: "Celebração anual do Maracatu de Baque Virado reunindo nações de todo Pernambuco, com cortejo, shows, oficinas e exposição fotográfica.",
    linguagem: "Cultura Popular",
    territorio: "Recife",
    orcamento: 48000,
    dataSubmissao: "04/04/2026",
    documentos: 7,
    status: "pendente",
  },
  {
    id: "apr-3",
    tipo: "edital",
    nome: "SIC 2026 — Audiovisual",
    criador: "SECULT Pernambuco",
    descricao: "Edital de Fomento ao Audiovisual com foco em produção de documentários e conteúdo digital.",
    linguagem: "Audiovisual",
    territorio: "Pernambuco",
    orcamento: 150000,
    dataSubmissao: "03/04/2026",
    documentos: 12,
    status: "pendente",
  },
  {
    id: "apr-4",
    tipo: "projeto",
    nome: "Cia de Dança Contemporânea PE",
    criador: "Cia MoviMento PE",
    descricao: "Espetáculo que dialoga com ritmos afro-brasileiros, refletindo sobre corpo, território e identidade nordestina com elenco de dançarinos pernambucanos.",
    linguagem: "Dança",
    territorio: "Recife",
    orcamento: 22000,
    dataSubmissao: "02/04/2026",
    documentos: 6,
    status: "pendente",
  },
  {
    id: "apr-5",
    tipo: "edital",
    nome: "Lei de Incentivo ao Patrimônio Cultural",
    criador: "IPHAN Pernambuco",
    descricao: "Edital para preservação e valorização do patrimônio cultural material e imaterial do estado.",
    linguagem: "Patrimônio",
    territorio: "Pernambuco",
    orcamento: 200000,
    dataSubmissao: "01/04/2026",
    documentos: 15,
    status: "pendente",
  },
];

export default function Projetos() {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState<Projeto[]>(projetosMock);
  const [filtro, setFiltro] = useState<string>("todos");
  const [abaAtiva, setAbaAtiva] = useState<"meus-projetos" | "aprovacoes">("meus-projetos");
  
  // Estados para aprovações
  const [aprovacoesEmPendente, setAprovacoesEmPendente] = useState<ProjetoAprovacao[]>(aprovacoesEmPendenteMock);
  const [aprovacoesFinalizadas, setAprovacoesFinalizadas] = useState<Aprovacao[]>([]);
  const [dialogRecusaAberto, setDialogRecusaAberto] = useState(false);
  const [dialogDetalhesAberto, setDialogDetalhesAberto] = useState(false);
  const [itemDetalhes, setItemDetalhes] = useState<ProjetoAprovacao | null>(null);
  const [itemEmAnalise, setItemEmAnalise] = useState<ProjetoAprovacao | null>(null);
  const [motivo, setMotivo] = useState("");
  const [processandoAprovacao, setProcessandoAprovacao] = useState(false);

  const projetosFiltrados =
    filtro === "todos" ? projetos : projetos.filter((p) => p.status === filtro);

  const contarPorStatus = (status: string) => {
    return projetos.filter((p) => p.status === status).length;
  };

  const handleAprovar = async (item: ProjetoAprovacao) => {
    setProcessandoAprovacao(true);
    // Simular processamento
    await new Promise((r) => setTimeout(r, 1000));
    
    setAprovacoesFinalizadas([
      ...aprovacoesFinalizadas,
      {
        id: `aprv-${Date.now()}`,
        itemId: item.id,
        tipo: item.tipo,
        resultado: "aprovado",
        dataDecisao: new Date().toLocaleDateString("pt-BR"),
        servidor: "Sistema Admin",
      },
    ]);
    
    setAprovacoesEmPendente(
      aprovacoesEmPendente.filter((a) => a.id !== item.id)
    );
    
    setProcessandoAprovacao(false);
    toast.success(`${item.tipo === "projeto" ? "Projeto" : "Edital"} "${item.nome}" aprovado com sucesso!`);
  };

  const handleRecusarClique = (item: ProjetoAprovacao) => {
    setItemEmAnalise(item);
    setMotivo("");
    setDialogRecusaAberto(true);
  };

  const handleRecusarConfirmar = async () => {
    if (!itemEmAnalise || !motivo.trim()) {
      toast.error("Descreva o motivo da recusa");
      return;
    }

    setProcessandoAprovacao(true);
    await new Promise((r) => setTimeout(r, 1000));

    setAprovacoesFinalizadas([
      ...aprovacoesFinalizadas,
      {
        id: `aprv-${Date.now()}`,
        itemId: itemEmAnalise.id,
        tipo: itemEmAnalise.tipo,
        resultado: "rejeitado",
        motivo,
        dataDecisao: new Date().toLocaleDateString("pt-BR"),
        servidor: "Sistema Admin",
      },
    ]);

    setAprovacoesEmPendente(
      aprovacoesEmPendente.filter((a) => a.id !== itemEmAnalise.id)
    );

    setProcessandoAprovacao(false);
    setDialogRecusaAberto(false);
    setItemEmAnalise(null);
    setMotivo("");
    toast.success(`${itemEmAnalise.tipo === "projeto" ? "Projeto" : "Edital"} "${itemEmAnalise.nome}" recusado.`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {abaAtiva === "meus-projetos" ? "Meus Projetos" : "Gestão de Aprovações"}
            </h1>
          </div>
          {abaAtiva === "meus-projetos" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                  <Plus className="h-4 w-4" />
                  Novo projeto
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/evento")} className="gap-3 cursor-pointer">
                  <Film className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">Evento</p>
                    <p className="text-xs text-muted-foreground">Shows, festivais, apresentações</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/vaga")} className="gap-3 cursor-pointer">
                  <Briefcase className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="font-medium">Vaga de Trabalho</p>
                    <p className="text-xs text-muted-foreground">Emprego, freelancer, cachê</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/oficina")} className="gap-3 cursor-pointer">
                  <GraduationCap className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="font-medium">Oficinas</p>
                    <p className="text-xs text-muted-foreground">Cursos, workshops, formações</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/espaco")} className="gap-3 cursor-pointer">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="font-medium">Espaço Cultural</p>
                    <p className="text-xs text-muted-foreground">Teatros, museus, galerias, estúdios</p>
                  </div>
                </DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/edital")} className="gap-3 cursor-pointer">
                  <ScrollText className="h-4 w-4 text-violet-500" />
                  <div>
                    <p className="font-medium">Edital / Chamada</p>
                    <p className="text-xs text-muted-foreground">Editais públicos ou patrocínio privado</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/pesquisa")} className="gap-3 cursor-pointer">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="font-medium">Pesquisa & Ideias</p>
                    <p className="text-xs text-muted-foreground">Sondagens, votações e ideias</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Abas */}
        <div className="max-w-6xl mx-auto px-4 border-t border-border">
          <div className="flex items-center gap-0">
            <Button
              variant={abaAtiva === "meus-projetos" ? "default" : "ghost"}
              className={cn(
                "rounded-none border-b-2 h-12 px-4",
                abaAtiva === "meus-projetos"
                  ? "bg-transparent border-b-violet-600 text-violet-600 hover:bg-transparent"
                  : "border-b-transparent text-muted-foreground hover:bg-transparent"
              )}
              onClick={() => setAbaAtiva("meus-projetos")}
            >
              Meus Projetos
            </Button>
            <Button
              variant={abaAtiva === "aprovacoes" ? "default" : "ghost"}
              className={cn(
                "rounded-none border-b-2 h-12 px-4 flex items-center gap-2",
                abaAtiva === "aprovacoes"
                  ? "bg-transparent border-b-violet-600 text-violet-600 hover:bg-transparent"
                  : "border-b-transparent text-muted-foreground hover:bg-transparent"
              )}
              onClick={() => setAbaAtiva("aprovacoes")}
            >
              <span>Gestão de Aprovações</span>
              {aprovacoesEmPendente.length > 0 && (
                <Badge variant="destructive" className="rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs ml-1">
                  {aprovacoesEmPendente.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {abaAtiva === "meus-projetos" ? (
          <>
            {/* Filtros */}
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-border overflow-auto">
              <Button
                variant={filtro === "todos" ? "default" : "outline"}
                onClick={() => setFiltro("todos")}
                className={cn(
                  filtro === "todos" && "bg-violet-600 hover:bg-violet-700"
                )}
              >
                Todos ({projetos.length})
              </Button>
              <Button
                variant={filtro === "ativo" ? "default" : "outline"}
                onClick={() => setFiltro("ativo")}
                className={cn(
                  filtro === "ativo" && "bg-success hover:bg-success/90"
                )}
              >
                Ativos ({contarPorStatus("ativo")})
              </Button>
              <Button
                variant={filtro === "em-analise" ? "default" : "outline"}
                onClick={() => setFiltro("em-analise")}
                className={cn(
                  filtro === "em-analise" && "bg-amber-500 hover:bg-amber-600"
                )}
              >
                Em Análise ({contarPorStatus("em-analise")})
              </Button>
              <Button
                variant={filtro === "aprovado" ? "default" : "outline"}
                onClick={() => setFiltro("aprovado")}
                className={cn(
                  filtro === "aprovado" && "bg-success hover:bg-success/90"
                )}
              >
                Aprovados ({contarPorStatus("aprovado")})
              </Button>
            </div>

            {/* Grid de projetos */}
            {projetosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Crie seu primeiro projeto para começar
                </p>
                <Button
                  onClick={() => navigate("/oportunidades/novo")}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Criar projeto
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projetosFiltrados.map((projeto) => {
                  const config = statusConfig[projeto.status as keyof typeof statusConfig];
                  return (
                    <Card key={projeto.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">
                              {projeto.nome}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {projeto.linguagem}
                            </p>
                          </div>
                          <Badge
                            className={cn("whitespace-nowrap flex-shrink-0", config.color)}
                            variant="outline"
                          >
                            {config.icon} {config.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Informações */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Território</p>
                            <p className="font-medium text-foreground">
                              {projeto.territorio}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Orçamento</p>
                            <p className="font-medium text-foreground">
                              R$ {projeto.orcamento.toLocaleString("pt-BR")}
                            </p>
                          </div>
                        </div>

                        {/* Protocolo (se for inscrição em edital) */}
                        {projeto.protocolo && (
                          <div className="p-2 rounded bg-muted/50 border border-border">
                            <div className="flex items-center gap-2 text-xs">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Protocolo:
                              </span>
                              <span className="font-mono font-semibold text-foreground">
                                {projeto.protocolo}
                              </span>
                            </div>
                            {projeto.dataInscricao && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                Enviado em {projeto.dataInscricao}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Botões */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              navigate(`/oportunidades/${projeto.id}`)
                            }
                          >
                            Ver detalhes
                          </Button>
                          {projeto.status === "ativo" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1"
                              onClick={() =>
                                navigate(`/oportunidades/${projeto.id}`)
                              }
                            >
                              Editar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Aba de Gestão de Aprovações */}
            {aprovacoesEmPendente.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma aprovação pendente
                </h3>
                <p className="text-muted-foreground">
                  Todos os projetos e editais foram avaliados.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <span>{aprovacoesEmPendente.length} item(ns) pendente(s) de aprovação</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {aprovacoesEmPendente.map((item) => (
                    <Card 
                      key={item.id} 
                      className="border-amber-200/50 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setItemDetalhes(item);
                        setDialogDetalhesAberto(true);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={item.tipo === "projeto" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
                                {item.tipo === "projeto" ? "📁 Projeto" : "📋 Edital"}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">
                              {item.nome}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-2">
                              Por: {item.criador}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Descrição */}
                        <div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.descricao}
                          </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Linguagem</p>
                            <p className="font-medium text-foreground">{item.linguagem}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Território</p>
                            <p className="font-medium text-foreground">{item.territorio}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Orçamento</p>
                            <p className="font-medium text-emerald-600">R$ {item.orcamento.toLocaleString("pt-BR")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Documentos</p>
                            <p className="font-medium text-foreground">{item.documentos} arquivo(s)</p>
                          </div>
                        </div>

                        {/* Data Submissão */}
                        <div className="p-2 rounded bg-muted/50 border border-border text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Submetido em {item.dataSubmissao}
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-foreground"
                            onClick={() => handleRecusarClique(item)}
                            disabled={processandoAprovacao}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Recusar
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleAprovar(item)}
                            disabled={processandoAprovacao}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Histórico de Aprovações */}
                {aprovacoesFinalizadas.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Histórico de Decisões</h3>
                    <div className="space-y-2">
                      {aprovacoesFinalizadas.map((aprovacao) => {
                        const itemInfo = [...aprovacoesEmPendenteMock].find((a) => a.id === aprovacao.itemId);
                        return (
                          <div key={aprovacao.id} className="p-3 rounded border border-border flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {itemInfo?.nome || "Item"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {aprovacao.dataDecisao} • Por {aprovacao.servidor}
                              </p>
                              {aprovacao.motivo && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  Motivo: {aprovacao.motivo}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                aprovacao.resultado === "aprovado"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 ml-2"
                                  : "bg-red-50 text-red-700 border-red-200 ml-2"
                              }
                            >
                              {aprovacao.resultado === "aprovado" ? "✓ Aprovado" : "✕ Recusado"}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Dialog de Recusa */}
      <Dialog open={dialogRecusaAberto} onOpenChange={setDialogRecusaAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              Justificar Recusa
            </DialogTitle>
            <DialogDescription>
              Explique brevemente o motivo pela recusa de <strong>{itemEmAnalise?.nome}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="motivo" className="text-sm font-medium">
                Motivo da Recusa *
              </Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da recusa (falta de documentação, inconsistências, não atende critérios, etc.)"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo 20 caracteres • {motivo.length} caracteres
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogRecusaAberto(false)}
              disabled={processandoAprovacao}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRecusarConfirmar}
              disabled={processandoAprovacao || motivo.trim().length < 20}
            >
              {processandoAprovacao ? "Processando..." : "Confirmar Recusa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogDetalhesAberto} onOpenChange={setDialogDetalhesAberto}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={itemDetalhes?.tipo === "projeto" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}
              >
                {itemDetalhes?.tipo === "projeto" ? "📁 Projeto" : "📋 Edital"}
              </Badge>
              <DialogTitle className="text-xl">{itemDetalhes?.nome}</DialogTitle>
            </div>
            <DialogDescription>
              Detalhamento completo da solicitação
            </DialogDescription>
          </DialogHeader>

          {itemDetalhes && (
            <div className="space-y-6 py-4">
              {/* Criador */}
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">CRIADOR / RESPONSÁVEL</h3>
                <p className="text-base font-medium text-foreground">{itemDetalhes.criador}</p>
              </div>

              {/* Descrição */}
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">DESCRIÇÃO</h3>
                <p className="text-sm text-foreground leading-relaxed">{itemDetalhes.descricao}</p>
              </div>

              {/* Informações Grid */}
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">INFORMAÇÕES</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Linguagem / Categoria</p>
                    <p className="text-sm font-medium text-foreground mt-1">{itemDetalhes.linguagem}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Território</p>
                    <p className="text-sm font-medium text-foreground mt-1">{itemDetalhes.territorio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orçamento</p>
                    <p className="text-sm font-medium text-emerald-600 mt-1">R$ {itemDetalhes.orcamento.toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Documentos Anexos</p>
                    <p className="text-sm font-medium text-foreground mt-1">{itemDetalhes.documentos} arquivo(s)</p>
                  </div>
                </div>
              </div>

              {/* Data de Submissão */}
              <div className="bg-muted/50 p-3 rounded border border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data de Submissão</p>
                    <p className="text-sm font-medium text-foreground">{itemDetalhes.dataSubmissao}</p>
                  </div>
                </div>
              </div>

              {/* Observações Importantes */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">Próximas ações:</p>
                    <p className="text-xs text-amber-800 mt-1">Revise cuidadosamente as informações antes de aprovar ou recusar. Cada decisão será registrada no histórico.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogDetalhesAberto(false)}
            >
              Fechar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-foreground"
              onClick={() => {
                setDialogDetalhesAberto(false);
                if (itemDetalhes) handleRecusarClique(itemDetalhes);
              }}
              disabled={processandoAprovacao}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Recusar
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setDialogDetalhesAberto(false);
                if (itemDetalhes) handleAprovar(itemDetalhes);
              }}
              disabled={processandoAprovacao}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
