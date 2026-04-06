import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Music, 
  Plus, 
  Trash2, 
  AlertCircle,
  User,
  Users,
  Clock,
  DollarSign,
  Lightbulb,
} from "lucide-react";
import { 
  EventoWizardData, 
  LINGUAGENS_ARTISTICAS_EVENTO,
  Atracao,
  Palco,
  validateEventoStep3 
} from "@/types/evento-wizard";

interface StepProgramacaoProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepProgramacao({ data, onChange }: StepProgramacaoProps) {
  const validation = validateEventoStep3(data);

  const handleAddAtracao = () => {
    const novaAtracao: Atracao = {
      id: `atr-${Date.now()}`,
      tipo: "confirmada",
      linguagem: data.linguagem_principal || "",
      descricao: "",
      horario_inicio: "",
      horario_fim: "",
      duracao_minutos: 60,
    };
    onChange({ atracoes: [...data.atracoes, novaAtracao] });
  };

  const handleRemoveAtracao = (id: string) => {
    onChange({ atracoes: data.atracoes.filter(a => a.id !== id) });
  };

  const handleUpdateAtracao = (id: string, updates: Partial<Atracao>) => {
    onChange({
      atracoes: data.atracoes.map(a => 
        a.id === id ? { ...a, ...updates } : a
      ),
    });
  };

  const handleAddPalco = () => {
    const novoPalco: Palco = {
      id: `palco-${Date.now()}`,
      nome: "",
      atracoes: [],
    };
    onChange({ palcos: [...data.palcos, novoPalco] });
  };

  const handleRemovePalco = (id: string) => {
    onChange({ palcos: data.palcos.filter(p => p.id !== id) });
  };

