import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  OficinaWizardData, 
  ObjetivoEspecifico,
  validateStep3 
} from "@/types/oficina-wizard";
import { ListChecks, Plus, Trash2, GripVertical, Lightbulb } from "lucide-react";

interface StepObjetivosEspecificosProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

const EMOJIS = ["🎯", "🎥", "🎭", "🎵", "🎨", "📚", "🎪", "💡", "🌟", "🚀"];

export function StepObjetivosEspecificos({ data, onChange }: StepObjetivosEspecificosProps) {
  const validation = validateStep3(data);
  const [novoObjetivo, setNovoObjetivo] = useState({ titulo: "", descricao: "" });

  const handleAddObjetivo = () => {
    if (!novoObjetivo.titulo.trim()) return;
    
    const objetivo: ObjetivoEspecifico = {
      id: crypto.randomUUID(),
      titulo: novoObjetivo.titulo.trim(),
      descricao: novoObjetivo.descricao.trim() || undefined,
      emoji: EMOJIS[data.objetivos_especificos.length % EMOJIS.length],
    };

    onChange({ 
      objetivos_especificos: [...data.objetivos_especificos, objetivo] 
    });
    setNovoObjetivo({ titulo: "", descricao: "" });
  };

  const handleRemoveObjetivo = (id: string) => {
    onChange({ 
      objetivos_especificos: data.objetivos_especificos.filter(o => o.id !== id) 
    });
  };

  const handleUpdateObjetivo = (id: string, updates: Partial<ObjetivoEspecifico>) => {
    onChange({
      objetivos_especificos: data.objetivos_especificos.map(o => 
        o.id === id ? { ...o, ...updates } : o
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <ListChecks className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Step 3: Objetivos Específicos</h2>
          <p className="text-sm text-muted-foreground">
            Detalhar as metas específicas que compõem o objetivo geral
          </p>
        </div>
      </div>

      {/* Dicas */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-700">Dicas:</p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Cada objetivo específico deve ser uma ação concreta e verificável</li>
              <li>• Mínimo de 3 e máximo de 10 objetivos</li>
              <li>• Exemplo: "Introduzir conceitos básicos de roteiro, filmagem e edição"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lista de objetivos */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          Objetivos Específicos ({data.objetivos_especificos.length}/10)
          <span className="text-destructive">*</span>
        </Label>

        {data.objetivos_especificos.length === 0 ? (
          <div className="p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center">
            <p className="text-muted-foreground">
              Nenhum objetivo adicionado ainda. Adicione pelo menos 3 objetivos.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.objetivos_especificos.map((objetivo, index) => (
              <Card key={objetivo.id} className="group">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="h-4 w-4 cursor-grab" />
                      <span className="text-lg">{objetivo.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        value={objetivo.titulo}
                        onChange={(e) => handleUpdateObjetivo(objetivo.id, { titulo: e.target.value })}
                        className="font-medium border-none shadow-none p-0 h-auto focus-visible:ring-0"
                        placeholder="Título do objetivo"
                        maxLength={100}
                      />
                      {objetivo.descricao && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {objetivo.descricao}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveObjetivo(objetivo.id)}
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
      </div>

      {/* Formulário para adicionar novo objetivo */}
      {data.objetivos_especificos.length < 10 && (
        <div className="p-4 rounded-lg border bg-muted/30">
          <Label className="text-sm font-medium mb-3 block">Adicionar novo objetivo</Label>
          <div className="space-y-3">
            <Input
              value={novoObjetivo.titulo}
              onChange={(e) => setNovoObjetivo({ ...novoObjetivo, titulo: e.target.value })}
              placeholder="Título do objetivo específico (obrigatório)"
              maxLength={100}
            />
            <Textarea
              value={novoObjetivo.descricao}
              onChange={(e) => setNovoObjetivo({ ...novoObjetivo, descricao: e.target.value })}
              placeholder="Descrição adicional (opcional)"
              className="min-h-[60px] resize-none"
              maxLength={300}
            />
            <Button
              onClick={handleAddObjetivo}
              disabled={!novoObjetivo.titulo.trim()}
              className="gap-2"
              variant="secondary"
            >
              <Plus className="h-4 w-4" />
              Adicionar Objetivo
            </Button>
          </div>
        </div>
      )}

      {/* Validação visual */}
      {!validation.isValid && (
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
