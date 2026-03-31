import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Star, FileCheck, Clock } from "lucide-react";
import type { Artista } from "@/data/mockCensoCultural";
import { coresCategoria } from "@/data/mockCensoCultural";

interface ArtistaDrawerProps {
  artista: Artista | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArtistaDrawer({ artista, open, onOpenChange }: ArtistaDrawerProps) {
  if (!artista) return null;

  const statusFiscalVariant = {
    Regular: "default" as const,
    Irregular: "destructive" as const,
    Pendente: "secondary" as const,
    Isento: "outline" as const,
  };

  const statusAuditoriaColor = {
    "Concluído": "text-green-500",
    "Em andamento": "text-amber-500",
    "Pendente": "text-muted-foreground",
    "Atrasado": "text-red-500",
  };

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
            <Badge style={{ backgroundColor: coresCategoria[artista.categoria] + "22", color: coresCategoria[artista.categoria], borderColor: coresCategoria[artista.categoria] + "44" }} className="border">
              {artista.categoria}
            </Badge>
            {artista.subcategoria && (
              <Badge variant="outline">{artista.subcategoria}</Badge>
            )}
            <Badge variant={statusFiscalVariant[artista.statusFiscal]}>
              {artista.statusFiscal}
            </Badge>
          </div>

          {/* Bio */}
          {artista.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">{artista.bio}</p>
          )}

          <Separator />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Localização</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {artista.bairro}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tempo de Atuação</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> {artista.tempoAtuacao}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Gênero</p>
              <p className="text-sm font-medium">{artista.genero}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Raça/Etnia</p>
              <p className="text-sm font-medium">{artista.raca}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Formalização</p>
              <p className="text-sm font-medium">{artista.formalizacao}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Status Auditoria</p>
              <p className={`text-sm font-medium ${statusAuditoriaColor[artista.statusAuditoria]}`}>
                {artista.statusAuditoria}
              </p>
            </div>
          </div>

          <Separator />

          {/* Score de Impacto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" /> Score de Impacto
              </p>
              <span className="text-lg font-bold">{artista.scoreImpacto}</span>
            </div>
            <Progress value={artista.scoreImpacto} className="h-2" />
          </div>

          {/* Projetos */}
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <strong>{artista.projetosAprovados}</strong> projetos aprovados
            </span>
          </div>

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

          {/* Redes Sociais */}
          {artista.redesSociais && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Redes Sociais</p>
                <div className="flex gap-3">
                  {artista.redesSociais.instagram && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Instagram className="h-4 w-4" /> {artista.redesSociais.instagram}
                    </span>
                  )}
                  {artista.redesSociais.facebook && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Facebook className="h-4 w-4" /> {artista.redesSociais.facebook}
                    </span>
                  )}
                  {artista.redesSociais.youtube && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Youtube className="h-4 w-4" /> {artista.redesSociais.youtube}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
