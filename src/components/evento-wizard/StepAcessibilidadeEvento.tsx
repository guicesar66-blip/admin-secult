import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Accessibility, 
  AlertCircle,
  Lightbulb,
  Check,
} from "lucide-react";
import { 
  EventoWizardData, 
  RECURSOS_ACESSIBILIDADE_EVENTO,
  validateEventoStep6 
} from "@/types/evento-wizard";

interface StepAcessibilidadeEventoProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepAcessibilidadeEvento({ data, onChange }: StepAcessibilidadeEventoProps) {
  const validation = validateEventoStep6(data);

  const handleRecursoToggle = (recurso: string) => {
    const updated = data.recursos_acessibilidade.includes(recurso)
      ? data.recursos_acessibilidade.filter(r => r !== recurso)
      : [...data.recursos_acessibilidade, recurso];
    onChange({ recursos_acessibilidade: updated });
  };

  const handleMomentoLibrasToggle = (momento: string) => {
    const momentos = data.momentos_interpretacao_libras || [];
    const updated = momentos.includes(momento)
      ? momentos.filter(m => m !== momento)
      : [...momentos, momento];
    onChange({ momentos_interpretacao_libras: updated });
  };

  const isPresencial = data.modalidade === "presencial" || data.modalidade === "hibrido";
  const temLibras = data.recursos_acessibilidade.includes("Intérprete de Libras");

  const renderRecursoGroup = (titulo: string, recursos: readonly string[], icon: string) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm flex items-center gap-2">
        <span>{icon}</span> {titulo}
      </h4>
      <div className="space-y-2">
        {recursos.map((recurso) => {
          const isSelected = data.recursos_acessibilidade.includes(recurso);
          return (
            <div 
              key={recurso} 
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isSelected ? "bg-pe-green-lighter border border-success/30" : "hover:bg-muted/50"
              }`}
            >
              <Checkbox
                id={recurso}
                checked={isSelected}
                onCheckedChange={() => handleRecursoToggle(recurso)}
              />
              <label 
                htmlFor={recurso} 
                className={`text-sm cursor-pointer flex-1 ${isSelected ? "text-pe-green-dark font-medium" : ""}`}
              >
                {recurso}
              </label>
              {isSelected && <Check className="h-4 w-4 text-success" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-success/10">
          <Accessibility className="h-6 w-6 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Acessibilidade</h2>
          <p className="text-muted-foreground mt-1">
            Garanta que o evento seja inclusivo e acessível para todos.
          </p>
        </div>
      </div>

      {/* Alertas de Regras de Negócio */}
      {isPresencial && (
        <Alert className="bg-pe-green-lighter border-success/30">
          <Lightbulb className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-dark">
            Para eventos presenciais, recomenda-se pelo menos <strong>2 recursos de acessibilidade física</strong>.
          </AlertDescription>
        </Alert>
      )}

      {data.publico_esperado > 500 && (
        <Alert className="bg-pe-yellow-lighter border-accent/30">
          <AlertCircle className="h-4 w-4 text-accent-dark" />
          <AlertDescription className="text-pe-orange-dark">
            Eventos com mais de 500 pessoas devem ter no mínimo <strong>5 recursos de acessibilidade</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* Recursos de Acessibilidade */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recursos de Acessibilidade <span className="text-destructive">*</span></h3>
            <Badge variant="outline" className="text-success-dark border-success/40">
              {data.recursos_acessibilidade.length} selecionado(s)
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {renderRecursoGroup("Acessibilidade Física", RECURSOS_ACESSIBILIDADE_EVENTO.fisica, "🦽")}
            {renderRecursoGroup("Acessibilidade Comunicacional", RECURSOS_ACESSIBILIDADE_EVENTO.comunicacional, "💬")}
            {renderRecursoGroup("Acessibilidade Sensorial", RECURSOS_ACESSIBILIDADE_EVENTO.sensorial, "👁️")}
            {renderRecursoGroup("Acolhimento", RECURSOS_ACESSIBILIDADE_EVENTO.acolhimento, "🤝")}
          </div>
        </CardContent>
      </Card>

      {/* Momentos com Interpretação em Libras */}
      {temLibras && (
        <Card className="border-success/30 bg-pe-green-lighter/30">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold">Momentos com Interpretação em Libras <span className="text-destructive">*</span></h3>
            <p className="text-sm text-muted-foreground">
              Selecione em quais momentos haverá interpretação em Libras
            </p>
            
            <div className="space-y-2">
              {[
                "Durante todo o evento",
                "Apenas nas falas/apresentações",
                "Apenas nas informações de segurança",
              ].map((momento) => {
                const isSelected = (data.momentos_interpretacao_libras || []).includes(momento);
                return (
                  <div 
                    key={momento} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isSelected ? "bg-pe-green-light border border-success/40" : "bg-card border"
                    }`}
                  >
                    <Checkbox
                      id={momento}
                      checked={isSelected}
                      onCheckedChange={() => handleMomentoLibrasToggle(momento)}
                    />
                    <label htmlFor={momento} className="text-sm cursor-pointer flex-1">
                      {momento}
                    </label>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Descrição da Acessibilidade */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Descrição da Acessibilidade <span className="text-destructive">*</span>
        </Label>
        <Textarea
          placeholder="Descreva como o evento promoverá a acessibilidade e inclusão. Detalhe os recursos disponíveis e como o público poderá acessá-los..."
          value={data.descricao_acessibilidade}
          onChange={(e) => onChange({ descricao_acessibilidade: e.target.value })}
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={data.descricao_acessibilidade.length < 50 ? "text-accent-dark" : "text-success"}>
            {data.descricao_acessibilidade.length < 50 
              ? `Mínimo 50 caracteres (faltam ${50 - data.descricao_acessibilidade.length})`
              : "✓ Mínimo atingido"
            }
          </span>
          <span>{data.descricao_acessibilidade.length}/500</span>
        </div>
      </div>

      {/* Dicas */}
      <Card className="border-success/30 bg-pe-green-lighter/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-success mt-0.5" />
            <div className="text-sm text-success-dark space-y-2">
              <p className="font-medium">Dicas para um evento mais inclusivo:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Comunique os recursos de acessibilidade na divulgação</li>
                <li>Treine a equipe para atendimento inclusivo</li>
                <li>Disponibilize um canal para solicitações especiais</li>
                <li>Sinalize claramente os recursos no local do evento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validação */}
      {!validation.isValid && data.recursos_acessibilidade.length > 0 && (
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
