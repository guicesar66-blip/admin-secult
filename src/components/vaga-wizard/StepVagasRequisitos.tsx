import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lightbulb, Plus, Users, X } from "lucide-react";
import {
  VagaWizardData,
  NIVEIS_EXPERIENCIA,
  NIVEIS_ESCOLARIDADE,
  validateVagaStep5,
} from "@/types/vaga-wizard";

interface Props {
  data: VagaWizardData;
  onChange: (updates: Partial<VagaWizardData>) => void;
}

export function StepVagasRequisitos({ data, onChange }: Props) {
  const validation = validateVagaStep5(data);
  const [novaHabilidade, setNovaHabilidade] = useState("");

  const adicionarHabilidade = () => {
    const habilidade = novaHabilidade.trim();
    if (habilidade && !data.habilidades.includes(habilidade)) {
      onChange({ habilidades: [...data.habilidades, habilidade] });
      setNovaHabilidade("");
    }
  };

  const removerHabilidade = (habilidade: string) => {
    onChange({ habilidades: data.habilidades.filter((h) => h !== habilidade) });
  };

  const handleHabilidadeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionarHabilidade();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <Users className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Vagas e Requisitos</h2>
          <p className="text-muted-foreground mt-1">
            Defina quantas vagas estão disponíveis e o perfil do candidato ideal.
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
                Separe claramente os requisitos obrigatórios dos desejáveis.
                Requisitos muito rigorosos podem afastar candidatos qualificados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="num_vagas" className="text-base font-medium">
              Número de Vagas <span className="text-destructive">*</span>
            </Label>
            <Input
              id="num_vagas"
              type="number"
              min={1}
              max={999}
              value={data.num_vagas}
              onChange={(e) => onChange({ num_vagas: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">
              Nível de Experiência <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.nivel_experiencia}
              onValueChange={(value) => onChange({ nivel_experiencia: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {NIVEIS_EXPERIENCIA.map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>
                    {nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">
              Escolaridade Mínima
            </Label>
            <Select
              value={data.escolaridade_minima}
              onValueChange={(value) => onChange({ escolaridade_minima: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {NIVEIS_ESCOLARIDADE.map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>
                    {nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requisitos_obrigatorios" className="text-base font-medium">
            Requisitos Obrigatórios <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="requisitos_obrigatorios"
            placeholder="Liste os requisitos que o candidato DEVE ter. Ex: Experiência com produção de eventos culturais, domínio de planilhas, habilitação..."
            value={data.requisitos_obrigatorios}
            onChange={(e) => onChange({ requisitos_obrigatorios: e.target.value })}
            className="resize-none min-h-[120px]"
            maxLength={1500}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{data.requisitos_obrigatorios.length}/1500</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requisitos_desejaveis" className="text-base font-medium">
            Requisitos Desejáveis
          </Label>
          <Textarea
            id="requisitos_desejaveis"
            placeholder="Liste os requisitos que seriam um diferencial, mas não são obrigatórios. Ex: Conhecimento em captação de recursos, experiência com editais públicos..."
            value={data.requisitos_desejaveis}
            onChange={(e) => onChange({ requisitos_desejaveis: e.target.value })}
            className="resize-none min-h-[100px]"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground">
            Opcional — Diferenciais que o candidato ideal teria.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Habilidades e Competências</Label>
          <p className="text-sm text-muted-foreground">
            Adicione habilidades técnicas e comportamentais relevantes para a vaga.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Edição de vídeo, Gestão de redes sociais, Liderança..."
              value={novaHabilidade}
              onChange={(e) => setNovaHabilidade(e.target.value)}
              onKeyDown={handleHabilidadeKeyDown}
              maxLength={50}
            />
            <Button
              type="button"
              variant="outline"
              onClick={adicionarHabilidade}
              disabled={!novaHabilidade.trim()}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.habilidades.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {data.habilidades.map((habilidade) => (
                <Badge key={habilidade} variant="secondary" className="gap-1 pr-1">
                  {habilidade}
                  <button
                    type="button"
                    onClick={() => removerHabilidade(habilidade)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {!validation.isValid && data.num_vagas > 0 && (
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
