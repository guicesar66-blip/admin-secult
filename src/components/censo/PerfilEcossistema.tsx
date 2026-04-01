import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, TrendingDown } from "lucide-react";

// Dados mockados conforme história de usuário
const TOTAL_AGENTES = 662;
const VARIACAO_PERIODO = "+8,2%";
const VARIACAO_ABSOLUTA = "+50";

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
  { name: "Informal", value: 291, percent: 44 },
  { name: "MEI", value: 205, percent: 31 },
  { name: "Coletivo", value: 86, percent: 13 },
  { name: "ME/EPP", value: 80, percent: 12 },
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

const BAR_COLOR = "hsl(var(--primary))";

interface PerfilEcossistemaProps {
  filtroPeriodo: string;
}

function DonutChart({
  title,
  data,
  colors,
}: {
  title: string;
  data: { name: string; value: number; percent: number }[];
  colors: string[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const chartConfig = Object.fromEntries(
    data.map((d, i) => [d.name, { label: d.name, color: colors[i] }])
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ChartContainer config={chartConfig} className="h-[180px] w-[180px] aspect-square">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
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

function HorizontalBarChart({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number; percent: number }[];
}) {
  const chartConfig = Object.fromEntries(
    data.map((d) => [d.name, { label: d.name, color: BAR_COLOR }])
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{item.value}</span>
                  <span className="text-muted-foreground text-xs">({item.percent}%)</span>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerfilEcossistema({ filtroPeriodo }: PerfilEcossistemaProps) {
  return (
    <div className="space-y-4">
      {/* Card de destaque — Total de agentes com mini-tendência */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Agentes Culturais</p>
              <p className="text-4xl font-bold mt-1">{TOTAL_AGENTES.toLocaleString("pt-BR")}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-sm font-medium text-success">
                  <TrendingUp className="h-4 w-4" />
                  {VARIACAO_PERIODO}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({VARIACAO_ABSOLUTA} no período: {filtroPeriodo})
                </span>
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="h-7 w-7 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donut charts — Gênero e Raça/Cor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DonutChart
          title="Distribuição por Gênero"
          data={dadosGenero}
          colors={DONUT_COLORS_GENERO}
        />
        <DonutChart
          title="Distribuição por Raça/Cor"
          data={dadosRaca}
          colors={DONUT_COLORS_RACA}
        />
      </div>

      {/* Bar charts — Faixa Etária, Formalização, Linguagem */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <HorizontalBarChart
          title="Distribuição por Faixa Etária"
          data={dadosFaixaEtaria}
        />
        <HorizontalBarChart
          title="Distribuição por Formalização"
          data={dadosFormalizacao}
        />
        <HorizontalBarChart
          title="Distribuição por Linguagem Artística"
          data={dadosLinguagem}
        />
      </div>
    </div>
  );
}
