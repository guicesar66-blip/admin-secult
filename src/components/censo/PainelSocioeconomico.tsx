import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { GraduationCap, Home, ShieldAlert } from "lucide-react";
import { REFERENCIA_SUPERIOR_PE, IVC_COLORS } from "@/data/mockProdutoras";
import type { EcossistemaData } from "@/hooks/useEcossistemaData";

interface PainelSocioeconomicoProps {
  filtroPeriodo: string;
  data: EcossistemaData;
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

function BlocoRenda({ data }: { data: EcossistemaData }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Distribuição de Renda Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.renda.map((item, i) => (
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

function BlocoEscolaridade({ data }: { data: EcossistemaData }) {
  const donutColors = [
    "hsl(215, 60%, 50%)", "hsl(270, 50%, 55%)", "hsl(142, 60%, 40%)",
    "hsl(38, 69%, 50%)", "hsl(340, 65%, 55%)", "hsl(0, 0%, 60%)",
  ];

  const percentSuperior = data.escolaridade
    .filter((d) => d.name.includes("Superior completo") || d.name.includes("Pós"))
    .reduce((s, d) => s + d.percent, 0);

  const chartConfig = Object.fromEntries(
    data.escolaridade.map((d, i) => [d.name, { label: d.name, color: donutColors[i % donutColors.length] }])
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
                <Pie data={data.escolaridade} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--background))">
                  {data.escolaridade.map((_, i) => (
                    <Cell key={i} fill={donutColors[i % donutColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {data.escolaridade.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
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

function BlocoMoradia({ data }: { data: EcossistemaData }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Home className="h-4 w-4" /> Acesso a Serviços Básicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.servicosBasicos.map((item) => (
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

function BlocoVulnerabilidade({ data }: { data: EcossistemaData }) {
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
            {data.vulnerabilidades.map((item) => (
              <ProgressBar
                key={item.name}
                label={item.name}
                percent={item.percent}
                color={item.percent >= 30 ? "bg-destructive" : item.percent >= 15 ? "bg-warning" : "bg-muted-foreground/50"}
              />
            ))}
            {data.vulnerabilidades.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma vulnerabilidade declarada para o filtro atual.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function BlocoIVC({ data }: { data: EcossistemaData }) {
  const chartConfig = Object.fromEntries(
    data.ivc.map((d, i) => [d.name, { label: d.name, color: IVC_COLORS[i] }])
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
              <Pie data={data.ivc} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" nameKey="name" strokeWidth={2} stroke="hsl(var(--background))">
                {data.ivc.map((_, i) => (
                  <Cell key={i} fill={IVC_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-3 flex-1">
            {data.ivc.map((item, i) => (
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

export function PainelSocioeconomico({ filtroPeriodo, data }: PainelSocioeconomicoProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: Renda + IVC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlocoRenda data={data} />
        <BlocoIVC data={data} />
      </div>

      {/* Row 2: Escolaridade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlocoEscolaridade data={data} />
      </div>

      {/* Row 3: Moradia + Vulnerabilidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlocoMoradia data={data} />
        <div className="space-y-4">
          <BlocoVulnerabilidade data={data} />
        </div>
      </div>
    </div>
  );
}
