import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MapaCalorRecife } from "@/components/MapaCalorRecife";
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
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Wallet,
  Activity,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useOportunidades } from "@/hooks/useOportunidades";
import { useOficinas } from "@/hooks/useOficinas";
import { usePropostasRecebidas } from "@/hooks/usePropostasInvestimento";
import { useTodosLancamentos, useTodosRepasses, useTodosCandidatos, useEstatisticasTerritoriais } from "@/hooks/useDadosDashboard";
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
  BarChart,
  Bar,
} from "recharts";

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
  const { data: lancamentos = [], isLoading: loadingLancamentos } = useTodosLancamentos();
  const { data: repasses = [], isLoading: loadingRepasses } = useTodosRepasses();
  const { data: candidatosData, isLoading: loadingCandidatos } = useTodosCandidatos();
  const { data: estatisticasTerritoriais = [], isLoading: loadingTerritorial } = useEstatisticasTerritoriais();
  
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [tipoMapa, setTipoMapa] = useState("projetos");

  const isLoading = loadingOportunidades || loadingOficinas || loadingPropostas || loadingLancamentos || loadingRepasses || loadingCandidatos || loadingTerritorial;

  // Combinar projetos
  const projetos = useMemo(() => [
    ...oportunidades.map(o => ({
      id: o.id,
      titulo: o.titulo,
      tipo: o.tipo,
      status: o.status,
      vagas: o.vagas || 0,
      created_at: o.created_at,
      municipio: o.municipio,
      local: o.local,
      remuneracao: o.remuneracao || 0,
    })),
    ...oficinas.map(o => ({
      id: o.id,
      titulo: o.titulo,
      tipo: "oficina",
      status: o.status,
      vagas: o.vagas_total,
      created_at: o.created_at,
      municipio: null,
      local: o.local,
      remuneracao: 0,
    })),
  ], [oportunidades, oficinas]);

  // ===== ESTATÍSTICAS GERAIS =====
  const totalProjetos = projetos.length;
  const projetosAtivos = projetos.filter(p => p.status === "ativa" || p.status === "inscricoes_abertas").length;
  const projetosRascunho = projetos.filter(p => p.status === "rascunho").length;
  const projetosEncerrados = projetos.filter(p => p.status === "encerrada" || p.status === "concluida").length;
  const totalVagas = projetos.reduce((acc, p) => acc + (p.vagas || 0), 0);
  
  const propostasAprovadas = propostas.filter(p => p.status === "aprovada");
  const captacaoTotal = propostasAprovadas.reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);
  const propostasPendentes = propostas.filter(p => p.status === "pendente").length;
  const propostasAprovadaCount = propostasAprovadas.length;

  // Distribuição por tipo
  const distribuicaoPorTipo = useMemo(() => [
    { name: "Eventos", value: projetos.filter(p => p.tipo === "evento").length, color: "hsl(217, 91%, 60%)" },
    { name: "Oficinas", value: projetos.filter(p => p.tipo === "oficina").length, color: "hsl(45, 93%, 47%)" },
    { name: "Vagas", value: projetos.filter(p => p.tipo === "vaga").length, color: "hsl(142, 76%, 36%)" },
    { name: "Bairro", value: projetos.filter(p => p.tipo === "projeto_bairro").length, color: "hsl(262, 83%, 58%)" },
  ].filter(item => item.value > 0), [projetos]);

  // Dados para gráfico de evolução
  const dadosEvolucao = useMemo(() => {
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
  }, [projetos]);

  const projetosRecentes = useMemo(() => 
    [...projetos]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  , [projetos]);

  // ===== ESTATÍSTICAS FINANCEIRAS =====
  const financeiroStats = useMemo(() => {
    const receitas = lancamentos.filter(l => l.tipo === "receita");
    const despesas = lancamentos.filter(l => l.tipo === "despesa");
    
    const totalReceitas = receitas.reduce((acc, l) => acc + Number(l.valor), 0);
    const totalDespesas = despesas.reduce((acc, l) => acc + Number(l.valor), 0);
    const totalRepasses = repasses.reduce((acc, r) => acc + Number(r.valor), 0);
    const repassesPagos = repasses.filter(r => r.status === "pago").reduce((acc, r) => acc + Number(r.valor), 0);
    const repassesPendentes = repasses.filter(r => r.status === "pendente").reduce((acc, r) => acc + Number(r.valor), 0);
    
    const saldo = totalReceitas - totalDespesas - repassesPagos;
    
    // Agrupar por categoria
    const porCategoria: Record<string, number> = {};
    despesas.forEach(d => {
      const cat = d.categoria || "Outros";
      porCategoria[cat] = (porCategoria[cat] || 0) + Number(d.valor);
    });

    // Evolução mensal
    const evolucaoMensal: Record<string, { receitas: number; despesas: number }> = {};
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const chave = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      evolucaoMensal[chave] = { receitas: 0, despesas: 0 };
    }

    lancamentos.forEach(l => {
      const dataLanc = new Date(l.data);
      const chave = dataLanc.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (evolucaoMensal[chave]) {
        if (l.tipo === "receita") {
          evolucaoMensal[chave].receitas += Number(l.valor);
        } else {
          evolucaoMensal[chave].despesas += Number(l.valor);
        }
      }
    });

    return {
      totalReceitas,
      totalDespesas,
      totalRepasses,
      repassesPagos,
      repassesPendentes,
      saldo,
      porCategoria: Object.entries(porCategoria).map(([nome, valor]) => ({ nome, valor })),
      evolucaoMensal: Object.entries(evolucaoMensal).map(([mes, dados]) => ({ mes, ...dados })),
    };
  }, [lancamentos, repasses]);

  // ===== ESTATÍSTICAS DE PESSOAS =====
  const pessoasStats = useMemo(() => {
    const { candidaturas = [], inscricoes = [], profiles = [] } = candidatosData || {};
    
    const totalCandidatos = candidaturas.length;
    const totalInscritos = inscricoes.length;
    const totalPessoas = profiles.length;
    
    const candidatosAprovados = candidaturas.filter(c => c.status === "aprovada").length;
    const candidatosPendentes = candidaturas.filter(c => c.status === "aguardando").length;
    const inscritosConfirmados = inscricoes.filter(i => i.status === "inscrito" || i.status === "aprovada").length;
    
    // Distribuição por município
    const porMunicipio: Record<string, number> = {};
    profiles.forEach(p => {
      const mun = p.municipio || "Não informado";
      porMunicipio[mun] = (porMunicipio[mun] || 0) + 1;
    });

    // Distribuição por área artística
    const porArea: Record<string, number> = {};
    profiles.forEach(p => {
      const area = p.area_artistica || "Não informado";
      porArea[area] = (porArea[area] || 0) + 1;
    });

    // Tempo de atuação
    const porTempoAtuacao: Record<string, number> = {};
    profiles.forEach(p => {
      const tempo = p.tempo_atuacao || "Não informado";
      porTempoAtuacao[tempo] = (porTempoAtuacao[tempo] || 0) + 1;
    });

    // Situação de formalização
    const porFormalizacao: Record<string, number> = {};
    profiles.forEach(p => {
      const sit = p.situacao_formalizacao || "Não informado";
      porFormalizacao[sit] = (porFormalizacao[sit] || 0) + 1;
    });

    return {
      totalCandidatos,
      totalInscritos,
      totalPessoas,
      candidatosAprovados,
      candidatosPendentes,
      inscritosConfirmados,
      porMunicipio: Object.entries(porMunicipio).map(([nome, quantidade]) => ({ nome, quantidade })).sort((a, b) => b.quantidade - a.quantidade),
      porArea: Object.entries(porArea).map(([nome, quantidade]) => ({ nome, quantidade })).sort((a, b) => b.quantidade - a.quantidade),
      porTempoAtuacao: Object.entries(porTempoAtuacao).map(([nome, quantidade]) => ({ nome, quantidade })),
      porFormalizacao: Object.entries(porFormalizacao).map(([nome, quantidade]) => ({ nome, quantidade })),
    };
  }, [candidatosData]);

  // ===== ESTATÍSTICAS TERRITORIAIS =====
  const territorialStats = useMemo(() => {
    const regioes = estatisticasTerritoriais.length > 0 
      ? estatisticasTerritoriais 
      : pessoasStats.porMunicipio.map(m => ({ nome: m.nome, projetos: 0, vagas: 0, pessoas: m.quantidade }));

    const maxProjetos = Math.max(...regioes.map(r => r.projetos || 0), 1);
    const maxVagas = Math.max(...regioes.map(r => r.vagas || 0), 1);

    return {
      regioes,
      maxProjetos,
      maxVagas,
    };
  }, [estatisticasTerritoriais, pessoasStats.porMunicipio]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
  };

  const getIntensidade = (valor: number, max: number) => {
    if (max === 0) return "bg-muted/30 border-border";
    const percent = (valor / max) * 100;
    if (percent >= 70) return "bg-primary/20 border-primary/50";
    if (percent >= 40) return "bg-amber-500/20 border-amber-500/50";
    return "bg-green-500/20 border-green-500/50";
  };

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
                      <Users className="h-6 w-6 text-secondary-foreground" />
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
                        <span className="font-semibold">{projetosEncerrados}</span>
                      </div>
                      <Progress value={totalProjetos > 0 ? (projetosEncerrados / totalProjetos) * 100 : 0} className="h-2 [&>div]:bg-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== FINANCEIRO ===== */}
          <TabsContent value="financeiro" className="space-y-6">
            {/* KPIs Financeiros */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Receitas</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(financeiroStats.totalReceitas)}</p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Despesas</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(financeiroStats.totalDespesas)}</p>
                    </div>
                    <ArrowDownRight className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Repasses</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(financeiroStats.totalRepasses)}</p>
                    </div>
                    <Users className="h-8 w-8 text-amber-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(financeiroStats.repassesPagos)} pagos • {formatCurrency(financeiroStats.repassesPendentes)} pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo</p>
                      <p className={`text-2xl font-bold ${financeiroStats.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(financeiroStats.saldo)}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos Financeiros */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Evolução Financeira
                  </CardTitle>
                  <CardDescription>Receitas e despesas dos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {financeiroStats.evolucaoMensal.some(m => m.receitas > 0 || m.despesas > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financeiroStats.evolucaoMensal}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} 
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Bar dataKey="receitas" name="Receitas" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="despesas" name="Despesas" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <DollarSign className="h-12 w-12 mb-4 opacity-50" />
                        <p>Nenhum lançamento financeiro ainda</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Despesas por Categoria
                  </CardTitle>
                  <CardDescription>Distribuição dos gastos</CardDescription>
                </CardHeader>
                <CardContent>
                  {financeiroStats.porCategoria.length > 0 ? (
                    <div className="space-y-4">
                      {financeiroStats.porCategoria.slice(0, 6).map((cat, index) => {
                        const total = financeiroStats.totalDespesas || 1;
                        const percentual = (cat.valor / total) * 100;
                        return (
                          <div key={cat.nome}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-foreground">{cat.nome}</span>
                              <span className="text-sm font-medium">{formatCurrency(cat.valor)}</span>
                            </div>
                            <Progress value={percentual} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                      <Target className="h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhuma despesa registrada</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabela de lançamentos recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Últimos Lançamentos</CardTitle>
                <CardDescription>Movimentações financeiras recentes</CardDescription>
              </CardHeader>
              <CardContent>
                {lancamentos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Descrição</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Categoria</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {lancamentos.slice(0, 10).map((lanc) => (
                          <tr key={lanc.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{new Date(lanc.data).toLocaleDateString('pt-BR')}</td>
                            <td className="px-4 py-3 text-sm">{lanc.descricao}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{lanc.categoria || "-"}</td>
                            <td className="px-4 py-3">
                              <Badge variant={lanc.tipo === "receita" ? "default" : "secondary"}>
                                {lanc.tipo}
                              </Badge>
                            </td>
                            <td className={`px-4 py-3 text-right font-medium ${lanc.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
                              {lanc.tipo === "receita" ? "+" : "-"}{formatCurrency(Number(lanc.valor))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mb-4 opacity-50" />
                    <p>Nenhum lançamento financeiro registrado</p>
                    <p className="text-sm mt-1">Adicione lançamentos na aba Financeiro de cada projeto</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TERRITORIAL ===== */}
          <TabsContent value="territorial" className="space-y-6">
            <MapaCalorRecife dados={territorialStats.regioes} />

            {/* Tabela de regiões */}
            {territorialStats.regioes.length > 0 && (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Bairro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Projetos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Vagas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tipos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {territorialStats.regioes.map((regiao) => (
                        <tr key={regiao.nome} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap"><span className="font-medium text-foreground">{regiao.nome}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-foreground">{regiao.projetos}</span></td>
                          <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm text-muted-foreground">{regiao.vagas}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {Object.entries(regiao.porTipo || {}).map(([tipo, count]) => (
                                <Badge key={tipo} variant="outline" className="text-xs" style={{ borderColor: tipo === 'evento' ? '#3b82f6' : tipo === 'vaga' ? '#10b981' : tipo === 'oficina' ? '#f59e0b' : '#8b5cf6', color: tipo === 'evento' ? '#3b82f6' : tipo === 'vaga' ? '#10b981' : tipo === 'oficina' ? '#f59e0b' : '#8b5cf6' }}>
                                  {tipo} ({count})
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* ===== PESSOAS ===== */}
          <TabsContent value="pessoas" className="space-y-6">
            {/* KPIs de Pessoas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{pessoasStats.totalPessoas}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Candidaturas</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{pessoasStats.totalCandidatos}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pessoasStats.candidatosAprovados} aprovados • {pessoasStats.candidatosPendentes} pendentes
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inscrições Oficinas</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{pessoasStats.totalInscritos}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pessoasStats.inscritosConfirmados} confirmados
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
                    <p className="text-2xl font-bold text-green-500 mt-1">
                      {pessoasStats.totalCandidatos > 0 
                        ? Math.round((pessoasStats.candidatosAprovados / pessoasStats.totalCandidatos) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </Card>
            </div>

            {/* Gráficos de distribuição */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Por Município
                  </CardTitle>
                  <CardDescription>Distribuição geográfica dos candidatos</CardDescription>
                </CardHeader>
                <CardContent>
                  {pessoasStats.porMunicipio.length > 0 ? (
                    <div className="space-y-3">
                      {pessoasStats.porMunicipio.slice(0, 6).map((mun) => {
                        const total = pessoasStats.totalPessoas || 1;
                        const percentual = (mun.quantidade / total) * 100;
                        return (
                          <div key={mun.nome}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-foreground">{mun.nome}</span>
                              <span className="text-sm font-medium">{mun.quantidade}</span>
                            </div>
                            <Progress value={percentual} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                      <MapPin className="h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhum candidato ainda</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Por Área Artística
                  </CardTitle>
                  <CardDescription>Áreas de atuação dos candidatos</CardDescription>
                </CardHeader>
                <CardContent>
                  {pessoasStats.porArea.length > 0 ? (
                    <div className="space-y-3">
                      {pessoasStats.porArea.slice(0, 6).map((area) => {
                        const total = pessoasStats.totalPessoas || 1;
                        const percentual = (area.quantidade / total) * 100;
                        return (
                          <div key={area.nome}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-foreground">{area.nome}</span>
                              <span className="text-sm font-medium">{area.quantidade}</span>
                            </div>
                            <Progress value={percentual} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                      <Target className="h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhum dado disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mais distribuições */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Tempo de Atuação
                  </CardTitle>
                  <CardDescription>Experiência dos candidatos</CardDescription>
                </CardHeader>
                <CardContent>
                  {pessoasStats.porTempoAtuacao.length > 0 ? (
                    <div className="space-y-3">
                      {pessoasStats.porTempoAtuacao.map((tempo) => {
                        const total = pessoasStats.totalPessoas || 1;
                        const percentual = (tempo.quantidade / total) * 100;
                        return (
                          <div key={tempo.nome}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-foreground">{tempo.nome}</span>
                              <span className="text-sm font-medium">{tempo.quantidade}</span>
                            </div>
                            <Progress value={percentual} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                      <Clock className="h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhum dado disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Situação de Formalização
                  </CardTitle>
                  <CardDescription>Status de formalização dos candidatos</CardDescription>
                </CardHeader>
                <CardContent>
                  {pessoasStats.porFormalizacao.length > 0 ? (
                    <div className="space-y-3">
                      {pessoasStats.porFormalizacao.map((form) => {
                        const total = pessoasStats.totalPessoas || 1;
                        const percentual = (form.quantidade / total) * 100;
                        return (
                          <div key={form.nome}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-foreground">{form.nome}</span>
                              <span className="text-sm font-medium">{form.quantidade}</span>
                            </div>
                            <Progress value={percentual} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                      <Briefcase className="h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhum dado disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumo de indicadores */}
            {pessoasStats.totalPessoas > 0 && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-3">Resumo de Indicadores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Engajamento</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong className="text-foreground">{pessoasStats.totalCandidatos + pessoasStats.totalInscritos}</strong> participações totais</li>
                      <li>• <strong className="text-foreground">{pessoasStats.candidatosAprovados}</strong> candidatos aprovados em vagas</li>
                      <li>• <strong className="text-foreground">{pessoasStats.inscritosConfirmados}</strong> inscritos confirmados em oficinas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Diversidade</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong className="text-foreground">{pessoasStats.porMunicipio.length}</strong> municípios diferentes</li>
                      <li>• <strong className="text-foreground">{pessoasStats.porArea.length}</strong> áreas artísticas</li>
                      <li>• <strong className="text-foreground">{pessoasStats.porFormalizacao.filter(f => f.nome !== "Não informado").length}</strong> níveis de formalização</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
