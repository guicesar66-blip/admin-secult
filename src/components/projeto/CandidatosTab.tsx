import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  X, 
  User, 
  Loader2, 
  MessageSquare, 
  Eye, 
  MapPin, 
  Briefcase, 
  Clock, 
  FileText,
  Phone 
} from "lucide-react";
import type { Candidatura } from "@/hooks/useCandidaturas";

interface CandidatosTabProps {
  candidaturas: Candidatura[];
  isLoading: boolean;
  onAprovar: (id: string) => void;
  onReprovar: (id: string, motivo: string) => void;
  isUpdating: boolean;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  aguardando: { label: "Aguardando", color: "bg-yellow-500/20 text-yellow-600" },
  enviada: { label: "Enviada", color: "bg-primary/20 text-primary" },
  inscrito: { label: "Inscrito", color: "bg-primary/20 text-primary" },
  aprovada: { label: "Aprovado", color: "bg-success/20 text-success" },
  confirmada: { label: "Confirmado", color: "bg-success/20 text-success" },
  reprovada: { label: "Reprovado", color: "bg-error/20 text-error" },
  cancelada: { label: "Cancelado", color: "bg-error/20 text-error" },
};

export function CandidatosTab({
  candidaturas,
  isLoading,
  onAprovar,
  onReprovar,
  isUpdating,
}: CandidatosTabProps) {
  const [reprovarDialogOpen, setReprovarDialogOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);
  const [motivoReprovacao, setMotivoReprovacao] = useState("");

  const handleReprovarClick = (candidatura: Candidatura) => {
    setSelectedCandidatura(candidatura);
    setMotivoReprovacao("");
    setReprovarDialogOpen(true);
  };

  const handleViewPortfolio = (candidatura: Candidatura) => {
    setSelectedCandidatura(candidatura);
    setPortfolioDialogOpen(true);
  };

  const handleConfirmReprovar = () => {
    if (selectedCandidatura) {
      onReprovar(selectedCandidatura.id, motivoReprovacao);
      setReprovarDialogOpen(false);
      setSelectedCandidatura(null);
    }
  };

  const estatisticas = {
    total: candidaturas.length,
    aguardando: candidaturas.filter(c => 
      c.status === "aguardando" || c.status === "enviada" || c.status === "inscrito"
    ).length,
    aprovados: candidaturas.filter(c => c.status === "aprovada" || c.status === "confirmada").length,
    reprovados: candidaturas.filter(c => c.status === "reprovada" || c.status === "cancelada").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.aguardando}</div>
            <div className="text-sm text-muted-foreground">Aguardando</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{estatisticas.aprovados}</div>
            <div className="text-sm text-muted-foreground">Aprovados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-error">{estatisticas.reprovados}</div>
            <div className="text-sm text-muted-foreground">Reprovados</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Candidatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidatos ({candidaturas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidaturas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum candidato ainda. Quando alguém se candidatar, aparecerá aqui.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Área / Atuação</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidaturas.map((candidatura) => {
                  const status = statusConfig[candidatura.status] || statusConfig.aguardando;
                  const isPending = 
                    candidatura.status === "aguardando" || 
                    candidatura.status === "enviada" || 
                    candidatura.status === "inscrito";
                  
                  return (
                    <TableRow key={candidatura.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {candidatura.nome_artistico || candidatura.nome_completo || "Sem nome"}
                          </div>
                          {candidatura.nome_artistico && candidatura.nome_completo && (
                            <div className="text-xs text-muted-foreground">
                              {candidatura.nome_completo}
                            </div>
                          )}
                          {candidatura.telefone && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {candidatura.telefone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {candidatura.area_artistica && (
                            <Badge variant="secondary" className="text-xs">
                              {candidatura.area_artistica}
                            </Badge>
                          )}
                          {candidatura.tipo_atuacao && (
                            <div className="text-xs text-muted-foreground">
                              {candidatura.tipo_atuacao}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(candidatura.municipio || candidatura.bairro) ? (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {[candidatura.bairro, candidatura.municipio].filter(Boolean).join(", ")}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(candidatura.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPortfolio(candidatura)}
                            title="Ver portfólio"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-success hover:text-pe-green-dark hover:bg-pe-green-lighter"
                                onClick={() => onAprovar(candidatura.id)}
                                disabled={isUpdating}
                                title="Aprovar"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-error hover:text-pe-red-dark hover:bg-pe-red-lighter"
                                onClick={() => handleReprovarClick(candidatura)}
                                disabled={isUpdating}
                                title="Reprovar"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                        {candidatura.status === "reprovada" && candidatura.motivo_reprovacao && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {candidatura.motivo_reprovacao}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Portfólio */}
      <Dialog open={portfolioDialogOpen} onOpenChange={setPortfolioDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Portfólio do Candidato
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre o candidato
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidatura && (
            <div className="space-y-4 py-2">
              {/* Informações Básicas */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Identificação
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nome Completo</Label>
                    <p className="font-medium">{selectedCandidatura.nome_completo || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Nome Artístico</Label>
                    <p className="font-medium">{selectedCandidatura.nome_artistico || "-"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contato */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Contato
                </h4>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCandidatura.telefone || "Não informado"}</span>
                </div>
              </div>

              <Separator />

              {/* Localização */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Localização
                </h4>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {[selectedCandidatura.bairro, selectedCandidatura.municipio]
                      .filter(Boolean)
                      .join(", ") || "Não informado"}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Perfil Artístico */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Perfil Artístico
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-xs text-muted-foreground">Área Artística</Label>
                      <p className="text-sm">{selectedCandidatura.area_artistica || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-xs text-muted-foreground">Tipo de Atuação</Label>
                      <p className="text-sm">{selectedCandidatura.tipo_atuacao || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-xs text-muted-foreground">Tempo de Atuação</Label>
                      <p className="text-sm">{selectedCandidatura.tempo_atuacao || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-xs text-muted-foreground">Formalização</Label>
                      <p className="text-sm">{selectedCandidatura.situacao_formalizacao || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCandidatura.experiencia_editais && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Experiência com Editais
                    </h4>
                    <p className="text-sm">{selectedCandidatura.experiencia_editais}</p>
                  </div>
                </>
              )}

              {selectedCandidatura.mensagem && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Mensagem do Candidato
                    </h4>
                    <p className="text-sm bg-muted/50 p-3 rounded-md">{selectedCandidatura.mensagem}</p>
                  </div>
                </>
              )}

              {/* Status */}
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs text-muted-foreground">Status Atual</Label>
                  <Badge 
                    variant="outline" 
                    className={statusConfig[selectedCandidatura.status]?.color || ""}
                  >
                    {statusConfig[selectedCandidatura.status]?.label || selectedCandidatura.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Candidatura em {new Date(selectedCandidatura.created_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPortfolioDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Reprovação */}
      <Dialog open={reprovarDialogOpen} onOpenChange={setReprovarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Candidato</DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação para{" "}
              <strong>{selectedCandidatura?.nome_artistico || selectedCandidatura?.nome_completo}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo (opcional)</Label>
              <Textarea
                id="motivo"
                value={motivoReprovacao}
                onChange={(e) => setMotivoReprovacao(e.target.value)}
                placeholder="Ex: Perfil não corresponde aos requisitos..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReprovarDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmReprovar}
              disabled={isUpdating}
            >
              {isUpdating ? "Reprovando..." : "Confirmar Reprovação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}