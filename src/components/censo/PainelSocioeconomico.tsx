import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingDown, DollarSign, GraduationCap, Home, ShieldAlert, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  dadosRendaColetivos,
  RENDA_MEDIA_MEMBROS,
  SALARIO_MINIMO_2025,
  dadosRendaPorLinguagem,
  dadosEscolaridade,
  REFERENCIA_SUPERIOR_PE,
  dadosServicosBasicos,
  PERCENT_SEM_SERVICO,
  dadosVulnerabilidade,
  PERCENT_COLETIVOS_VULNERAVEL,
  dadosIVC,
  IVC_COLORS,
} from "@/data/mockColetivos";

interface PainelSocioeconomicoProps {
  filtroPeriodo: string;
}

// Reutilizável: barra de progresso horizontal com label
function ProgressBar({ label, percent, color = "bg-primary" }: { label: string; percent: number; color?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{percent}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

// Bloco: Renda
function BlocoRenda() {
  const percentSM = ((RENDA_MEDIA_MEMBROS / SALARIO_MINIMO_2025) * 100).toFixed(1);

  const rendaBarColors = [
    "hsl(0, 66%, 48%)",
    "hsl(24, 77%, 57%)",
    "hsl(38, 69%, 50%)",
    "hsl(142, 50%, 45%)",
    "hsl(215, 60%, 50%)",
  ];

  return (
    <>
      {/* Card destaque renda */}
      <Card className="border-warning/30 bg-gradient-to-r from-warning/5 to-transparent">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Renda Média Mensal dos Membros</p>
              <p className="text-3xl font-bold mt-1">
                R$ {RENDA_MEDIA_MEMBROS.toLocaleString("pt-BR")}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-sm font-medium text-warning">
                  <TrendingDown className="h-4 w-4" />
                  {percentSM}% do SM
                </div>
                <span className="text-xs text-muted-foreground">
                  (Salário mínimo: R$ {SALARIO_MINIMO_2025.toLocaleString("pt-BR")})
                </span>
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-warning/10 flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Distribuição de renda */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribuição de Renda Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dadosRendaColetivos.map((item, i) => (
                <ProgressBar
                  key={item.name}
                  label={`${item.name} (${item.value})`}
                  percent={item.percent}
                  color={i < 2 ? "bg-destructive" : i === 2 ? "bg-warning" : "bg-primary"}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Renda por linguagem - barras empilhadas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Renda por Linguagem Artística</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                semRenda: { label: "Sem renda", color: rendaBarColors[0] },
                ate600: { label: "Até R$600", color: rendaBarColors[1] },
                ate1320: { label: "R$600–1.320", color: rendaBarColors[2] },
                ate2640: { label: "R$1.320–2.640", color: rendaBarColors[3] },
                acima2640: { label: "Acima R$2.640", color: rendaBarColors[4] },
              }}
              className="h-[260px] w-full"
            >
              <BarChart data={dadosRendaPorLinguagem} layout="vertical" margin={{ left: 20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="linguagem" width={90} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="semRenda" stackId="a" fill={rendaBarColors[0]} />
                <Bar dataKey="ate600" stackId="a" fill={rendaBarColors[1]} />
                <Bar dataKey="ate1320" stackId="a" fill={rendaBarColors[2]} />
                <Bar dataKey="ate2640" stackId="a" fill={rendaBarColors[3]} />
                <Bar dataKey="acima2640" stackId="a" fill={rendaBarColors[4]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Bloco: Escolaridade
function BlocoEscolaridade() {
  const donutColors = [
    "hsl(215, 60%, 50%)",
    "hsl(270, 50%, 55%)",
    "hsl(142, 60%, 40%)",
    "hsl(38, 69%, 50%)",
    "hsl(340, 65%, 55%)",
    "hsl(0, 0%, 60%)",
  ];

  const percentSuperior = dadosEscolaridade
    .filter((d) => d.name.includes("Superior completo") || d.name.includes("Pós"))
    .reduce((s, d) => s + d.percent, 0);

  const chartConfig = Object.fromEntries(
    dadosEscolaridade.map((d, i) => [d.name, { label: d.name, color: donutColors[i] }])
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> Escolaridade dos Membros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <ChartContainer config={chartConfig} className="h-[180px] w-[180px] aspect-square">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={dadosEscolaridade} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--background))">
                  {dadosEscolaridade.map((_, i) => (
                    <Cell key={i} fill={donutColors[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {dadosEscolaridade.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: donutColors[i] }} />
                    <span className="text-muted-foreground text-xs">{item.name}</span>
                  </div>
                  <span className="font-medium tabular-nums text-xs">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Comparativo: Nível Superior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <ProgressBar label="Membros dos coletivos" percent={percentSuperior} color="bg-primary" />
            <ProgressBar label="Média setor cultural PE (IBGE)" percent={REFERENCIA_SUPERIOR_PE} color="bg-muted-foreground/50" />
          </div>
          <p className="text-xs text-muted-foreground">
            {percentSuperior < REFERENCIA_SUPERIOR_PE
              ? `Os membros de coletivos cadastrados têm ${(REFERENCIA_SUPERIOR_PE - percentSuperior).toFixed(1)}pp a menos de escolaridade superior que a média do setor cultural de PE.`
              : `Os membros de coletivos cadastrados superam a média do setor cultural de PE em ${(percentSuperior - REFERENCIA_SUPERIOR_PE).toFixed(1)}pp.`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Bloco: Moradia e Saneamento
function BlocoMoradia() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Home className="h-4 w-4" /> Acesso a Serviços Básicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dadosServicosBasicos.map((item) => (
              <ProgressBar
                key={item.name}
                label={item.name}
                percent={item.percent}
                color={item.percent >= 80 ? "bg-success" : item.percent >= 60 ? "bg-warning" : "bg-destructive"}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-gradient-to-r from-destructive/5 to-transparent">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sem acesso a ao menos 1 serviço básico</p>
              <p className="text-4xl font-bold mt-1 text-destructive">{PERCENT_SEM_SERVICO}%</p>
              <p className="text-xs text-muted-foreground mt-2">dos membros cadastrados</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Bloco: Vulnerabilidade
function BlocoVulnerabilidade() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Vulnerabilidades Declaradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dadosVulnerabilidade.map((item) => (
              <ProgressBar
                key={item.name}
                label={item.name}
                percent={item.percent}
                color={item.percent >= 30 ? "bg-destructive" : item.percent >= 15 ? "bg-warning" : "bg-muted-foreground/50"}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-warning/30 bg-gradient-to-r from-warning/5 to-transparent">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coletivos com membro vulnerável</p>
                <p className="text-4xl font-bold mt-1 text-warning">{PERCENT_COLETIVOS_VULNERAVEL}%</p>
                <p className="text-xs text-muted-foreground mt-2">ao menos 1 membro em situação de vulnerabilidade</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-warning/10 flex items-center justify-center">
                <ShieldAlert className="h-7 w-7 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Dados autodeclarados pelos membros. A CENA não valida as informações junto a órgãos externos.</span>
        </div>
      </div>
    </div>
  );
}

// Bloco: IVC
function BlocoIVC() {
  const chartConfig = Object.fromEntries(
    dadosIVC.map((d, i) => [d.name, { label: d.name, color: IVC_COLORS[i] }])
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Coletivos por Faixa de Vulnerabilidade Composta (IVC)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ChartContainer config={chartConfig} className="h-[180px] w-[180px] aspect-square">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={dadosIVC} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--background))">
                {dadosIVC.map((_, i) => (
                  <Cell key={i} fill={IVC_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-3 flex-1">
            {dadosIVC.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: IVC_COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{item.value}</span>
                  <span className="text-muted-foreground text-xs">({item.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PainelSocioeconomico({ filtroPeriodo }: PainelSocioeconomicoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Painel Socioeconômico dos Coletivos</h3>

      <BlocoRenda />
      <BlocoEscolaridade />
      <BlocoMoradia />
      <BlocoVulnerabilidade />
      <BlocoIVC />
    </div>
  );
}
