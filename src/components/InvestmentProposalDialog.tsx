import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Briefcase,
  Heart,
  Building2,
  User,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateProposta, TipoApoio } from "@/hooks/usePropostasInvestimento";
import { useAuth } from "@/contexts/AuthContext";

interface InvestmentProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projeto: {
    id: string;
    titulo: string;
    metaFinanciamento: number;
    arrecadado: number;
    criadorId: string;
    isOficina?: boolean;
  };
}

type TipoInvestidor = "pessoa_fisica" | "empresa" | "instituicao";
type TipoApoioUI = "financeiro" | "servico" | "patrocinio" | "misto";

interface PropostaData {
  tipoInvestidor: TipoInvestidor;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  tipoApoio: TipoApoioUI;
  valorFinanceiro: string;
  descricaoServico: string;
  contrapartidas: string[];
  mensagem: string;
  aceitaTermos: boolean;
}

const contrapartidasOptions = [
  { id: "logo_material", label: "Logomarca em materiais de divulgação" },
  { id: "creditos", label: "Créditos no projeto final" },
  { id: "ingressos", label: "Ingressos ou acessos VIP" },
  { id: "networking", label: "Acesso a eventos de networking" },
  { id: "relatorio", label: "Relatório de impacto personalizado" },
  { id: "mencao_midia", label: "Menção em entrevistas e mídia" },
];

