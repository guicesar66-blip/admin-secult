import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { MapPin, Palette } from "lucide-react";
import {
  equipamentosMock,
  tiposEquipamento,
  evolucaoPublicoMensal,
} from "@/data/mockEquipamentosCulturais";

interface AtividadeEspacosProps {
  filtroLinguagem?: string;
  filtroCidades?: string[];
}

export function AtividadeEspacos({ filtroLinguagem = "todas", filtroCidades = [] }: AtividadeEspacosProps) {
  const baseData = useMemo(() => {
    let result = equipamentosMock;
    if (filtroLinguagem !== "todas") result = result.filter(e => e.linguagens.some(l => l.toLowerCase().includes(filtroLinguagem.toLowerCase())));
    if (filtroCidades.length > 0) result = result.filter(e => filtroCidades.includes(e.municipio));
    return result;
  }, [filtroLinguagem, filtroCidades]);

  const ativos = baseData.filter(e => e.status === "Ativo");

  const byTipo = useMemo(() => tiposEquipamento.map(t => ({
    tipo: t,
    count: baseData.filter(e => e.tipo === t).length,
    publicoMedio: Math.round(ativos.filter(e => e.tipo === t).reduce((s, e) => s + e.publicoMensal, 0) / (ativos.filter(e => e.tipo === t).length || 1)),
    projetos: baseData.filter(e => e.tipo === t).reduce((s, e) => s + e.projetosRealizados, 0),
  })), [baseData, ativos]);

  const rankingPublico = useMemo(() =>
    [...ativos].sort((a, b) => b.publicoMensal - a.publicoMensal).slice(0, 10).map(e => ({ name: e.nome.length > 25 ? e.nome.slice(0, 22) + "…" : e.nome, value: e.publicoMensal })),
  [ativos]);

  const rankingProjetos = useMemo(() =>
    [...baseData].sort((a, b) => b.projetosRealizados - a.projetosRealizados).slice(0, 10).map(e => ({ name: e.nome.length > 25 ? e.nome.slice(0, 22) + "…" : e.nome, value: e.projetosRealizados })),
  [baseData]);

  const taxaOcupacao = 34;
  const taxaReuso = baseData.length > 0 ? Math.round(baseData.filter(e => e.projetosRealizados > 3).length / baseData.length * 100) : 0;

  const mesorregioes = ["Metropolitana", "Agreste", "Sertão", "Vale do São Francisco"] as const;
  const popEstimada: Record<string, number> = { Metropolitana: 4000000, Agreste: 2300000, Sertão: 1200000, "Vale do São Francisco": 800000 };
  const byMesorregiao = mesorregioes.map(m => ({
    name: m === "Vale do São Francisco" ? "Vale SF" : m,
    espacos: baseData.filter(e => e.mesorregiao === m).length,
    por100k: parseFloat((baseData.filter(e => e.mesorregiao === m).length / (popEstimada[m] / 100000)).toFixed(2)),
  }));

  const allLinguagens = [...new Set(baseData.flatMap(e => e.linguagens))];
  const lingRanking = allLinguagens.map(l => ({
    name: l,
    percent: baseData.length > 0 ? Math.round(baseData.filter(e => e.linguagens.includes(l)).length / baseData.length * 100) : 0,
  })).sort((a, b) => b.percent - a.percent);
  const multiLinguagem = baseData.length > 0 ? Math.round(baseData.filter(e => e.linguagens.length >= 3).length / baseData.length * 100) : 0;

  const chartConfigLine = { publico: { label: "Público", color: "hsl(var(--primary))" } };
  const chartConfigBar = { value: { label: "Público/mês", color: "hsl(var(--primary))" } };
  const chartConfigProj = { value: { label: "Projetos", color: "hsl(215, 60%, 50%)" } };

  return (
    <div className="space-y-6">
      {/* Frequência e Uso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Público Médio Mensal por Tipo</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBar} className="h-[220px] w-full">
              <BarChart data={byTipo.map(t => ({ name: t.tipo, value: t.publicoMedio }))} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Evolução Mensal do Público</CardTitle>
              <Badge variant="outline" className="text-[10px]">Taxa ocupação: {taxaOcupacao}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigLine} className="h-[220px] w-full">
              <LineChart data={evolucaoPublicoMensal} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="publico" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Top 10 Espaços por Público</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBar} className="h-[250px] w-full">
              <BarChart data={rankingPublico} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={140} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projetos nos Espaços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Projetos por Tipo de Espaço</CardTitle>
              <Badge variant="outline" className="text-[10px]">Reuso (&gt;3 proj.): {taxaReuso}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigProj} className="h-[220px] w-full">
              <BarChart data={byTipo.map(t => ({ name: t.tipo, value: t.projetos }))} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(215, 60%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Top 10 Espaços por Projetos Executados</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigProj} className="h-[250px] w-full">
              <BarChart data={rankingProjetos} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={140} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(215, 60%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição Territorial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Espaços por Mesorregião
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ espacos: { label: "Espaços", color: "hsl(var(--primary))" } }} className="h-[200px] w-full">
              <BarChart data={byMesorregiao} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="espacos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Espaços por 100k Habitantes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {byMesorregiao.map(m => (
                <div key={m.name} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{m.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(m.por100k / 2 * 100, 100)}%` }} />
                    </div>
                    <span className="text-sm font-bold tabular-nums w-10 text-right">{m.por100k}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
              Municípios sem espaço: 157 de 185 (85%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Diversidade de Linguagens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4" /> Linguagens nos Espaços Culturais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lingRanking.map(l => (
                <div key={l.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0">{l.name}</span>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${l.percent}%` }} />
                  </div>
                  <span className="text-xs font-medium tabular-nums w-10 text-right">{l.percent}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Multidisciplinaridade</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-5xl font-bold text-primary">{multiLinguagem}%</p>
            <p className="text-sm text-muted-foreground mt-2 text-center">dos espaços sediam 3 ou mais linguagens diferentes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
