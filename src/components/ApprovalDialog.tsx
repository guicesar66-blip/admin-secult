import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BadgeStatus } from "@/components/ui/badge-status";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "oportunidade" | "incubacao";
  item: {
    id: number;
    titulo: string;
    tipo?: string;
    status: string;
    detalhes?: string;
  };
}

export function ApprovalDialog({
  open,
  onOpenChange,
  type,
  item,
}: ApprovalDialogProps) {
  const [observacoes, setObservacoes] = useState("");
  const { toast } = useToast();

  const handleApprove = () => {
    toast({
      title: "Aprovado com sucesso!",
      description: `${type === "oportunidade" ? "Oportunidade" : "Programa de incubação"} "${item.titulo}" foi aprovado(a).`,
    });
    onOpenChange(false);
  };

  const handleReject = () => {
    if (!observacoes.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, adicione uma justificativa para a rejeição.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Rejeitado",
      description: `${type === "oportunidade" ? "Oportunidade" : "Programa"} "${item.titulo}" foi rejeitado(a).`,
      variant: "destructive",
    });
    onOpenChange(false);
  };

  const handleRequestChanges = () => {
    if (!observacoes.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, especifique quais ajustes são necessários.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Ajustes solicitados",
      description: `Solicitação enviada ao responsável por "${item.titulo}".`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Aprovação de {type === "oportunidade" ? "Oportunidade" : "Programa de Incubação"}
          </DialogTitle>
          <DialogDescription>
            Analise os detalhes e tome uma decisão
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações Básicas */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Título</Label>
              <p className="font-semibold text-foreground">{item.titulo}</p>
            </div>
            
            {item.tipo && (
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <p className="text-sm">{item.tipo}</p>
              </div>
            )}
            
            <div>
              <Label className="text-xs text-muted-foreground">Status Atual</Label>
              <div className="mt-1">
                <BadgeStatus variant="error">{item.status}</BadgeStatus>
              </div>
            </div>
          </div>

          {/* Detalhes Específicos */}
          {type === "oportunidade" ? (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Informações do Evento</Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">15/12/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local:</span>
                    <span className="font-medium">Marco Zero</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vagas:</span>
                    <span className="font-medium">100 artistas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orçamento:</span>
                    <span className="font-medium">R$ 50.000</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Informações do Programa</Label>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-medium">12 semanas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vagas:</span>
                    <span className="font-medium">30 artistas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modalidade:</span>
                    <span className="font-medium">Híbrida</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orçamento:</span>
                    <span className="font-medium">R$ 18.000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">
              Observações / Justificativa
            </Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione comentários, sugestões de ajustes ou justificativa..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Rejeitar
          </Button>
          <Button
            variant="outline"
            onClick={handleRequestChanges}
            className="border-warning text-warning hover:bg-warning/10"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Solicitar Ajustes
          </Button>
          <Button
            onClick={handleApprove}
            className="bg-success hover:bg-success/90"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
