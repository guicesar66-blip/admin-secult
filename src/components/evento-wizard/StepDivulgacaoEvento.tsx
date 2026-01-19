import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  AlertCircle,
  Calendar,
  Image,
  Lightbulb,
} from "lucide-react";
import { 
  EventoWizardData, 
  CANAIS_DIVULGACAO_EVENTO,
  FaseDivulgacao,
  MarcaEvento,
  validateEventoStep5 
} from "@/types/evento-wizard";

interface StepDivulgacaoEventoProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepDivulgacaoEvento({ data, onChange }: StepDivulgacaoEventoProps) {
  const validation = validateEventoStep5(data);

  const handleCanalToggle = (canal: string) => {
    const updated = data.canais_divulgacao.includes(canal)
      ? data.canais_divulgacao.filter(c => c !== canal)
      : [...data.canais_divulgacao, canal];
    onChange({ canais_divulgacao: updated });
  };

  const handleAddFase = () => {
    const novaFase: FaseDivulgacao = {
      id: `fase-${Date.now()}`,
      nome: "",
      data_inicio: "",
      data_fim: "",
      acoes: "",
      canais: [],
    };
    onChange({ fases_divulgacao: [...data.fases_divulgacao, novaFase] });
  };

  const handleRemoveFase = (id: string) => {
    onChange({ fases_divulgacao: data.fases_divulgacao.filter(f => f.id !== id) });
  };

  const handleUpdateFase = (id: string, updates: Partial<FaseDivulgacao>) => {
    onChange({
      fases_divulgacao: data.fases_divulgacao.map(f => 
        f.id === id ? { ...f, ...updates } : f
      ),
    });
  };

  const handleAddMarca = () => {
    const novaMarca: MarcaEvento = {
      id: `marca-${Date.now()}`,
      nome: "",
      tipo: "apoio",
      posicao_destaque: data.marcas.length + 1,
    };
    onChange({ marcas: [...data.marcas, novaMarca] });
  };

  const handleRemoveMarca = (id: string) => {
    onChange({ marcas: data.marcas.filter(m => m.id !== id) });
  };

  const handleUpdateMarca = (id: string, updates: Partial<MarcaEvento>) => {
    onChange({
      marcas: data.marcas.map(m => 
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-pink-500/10">
          <Megaphone className="h-6 w-6 text-pink-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Divulgação e Comunicação</h2>
          <p className="text-muted-foreground mt-1">
            Planeje as ações de divulgação do evento e uso de marcas.
          </p>
        </div>
      </div>

      {/* Canais de Divulgação */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">Canais de Divulgação <span className="text-destructive">*</span></h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CANAIS_DIVULGACAO_EVENTO.map((canal) => (
              <div key={canal} className="flex items-center space-x-2">
                <Checkbox
                  id={canal}
                  checked={data.canais_divulgacao.includes(canal)}
                  onCheckedChange={() => handleCanalToggle(canal)}
                />
                <label htmlFor={canal} className="text-sm cursor-pointer">
                  {canal}
                </label>
              </div>
            ))}
          </div>

          {data.canais_divulgacao.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {data.canais_divulgacao.map((canal) => (
                <Badge key={canal} variant="secondary" className="bg-pink-100 text-pink-700">
                  {canal}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cronograma de Divulgação */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-600" />
              <h3 className="font-semibold">Cronograma de Divulgação <span className="text-destructive">*</span></h3>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddFase} className="gap-1">
              <Plus className="h-4 w-4" /> Adicionar Fase
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ⚠️ A primeira fase de divulgação deve começar pelo menos 14 dias antes do evento
          </p>

          {data.fases_divulgacao.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Nenhuma fase de divulgação adicionada</p>
              <p className="text-sm">Ex: "Lançamento", "Contagem Regressiva", "Dia do Evento"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.fases_divulgacao.map((fase, index) => (
                <Card key={fase.id} className="border-l-4 border-l-pink-500">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Fase {index + 1}</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFase(fase.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da Fase</Label>
                        <Input
                          placeholder="Ex: Lançamento"
                          value={fase.nome}
                          onChange={(e) => handleUpdateFase(fase.id, { nome: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data Início</Label>
                        <Input
                          type="date"
                          value={fase.data_inicio}
                          onChange={(e) => handleUpdateFase(fase.id, { data_inicio: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data Fim</Label>
                        <Input
                          type="date"
                          value={fase.data_fim}
                          onChange={(e) => handleUpdateFase(fase.id, { data_fim: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição das Ações</Label>
                      <Textarea
                        placeholder="Descreva as ações de divulgação desta fase..."
                        value={fase.acoes}
                        onChange={(e) => handleUpdateFase(fase.id, { acoes: e.target.value })}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Canais Utilizados</Label>
                      <div className="flex flex-wrap gap-2">
                        {data.canais_divulgacao.map((canal) => {
                          const isSelected = fase.canais.includes(canal);
                          return (
                            <Badge
                              key={canal}
                              variant={isSelected ? "default" : "outline"}
                              className={`cursor-pointer ${isSelected ? "bg-pink-600" : ""}`}
                              onClick={() => {
                                const updated = isSelected
                                  ? fase.canais.filter(c => c !== canal)
                                  : [...fase.canais, canal];
                                handleUpdateFase(fase.id, { canais: updated });
                              }}
                            >
                              {canal}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marcas e Logos */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-pink-600" />
              <h3 className="font-semibold">Marcas e Logos</h3>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddMarca} className="gap-1">
              <Plus className="h-4 w-4" /> Adicionar Marca
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            A marca CENA será automaticamente incluída como "Apoio" na publicação
          </p>

          {data.marcas.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Nenhuma marca adicionada (além do CENA)</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.marcas.map((marca) => (
                <div key={marca.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Input
                    placeholder="Nome da marca"
                    value={marca.nome}
                    onChange={(e) => handleUpdateMarca(marca.id, { nome: e.target.value })}
                    className="flex-1"
                  />
                  <Select
                    value={marca.tipo}
                    onValueChange={(value) => handleUpdateMarca(marca.id, { tipo: value as MarcaEvento["tipo"] })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realizacao">Realização</SelectItem>
                      <SelectItem value="patrocinio_master">Patrocínio Master</SelectItem>
                      <SelectItem value="patrocinio">Patrocínio</SelectItem>
                      <SelectItem value="apoio">Apoio</SelectItem>
                      <SelectItem value="apoio_cultural">Apoio Cultural</SelectItem>
                      <SelectItem value="parceria_midia">Parceria de Mídia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Posição"
                    value={marca.posicao_destaque}
                    onChange={(e) => handleUpdateMarca(marca.id, { posicao_destaque: parseInt(e.target.value) || 1 })}
                    className="w-20"
                    min={1}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMarca(marca.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validação */}
      {!validation.isValid && data.canais_divulgacao.length > 0 && (
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
