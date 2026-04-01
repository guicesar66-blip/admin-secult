import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, MapPin, Users, DollarSign, BarChart3, Star, ChevronDown,
  Check, X, Pencil, Building2, Clock, Mail, Shield, Search, TrendingUp,
} from "lucide-react";
import {
  equipamentosMock,
  iconesTipoEquipamento,
} from "@/data/mockEquipamentosCulturais";
import { getEspacoDetalhe, type EspacoDetalhe } from "@/data/mockEspacoDetalhes";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const corConservacao: Record<string, string> = {
  Excelente: "hsl(var(--success))",
  Bom: "hsl(38, 69%, 50%)",
  Regular: "hsl(24, 77%, 57%)",
  Precário: "hsl(var(--destructive))",
};

const DONUT_COLORS = [
  "hsl(var(--primary))", "hsl(var(--secondary))", "hsl(145, 46%, 45%)",
  "hsl(38, 69%, 50%)", "hsl(215, 15%, 50%)", "hsl(280, 50%, 50%)",
];

export default function EspacoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const equipamento = useMemo(() => equipamentosMock.find(e => e.id === id), [id]);

  const [detalhe, setDetalhe] = useState<EspacoDetalhe>(() => getEspacoDetalhe(id || ""));
  const [editando, setEditando] = useState(false);
  const [editDraft, setEditDraft] = useState<EspacoDetalhe>(detalhe);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [buscaArtista, setBuscaArtista] = useState("");
  const [mostrarTodosArtistas, setMostrarTodosArtistas] = useState(false);
  const [acessOpen, setAcessOpen] = useState(false);

  const artistasFiltrados = useMemo(() => {
    let lista = detalhe.artistasVinculados;
    if (buscaArtista) {
      const q = buscaArtista.toLowerCase();
      lista = lista.filter(a => a.nome.toLowerCase().includes(q) || a.linguagem.toLowerCase().includes(q));
    }
    return mostrarTodosArtistas ? lista : lista.slice(0, 10);
  }, [detalhe.artistasVinculados, buscaArtista, mostrarTodosArtistas]);

  if (!equipamento) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground">Espaço cultural não encontrado.</p>
          <Button variant="outline" onClick={() => navigate("/dados")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const iniciarEdicao = () => { setEditDraft({ ...detalhe }); setEditando(true); };
  const cancelarEdicao = () => { setEditDraft(detalhe); setEditando(false); };
  const salvarEdicao = () => {
    setDetalhe(editDraft);
    setEditando(false);
    toast({ title: "Dados atualizados com sucesso", description: "As alterações foram salvas." });
  };

  const toggleAcessItem = (idx: number) => {
    setEditDraft(prev => ({
      ...prev,
      acessibilidadeItens: prev.acessibilidadeItens.map((item, i) =>
        i === idx ? { ...item, disponivel: !item.disponivel } : item
      ),
    }));
  };

  const d = editando ? editDraft : detalhe;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {iconesTipoEquipamento[equipamento.tipo]} {equipamento.nome}
                </h1>
                <Badge variant="outline">{equipamento.tipo}</Badge>
                <Badge variant={equipamento.status === "Ativo" ? "default" : "destructive"}>
                  {equipamento.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {equipamento.municipio}{equipamento.bairro ? ` · ${equipamento.bairro}` : ""}
              </p>
            </div>
          </div>
          {!editando ? (
            <Button onClick={iniciarEdicao} className="gap-2">
              <Pencil className="h-4 w-4" /> Editar espaço
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelarEdicao} className="gap-2">
                <X className="h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={salvarEdicao} className="gap-2">
                <Check className="h-4 w-4" /> Salvar alterações
              </Button>
            </div>
          )}
        </div>

        {/* 1. Informações Gerais */}
        <Card>
          <CardHeader><CardTitle className="text-base">Informações Gerais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {editando ? (
              <Textarea value={editDraft.descricao} onChange={e => setEditDraft(p => ({ ...p, descricao: e.target.value }))} rows={4} />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{d.descricao}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoField icon={<Users className="h-4 w-4" />} label="Capacidade"
                value={`${equipamento.capacidade ?? "—"} pessoas`} />
              <InfoField icon={<Clock className="h-4 w-4" />} label="Horários"
                value={editando ? (
                  <Input value={editDraft.horarios} onChange={e => setEditDraft(p => ({ ...p, horarios: e.target.value }))} className="h-8" />
                ) : d.horarios} />
              <InfoField icon={<Building2 className="h-4 w-4" />} label="Gestão"
                value={<Badge variant="outline">{equipamento.gestao}</Badge>} />
              <InfoField icon={<Shield className="h-4 w-4" />} label="CNPJ"
                value={<span className="text-xs text-muted-foreground">{d.cnpj} {editando && <span className="text-[10px] opacity-60">(não editável)</span>}</span>} />
              <InfoField icon={<Mail className="h-4 w-4" />} label="Contato"
                value={editando ? (
                  <div className="space-y-1">
                    <Input value={editDraft.contatoNome} onChange={e => setEditDraft(p => ({ ...p, contatoNome: e.target.value }))} className="h-8" placeholder="Nome" />
                    <Input value={editDraft.contatoEmail} onChange={e => setEditDraft(p => ({ ...p, contatoEmail: e.target.value }))} className="h-8" placeholder="Email" />
                    <Input value={editDraft.contatoTelefone} onChange={e => setEditDraft(p => ({ ...p, contatoTelefone: e.target.value }))} className="h-8" placeholder="Telefone" />
                  </div>
                ) : (
                  <div className="text-sm"><p>{d.contatoNome}</p><p className="text-muted-foreground">{d.contatoEmail}</p><p className="text-muted-foreground">{d.contatoTelefone}</p></div>
                )} />
              <InfoField icon={<BarChart3 className="h-4 w-4" />} label="Conservação"
                value={editando ? (
                  <Select value={editDraft.conservacao} onValueChange={v => setEditDraft(p => ({ ...p, conservacao: v as EspacoDetalhe["conservacao"] }))}>
                    <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Excelente", "Bom", "Regular", "Precário"].map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" style={{ borderColor: corConservacao[d.conservacao], color: corConservacao[d.conservacao] }}>{d.conservacao}</Badge>
                )} />
            </div>
          </CardContent>
        </Card>

        {/* 2. Acessibilidade PCD */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Acessibilidade para PCDs
              {editando ? (
                <Select value={editDraft.acessibilidadeGeral} onValueChange={v => setEditDraft(p => ({ ...p, acessibilidadeGeral: v as EspacoDetalhe["acessibilidadeGeral"] }))}>
                  <SelectTrigger className="h-7 text-xs w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Totalmente acessível", "Parcialmente acessível", "Não acessível"].map(a => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className="font-normal">{d.acessibilidadeGeral}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Collapsible open={acessOpen} onOpenChange={setAcessOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 mb-3">
                  <ChevronDown className={`h-4 w-4 transition-transform ${acessOpen ? "rotate-180" : ""}`} />
                  {acessOpen ? "Ocultar checklist" : "Ver checklist completo"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {d.acessibilidadeItens.map((item, idx) => (
                    <div key={item.recurso} className="flex items-center gap-2 text-sm py-1">
                      {editando ? (
                        <Switch checked={editDraft.acessibilidadeItens[idx]?.disponivel} onCheckedChange={() => toggleAcessItem(idx)} />
                      ) : item.disponivel ? (
                        <Check className="h-4 w-4 shrink-0" style={{ color: "hsl(var(--success))" }} />
                      ) : (
                        <X className="h-4 w-4 shrink-0" style={{ color: "hsl(var(--destructive))" }} />
                      )}
                      <span className={item.disponivel ? "text-foreground" : "text-muted-foreground"}>{item.recurso}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                {editando ? (
                  <Textarea value={editDraft.acessibilidadeObs} onChange={e => setEditDraft(p => ({ ...p, acessibilidadeObs: e.target.value }))} rows={2} placeholder="Observações sobre acessibilidade" />
                ) : (
                  <p className="text-xs text-muted-foreground italic">{d.acessibilidadeObs}</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* 3. Galeria de Fotos */}
        <Card>
          <CardHeader><CardTitle className="text-base">Galeria de Fotos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {d.fotos.map((foto, i) => (
                <button key={i} onClick={() => setLightboxImg(foto.url)}
                  className="group relative rounded-lg overflow-hidden border border-border aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-ring">
                  <img src={foto.url} alt={foto.legenda} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-foreground/60 px-2 py-1">
                    <p className="text-[10px] text-background truncate">{foto.legenda}</p>
                    <p className="text-[9px] text-background/70">{foto.data}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!lightboxImg} onOpenChange={() => setLightboxImg(null)}>
          <DialogContent className="max-w-4xl p-2">
            {lightboxImg && <img src={lightboxImg} alt="Foto ampliada" className="w-full h-auto rounded-lg" />}
          </DialogContent>
        </Dialog>

        {/* 4. Métricas de Uso */}
        <Card>
          <CardHeader><CardTitle className="text-base">Métricas de Uso</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Projetos realizados" value={d.metricas.totalProjetos} icon={<BarChart3 className="h-4 w-4" />} />
              <MetricCard label="Pessoas impactadas" value={d.metricas.pessoasImpactadas.toLocaleString("pt-BR")} icon={<Users className="h-4 w-4" />} />
              <MetricCard label="Média público/evento" value={d.metricas.mediaPublicoEvento} icon={<TrendingUp className="h-4 w-4" />} />
              <MetricCard label="Renda gerada" value={`R$ ${(d.metricas.rendaGerada / 1000000).toFixed(1)} mi`} icon={<DollarSign className="h-4 w-4" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <p className="text-sm font-medium mb-2">Eventos realizados (últimos 12 meses)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={d.metricas.evolucaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="eventos" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium mb-1">Faixa etária do público</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={d.metricas.demografiaPublico.faixaEtaria} dataKey="valor" nameKey="label" cx="50%" cy="50%" innerRadius={30} outerRadius={55}>
                        {d.metricas.demografiaPublico.faixaEtaria.map((_, i) => (<Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Gênero</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={d.metricas.demografiaPublico.genero} dataKey="valor" nameKey="label" cx="50%" cy="50%" innerRadius={30} outerRadius={55}>
                        {d.metricas.demografiaPublico.genero.map((_, i) => (<Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. Instrumentos de Fomento */}
        <Card>
          <CardHeader><CardTitle className="text-base">Instrumentos de Fomento Utilizados</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(120, d.fomento.length * 40)}>
              <BarChart data={d.fomento} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="nome" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={90} />
                <Tooltip />
                <Bar dataKey="projetos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 6. Comentários */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComentariosPanel titulo="Artistas e Produtores" subtitulo="App do Artista" media={d.comentariosArtistas.media} total={d.comentariosArtistas.total} lista={d.comentariosArtistas.lista} />
          <ComentariosPanel titulo="Cidadãos" subtitulo="App da Sociedade" media={d.comentariosCidadaos.media} total={d.comentariosCidadaos.total} lista={d.comentariosCidadaos.lista} />
        </div>

        {/* 7. Responsáveis e Artistas */}
        <Card>
          <CardHeader><CardTitle className="text-base">Responsáveis pelo Espaço</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {d.responsaveis.map((r, i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-sm">{r.nome}</p>
                  <Badge variant="outline" className="text-[10px]">{r.tipoVinculo}</Badge>
                  <p className="text-xs text-muted-foreground">{r.periodoVinculo}</p>
                  {r.contato && <p className="text-xs text-muted-foreground">{r.contato}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base">Artistas que já se apresentaram</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar artista ou coletivo..." value={buscaArtista} onChange={e => setBuscaArtista(e.target.value)} className="pl-8 h-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Linguagem artística</TableHead>
                    <TableHead>Última apresentação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artistasFiltrados.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum artista encontrado.</TableCell></TableRow>
                  ) : artistasFiltrados.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-sm">{a.nome}</TableCell>
                      <TableCell className="text-sm">{a.linguagem}</TableCell>
                      <TableCell className="text-sm tabular-nums">{a.ultimaApresentacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {!mostrarTodosArtistas && detalhe.artistasVinculados.length > 10 && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setMostrarTodosArtistas(true)}>
                Carregar mais ({detalhe.artistasVinculados.length - 10} restantes)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>
      <div><p className="text-xs font-medium text-muted-foreground">{label}</p><div className="text-sm">{value}</div></div>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs">{label}</span></div>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function ComentariosPanel({ titulo, subtitulo, media, total, lista }: {
  titulo: string; subtitulo: string; media: number; total: number;
  lista: { id: string; nome: string; data: string; texto: string; estrelas: number }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{titulo}</span>
          <span className="text-xs font-normal text-muted-foreground">{subtitulo}</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(media) ? "fill-warning text-warning" : "text-muted-foreground"}`} />
            ))}
          </div>
          <span className="text-sm font-semibold">{media.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({total} avaliações)</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lista.map(c => (
          <div key={c.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">{c.nome[0]}</div>
              <span className="text-sm font-medium">{c.nome}</span>
              <span className="text-xs text-muted-foreground ml-auto">{c.data}</span>
            </div>
            <p className="text-sm text-muted-foreground pl-9">"{c.texto}"</p>
            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
