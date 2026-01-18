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
import { Check, X, User, Loader2, MessageSquare } from "lucide-react";
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
  enviada: { label: "Enviada", color: "bg-blue-500/20 text-blue-600" },
  aprovada: { label: "Aprovado", color: "bg-green-500/20 text-green-600" },
  reprovada: { label: "Reprovado", color: "bg-red-500/20 text-red-600" },
};

export function CandidatosTab({
  candidaturas,
  isLoading,
  onAprovar,
  onReprovar,
  isUpdating,
}: CandidatosTabProps) {
  const [reprovarDialogOpen, setReprovarDialogOpen] = useState(false);
  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);
  const [motivoReprovacao, setMotivoReprovacao] = useState("");

  const handleReprovarClick = (candidatura: Candidatura) => {
    setSelectedCandidatura(candidatura);
    setMotivoReprovacao("");
    setReprovarDialogOpen(true);
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
    aguardando: candidaturas.filter(c => c.status === "aguardando" || c.status === "enviada").length,
    aprovados: candidaturas.filter(c => c.status === "aprovada").length,
    reprovados: candidaturas.filter(c => c.status === "reprovada").length,
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
            <div className="text-2xl font-bold text-green-600">{estatisticas.aprovados}</div>
            <div className="text-sm text-muted-foreground">Aprovados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{estatisticas.reprovados}</div>
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
                  <TableHead>Contato</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidaturas.map((candidatura) => {
                  const status = statusConfig[candidatura.status] || statusConfig.aguardando;
                  const isPending = candidatura.status === "aguardando" || candidatura.status === "enviada";
                  
                  return (
                    <TableRow key={candidatura.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {candidatura.nome_artistico || candidatura.nome_completo || "Sem nome"}
                          </div>
                          {candidatura.nome_artistico && candidatura.nome_completo && (
                            <div className="text-xs text-muted-foreground">
                              {candidatura.nome_completo}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {candidatura.telefone || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(candidatura.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {candidatura.mensagem ? (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span className="truncate max-w-[150px]">{candidatura.mensagem}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isPending && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => onAprovar(candidatura.id)}
                              disabled={isUpdating}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleReprovarClick(candidatura)}
                              disabled={isUpdating}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {candidatura.status === "reprovada" && candidatura.motivo_reprovacao && (
                          <span className="text-xs text-muted-foreground">
                            {candidatura.motivo_reprovacao}
                          </span>
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
