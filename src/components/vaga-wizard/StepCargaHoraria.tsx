import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock, Lightbulb } from "lucide-react";
import { VagaWizardData, TIPOS_CONTRATO, REGIMES_JORNADA, validateVagaStep3 } from "@/types/vaga-wizard";

interface Props {
  data: VagaWizardData;
  onChange: (updates: Partial<VagaWizardData>) => void;
}

export function StepCargaHoraria({ data, onChange }: Props) {
  const validation = validateVagaStep3(data);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-success/10">
          <Clock className="h-6 w-6 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Carga Horária e Período</h2>
          <p className="text-muted-foreground mt-1">
            Defina o tipo de contrato, regime de jornada e período de atuação.
          </p>
        </div>
      </div>

      <Card className="border-success/30 bg-pe-green-lighter/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-foreground">Dica:</p>
              <p className="text-success-dark">
                Informe com clareza o regime de trabalho. Candidatos da área cultural frequentemente
                buscam flexibilidade — seja transparente sobre as expectativas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Tipo de Contrato <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.tipo_contrato}
              onValueChange={(value) => onChange({ tipo_contrato: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_CONTRATO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">
              Regime de Jornada <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.regime_jornada}
              onValueChange={(value) => onChange({ regime_jornada: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a jornada" />
              </SelectTrigger>
              <SelectContent>
                {REGIMES_JORNADA.map((regime) => (
                  <SelectItem key={regime} value={regime}>
                    {regime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="horario_trabalho" className="text-base font-medium">
            Horário de Trabalho <span className="text-destructive">*</span>
          </Label>
          <Input
            id="horario_trabalho"
            placeholder="Ex: Segunda a sexta, 9h às 18h | Fins de semana, 14h às 22h"
            value={data.horario_trabalho}
            onChange={(e) => onChange({ horario_trabalho: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Informe os dias e horários esperados de trabalho.
          </p>
        </div>

        <div className="space-y-4 p-4 border rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Período determinado?</Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                Ative se a vaga tiver data de início e/ou fim definidas.
              </p>
            </div>
            <Switch
              checked={data.periodo_determinado}
              onCheckedChange={(checked) => onChange({ periodo_determinado: checked })}
            />
          </div>

          {data.periodo_determinado && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="data_inicio" className="text-sm font-medium">
                  Data de Início
                </Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={data.data_inicio}
                  onChange={(e) => onChange({ data_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fim" className="text-sm font-medium">
                  Data de Término
                </Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={data.data_fim}
                  onChange={(e) => onChange({ data_fim: e.target.value })}
                  min={data.data_inicio}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {!validation.isValid && data.tipo_contrato && (
        <Alert variant="destructive" className="bg-pe-red-lighter border-error/30">
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
