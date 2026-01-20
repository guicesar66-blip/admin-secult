import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Target,
  GraduationCap,
  Briefcase,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Wallet,
  Activity,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useOportunidades } from "@/hooks/useOportunidades";
import { useOficinas } from "@/hooks/useOficinas";
import { usePropostasRecebidas } from "@/hooks/usePropostasInvestimento";
import { useAuth } from "@/contexts/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ===== DADOS MOCK PARA ANÁLISES (até integração real) =====
const investimentoPorCategoria = [
  { nome: "Incubações", valor: 78200, percentual: 62 },
  { nome: "Oportunidades", valor: 32100, percentual: 26 },
  { nome: "Recursos Individuais", valor: 15100, percentual: 12 },
];

const programas = [
  { nome: "Rock Básico", participantes: 28, investido: 15200, custoPorPessoa: 543 },
  { nome: "MPB Avançado", participantes: 15, investido: 12800, custoPorPessoa: 853 },
  { nome: "Rap Iniciantes", participantes: 35, investido: 10500, custoPorPessoa: 300 },
  { nome: "Festival Rock", participantes: 100, investido: 50000, custoPorPessoa: 500 },
];

const regioes = [
  { nome: "Várzea", zeis: true, pessoas: 340, oportunidades: 12, incubacoes: 3 },
  { nome: "Centro", zeis: false, pessoas: 180, oportunidades: 8, incubacoes: 2 },
  { nome: "Boa Viagem", zeis: false, pessoas: 65, oportunidades: 3, incubacoes: 1 },
  { nome: "Casa Amarela", zeis: true, pessoas: 210, oportunidades: 9, incubacoes: 2 },
  { nome: "Cajueiro", zeis: true, pessoas: 156, oportunidades: 6, incubacoes: 1 },
  { nome: "Santo Amaro", zeis: false, pessoas: 98, oportunidades: 5, incubacoes: 1 },
];

const dadosSociais = {
  totalPessoas: 2847,
  emIncubacao: 214,
  posIncubacao: 567,
  semIncubacao: 2066,
  meiFormalizados: 189,
  portfolioCompleto: 1245,
  mediaIdade: 28,
  genero: { masculino: 58, feminino: 40, outro: 2 },
  escolaridade: { fundamental: 12, medio: 45, superior: 32, posGrad: 11 },
  rendaMedia: { antes: 850, durante: 1200, depois: 2100 }
};

const progressaoCarreira = [
  { etapa: "Cadastro Inicial", quantidade: 2847, percentual: 100 },
  { etapa: "Portfólio Completo", quantidade: 1245, percentual: 44 },
  { etapa: "Participou Incubação", quantidade: 781, percentual: 27 },
  { etapa: "Concluiu Incubação", quantidade: 567, percentual: 20 },
  { etapa: "MEI Formalizado", quantidade: 189, percentual: 7 },
  { etapa: "Renda Musical >2SM", quantidade: 134, percentual: 5 },
];

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-4 w-4" />, color: "bg-blue-500" },
  vaga: { label: "Vaga", icon: <Briefcase className="h-4 w-4" />, color: "bg-emerald-500" },
  oficina: { label: "Oficina", icon: <GraduationCap className="h-4 w-4" />, color: "bg-amber-500" },
  projeto_bairro: { label: "Projeto de Bairro", icon: <MapPin className="h-4 w-4" />, color: "bg-purple-500" },
};

