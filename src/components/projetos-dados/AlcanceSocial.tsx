import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Heart, Star, MessageCircle } from "lucide-react";
import { projetosMock, comentariosMock, evolucaoCrowdfundingMensal, getKPIsProjetos, getProjetosFiltrados } from "@/data/mockProjetos";

const publicoPorLinguagem = [
  { linguagem: "Música", publico: 58000 },
  { linguagem: "Cult. Popular", publico: 31000 },
  { linguagem: "Artes Cênicas", publico: 18000 },
  { linguagem: "Dança", publico: 14000 },
  { linguagem: "Artes Visuais", publico: 12000 },
  { linguagem: "Artesanato", publico: 9000 },
];

const publicoFaixaEtariaGeral = [
  { name: "< 18 anos", value: 12, color: "hsl(var(--primary))" },
  { name: "18-35 anos", value: 38, color: "#00A84F" },
  { name: "36-50 anos", value: 31, color: "#FFBD0C" },
  { name: "51+ anos", value: 19, color: "#1A2A4A" },
];

const publicoGeneroGeral = [
  { name: "Feminino", value: 57, color: "#C41200" },
  { name: "Masculino", value: 40, color: "#3567C4" },
  { name: "Outros", value: 3, color: "#FFBD0C" },
];

function MiniDonut({ data, size = 120 }: { data: { name: string; value: number; color: string }[]; size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <PieChart width={size} height={size}>
        <Pie data={data} cx="50%" cy="50%" innerRadius={size * 0.3} outerRadius={size * 0.45} dataKey="value" strokeWidth={2} stroke="hsl(var(--background))">
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

interface AlcanceSocialProps {
  filtroLinguagem?: string;
  filtroCidades?: string[];
  filterProjetos?: string[];
}

export function AlcanceSocial({ filtroLinguagem = "todas", filtroCidades = [], filterProjetos = [] }: AlcanceSocialProps) {
  const kpis = useMemo(() => getKPIsProjetos(filtroLinguagem, filtroCidades), [filtroLinguagem, filtroCidades]);
  const projetosFiltrados = useMemo(() => getProjetosFiltrados(filtroLinguagem, filtroCidades), [filtroLinguagem, filtroCidades]);
  const [filtroComentario, setFiltroComentario] = useState("todos");

  const comentariosFiltrados = useMemo(() => {
    const projetoIds = new Set(projetosFiltrados.map(p => p.id));
    let filtered = comentariosMock.filter(c => projetoIds.has(c.projetoId));
    if (filtroComentario !== "todos") filtered = filtered.filter(c => c.origem === filtroComentario);
    return filtered;
  }, [filtroComentario, projetosFiltrados]);

  const avaliacaoArtistas = useMemo(() => {
    const projetoIds = new Set(projetosFiltrados.map(p => p.id));
    const arts = comentariosMock.filter(c => c.origem === "artista" && projetoIds.has(c.projetoId));
    return { media: arts.length > 0 ? (arts.reduce((s, c) => s + c.avaliacao, 0) / arts.length).toFixed(1) : "0", total: arts.length };
  }, [projetosFiltrados]);
  const avaliacaoCidadaos = useMemo(() => {
    const projetoIds = new Set(projetosFiltrados.map(p => p.id));
    const cids = comentariosMock.filter(c => c.origem === "cidadao" && projetoIds.has(c.projetoId));
    return { media: cids.length > 0 ? (cids.reduce((s, c) => s + c.avaliacao, 0) / cids.length).toFixed(1) : "0", total: cids.length };
  }, [projetosFiltrados]);

  const topEngajamento = useMemo(() =>
    [...projetosFiltrados].sort((a, b) => b.crowdfundingApoiadores - a.crowdfundingApoiadores).slice(0, 5),
  [projetosFiltrados]);

  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Público Total</p><p className="text-2xl font-bold">{(kpis.totalPublico / 1000).toFixed(0)}k</p><Badge variant="outline" className="text-[10px] mt-1 text-green-600">+{kpis.variações.publico}%</Badge></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Eventos Realizados</p><p className="text-2xl font-bold">{kpis.totalEventos}</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Gratuito</p><p className="text-2xl font-bold">68%</p></CardContent></Card>
        <Card><CardContent className="pt-5 pb-4"><p className="text-xs text-muted-foreground">Territórios Baixa Renda</p><p className="text-2xl font-bold">34%</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Público por Linguagem</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ publico: { label: "Público", color: "hsl(var(--primary))" } }} className="h-[220px] w-full">
              <BarChart data={publicoPorLinguagem} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="linguagem" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="publico" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Perfil Demográfico do Público</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Faixa Etária</p>
                <MiniDonut data={publicoFaixaEtariaGeral} size={100} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Gênero</p>
                <MiniDonut data={publicoGeneroGeral} size={100} />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border italic">
              Dados coletados via opt-in no App da Sociedade.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold flex items-center gap-2"><Heart className="h-4 w-4" /> Engajamento Cidadão</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-xs text-muted-foreground">Crowdfunding</p>
                <p className="text-lg font-bold">{kpis.totalApoiadores}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(kpis.totalCrowdfunding)}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-xs text-muted-foreground">Voluntários</p>
                <p className="text-lg font-bold">318</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-xs text-muted-foreground">Trocas</p>
                <p className="text-lg font-bold">94</p>
              </div>
            </div>
            <ChartContainer config={{ valor: { label: "R$", color: "hsl(var(--primary))" }, apoiadores: { label: "Apoiadores", color: "#00A84F" } }} className="h-[180px] w-full">
              <LineChart data={evolucaoCrowdfundingMensal} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Top 5 Engajamento Cidadão</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topEngajamento.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}.</span>
                    <div>
                      <p className="text-sm font-medium">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">{p.proponenteNome}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{p.crowdfundingApoiadores} apoiadores</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(p.crowdfundingValor)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Comentários da Comunidade</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Artistas: <strong>{avaliacaoArtistas.media}/5</strong> ({avaliacaoArtistas.total})</span>
                <span className="text-muted-foreground">·</span>
                <span>Cidadãos: <strong>{avaliacaoCidadaos.media}/5</strong> ({avaliacaoCidadaos.total})</span>
              </div>
              <Select value={filtroComentario} onValueChange={setFiltroComentario}>
                <SelectTrigger className="w-[130px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="artista">Artistas</SelectItem>
                  <SelectItem value="cidadao">Cidadãos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comentariosFiltrados.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum comentário encontrado para os filtros selecionados.</p>
            )}
            {comentariosFiltrados.map(c => {
              const projeto = projetosMock.find(p => p.id === c.projetoId);
              return (
                <div key={c.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {c.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{c.nome}</span>
                      <Badge variant={c.origem === "artista" ? "default" : "secondary"} className="text-[10px]">{c.origem === "artista" ? "Artista" : "Cidadão"}</Badge>
                      <span className="text-xs text-muted-foreground">sobre "{projeto?.nome}"</span>
                      <span className="text-xs text-muted-foreground ml-auto">{new Date(c.data).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">"{c.texto}"</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < c.avaliacao ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
