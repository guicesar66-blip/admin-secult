import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Line } from "recharts";
import { evolucaoFormalizacaoTrimestral } from "@/data/mockProjetos";

export function FormalizacaoProjetos() {
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
            Informal: { label: "Informal", color: "hsl(0, 84%, 60%)" },
            MEI: { label: "MEI", color: "hsl(45, 93%, 47%)" },
            "Associação": { label: "Associação", color: "hsl(142, 71%, 45%)" },
            "ME/EPP": { label: "ME/EPP", color: "hsl(215, 60%, 50%)" },
            projetos: { label: "Projetos", color: "hsl(270, 50%, 55%)" },
          }} className="h-[280px] w-full">
            <AreaChart data={evolucaoFormalizacaoTrimestral} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
              <XAxis dataKey="trimestre" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} unit="%" />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area yAxisId="left" type="monotone" dataKey="Informal" stackId="1" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.6} />
              <Area yAxisId="left" type="monotone" dataKey="MEI" stackId="1" stroke="hsl(45, 93%, 47%)" fill="hsl(45, 93%, 47%)" fillOpacity={0.6} />
              <Area yAxisId="left" type="monotone" dataKey="Associação" stackId="1" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%)" fillOpacity={0.6} />
              <Area yAxisId="left" type="monotone" dataKey="ME/EPP" stackId="1" stroke="hsl(215, 60%, 50%)" fill="hsl(215, 60%, 50%)" fillOpacity={0.6} />
              <Line yAxisId="right" type="monotone" dataKey="projetos" stroke="hsl(270, 50%, 55%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
