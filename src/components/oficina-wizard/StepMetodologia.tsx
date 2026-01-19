import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  OficinaWizardData, 
  EtapaEncontro,
  MODALIDADES,
  validateStep4 
} from "@/types/oficina-wizard";
import { BookOpen, Plus, Trash2, Clock, MapPin, Lightbulb } from "lucide-react";

interface StepMetodologiaProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

const MODALIDADE_LABELS = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Híbrido",
};

export function StepMetodologia({ data, onChange }: StepMetodologiaProps) {
  const validation = validateStep4(data);
  const charCount = data.metodologia_descricao?.length || 0;
  const [novaEtapa, setNovaEtapa] = useState<Omit<EtapaEncontro, "id">>({
    titulo: "",
    descricao: "",
    duracao_horas: 2,
    modalidade: data.modalidade || "presencial",
  });

  const handleAddEtapa = () => {
    if (!novaEtapa.titulo.trim()) return;
    
    const etapa: EtapaEncontro = {
      id: crypto.randomUUID(),
      ...novaEtapa,
    };

    onChange({ etapas_encontros: [...data.etapas_encontros, etapa] });
    setNovaEtapa({
      titulo: "",
      descricao: "",
      duracao_horas: 2,
      modalidade: data.modalidade || "presencial",
    });
  };

  const handleRemoveEtapa = (id: string) => {
    onChange({ 
      etapas_encontros: data.etapas_encontros.filter(e => e.id !== id) 
    });
  };

  const totalHoras = data.etapas_encontros.reduce((acc, e) => acc + e.duracao_horas, 0);

  const showLocalFields = data.modalidade === "presencial" || data.modalidade === "hibrido";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <BookOpen className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Step 4: Metodologia</h2>
          <p className="text-sm text-muted-foreground">
            Descrever COMO o projeto será executado na prática
          </p>
        </div>
      </div>

      {/* Modalidade */}
      <div className="space-y-2">
        <Label htmlFor="modalidade" className="flex items-center gap-2">
          Modalidade <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.modalidade}
          onValueChange={(value: typeof MODALIDADES[number]) => onChange({ modalidade: value })}
        >
          <SelectTrigger id="modalidade">
            <SelectValue placeholder="Selecione a modalidade" />
          </SelectTrigger>
          <SelectContent>
            {MODALIDADES.map((mod) => (
              <SelectItem key={mod} value={mod}>
                {MODALIDADE_LABELS[mod]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Descrição da Metodologia */}
      <div className="space-y-2">
        <Label htmlFor="metodologia_descricao" className="flex items-center gap-2">
          Descrição da Metodologia <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Descreva como será o formato: tipo de atividades (práticas, teóricas), dinâmicas, produção coletiva, etc.
        </p>
        <Textarea
          id="metodologia_descricao"
          value={data.metodologia_descricao}
          onChange={(e) => onChange({ metodologia_descricao: e.target.value })}
          placeholder="Descreva detalhadamente a metodologia que será utilizada na oficina..."
          className="min-h-[150px] resize-none"
          maxLength={2000}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mínimo 200 caracteres</span>
          <span className={charCount < 200 ? "text-amber-600" : charCount > 2000 ? "text-destructive" : "text-green-600"}>
            {charCount}/2000
          </span>
        </div>
      </div>

      {/* Local (condicional) */}
      {showLocalFields && (
        <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Local das Atividades</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="local">
              Nome do Local <span className="text-destructive">*</span>
            </Label>
            <Input
              id="local"
              value={data.local || ""}
              onChange={(e) => onChange({ local: e.target.value })}
              placeholder="Ex: Centro Cultural Casa Amarela"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço Completo</Label>
            <Input
              id="endereco"
              value={data.endereco_completo || ""}
              onChange={(e) => onChange({ endereco_completo: e.target.value })}
              placeholder="Ex: Rua da Moeda, 140 - Recife Antigo"
            />
          </div>
        </div>
      )}

      {/* Etapas/Encontros */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            Etapas/Encontros ({data.etapas_encontros.length}) <span className="text-destructive">*</span>
          </Label>
          {data.etapas_encontros.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Total: {totalHoras}h
            </div>
          )}
        </div>

        {data.etapas_encontros.length === 0 ? (
          <div className="p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
            <p className="text-muted-foreground">
              Nenhuma etapa adicionada. Adicione pelo menos uma etapa/encontro.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.etapas_encontros.map((etapa, index) => (
              <Card key={etapa.id} className="group">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{etapa.titulo}</p>
                        {etapa.descricao && (
                          <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {etapa.duracao_horas}h • {MODALIDADE_LABELS[etapa.modalidade]}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEtapa(etapa.id)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Adicionar nova etapa */}
        {data.etapas_encontros.length < 20 && (
          <div className="p-4 rounded-lg border bg-muted/30">
            <Label className="text-sm font-medium mb-3 block">Adicionar nova etapa</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={novaEtapa.titulo}
                onChange={(e) => setNovaEtapa({ ...novaEtapa, titulo: e.target.value })}
                placeholder="Título da etapa (obrigatório)"
              />
              <Input
                value={novaEtapa.descricao || ""}
                onChange={(e) => setNovaEtapa({ ...novaEtapa, descricao: e.target.value })}
                placeholder="Descrição (opcional)"
              />
              <div className="flex items-center gap-2">
                <Label htmlFor="duracao" className="text-sm whitespace-nowrap">Duração (h):</Label>
                <Input
                  id="duracao"
                  type="number"
                  min={1}
                  max={8}
                  value={novaEtapa.duracao_horas}
                  onChange={(e) => setNovaEtapa({ ...novaEtapa, duracao_horas: parseInt(e.target.value) || 2 })}
                  className="w-20"
                />
              </div>
              <Select
                value={novaEtapa.modalidade}
                onValueChange={(value: typeof MODALIDADES[number]) => setNovaEtapa({ ...novaEtapa, modalidade: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODALIDADES.map((mod) => (
                    <SelectItem key={mod} value={mod}>
                      {MODALIDADE_LABELS[mod]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAddEtapa}
              disabled={!novaEtapa.titulo.trim()}
              className="gap-2 mt-3"
              variant="secondary"
            >
              <Plus className="h-4 w-4" />
              Adicionar Etapa
            </Button>
          </div>
        )}
      </div>

      {/* Validação visual */}
      {!validation.isValid && (data.metodologia_descricao || data.etapas_encontros.length > 0) && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm font-medium text-amber-700 mb-2">Pendências:</p>
          <ul className="text-sm text-amber-600 list-disc list-inside space-y-1">
            {validation.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
