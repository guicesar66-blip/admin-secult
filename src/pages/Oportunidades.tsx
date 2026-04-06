import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  ChevronDown,
  Film,
  Palette,
  Theater,
  Music,
  ScrollText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  AlertCircle,
  FileText,
  Lightbulb,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { PROJETOS_VITRINE_MOCK, type ProjetoStatus } from "@/data/mockVitrine";
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
import { cn } from "@/lib/utils";

const PROJETO_STATUS_CONFIG: Record<ProjetoStatus, { label: string; color: string }> = {
  rascunho:          { label: "Rascunho",         color: "bg-zinc-500/15 text-zinc-600 border-zinc-500/30" },
  submetido:         { label: "Submetido",         color: "bg-primary/15 text-primary border-primary/30" },
  em_analise:        { label: "Em Análise",        color: "bg-violet-500/15 text-violet-700 border-violet-500/30" },
  aprovado:          { label: "Aprovado",          color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  em_execucao:       { label: "Em Execução",       color: "bg-sky-500/15 text-sky-700 border-sky-500/30" },
  prestacao_enviada: { label: "Prestação Enviada", color: "bg-accent/15 text-accent-dark border-accent/30" },
  concluido:         { label: "Concluído",         color: "bg-success/15 text-pe-green-dark border-success/30" },
};

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-4 w-4" />, color: "bg-primary/20 text-primary" },
  vaga: { label: "Vaga", icon: <Briefcase className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600" },
  oficina: { label: "Oficina", icon: <GraduationCap className="h-4 w-4" />, color: "bg-accent/20 text-accent-dark" },
  festival: { label: "Festival", icon: <Users className="h-4 w-4" />, color: "bg-violet-500/20 text-violet-600" },
  filme: { label: "Filme/Doc", icon: <Film className="h-4 w-4" />, color: "bg-cyan-500/20 text-cyan-600" },
  exposicao: { label: "Exposição", icon: <Palette className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600" },
  teatro: { label: "Teatro", icon: <Theater className="h-4 w-4" />, color: "bg-accent/20 text-accent-dark" },
  ep: { label: "EP/Álbum", icon: <Music className="h-4 w-4" />, color: "bg-pink-500/20 text-pink-600" },
  projeto_bairro: { label: "Projeto de Bairro", icon: <MapPin className="h-4 w-4" />, color: "bg-primary/20 text-pe-blue-dark" },
};

// Interfaces para Aprovações
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

// Dados mock de aprovações
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

const Oportunidades = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
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

  const projetos = PROJETOS_VITRINE_MOCK.map((p) => ({
    id: p.id,
    titulo: p.titulo,
    tipo: p.tipo,
    local: p.local,
    data: p.dataEvento,
    vagas: p.vagas,
    projetoStatus: p.projetoStatus,
    isOficina: p.isOficina,
  }));

  const projetosFiltrados = projetos.filter((projeto) => {
    const matchSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === "todos" || projeto.tipo === filtroTipo;
    return matchSearch && matchTipo;
  });

  const estatisticas = {
    total: projetos.length,
    evento: projetos.filter((p) => p.tipo === "evento").length,
    festival: projetos.filter((p) => p.tipo === "festival").length,
    filme: projetos.filter((p) => p.tipo === "filme").length,
    exposicao: projetos.filter((p) => p.tipo === "exposicao").length,
    teatro: projetos.filter((p) => p.tipo === "teatro").length,
    ep: projetos.filter((p) => p.tipo === "ep").length,
  };

  const handleAprovar = async (item: ProjetoAprovacao) => {
    setProcessandoAprovacao(true);
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Projetos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus projetos culturais em todas as fases</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Projeto
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/evento")}
                className="gap-3 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Eventos</p>
                  <p className="text-xs text-muted-foreground">Shows, festivais, apresentações</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/vaga")}
                className="gap-3 cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-medium">Vaga de Trabalho</p>
                  <p className="text-xs text-muted-foreground">Emprego, freelancer, cachê</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/oficina")}
                className="gap-3 cursor-pointer"
              >
                <GraduationCap className="h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium">Oficinas</p>
                  <p className="text-xs text-muted-foreground">Cursos, workshops, formações</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/espaco")}
                className="gap-3 cursor-pointer"
              >
                <Building2 className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Espaço Cultural</p>
                  <p className="text-xs text-muted-foreground">Teatros, museus, galerias, estúdios</p>
                </div>
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/edital")}
                className="gap-3 cursor-pointer"
              >
                <ScrollText className="h-4 w-4 text-violet-500" />
                <div>
                  <p className="font-medium">Edital / Chamada</p>
                  <p className="text-xs text-muted-foreground">Editais públicos ou patrocínio privado</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/pesquisa")}
                className="gap-3 cursor-pointer"
              >
                <Lightbulb className="h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium">Pesquisa & Ideias</p>
                  <p className="text-xs text-muted-foreground">Sondagens, votações e ideias</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Abas */}
        <div className="border-b border-border">
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
                <Badge 
                  variant="destructive" 
                  className="rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs ml-1"
                >
                  {aprovacoesEmPendente.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Conteúdo Condicional */}
        {abaAtiva === "meus-projetos" ? (
          <>
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </CardContent>
              </Card>
              {(["evento", "festival", "filme", "teatro"] as const).map((tipo) => (
                <Card key={tipo} className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${tipoConfig[tipo].color}`}>{tipoConfig[tipo].icon}</div>
                      <div>
                        <div className="text-xl font-bold">{estatisticas[tipo] || 0}</div>
                        <div className="text-xs text-muted-foreground">{tipoConfig[tipo].label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar projetos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="evento">Eventos</SelectItem>
                      <SelectItem value="festival">Festivais</SelectItem>
                      <SelectItem value="filme">Filmes/Docs</SelectItem>
                      <SelectItem value="exposicao">Exposições</SelectItem>
                      <SelectItem value="teatro">Teatro</SelectItem>
                      <SelectItem value="ep">EP/Álbum</SelectItem>
                      <SelectItem value="oficina">Oficinas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabela */}
            <Card>
              <CardHeader>
                <CardTitle>Projetos ({projetosFiltrados.length})</CardTitle>
              </CardHeader>
              <CardContent>
            {projetosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum projeto encontrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Público</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projetosFiltrados.map((projeto) => {
                    const config = tipoConfig[projeto.tipo] || tipoConfig.evento;
                    return (
                      <TableRow
                        key={projeto.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          navigate(`/oportunidades/${projeto.id}`)
                        }
                      >
                        <TableCell>
                          <div className="font-medium">{projeto.titulo}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            <span className="flex items-center gap-1.5">
                              {config.icon}
                              {config.label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{projeto.local}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {projeto.data
                            ? new Date(projeto.data).toLocaleDateString("pt-BR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={PROJETO_STATUS_CONFIG[projeto.projetoStatus].color}
                          >
                            {PROJETO_STATUS_CONFIG[projeto.projetoStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{projeto.vagas || "-"}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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
                      className="border-accent/30/50 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setItemDetalhes(item);
                        setDialogDetalhesAberto(true);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={item.tipo === "projeto" ? "bg-neutral-50 text-pe-blue-dark border-neutral-200" : "bg-neutral-50 text-pe-blue-dark border-primary/30"}>
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
                                  : "bg-pe-red-lighter text-pe-red-dark border-error/30 ml-2"
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
      </div>

      {/* Dialog de Recusa */}
      <Dialog open={dialogRecusaAberto} onOpenChange={setDialogRecusaAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent-dark" />
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
                className={itemDetalhes?.tipo === "projeto" ? "bg-neutral-50 text-pe-blue-dark border-neutral-200" : "bg-neutral-50 text-pe-blue-dark border-primary/30"}
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
              <div className="bg-pe-yellow-lighter border border-accent/30 p-3 rounded">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-accent-dark flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">Próximas ações:</p>
                    <p className="text-xs text-pe-orange-dark mt-1">Revise cuidadosamente as informações antes de aprovar ou recusar. Cada decisão será registrada no histórico.</p>
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
    </DashboardLayout>
  );
};

export default Oportunidades;
