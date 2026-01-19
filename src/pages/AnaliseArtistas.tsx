import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, Users, Briefcase, GraduationCap, UserCheck, Clock, Loader2, Calendar } from "lucide-react";
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { useOportunidades } from "@/hooks/useOportunidades";
import { useOficinas } from "@/hooks/useOficinas";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(45, 93%, 47%)', 'hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)', 'hsl(262, 83%, 58%)'];

export default function AnaliseArtistas() {
  const { user } = useAuth();
  const [periodo, setPeriodo] = useState("all");

  const { data: oportunidades = [], isLoading: loadingOportunidades } = useOportunidades(undefined, user?.id);
  const { data: oficinas = [], isLoading: loadingOficinas } = useOficinas(user?.id);

  // Buscar candidaturas para as oportunidades do usuário
  const oportunidadeIds = oportunidades.map(o => o.id);
  const { data: candidaturas = [], isLoading: loadingCandidaturas } = useQuery({
    queryKey: ["candidaturas-criador", user?.id],
    queryFn: async () => {
      if (!user?.id || oportunidadeIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("oportunidade_interessados")
        .select("*")
        .in("oportunidade_id", oportunidadeIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && oportunidadeIds.length > 0,
  });

  // Buscar inscrições para as oficinas do usuário
  const oficinaIds = oficinas.map(o => o.id);
  const { data: inscricoes = [], isLoading: loadingInscricoes } = useQuery({
    queryKey: ["inscricoes-criador", user?.id],
    queryFn: async () => {
      if (!user?.id || oficinaIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("oficina_inscricoes")
        .select("*")
        .in("oficina_id", oficinaIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && oficinaIds.length > 0,
  });

  const isLoading = loadingOportunidades || loadingOficinas || loadingCandidaturas || loadingInscricoes;

  // Métricas de pessoas
  const metricas = useMemo(() => {
    // Total de pessoas interessadas (candidaturas + inscrições)
    const totalCandidaturas = candidaturas.length;
    const totalInscricoes = inscricoes.length;
    const totalPessoas = totalCandidaturas + totalInscricoes;

    // Status das candidaturas
    const candidaturasAprovadas = candidaturas.filter(c => c.status === "aprovada").length;
    const candidaturasPendentes = candidaturas.filter(c => c.status === "aguardando" || c.status === "pendente").length;
    const candidaturasReprovadas = candidaturas.filter(c => c.status === "reprovada").length;

    // Status das inscrições
    const inscricoesAprovadas = inscricoes.filter(i => i.status === "aprovada" || i.status === "confirmada").length;
    const inscricoesPendentes = inscricoes.filter(i => i.status === "inscrito" || i.status === "pendente").length;

    // Totais aprovados
    const totalAprovados = candidaturasAprovadas + inscricoesAprovadas;
    const totalPendentes = candidaturasPendentes + inscricoesPendentes;

    // Taxa de aprovação
    const taxaAprovacao = totalPessoas > 0 ? ((totalAprovados / totalPessoas) * 100) : 0;

    // Total de vagas oferecidas
    const vagasOportunidades = oportunidades.reduce((acc, o) => acc + (o.vagas || 0), 0);
    const vagasOficinas = oficinas.reduce((acc, o) => acc + (o.vagas_total || 0), 0);
    const totalVagas = vagasOportunidades + vagasOficinas;

    // Taxa de preenchimento
    const taxaPreenchimento = totalVagas > 0 ? ((totalAprovados / totalVagas) * 100) : 0;

    // Distribuição por status
    const distribuicaoStatus = [
      { name: "Aprovados", value: totalAprovados, color: COLORS[2] },
      { name: "Pendentes", value: totalPendentes, color: COLORS[1] },
      { name: "Reprovados", value: candidaturasReprovadas, color: COLORS[3] },
    ].filter(item => item.value > 0);

    // Distribuição por tipo de projeto
    const distribuicaoTipo = [
      { name: "Eventos", value: candidaturas.length, color: COLORS[0] },
      { name: "Oficinas", value: inscricoes.length, color: COLORS[1] },
    ].filter(item => item.value > 0);

    // Evolução mensal de candidaturas/inscrições
    const evolucaoMensal = (() => {
      const meses: Record<string, { candidaturas: number; inscricoes: number }> = {};
      const hoje = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const chave = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        meses[chave] = { candidaturas: 0, inscricoes: 0 };
      }
      
      candidaturas.forEach(c => {
        const dataCriacao = new Date(c.created_at);
        const chave = dataCriacao.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (meses[chave] !== undefined) {
          meses[chave].candidaturas += 1;
        }
      });

      inscricoes.forEach(i => {
        const dataCriacao = new Date(i.created_at);
        const chave = dataCriacao.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (meses[chave] !== undefined) {
          meses[chave].inscricoes += 1;
        }
      });

      let acumulado = 0;
      return Object.entries(meses).map(([mes, dados]) => {
        acumulado += dados.candidaturas + dados.inscricoes;
        return {
          mes,
          candidaturas: dados.candidaturas,
          inscricoes: dados.inscricoes,
          total: dados.candidaturas + dados.inscricoes,
          acumulado,
        };
      });
    })();

    // Funil de conversão
    const funilConversao = [
      { etapa: "Vagas Disponíveis", quantidade: totalVagas, percentual: 100 },
      { etapa: "Interessados", quantidade: totalPessoas, percentual: totalVagas > 0 ? Math.round((totalPessoas / totalVagas) * 100) : 0 },
      { etapa: "Aprovados", quantidade: totalAprovados, percentual: totalVagas > 0 ? Math.round((totalAprovados / totalVagas) * 100) : 0 },
    ];

    // Top projetos por interesse
    const projetosPorInteresse = [
      ...oportunidades.map(o => ({
        id: o.id,
        nome: o.titulo,
        tipo: o.tipo,
        interessados: candidaturas.filter(c => c.oportunidade_id === o.id).length,
        aprovados: candidaturas.filter(c => c.oportunidade_id === o.id && c.status === "aprovada").length,
        vagas: o.vagas || 0,
      })),
      ...oficinas.map(o => ({
        id: o.id,
        nome: o.titulo,
        tipo: "oficina",
        interessados: inscricoes.filter(i => i.oficina_id === o.id).length,
        aprovados: inscricoes.filter(i => i.oficina_id === o.id && (i.status === "aprovada" || i.status === "confirmada")).length,
        vagas: o.vagas_total,
      })),
    ].sort((a, b) => b.interessados - a.interessados).slice(0, 5);

    return {
      totalPessoas,
      totalCandidaturas,
      totalInscricoes,
      totalAprovados,
      totalPendentes,
      taxaAprovacao,
      totalVagas,
      taxaPreenchimento,
      distribuicaoStatus,
      distribuicaoTipo,
      evolucaoMensal,
      funilConversao,
      projetosPorInteresse,
      candidaturasReprovadas,
    };
  }, [oportunidades, oficinas, candidaturas, inscricoes]);

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Análise de Pessoas
            </h2>
            <p className="text-sm text-muted-foreground">
              Candidaturas, inscrições e engajamento nos seus projetos
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Interessados</p>
                  <p className="text-2xl font-bold text-foreground">{metricas.totalPessoas}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metricas.totalCandidaturas} candidaturas • {metricas.totalInscricoes} inscrições
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aprovados</p>
                  <p className="text-2xl font-bold text-success">{metricas.totalAprovados}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Taxa de aprovação: {metricas.taxaAprovacao.toFixed(0)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-warning">{metricas.totalPendentes}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Aguardando análise
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vagas Oferecidas</p>
                  <p className="text-2xl font-bold text-foreground">{metricas.totalVagas}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-secondary" />
                </div>
              </div>
              {metricas.totalVagas > 0 && (
                <div className="mt-2">
                  <Progress value={metricas.taxaPreenchimento} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metricas.taxaPreenchimento.toFixed(0)}% preenchido
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evolução de Interesse */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Evolução de Interesse
              </CardTitle>
              <CardDescription>Candidaturas e inscrições nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metricas.evolucaoMensal}>
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
                      dataKey="acumulado" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                      name="Total Acumulado"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Por Status
              </CardTitle>
              <CardDescription>Situação atual das candidaturas</CardDescription>
            </CardHeader>
            <CardContent>
              {metricas.distribuicaoStatus.length > 0 ? (
                <>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={metricas.distribuicaoStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {metricas.distribuicaoStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {metricas.distribuicaoStatus.map((item) => (
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
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma candidatura</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Funil de Conversão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Funil de Conversão
            </CardTitle>
            <CardDescription>Da disponibilidade de vagas à aprovação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metricas.funilConversao.map((etapa, idx) => (
                <div key={etapa.etapa}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {etapa.etapa}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {etapa.quantidade}
                      </span>
                      <Badge variant={idx === 0 ? "default" : idx === 2 ? "secondary" : "outline"}>
                        {etapa.percentual}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={etapa.percentual} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Projetos por Interesse */}
        {metricas.projetosPorInteresse.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Projetos Mais Procurados</CardTitle>
              <CardDescription>Ordenado por número de interessados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metricas.projetosPorInteresse.map((projeto, idx) => (
                  <div key={projeto.id} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{projeto.nome}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {projeto.tipo === "oficina" && <GraduationCap className="h-3 w-3 mr-1" />}
                          {projeto.tipo === "evento" && <Calendar className="h-3 w-3 mr-1" />}
                          {projeto.tipo}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {projeto.vagas} vagas
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{projeto.interessados}</p>
                      <p className="text-xs text-muted-foreground">interessados</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">{projeto.aprovados}</p>
                      <p className="text-xs text-muted-foreground">aprovados</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card de Resumo */}
        {metricas.totalPessoas > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Resumo de Engajamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus projetos receberam <strong className="text-foreground">{metricas.totalPessoas} manifestações de interesse</strong>,
                    com uma taxa de aprovação de <strong className="text-success">{metricas.taxaAprovacao.toFixed(0)}%</strong>.
                    {metricas.totalPendentes > 0 && ` Ainda há ${metricas.totalPendentes} candidatura${metricas.totalPendentes > 1 ? 's' : ''} pendente${metricas.totalPendentes > 1 ? 's' : ''} de análise.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