  const handleUpdatePalco = (id: string, updates: Partial<Palco>) => {
    onChange({
      palcos: data.palcos.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const handleAddAtracaoToPalco = (palcoId: string) => {
    const novaAtracao: Atracao = {
      id: `atr-${Date.now()}`,
      tipo: "confirmada",
      linguagem: data.linguagem_principal || "",
      descricao: "",
      horario_inicio: "",
      horario_fim: "",
      duracao_minutos: 60,
      palco_area: palcoId,
    };
    
    onChange({
      palcos: data.palcos.map(p => 
        p.id === palcoId 
          ? { ...p, atracoes: [...p.atracoes, novaAtracao] } 
          : p
      ),
    });
  };

  const handleRemoveAtracaoFromPalco = (palcoId: string, atracaoId: string) => {
    onChange({
      palcos: data.palcos.map(p => 
        p.id === palcoId 
          ? { ...p, atracoes: p.atracoes.filter(a => a.id !== atracaoId) } 
          : p
      ),
    });
  };

  const handleUpdateAtracaoInPalco = (palcoId: string, atracaoId: string, updates: Partial<Atracao>) => {
    onChange({
      palcos: data.palcos.map(p => 
        p.id === palcoId 
          ? { ...p, atracoes: p.atracoes.map(a => a.id === atracaoId ? { ...a, ...updates } : a) } 
          : p
      ),
    });
  };

  const renderAtracaoCard = (
    atracao: Atracao, 
    onUpdate: (updates: Partial<Atracao>) => void,
    onRemove: () => void
  ) => (
    <Card key={atracao.id} className="border-l-4 border-l-primary">
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { value: "confirmada", label: "Confirmada", icon: User },
              { value: "a_contratar_cena", label: "Contratar via CENA", icon: Users },
              { value: "a_definir", label: "A Definir", icon: Clock },
            ].map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant={atracao.tipo === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate({ tipo: opt.value as Atracao["tipo"] })}
                className={atracao.tipo === opt.value ? "bg-primary-dark" : ""}
              >
                <opt.icon className="h-3 w-3 mr-1" />
                {opt.label}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {atracao.tipo === "confirmada" && (
            <div className="space-y-2">
              <Label>Nome do Artista/Grupo <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Nome da atração"
                value={atracao.nome || ""}
                onChange={(e) => onUpdate({ nome: e.target.value })}
              />
            </div>
          )}

          {atracao.tipo === "a_contratar_cena" && (
            <div className="space-y-2">
              <Label>Perfil Desejado <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Ex: Banda de forró, DJ de música eletrônica..."
                value={atracao.perfil_desejado || ""}
                onChange={(e) => onUpdate({ perfil_desejado: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Linguagem Artística <span className="text-destructive">*</span></Label>
            <Select
              value={atracao.linguagem}
              onValueChange={(value) => onUpdate({ linguagem: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {LINGUAGENS_ARTISTICAS_EVENTO.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descrição (máx. 300 caracteres)</Label>
          <Textarea
            placeholder="Breve descrição da apresentação..."
            value={atracao.descricao}
            onChange={(e) => onUpdate({ descricao: e.target.value })}
            maxLength={300}
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Início</Label>
            <Input
              type="time"
              value={atracao.horario_inicio}
              onChange={(e) => onUpdate({ horario_inicio: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Término</Label>
            <Input
              type="time"
              value={atracao.horario_fim}
              onChange={(e) => onUpdate({ horario_fim: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Duração (min)</Label>
            <Input
              type="number"
              value={atracao.duracao_minutos}
              onChange={(e) => onUpdate({ duracao_minutos: parseInt(e.target.value) || 0 })}
              min={1}
            />
          </div>

          {atracao.tipo === "a_contratar_cena" && (
            <>
              <div className="space-y-2">
                <Label>Cachê (R$) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={atracao.cache_previsto || ""}
                  onChange={(e) => onUpdate({ cache_previsto: parseFloat(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </>
          )}
        </div>

        {atracao.tipo === "a_contratar_cena" && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 border border-primary/30">
            <div className="space-y-1">
              <Label>Quantidade de Vagas</Label>
              <Input
                type="number"
                value={atracao.quantidade_vagas || 1}
                onChange={(e) => onUpdate({ quantidade_vagas: parseInt(e.target.value) || 1 })}
                min={1}
                className="w-20"
              />
            </div>
            <div className="flex-1 text-sm text-pe-blue-dark">
              <Users className="h-4 w-4 inline mr-1" />
              Esta vaga aparecerá como oportunidade de trabalho para artistas da base CENA
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Music className="h-6 w-6 text-pe-blue-dark" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Programação e Atrações</h2>
          <p className="text-muted-foreground mt-1">
            Defina a estrutura da programação e as atrações do evento.
          </p>
        </div>
      </div>

      {/* Dica */}
      <Card className="border-primary/30 bg-neutral-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-pe-blue-dark mt-0.5" />
            <div className="text-sm text-pe-blue-dark">
              <p className="font-medium">Tipos de Atração:</p>
              <ul className="mt-1 space-y-1">
                <li><strong>Confirmada:</strong> Artista já definido</li>
                <li><strong>Contratar via CENA:</strong> Vaga aberta para artistas da base (aparece como oportunidade de trabalho)</li>
                <li><strong>A Definir:</strong> Slot reservado, artista será definido depois</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estrutura da Programação */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Estrutura da Programação <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-4">
          {[
            { value: "atracao_unica", label: "Atração Única" },
            { value: "multiplas_atracoes", label: "Múltiplas Atrações" },
            { value: "por_palco", label: "Por Palco/Área" },
          ].map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant={data.estrutura_programacao === opt.value ? "default" : "outline"}
              onClick={() => onChange({ estrutura_programacao: opt.value as EventoWizardData["estrutura_programacao"] })}
              className="flex-1"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Atrações (não por palco) */}
      {data.estrutura_programacao !== "por_palco" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Atrações</h3>
            <Button
              type="button"
              onClick={handleAddAtracao}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Adicionar Atração
            </Button>
          </div>

          {data.atracoes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma atração adicionada</p>
                <p className="text-sm">Clique em "Adicionar Atração" para começar</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {data.atracoes.map((atracao) => 
                renderAtracaoCard(
                  atracao,
                  (updates) => handleUpdateAtracao(atracao.id, updates),
                  () => handleRemoveAtracao(atracao.id)
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Palcos */}
      {data.estrutura_programacao === "por_palco" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Palcos/Áreas</h3>
            <Button
              type="button"
              onClick={handleAddPalco}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Adicionar Palco
            </Button>
          </div>

          {data.palcos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Nenhum palco adicionado</p>
                <p className="text-sm">Adicione pelo menos 2 palcos/áreas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {data.palcos.map((palco) => (
                <Card key={palco.id} className="border-2">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="Nome do Palco (ex: Palco Principal)"
                        value={palco.nome}
                        onChange={(e) => handleUpdatePalco(palco.id, { nome: e.target.value })}
                        className="flex-1 font-semibold"
                      />
                      <Input
                        type="number"
                        placeholder="Capacidade"
                        value={palco.capacidade || ""}
                        onChange={(e) => handleUpdatePalco(palco.id, { capacidade: parseInt(e.target.value) || undefined })}
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePalco(palco.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="pl-4 border-l-2 border-primary/30 space-y-4">
                      {palco.atracoes.map((atracao) => 
                        renderAtracaoCard(
                          atracao,
                          (updates) => handleUpdateAtracaoInPalco(palco.id, atracao.id, updates),
                          () => handleRemoveAtracaoFromPalco(palco.id, atracao.id)
                        )
                      )}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddAtracaoToPalco(palco.id)}
                        className="w-full gap-2"
                      >
                        <Plus className="h-4 w-4" /> Adicionar Atração a este Palco
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Validação */}
      {!validation.isValid && data.estrutura_programacao && (
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
