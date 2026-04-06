import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  X, 
  MessageSquare, 
  Loader2, 
  User, 
  DollarSign, 
  Briefcase, 
  Award,
  Calendar,
} from "lucide-react";
import { useUpdatePropostaStatus, useCreateProposta, PropostaInvestimento } from "@/hooks/usePropostasInvestimento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PropostaActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposta: PropostaInvestimento | null;
  projetoId: string;
  tipoEntidade: "oportunidade" | "oficina";
}

const tipoApoioLabels: Record<string, string> = {
  financeiro: "Investimento Financeiro",
  servico: "Serviço/Permuta",
  patrocinio: "Patrocínio",
};

const tipoApoioIcons: Record<string, React.ReactNode> = {
  financeiro: <DollarSign className="h-4 w-4" />,
  servico: <Briefcase className="h-4 w-4" />,
  patrocinio: <Award className="h-4 w-4" />,
};

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pendente: { label: "Pendente", variant: "secondary" },
  aprovada: { label: "Aprovada", variant: "default" },
  rejeitada: { label: "Rejeitada", variant: "destructive" },
  contraproposta: { label: "Contraproposta", variant: "outline" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export function PropostaActionDialog({ 
  open, 
  onOpenChange, 
  proposta,
  projetoId,
  tipoEntidade,
}: PropostaActionDialogProps) {
  const [mode, setMode] = useState<"view" | "reject" | "counter">("view");
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [contrapropostaForm, setContrapropostaForm] = useState({
    valor: "",
    mensagem: "",
  });

  const updateStatus = useUpdatePropostaStatus();
  const createProposta = useCreateProposta();

  if (!proposta) return null;

  const handleApprove = async () => {
    await updateStatus.mutateAsync({
      propostaId: proposta.id,
      status: "aprovada",
    });
    onOpenChange(false);
  };

  const handleReject = async () => {
    if (!motivoRejeicao.trim()) return;
    await updateStatus.mutateAsync({
      propostaId: proposta.id,
      status: "rejeitada",
      motivo_rejeicao: motivoRejeicao,
    });
    setMotivoRejeicao("");
    setMode("view");
    onOpenChange(false);
  };

  const handleSendContraproposta = async () => {
    if (!contrapropostaForm.mensagem.trim()) return;

    // Marcar proposta atual como contraproposta
    await updateStatus.mutateAsync({
      propostaId: proposta.id,
      status: "contraproposta",
    });

    // Criar nova proposta como resposta
    await createProposta.mutateAsync({
      ...(tipoEntidade === "oportunidade" 
        ? { oportunidade_id: projetoId }
        : { oficina_id: projetoId }
      ),
      criador_id: proposta.criador_id,
      tipo_apoio: proposta.tipo_apoio,
      valor_financeiro: contrapropostaForm.valor 
        ? parseFloat(contrapropostaForm.valor) 
        : proposta.valor_financeiro || undefined,
      descricao_servico: proposta.descricao_servico || undefined,
      contrapartidas_desejadas: proposta.contrapartidas_desejadas || undefined,
      mensagem: contrapropostaForm.mensagem,
      proposta_pai_id: proposta.id,
    });

    setContrapropostaForm({ valor: "", mensagem: "" });
    setMode("view");
    onOpenChange(false);
  };

  const isPending = proposta.status === "pendente";
  const isLoading = updateStatus.isPending || createProposta.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v) setMode("view");
      onOpenChange(v);
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {tipoApoioIcons[proposta.tipo_apoio]}
            <DialogTitle>{tipoApoioLabels[proposta.tipo_apoio]}</DialogTitle>
          </div>
          <DialogDescription>
            Proposta recebida em {format(new Date(proposta.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={statusLabels[proposta.status]?.variant || "secondary"}>
              {statusLabels[proposta.status]?.label || proposta.status}
            </Badge>
          </div>

          <Separator />

          {/* Detalhes da Proposta */}
          <div className="space-y-3">
            {proposta.tipo_apoio === "financeiro" && proposta.valor_financeiro && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Valor oferecido</span>
                <span className="font-bold text-success text-lg">
                  R$ {proposta.valor_financeiro.toLocaleString("pt-BR")}
                </span>
              </div>
            )}

            {proposta.tipo_apoio === "servico" && proposta.descricao_servico && (
              <div>
                <span className="text-sm text-muted-foreground">Serviço oferecido</span>
                <p className="mt-1 text-sm bg-muted p-3 rounded-md">{proposta.descricao_servico}</p>
              </div>
            )}

            {proposta.contrapartidas_desejadas && proposta.contrapartidas_desejadas.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Contrapartidas desejadas</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {proposta.contrapartidas_desejadas.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            )}

            {proposta.mensagem && (
              <div>
                <span className="text-sm text-muted-foreground">Mensagem do investidor</span>
                <p className="mt-1 text-sm bg-muted p-3 rounded-md">{proposta.mensagem}</p>
              </div>
            )}

            {proposta.motivo_rejeicao && (
              <div>
                <span className="text-sm text-muted-foreground text-error">Motivo da rejeição</span>
                <p className="mt-1 text-sm bg-pe-red-lighter text-pe-red-dark p-3 rounded-md">{proposta.motivo_rejeicao}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Ações / Formulários */}
          {mode === "view" && isPending && (
            <div className="flex flex-col gap-2">
              <Button onClick={handleApprove} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                Aprovar Proposta
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="destructive" onClick={() => setMode("reject")} disabled={isLoading}>
                  <X className="h-4 w-4 mr-2" />
                  Recusar
                </Button>
                <Button variant="outline" onClick={() => setMode("counter")} disabled={isLoading}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contraproposta
                </Button>
              </div>
            </div>
          )}

          {mode === "reject" && (
            <div className="space-y-3">
              <div>
                <Label>Motivo da recusa *</Label>
                <Textarea
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  placeholder="Explique por que está recusando esta proposta..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode("view")} className="flex-1" disabled={isLoading}>
                  Voltar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject} 
                  className="flex-1"
                  disabled={!motivoRejeicao.trim() || isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Confirmar Recusa
                </Button>
              </div>
            </div>
          )}

          {mode === "counter" && (
            <div className="space-y-3">
              {proposta.tipo_apoio === "financeiro" && (
                <div>
                  <Label>Novo valor sugerido (R$)</Label>
                  <Input
                    type="number"
                    value={contrapropostaForm.valor}
                    onChange={(e) => setContrapropostaForm(prev => ({ ...prev, valor: e.target.value }))}
                    placeholder={proposta.valor_financeiro?.toString() || "0"}
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <Label>Mensagem de contraproposta *</Label>
                <Textarea
                  value={contrapropostaForm.mensagem}
                  onChange={(e) => setContrapropostaForm(prev => ({ ...prev, mensagem: e.target.value }))}
                  placeholder="Descreva sua contraproposta e condições..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setMode("view")} className="flex-1" disabled={isLoading}>
                  Voltar
                </Button>
                <Button 
                  onClick={handleSendContraproposta} 
                  className="flex-1"
                  disabled={!contrapropostaForm.mensagem.trim() || isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Enviar Contraproposta
                </Button>
              </div>
            </div>
          )}

          {!isPending && mode === "view" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
