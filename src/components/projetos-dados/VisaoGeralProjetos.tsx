import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Briefcase, CheckCircle, AlertTriangle, DollarSign, Clock, Users } from "lucide-react";
import { projetosMock, evolucaoPortfolioMensal, getKPIsProjetos } from "@/data/mockProjetos";

export function VisaoGeralProjetos() {
  const kpis = useMemo(() => getKPIsProjetos(), []);
  const [linhasVisiveis, setLinhasVisiveis] = useState({ iniciados: true, concluidos: true, desembolsado: true });

  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);
  const percentPendencia = Math.round((kpis.comPendencia / projetosMock.length) * 100);

  const toggleLinha = (key: keyof typeof linhasVisiveis) => {
    setLinhasVisiveis(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      {/* Cards US-15 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Projetos Ativos</p>
                <p className="text-2xl font-bold">{kpis.projetosAtivos}</p>
                <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+{kpis.variações.ativos} vs. ant.</Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold">{kpis.projetosConcluidos}</p>
                <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+{kpis.variações.concluidos}</Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Com Pendência</p>
                <p className="text-2xl font-bold">{kpis.comPendencia}</p>
                {percentPendencia > 10 && <Badge variant="destructive" className="text-[10px] mt-1">⚠ {percentPendencia}%</Badge>}
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Recursos em Execução</p>
                <p className="text-2xl font-bold">{formatCurrency(kpis.totalRecursos)}</p>
                <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+{kpis.variações.recursos}%</Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-blue-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Eficiência Repasse</p>
                <p className="text-2xl font-bold">{kpis.eficienciaRepasse}d</p>
                <Badge variant={kpis.eficienciaRepasse <= 30 ? "default" : "secondary"} className="text-[10px] mt-1">
                  {kpis.eficienciaRepasse <= 30 ? "✓ Meta" : "⚠ Meta ≤30d"}
                </Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Retorno Social</p>
                <p className="text-2xl font-bold">{(kpis.totalPublico / 1000).toFixed(0)}k</p>
                <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+{kpis.variações.publico}%</Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-purple-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolução mensal */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base font-semibold">Evolução Mensal do Portfólio (12 meses)</CardTitle>
            <div className="flex gap-2">
              {[
                { key: "iniciados" as const, label: "Iniciados", color: "hsl(var(--primary))" },
                { key: "concluidos" as const, label: "Concluídos", color: "hsl(142, 71%, 45%)" },
                { key: "desembolsado" as const, label: "R$ Desembolsado", color: "hsl(215, 60%, 50%)" },
              ].map(l => (
                <button key={l.key} onClick={() => toggleLinha(l.key)}
                  className={`text-[10px] px-2 py-1 rounded-full border transition-opacity ${linhasVisiveis[l.key] ? "opacity-100" : "opacity-40"}`}
                  style={{ borderColor: l.color, color: l.color }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            iniciados: { label: "Iniciados", color: "hsl(var(--primary))" },
            concluidos: { label: "Concluídos", color: "hsl(142, 71%, 45%)" },
            desembolsado: { label: "Desembolsado", color: "hsl(215, 60%, 50%)" },
          }} className="h-[280px] w-full">
            <LineChart data={evolucaoPortfolioMensal} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10 }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {linhasVisiveis.iniciados && <Line yAxisId="left" type="monotone" dataKey="iniciados" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />}
              {linhasVisiveis.concluidos && <Line yAxisId="left" type="monotone" dataKey="concluidos" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} />}
              {linhasVisiveis.desembolsado && <Line yAxisId="right" type="monotone" dataKey="desembolsado" stroke="hsl(215, 60%, 50%)" strokeWidth={2} dot={{ r: 3 }} />}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
