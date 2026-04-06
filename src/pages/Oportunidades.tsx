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
  Star,
  Eye,
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

// ═══════════════════════════════════════════════════════
// TIPOS E DADOS MOCK — GESTÃO DE APROVAÇÕES
// ═══════════════════════════════════════════════════════

type TipoAprovacao = "projeto" | "edital" | "espaco" | "pesquisa";

interface ItemAprovacao {
  id: string;
  tipo: TipoAprovacao;
  nome: string;
  criador: string;
  descricao: string;
  dataSubmissao: string;
  status: "pendente";
  // Campos comuns
  linguagem?: string;
  territorio?: string;
  orcamento?: number;
  documentos?: number;
  // Campos de Edital
  modalidade?: string;
  valorTotal?: number;
  prazoInscricao?: string;
  publicoAlvo?: string;
  criteriosAvaliacao?: string[];
  // Campos de Espaço Cultural
  tipoEspaco?: string;
  endereco?: string;
  capacidade?: number;
  acessibilidade?: string[];
  infraestrutura?: string[];
  horarioFuncionamento?: string;
  // Campos de Pesquisa
  tipoPesquisa?: string;
  totalRespostas?: number;
  periodoColeta?: string;
  perguntasResumo?: { pergunta: string; resumo: string }[];
  resultadosChave?: string[];
}

interface Aprovacao {
  id: string;
  itemId: string;
  tipo: TipoAprovacao;
  resultado: "aprovado" | "rejeitado";
  motivo?: string;
  dataDecisao: string;
  servidor: string;
}

const TIPO_APROVACAO_CONFIG: Record<TipoAprovacao, { label: string; icon: React.ReactNode; cor: string; bgCor: string }> = {
  projeto:  { label: "Projetos",          icon: <FileText className="h-4 w-4" />,   cor: "text-primary",      bgCor: "bg-primary/10 border-primary/30" },
  edital:   { label: "Editais",           icon: <ScrollText className="h-4 w-4" />, cor: "text-violet-600",   bgCor: "bg-violet-500/10 border-violet-500/30" },
  espaco:   { label: "Espaços Culturais", icon: <Building2 className="h-4 w-4" />,  cor: "text-success",      bgCor: "bg-success/10 border-success/30" },
  pesquisa: { label: "Pesquisas",         icon: <Lightbulb className="h-4 w-4" />,  cor: "text-accent-dark",  bgCor: "bg-accent/10 border-accent/30" },
};

