import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { GraduationCap, Home, ShieldAlert, Info } from "lucide-react";
import {
  dadosRendaColetivos,
  dadosEscolaridade,
  REFERENCIA_SUPERIOR_PE,
  dadosServicosBasicos,
  dadosVulnerabilidade,
  dadosIVC,
  IVC_COLORS,
} from "@/data/mockColetivos";

interface PainelSocioeconomicoProps {
  filtroPeriodo: string;
}

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

function BlocoRenda() {
  return (
    <Card className="h-full">
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
  );
}

function BlocoEscolaridade() {
  const donutColors = [
    "hsl(215, 60%, 50%)", "hsl(270, 50%, 55%)", "hsl(142, 60%, 40%)",
    "hsl(38, 69%, 50%)", "hsl(340, 65%, 55%)", "hsl(0, 0%, 60%)",
  ];

  const percentSuperior = dadosEscolaridade
    .filter((d) => d.name.includes("Superior completo") || d.name.includes("Pós"))
    .reduce((s, d) => s + d.percent, 0);

  const chartConfig = Object.fromEntries(
    dadosEscolaridade.map((d, i) => [d.name, { label: d.name, color: donutColors[i] }])
  );

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> Escolaridade dos Membros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <ChartContainer config={chartConfig} className="h-[170px] w-[170px] aspect-square shrink-0">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie data={dadosEscolaridade} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--background))">
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

      <Card className="h-full">
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
              ? `Os membros têm ${(REFERENCIA_SUPERIOR_PE - percentSuperior).toFixed(1)}pp a menos de escolaridade superior que a média do setor cultural de PE.`
              : `Os membros superam a média do setor cultural de PE em ${(percentSuperior - REFERENCIA_SUPERIOR_PE).toFixed(1)}pp.`}
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function BlocoMoradia() {
  return (
    <Card className="h-full">
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
  );
}

function BlocoVulnerabilidade() {
  return (
    <>
      <Card className="h-full">
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
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>Dados autodeclarados pelos membros. A CENA não valida as informações junto a órgãos externos.</span>
      </div>
    </>
  );
}

function BlocoIVC() {
  const chartConfig = Object.fromEntries(
    dadosIVC.map((d, i) => [d.name, { label: d.name, color: IVC_COLORS[i] }])
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Coletivos por Faixa de Vulnerabilidade (IVC)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ChartContainer config={chartConfig} className="h-[170px] w-[170px] aspect-square shrink-0">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={dadosIVC} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--background))">
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
      {/* Row 1: Renda + IVC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlocoRenda />
        <BlocoIVC />
      </div>

      {/* Row 2: Escolaridade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlocoEscolaridade />
      </div>

      {/* Row 3: Moradia + Vulnerabilidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlocoMoradia />
        <div className="space-y-4">
          <BlocoVulnerabilidade />
        </div>
      </div>
    </div>
  );
}
