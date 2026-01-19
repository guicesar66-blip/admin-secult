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
  Users, 
  Plus, 
  Trash2, 
  AlertCircle,
  Briefcase,
  Calendar,
  Lightbulb,
  Star,
} from "lucide-react";
import { 
  EventoWizardData, 
  LINGUAGENS_ARTISTICAS_EVENTO,
  CRITERIOS_SELECAO,
  PROCESSOS_SELECAO,
  VagaArtista,
  hasVagasParaArtistas,
  validateEventoStep4 
} from "@/types/evento-wizard";

interface StepVagasArtistasProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepVagasArtistas({ data, onChange }: StepVagasArtistasProps) {
  const validation = validateEventoStep4(data);
  const temVagas = hasVagasParaArtistas(data);

  const handleAddVaga = () => {
    const novaVaga: VagaArtista = {
      id: `vaga-${Date.now()}`,
      titulo: "",
      linguagem: data.linguagem_principal || "",
      quantidade: 1,
      cache_por_apresentacao: 0,
      duracao_apresentacao: 60,
      requisitos: "",
      equipamentos_fornecidos: [],
      equipamentos_artista_traz: [],
    };
    onChange({ vagas_artistas: [...data.vagas_artistas, novaVaga] });
  };

  const handleRemoveVaga = (id: string) => {
    onChange({ vagas_artistas: data.vagas_artistas.filter(v => v.id !== id) });
  };

  const handleUpdateVaga = (id: string, updates: Partial<VagaArtista>) => {
    onChange({
      vagas_artistas: data.vagas_artistas.map(v => 
        v.id === id ? { ...v, ...updates } : v
      ),
    });
  };

  const handleCriterioToggle = (criterio: string) => {
    const updated = data.criterios_selecao.includes(criterio)
      ? data.criterios_selecao.filter(c => c !== criterio)
      : [...data.criterios_selecao, criterio];
    onChange({ criterios_selecao: updated });
  };

  // Se não tem vagas para artistas CENA, mostra mensagem
  if (!temVagas) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <Users className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Vagas para Artistas CENA</h2>
            <p className="text-muted-foreground mt-1">
              Detalhe as oportunidades de trabalho para artistas da base CENA.
            </p>
          </div>
        </div>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Nenhuma vaga para artistas CENA definida.</strong>
            <p className="mt-1">
              Para criar oportunidades de trabalho, volte ao passo anterior (Programação) e 
              adicione atrações do tipo "Contratar via CENA".
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10">
          <Users className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Vagas para Artistas CENA</h2>
          <p className="text-muted-foreground mt-1">
            Detalhe as oportunidades de trabalho para artistas da base CENA.
          </p>
        </div>
      </div>

      {/* Info */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">As vagas definidas aqui aparecerão no Superapp como oportunidades de trabalho!</p>
              <p className="mt-1">Artistas com perfil compatível receberão notificações push sobre estas vagas.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descrição Geral */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Descrição Geral das Vagas <span className="text-destructive">*</span>
        </Label>
        <Textarea
          placeholder="Descreva o contexto geral das oportunidades: o que os artistas podem esperar, benefícios, ambiente de trabalho..."
          value={data.descricao_geral_vagas}
          onChange={(e) => onChange({ descricao_geral_vagas: e.target.value })}
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={data.descricao_geral_vagas.length < 100 ? "text-amber-600" : "text-green-600"}>
            {data.descricao_geral_vagas.length < 100 
              ? `Mínimo 100 caracteres (faltam ${100 - data.descricao_geral_vagas.length})`
              : "✓ Mínimo atingido"
            }
          </span>
          <span>{data.descricao_geral_vagas.length}/500</span>
        </div>
      </div>

      {/* Lista de Vagas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Vagas Disponíveis</h3>
          <Button type="button" onClick={handleAddVaga} className="gap-2">
            <Plus className="h-4 w-4" /> Adicionar Vaga
          </Button>
        </div>

        {data.vagas_artistas.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma vaga detalhada</p>
              <p className="text-sm">Adicione informações detalhadas sobre cada vaga</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.vagas_artistas.map((vaga) => (
              <Card key={vaga.id} className="border-l-4 border-l-amber-500">
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-amber-700 border-amber-300">
                      Vaga para Artista CENA
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVaga(vaga.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título da Vaga <span className="text-destructive">*</span></Label>
                      <Input
                        placeholder="Ex: Banda de Forró, Artista Visual, DJ..."
                        value={vaga.titulo}
                        onChange={(e) => handleUpdateVaga(vaga.id, { titulo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Linguagem Artística</Label>
                      <Select
                        value={vaga.linguagem}
                        onValueChange={(value) => handleUpdateVaga(vaga.id, { linguagem: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LINGUAGENS_ARTISTICAS_EVENTO.map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Quantidade de Vagas</Label>
                      <Input
                        type="number"
                        value={vaga.quantidade}
                        onChange={(e) => handleUpdateVaga(vaga.id, { quantidade: parseInt(e.target.value) || 1 })}
                        min={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cachê por Apresentação (R$)</Label>
                      <Input
                        type="number"
                        value={vaga.cache_por_apresentacao || ""}
                        onChange={(e) => handleUpdateVaga(vaga.id, { cache_por_apresentacao: parseFloat(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duração (minutos)</Label>
                      <Input
                        type="number"
                        value={vaga.duracao_apresentacao}
                        onChange={(e) => handleUpdateVaga(vaga.id, { duracao_apresentacao: parseInt(e.target.value) || 60 })}
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Requisitos <span className="text-destructive">*</span></Label>
                    <Textarea
                      placeholder="Descreva os requisitos necessários para a vaga..."
                      value={vaga.requisitos}
                      onChange={(e) => handleUpdateVaga(vaga.id, { requisitos: e.target.value })}
                      className="resize-none"
                      maxLength={500}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Diferenciais (opcional)</Label>
                    <Textarea
                      placeholder="O que será valorizado na seleção..."
                      value={vaga.diferenciais || ""}
                      onChange={(e) => handleUpdateVaga(vaga.id, { diferenciais: e.target.value })}
                      className="resize-none"
                      maxLength={300}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Período de Inscrições */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold">Período de Inscrições</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={data.periodo_inscricoes_inicio || ""}
                onChange={(e) => onChange({ periodo_inscricoes_inicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Término <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={data.periodo_inscricoes_fim || ""}
                onChange={(e) => onChange({ periodo_inscricoes_fim: e.target.value })}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            ⚠️ O período de inscrições deve terminar pelo menos 7 dias antes do evento
          </p>
        </CardContent>
      </Card>

      {/* Critérios e Processo de Seleção */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Critérios e Processo de Seleção</h3>

          <div className="space-y-3">
            <Label>Critérios de Seleção <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-2 gap-2">
              {CRITERIOS_SELECAO.map((criterio) => (
                <div key={criterio} className="flex items-center space-x-2">
                  <Checkbox
                    id={criterio}
                    checked={data.criterios_selecao.includes(criterio)}
                    onCheckedChange={() => handleCriterioToggle(criterio)}
                  />
                  <label htmlFor={criterio} className="text-sm cursor-pointer">
                    {criterio}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Processo de Seleção <span className="text-destructive">*</span></Label>
            <Select
              value={data.processo_selecao}
              onValueChange={(value) => onChange({ processo_selecao: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o processo" />
              </SelectTrigger>
              <SelectContent>
                {PROCESSOS_SELECAO.map((proc) => (
                  <SelectItem key={proc} value={proc}>{proc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Validação */}
      {!validation.isValid && data.descricao_geral_vagas && (
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
