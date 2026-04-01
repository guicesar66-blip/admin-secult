import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const dadosMensais = [
  { mes: "Jan", cadastros: 42, editais: 1 },
  { mes: "Fev", cadastros: 55, editais: 0 },
  { mes: "Mar", cadastros: 89, editais: 3, anotacao: "Pico — abertura SIC 2024" },
  { mes: "Abr", cadastros: 61, editais: 2 },
  { mes: "Mai", cadastros: 47, editais: 0 },
  { mes: "Jun", cadastros: 51, editais: 1 },
  { mes: "Jul", cadastros: 58, editais: 1 },
  { mes: "Ago", cadastros: 63, editais: 2 },
  { mes: "Set", cadastros: 67, editais: 1 },
  { mes: "Out", cadastros: 54, editais: 0 },
  { mes: "Nov", cadastros: 49, editais: 1 },
  { mes: "Dez", cadastros: 48, editais: 0 },
];

interface EvolucaoCadastrosProps {
  filtroPeriodo: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const cadastros = payload.find((p: any) => p.dataKey === "cadastros");
  const editais = payload.find((p: any) => p.dataKey === "editais");
  const idx = dadosMensais.findIndex((d) => d.mes === label);
  const prev = idx > 0 ? dadosMensais[idx - 1].cadastros : null;
  const variacao =
    prev !== null && cadastros
      ? ((cadastros.value - prev) / prev * 100).toFixed(1)
      : null;

  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-medium mb-1">{label}</p>
      {cadastros && (
        <p className="text-foreground">
          Novos cadastros: <span className="font-semibold tabular-nums">{cadastros.value}</span>
        </p>
      )}
      {variacao !== null && (
        <p className="text-muted-foreground">
          vs. mês anterior:{" "}
          <span className={Number(variacao) >= 0 ? "text-success" : "text-destructive"}>
            {Number(variacao) >= 0 ? "+" : ""}
            {variacao}%
          </span>
        </p>
      )}
      {editais && (
        <p className="text-muted-foreground">
          Editais abertos: <span className="font-semibold">{editais.value}</span>
        </p>
      )}
    </div>
  );
}

export function EvolucaoCadastros({ filtroPeriodo }: EvolucaoCadastrosProps) {
  const [mostrarEditais, setMostrarEditais] = useState(false);

  const picos = useMemo(
    () => dadosMensais.filter((d) => d.anotacao),
    []
  );

  const chartConfig = {
    cadastros: { label: "Novos cadastros", color: "hsl(var(--primary))" },
    editais: { label: "Editais abertos", color: "hsl(var(--accent-foreground))" },
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Evolução de Cadastros (12 meses)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              id="toggle-editais"
              checked={mostrarEditais}
              onCheckedChange={setMostrarEditais}
            />
            <Label htmlFor="toggle-editais" className="text-xs text-muted-foreground cursor-pointer">
              Editais abertos
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <LineChart data={dadosMensais} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              className="text-xs fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs fill-muted-foreground"
              width={32}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="cadastros"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 5 }}
            />
            {mostrarEditais && (
              <Line
                type="monotone"
                dataKey="editais"
                stroke="hsl(var(--accent-foreground))"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={{ r: 2, fill: "hsl(var(--accent-foreground))" }}
                yAxisId={0}
              />
            )}
            {picos.map((pico) => (
              <ReferenceDot
                key={pico.mes}
                x={pico.mes}
                y={pico.cadastros}
                r={6}
                fill="hsl(var(--warning))"
                stroke="hsl(var(--background))"
                strokeWidth={2}
                label={{
                  value: pico.anotacao!,
                  position: "top",
                  className: "text-[10px] fill-warning font-medium",
                  offset: 12,
                }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