const aprovacoesEmPendenteMock: ItemAprovacao[] = [
  // Projetos
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
    id: "apr-4",
    tipo: "projeto",
    nome: "Cia de Dança Contemporânea PE",
    criador: "Cia MoviMento PE",
    descricao: "Espetáculo que dialoga com ritmos afro-brasileiros, refletindo sobre corpo, território e identidade nordestina.",
    linguagem: "Dança",
    territorio: "Recife",
    orcamento: 22000,
    dataSubmissao: "02/04/2026",
    documentos: 6,
    status: "pendente",
  },
  // Editais
  {
    id: "apr-3",
    tipo: "edital",
    nome: "SIC 2026 — Audiovisual",
    criador: "SECULT Pernambuco",
    descricao: "Edital de Fomento ao Audiovisual com foco em produção de documentários e conteúdo digital para plataformas regionais.",
    linguagem: "Audiovisual",
    territorio: "Pernambuco",
    orcamento: 150000,
    dataSubmissao: "03/04/2026",
    documentos: 12,
    status: "pendente",
    modalidade: "Fomento Direto",
    valorTotal: 500000,
    prazoInscricao: "30/05/2026",
    publicoAlvo: "Produtoras audiovisuais com CNPJ ativo em PE",
    criteriosAvaliacao: [
      "Relevância cultural e temática regional",
      "Viabilidade técnica e financeira",
      "Impacto social e democratização do acesso",
      "Experiência da equipe proponente",
    ],
  },
  {
    id: "apr-5",
    tipo: "edital",
    nome: "Lei de Incentivo ao Patrimônio Cultural",
    criador: "IPHAN Pernambuco",
    descricao: "Edital para preservação e valorização do patrimônio cultural material e imaterial do estado de Pernambuco.",
    linguagem: "Patrimônio",
    territorio: "Pernambuco",
    orcamento: 200000,
    dataSubmissao: "01/04/2026",
    documentos: 15,
    status: "pendente",
    modalidade: "Lei de Incentivo",
    valorTotal: 800000,
    prazoInscricao: "15/06/2026",
    publicoAlvo: "Entidades culturais sem fins lucrativos",
    criteriosAvaliacao: [
      "Valor histórico e artístico do bem cultural",
      "Metodologia de preservação proposta",
      "Plano de sustentabilidade a longo prazo",
    ],
  },
  // Espaços Culturais
  {
    id: "apr-6",
    tipo: "espaco",
    nome: "Centro Cultural Casa Amarela",
    criador: "Coletivo Casa Amarela Viva",
    descricao: "Espaço multifuncional com galeria, sala de ensaio e auditório para 120 pessoas, no coração de Casa Amarela. Foco em cultura popular e arte contemporânea.",
    territorio: "Recife — Casa Amarela",
    dataSubmissao: "04/04/2026",
    documentos: 8,
    status: "pendente",
    tipoEspaco: "Centro Cultural",
    endereco: "Rua Dr. José de Goes, 450 — Casa Amarela, Recife/PE",
    capacidade: 120,
    acessibilidade: ["Rampa de acesso", "Banheiro PCD", "Piso tátil", "Intérprete de Libras sob demanda"],
    infraestrutura: ["Palco 8x6m", "Sistema de som 5kW", "Projetor 4K", "Camarim com espelho", "Wi-Fi 300Mbps"],
    horarioFuncionamento: "Terça a Domingo, 10h às 22h",
  },
  {
    id: "apr-7",
    tipo: "espaco",
    nome: "Ateliê Beira-Rio",
    criador: "Associação dos Artistas do Capibaribe",
    descricao: "Ateliê colaborativo às margens do Rio Capibaribe, com espaço para artes visuais, cerâmica e serigrafia. Aberto para residências artísticas.",
    territorio: "Recife — Torre",
    dataSubmissao: "02/04/2026",
    documentos: 5,
    status: "pendente",
    tipoEspaco: "Ateliê / Estúdio",
    endereco: "Av. Beira Rio, 1200 — Torre, Recife/PE",
    capacidade: 30,
    acessibilidade: ["Rampa de acesso", "Banheiro PCD"],
    infraestrutura: ["Forno cerâmico", "Bancadas de trabalho", "Impressora serigrafia", "Área externa coberta"],
    horarioFuncionamento: "Segunda a Sábado, 8h às 20h",
  },
  // Pesquisas
  {
    id: "apr-8",
    tipo: "pesquisa",
    nome: "Mapeamento de Necessidades Culturais — Zona Norte",
    criador: "Observatório Cultural PE",
    descricao: "Pesquisa com agentes culturais da Zona Norte do Recife para identificar demandas prioritárias de infraestrutura, formação e fomento.",
    territorio: "Recife — Zona Norte",
    dataSubmissao: "03/04/2026",
    documentos: 3,
    status: "pendente",
    tipoPesquisa: "Mapeamento territorial",
    totalRespostas: 247,
    periodoColeta: "01/03/2026 a 31/03/2026",
    perguntasResumo: [
      { pergunta: "Qual a principal necessidade do seu território?", resumo: "52% indicaram 'espaços de ensaio/apresentação', 28% 'acesso a editais', 20% 'formação técnica'" },
      { pergunta: "Você já acessou algum edital público?", resumo: "67% nunca acessaram; 22% tentaram sem sucesso; 11% foram aprovados" },
      { pergunta: "Como avalia a infraestrutura cultural do bairro?", resumo: "Média 2.3/5 — 'precária' foi o termo mais citado" },
      { pergunta: "Que tipo de apoio seria mais útil?", resumo: "45% 'mentoria para editais', 30% 'equipamentos', 25% 'transporte'" },
    ],
    resultadosChave: [
      "87% dos agentes culturais atuam na informalidade",
      "Apenas 3 espaços culturais ativos para 45 mil habitantes",
      "Renda média cultural de R$ 1.200/mês na região",
      "74% desconhecem os mecanismos de fomento estadual",
    ],
  },
  {
    id: "apr-9",
    tipo: "pesquisa",
    nome: "Sondagem: Prioridades do SIC 2027",
    criador: "SECULT Pernambuco",
    descricao: "Consulta pública para definir as linguagens e linhas prioritárias do Sistema de Incentivo à Cultura 2027.",
    territorio: "Pernambuco",
    dataSubmissao: "01/04/2026",
    documentos: 2,
    status: "pendente",
    tipoPesquisa: "Consulta pública",
    totalRespostas: 1842,
    periodoColeta: "15/02/2026 a 15/03/2026",
    perguntasResumo: [
      { pergunta: "Quais linguagens devem ser priorizadas?", resumo: "1º Cultura Popular (34%), 2º Audiovisual (22%), 3º Música (18%), 4º Teatro (14%), Outros (12%)" },
      { pergunta: "Qual o valor mínimo adequado por projeto?", resumo: "Mediana R$ 30.000; 38% pedem acima de R$ 50.000" },
      { pergunta: "O processo seletivo atual é acessível?", resumo: "56% consideram 'burocrático demais'; 31% 'razoável'; 13% 'acessível'" },
    ],
    resultadosChave: [
      "Cultura Popular é a linguagem mais demandada pelo 3º ano consecutivo",
      "Pedido de simplificação dos formulários por 56% dos respondentes",
      "Interior concentra 62% das respostas — demanda por descentralização",
    ],
  },
];

