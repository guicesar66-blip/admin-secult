import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Lightbulb } from "lucide-react";
import { VagaWizardData, AREAS_CULTURAIS_VAGA, validateVagaStep1 } from "@/types/vaga-wizard";

interface Props {
  data: VagaWizardData;
  onChange: (updates: Partial<VagaWizardData>) => void;
}

export function StepInformacoesBasicas({ data, onChange }: Props) {
  const validation = validateVagaStep1(data);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <FileText className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Informações Básicas da Vaga</h2>
          <p className="text-muted-foreground mt-1">
            Defina o título, a área cultural e descreva as responsabilidades e objetivos da vaga.
          </p>
        </div>
      </div>

      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-emerald-900">Dicas para uma boa vaga:</p>
              <ul className="list-disc list-inside text-emerald-700 space-y-1">
                <li>Use um título claro que reflita exatamente a função</li>
                <li>A descrição deve comunicar o propósito da vaga e o contexto do projeto</li>
                <li>A área cultural ajuda a encontrar os candidatos certos na base CENA</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="titulo" className="text-base font-medium">
            Título da Vaga <span className="text-destructive">*</span>
          </Label>
          <Input
            id="titulo"
            placeholder="Ex: Produtor Cultural, Técnico de Som, Assistente de Comunicação..."
            value={data.titulo}
            onChange={(e) => onChange({ titulo: e.target.value })}
            maxLength={100}
            className="text-base"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Nome claro e específico da função</span>
            <span className={data.titulo.length > 85 ? "text-amber-600" : ""}>
              {data.titulo.length}/100
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">
            Área Cultural <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.area_cultural}
            onValueChange={(value) => onChange({ area_cultural: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a área cultural" />
            </SelectTrigger>
            <SelectContent>
              {AREAS_CULTURAIS_VAGA.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Utilizada para conectar a vaga com os perfis certos na base CENA
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao" className="text-base font-medium">
            Descrição da Vaga <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="descricao"
            placeholder="Descreva as principais atividades, responsabilidades, contexto do projeto e o que se espera do profissional..."
            value={data.descricao}
            onChange={(e) => onChange({ descricao: e.target.value })}
            className="min-h-[200px] text-base resize-none"
            maxLength={3000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={data.descricao.length < 100 ? "text-amber-600" : "text-green-600"}>
              {data.descricao.length < 100
                ? `Mínimo 100 caracteres (faltam ${100 - data.descricao.length})`
                : "✓ Mínimo atingido"}
            </span>
            <span className={data.descricao.length > 2700 ? "text-amber-600" : ""}>
              {data.descricao.length}/3000
            </span>
          </div>
        </div>
      </div>

      {!validation.isValid && data.titulo && (
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
