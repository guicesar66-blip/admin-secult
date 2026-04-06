import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Monitor, 
  Users, 
  Ticket, 
  AlertCircle,
  Plus,
  Trash2,
  Lightbulb,
} from "lucide-react";
import { 
  EventoWizardData, 
  TIPOS_ESPACO, 
  PLATAFORMAS_TRANSMISSAO,
  CLASSIFICACOES_ETARIAS,
  TipoIngresso,
  validateEventoStep2 
} from "@/types/evento-wizard";
import { TERRITORIOS_RMR } from "@/types/oficina-wizard";

interface StepDataLocalProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepDataLocal({ data, onChange }: StepDataLocalProps) {
  const validation = validateEventoStep2(data);
  const isPresencial = data.modalidade === "presencial" || data.modalidade === "hibrido";
  const isOnline = data.modalidade === "online" || data.modalidade === "hibrido";

  const handleAddTipoIngresso = () => {
    const novoTipo: TipoIngresso = {
      id: `ing-${Date.now()}`,
      nome: "",
      valor: 0,
    };
    onChange({ tipos_ingresso: [...data.tipos_ingresso, novoTipo] });
  };

  const handleRemoveTipoIngresso = (id: string) => {
    onChange({ tipos_ingresso: data.tipos_ingresso.filter(t => t.id !== id) });
  };

