import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Laptop, Lightbulb, MapPin, Users } from "lucide-react";
import { VagaWizardData, MODALIDADES_TRABALHO, MUNICIPIOS_PE, validateVagaStep2 } from "@/types/vaga-wizard";

interface Props {
  data: VagaWizardData;
  onChange: (updates: Partial<VagaWizardData>) => void;
}

const MODALIDADE_ICONS: Record<string, React.ReactNode> = {
  Presencial: <MapPin className="h-5 w-5" />,
  Remoto: <Laptop className="h-5 w-5" />,
  Híbrido: <Users className="h-5 w-5" />,
};

const MODALIDADE_DESC: Record<string, string> = {
  Presencial: "O profissional trabalhará em um local físico específico.",
  Remoto: "O trabalho pode ser realizado de qualquer lugar.",
  Híbrido: "Combinação de dias presenciais e remotos.",
};

export function StepLocalModalidade({ data, onChange }: Props) {
  const validation = validateVagaStep2(data);
  const isRemoto = data.modalidade === "Remoto";

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <MapPin className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Local e Modalidade de Trabalho</h2>
          <p className="text-muted-foreground mt-1">
            Informe onde e como o trabalho será realizado.
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
                A modalidade de trabalho é um dos fatores mais importantes para candidatos.
                Seja claro sobre as expectativas de presença física.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Modalidade de Trabalho <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {MODALIDADES_TRABALHO.map((modalidade) => (
              <button
                key={modalidade}
                type="button"
                onClick={() => onChange({ modalidade })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  data.modalidade === modalidade
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-border hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                <span className={data.modalidade === modalidade ? "text-emerald-600" : "text-muted-foreground"}>
                  {MODALIDADE_ICONS[modalidade]}
                </span>
                {modalidade}
              </button>
            ))}
          </div>
          {data.modalidade && (
            <p className="text-sm text-muted-foreground">{MODALIDADE_DESC[data.modalidade]}</p>
          )}
        </div>

        {!isRemoto && (
          <>
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Município <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.municipio}
                onValueChange={(value) => onChange({ municipio: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o município" />
                </SelectTrigger>
                <SelectContent>
                  {MUNICIPIOS_PE.map((municipio) => (
                    <SelectItem key={municipio} value={municipio}>
                      {municipio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro" className="text-base font-medium">
                  Bairro
                </Label>
                <Input
                  id="bairro"
                  placeholder="Ex: Boa Viagem, Santo Antônio..."
                  value={data.bairro}
                  onChange={(e) => onChange({ bairro: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="local" className="text-base font-medium">
                  Local / Endereço <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="local"
                  placeholder="Ex: Centro Cultural, Av. Principal, 123..."
                  value={data.local}
                  onChange={(e) => onChange({ local: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {isRemoto && (
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Estado / País (se houver restrição geográfica)
            </Label>
            <Input
              placeholder="Ex: Pernambuco, Brasil (deixe em branco se não houver restrição)"
              value={data.local}
              onChange={(e) => onChange({ local: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Opcional — preencha apenas se o trabalho remoto tiver restrição de localização.
            </p>
          </div>
        )}

        {data.modalidade === "Híbrido" && (
          <div className="space-y-2">
            <Label htmlFor="horario_hibrido" className="text-base font-medium">
              Detalhes do regime híbrido
            </Label>
            <Input
              id="horario_hibrido"
              placeholder="Ex: 3 dias presenciais, 2 remotos por semana..."
              value={data.horario_trabalho}
              onChange={(e) => onChange({ horario_trabalho: e.target.value })}
            />
          </div>
        )}
      </div>

      {!validation.isValid && data.modalidade && (
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