// ═══════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════

const Oportunidades = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [abaAtiva, setAbaAtiva] = useState<"meus-projetos" | "aprovacoes">("meus-projetos");

  // Estados para aprovações
  const [aprovacoesEmPendente, setAprovacoesEmPendente] = useState<ItemAprovacao[]>(aprovacoesEmPendenteMock);
  const [aprovacoesFinalizadas, setAprovacoesFinalizadas] = useState<Aprovacao[]>([]);
  const [filtroAprovacao, setFiltroAprovacao] = useState<TipoAprovacao | "todos">("todos");
  const [dialogRecusaAberto, setDialogRecusaAberto] = useState(false);
  const [dialogDetalhesAberto, setDialogDetalhesAberto] = useState(false);
  const [itemDetalhes, setItemDetalhes] = useState<ItemAprovacao | null>(null);
  const [itemEmAnalise, setItemEmAnalise] = useState<ItemAprovacao | null>(null);
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

  // Contagem por tipo de aprovação
  const contagemAprovacao = {
    projeto: aprovacoesEmPendente.filter((a) => a.tipo === "projeto").length,
    edital: aprovacoesEmPendente.filter((a) => a.tipo === "edital").length,
    espaco: aprovacoesEmPendente.filter((a) => a.tipo === "espaco").length,
    pesquisa: aprovacoesEmPendente.filter((a) => a.tipo === "pesquisa").length,
  };

  const aprovacoesFiltradas =
    filtroAprovacao === "todos"
      ? aprovacoesEmPendente
      : aprovacoesEmPendente.filter((a) => a.tipo === filtroAprovacao);

  const handleAprovar = async (item: ItemAprovacao) => {
    setProcessandoAprovacao(true);
    await new Promise((r) => setTimeout(r, 1000));

    setAprovacoesFinalizadas((prev) => [
      ...prev,
      {
        id: `aprv-${Date.now()}`,
        itemId: item.id,
        tipo: item.tipo,
        resultado: "aprovado",
        dataDecisao: new Date().toLocaleDateString("pt-BR"),
        servidor: "Sistema Admin",
      },
    ]);

    setAprovacoesEmPendente((prev) => prev.filter((a) => a.id !== item.id));
    setProcessandoAprovacao(false);
    const labelTipo = TIPO_APROVACAO_CONFIG[item.tipo].label.slice(0, -1);
    toast.success(`${labelTipo} "${item.nome}" aprovado com sucesso!`);
  };

  const handleRecusarClique = (item: ItemAprovacao) => {
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

    setAprovacoesFinalizadas((prev) => [
      ...prev,
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

    setAprovacoesEmPendente((prev) => prev.filter((a) => a.id !== itemEmAnalise.id));
    setProcessandoAprovacao(false);
    setDialogRecusaAberto(false);
    setItemEmAnalise(null);
    setMotivo("");
    const labelTipo = TIPO_APROVACAO_CONFIG[itemEmAnalise.tipo].label.slice(0, -1);
    toast.success(`${labelTipo} "${itemEmAnalise.nome}" recusado.`);
  };

  // ═══════════════════════════════════════════════════════
  // RENDERIZAÇÃO DO DETALHE POR TIPO
  // ═══════════════════════════════════════════════════════

  const renderDetalhesPorTipo = (item: ItemAprovacao) => {
    switch (item.tipo) {
      case "projeto":
        return (
          <>
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">INFORMAÇÕES DO PROJETO</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Linguagem</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.linguagem}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Território</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.territorio}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Orçamento</p>
                  <p className="text-sm font-medium text-success mt-1">R$ {item.orcamento?.toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Documentos Anexos</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.documentos} arquivo(s)</p>
                </div>
              </div>
            </div>
          </>
        );

      case "edital":
        return (
          <>
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">DADOS DO EDITAL</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Modalidade</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.modalidade}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Linguagem / Área</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.linguagem}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor Total do Edital</p>
                  <p className="text-sm font-medium text-success mt-1">R$ {item.valorTotal?.toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Prazo de Inscrição</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.prazoInscricao}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Público-Alvo</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.publicoAlvo}</p>
                </div>
              </div>
            </div>
            {item.criteriosAvaliacao && (
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">CRITÉRIOS DE AVALIAÇÃO</h3>
                <ul className="space-y-2">
                  {item.criteriosAvaliacao.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Star className="h-3.5 w-3.5 text-accent-dark mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      case "espaco":
        return (
          <>
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">DADOS DO ESPAÇO</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tipo de Espaço</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.tipoEspaco}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Capacidade</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.capacidade} pessoas</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Endereço</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.endereco}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Funcionamento</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.horarioFuncionamento}</p>
                </div>
              </div>
            </div>
            {item.acessibilidade && (
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">ACESSIBILIDADE</h3>
                <div className="flex flex-wrap gap-2">
                  {item.acessibilidade.map((a, i) => (
                    <Badge key={i} variant="outline" className="bg-success/10 text-success-dark border-success/30">
                      ✓ {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {item.infraestrutura && (
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">INFRAESTRUTURA</h3>
                <div className="flex flex-wrap gap-2">
                  {item.infraestrutura.map((inf, i) => (
                    <Badge key={i} variant="outline" className="bg-neutral-100 text-foreground border-border">
                      {inf}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case "pesquisa":
        return (
          <>
            <div className="border-b border-border pb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">DADOS DA PESQUISA</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tipo de Pesquisa</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.tipoPesquisa}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total de Respostas</p>
                  <p className="text-sm font-medium text-primary mt-1">{item.totalRespostas?.toLocaleString("pt-BR")}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Período de Coleta</p>
                  <p className="text-sm font-medium text-foreground mt-1">{item.periodoColeta}</p>
                </div>
              </div>
            </div>
            {item.perguntasResumo && (
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">RESUMO DAS RESPOSTAS</h3>
                <div className="space-y-3">
                  {item.perguntasResumo.map((pr, i) => (
                    <div key={i} className="bg-neutral-50 rounded-lg p-3 border border-border">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {i + 1}. {pr.pergunta}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{pr.resumo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {item.resultadosChave && (
              <div className="border-b border-border pb-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">RESULTADOS-CHAVE</h3>
                <ul className="space-y-2">
                  {item.resultadosChave.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <AlertCircle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════
  // CARD RESUMO POR ITEM
  // ═══════════════════════════════════════════════════════

  const renderCardResumo = (item: ItemAprovacao) => {
    const config = TIPO_APROVACAO_CONFIG[item.tipo];
    return (
      <div className="grid grid-cols-2 gap-3 text-sm">
        {item.linguagem && (
          <div>
            <p className="text-muted-foreground text-xs">Linguagem</p>
            <p className="font-medium text-foreground">{item.linguagem}</p>
          </div>
        )}
        {item.territorio && (
          <div>
            <p className="text-muted-foreground text-xs">Território</p>
            <p className="font-medium text-foreground">{item.territorio}</p>
          </div>
        )}
        {item.orcamento != null && (
          <div>
            <p className="text-muted-foreground text-xs">Orçamento</p>
            <p className="font-medium text-success">R$ {item.orcamento.toLocaleString("pt-BR")}</p>
          </div>
        )}
        {item.valorTotal != null && (
          <div>
            <p className="text-muted-foreground text-xs">Valor Total</p>
            <p className="font-medium text-success">R$ {item.valorTotal.toLocaleString("pt-BR")}</p>
          </div>
        )}
        {item.tipoEspaco && (
          <div>
            <p className="text-muted-foreground text-xs">Tipo</p>
            <p className="font-medium text-foreground">{item.tipoEspaco}</p>
          </div>
        )}
        {item.capacidade != null && (
          <div>
            <p className="text-muted-foreground text-xs">Capacidade</p>
            <p className="font-medium text-foreground">{item.capacidade} pessoas</p>
          </div>
        )}
        {item.tipoPesquisa && (
          <div>
            <p className="text-muted-foreground text-xs">Tipo</p>
            <p className="font-medium text-foreground">{item.tipoPesquisa}</p>
          </div>
        )}
        {item.totalRespostas != null && (
          <div>
            <p className="text-muted-foreground text-xs">Respostas</p>
            <p className="font-medium text-primary">{item.totalRespostas.toLocaleString("pt-BR")}</p>
          </div>
        )}
        {item.documentos != null && (
          <div>
            <p className="text-muted-foreground text-xs">Documentos</p>
            <p className="font-medium text-foreground">{item.documentos} arquivo(s)</p>
          </div>
        )}
      </div>
    );
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
              <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/evento")} className="gap-3 cursor-pointer">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Eventos</p>
                  <p className="text-xs text-muted-foreground">Shows, festivais, apresentações</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/vaga")} className="gap-3 cursor-pointer">
                <Briefcase className="h-4 w-4 text-success" />
                <div>
                  <p className="font-medium">Vaga de Trabalho</p>
                  <p className="text-xs text-muted-foreground">Emprego, freelancer, cachê</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/oficina")} className="gap-3 cursor-pointer">
                <GraduationCap className="h-4 w-4 text-accent-dark" />
                <div>
                  <p className="font-medium">Oficinas</p>
                  <p className="text-xs text-muted-foreground">Cursos, workshops, formações</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/oportunidades/novo/espaco")} className="gap-3 cursor-pointer">
                <Building2 className="h-4 w-4 text-primary" />
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
                <Lightbulb className="h-4 w-4 text-accent-dark" />
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
                  ? "bg-transparent border-b-primary text-primary hover:bg-transparent"
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
                  ? "bg-transparent border-b-primary text-primary hover:bg-transparent"
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

        {/* ═══════════════════════════════════════════
            CONTEÚDO: MEUS PROJETOS
        ═══════════════════════════════════════════ */}
        {abaAtiva === "meus-projetos" ? (
          <>
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

            <Card>
              <CardHeader>
                <CardTitle>Projetos ({projetosFiltrados.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {projetosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Nenhum projeto encontrado.</div>
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
                            onClick={() => navigate(`/oportunidades/${projeto.id}`)}
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
                              {projeto.data ? new Date(projeto.data).toLocaleDateString("pt-BR") : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={PROJETO_STATUS_CONFIG[projeto.projetoStatus].color}>
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
            {/* ═══════════════════════════════════════════
                CONTEÚDO: GESTÃO DE APROVAÇÕES
            ═══════════════════════════════════════════ */}

            {/* KPI Cards por tipo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(TIPO_APROVACAO_CONFIG) as TipoAprovacao[]).map((tipo) => {
                const cfg = TIPO_APROVACAO_CONFIG[tipo];
                const count = contagemAprovacao[tipo];
                return (
                  <Card
                    key={tipo}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md border",
                      filtroAprovacao === tipo ? cfg.bgCor : "bg-card"
                    )}
                    onClick={() => setFiltroAprovacao(filtroAprovacao === tipo ? "todos" : tipo)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", cfg.bgCor)}>
                          <span className={cfg.cor}>{cfg.icon}</span>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">{cfg.label}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Filtro ativo indicator */}
            {filtroAprovacao !== "todos" && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("gap-1", TIPO_APROVACAO_CONFIG[filtroAprovacao].bgCor)}>
                  {TIPO_APROVACAO_CONFIG[filtroAprovacao].icon}
                  Filtrando: {TIPO_APROVACAO_CONFIG[filtroAprovacao].label}
                </Badge>
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setFiltroAprovacao("todos")}>
                  Limpar filtro
                </Button>
              </div>
            )}

            {aprovacoesFiltradas.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma aprovação pendente</h3>
                <p className="text-muted-foreground">
                  {filtroAprovacao !== "todos"
                    ? `Não há ${TIPO_APROVACAO_CONFIG[filtroAprovacao].label.toLowerCase()} pendentes.`
                    : "Todos os itens foram avaliados."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>{aprovacoesFiltradas.length} item(ns) pendente(s) de aprovação</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {aprovacoesFiltradas.map((item) => {
                    const cfg = TIPO_APROVACAO_CONFIG[item.tipo];
                    return (
                      <Card
                        key={item.id}
                        className="hover:shadow-md transition-shadow cursor-pointer border"
                        onClick={() => {
                          setItemDetalhes(item);
                          setDialogDetalhesAberto(true);
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={cn("gap-1", cfg.bgCor)}>
                                  {cfg.icon}
                                  {cfg.label.slice(0, -1)}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg line-clamp-2">{item.nome}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-2">Por: {item.criador}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemDetalhes(item);
                                setDialogDetalhesAberto(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.descricao}</p>

                          {renderCardResumo(item)}

                          <div className="p-2 rounded bg-muted/50 border border-border text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Submetido em {item.dataSubmissao}
                          </div>

                          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleRecusarClique(item)}
                              disabled={processandoAprovacao}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Recusar
                            </Button>
                            <Button
                              size="sm"
                              variant="success"
                              className="flex-1"
                              onClick={() => handleAprovar(item)}
                              disabled={processandoAprovacao}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Histórico de Aprovações */}
                {aprovacoesFinalizadas.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Histórico de Decisões</h3>
                    <div className="space-y-2">
                      {aprovacoesFinalizadas.map((aprovacao) => {
                        const itemInfo = aprovacoesEmPendenteMock.find((a) => a.id === aprovacao.itemId);
                        const cfg = TIPO_APROVACAO_CONFIG[aprovacao.tipo];
                        return (
                          <div key={aprovacao.id} className="p-3 rounded-lg border border-border flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={cn("gap-1 text-xs", cfg.bgCor)}>
                                  {cfg.icon}
                                  {cfg.label.slice(0, -1)}
                                </Badge>
                                <p className="text-sm font-medium text-foreground">{itemInfo?.nome || "Item"}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {aprovacao.dataDecisao} • Por {aprovacao.servidor}
                              </p>
                              {aprovacao.motivo && (
                                <p className="text-xs text-muted-foreground mt-1 italic">Motivo: {aprovacao.motivo}</p>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                aprovacao.resultado === "aprovado"
                                  ? "bg-pe-green-light text-pe-green-dark border-success/30 ml-2"
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

      {/* ═══════════════════════════════════════════
          DIALOG: RECUSA
      ═══════════════════════════════════════════ */}
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
              <p className="text-xs text-muted-foreground mt-1">Mínimo 20 caracteres • {motivo.length} caracteres</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDialogRecusaAberto(false)} disabled={processandoAprovacao}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRecusarConfirmar} disabled={processandoAprovacao || motivo.trim().length < 20}>
              {processandoAprovacao ? "Processando..." : "Confirmar Recusa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════
          DIALOG: DETALHES — ADAPTADO POR TIPO
      ═══════════════════════════════════════════ */}
      <Dialog open={dialogDetalhesAberto} onOpenChange={setDialogDetalhesAberto}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {itemDetalhes && (
                <Badge variant="outline" className={cn("gap-1", TIPO_APROVACAO_CONFIG[itemDetalhes.tipo].bgCor)}>
                  {TIPO_APROVACAO_CONFIG[itemDetalhes.tipo].icon}
                  {TIPO_APROVACAO_CONFIG[itemDetalhes.tipo].label.slice(0, -1)}
                </Badge>
              )}
              <DialogTitle className="text-xl">{itemDetalhes?.nome}</DialogTitle>
            </div>
            <DialogDescription>Detalhamento completo da solicitação</DialogDescription>
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

              {/* Conteúdo específico por tipo */}
              {renderDetalhesPorTipo(itemDetalhes)}

              {/* Data de Submissão */}
              <div className="bg-muted/50 p-3 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data de Submissão</p>
                    <p className="text-sm font-medium text-foreground">{itemDetalhes.dataSubmissao}</p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="bg-pe-yellow-lighter border border-accent/30 p-3 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-accent-dark flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-pe-orange-dark">Próximas ações:</p>
                    <p className="text-xs text-pe-orange-dark mt-1">
                      Revise cuidadosamente as informações antes de aprovar ou recusar. Cada decisão será registrada no histórico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogDetalhesAberto(false)}>
              Fechar
            </Button>
            <Button
              size="sm"
              variant="outline"
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
              variant="success"
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
