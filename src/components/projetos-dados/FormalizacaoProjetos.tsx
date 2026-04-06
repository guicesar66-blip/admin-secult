import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Line } from "recharts";
import { evolucaoFormalizacaoTrimestral, getProjetosFiltrados } from "@/data/mockProjetos";

interface FormalizacaoProjetosProps {
  filtroLinguagem?: string;
  filtroCidades?: string[];
  filterProjetos?: string[];
}

export function FormalizacaoProjetos({ filtroLinguagem = "todas", filtroCidades = [], filterProjetos = [] }: FormalizacaoProjetosProps) {
  const dados = useMemo(() => getProjetosFiltrados(filtroLinguagem, filtroCidades), [filtroLinguagem, filtroCidades]);
  const hasFilter = filtroLinguagem !== "todas" || filtroCidades.length > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground">Taxa de Informalidade Atual</p>
            <p className="text-2xl font-bold">44%</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px] text-green-600">-0,6 p.p.</Badge>
              <span className="text-xs text-muted-foreground">Nacional: 44,6% (IBGE SIIC 2024)</span>
            </div>
            {hasFilter && <p className="text-[10px] text-muted-foreground mt-1 italic">Filtro ativo — {dados.length} projetos</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground">Formalizados Após 1 Projeto</p>
            <p className="text-2xl font-bold">23%</p>
            <p className="text-xs text-muted-foreground mt-1">dos que eram informais</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Evolução Trimestral da Formalização</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={{
            Informal: { label: "Informal", color: "#C41200" },
            MEI: { label: "MEI", color: "#FFBD0C" },
            "Associação": { label: "Associação", color: "#00A84F" },
            "ME/EPP": { label: "ME/EPP", color: "#3567C4" },
            projetos: { label: "Projetos", color: "#1A2A4A" },
          }} className="h-[280px] w-full">
            <AreaChart data={evolucaoFormalizacaoTrimestral} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis dataKey="trimestre" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} unit="%" />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area yAxisId="left" type="monotone" dataKey="Informal" stackId="1" stroke="#C41200" fill="#C41200" fillOpacity={0.6} />
              <Area yAxisId="left" type="monotone" dataKey="MEI" stackId="1" stroke="#FFBD0C" fill="#FFBD0C" fillOpacity={0.6} />
              <Area yAxisId="left" type="monotone" dataKey="Associação" stackId="1" stroke="#00A84F" fill="#00A84F" fillOpacity={0.6} />
              <Area yAxisId="left" type="monotone" dataKey="ME/EPP" stackId="1" stroke="#3567C4" fill="#3567C4" fillOpacity={0.6} />
              <Line yAxisId="right" type="monotone" dataKey="projetos" stroke="#1A2A4A" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
