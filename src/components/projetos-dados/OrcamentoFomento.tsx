import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";
import { orcamentoPorInstrumento } from "@/data/mockProjetos";
import { projetosPorInstrumento } from "@/data/mockEquipamentosCulturais";

export function OrcamentoFomento() {
  const totalInvestido = orcamentoPorInstrumento.reduce((s, i) => s + i.pago, 0);
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);

  const getSemaforoColor = (percent: number) => {
    if (percent >= 80) return "hsl(142, 71%, 45%)";
    if (percent >= 50) return "hsl(45, 93%, 47%)";
    return "hsl(0, 84%, 60%)";
  };

  const composicaoData = orcamentoPorInstrumento.map(i => ({
    instrumento: i.instrumento,
    planejado: i.planejado,
    empenhado: i.empenhado,
    pago: i.pago,
  }));

  // Ranking municípios
  const rankingMunicipios = [
    { municipio: "Recife", valor: 18400000 },
    { municipio: "Caruaru", valor: 3200000 },
    { municipio: "Petrolina", valor: 2800000 },
    { municipio: "Olinda", valor: 2100000 },
    { municipio: "Garanhuns", valor: 1600000 },
  ];

  const porMesorregiao = [
    { name: "Metropolitana", percent: 71 },
    { name: "Agreste", percent: 16 },
    { name: "Sertão", percent: 9 },
    { name: "Vale SF", percent: 4 },
  ];

  return (
    <div className="space-y-4">
      {/* Card destaque */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Investido em Cultura</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInvestido)}</p>
                <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+8% vs. trimestre ant.</Badge>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground">Alavancagem Público/Privado</p>
            <p className="text-2xl font-bold">R$ 2,3 : R$ 1,00</p>
            <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+0,4 vs. anterior</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de execução */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Execução Orçamentária por Instrumento</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrumento</TableHead>
                  <TableHead>Planejado</TableHead>
                  <TableHead>Empenhado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>% Executado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamentoPorInstrumento.map(i => (
                  <TableRow key={i.instrumento}>
                    <TableCell className="font-medium text-sm">{i.instrumento}</TableCell>
                    <TableCell className="text-sm tabular-nums">{formatCurrency(i.planejado)}</TableCell>
                    <TableCell className="text-sm tabular-nums">{formatCurrency(i.empenhado)}</TableCell>
                    <TableCell className="text-sm tabular-nums">{formatCurrency(i.pago)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={i.percentExecutado} className="h-2 flex-1" style={{ "--progress-foreground": getSemaforoColor(i.percentExecutado) } as React.CSSProperties} />
                        <span className="text-xs font-medium tabular-nums" style={{ color: getSemaforoColor(i.percentExecutado) }}>{i.percentExecutado}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico composição + distribuição territorial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Composição do Investimento</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{
              planejado: { label: "Planejado", color: "hsl(215, 60%, 80%)" },
              empenhado: { label: "Empenhado", color: "hsl(215, 60%, 60%)" },
              pago: { label: "Pago", color: "hsl(var(--primary))" },
            }} className="h-[250px] w-full">
              <BarChart data={composicaoData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="instrumento" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="planejado" fill="hsl(215, 60%, 80%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="empenhado" fill="hsl(215, 60%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pago" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Distribuição Territorial do Fomento</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {rankingMunicipios.map((m, i) => (
                <div key={m.municipio} className="flex items-center justify-between">
                  <span className="text-sm"><span className="font-bold text-muted-foreground mr-2">{i + 1}.</span>{m.municipio}</span>
                  <span className="text-sm font-bold tabular-nums">{formatCurrency(m.valor)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Por Mesorregião</p>
              {porMesorregiao.map(m => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0">{m.name}</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${m.percent}%` }} />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-10 text-right">{m.percent}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
