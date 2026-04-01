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
import { produtorasMock } from "@/data/mockProdutoras";
import { getArtistasByProdutora } from "@/data/mockArtistas";
import { usuariosMock } from "@/data/mockUsuarios";
import { MembroDetalheModal, type ArtistaComUsuario } from "@/components/censo/MembroDetalheModal";
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
  const [selectedArtista, setSelectedArtista] = useState<ArtistaComUsuario | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [buscaMembro, setBuscaMembro] = useState("");

  const produtora = produtorasMock.find((p) => p.id === id);
  const artistas = useMemo(() => (produtora ? getArtistasByProdutora(produtora.id) : []), [produtora]);
  const usuarioMap = useMemo(() => new Map(usuariosMock.map((u) => [u.id, u])), []);

  const artistasFiltrados = useMemo(() => {
    if (!buscaMembro) return artistas;
    const q = buscaMembro.toLowerCase();
    return artistas.filter((a) => {
      const u = usuarioMap.get(a.usuario_id);
      return u?.nome_completo.toLowerCase().includes(q) || a.papel.toLowerCase().includes(q);
    });
  }, [buscaMembro, artistas, usuarioMap]);

  if (!produtora) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">Produtora não encontrada.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/dados")}>
            Voltar à Central de Dados
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const tempo = Math.max(0, new Date().getFullYear() - new Date(produtora.data_fundacao).getFullYear());
  const tempoLabel = tempo >= 2 ? `${tempo} anos` : `${tempo} ano`;
  const dataFundFormatted = new Date(produtora.data_fundacao).toLocaleDateString("pt-BR");
  const ivc = ivcConfig[produtora.ivc];

  const handleArtistaClick = (artistaId: string) => {
    const artista = artistas.find((a) => a.id === artistaId);
    if (!artista) return;
    const usuario = usuarioMap.get(artista.usuario_id);
    if (!usuario) return;
    setSelectedArtista({ artista, usuario });
    setModalOpen(true);
  };

  const handleProdutoraFromModal = (produtoraId: string) => {
    setModalOpen(false);
    navigate(`/dados/produtora/${produtoraId}`);
  };

  // Compute socioeconomic aggregates from artistas
  const servicosAgregados = useMemo(() => {
    const total = artistas.length || 1;
    return {
      agua: Math.round(artistas.filter((a) => a.servicos_basicos.agua).length / total * 100),
      energia: Math.round(artistas.filter((a) => a.servicos_basicos.energia).length / total * 100),
      coleta_lixo: Math.round(artistas.filter((a) => a.servicos_basicos.coleta_lixo).length / total * 100),
      esgoto: Math.round(artistas.filter((a) => a.servicos_basicos.esgoto).length / total * 100),
      internet: Math.round(artistas.filter((a) => a.servicos_basicos.internet).length / total * 100),
    };
  }, [artistas]);

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

          <div className="relative">
            <div className="h-40 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <div className="absolute bottom-0 left-6 translate-y-1/2 h-20 w-20 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-2xl font-bold text-primary">
              {produtora.nome.charAt(0)}
            </div>
          </div>

          <div className="mt-12 ml-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{produtora.nome}</h1>
              <Badge variant="secondary">{produtora.linguagem_principal}</Badge>
              <Badge variant={produtora.status === "ativo" ? "default" : "secondary"}>
                {produtora.status === "ativo" ? "✅ Ativo" : "⚠️ Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {produtora.municipio}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Progress value={produtora.score_reputacao} className="h-2 w-32" />
              <span className="text-sm font-medium tabular-nums">{produtora.score_reputacao}/100</span>
            </div>
          </div>
        </div>

        {/* Identificação */}
        <Card>
          <CardHeader><CardTitle className="text-base">Identificação e Dados Gerais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{produtora.descricao}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Fundação:</span> {dataFundFormatted} ({tempoLabel})</div>
              <div><span className="text-muted-foreground">CNPJ:</span> {produtora.cnpj || "Sem CNPJ — informal"}</div>
              <div><span className="text-muted-foreground">Formalização:</span> {produtora.tipo_formalizacao || "Não informado"}</div>
              <div><span className="text-muted-foreground">Endereço:</span> {produtora.endereco}</div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {produtora.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {produtora.telefone}</div>
              {produtora.redes_sociais?.instagram && (
                <div className="flex items-center gap-2"><Instagram className="h-3.5 w-3.5 text-muted-foreground" /> {produtora.redes_sociais.instagram}</div>
              )}
              {produtora.redes_sociais?.facebook && (
                <div className="flex items-center gap-2"><Facebook className="h-3.5 w-3.5 text-muted-foreground" /> {produtora.redes_sociais.facebook}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Situação Socioeconômica (agregada dos artistas) */}
        <Card>
          <CardHeader><CardTitle className="text-base">Situação Socioeconômica</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className={`${ivc.color} text-sm px-3 py-1`}>{ivc.label}</Badge>
              <div className="text-sm"><span className="text-muted-foreground">Artistas:</span> <span className="font-medium">{artistas.length}</span></div>
            </div>

            {/* Serviços básicos */}
            <div className="flex flex-wrap gap-2">
              <ServiceIcon ok={servicosAgregados.agua >= 80} label={`Água (${servicosAgregados.agua}%)`} />
              <ServiceIcon ok={servicosAgregados.energia >= 80} label={`Energia (${servicosAgregados.energia}%)`} />
              <ServiceIcon ok={servicosAgregados.coleta_lixo >= 80} label={`Lixo (${servicosAgregados.coleta_lixo}%)`} />
              <ServiceIcon ok={servicosAgregados.esgoto >= 60} label={`Esgoto (${servicosAgregados.esgoto}%)`} />
              <ServiceIcon ok={servicosAgregados.internet >= 60} label={`Internet (${servicosAgregados.internet}%)`} />
            </div>

            <p className="text-xs text-muted-foreground italic">
              Dados agregados dos artistas desta produtora.
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

        {/* Artistas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Artistas ({artistas.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar artista..." value={buscaMembro} onChange={(e) => setBuscaMembro(e.target.value)} className="pl-9 h-8 text-sm" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {artistasFiltrados.length > 0 ? (
              <div className="space-y-2">
                {artistasFiltrados.map((a) => {
                  const u = usuarioMap.get(a.usuario_id);
                  if (!u) return null;
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleArtistaClick(a.id)}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                        {u.nome_completo.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{u.nome_completo}</span>
                          {a.representante_legal && (
                            <Badge variant="outline" className="text-[10px] gap-0.5 border-warning text-warning px-1.5 py-0">
                              <Star className="h-2.5 w-2.5" /> Representante
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{a.papel}</span>
                      </div>
                      <Badge variant={a.status === "ativo" ? "default" : "secondary"} className="text-xs">
                        {a.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {artistas.length === 0 ? "Nenhum artista cadastrado." : "Nenhum artista encontrado."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Projetos Realizados */}
        <Card>
          <CardHeader><CardTitle className="text-base">Projetos Realizados</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{produtora.projetos.length}</p>
                <p className="text-xs text-muted-foreground">Projetos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">R$ {(produtora.total_captado / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Total captado</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{produtora.media_publico}</p>
                <p className="text-xs text-muted-foreground">Média de público</p>
              </div>
            </div>

            {produtora.projetos.length > 0 ? (
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
                    {produtora.projetos.map((p, i) => {
                      const st = statusProjetoConfig[p.status];
                      return (
                        <TableRow key={i} className="cursor-pointer" onClick={() => toast.info("Módulo 2 — Gestão de Projetos disponível em breve")}>
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
        {produtora.espacos_vinculados.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Espaços Culturais Vinculados</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {produtora.espacos_vinculados.map((e, i) => (
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

      <MembroDetalheModal
        dados={selectedArtista}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onProdutoraClick={handleProdutoraFromModal}
      />
    </DashboardLayout>
  );
}
