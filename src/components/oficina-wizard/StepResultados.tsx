import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Trophy, Target, TrendingUp, Lightbulb } from "lucide-react";
import { OficinaWizardData, ResultadoQuantitativo, IndicadorSucesso } from "@/types/oficina-wizard";

interface StepResultadosProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

export function StepResultados({ data, onChange }: StepResultadosProps) {
  // Sugestões automáticas baseadas nos steps anteriores
  const sugestoesQuantitativas = [
    {
      descricao: `Formação de ${data.quantidade_participantes} participantes em ${data.linguagem_artistica || "artes"}`,
      meta_numerica: data.quantidade_participantes,
      unidade: "pessoas formadas",
    },
    {
      descricao: `Realização de ${data.etapas_encontros.length || 4} encontros/oficinas`,
      meta_numerica: data.etapas_encontros.length || 4,
      unidade: "encontros",
    },
    {
      descricao: `Criação de rede de artistas em ${data.territorios[0] || "territórios da RMR"}`,
      meta_numerica: data.quantidade_participantes,
      unidade: "artistas conectados",
    },
  ];

  const sugestoesIndicadores = [
    { indicador: "Taxa de conclusão", meta: "Pelo menos 80% dos participantes concluem a formação" },
    { indicador: "Satisfação", meta: "Nota média de satisfação acima de 4.0 (escala 1-5)" },
    { indicador: "Engajamento", meta: "Presença média de 90% nos encontros" },
    { indicador: "Produção", meta: "100% dos participantes contribuem para o produto final" },
  ];

  const addResultadoQuantitativo = (sugestao?: typeof sugestoesQuantitativas[0]) => {
    const novo: ResultadoQuantitativo = {
      id: crypto.randomUUID(),
      descricao: sugestao?.descricao || "",
      meta_numerica: sugestao?.meta_numerica || 0,
      unidade: sugestao?.unidade || "",
    };
    onChange({ resultados_quantitativos: [...data.resultados_quantitativos, novo] });
  };

  const updateResultadoQuantitativo = (id: string, updates: Partial<ResultadoQuantitativo>) => {
    const updated = data.resultados_quantitativos.map(r => r.id === id ? { ...r, ...updates } : r);
    onChange({ resultados_quantitativos: updated });
  };

  const removeResultadoQuantitativo = (id: string) => {
    onChange({ resultados_quantitativos: data.resultados_quantitativos.filter(r => r.id !== id) });
  };

  const addIndicador = (sugestao?: typeof sugestoesIndicadores[0]) => {
    const novo: IndicadorSucesso = {
      id: crypto.randomUUID(),
      indicador: sugestao?.indicador || "",
      meta: sugestao?.meta || "",
    };
    onChange({ indicadores_sucesso: [...data.indicadores_sucesso, novo] });
  };

  const updateIndicador = (id: string, updates: Partial<IndicadorSucesso>) => {
    const updated = data.indicadores_sucesso.map(i => i.id === id ? { ...i, ...updates } : i);
    onChange({ indicadores_sucesso: updated });
  };

  const removeIndicador = (id: string) => {
    onChange({ indicadores_sucesso: data.indicadores_sucesso.filter(i => i.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-6 w-6 text-accent-dark" />
          Resultados Esperados
        </h2>
        <p className="text-muted-foreground mt-1">
          Defina os resultados tangíveis e mensuráveis do projeto.
        </p>
      </div>

      {/* Sugestões */}
      {data.resultados_quantitativos.length === 0 && (
        <Card className="bg-accent/5 border-accent/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent-dark" />
              Sugestões baseadas no seu projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sugestoesQuantitativas.map((sugestao, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => addResultadoQuantitativo(sugestao)}
                  className="text-left h-auto py-2 px-3"
                >
                  <Plus className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate max-w-[250px]">{sugestao.descricao}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados Quantitativos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Resultados Quantitativos
            <Badge variant="secondary" className="font-normal">Mínimo 3</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Resultados mensuráveis com números e metas específicas.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.resultados_quantitativos.map((resultado, index) => (
            <div key={resultado.id} className="grid grid-cols-12 gap-3 p-4 rounded-lg bg-muted/30 items-end">
              <div className="col-span-6">
                <Label className="text-xs">Descrição do Resultado</Label>
                <Input
                  placeholder="Ex: Formação de 40 iniciantes em audiovisual"
                  value={resultado.descricao}
                  onChange={(e) => updateResultadoQuantitativo(resultado.id, { descricao: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Meta Numérica</Label>
                <Input
                  type="number"
                  min={1}
                  value={resultado.meta_numerica}
                  onChange={(e) => updateResultadoQuantitativo(resultado.id, { meta_numerica: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Unidade</Label>
                <Input
                  placeholder="Ex: pessoas, vídeos"
                  value={resultado.unidade}
                  onChange={(e) => updateResultadoQuantitativo(resultado.id, { unidade: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeResultadoQuantitativo(resultado.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={() => addResultadoQuantitativo()} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Resultado Quantitativo
          </Button>

          {data.resultados_quantitativos.length < 3 && (
            <p className="text-sm text-destructive">
              Adicione pelo menos 3 resultados quantitativos.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Resultados Qualitativos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Resultados Qualitativos
            <Badge variant="secondary" className="font-normal">Obrigatório</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Descreva os impactos não-numéricos esperados do projeto.
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Descreva os resultados qualitativos esperados. Exemplo:

• Fortalecimento da identidade cultural local através da valorização das expressões artísticas do território
• Criação de vínculos entre artistas de diferentes gerações e estilos
• Desenvolvimento de habilidades técnicas e criativas que podem gerar renda futura
• Ampliação do acesso à cultura em comunidades periféricas"
            value={data.resultados_qualitativos}
            onChange={(e) => onChange({ resultados_qualitativos: e.target.value })}
            rows={8}
            className="resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Mínimo 100 caracteres</span>
            <span className={data.resultados_qualitativos.length < 100 ? "text-destructive" : ""}>
              {data.resultados_qualitativos.length}/1000
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores de Sucesso */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Indicadores de Sucesso
            <Badge variant="secondary" className="font-normal">Mínimo 2</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Como você vai medir se o projeto foi bem-sucedido?
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Sugestões de indicadores */}
          {data.indicadores_sucesso.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {sugestoesIndicadores.map((sugestao, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => addIndicador(sugestao)}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" />
                  {sugestao.indicador}
                </Button>
              ))}
            </div>
          )}

          {data.indicadores_sucesso.map((indicador) => (
            <div key={indicador.id} className="grid grid-cols-12 gap-3 p-4 rounded-lg bg-muted/30 items-end">
              <div className="col-span-4">
                <Label className="text-xs">Indicador</Label>
                <Input
                  placeholder="Ex: Taxa de conclusão"
                  value={indicador.indicador}
                  onChange={(e) => updateIndicador(indicador.id, { indicador: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-7">
                <Label className="text-xs">Meta</Label>
                <Input
                  placeholder="Ex: Pelo menos 80% dos participantes concluem a formação"
                  value={indicador.meta}
                  onChange={(e) => updateIndicador(indicador.id, { meta: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIndicador(indicador.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={() => addIndicador()} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Indicador
          </Button>

          {data.indicadores_sucesso.length < 2 && (
            <p className="text-sm text-destructive">
              Adicione pelo menos 2 indicadores de sucesso.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dicas Finais */}
      <Card className="bg-success/5 border-success/30">
        <CardContent className="pt-4">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2 text-pe-green-dark">
            🎉 Você está quase lá!
          </h4>
          <p className="text-sm text-muted-foreground">
            Após preencher os resultados esperados, você poderá revisar todo o projeto e publicá-lo na vitrine de oportunidades para captação de recursos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
