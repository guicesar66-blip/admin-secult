import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, Mail, Star, Clock, Building2, Briefcase, GraduationCap } from "lucide-react";
import type { AgenteCenso } from "@/data/mockCensoAuxiliar";
import { coresLinguagem } from "@/data/mockCensoAuxiliar";

interface ArtistaDrawerProps {
  artista: AgenteCenso | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArtistaDrawer({ artista, open, onOpenChange }: ArtistaDrawerProps) {
  if (!artista) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">{artista.nomeArtistico || artista.nome}</SheetTitle>
          {artista.nomeArtistico && (
            <p className="text-sm text-muted-foreground">{artista.nome}</p>
          )}
        </SheetHeader>

        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge style={{ backgroundColor: (coresLinguagem[artista.linguagem] || "#6b7280") + "22", color: coresLinguagem[artista.linguagem] || "#6b7280", borderColor: (coresLinguagem[artista.linguagem] || "#6b7280") + "44" }} className="border">
              {artista.linguagem}
            </Badge>
            {artista.subtipos.map((sub) => (
              <Badge key={sub} variant="outline">{sub}</Badge>
            ))}
          </div>

          <Separator />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Localização</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {artista.bairro}, {artista.municipio}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tempo de Atuação</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> {artista.tempoAtuacao} anos
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Gênero</p>
              <p className="text-sm font-medium">{artista.genero}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Raça/Cor</p>
              <p className="text-sm font-medium">{artista.raca}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Formalização</p>
              <p className="text-sm font-medium">{artista.formalizacao}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Papel</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> {artista.papel}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Escolaridade</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> {artista.escolaridade}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Faixa de Renda</p>
              <p className="text-sm font-medium">{artista.faixaRenda}</p>
            </div>
          </div>

          <Separator />

          {/* Produtora */}
          <div className="space-y-1">
            <p className="text-sm font-medium flex items-center gap-1">
              <Building2 className="h-4 w-4 text-primary" /> Produtora
            </p>
            <p className="text-sm text-muted-foreground">{artista.produtoraNome}</p>
          </div>

          <Separator />

          {/* Score de Reputação */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" /> Score de Reputação
              </p>
              <span className="text-lg font-bold">{artista.scoreReputacao}</span>
            </div>
            <Progress value={artista.scoreReputacao} className="h-2" />
          </div>

          {/* Vulnerabilidades */}
          {artista.vulnerabilidades.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Vulnerabilidades</p>
                <div className="flex flex-wrap gap-1">
                  {artista.vulnerabilidades.map((v) => (
                    <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Contato */}
          {(artista.telefone || artista.email) && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Contato</p>
                {artista.telefone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3 w-3" /> {artista.telefone}
                  </p>
                )}
                {artista.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {artista.email}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
