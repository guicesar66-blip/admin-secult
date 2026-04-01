import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// ===== Data =====
const dadosGenero = [
  { name: "Masculino", value: 358, percent: 54 },
  { name: "Feminino", value: 285, percent: 43 },
  { name: "Não-binário/outro", value: 19, percent: 3 },
];

const dadosRaca = [
  { name: "Parda", value: 318, percent: 48 },
  { name: "Branca", value: 172, percent: 26 },
  { name: "Preta", value: 146, percent: 22 },
  { name: "Outros", value: 26, percent: 4 },
];

const dadosFaixaEtaria = [
  { name: "18-25a", value: 119, percent: 18 },
  { name: "26-35a", value: 205, percent: 31 },
  { name: "36-45a", value: 185, percent: 28 },
  { name: "46-60a", value: 113, percent: 17 },
  { name: "60+", value: 40, percent: 6 },
];

const dadosFormalizacao = [
  { name: "Informal", value: 291, percent: 44, fullMark: 50 },
  { name: "MEI", value: 205, percent: 31, fullMark: 50 },
  { name: "Coletivo", value: 86, percent: 13, fullMark: 50 },
  { name: "ME/EPP", value: 80, percent: 12, fullMark: 50 },
];

const dadosLinguagem = [
  { name: "Música", value: 185, percent: 28 },
  { name: "Cultura Popular", value: 146, percent: 22 },
  { name: "Artes Visuais", value: 106, percent: 16 },
  { name: "Teatro", value: 79, percent: 12 },
  { name: "Artesanato", value: 73, percent: 11 },
  { name: "Dança", value: 46, percent: 7 },
  { name: "Audiovisual", value: 27, percent: 4 },
];

const DONUT_COLORS_GENERO = [
  "hsl(215, 60%, 50%)",
  "hsl(340, 65%, 55%)",
  "hsl(270, 50%, 55%)",
];

const DONUT_COLORS_RACA = [
  "hsl(24, 77%, 57%)",
  "hsl(38, 69%, 50%)",
  "hsl(0, 66%, 48%)",
  "hsl(215, 20%, 65%)",
];

const FAIXA_ETARIA_COLORS = [
  "hsl(215, 60%, 65%)",
  "hsl(215, 60%, 50%)",
  "hsl(215, 60%, 40%)",
  "hsl(215, 50%, 55%)",
  "hsl(215, 40%, 70%)",
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
    data.map((d, i) => [d.name, { label: d.name, color: colors[i] }])
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
                  <Cell key={i} fill={colors[i]} />
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
                    style={{ backgroundColor: colors[i] }}
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
}

export function DemografiaCharts({ filtroLinguagem }: DemografiaChartsProps) {
  // Filter linguagem data if a specific language is selected
  const linguagemInfo = useMemo(() => {
    if (filtroLinguagem === "todas") return null;
    return dadosLinguagem.find((d) => d.name === filtroLinguagem);
  }, [filtroLinguagem]);

  const faixaEtariaConfig = Object.fromEntries(
    dadosFaixaEtaria.map((d, i) => [d.name, { label: d.name, color: FAIXA_ETARIA_COLORS[i] }])
  );

  const formalizacaoConfig = {
    percent: { label: "Participação (%)", color: "hsl(var(--primary))" },
  };

  return (
    <>
      {/* Donut charts — Gênero and Raça/Cor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DonutChart title="Distribuição por Gênero" data={dadosGenero} colors={DONUT_COLORS_GENERO} />
        <DonutChart title="Distribuição por Raça/Cor" data={dadosRaca} colors={DONUT_COLORS_RACA} />
      </div>

      {/* Diversified charts: Stacked bar (Faixa Etária), Radar (Formalização), Donut (Linguagem) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Faixa Etária — Stacked vertical bar */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Distribuição por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={faixaEtariaConfig} className="h-[220px] w-full">
              <BarChart data={dadosFaixaEtaria} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {dadosFaixaEtaria.map((entry, i) => null)}
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dadosFaixaEtaria.map((_, i) => (
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
              <RadarChart data={dadosFormalizacao} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid className="stroke-border/40" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 50]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Radar
                  name="Participação (%)"
                  dataKey="percent"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {dadosFormalizacao.map((item) => (
                <span key={item.name} className="text-xs text-muted-foreground">
                  {item.name}: <span className="font-medium text-foreground">{item.value}</span> ({item.percent}%)
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Linguagem Artística — Donut */}
        {filtroLinguagem === "todas" ? (
          <DonutChart
            title="Distribuição por Linguagem"
            data={dadosLinguagem}
            colors={[
              "hsl(215, 60%, 50%)", "hsl(24, 77%, 57%)", "hsl(142, 60%, 40%)",
              "hsl(270, 50%, 55%)", "hsl(38, 69%, 50%)", "hsl(340, 65%, 55%)",
              "hsl(0, 66%, 48%)",
            ]}
          />
        ) : (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Linguagem Filtrada</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[220px]">
              {linguagemInfo ? (
                <>
                  <p className="text-3xl font-bold">{linguagemInfo.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">agentes em <span className="font-medium text-foreground">{filtroLinguagem}</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">{linguagemInfo.percent}% do total</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum dado para "{filtroLinguagem}"</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
