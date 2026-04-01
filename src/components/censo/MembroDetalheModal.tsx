import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MembroColetivo } from "@/data/mockColetivos";

interface MembroDetalheModalProps {
  membro: MembroColetivo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onColetivoClick?: (nomeColetivo: string) => void;
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

export function MembroDetalheModal({ membro, open, onOpenChange, onColetivoClick }: MembroDetalheModalProps) {
  if (!membro) return null;

  const age = calcAge(membro.nascimento);
  const nascFormatted = new Date(membro.nascimento).toLocaleDateString("pt-BR");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
              {membro.nome.charAt(0)}
            </div>
            <div>
              <DialogTitle className="text-lg">{membro.nome}</DialogTitle>
              <p className="text-sm text-muted-foreground">{membro.funcao}</p>
            </div>
            {membro.representanteLegal && (
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
              <div><span className="text-muted-foreground">CPF:</span> <MaskableField value={membro.cpf} label="CPF" /></div>
              <div><span className="text-muted-foreground">Nascimento:</span> {nascFormatted} ({age} anos)</div>
              <div><span className="text-muted-foreground">Gênero:</span> {membro.genero}</div>
              <div><span className="text-muted-foreground">Raça/Cor:</span> {membro.racaCor}</div>
              <div><span className="text-muted-foreground">Município:</span> {membro.municipio}</div>
              <div><span className="text-muted-foreground">E-mail:</span> <MaskableField value={membro.email} label="E-mail" /></div>
              <div><span className="text-muted-foreground">Telefone:</span> <MaskableField value={membro.telefone} label="Telefone" /></div>
            </div>
          </section>

          {/* Formação */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Formação</h4>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Escolaridade:</span> {membro.escolaridade}{membro.areaFormacao ? ` — ${membro.areaFormacao}` : ""}</div>
              {membro.certificacoes.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Certificações:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {membro.certificacoes.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Socioeconômico */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Dados Socioeconômicos</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Faixa de renda:</span> {membro.faixaRenda}</div>
              <div><span className="text-muted-foreground">Moradia:</span> {membro.situacaoMoradia}</div>
              <div><span className="text-muted-foreground">Prog. social:</span> {membro.beneficiarioProgramaSocial === "sim" ? "Sim" : membro.beneficiarioProgramaSocial === "nao" ? "Não" : "Prefiro não declarar"}</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <ServiceIcon ok={membro.servicosBasicos.agua} label="Água" />
              <ServiceIcon ok={membro.servicosBasicos.energia} label="Energia" />
              <ServiceIcon ok={membro.servicosBasicos.coletaLixo} label="Lixo" />
              <ServiceIcon ok={membro.servicosBasicos.esgoto} label="Esgoto" />
              <ServiceIcon ok={membro.servicosBasicos.internet} label="Internet" />
            </div>
            {membro.vulnerabilidades.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {membro.vulnerabilidades.map((v) => (
                  <Badge key={v} variant="outline" className="border-destructive/50 text-destructive text-xs">{v}</Badge>
                ))}
              </div>
            )}
          </section>

          {/* Cultural */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Dados Culturais</h4>
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-1.5">
                {membro.linguagens.map((l) => <Badge key={l} variant="secondary">{l}</Badge>)}
              </div>
              <div><span className="text-muted-foreground">Atuação:</span> {membro.tempoAtuacao} anos</div>
              <div><span className="text-muted-foreground">Formalização:</span> {membro.formalizacao}</div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Score:</span>
                <Progress value={membro.scoreReputacao} className="h-2 flex-1 max-w-[200px]" />
                <span className="font-medium tabular-nums">{membro.scoreReputacao}/100</span>
              </div>
            </div>
          </section>

          {/* Coletivos relacionados */}
          <section>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Coletivos Relacionados</h4>
            <div className="space-y-2">
              {membro.coletivosRelacionados.map((c) => (
                <div
                  key={c.nome + c.periodo}
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => onColetivoClick?.(c.nome)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.nome}</span>
                    {c.representante && <Star className="h-3 w-3 text-warning" />}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{c.periodo}</span>
                    <Badge variant={c.status === "ativo" ? "default" : "secondary"} className="text-xs">
                      {c.status === "ativo" ? "Ativo" : "Encerrado"}
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
