import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { getKPIsProjetos, getProjetosFiltrados, receitaPorFonteMensal } from "@/data/mockProjetos";

const rendaPorLinguagem = [
  { linguagem: "Audiovisual", renda: 4200 },
  { linguagem: "Música", renda: 3100 },
  { linguagem: "Artes Cênicas", renda: 2900 },
  { linguagem: "Artes Visuais", renda: 2600 },
  { linguagem: "Cultura Popular", renda: 2100 },
  { linguagem: "Literatura", renda: 1800 },
];
const rendaMediaAnterior = 1650;

interface ImpactoFinanceiroProps {
  filtroLinguagem?: string;
  filtroCidades?: string[];
  filterProjetos?: string[];
}

export function ImpactoFinanceiro({ filtroLinguagem = "todas", filtroCidades = [], filterProjetos = [] }: ImpactoFinanceiroProps) {
  const kpis = useMemo(() => getKPIsProjetos(filtroLinguagem, filtroCidades), [filtroLinguagem, filtroCidades]);
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);

  const rendaFiltrada = useMemo(() => {
    if (filtroLinguagem === "todas") return rendaPorLinguagem;
    return rendaPorLinguagem.filter(r => r.linguagem === filtroLinguagem);
  }, [filtroLinguagem]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground">Volume Movimentado</p>
            <p className="text-2xl font-bold">{formatCurrency(kpis.totalRecursos)}</p>
            <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+18%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground">Empregos/Contratos</p>
            <p className="text-2xl font-bold">{kpis.totalEmpregos}</p>
            <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+{kpis.variações.empregos}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground">Alavancagem</p>
            <p className="text-2xl font-bold">R$ 2,3 : 1</p>
            <Badge variant="outline" className="text-[10px] mt-1 text-green-600">+0,4</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground">Marketplace</p>
            <p className="text-2xl font-bold">{formatCurrency(kpis.totalMarketplace)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Receita por Fonte (mensal)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{
              fomento: { label: "Fomento Público", color: "hsl(var(--primary))" },
              patrocinio: { label: "Patrocínio", color: "hsl(142, 71%, 45%)" },
              marketplace: { label: "Marketplace", color: "hsl(45, 93%, 47%)" },
              crowdfunding: { label: "Crowdfunding", color: "hsl(270, 50%, 55%)" },
            }} className="h-[250px] w-full">
              <BarChart data={receitaPorFonteMensal} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="fomento" stackId="a" fill="hsl(var(--primary))" />
                <Bar dataKey="patrocinio" stackId="a" fill="#00A84F" />
                <Bar dataKey="marketplace" stackId="a" fill="#FFBD0C" />
                <Bar dataKey="crowdfunding" stackId="a" fill="#1A2A4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Renda Média por Linguagem</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ renda: { label: "Renda (R$)", color: "hsl(var(--primary))" } }} className="h-[250px] w-full">
              <BarChart data={rendaFiltrada} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `R$${(v/1000).toFixed(1)}k`} />
                <YAxis type="category" dataKey="linguagem" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={110} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="renda" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">
              Linha de referência: renda média antes da plataforma = R$ {rendaMediaAnterior.toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Taxa de Sobrevivência Pós-Projeto</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-3">Com projeto</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>1 ano</span><span className="font-bold">71%</span></div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: "71%" }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>2 anos</span><span className="font-bold">54%</span></div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: "54%" }} /></div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-3">Sem projeto</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>1 ano</span><span className="font-bold">48%</span></div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-muted-foreground/30" style={{ width: "48%" }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1"><span>2 anos</span><span className="font-bold">31%</span></div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-muted-foreground/30" style={{ width: "31%" }} /></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
