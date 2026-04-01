import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Mail, Phone, Instagram, Facebook, MapPin, Star, Search, ExternalLink } from "lucide-react";
import { coletivosMock } from "@/data/mockColetivos";
import { MembroDetalheModal } from "@/components/censo/MembroDetalheModal";
import type { MembroColetivo } from "@/data/mockColetivos";
import { toast } from "sonner";

function ServiceIcon({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
      {ok ? "✅" : "❌"} {label}
    </span>
  );
}

const ivcConfig = {
  alta: { label: "Alta vulnerabilidade", color: "bg-destructive text-destructive-foreground" },
  media: { label: "Média vulnerabilidade", color: "bg-warning text-warning-foreground" },
  baixa: { label: "Baixa vulnerabilidade", color: "bg-success text-success-foreground" },
};

const statusProjetoConfig = {
  concluido: { label: "Concluído", variant: "default" as const },
  em_execucao: { label: "Em execução", variant: "secondary" as const },
  cancelado: { label: "Cancelado", variant: "destructive" as const },
};

export default function ColetivosDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [membroSelecionado, setMembroSelecionado] = useState<MembroColetivo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [buscaMembro, setBuscaMembro] = useState("");

  const coletivo = coletivosMock.find((c) => c.id === id);

  const membrosFiltrados = useMemo(() => {
    if (!coletivo) return [];
    if (!buscaMembro) return coletivo.membrosLista;
    const q = buscaMembro.toLowerCase();
    return coletivo.membrosLista.filter((m) => m.nome.toLowerCase().includes(q));
  }, [buscaMembro, coletivo]);

  if (!coletivo) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Coletivo não encontrado.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dados")}>
            Voltar à Central de Dados
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const tempoLabel = coletivo.tempoExistencia >= 2 ? `${coletivo.tempoExistencia} anos` : `${coletivo.tempoExistencia} ano`;
  const dataFundFormatted = new Date(coletivo.dataFundacao).toLocaleDateString("pt-BR");
  const ivc = ivcConfig[coletivo.ivc];

  const handleMembroClick = (membro: MembroColetivo) => {
    setMembroSelecionado(membro);
    setModalOpen(true);
  };

  const handleColetivoFromModal = (nome: string) => {
    const c = coletivosMock.find((col) => col.nome === nome);
    if (c) {
      setModalOpen(false);
      navigate(`/dados/coletivo/${c.id}`);
    }
  };

  // Mock gallery images
  const galeriaImages = [
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" size="sm" className="gap-1 mb-4" onClick={() => navigate("/dados")}>
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>

          {/* Banner + Avatar */}
          <div className="relative">
            <div className="h-40 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <div className="absolute bottom-0 left-6 translate-y-1/2 h-20 w-20 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-2xl font-bold text-primary">
              {coletivo.nome.charAt(0)}
            </div>
          </div>

          <div className="mt-12 ml-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{coletivo.nome}</h1>
              <Badge variant="secondary">{coletivo.linguagem}</Badge>
              <Badge variant={coletivo.status === "ativo" ? "default" : "secondary"}>
                {coletivo.status === "ativo" ? "✅ Ativo" : "⚠️ Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {coletivo.municipio}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Progress value={coletivo.scoreReputacao} className="h-2 w-32" />
              <span className="text-sm font-medium tabular-nums">{coletivo.scoreReputacao}/100</span>
            </div>
          </div>
        </div>

        {/* Identificação */}
        <Card>
          <CardHeader><CardTitle className="text-base">Identificação e Dados Gerais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{coletivo.descricao}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Fundação:</span> {dataFundFormatted} ({tempoLabel})</div>
              <div><span className="text-muted-foreground">CNPJ:</span> {coletivo.cnpj || "Sem CNPJ — coletivo informal"}</div>
              <div><span className="text-muted-foreground">Formalização:</span> {coletivo.formalizacao}</div>
              <div><span className="text-muted-foreground">Endereço:</span> {coletivo.endereco}</div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {coletivo.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {coletivo.telefone}</div>
              {coletivo.redesSociais?.instagram && (
                <div className="flex items-center gap-2"><Instagram className="h-3.5 w-3.5 text-muted-foreground" /> {coletivo.redesSociais.instagram}</div>
              )}
              {coletivo.redesSociais?.facebook && (
                <div className="flex items-center gap-2"><Facebook className="h-3.5 w-3.5 text-muted-foreground" /> {coletivo.redesSociais.facebook}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Situação Socioeconômica */}
        <Card>
          <CardHeader><CardTitle className="text-base">Situação Socioeconômica</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className={`${ivc.color} text-sm px-3 py-1`}>{ivc.label}</Badge>
              <div className="text-sm"><span className="text-muted-foreground">Renda média:</span> <span className="font-medium">R$ {coletivo.rendaMediaMembros.toLocaleString("pt-BR")}/mês</span></div>
              <div className="text-sm"><span className="text-muted-foreground">Abaixo de 1 SM:</span> <span className="font-medium text-destructive">{coletivo.percentAbaixoSM}%</span></div>
            </div>
            <div className="text-sm"><span className="text-muted-foreground">Escolaridade predominante:</span> {coletivo.escolaridadePredominante}</div>

            {/* Escolaridade mini bars */}
            <div className="space-y-2">
              {coletivo.escolaridadeDistribuicao.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="tabular-nums">{d.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${d.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Serviços básicos */}
            <div className="flex flex-wrap gap-2">
              <ServiceIcon ok={coletivo.servicosBasicos.agua >= 80} label={`Água (${coletivo.servicosBasicos.agua}%)`} />
              <ServiceIcon ok={coletivo.servicosBasicos.energia >= 80} label={`Energia (${coletivo.servicosBasicos.energia}%)`} />
              <ServiceIcon ok={coletivo.servicosBasicos.coletaLixo >= 80} label={`Lixo (${coletivo.servicosBasicos.coletaLixo}%)`} />
              <ServiceIcon ok={coletivo.servicosBasicos.esgoto >= 60} label={`Esgoto (${coletivo.servicosBasicos.esgoto}%)`} />
              <ServiceIcon ok={coletivo.servicosBasicos.internet >= 60} label={`Internet (${coletivo.servicosBasicos.internet}%)`} />
            </div>

            {/* Vulnerabilidades */}
            {coletivo.vulnerabilidades.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {coletivo.vulnerabilidades.map((v) => (
                  <Badge key={v.label} variant="outline" className="border-destructive/50 text-destructive text-xs">
                    {v.percent}% — {v.label}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground italic">
              Dados autodeclarados pelos membros no App do Artista.
            </p>
          </CardContent>
        </Card>

        {/* Galeria */}
        <Card>
          <CardHeader><CardTitle className="text-base">Galeria de Fotos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {galeriaImages.map((src, i) => (
                <div key={i} className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Membros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Membros do Coletivo ({coletivo.membrosLista.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar membro..." value={buscaMembro} onChange={(e) => setBuscaMembro(e.target.value)} className="pl-9 h-8 text-sm" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {membrosFiltrados.length > 0 ? (
              <div className="space-y-2">
                {membrosFiltrados.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleMembroClick(m)}
                  >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {m.nome.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{m.nome}</span>
                        {m.representanteLegal && (
                          <Badge variant="outline" className="text-[10px] gap-0.5 border-warning text-warning px-1.5 py-0">
                            <Star className="h-2.5 w-2.5" /> Representante
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{m.funcao}</span>
                    </div>
                    <Badge variant={m.status === "ativo" ? "default" : "secondary"} className="text-xs">
                      {m.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {coletivo.membrosLista.length === 0 ? "Nenhum membro cadastrado com detalhes." : "Nenhum membro encontrado."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Projetos Realizados */}
        <Card>
          <CardHeader><CardTitle className="text-base">Projetos Realizados</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Resumo */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{coletivo.projetos.length}</p>
                <p className="text-xs text-muted-foreground">Projetos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">R$ {(coletivo.totalCaptado / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Total captado</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{coletivo.mediaPublico}</p>
                <p className="text-xs text-muted-foreground">Média de público</p>
              </div>
            </div>

            {coletivo.projetos.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Projeto</TableHead>
                      <TableHead>Instrumento</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coletivo.projetos.map((p, i) => {
                      const st = statusProjetoConfig[p.status];
                      return (
                        <TableRow
                          key={i}
                          className="cursor-pointer"
                          onClick={() => toast.info("Módulo 2 — Gestão de Projetos disponível em breve")}
                        >
                          <TableCell className="font-medium">{p.nome}</TableCell>
                          <TableCell>{p.instrumento}</TableCell>
                          <TableCell className="tabular-nums">{p.ano}</TableCell>
                          <TableCell className="tabular-nums">R$ {p.valor.toLocaleString("pt-BR")}</TableCell>
                          <TableCell><Badge variant={st.variant} className="text-xs">{st.label}</Badge></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum projeto cadastrado.</p>
            )}
          </CardContent>
        </Card>

        {/* Espaços Vinculados */}
        {coletivo.espacosVinculados.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Espaços Culturais Vinculados</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {coletivo.espacosVinculados.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => toast.info("Módulo de espaços disponível em breve")}>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{e.nome}</span>
                      <Badge variant="secondary" className="text-xs">{e.tipo}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      {e.municipio} <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de detalhe do membro (US-09E) */}
      <MembroDetalheModal
        membro={membroSelecionado}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onColetivoClick={handleColetivoFromModal}
      />
    </DashboardLayout>
  );
}
