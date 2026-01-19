import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, Users, Calendar, UserCheck, AlertCircle, Lightbulb } from "lucide-react";
import { OficinaWizardData, MembroEquipe } from "@/types/oficina-wizard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepPublicoCronogramaProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

export function StepPublicoCronograma({ data, onChange }: StepPublicoCronogramaProps) {
  // Cálculo de grupos
  const numGrupos = Math.ceil(data.quantidade_participantes / data.tamanho_grupos);
  
  // Sugestão de instrutores (1 para cada 20 participantes)
  const instrutoresSugeridos = Math.ceil(data.quantidade_participantes / 20);
  const instrutoresAtuais = data.equipe_instrutores.reduce((acc, m) => acc + m.quantidade, 0);

  const addMembroEquipe = (tipo: "instrutores" | "apoio") => {
    const novoMembro: MembroEquipe = {
      id: crypto.randomUUID(),
      funcao: "",
      quantidade: 1,
      valor_por_pessoa: 0,
    };
    if (tipo === "instrutores") {
      onChange({ equipe_instrutores: [...data.equipe_instrutores, novoMembro] });
    } else {
      onChange({ equipe_apoio: [...data.equipe_apoio, novoMembro] });
    }
  };

  const updateMembroEquipe = (tipo: "instrutores" | "apoio", id: string, updates: Partial<MembroEquipe>) => {
    if (tipo === "instrutores") {
      const updated = data.equipe_instrutores.map(m => m.id === id ? { ...m, ...updates } : m);
      onChange({ equipe_instrutores: updated });
    } else {
      const updated = data.equipe_apoio.map(m => m.id === id ? { ...m, ...updates } : m);
      onChange({ equipe_apoio: updated });
    }
  };

  const removeMembroEquipe = (tipo: "instrutores" | "apoio", id: string) => {
    if (tipo === "instrutores") {
      onChange({ equipe_instrutores: data.equipe_instrutores.filter(m => m.id !== id) });
    } else {
      onChange({ equipe_apoio: data.equipe_apoio.filter(m => m.id !== id) });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-amber-600" />
          Público e Cronograma
        </h2>
        <p className="text-muted-foreground mt-1">
          Defina o público-alvo, quantidade de participantes e cronograma detalhado.
        </p>
      </div>

      {/* Público-Alvo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Público-Alvo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Quantidade de Participantes</Label>
              <Input
                type="number"
                min={5}
                max={500}
                value={data.quantidade_participantes}
                onChange={(e) => onChange({ quantidade_participantes: parseInt(e.target.value) || 5 })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Mínimo 5, máximo 500</p>
            </div>
            <div>
              <Label>Tamanho dos Grupos</Label>
              <Input
                type="number"
                min={2}
                max={20}
                value={data.tamanho_grupos}
                onChange={(e) => onChange({ tamanho_grupos: parseInt(e.target.value) || 5 })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                = {numGrupos} grupo{numGrupos !== 1 ? "s" : ""} de {data.tamanho_grupos} pessoas
              </p>
            </div>
          </div>

          <div>
            <Label>Faixa Etária</Label>
            <div className="mt-4 px-2">
              <Slider
                value={[data.faixa_etaria_min, data.faixa_etaria_max]}
                onValueChange={([min, max]) => onChange({ faixa_etaria_min: min, faixa_etaria_max: max })}
                min={6}
                max={80}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{data.faixa_etaria_min} anos</span>
                <span>{data.faixa_etaria_max} anos</span>
              </div>
            </div>
          </div>

          <div>
            <Label>Perfil do Participante <Badge variant="secondary" className="ml-2 font-normal">Obrigatório</Badge></Label>
            <Textarea
              placeholder="Descreva o perfil ideal dos participantes. Ex: 'Jovens e adultos interessados em audiovisual, com ou sem experiência prévia, moradores da RMR...'"
              value={data.perfil_participante}
              onChange={(e) => onChange({ perfil_participante: e.target.value })}
              rows={3}
              className="mt-1 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {data.perfil_participante.length}/500 caracteres
            </p>
          </div>

          <div>
            <Label>Pré-requisitos <Badge variant="outline" className="ml-2 font-normal">Opcional</Badge></Label>
            <Textarea
              placeholder="Ex: 'Ter celular com câmera', 'Saber ler e escrever', 'Disponibilidade nos sábados'"
              value={data.prerequisitos || ""}
              onChange={(e) => onChange({ prerequisitos: e.target.value })}
              rows={2}
              className="mt-1 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Equipe */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Equipe do Projeto</CardTitle>
          {instrutoresAtuais < instrutoresSugeridos && (
            <Alert className="mt-2 border-amber-500/50 bg-amber-500/10">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                Sugestão: Para {data.quantidade_participantes} participantes, recomendamos pelo menos {instrutoresSugeridos} instrutor{instrutoresSugeridos > 1 ? "es" : ""}.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instrutores */}
          <div>
            <Label className="flex items-center gap-2">
              Instrutores/Facilitadores
              <Badge variant="secondary" className="font-normal">Obrigatório</Badge>
            </Label>
            <div className="space-y-3 mt-3">
              {data.equipe_instrutores.map((membro) => (
                <div key={membro.id} className="grid grid-cols-12 gap-3 p-3 rounded-lg bg-muted/30 items-end">
                  <div className="col-span-5">
                    <Label className="text-xs">Função</Label>
                    <Input
                      placeholder="Ex: Instrutor de Audiovisual"
                      value={membro.funcao}
                      onChange={(e) => updateMembroEquipe("instrutores", membro.id, { funcao: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Quantidade</Label>
                    <Input
                      type="number"
                      min={1}
                      value={membro.quantidade}
                      onChange={(e) => updateMembroEquipe("instrutores", membro.id, { quantidade: parseInt(e.target.value) || 1 })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label className="text-xs">Valor por Pessoa (R$)</Label>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Cachê total"
                      value={membro.valor_por_pessoa || ""}
                      onChange={(e) => updateMembroEquipe("instrutores", membro.id, { valor_por_pessoa: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMembroEquipe("instrutores", membro.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addMembroEquipe("instrutores")} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Instrutor
              </Button>
            </div>
          </div>

          {/* Equipe de Apoio */}
          <div>
            <Label className="flex items-center gap-2">
              Equipe de Apoio
              <Badge variant="outline" className="font-normal">Opcional</Badge>
            </Label>
            <div className="space-y-3 mt-3">
              {data.equipe_apoio.map((membro) => (
                <div key={membro.id} className="grid grid-cols-12 gap-3 p-3 rounded-lg bg-muted/30 items-end">
                  <div className="col-span-5">
                    <Label className="text-xs">Função</Label>
                    <Input
                      placeholder="Ex: Produtor, Assistente"
                      value={membro.funcao}
                      onChange={(e) => updateMembroEquipe("apoio", membro.id, { funcao: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Quantidade</Label>
                    <Input
                      type="number"
                      min={1}
                      value={membro.quantidade}
                      onChange={(e) => updateMembroEquipe("apoio", membro.id, { quantidade: parseInt(e.target.value) || 1 })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label className="text-xs">Valor por Pessoa (R$)</Label>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Cachê total"
                      value={membro.valor_por_pessoa || ""}
                      onChange={(e) => updateMembroEquipe("apoio", membro.id, { valor_por_pessoa: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMembroEquipe("apoio", membro.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addMembroEquipe("apoio")} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Apoio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cronograma */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Cronograma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Período de Inscrições <Badge variant="secondary" className="ml-2 font-normal">Obrigatório</Badge></Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label className="text-xs text-muted-foreground">Início</Label>
                  <Input
                    type="date"
                    value={data.periodo_inscricoes_inicio || ""}
                    onChange={(e) => onChange({ periodo_inscricoes_inicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fim</Label>
                  <Input
                    type="date"
                    value={data.periodo_inscricoes_fim || ""}
                    onChange={(e) => onChange({ periodo_inscricoes_fim: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Período das Oficinas <Badge variant="secondary" className="ml-2 font-normal">Obrigatório</Badge></Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label className="text-xs text-muted-foreground">Início</Label>
                  <Input
                    type="date"
                    value={data.periodo_oficinas_inicio || ""}
                    onChange={(e) => onChange({ periodo_oficinas_inicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fim</Label>
                  <Input
                    type="date"
                    value={data.periodo_oficinas_fim || ""}
                    onChange={(e) => onChange({ periodo_oficinas_fim: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Período de Produção <Badge variant="outline" className="ml-2 font-normal">Opcional</Badge></Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label className="text-xs text-muted-foreground">Início</Label>
                  <Input
                    type="date"
                    value={data.periodo_producao_inicio || ""}
                    onChange={(e) => onChange({ periodo_producao_inicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fim</Label>
                  <Input
                    type="date"
                    value={data.periodo_producao_fim || ""}
                    onChange={(e) => onChange({ periodo_producao_fim: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Data do Evento Final <Badge variant="outline" className="ml-2 font-normal">Opcional</Badge></Label>
              <Input
                type="date"
                value={data.data_evento_final || ""}
                onChange={(e) => onChange({ data_evento_final: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {data.periodo_oficinas_inicio && data.periodo_inscricoes_fim && 
           new Date(data.periodo_oficinas_inicio) < new Date(data.periodo_inscricoes_fim) && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                O período das oficinas deve começar após o fim das inscrições.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