export const InvestmentProposalDialog = ({
  open,
  onOpenChange,
  projeto,
}: InvestmentProposalDialogProps) => {
  const { user } = useAuth();
  const createProposta = useCreateProposta();
  const [step, setStep] = useState(1);
  const [proposta, setProposta] = useState<PropostaData>({
    tipoInvestidor: "pessoa_fisica",
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    tipoApoio: "financeiro",
    valorFinanceiro: "",
    descricaoServico: "",
    contrapartidas: [],
    mensagem: "",
    aceitaTermos: false,
  });

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const handleContrapartidaChange = (contrapartidaId: string, checked: boolean) => {
    setProposta((prev) => ({
      ...prev,
      contrapartidas: checked
        ? [...prev.contrapartidas, contrapartidaId]
        : prev.contrapartidas.filter((c) => c !== contrapartidaId),
    }));
  };

  const canAdvance = () => {
    switch (step) {
      case 1:
        return proposta.tipoInvestidor && proposta.nome && proposta.email;
      case 2:
        return proposta.tipoApoio && (
          proposta.tipoApoio === "servico" 
            ? proposta.descricaoServico 
            : proposta.valorFinanceiro
        );
      case 3:
        return proposta.contrapartidas.length > 0;
      case 4:
        return proposta.aceitaTermos;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para enviar uma proposta.");
      return;
    }

    // Parse valor financeiro
    const valorNumerico = proposta.valorFinanceiro 
      ? parseFloat(proposta.valorFinanceiro.replace(/\./g, "").replace(",", "."))
      : undefined;

    // Map tipoApoio: "misto" -> "patrocinio" (since misto is a mix of financial + service)
    const tipoApoioDb: TipoApoio = proposta.tipoApoio === "misto" ? "patrocinio" : proposta.tipoApoio;

    try {
      await createProposta.mutateAsync({
        oportunidade_id: projeto.isOficina ? undefined : projeto.id,
        oficina_id: projeto.isOficina ? projeto.id : undefined,
        criador_id: projeto.criadorId,
        tipo_apoio: tipoApoioDb,
        valor_financeiro: valorNumerico,
        descricao_servico: proposta.descricaoServico || undefined,
        contrapartidas_desejadas: proposta.contrapartidas,
        mensagem: proposta.mensagem || undefined,
      });

      onOpenChange(false);
      // Reset form
      setStep(1);
      setProposta({
        tipoInvestidor: "pessoa_fisica",
        nome: "",
        email: "",
        telefone: "",
        empresa: "",
        tipoApoio: "financeiro",
        valorFinanceiro: "",
        descricaoServico: "",
        contrapartidas: [],
        mensagem: "",
        aceitaTermos: false,
      });
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Tipo de Investidor</Label>
              <RadioGroup
                value={proposta.tipoInvestidor}
                onValueChange={(v) => setProposta({ ...proposta, tipoInvestidor: v as TipoInvestidor })}
                className="grid grid-cols-3 gap-3"
              >
                <Label
                  htmlFor="pessoa_fisica"
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                    proposta.tipoInvestidor === "pessoa_fisica"
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value="pessoa_fisica" id="pessoa_fisica" className="sr-only" />
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">Pessoa Física</span>
                </Label>
                <Label
                  htmlFor="empresa"
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                    proposta.tipoInvestidor === "empresa"
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value="empresa" id="empresa" className="sr-only" />
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm font-medium">Empresa</span>
                </Label>
                <Label
                  htmlFor="instituicao"
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                    proposta.tipoInvestidor === "instituicao"
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value="instituicao" id="instituicao" className="sr-only" />
                  <Heart className="h-6 w-6" />
                  <span className="text-sm font-medium">Instituição</span>
                </Label>
              </RadioGroup>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  value={proposta.nome}
                  onChange={(e) => setProposta({ ...proposta, nome: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>
              {proposta.tipoInvestidor !== "pessoa_fisica" && (
                <div>
                  <Label htmlFor="empresa">Nome da {proposta.tipoInvestidor === "empresa" ? "Empresa" : "Instituição"}</Label>
                  <Input
                    id="empresa"
                    value={proposta.empresa}
                    onChange={(e) => setProposta({ ...proposta, empresa: e.target.value })}
                    placeholder={`Nome da ${proposta.tipoInvestidor === "empresa" ? "empresa" : "instituição"}`}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={proposta.email}
                    onChange={(e) => setProposta({ ...proposta, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={proposta.telefone}
                    onChange={(e) => setProposta({ ...proposta, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Tipo de Apoio</Label>
              <RadioGroup
                value={proposta.tipoApoio}
                onValueChange={(v) => setProposta({ ...proposta, tipoApoio: v as TipoApoio })}
                className="grid grid-cols-3 gap-3"
              >
                <Label
                  htmlFor="financeiro"
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                    proposta.tipoApoio === "financeiro"
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value="financeiro" id="financeiro" className="sr-only" />
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                  <span className="text-sm font-medium">Financeiro</span>
                </Label>
                <Label
                  htmlFor="servico"
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                    proposta.tipoApoio === "servico"
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value="servico" id="servico" className="sr-only" />
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Serviço</span>
                </Label>
                <Label
                  htmlFor="misto"
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                    proposta.tipoApoio === "misto"
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <RadioGroupItem value="misto" id="misto" className="sr-only" />
                  <Sparkles className="h-6 w-6 text-accent" />
                  <span className="text-sm font-medium">Misto</span>
                </Label>
              </RadioGroup>
            </div>

            {(proposta.tipoApoio === "financeiro" || proposta.tipoApoio === "misto") && (
              <div>
                <Label htmlFor="valor">Valor do investimento *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="valor"
                    value={proposta.valorFinanceiro}
                    onChange={(e) => setProposta({ ...proposta, valorFinanceiro: e.target.value })}
                    placeholder="0,00"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Meta do projeto: R$ {projeto.metaFinanciamento.toLocaleString("pt-BR")} | 
                  Faltam: R$ {(projeto.metaFinanciamento - projeto.arrecadado).toLocaleString("pt-BR")}
                </p>
              </div>
            )}

            {(proposta.tipoApoio === "servico" || proposta.tipoApoio === "misto") && (
              <div>
                <Label htmlFor="servico">Descrição do serviço oferecido *</Label>
                <Textarea
                  id="servico"
                  value={proposta.descricaoServico}
                  onChange={(e) => setProposta({ ...proposta, descricaoServico: e.target.value })}
                  placeholder="Descreva o serviço ou recurso que você pode oferecer ao projeto..."
                  rows={4}
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-1 block">Contrapartidas Desejadas</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione as contrapartidas que gostaria de receber em troca do seu apoio
              </p>
              <div className="grid gap-3">
                {contrapartidasOptions.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={option.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      proposta.contrapartidas.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <Checkbox
                      id={option.id}
                      checked={proposta.contrapartidas.includes(option.id)}
                      onCheckedChange={(checked) =>
                        handleContrapartidaChange(option.id, checked as boolean)
                      }
                    />
                    <span className="text-sm">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="mensagem">Mensagem para o responsável (opcional)</Label>
              <Textarea
                id="mensagem"
                value={proposta.mensagem}
                onChange={(e) => setProposta({ ...proposta, mensagem: e.target.value })}
                placeholder="Conte um pouco sobre você e por que deseja apoiar este projeto..."
                rows={4}
              />
            </div>

            {/* Resumo da proposta */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Resumo da sua proposta
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de investidor:</span>
                  <span className="font-medium capitalize">
                    {proposta.tipoInvestidor.replace("_", " ")}
                    {proposta.empresa && ` - ${proposta.empresa}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de apoio:</span>
                  <span className="font-medium capitalize">{proposta.tipoApoio}</span>
                </div>
                {proposta.valorFinanceiro && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-medium text-emerald-500">R$ {proposta.valorFinanceiro}</span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Contrapartidas:</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                    {proposta.contrapartidas.map((c) => (
                      <Badge key={c} variant="secondary" className="text-[10px]">
                        {contrapartidasOptions.find((o) => o.id === c)?.label.split(" ")[0]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="termos"
                checked={proposta.aceitaTermos}
                onCheckedChange={(checked) =>
                  setProposta({ ...proposta, aceitaTermos: checked as boolean })
                }
              />
              <Label htmlFor="termos" className="text-sm leading-relaxed cursor-pointer">
                Declaro que li e concordo com os termos de investimento e entendo que esta é uma proposta 
                inicial que será analisada pelo responsável do projeto.
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Seus Dados",
    "Tipo de Apoio",
    "Contrapartidas",
    "Confirmação",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Investir em {projeto.titulo}
          </DialogTitle>
          <DialogDescription>
            Passo {step} de {totalSteps}: {stepTitles[step - 1]}
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="py-2">
          <Progress value={progressPercent} className="h-1.5" />
          <div className="flex justify-between mt-2">
            {stepTitles.map((title, idx) => (
              <span
                key={idx}
                className={`text-[10px] ${
                  idx + 1 <= step ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {idx + 1}
              </span>
            ))}
          </div>
        </div>

        {renderStep()}

        <DialogFooter className="flex gap-2 sm:gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canAdvance()}>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canAdvance() || createProposta.isPending}>
              {createProposta.isPending ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Proposta
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
