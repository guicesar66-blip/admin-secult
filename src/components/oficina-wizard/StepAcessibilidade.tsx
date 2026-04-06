import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Accessibility, AlertCircle, Heart, Users } from "lucide-react";
import { OficinaWizardData, RECURSOS_ACESSIBILIDADE } from "@/types/oficina-wizard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepAcessibilidadeProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

const RECURSO_ICONS: Record<string, string> = {
  "Legendas em português nos materiais": "📝",
  "Intérprete de Libras nos encontros": "🤟",
  "Audiodescrição": "🔊",
  "Espaço físico acessível (rampa, banheiro adaptado)": "♿",
  "Materiais em linguagem simples": "📖",
  "Materiais em braile": "⠿",
  "Apoio individual para participantes com dificuldades": "🤝",
};

export function StepAcessibilidade({ data, onChange }: StepAcessibilidadeProps) {
  const handleRecursoToggle = (recurso: string, checked: boolean) => {
    const updated = checked
      ? [...data.recursos_acessibilidade, recurso]
      : data.recursos_acessibilidade.filter(r => r !== recurso);
    onChange({ recursos_acessibilidade: updated });
  };

  const isPresencial = data.modalidade === "presencial" || data.modalidade === "hibrido";
  const showLibrasWarning = data.recursos_acessibilidade.includes("Intérprete de Libras nos encontros");
  const showEspacoObrigatorio = isPresencial && !data.recursos_acessibilidade.includes("Espaço físico acessível (rampa, banheiro adaptado)");
  const showMinimoRecursos = data.quantidade_participantes > 20 && data.recursos_acessibilidade.length < 3;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Accessibility className="h-6 w-6 text-accent-dark" />
          Acessibilidade e Acolhimento
        </h2>
        <p className="text-muted-foreground mt-1">
          Garanta que o projeto seja inclusivo e acessível a todos os participantes.
        </p>
      </div>

      {/* Alertas de Regras de Negócio */}
      {showEspacoObrigatorio && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            Para projetos presenciais ou híbridos, o espaço físico acessível é obrigatório.
          </AlertDescription>
        </Alert>
      )}

      {showMinimoRecursos && (
        <Alert className="border-accent/50 bg-accent/10">
          <AlertCircle className="h-4 w-4 text-accent-dark" />
          <AlertDescription className="text-pe-orange-dark">
            Projetos com mais de 20 participantes devem ter pelo menos 3 recursos de acessibilidade.
          </AlertDescription>
        </Alert>
      )}

      {/* Recursos de Acessibilidade */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Recursos de Acessibilidade
            <Badge variant="secondary" className="font-normal">Obrigatório</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecione pelo menos um recurso que será disponibilizado no projeto.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {RECURSOS_ACESSIBILIDADE.map((recurso) => {
              const isEspacoFisico = recurso === "Espaço físico acessível (rampa, banheiro adaptado)";
              const isRequired = isEspacoFisico && isPresencial;
              
              return (
                <label
                  key={recurso}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    data.recursos_acessibilidade.includes(recurso)
                      ? "bg-accent/10 border-accent/30"
                      : "hover:bg-muted/50"
                  } ${isRequired && !data.recursos_acessibilidade.includes(recurso) ? "border-destructive/50" : ""}`}
                >
                  <Checkbox
                    checked={data.recursos_acessibilidade.includes(recurso)}
                    onCheckedChange={(checked) => handleRecursoToggle(recurso, !!checked)}
                  />
                  <span className="text-xl">{RECURSO_ICONS[recurso]}</span>
                  <div className="flex-1">
                    <span className="text-sm">{recurso}</span>
                    {isRequired && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        Obrigatório para presencial
                      </Badge>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {showLibrasWarning && (
            <Alert className="mt-4 border-primary/50 bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-pe-blue-dark">
                O custo de intérprete de Libras será sugerido automaticamente na planilha de custos (Step 10).
              </AlertDescription>
            </Alert>
          )}

          {data.recursos_acessibilidade.length === 0 && (
            <p className="text-sm text-destructive">
              Selecione pelo menos um recurso de acessibilidade.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Descrição do Acolhimento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Descrição do Acolhimento
            <Badge variant="secondary" className="font-normal">Obrigatório</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Descreva como será o acolhimento dos participantes, especialmente aqueles com necessidades específicas.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Descreva como será realizado o acolhimento. Exemplo: 'Os participantes serão recebidos por uma equipe de apoio que identificará necessidades específicas. Haverá um momento de acolhida no início de cada encontro para criar um ambiente seguro e inclusivo...'"
            value={data.descricao_acolhimento}
            onChange={(e) => onChange({ descricao_acolhimento: e.target.value })}
            rows={5}
            className="resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Mínimo 50 caracteres</span>
            <span className={data.descricao_acolhimento.length < 50 ? "text-destructive" : ""}>
              {data.descricao_acolhimento.length}/500
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Dicas */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-4">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            💡 Dicas para um projeto mais inclusivo
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Divulgue o projeto em formatos acessíveis (áudio, texto simples)</li>
            <li>• Tenha um canal de comunicação para participantes informarem necessidades</li>
            <li>• Preveja tempo extra para atividades que exijam adaptações</li>
            <li>• Capacite a equipe para atendimento inclusivo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
