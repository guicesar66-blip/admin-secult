import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
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
  Eye,
  UserCheck,
  Wallet,
  Activity
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
  
  // Métricas financeiras baseadas em propostas aprovadas
  const propostasAprovadas = propostas.filter(p => p.status === "aprovada");
  const captacaoTotal = propostasAprovadas.reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);

  // Propostas recebidas
  const propostasPendentes = propostas.filter(p => p.status === "pendente").length;
  const propostasAprovadaCount = propostasAprovadas.length;

  // Distribuição por tipo
  const distribuicaoPorTipo = [
    { name: "Eventos", value: projetos.filter(p => p.tipo === "evento").length, color: "hsl(217, 91%, 60%)" },
    { name: "Oficinas", value: projetos.filter(p => p.tipo === "oficina").length, color: "hsl(45, 93%, 47%)" },
    { name: "Vagas", value: projetos.filter(p => p.tipo === "vaga").length, color: "hsl(142, 76%, 36%)" },
    { name: "Bairro", value: projetos.filter(p => p.tipo === "projeto_bairro").length, color: "hsl(262, 83%, 58%)" },
  ].filter(item => item.value > 0);

  // Dados para gráfico de evolução (baseado em created_at)
  const dadosEvolucao = (() => {
    const meses: Record<string, { projetos: number }> = {};
    const hoje = new Date();
    
    // Últimos 6 meses
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

    return Object.entries(meses).map(([mes, dados]) => ({
      mes,
      projetos: dados.projetos,
    }));
  })();

  // Projetos recentes
  const projetosRecentes = projetos
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Dados</h1>
            <p className="text-muted-foreground mt-1">
              Visão consolidada dos seus projetos culturais e resultados
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/oportunidades">
                Ver Projetos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* KPIs Principais */}
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
                  <p className="text-sm text-muted-foreground">Investimentos Captados</p>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(captacaoTotal)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-success" />
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
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-warning" />
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
          {/* Evolução de Projetos */}
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
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="projetos" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                      name="Projetos"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Tipo */}
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
                        <Pie
                          data={distribuicaoPorTipo}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
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

        {/* Segunda linha de cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projetos Recentes */}
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
                      <Link 
                        key={projeto.id}
                        to={`/oportunidades/${projeto.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{projeto.titulo}</p>
                          <p className="text-xs text-muted-foreground">
                            {config.label} • {new Date(projeto.created_at).toLocaleDateString('pt-BR')}
                          </p>
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

          {/* Status dos Projetos */}
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
                {/* Barra de status */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Ativos</span>
                    </div>
                    <span className="font-semibold">{projetosAtivos}</span>
                  </div>
                  <Progress value={totalProjetos > 0 ? (projetosAtivos / totalProjetos) * 100 : 0} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-sm">Em Rascunho</span>
                    </div>
                    <span className="font-semibold">{projetosRascunho}</span>
                  </div>
                  <Progress 
                    value={totalProjetos > 0 ? (projetosRascunho / totalProjetos) * 100 : 0} 
                    className="h-2 [&>div]:bg-warning" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Encerrados</span>
                    </div>
                    <span className="font-semibold">{projetos.filter(p => p.status === "encerrada" || p.status === "concluida").length}</span>
                  </div>
                  <Progress 
                    value={totalProjetos > 0 ? (projetos.filter(p => p.status === "encerrada" || p.status === "concluida").length / totalProjetos) * 100 : 0} 
                    className="h-2 [&>div]:bg-muted-foreground" 
                  />
                </div>
              </div>

              {/* Links para análises detalhadas */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-medium mb-3">Análises Detalhadas</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/analise-financeira">
                      <DollarSign className="h-4 w-4 mr-2 text-success" />
                      Análise Financeira
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/analise-territorial">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      Análise Territorial
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link to="/analise-artistas">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      Análise de Pessoas
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