  const handleUpdateTipoIngresso = (id: string, updates: Partial<TipoIngresso>) => {
    onChange({
      tipos_ingresso: data.tipos_ingresso.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Data, Local e Formato</h2>
          <p className="text-muted-foreground mt-1">
            Defina quando, onde e como o evento acontecerá.
          </p>
        </div>
      </div>

      {/* SEÇÃO: QUANDO */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Quando</h3>
          </div>

          {/* Formato de Duração */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Formato de Duração <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={data.formato_duracao === "unico_dia" ? "default" : "outline"}
                onClick={() => onChange({ formato_duracao: "unico_dia" })}
                className="flex-1"
              >
                Único dia
              </Button>
              <Button
                type="button"
                variant={data.formato_duracao === "multiplos_dias" ? "default" : "outline"}
                onClick={() => onChange({ formato_duracao: "multiplos_dias" })}
                className="flex-1"
              >
                Múltiplos dias
              </Button>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            {data.formato_duracao === "unico_dia" ? (
              <div className="space-y-2 col-span-2">
                <Label>Data do Evento <span className="text-destructive">*</span></Label>
                <Input
                  type="date"
                  value={data.data_evento || ""}
                  onChange={(e) => onChange({ data_evento: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Data de Início <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={data.data_inicio || ""}
                    onChange={(e) => onChange({ data_inicio: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Término <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={data.data_fim || ""}
                    onChange={(e) => onChange({ data_fim: e.target.value })}
                    min={data.data_inicio || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </>
            )}
          </div>

          {/* Horários */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Horário de Início <span className="text-destructive">*</span></Label>
              <Input
                type="time"
                value={data.horario_inicio}
                onChange={(e) => onChange({ horario_inicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Horário de Término <span className="text-destructive">*</span></Label>
              <Input
                type="time"
                value={data.horario_termino}
                onChange={(e) => onChange({ horario_termino: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Abertura dos Portões</Label>
              <Input
                type="time"
                value={data.horario_abertura_portoes || ""}
                onChange={(e) => onChange({ horario_abertura_portoes: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO: ONDE */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Onde</h3>
          </div>

          {/* Modalidade */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Modalidade <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-4">
              {[
                { value: "presencial", label: "Presencial" },
                { value: "online", label: "Online" },
                { value: "hibrido", label: "Híbrido" },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={data.modalidade === opt.value ? "default" : "outline"}
                  onClick={() => onChange({ modalidade: opt.value as EventoWizardData["modalidade"] })}
                  className="flex-1"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Campos Presencial */}
          {isPresencial && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Local Físico
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Local <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Ex: Teatro Santa Isabel"
                    value={data.nome_local || ""}
                    onChange={(e) => onChange({ nome_local: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Espaço <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.tipo_espaco || ""}
                    onValueChange={(value) => onChange({ tipo_espaco: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_ESPACO.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Endereço Completo <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Rua, número, complemento"
                  value={data.endereco_completo || ""}
                  onChange={(e) => onChange({ endereco_completo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bairro <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.bairro || ""}
                    onValueChange={(value) => onChange({ bairro: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRITORIOS_RMR.map((bairro) => (
                        <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Capacidade <span className="text-destructive">*</span></Label>
                  <Input
                    type="number"
                    placeholder="Número de pessoas"
                    value={data.capacidade_local || ""}
                    onChange={(e) => onChange({ capacidade_local: parseInt(e.target.value) || 0 })}
                    min={10}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Campos Online */}
          {isOnline && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium flex items-center gap-2">
                <Monitor className="h-4 w-4" /> Transmissão Online
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Link da Transmissão <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="https://..."
                    value={data.link_transmissao || ""}
                    onChange={(e) => onChange({ link_transmissao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plataforma <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.plataforma_transmissao || ""}
                    onValueChange={(value) => onChange({ plataforma_transmissao: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATAFORMAS_TRANSMISSAO.map((plat) => (
                        <SelectItem key={plat} value={plat}>{plat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEÇÃO: FORMATO */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Formato e Ingressos</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Classificação Etária <span className="text-destructive">*</span></Label>
              <Select
                value={data.classificacao_etaria}
                onValueChange={(value) => onChange({ classificacao_etaria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSIFICACOES_ETARIAS.map((cl) => (
                    <SelectItem key={cl} value={cl}>{cl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Evento com Ingresso?</Label>
              <div className="flex items-center gap-3 pt-2">
                <Switch
                  checked={data.evento_com_ingresso}
                  onCheckedChange={(checked) => onChange({ evento_com_ingresso: checked })}
                />
                <span className="text-sm">
                  {data.evento_com_ingresso ? "Sim, evento pago" : "Não, entrada gratuita"}
                </span>
              </div>
            </div>
          </div>

          {data.evento_com_ingresso && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor Base do Ingresso <span className="text-destructive">*</span></Label>
                  <Input
                    type="number"
                    placeholder="R$ 0,00"
                    value={data.valor_ingresso || ""}
                    onChange={(e) => onChange({ valor_ingresso: parseFloat(e.target.value) || 0 })}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link de Venda</Label>
                  <Input
                    placeholder="https://sympla.com.br/..."
                    value={data.link_venda || ""}
                    onChange={(e) => onChange({ link_venda: e.target.value })}
                  />
                </div>
              </div>

              {/* Tipos de Ingresso */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Tipos de Ingresso (opcional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTipoIngresso}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" /> Adicionar
                  </Button>
                </div>

                {data.tipos_ingresso.map((tipo) => (
                  <div key={tipo.id} className="flex gap-2 items-center">
                    <Input
                      placeholder="Nome (ex: Meia-entrada)"
                      value={tipo.nome}
                      onChange={(e) => handleUpdateTipoIngresso(tipo.id, { nome: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Valor"
                      value={tipo.valor || ""}
                      onChange={(e) => handleUpdateTipoIngresso(tipo.id, { valor: parseFloat(e.target.value) || 0 })}
                      className="w-24"
                      min={0}
                      step={0.01}
                    />
                    <Input
                      type="number"
                      placeholder="Qtd"
                      value={tipo.quantidade_disponivel || ""}
                      onChange={(e) => handleUpdateTipoIngresso(tipo.id, { quantidade_disponivel: parseInt(e.target.value) || undefined })}
                      className="w-20"
                      min={1}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTipoIngresso(tipo.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!data.evento_com_ingresso && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-pe-green-lighter border border-success/30">
              <Badge className="bg-success">Entrada Gratuita</Badge>
              <span className="text-sm text-pe-green-dark">
                Este evento aparecerá com a tag "Gratuito" no app
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validação */}
      {!validation.isValid && data.modalidade && (
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
