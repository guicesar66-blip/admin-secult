import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import type { EcossistemaData } from "@/hooks/useEcossistemaData";

const DONUT_COLORS_GENERO = [
  "#3567C4",
  "#C41200",
  "#1A2A4A",
];

const DONUT_COLORS_RACA = [
  "#C41200",
  "#C85A1A",
  "#C41200",
  "#8A9BB5",
  "#00A84F",
  "#1A2A4A",
];

const FAIXA_ETARIA_COLORS = [
  "#5A8FD4",
  "#3567C4",
  "#1A2A4A",
  "#2A52A3",
  "#8A9BB5",
];

const LINGUAGEM_COLORS = [
  "#3567C4", "#C41200", "#00A84F",
  "#1A2A4A", "#C85A1A", "#FFBD0C",
  "#9A0E00", "#3567C4", "#007A3A",
];

// ===== Reusable DonutChart =====
function DonutChart({
  title,
  data,
  colors,
}: {
  title: string;
  data: { name: string; value: number; percent: number }[];
  colors: string[];
}) {
  const chartConfig = Object.fromEntries(
    data.map((d, i) => [d.name, { label: d.name, color: colors[i % colors.length] }])
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ChartContainer config={chartConfig} className="h-[170px] w-[170px] aspect-square shrink-0">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                nameKey="name"
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="flex flex-col gap-2 flex-1">
            {data.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm shrink-0"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  />
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

interface DemografiaChartsProps {
  filtroLinguagem: string;
  data: EcossistemaData;
}

export function DemografiaCharts({ filtroLinguagem, data }: DemografiaChartsProps) {
  const faixaEtariaConfig = Object.fromEntries(
    data.faixaEtaria.map((d, i) => [d.name, { label: d.name, color: FAIXA_ETARIA_COLORS[i] }])
  );

  const formalizacaoConfig = {
    percent: { label: "Participação (%)", color: "hsl(var(--primary))" },
  };

  return (
    <>
      {/* Donut charts — Gênero and Raça/Cor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DonutChart title="Distribuição por Gênero" data={data.genero} colors={DONUT_COLORS_GENERO} />
        <DonutChart title="Distribuição por Raça/Cor" data={data.raca} colors={DONUT_COLORS_RACA} />
      </div>

      {/* Diversified charts: Stacked bar (Faixa Etária), Radar (Formalização), Linguagem */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Faixa Etária — Stacked vertical bar */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribuição por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={faixaEtariaConfig} className="h-[220px] w-full">
              <BarChart data={data.faixaEtaria} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.faixaEtaria.map((_, i) => (
                    <Cell key={i} fill={FAIXA_ETARIA_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Formalização — Radar chart */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribuição por Formalização</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={formalizacaoConfig} className="h-[220px] w-full">
              <RadarChart data={data.formalizacao} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid className="stroke-border/40" gridType="polygon" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, "dataMax"]} tickCount={4} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Radar
                  name="Agentes"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                />
              </RadarChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.formalizacao.map((item) => (
                <span key={item.name} className="text-xs text-muted-foreground">
                  {item.name}: <span className="font-medium text-foreground">{item.value}</span> ({item.percent}%)
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Linguagem — tipos principais (donut) ou subtipos quando filtrado (bar) */}
        {filtroLinguagem === "todas" ? (
          <DonutChart
            title="Distribuição por Linguagem"
            data={data.linguagem}
            colors={LINGUAGEM_COLORS}
          />
        ) : data.linguagemSubtipos.length > 0 ? (
          <DonutChart
            title={`Subtipos — ${data.filtroTipoNome}`}
            data={data.linguagemSubtipos}
            colors={LINGUAGEM_COLORS}
          />
        ) : (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Subtipos — {data.filtroTipoNome}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[220px]">
              <p className="text-sm text-muted-foreground">Nenhum dado para "{filtroLinguagem}"</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
