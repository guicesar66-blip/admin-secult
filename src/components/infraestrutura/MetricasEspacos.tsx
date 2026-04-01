import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  AreaChart, Area,
} from "recharts";
import {
  Building2, Users, Briefcase, AlertTriangle, Accessibility, MapPin, Palette, TrendingUp,
} from "lucide-react";
import {
  equipamentosMock,
  tiposEquipamento,
  iconesTipoEquipamento,
  conservacaoCores,
  evolucaoPublicoMensal,
  evolucaoConservacaoTrimestral,
  projetosPorInstrumento,
} from "@/data/mockEquipamentosCulturais";

// ===== REUSABLE DONUT =====
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

export function MetricasEspacos() {
  const ativos = equipamentosMock.filter(e => e.status === "Ativo");
  const inativos = equipamentosMock.filter(e => e.status === "Inativo");
  const percentInativos = Math.round((inativos.length / equipamentosMock.length) * 100);
  const capacidadeTotal = equipamentosMock.reduce((s, e) => s + (e.capacidade || 0), 0);
  const publicoTotal = ativos.reduce((s, e) => s + e.publicoMensal * 3, 0); // trimestre
  const mediaProjetos = (equipamentosMock.reduce((s, e) => s + e.projetosRealizados, 0) / equipamentosMock.length).toFixed(1);

  // By tipo
  const byTipo = useMemo(() => tiposEquipamento.map(t => ({
    tipo: t,
    icon: iconesTipoEquipamento[t],
    count: equipamentosMock.filter(e => e.tipo === t).length,
    publicoMedio: Math.round(ativos.filter(e => e.tipo === t).reduce((s, e) => s + e.publicoMensal, 0) / (ativos.filter(e => e.tipo === t).length || 1)),
    projetos: equipamentosMock.filter(e => e.tipo === t).reduce((s, e) => s + e.projetosRealizados, 0),
  })), [ativos]);

  // Ranking público
  const rankingPublico = useMemo(() =>
    [...ativos].sort((a, b) => b.publicoMensal - a.publicoMensal).slice(0, 10).map(e => ({ name: e.nome.length > 25 ? e.nome.slice(0, 22) + "…" : e.nome, value: e.publicoMensal })),
  [ativos]);

  // Ranking projetos
  const rankingProjetos = useMemo(() =>
    [...equipamentosMock].sort((a, b) => b.projetosRealizados - a.projetosRealizados).slice(0, 10).map(e => ({ name: e.nome.length > 25 ? e.nome.slice(0, 22) + "…" : e.nome, value: e.projetosRealizados })),
  []);

  // Conservação donut
  const conservacao = useMemo(() => {
    const cats = ["Excelente", "Bom", "Regular", "Precário"] as const;
    const total = equipamentosMock.length;
    return cats.map(c => ({ name: c, value: equipamentosMock.filter(e => e.conservacao === c).length, percent: Math.round(equipamentosMock.filter(e => e.conservacao === c).length / total * 100) }));
  }, []);

  // Precários
  const precarios = equipamentosMock.filter(e => e.conservacao === "Precário");

  // Acessibilidade
  const acessKeys: (keyof typeof equipamentosMock[0]["acessibilidade"])[] = ["rampa", "elevador", "banheiro_adaptado", "piso_tatil", "vagas_pcd", "audiodescricao", "libras"];
  const acessLabels: Record<string, string> = { rampa: "Rampa", elevador: "Elevador", banheiro_adaptado: "Banheiro adapt.", piso_tatil: "Piso tátil", vagas_pcd: "Vagas PCD", audiodescricao: "Audiodescrição", libras: "Libras" };
  const acessData = acessKeys.map(k => ({ name: acessLabels[k], percent: Math.round(equipamentosMock.filter(e => e.acessibilidade[k]).length / equipamentosMock.length * 100) })).sort((a, b) => b.percent - a.percent);
  const nivelAcess = useMemo(() => {
    const total = equipamentosMock.length;
    return [
      { name: "Totalmente", value: equipamentosMock.filter(e => e.nivelAcessibilidade === "Total").length, percent: Math.round(equipamentosMock.filter(e => e.nivelAcessibilidade === "Total").length / total * 100) },
      { name: "Parcialmente", value: equipamentosMock.filter(e => e.nivelAcessibilidade === "Parcial").length, percent: Math.round(equipamentosMock.filter(e => e.nivelAcessibilidade === "Parcial").length / total * 100) },
      { name: "Não acessível", value: equipamentosMock.filter(e => e.nivelAcessibilidade === "Não acessível").length, percent: Math.round(equipamentosMock.filter(e => e.nivelAcessibilidade === "Não acessível").length / total * 100) },
    ];
  }, []);

  // Por mesorregião
  const mesorregioes = ["Metropolitana", "Agreste", "Sertão", "Vale do São Francisco"] as const;
  const popEstimada: Record<string, number> = { Metropolitana: 4000000, Agreste: 2300000, Sertão: 1200000, "Vale do São Francisco": 800000 };
  const byMesorregiao = mesorregioes.map(m => ({
    name: m === "Vale do São Francisco" ? "Vale SF" : m,
    espacos: equipamentosMock.filter(e => e.mesorregiao === m).length,
    por100k: parseFloat((equipamentosMock.filter(e => e.mesorregiao === m).length / (popEstimada[m] / 100000)).toFixed(2)),
  }));

  // Diversidade linguagens
  const allLinguagens = [...new Set(equipamentosMock.flatMap(e => e.linguagens))];
  const lingRanking = allLinguagens.map(l => ({
    name: l,
    percent: Math.round(equipamentosMock.filter(e => e.linguagens.includes(l)).length / equipamentosMock.length * 100),
  })).sort((a, b) => b.percent - a.percent);
  const multiLinguagem = Math.round(equipamentosMock.filter(e => e.linguagens.length >= 3).length / equipamentosMock.length * 100);

  // Taxa ocupação
  const taxaOcupacao = 34;
  // Taxa reuso
  const taxaReuso = Math.round(equipamentosMock.filter(e => e.projetosRealizados > 3).length / equipamentosMock.length * 100);

  const chartConfigLine = { publico: { label: "Público", color: "hsl(var(--primary))" } };
  const chartConfigBar = { value: { label: "Público/mês", color: "hsl(var(--primary))" } };
  const chartConfigProj = { value: { label: "Projetos", color: "hsl(215, 60%, 50%)" } };

  return (
    <div className="space-y-6">
      {/* ===== CARDS DE RESUMO ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Espaços</p>
                <p className="text-2xl font-bold">{equipamentosMock.length}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {byTipo.map(t => <span key={t.tipo} className="text-[10px] text-muted-foreground">{t.icon}{t.count}</span>)}
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Ativos / Inativos</p>
                <p className="text-2xl font-bold">{ativos.length} <span className="text-sm font-normal text-muted-foreground">/ {inativos.length}</span></p>
                {percentInativos > 20 && <Badge variant="destructive" className="text-[10px] mt-1">⚠ {percentInativos}% inativos</Badge>}
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Capacidade Total</p>
                <p className="text-2xl font-bold">{capacidadeTotal.toLocaleString("pt-BR")}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Público (trimestre)</p>
                <p className="text-2xl font-bold">{(publicoTotal / 1000).toFixed(0)}k</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-amber-600" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Média Projetos/Espaço</p>
                <p className="text-2xl font-bold">{mediaProjetos}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-purple-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== BLOCO: FREQUÊNCIA E USO ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Público médio por tipo */}
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

        {/* Evolução mensal público */}
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

        {/* Ranking público */}
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

      {/* ===== BLOCO: PROJETOS NOS ESPAÇOS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Projetos por tipo */}
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


        {/* Ranking projetos */}
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

      {/* ===== BLOCO: QUALIDADE E CONSERVAÇÃO ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DonutChart title="Status de Conservação" data={conservacao} colors={["#22c55e", "#eab308", "#f97316", "#ef4444"]} />

        {/* Evolução trimestral */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Evolução da Conservação (trimestral)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ Excelente: { label: "Excelente", color: "#22c55e" }, Bom: { label: "Bom", color: "#eab308" }, Regular: { label: "Regular", color: "#f97316" }, Precário: { label: "Precário", color: "#ef4444" } }} className="h-[220px] w-full">
              <AreaChart data={evolucaoConservacaoTrimestral} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="trimestre" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="Excelente" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Bom" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Regular" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Precário" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Alertas precários */}
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

        {/* Avaliação média */}
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

      {/* ===== BLOCO: ACESSIBILIDADE PCD ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recursos disponíveis */}
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

        {/* Nível de acessibilidade */}
        <DonutChart title="Nível de Acessibilidade" data={nivelAcess} colors={["#22c55e", "#eab308", "#ef4444"]} />
      </div>

      {/* ===== BLOCO: DISTRIBUIÇÃO POR LOCALIZAÇÃO ===== */}
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

      {/* ===== BLOCO: DIVERSIDADE DE LINGUAGENS ===== */}
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
