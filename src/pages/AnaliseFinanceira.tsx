import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, TrendingUp, Wallet, Target, DollarSign, ArrowUpRight, Loader2, Calendar, GraduationCap } from "lucide-react";
import { useOportunidades } from "@/hooks/useOportunidades";
import { useOficinas } from "@/hooks/useOficinas";
import { usePropostasRecebidas } from "@/hooks/usePropostasInvestimento";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnaliseFinanceira() {
  const { user } = useAuth();
  const [periodo, setPeriodo] = useState("all");
  
  const { data: oportunidades = [], isLoading: loadingOportunidades } = useOportunidades(undefined, user?.id);
  const { data: oficinas = [], isLoading: loadingOficinas } = useOficinas(user?.id);
  const { data: propostas = [], isLoading: loadingPropostas } = usePropostasRecebidas();

  const isLoading = loadingOportunidades || loadingOficinas || loadingPropostas;

  // Calcular métricas financeiras
  const metricas = useMemo(() => {
    // Propostas aprovadas (receitas confirmadas)
    const propostasAprovadas = propostas.filter(p => p.status === "aprovada");
    const receitaTotal = propostasAprovadas.reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);
    
    // Propostas pendentes
    const propostasPendentes = propostas.filter(p => p.status === "pendente");
    const receitaPendente = propostasPendentes.reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);

    // Meta de captação = soma das remunerações e vagas
    const metaCaptacaoTotal = receitaTotal + receitaPendente;
    const captacaoAtualTotal = receitaTotal;

    // Progresso
    const progressoCaptacao = metaCaptacaoTotal > 0 ? (captacaoAtualTotal / metaCaptacaoTotal) * 100 : 0;

    // Investimento por categoria - baseado em propostas
    const propostasEventos = propostas.filter(p => p.oportunidade_id && oportunidades.find(o => o.id === p.oportunidade_id && o.tipo === "evento"));
    const propostasOficinas = propostas.filter(p => p.oficina_id);
    
    const investimentoPorCategoria = [
      { 
        nome: "Eventos", 
        valor: propostasEventos.filter(p => p.status === "aprovada").reduce((acc, p) => acc + (p.valor_financeiro || 0), 0),
        projetos: oportunidades.filter(o => o.tipo === "evento").length,
        color: "hsl(217, 91%, 60%)"
      },
      { 
        nome: "Oficinas", 
        valor: propostasOficinas.filter(p => p.status === "aprovada").reduce((acc, p) => acc + (p.valor_financeiro || 0), 0),
        projetos: oficinas.length,
        color: "hsl(45, 93%, 47%)"
      },
      { 
        nome: "Vagas", 
        valor: oportunidades.filter(o => o.tipo === "vaga").reduce((acc, o) => acc + (o.remuneracao || 0), 0),
        projetos: oportunidades.filter(o => o.tipo === "vaga").length,
        color: "hsl(142, 76%, 36%)"
      },
    ].filter(item => item.valor > 0 || item.projetos > 0);

    const valorTotalCategoria = investimentoPorCategoria.reduce((acc, c) => acc + c.valor, 0);
    const investimentoComPercentual = investimentoPorCategoria.map(c => ({
      ...c,
      percentual: valorTotalCategoria > 0 ? Math.round((c.valor / valorTotalCategoria) * 100) : 0
    }));

    // Evolução mensal
    const evolucaoMensal = (() => {
      const meses: Record<string, { receita: number; propostas: number }> = {};
      const hoje = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const chave = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        meses[chave] = { receita: 0, propostas: 0 };
      }
      
      propostasAprovadas.forEach(p => {
        const dataCriacao = new Date(p.created_at || '');
        const chave = dataCriacao.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (meses[chave] !== undefined) {
          meses[chave].receita += p.valor_financeiro || 0;
          meses[chave].propostas += 1;
        }
      });

      let acumulado = 0;
      return Object.entries(meses).map(([mes, dados]) => {
        acumulado += dados.receita;
        return {
          mes,
          receita: dados.receita,
          acumulado,
          propostas: dados.propostas,
        };
      });
    })();

    // Detalhamento por projeto
    const projetosPorTipo = [
      ...oportunidades.map(o => {
        const propostasOp = propostas.filter(p => p.oportunidade_id === o.id);
        return {
          id: o.id,
          nome: o.titulo,
          tipo: o.tipo,
          investido: propostasOp.filter(p => p.status === "aprovada").reduce((acc, p) => acc + (p.valor_financeiro || 0), 0),
          meta: propostasOp.reduce((acc, p) => acc + (p.valor_financeiro || 0), 0),
          vagas: o.vagas || 0,
          propostas: propostasOp.length,
        };
      }),
      ...oficinas.map(o => {
        const propostasOf = propostas.filter(p => p.oficina_id === o.id);
        return {
          id: o.id,
          nome: o.titulo,
          tipo: "oficina",
          investido: propostasOf.filter(p => p.status === "aprovada").reduce((acc, p) => acc + (p.valor_financeiro || 0), 0),
          meta: propostasOf.reduce((acc, p) => acc + (p.valor_financeiro || 0), 0),
          vagas: o.vagas_total,
          propostas: propostasOf.length,
        };
      }),
    ].filter(p => p.investido > 0 || p.propostas > 0);

    return {
      receitaTotal,
      receitaPendente,
      metaCaptacaoTotal,
      captacaoAtualTotal,
      progressoCaptacao,
      investimentoPorCategoria: investimentoComPercentual,
      evolucaoMensal,
      projetosPorTipo,
      totalPropostas: propostas.length,
      propostasAprovadas: propostasAprovadas.length,
      propostasPendentes: propostasPendentes.length,
    };
  }, [oportunidades, oficinas, propostas]);

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Análise Financeira
            </h2>
            <p className="text-sm text-muted-foreground">
              Investimentos, captações e ROI dos seus projetos
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Confirmada</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(metricas.receitaTotal)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <ArrowUpRight className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                De {metricas.propostasAprovadas} propostas aprovadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Pendente</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(metricas.receitaPendente)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-warning" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metricas.propostasPendentes} propostas aguardando
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Meta de Captação</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(metricas.metaCaptacaoTotal)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              {metricas.metaCaptacaoTotal > 0 && (
                <div className="mt-2">
                  <Progress value={metricas.progressoCaptacao} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metricas.progressoCaptacao.toFixed(0)}% atingido
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Propostas</p>
                  <p className="text-2xl font-bold text-foreground">{metricas.totalPropostas}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Recebidas em todos os projetos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolução de Receitas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Evolução de Receitas
              </CardTitle>
              <CardDescription>Receitas acumuladas nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metricas.evolucaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      className="text-xs" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Acumulado']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="acumulado" 
                      stroke="hsl(var(--success))" 
                      fill="hsl(var(--success) / 0.2)" 
                      name="Receita Acumulada"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Investimento por Categoria
              </CardTitle>
              <CardDescription>Distribuição por tipo de projeto</CardDescription>
            </CardHeader>
            <CardContent>
              {metricas.investimentoPorCategoria.length > 0 ? (
                <div className="space-y-4">
                  {metricas.investimentoPorCategoria.map((item) => (
                    <div key={item.nome}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.nome}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.projetos} {item.projetos === 1 ? 'projeto' : 'projetos'}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(item.valor)}</span>
                      </div>
                      <div className="h-3 w-full rounded-lg bg-muted overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${item.percentual}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma captação registrada</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela Detalhada por Projeto */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Projeto</CardTitle>
            <CardDescription>Performance financeira de cada projeto</CardDescription>
          </CardHeader>
          <CardContent>
            {metricas.projetosPorTipo.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Projeto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Captado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Meta
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Propostas
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Progresso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {metricas.projetosPorTipo.map((projeto) => {
                      const progresso = projeto.meta > 0 ? (projeto.investido / projeto.meta) * 100 : 0;
                      return (
                        <tr key={projeto.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground">{projeto.nome}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="capitalize">
                              {projeto.tipo === "oficina" && <GraduationCap className="h-3 w-3 mr-1" />}
                              {projeto.tipo === "evento" && <Calendar className="h-3 w-3 mr-1" />}
                              {projeto.tipo}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-success">{formatCurrency(projeto.investido)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground">{formatCurrency(projeto.meta)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-foreground">{projeto.propostas}</span>
                          </td>
                          <td className="px-4 py-3 w-32">
                            {projeto.meta > 0 ? (
                              <div>
                                <Progress value={Math.min(progresso, 100)} className="h-2" />
                                <span className="text-xs text-muted-foreground">{progresso.toFixed(0)}%</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Sem meta</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum projeto com metas financeiras definidas</p>
                <p className="text-sm mt-1">Configure metas de captação nos seus projetos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ROI Card */}
        {metricas.receitaTotal > 0 && (
          <Card className="bg-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Resumo Financeiro</h3>
                  <p className="text-sm text-muted-foreground">
                    Total de {formatCurrency(metricas.receitaTotal)} captado através de {metricas.propostasAprovadas} propostas aprovadas.
                    {metricas.receitaPendente > 0 && ` Ainda há ${formatCurrency(metricas.receitaPendente)} pendente de aprovação.`}
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
