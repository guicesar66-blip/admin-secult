import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Radio, Video, Camera, Mic, Newspaper } from "lucide-react";
import { OficinaWizardData, COBERTURA_EVENTO, ParceriaMidia } from "@/types/oficina-wizard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepPlanoMidiaProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

const COBERTURA_ICONS: Record<string, React.ReactNode> = {
  "Transmissão ao vivo": <Video className="h-4 w-4" />,
  "Fotos profissionais": <Camera className="h-4 w-4" />,
  "Vídeo documentário": <Video className="h-4 w-4" />,
  "Podcast/áudio": <Mic className="h-4 w-4" />,
  "Release para imprensa": <Newspaper className="h-4 w-4" />,
};

export function StepPlanoMidia({ data, onChange }: StepPlanoMidiaProps) {
  const handleCoberturaToggle = (item: string, checked: boolean) => {
    const updated = checked
      ? [...data.cobertura_evento, item]
      : data.cobertura_evento.filter(c => c !== item);
    onChange({ cobertura_evento: updated });
  };

  const addParceriaMidia = () => {
    const novaParceria: ParceriaMidia = {
      id: crypto.randomUUID(),
      nome: "",
      tipo_parceria: "",
    };
    onChange({ parcerias_midia: [...data.parcerias_midia, novaParceria] });
  };

  const updateParceriaMidia = (id: string, updates: Partial<ParceriaMidia>) => {
    const updated = data.parcerias_midia.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    onChange({ parcerias_midia: updated });
  };

  const removeParceriaMidia = (id: string) => {
    onChange({ parcerias_midia: data.parcerias_midia.filter(p => p.id !== id) });
  };

  const showTransmissaoWarning = data.cobertura_evento.includes("Transmissão ao vivo");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Radio className="h-6 w-6 text-amber-600" />
          Plano de Mídia
        </h2>
        <p className="text-muted-foreground mt-1">
          Detalhe a estratégia de comunicação antes, durante e depois do projeto.
        </p>
      </div>

      {/* Estratégia de Campanha */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Estratégia de Campanha
            <Badge variant="secondary" className="font-normal">Obrigatório</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Descreva a estratégia de comunicação em três fases: pré-evento, durante e pós-evento.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Descreva sua estratégia de mídia. Exemplo:
            
PRÉ-EVENTO: Campanha de teaser nas redes sociais 30 dias antes, com countdown e conteúdos sobre o tema.

DURANTE: Stories ao vivo, cobertura fotográfica e depoimentos dos participantes.

PÓS-EVENTO: Publicação do vídeo documentário, galeria de fotos e resultados alcançados."
            value={data.estrategia_campanha}
            onChange={(e) => onChange({ estrategia_campanha: e.target.value })}
            rows={8}
            className="resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Mínimo 100 caracteres</span>
            <span className={data.estrategia_campanha.length < 100 ? "text-destructive" : ""}>
              {data.estrategia_campanha.length}/1000
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Parcerias de Mídia */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Parcerias de Mídia
            <Badge variant="outline" className="font-normal">Opcional</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Adicione veículos de comunicação ou influenciadores parceiros do projeto.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.parcerias_midia.map((parceria, index) => (
            <div key={parceria.id} className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Parceria {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParceriaMidia(parceria.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Nome do Veículo/Parceiro</Label>
                  <Input
                    placeholder="Ex: Rádio Comunitária XYZ"
                    value={parceria.nome}
                    onChange={(e) => updateParceriaMidia(parceria.id, { nome: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tipo de Parceria</Label>
                  <Input
                    placeholder="Ex: Divulgação de spots"
                    value={parceria.tipo_parceria}
                    onChange={(e) => updateParceriaMidia(parceria.id, { tipo_parceria: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Contato (opcional)</Label>
                  <Input
                    placeholder="Email ou telefone"
                    value={parceria.contato || ""}
                    onChange={(e) => updateParceriaMidia(parceria.id, { contato: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addParceriaMidia} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Parceria de Mídia
          </Button>
        </CardContent>
      </Card>

      {/* Cobertura do Evento Final */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Cobertura do Evento Final
            <Badge variant="outline" className="font-normal">Opcional</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecione os tipos de cobertura previstos para o evento de encerramento ou apresentação final.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COBERTURA_EVENTO.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={data.cobertura_evento.includes(item)}
                  onCheckedChange={(checked) => handleCoberturaToggle(item, !!checked)}
                />
                <span className="text-muted-foreground">
                  {COBERTURA_ICONS[item]}
                </span>
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>

          {showTransmissaoWarning && (
            <Alert className="mt-4 border-blue-500/50 bg-blue-500/10">
              <Video className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                A transmissão ao vivo será incluída automaticamente nos custos do projeto (Step 10).
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