export default function DadosDashboard() {
  const { user } = useAuth();
  const { data: oportunidades = [], isLoading: loadingOportunidades } = useOportunidades(undefined, user?.id);
  const { data: oficinas = [], isLoading: loadingOficinas } = useOficinas(user?.id);
  const { data: propostas = [], isLoading: loadingPropostas } = usePropostasRecebidas();
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [tipoMapa, setTipoMapa] = useState("pessoas");

  const isLoading = loadingOportunidades || loadingOficinas || loadingPropostas;

  // Combinar projetos
  const projetos = [
    ...oportunidades.map(o => ({
      id: o.id,
      titulo: o.titulo,
      tipo: o.tipo,
      status: o.status,
      vagas: o.vagas || 0,
      created_at: o.created_at,
    })),
    ...oficinas.map(o => ({
      id: o.id,
      titulo: o.titulo,
      tipo: "oficina",
      status: o.status,
      vagas: o.vagas_total,
      created_at: o.created_at,
    })),
  ];

  // Estatísticas principais
  const totalProjetos = projetos.length;
  const projetosAtivos = projetos.filter(p => p.status === "ativa" || p.status === "inscricoes_abertas").length;
  const projetosRascunho = projetos.filter(p => p.status === "rascunho").length;
  const totalVagas = projetos.reduce((acc, p) => acc + (p.vagas || 0), 0);
  
  const propostasAprovadas = propostas.filter(p => p.status === "aprovada");
  const captacaoTotal = propostasAprovadas.reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);
  const propostasPendentes = propostas.filter(p => p.status === "pendente").length;
  const propostasAprovadaCount = propostasAprovadas.length;

  // Distribuição por tipo
  const distribuicaoPorTipo = [
    { name: "Eventos", value: projetos.filter(p => p.tipo === "evento").length, color: "hsl(217, 91%, 60%)" },
    { name: "Oficinas", value: projetos.filter(p => p.tipo === "oficina").length, color: "hsl(45, 93%, 47%)" },
    { name: "Vagas", value: projetos.filter(p => p.tipo === "vaga").length, color: "hsl(142, 76%, 36%)" },
    { name: "Bairro", value: projetos.filter(p => p.tipo === "projeto_bairro").length, color: "hsl(262, 83%, 58%)" },
  ].filter(item => item.value > 0);

  // Dados para gráfico de evolução
  const dadosEvolucao = (() => {
    const meses: Record<string, { projetos: number }> = {};
    const hoje = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const chave = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      meses[chave] = { projetos: 0 };
    }
    
    projetos.forEach(p => {
      const dataCriacao = new Date(p.created_at);
      const chave = dataCriacao.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (meses[chave] !== undefined) {
        meses[chave].projetos += 1;
      }
    });

    return Object.entries(meses).map(([mes, dados]) => ({ mes, projetos: dados.projetos }));
  })();

  const projetosRecentes = projetos
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
  };

  const getIntensidade = (valor: number, max: number) => {
    const percent = (valor / max) * 100;
    if (percent >= 70) return "bg-red-500/20 border-red-500/50";
    if (percent >= 40) return "bg-amber-500/20 border-amber-500/50";
    return "bg-green-500/20 border-green-500/50";
  };

  const maxPessoas = Math.max(...regioes.map(r => r.pessoas));

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Central de Dados</h1>
            <p className="text-muted-foreground mt-1">
              Visão consolidada dos seus projetos, finanças, território e pessoas
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="visao-geral" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="territorial" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Territorial</span>
            </TabsTrigger>
            <TabsTrigger value="pessoas" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Pessoas</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== VISÃO GERAL ===== */}
          <TabsContent value="visao-geral" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Projetos</p>
                      <p className="text-3xl font-bold text-foreground">{totalProjetos}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {projetosAtivos} ativos • {projetosRascunho} rascunhos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Vagas</p>
                      <p className="text-3xl font-bold text-foreground">{totalVagas}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Vagas oferecidas em todos os projetos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Captação</p>
                      <p className="text-3xl font-bold text-foreground">{formatCurrency(captacaoTotal)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    De {propostasAprovadaCount} propostas aprovadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Propostas</p>
                      <p className="text-3xl font-bold text-foreground">{propostas.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {propostasPendentes} pendentes • {propostasAprovadaCount} aprovadas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Evolução de Projetos
                  </CardTitle>
                  <CardDescription>Projetos criados nos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dadosEvolucao}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="mes" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="projetos" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Projetos" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Por Tipo
                  </CardTitle>
                  <CardDescription>Distribuição dos seus projetos</CardDescription>
                </CardHeader>
                <CardContent>
                  {distribuicaoPorTipo.length > 0 ? (
                    <>
                      <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={distribuicaoPorTipo} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                              {distribuicaoPorTipo.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 mt-4">
                        {distribuicaoPorTipo.map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      Nenhum projeto criado ainda
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Projetos Recentes e Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Projetos Recentes
                      </CardTitle>
                      <CardDescription>Últimos projetos criados</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/oportunidades">Ver todos</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {projetosRecentes.length > 0 ? (
                    <div className="space-y-3">
                      {projetosRecentes.map((projeto) => {
                        const config = tipoConfig[projeto.tipo] || tipoConfig.evento;
                        return (
                          <Link key={projeto.id} to={`/oportunidades/${projeto.id}`} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                            <div className={`p-2 rounded-lg ${config.color} text-white`}>
                              {config.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{projeto.titulo}</p>
                              <p className="text-xs text-muted-foreground">{config.label} • {new Date(projeto.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <Badge variant={projeto.status === "ativa" || projeto.status === "inscricoes_abertas" ? "default" : "secondary"}>
                              {projeto.status}
                            </Badge>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Nenhum projeto criado ainda</p>
                      <Button className="mt-4" asChild>
                        <Link to="/oportunidades">Criar primeiro projeto</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Status dos Projetos
                  </CardTitle>
                  <CardDescription>Visão geral do estado atual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Ativos</span>
                        </div>
                        <span className="font-semibold">{projetosAtivos}</span>
                      </div>
                      <Progress value={totalProjetos > 0 ? (projetosAtivos / totalProjetos) * 100 : 0} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">Em Rascunho</span>
                        </div>
                        <span className="font-semibold">{projetosRascunho}</span>
                      </div>
                      <Progress value={totalProjetos > 0 ? (projetosRascunho / totalProjetos) * 100 : 0} className="h-2 [&>div]:bg-amber-500" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Encerrados</span>
                        </div>
                        <span className="font-semibold">{projetos.filter(p => p.status === "encerrada" || p.status === "concluida").length}</span>
                      </div>
                      <Progress value={totalProjetos > 0 ? (projetos.filter(p => p.status === "encerrada" || p.status === "concluida").length / totalProjetos) * 100 : 0} className="h-2 [&>div]:bg-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== FINANCEIRO ===== */}
          <TabsContent value="financeiro" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">Visão Geral Financeira</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total investido (mês)</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">R$ 125.400</p>
                  </div>
                  <div className="space-y-2">
                    {investimentoPorCategoria.map((item) => (
                      <div key={item.nome} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">• {item.nome}:</span>
                        <span className="font-medium text-foreground">R$ {(item.valor / 1000).toFixed(1)}k ({item.percentual}%)</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-600">ROI estimado</p>
                        <p className="text-xs text-green-600/80">R$ 2.10 para cada R$ 1.00 investido</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">Investimento por Categoria</h3>
                <div className="space-y-4">
                  {investimentoPorCategoria.map((item) => (
                    <div key={item.nome}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-foreground">{item.nome}</span>
                        <span className="font-semibold text-foreground">R$ {(item.valor / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="h-8 w-full rounded-lg bg-muted overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${item.percentual}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-card-foreground">Detalhamento por Programa</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Programa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Participantes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Investido</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Custo/Pessoa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {programas.map((programa) => (
                      <tr key={programa.nome} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap"><span className="font-medium text-foreground">{programa.nome}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-foreground">{programa.participantes}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-foreground">R$ {(programa.investido / 1000).toFixed(1)}k</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-foreground">R$ {programa.custoPorPessoa}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">Projeção Próximos 3 Meses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Programas planejados</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">4 novos</p>
                  <p className="text-xs text-muted-foreground">120 vagas</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investimento estimado</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">R$ 285k</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pessoas com portfólio</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">+89</p>
                  <p className="text-xs text-muted-foreground">projeção</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MEIs formalizados</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">+34</p>
                  <p className="text-xs text-muted-foreground">projeção</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ===== TERRITORIAL ===== */}
          <TabsContent value="territorial" className="space-y-6">
            <Card className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-2 block">Visualização</label>
                  <Select value={tipoMapa} onValueChange={setTipoMapa}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pessoas">Pessoas Cadastradas</SelectItem>
                      <SelectItem value="oportunidades">Oportunidades</SelectItem>
                      <SelectItem value="incubacoes">Incubações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Mapa de Calor - Recife</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {regioes.map((regiao) => {
                  const valor = tipoMapa === "pessoas" ? regiao.pessoas : tipoMapa === "oportunidades" ? regiao.oportunidades : regiao.incubacoes;
                  const max = tipoMapa === "pessoas" ? maxPessoas : tipoMapa === "oportunidades" ? 12 : 3;
                  
                  return (
                    <div key={regiao.nome} className={`${getIntensidade(valor, max)} border-2 rounded-lg p-4 transition-colors cursor-pointer hover:opacity-80`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{regiao.nome}</h4>
                          {regiao.zeis && <span className="text-xs text-primary font-medium">ZEIS/CIS</span>}
                        </div>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-3">
                        <p className="text-2xl font-bold text-foreground">{valor}</p>
                        <p className="text-xs text-muted-foreground">
                          {tipoMapa === "pessoas" && "pessoas"}
                          {tipoMapa === "oportunidades" && "oportunidades"}
                          {tipoMapa === "incubacoes" && "incubações"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Baixa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Média</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Alta</span>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Região</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ZEIS/CIS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Pessoas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Oportunidades</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Incubações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {regioes.map((regiao) => (
                      <tr key={regiao.nome} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap"><span className="font-medium text-foreground">{regiao.nome}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">{regiao.zeis ? <span className="text-xs font-medium text-primary">✓ Sim</span> : <span className="text-xs text-muted-foreground">Não</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-foreground">{regiao.pessoas}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-muted-foreground">{regiao.oportunidades}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-muted-foreground">{regiao.incubacoes}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-3">Insights Territoriais</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong className="text-foreground">67% das pessoas</strong> estão em regiões ZEIS/CIS</li>
                <li>• <strong className="text-foreground">Várzea</strong> concentra a maior comunidade (340 pessoas)</li>
                <li>• <strong className="text-foreground">Boa Viagem</strong> tem baixa participação apesar da infraestrutura</li>
                <li>• Recomendação: expandir programas em <strong className="text-foreground">Casa Amarela e Cajueiro</strong></li>
              </ul>
            </Card>
          </TabsContent>

          {/* ===== PESSOAS ===== */}
          <TabsContent value="pessoas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{dadosSociais.totalPessoas.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Em Incubação</p>
                    <p className="text-2xl font-bold text-green-500 mt-1">{dadosSociais.emIncubacao}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">MEIs Formalizados</p>
                    <p className="text-2xl font-bold text-amber-500 mt-1">{dadosSociais.meiFormalizados}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-amber-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfólio Completo</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{dadosSociais.portfolioCompleto}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Impacto no Desenvolvimento Econômico</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Renda Média Antes</p>
                  <p className="text-3xl font-bold text-foreground">R$ {dadosSociais.rendaMedia.antes}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pré-incubação</p>
                </div>
                <div className="text-center p-4 bg-amber-500/10 rounded-lg border-2 border-amber-500/30">
                  <p className="text-sm text-muted-foreground mb-2">Renda Média Durante</p>
                  <p className="text-3xl font-bold text-amber-500">R$ {dadosSociais.rendaMedia.durante}</p>
                  <p className="text-xs text-green-500 mt-1">↗ +41% vs antes</p>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg border-2 border-green-500/30">
                  <p className="text-sm text-muted-foreground mb-2">Renda Média Pós</p>
                  <p className="text-3xl font-bold text-green-500">R$ {dadosSociais.rendaMedia.depois}</p>
                  <p className="text-xs text-green-500 mt-1">↗ +147% vs antes</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Funil de Progressão de Carreira Musical</h3>
              <div className="space-y-4">
                {progressaoCarreira.map((etapa) => (
                  <div key={etapa.etapa}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{etapa.etapa}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{etapa.quantidade.toLocaleString()} pessoas</span>
                        <span className="text-sm font-semibold text-primary">{etapa.percentual}%</span>
                      </div>
                    </div>
                    <Progress value={etapa.percentual} className="h-3" />
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição por Gênero</h3>
                <div className="space-y-3">
                  {Object.entries(dadosSociais.genero).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground capitalize">{key}</span>
                        <span className="text-sm font-medium">{value}%</span>
                      </div>
                      <Progress value={value} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Nível de Escolaridade</h3>
                <div className="space-y-3">
                  {[
                    { key: "fundamental", label: "Ensino Fundamental" },
                    { key: "medio", label: "Ensino Médio" },
                    { key: "superior", label: "Ensino Superior" },
                    { key: "posGrad", label: "Pós-Graduação" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium">{dadosSociais.escolaridade[key as keyof typeof dadosSociais.escolaridade]}%</span>
                      </div>
                      <Progress value={dadosSociais.escolaridade[key as keyof typeof dadosSociais.escolaridade]} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-green-500/5 border-green-500/20">
              <h3 className="text-lg font-semibold text-foreground mb-3">Principais Indicadores de Impacto Social</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Desenvolvimento Econômico</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Aumento médio de <strong className="text-green-500">147% na renda</strong> pós-incubação</li>
                    <li>• <strong className="text-foreground">189 MEIs</strong> formalizados (33% dos formados)</li>
                    <li>• Geração estimada de <strong className="text-foreground">R$ 2.8M/ano</strong> em renda musical</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Desenvolvimento Profissional</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong className="text-foreground">78% de conclusão</strong> dos programas de incubação</li>
                    <li>• <strong className="text-foreground">89% criam portfólio</strong> profissional completo</li>
                    <li>• Média de <strong className="text-foreground">4.6/5.0</strong> em satisfação dos participantes</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
