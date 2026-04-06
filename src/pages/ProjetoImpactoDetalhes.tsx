import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowLeft, Users, DollarSign, Calendar, Briefcase, Clock, Star, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import {
  projetosMock, comentariosMock, fases, statusLabels, statusCores,
} from "@/data/mockProjetos";

const orcCategoriaLabels: Record<string, string> = {
  cache_artistico: "Cachê Artístico",
  infraestrutura: "Infraestrutura",
  material: "Material",
  divulgacao: "Divulgação",
  administrativo: "Administrativo",
};
const orcCores = ["hsl(var(--primary))", "#3567C4", "#FFBD0C", "#00A84F", "#1A2A4A"];

function MiniDonut({ data, size = 100 }: { data: { name: string; value: number; color: string }[]; size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <PieChart width={size} height={size}>
        <Pie data={data} cx="50%" cy="50%" innerRadius={size * 0.28} outerRadius={size * 0.45} dataKey="value" strokeWidth={2} stroke="hsl(var(--background))">
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
      <div className="flex flex-col gap-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjetoImpactoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projeto = useMemo(() => projetosMock.find(p => p.id === id), [id]);

  if (!projeto) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Projeto não encontrado.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>← Voltar</Button>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const faseLabel = fases.find(f => f.value === projeto.fase)?.label ?? projeto.fase;
  const comentarios = comentariosMock.filter(c => c.projetoId === projeto.id);

  const orcamentoDonut = Object.entries(projeto.orcamento).map(([k, v], i) => ({
    name: orcCategoriaLabels[k] || k, value: v, color: orcCores[i],
  }));

  const orcamentoPlanVsExec = Object.entries(projeto.orcamento).map(([k, v]) => ({
    categoria: orcCategoriaLabels[k] || k,
    planejado: Math.round(projeto.orcamentoPlanejado * v / 100),
    executado: Math.round(projeto.orcamentoExecutado * v / 100),
  }));

  const getConformidadeColor = (s: number) => s >= 80 ? "hsl(142, 71%, 45%)" : s >= 50 ? "hsl(45, 93%, 47%)" : "hsl(0, 84%, 60%)";
  const getCheckIcon = (s: string) => s === "ok" ? <CheckCircle className="h-4 w-4 text-success" /> : s === "pendente" ? <AlertTriangle className="h-4 w-4 text-accent" /> : <XCircle className="h-4 w-4 text-destructive" />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Button variant="ghost" size="sm" className="gap-2 mb-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">{projeto.nome}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-muted-foreground">{projeto.proponenteNome}</span>
              <Badge variant="outline" className="text-[10px]">{projeto.instrumento}</Badge>
              <span className="text-sm text-muted-foreground">{projeto.municipio}</span>
              <Badge className="text-[10px]" style={{ backgroundColor: statusCores[projeto.status], color: "#fff" }}>{statusLabels[projeto.status]}</Badge>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Conformidade</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={projeto.scoreConformidade} className="h-2 w-20" style={{ "--progress-foreground": getConformidadeColor(projeto.scoreConformidade) } as React.CSSProperties} />
                <span className="text-sm font-bold" style={{ color: getConformidadeColor(projeto.scoreConformidade) }}>{projeto.scoreConformidade}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Impacto</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={projeto.scoreImpacto} className="h-2 w-20" style={{ "--progress-foreground": "hsl(var(--primary))" } as React.CSSProperties} />
                <span className="text-sm font-bold text-primary">{projeto.scoreImpacto}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 1: Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Valor Captado</p><p className="text-xl font-bold">{formatCurrency(projeto.valorCaptado)}</p></CardContent></Card>
          <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Público</p><p className="text-xl font-bold">{projeto.publicoImpactado.toLocaleString("pt-BR")}</p></CardContent></Card>
          <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Eventos</p><p className="text-xl font-bold">{projeto.totalEventos}</p></CardContent></Card>
          <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Empregos</p><p className="text-xl font-bold">{projeto.empregosGerados}</p></CardContent></Card>
          <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Duração</p><p className="text-xl font-bold">{projeto.duracaoMeses}m</p><Badge variant="outline" className="text-[10px] mt-1">{faseLabel}</Badge></CardContent></Card>
        </div>

        {/* Seção 2: Financeiro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Composição do Orçamento</CardTitle></CardHeader>
            <CardContent><MiniDonut data={orcamentoDonut} size={140} /></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Planejado vs Executado</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={{ planejado: { label: "Planejado", color: "hsl(215, 60%, 80%)" }, executado: { label: "Executado", color: "hsl(var(--primary))" } }} className="h-[200px] w-full">
                <BarChart data={orcamentoPlanVsExec} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatCurrency(v)} />
                  <YAxis type="category" dataKey="categoria" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="planejado" fill="hsl(215, 60%, 80%)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="executado" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          {projeto.notasFiscais.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Notas Fiscais (Top 5)</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>NF</TableHead><TableHead>Descrição</TableHead><TableHead>Categoria</TableHead><TableHead>Data</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {projeto.notasFiscais.slice(0, 5).map(nf => (
                      <TableRow key={nf.numero}>
                        <TableCell className="font-medium text-sm">{nf.numero}</TableCell>
                        <TableCell className="text-sm">{nf.descricao}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{orcCategoriaLabels[nf.categoria] || nf.categoria}</Badge></TableCell>
                        <TableCell className="text-sm">{new Date(nf.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-sm font-medium tabular-nums">{formatCurrency(nf.valor)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Seção 3: Impacto */}
        {projeto.eventos.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Eventos Realizados</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Table>
                  <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Local</TableHead><TableHead>Check-ins</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {projeto.eventos.map((ev, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{new Date(ev.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-sm">{ev.local}</TableCell>
                        <TableCell className="text-sm font-medium tabular-nums">{ev.checkIns}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {projeto.publicoFaixaEtaria.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Faixa Etária</p>
                      <MiniDonut data={projeto.publicoFaixaEtaria.map((f, i) => ({ name: f.faixa, value: f.percent, color: orcCores[i] }))} size={90} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Gênero</p>
                      <MiniDonut data={projeto.publicoGenero.map((g, i) => ({ name: g.genero, value: g.percent, color: ["hsl(330, 60%, 55%)", "hsl(215, 60%, 50%)", "hsl(45, 93%, 47%)"][i] }))} size={90} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seção 4: Comentários */}
        {comentarios.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Comentários</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {comentarios.map(c => (
                  <div key={c.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{c.nome.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{c.nome}</span>
                        <Badge variant={c.origem === "artista" ? "default" : "secondary"} className="text-[10px]">{c.origem === "artista" ? "Artista" : "Cidadão"}</Badge>
                        <span className="text-xs text-muted-foreground ml-auto">{new Date(c.data).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">"{c.texto}"</p>
                      <div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < c.avaliacao ? "text-accent fill-accent" : "text-muted-foreground/30"}`} />)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seção 5: Conformidade */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Conformidade e Prestação de Contas</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {projeto.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {getCheckIcon(item.status)}
                    <span className="text-sm flex-1">{item.item}</span>
                    <Badge variant={item.status === "ok" ? "default" : item.status === "pendente" ? "secondary" : "destructive"} className="text-[10px]">
                      {item.status === "ok" ? "OK" : item.status === "pendente" ? "Pendente" : "Ausente"}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">Completude</p>
                <p className="text-4xl font-bold" style={{ color: getConformidadeColor(projeto.scoreConformidade) }}>{projeto.scoreConformidade}%</p>
                <Progress value={projeto.scoreConformidade} className="h-3 w-full mt-3" style={{ "--progress-foreground": getConformidadeColor(projeto.scoreConformidade) } as React.CSSProperties} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
