import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Artista } from "@/data/mockArtistas";
import type { Usuario } from "@/data/mockUsuarios";
import { produtorasMock } from "@/data/mockProdutoras";
import { artistasMock } from "@/data/mockArtistas";
import { getSubtipoNome } from "@/data/mockLinguagens";

export interface ArtistaComUsuario {
  artista: Artista;
  usuario: Usuario;
}

interface ArtistaDetalheModalProps {
  dados: ArtistaComUsuario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProdutoraClick?: (produtoraId: string) => void;
}

function MaskableField({ value, label }: { value: string; label: string }) {
  const [revealed, setRevealed] = useState(false);

  const masked = useMemo(() => {
    if (label === "CPF") return `***.${value.slice(4, 7)}.${value.slice(8, 11)}-**`;
    if (label === "E-mail") return `${value[0]}*****@${value.split("@")[1]}`;
    if (label === "Telefone") return `${value.slice(0, 5)}****-${value.slice(-4)}`;
    return value;
  }, [value, label]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{revealed ? value : masked}</span>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRevealed(!revealed)}>
        {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

function ServiceIcon({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md ${ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
      {ok ? "✅" : "❌"} {label}
    </span>
  );
}

function calcAge(nascimento: string) {
  const birth = new Date(nascimento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

export function MembroDetalheModal({ dados, open, onOpenChange, onProdutoraClick }: ArtistaDetalheModalProps) {
  if (!dados) return null;

  const { artista, usuario } = dados;
  const age = calcAge(usuario.nascimento);
  const nascFormatted = new Date(usuario.nascimento).toLocaleDateString("pt-BR");

  // Get all produtoras this usuario belongs to
  const produtorasDoArtista = artistasMock
    .filter((a) => a.usuario_id === usuario.id)
    .map((a) => {
      const prod = produtorasMock.find((p) => p.id === a.produtora_id);
      return prod ? { produtora: prod, papel: a.papel, status: a.status, data_entrada: a.data_entrada, data_saida: a.data_saida, representante: a.representante_legal } : null;
    })
    .filter(Boolean) as { produtora: typeof produtorasMock[0]; papel: string; status: string; data_entrada: string; data_saida?: string; representante: boolean }[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
              {usuario.nome_completo.charAt(0)}
            </div>
            <div>
              <DialogTitle className="text-lg">{usuario.nome_completo}</DialogTitle>
              <p className="text-sm text-muted-foreground">{artista.papel}{artista.nome_artistico ? ` — ${artista.nome_artistico}` : ""}</p>
            </div>
            {artista.representante_legal && (
              <Badge variant="outline" className="ml-auto gap-1 border-warning text-warning">
                <Star className="h-3 w-3" /> Representante Legal
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Identificação */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Identificação</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">CPF:</span> <MaskableField value={usuario.cpf} label="CPF" /></div>
              <div><span className="text-muted-foreground">Nascimento:</span> {nascFormatted} ({age} anos)</div>
              <div><span className="text-muted-foreground">Gênero:</span> {usuario.genero}</div>
              <div><span className="text-muted-foreground">Raça/Cor:</span> {usuario.raca_cor}</div>
              <div><span className="text-muted-foreground">Município:</span> {usuario.municipio}</div>
              <div><span className="text-muted-foreground">E-mail:</span> <MaskableField value={usuario.email} label="E-mail" /></div>
              <div><span className="text-muted-foreground">Telefone:</span> <MaskableField value={usuario.telefone} label="Telefone" /></div>
            </div>
          </section>

          {/* Formação */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Formação</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Escolaridade:</span> {artista.escolaridade}{artista.area_formacao ? ` — ${artista.area_formacao}` : ""}</div>
              {artista.certificacoes.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Certificações:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {artista.certificacoes.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Socioeconômico */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Dados Socioeconômicos</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Faixa de renda:</span> {artista.faixa_renda}</div>
              <div><span className="text-muted-foreground">Moradia:</span> {artista.situacao_moradia}</div>
              <div><span className="text-muted-foreground">Prog. social:</span> {artista.beneficiario_programa_social === "sim" ? "Sim" : artista.beneficiario_programa_social === "nao" ? "Não" : "Prefiro não declarar"}</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <ServiceIcon ok={artista.servicos_basicos.agua} label="Água" />
              <ServiceIcon ok={artista.servicos_basicos.energia} label="Energia" />
              <ServiceIcon ok={artista.servicos_basicos.coleta_lixo} label="Lixo" />
              <ServiceIcon ok={artista.servicos_basicos.esgoto} label="Esgoto" />
              <ServiceIcon ok={artista.servicos_basicos.internet} label="Internet" />
            </div>
            {artista.vulnerabilidades.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {artista.vulnerabilidades.map((v) => (
                  <Badge key={v} variant="outline" className="border-destructive/50 text-destructive text-xs">{v}</Badge>
                ))}
              </div>
            )}
          </section>

          {/* Cultural / Profissional */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Dados Culturais e Profissionais</h4>
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-1.5">
                {artista.subtipo_ids.map((sid) => (
                  <Badge key={sid} variant="secondary">{getSubtipoNome(sid)}</Badge>
                ))}
              </div>
              <div><span className="text-muted-foreground">Atuação:</span> {artista.tempo_atuacao} anos</div>
              <div><span className="text-muted-foreground">Formalização:</span> {artista.formalizacao}</div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Score:</span>
                <Progress value={artista.score_reputacao} className="h-2 flex-1 max-w-[200px]" />
                <span className="font-medium tabular-nums">{artista.score_reputacao}/100</span>
              </div>
              {artista.objetivos_carreira.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Objetivos:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {artista.objetivos_carreira.map((o) => <li key={o}>{o}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Produtoras relacionadas */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Produtoras</h4>
            <div className="space-y-2">
              {produtorasDoArtista.map((item) => (
                <div
                  key={item.produtora.id + item.papel}
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => onProdutoraClick?.(item.produtora.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.produtora.nome}</span>
                    <Badge variant="secondary" className="text-xs">{item.papel}</Badge>
                    {item.representante && <Star className="h-3 w-3 text-warning" />}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{new Date(item.data_entrada).getFullYear()}–{item.data_saida ? new Date(item.data_saida).getFullYear() : "atual"}</span>
                    <Badge variant={item.status === "ativo" ? "default" : "secondary"} className="text-xs">
                      {item.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LGPD */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground border">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Dados coletados com consentimento do usuário conforme LGPD. Uso restrito à gestão cultural da SECULT.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
