import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { AlertTriangle, Accessibility, MapPin } from "lucide-react";
import {
  equipamentosMock,
  evolucaoConservacaoTrimestral,
} from "@/data/mockEquipamentosCulturais";

function DonutChart({ title, data, colors }: { title: string; data: { name: string; value: number; percent: number }[]; colors: string[] }) {
  const chartConfig = Object.fromEntries(data.map((d, i) => [d.name, { label: d.name, color: colors[i % colors.length] }]));
  return (
    <Card className="h-full">
      <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ChartContainer config={chartConfig} className="h-[160px] w-[160px] aspect-square shrink-0">
            <PieChart><ChartTooltip content={<ChartTooltipContent />} /><Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--background))">
              {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie></PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-1.5 flex-1">
            {data.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-muted-foreground text-xs">{item.name}</span>
                </div>
                <span className="font-medium tabular-nums text-xs">{item.value} ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QualidadeEspacosProps {
  filtroLinguagem?: string;
  filtroCidades?: string[];
}

export function QualidadeEspacos({ filtroLinguagem = "todas", filtroCidades = [] }: QualidadeEspacosProps) {
  const baseData = useMemo(() => {
    let result = equipamentosMock;
    if (filtroLinguagem !== "todas") result = result.filter(e => e.linguagens.some(l => l.toLowerCase().includes(filtroLinguagem.toLowerCase())));
    if (filtroCidades.length > 0) result = result.filter(e => filtroCidades.includes(e.municipio));
    return result;
  }, [filtroLinguagem, filtroCidades]);
  const ativos = baseData.filter(e => e.status === "Ativo");

  const conservacao = useMemo(() => {
    const cats = ["Excelente", "Bom", "Regular", "Precário"] as const;
    const total = baseData.length || 1;
    return cats.map(c => ({ name: c, value: baseData.filter(e => e.conservacao === c).length, percent: Math.round(baseData.filter(e => e.conservacao === c).length / total * 100) }));
  }, [baseData]);

  const precarios = baseData.filter(e => e.conservacao === "Precário");

  const acessKeys: (keyof typeof equipamentosMock[0]["acessibilidade"])[] = ["rampa", "elevador", "banheiro_adaptado", "piso_tatil", "vagas_pcd", "audiodescricao", "libras"];
  const acessLabels: Record<string, string> = { rampa: "Rampa", elevador: "Elevador", banheiro_adaptado: "Banheiro adapt.", piso_tatil: "Piso tátil", vagas_pcd: "Vagas PCD", audiodescricao: "Audiodescrição", libras: "Libras" };
  const acessData = acessKeys.map(k => ({ name: acessLabels[k], percent: baseData.length > 0 ? Math.round(baseData.filter(e => e.acessibilidade[k]).length / baseData.length * 100) : 0 })).sort((a, b) => b.percent - a.percent);

  const nivelAcess = useMemo(() => {
    const total = baseData.length || 1;
    return [
      { name: "Totalmente", value: baseData.filter(e => e.nivelAcessibilidade === "Total").length, percent: Math.round(baseData.filter(e => e.nivelAcessibilidade === "Total").length / total * 100) },
      { name: "Parcialmente", value: baseData.filter(e => e.nivelAcessibilidade === "Parcial").length, percent: Math.round(baseData.filter(e => e.nivelAcessibilidade === "Parcial").length / total * 100) },
      { name: "Não acessível", value: baseData.filter(e => e.nivelAcessibilidade === "Não acessível").length, percent: Math.round(baseData.filter(e => e.nivelAcessibilidade === "Não acessível").length / total * 100) },
    ];
  }, [baseData]);

  return (
    <div className="space-y-6">
      {/* Conservação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DonutChart title="Status de Conservação" data={conservacao} colors={["#00A84F", "#FFBD0C", "#C85A1A", "#C41200"]} />

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Evolução da Conservação (trimestral)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ Excelente: { label: "Excelente", color: "#00A84F" }, Bom: { label: "Bom", color: "#FFBD0C" }, Regular: { label: "Regular", color: "#C85A1A" }, Precário: { label: "Precário", color: "#C41200" } }} className="h-[220px] w-full">
              <AreaChart data={evolucaoConservacaoTrimestral} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="trimestre" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="Excelente" stackId="1" stroke="#00A84F" fill="#00A84F" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Bom" stackId="1" stroke="#FFBD0C" fill="#FFBD0C" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Regular" stackId="1" stroke="#C85A1A" fill="#C85A1A" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Precário" stackId="1" stroke="#C41200" fill="#C41200" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {precarios.length > 0 && (
          <Card className="border-destructive/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Espaços em Estado Precário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {precarios.map(e => (
                  <div key={e.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{e.nome}</span>
                    <span className="text-muted-foreground text-xs">{e.municipio}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Avaliação Geral dos Espaços</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <p className="text-xs text-muted-foreground mb-1">Artistas</p>
                <p className="text-3xl font-bold">{(ativos.reduce((s, e) => s + e.avaliacaoArtistas, 0) / ativos.length).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">⭐ de 5.0</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <p className="text-xs text-muted-foreground mb-1">Cidadãos</p>
                <p className="text-3xl font-bold">{(ativos.reduce((s, e) => s + e.avaliacaoCidadaos, 0) / ativos.length).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">⭐ de 5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acessibilidade PCD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Accessibility className="h-4 w-4" /> Acessibilidade — Recursos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {acessData.map(a => (
                <div key={a.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0">{a.name}</span>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${a.percent}%` }} />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-10 text-right">{a.percent}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <DonutChart title="Nível de Acessibilidade" data={nivelAcess} colors={["#22c55e", "#eab308", "#ef4444"]} />
      </div>
    </div>
  );
}
