import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, MapPin, Users, Target, Calendar, GraduationCap, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useOportunidades } from "@/hooks/useOportunidades";
import { useOficinas } from "@/hooks/useOficinas";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(45, 93%, 47%)', 'hsl(142, 76%, 36%)', 'hsl(262, 83%, 58%)', 'hsl(0, 84%, 60%)'];

export default function AnaliseTerritorial() {
  const { user } = useAuth();
  const [tipoVisualizacao, setTipoVisualizacao] = useState("projetos");
  
  const { data: oportunidades = [], isLoading: loadingOportunidades } = useOportunidades(undefined, user?.id);
  const { data: oficinas = [], isLoading: loadingOficinas } = useOficinas(user?.id);

  const isLoading = loadingOportunidades || loadingOficinas;

  // Agrupar por município/local
  const dadosTerritoriais = useMemo(() => {
    const regioes: Record<string, { 
      nome: string; 
      projetos: number; 
      eventos: number;
      oficinas: number;
      vagas: number;
      totalVagas: number;
    }> = {};

    // Processar oportunidades
    oportunidades.forEach(o => {
      const local = o.municipio || o.local || "Não informado";
      if (!regioes[local]) {
        regioes[local] = { nome: local, projetos: 0, eventos: 0, oficinas: 0, vagas: 0, totalVagas: 0 };
      }
      regioes[local].projetos += 1;
      regioes[local].totalVagas += o.vagas || 0;
      
      if (o.tipo === "evento") regioes[local].eventos += 1;
      if (o.tipo === "vaga") regioes[local].vagas += 1;
    });

    // Processar oficinas
    oficinas.forEach(o => {
      const local = o.local || "Não informado";
      if (!regioes[local]) {
        regioes[local] = { nome: local, projetos: 0, eventos: 0, oficinas: 0, vagas: 0, totalVagas: 0 };
      }
      regioes[local].projetos += 1;
      regioes[local].oficinas += 1;
      regioes[local].totalVagas += o.vagas_total || 0;
    });

    return Object.values(regioes).sort((a, b) => b.projetos - a.projetos);
  }, [oportunidades, oficinas]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalProjetos = oportunidades.length + oficinas.length;
    const totalEventos = oportunidades.filter(o => o.tipo === "evento").length;
    const totalOficinas = oficinas.length;
    const totalVagas = oportunidades.filter(o => o.tipo === "vaga").length;
    const regioesAtivas = dadosTerritoriais.filter(r => r.nome !== "Não informado").length;
    const projetosComLocal = dadosTerritoriais.filter(r => r.nome !== "Não informado").reduce((acc, r) => acc + r.projetos, 0);
    const cobertura = totalProjetos > 0 ? ((projetosComLocal / totalProjetos) * 100) : 0;

    return {
      totalProjetos,
      totalEventos,
      totalOficinas,
      totalVagas,
      regioesAtivas,
      cobertura,
    };
  }, [oportunidades, oficinas, dadosTerritoriais]);

  // Dados para gráfico de barras
  const dadosGrafico = useMemo(() => {
    return dadosTerritoriais.slice(0, 8).map(r => ({
      nome: r.nome.length > 15 ? r.nome.substring(0, 15) + '...' : r.nome,
      nomeCompleto: r.nome,
      projetos: r.projetos,
      eventos: r.eventos,
      oficinas: r.oficinas,
      vagas: r.vagas,
    }));
  }, [dadosTerritoriais]);

  // Dados para gráfico de pizza por tipo
  const distribuicaoTipo = useMemo(() => {
    return [
      { name: "Eventos", value: estatisticas.totalEventos, color: COLORS[0] },
      { name: "Oficinas", value: estatisticas.totalOficinas, color: COLORS[1] },
      { name: "Vagas", value: estatisticas.totalVagas, color: COLORS[2] },
    ].filter(item => item.value > 0);
  }, [estatisticas]);

  const getIntensidade = (valor: number, max: number) => {
    const percent = max > 0 ? (valor / max) * 100 : 0;
    if (percent >= 60) return "bg-primary text-primary-foreground";
    if (percent >= 30) return "bg-secondary text-secondary-foreground";
    return "bg-muted text-muted-foreground";
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

  const maxProjetos = Math.max(...dadosTerritoriais.map(r => r.projetos), 1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Análise Territorial
            </h2>
            <p className="text-sm text-muted-foreground">
              Distribuição geográfica dos seus projetos culturais
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Dados
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Projetos</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.totalProjetos}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Regiões Ativas</p>
                  <p className="text-2xl font-bold text-foreground">{estatisticas.regioesAtivas}</p>
                </div>
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cobertura</p>
                  <p className="text-2xl font-bold text-success">{estatisticas.cobertura.toFixed(0)}%</p>
                </div>
                <Users className="h-8 w-8 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Projetos com local definido</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tipos de Projeto</p>
                  <p className="text-2xl font-bold text-foreground">
                    {distribuicaoTipo.length}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Barras - Projetos por Região */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Projetos por Região
              </CardTitle>
              <CardDescription>Distribuição geográfica dos projetos</CardDescription>
            </CardHeader>
            <CardContent>
              {dadosGrafico.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGrafico} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis 
                        type="category" 
                        dataKey="nome" 
                        width={100}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number, name: string) => [value, name === 'projetos' ? 'Total' : name]}
                        labelFormatter={(label) => dadosGrafico.find(d => d.nome === label)?.nomeCompleto || label}
                      />
                      <Bar dataKey="projetos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum projeto com localização definida</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Distribuição por Tipo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Por Tipo
              </CardTitle>
              <CardDescription>Distribuição dos tipos de projeto</CardDescription>
            </CardHeader>
            <CardContent>
              {distribuicaoTipo.length > 0 ? (
                <>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distribuicaoTipo}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {distribuicaoTipo.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {distribuicaoTipo.map((item) => (
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
                  Nenhum projeto criado
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mapa de Calor Visual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Mapa de Concentração
            </CardTitle>
            <CardDescription>Visualização da distribuição territorial</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosTerritoriais.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dadosTerritoriais.map((regiao) => (
                    <div
                      key={regiao.nome}
                      className={`${getIntensidade(regiao.projetos, maxProjetos)} rounded-lg p-4 transition-all hover:scale-105 cursor-pointer`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{regiao.nome}</h4>
                        </div>
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                      </div>
                      <div className="mt-3">
                        <p className="text-2xl font-bold">{regiao.projetos}</p>
                        <p className="text-xs opacity-80">
                          {regiao.projetos === 1 ? 'projeto' : 'projetos'}
                        </p>
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {regiao.eventos > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {regiao.eventos}
                          </Badge>
                        )}
                        {regiao.oficinas > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {regiao.oficinas}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legenda */}
                <div className="mt-6 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span className="text-sm text-muted-foreground">Baixa concentração</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary rounded"></div>
                    <span className="text-sm text-muted-foreground">Média concentração</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm text-muted-foreground">Alta concentração</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Nenhum projeto encontrado</p>
                  <p className="text-sm mt-1">Crie projetos para visualizar a distribuição territorial</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela Detalhada */}
        {dadosTerritoriais.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Região</CardTitle>
              <CardDescription>Dados completos de cada localidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Região
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Eventos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Oficinas
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Vagas Oferecidas
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        % do Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dadosTerritoriais.map((regiao) => {
                      const percentual = estatisticas.totalProjetos > 0 
                        ? ((regiao.projetos / estatisticas.totalProjetos) * 100).toFixed(1) 
                        : 0;
                      return (
                        <tr key={regiao.nome} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{regiao.nome}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-foreground">{regiao.projetos}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground">{regiao.eventos}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground">{regiao.oficinas}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-muted-foreground">{regiao.totalVagas}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{percentual}%</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
