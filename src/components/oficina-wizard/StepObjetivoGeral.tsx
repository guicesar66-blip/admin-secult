import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  OficinaWizardData, 
  validateStep2 
} from "@/types/oficina-wizard";
import { Target, Lightbulb } from "lucide-react";

interface StepObjetivoGeralProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

export function StepObjetivoGeral({ data, onChange }: StepObjetivoGeralProps) {
  const validation = validateStep2(data);
  const charCount = data.objetivo_geral?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-accent/20">
          <Target className="h-5 w-5 text-accent-dark" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Step 2: Objetivo Geral</h2>
          <p className="text-sm text-muted-foreground">
            Definir o propósito principal do projeto em uma frase clara e mensurável
          </p>
        </div>
      </div>

      {/* Dicas de preenchimento */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-pe-blue-dark">Dicas de preenchimento:</p>
            <ul className="text-sm text-primary space-y-1">
              <li>• O objetivo geral deve responder: <strong>O QUE</strong> o projeto vai fazer e <strong>PARA QUEM</strong></li>
              <li>• Use verbos de ação no infinitivo: Capacitar, Formar, Promover, Desenvolver</li>
              <li>• Mencione a quantidade de beneficiários esperada</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Objetivo Geral */}
      <div className="space-y-2">
        <Label htmlFor="objetivo_geral" className="flex items-center gap-2">
          Objetivo Geral <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="objetivo_geral"
          value={data.objetivo_geral}
          onChange={(e) => onChange({ objetivo_geral: e.target.value })}
          placeholder="Ex: Capacitar 40 iniciantes em audiovisual do bairro da Várzea, explorando técnicas tradicionais e uso de celulares, resultando na produção de 5 a 10 vídeos coletivos que serão exibidos em mostra pública."
          className="min-h-[150px] resize-none text-base"
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Entre 50 e 500 caracteres</span>
          <span className={charCount < 50 ? "text-accent-dark" : charCount > 500 ? "text-destructive" : "text-success"}>
            {charCount}/500
          </span>
        </div>
      </div>

      {/* Exemplo visual */}
      <div className="p-4 rounded-lg bg-muted/50">
        <p className="text-sm font-medium mb-2">Exemplo de objetivo bem estruturado:</p>
        <p className="text-sm text-muted-foreground italic">
          "Capacitar 40 iniciantes em audiovisual, explorando técnicas tradicionais e uso de celulares, resultando na produção de 5 a 10 vídeos coletivos."
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 rounded bg-success/20 text-pe-green-dark">✓ Verbo de ação</span>
          <span className="text-xs px-2 py-1 rounded bg-success/20 text-pe-green-dark">✓ Quantidade definida</span>
          <span className="text-xs px-2 py-1 rounded bg-success/20 text-pe-green-dark">✓ Resultado mensurável</span>
        </div>
      </div>

      {/* Validação visual */}
      {!validation.isValid && data.objetivo_geral && (
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm font-medium text-accent-dark mb-2">Pendências:</p>
          <ul className="text-sm text-accent-dark list-disc list-inside space-y-1">
            {validation.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
