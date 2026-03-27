import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ClipboardList, Lightbulb, X } from "lucide-react";
import { VagaWizardData, ETAPAS_PROCESSO_SELETIVO, validateVagaStep6 } from "@/types/vaga-wizard";

interface Props {
  data: VagaWizardData;
  onChange: (updates: Partial<VagaWizardData>) => void;
}

export function StepProcessoSeletivo({ data, onChange }: Props) {
  const validation = validateVagaStep6(data);

  const handleEtapaToggle = (etapa: string) => {
    const updated = data.etapas_selecao.includes(etapa)
      ? data.etapas_selecao.filter((e) => e !== etapa)
      : [...data.etapas_selecao, etapa];
    onChange({ etapas_selecao: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <ClipboardList className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Processo Seletivo</h2>
          <p className="text-muted-foreground mt-1">
            Defina o prazo de inscrição, as etapas da seleção e como o candidato deve se candidatar.
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
                Um processo seletivo claro e transparente atrai mais candidatos qualificados.
                Descreva todas as etapas para que o candidato saiba o que esperar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prazo_inscricao" className="text-base font-medium">
            Prazo para Inscrições <span className="text-destructive">*</span>
          </Label>
          <Input
            id="prazo_inscricao"
            type="date"
            value={data.prazo_inscricao}
            onChange={(e) => onChange({ prazo_inscricao: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
          />
          <p className="text-xs text-muted-foreground">
            Data limite para recebimento de candidaturas.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Etapas do Processo Seletivo</Label>
          <p className="text-sm text-muted-foreground">
            Selecione as etapas que compõem o processo de seleção.
          </p>
          <div className="flex flex-wrap gap-2">
            {ETAPAS_PROCESSO_SELETIVO.map((etapa) => {
              const isSelected = data.etapas_selecao.includes(etapa);
              return (
                <Badge
                  key={etapa}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                  onClick={() => handleEtapaToggle(etapa)}
                >
                  {etapa}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          {data.etapas_selecao.length > 0 && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">Ordem do processo:</p>
              <div className="flex flex-wrap gap-1 items-center">
                {data.etapas_selecao.map((etapa, i) => (
                  <span key={etapa} className="flex items-center gap-1">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {i + 1}. {etapa}
                    </span>
                    {i < data.etapas_selecao.length - 1 && (
                      <span className="text-muted-foreground text-xs">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="como_candidatar" className="text-base font-medium">
            Como se Candidatar <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="como_candidatar"
            placeholder="Descreva como o candidato deve se inscrever. Ex: Envie currículo e portfólio para o e-mail xxxx@xxx.com com o assunto 'Candidatura - [Nome da Vaga]'..."
            value={data.como_candidatar}
            onChange={(e) => onChange({ como_candidatar: e.target.value })}
            className="resize-none min-h-[120px]"
            maxLength={1000}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{data.como_candidatar.length}/1000</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="informacoes_adicionais" className="text-base font-medium">
            Informações Adicionais
          </Label>
          <Textarea
            id="informacoes_adicionais"
            placeholder="Outras informações relevantes: política de diversidade e inclusão, documentos necessários, entrevistas online ou presenciais..."
            value={data.informacoes_adicionais}
            onChange={(e) => onChange({ informacoes_adicionais: e.target.value })}
            className="resize-none min-h-[100px]"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground">
            Opcional — Outras informações que o candidato deva saber.
          </p>
        </div>
      </div>

      {!validation.isValid && data.prazo_inscricao && (
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
