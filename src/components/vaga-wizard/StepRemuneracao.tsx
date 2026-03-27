import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, DollarSign, Lightbulb, X } from "lucide-react";
import { VagaWizardData, BENEFICIOS_OPCOES, validateVagaStep4 } from "@/types/vaga-wizard";

interface Props {
  data: VagaWizardData;
  onChange: (updates: Partial<VagaWizardData>) => void;
}

export function StepRemuneracao({ data, onChange }: Props) {
  const validation = validateVagaStep4(data);

  const handleBeneficioToggle = (beneficio: string) => {
    const updated = data.beneficios.includes(beneficio)
      ? data.beneficios.filter((b) => b !== beneficio)
      : [...data.beneficios, beneficio];
    onChange({ beneficios: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <DollarSign className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Remuneração e Benefícios</h2>
          <p className="text-muted-foreground mt-1">
            Informe as condições financeiras e benefícios oferecidos.
          </p>
        </div>
      </div>

      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-emerald-900">Dica:</p>
              <p className="text-emerald-700">
                Vagas com remuneração informada recebem até 3x mais candidaturas.
                Se não puder informar o valor, marque como "A combinar".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-4 p-4 border rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Remuneração a combinar?</Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                Ative para não divulgar o valor da remuneração.
              </p>
            </div>
            <Switch
              checked={data.remuneracao_a_combinar}
              onCheckedChange={(checked) =>
                onChange({ remuneracao_a_combinar: checked, remuneracao_valor: checked ? null : data.remuneracao_valor })
              }
            />
          </div>

          {!data.remuneracao_a_combinar && (
            <div className="space-y-2">
              <Label htmlFor="remuneracao" className="text-base font-medium">
                Valor da Remuneração (R$) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  R$
                </span>
                <Input
                  id="remuneracao"
                  type="number"
                  min={0}
                  step={100}
                  placeholder="Ex: 3000"
                  value={data.remuneracao_valor ?? ""}
                  onChange={(e) =>
                    onChange({ remuneracao_valor: e.target.value ? parseFloat(e.target.value) : null })
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Informe o valor mensal, por projeto ou por hora conforme o tipo de contrato.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Benefícios Oferecidos</Label>
          <p className="text-sm text-muted-foreground">
            Selecione todos os benefícios incluídos na oferta.
          </p>
          <div className="flex flex-wrap gap-2">
            {BENEFICIOS_OPCOES.map((beneficio) => {
              const isSelected = data.beneficios.includes(beneficio);
              return (
                <Badge
                  key={beneficio}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                  onClick={() => handleBeneficioToggle(beneficio)}
                >
                  {beneficio}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="obs_remuneracao" className="text-base font-medium">
            Observações sobre Remuneração
          </Label>
          <Textarea
            id="obs_remuneracao"
            placeholder="Ex: Cachê por apresentação, pagamento quinzenal, negociável para candidatos com experiência..."
            value={data.observacoes_remuneracao}
            onChange={(e) => onChange({ observacoes_remuneracao: e.target.value })}
            className="resize-none min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            Opcional — Adicione detalhes sobre forma ou frequência de pagamento.
          </p>
        </div>
      </div>

      {!validation.isValid && (data.remuneracao_a_combinar !== undefined) && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
