import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Plus, Trash2, AlertCircle } from "lucide-react";
import { EventoWizardData, REGISTRO_DOCUMENTACAO, ResultadoQuantitativoEvento, IndicadorEvento, hasVagasParaArtistas, validateEventoStep10 } from "@/types/evento-wizard";

interface StepResultadosEventoProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepResultadosEvento({ data, onChange }: StepResultadosEventoProps) {
  const validation = validateEventoStep10(data);
  const temVagas = hasVagasParaArtistas(data);

  const handleAddResultado = () => {
    const novo: ResultadoQuantitativoEvento = { id: `res-${Date.now()}`, descricao: "", meta_numerica: 0, unidade: "" };
    onChange({ resultados_quantitativos: [...data.resultados_quantitativos, novo] });
  };

  const handleUpdateResultado = (id: string, updates: Partial<ResultadoQuantitativoEvento>) => {
    onChange({ resultados_quantitativos: data.resultados_quantitativos.map(r => r.id === id ? { ...r, ...updates } : r) });
  };

  const handleRemoveResultado = (id: string) => onChange({ resultados_quantitativos: data.resultados_quantitativos.filter(r => r.id !== id) });

  const handleAddIndicador = () => {
    const novo: IndicadorEvento = { id: `ind-${Date.now()}`, indicador: "", meta: "", forma_medicao: "" };
    onChange({ indicadores: [...data.indicadores, novo] });
  };

  const handleUpdateIndicador = (id: string, updates: Partial<IndicadorEvento>) => {
    onChange({ indicadores: data.indicadores.map(i => i.id === id ? { ...i, ...updates } : i) });
  };

  const handleRemoveIndicador = (id: string) => onChange({ indicadores: data.indicadores.filter(i => i.id !== id) });

  const handleRegistroToggle = (r: string) => {
    const updated = data.registro_documentacao.includes(r) ? data.registro_documentacao.filter(x => x !== r) : [...data.registro_documentacao, r];
    onChange({ registro_documentacao: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-accent/10"><Trophy className="h-6 w-6 text-accent-dark" /></div>
        <div><h2 className="text-xl font-semibold">Resultados Esperados</h2><p className="text-muted-foreground mt-1">Defina os resultados e impacto esperado do evento.</p></div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Resultados Quantitativos <span className="text-destructive">*</span></h3><Button type="button" variant="outline" size="sm" onClick={handleAddResultado}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button></div>
          <p className="text-sm text-muted-foreground">Adicione pelo menos 3 resultados mensuráveis</p>
          {data.resultados_quantitativos.map(r => (
            <div key={r.id} className="flex gap-2 items-center">
              <Input placeholder="Descrição" value={r.descricao} onChange={e => handleUpdateResultado(r.id, { descricao: e.target.value })} className="flex-1" />
              <Input type="number" placeholder="Meta" value={r.meta_numerica || ""} onChange={e => handleUpdateResultado(r.id, { meta_numerica: parseInt(e.target.value) || 0 })} className="w-24" />
              <Input placeholder="Unidade" value={r.unidade} onChange={e => handleUpdateResultado(r.id, { unidade: e.target.value })} className="w-32" />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveResultado(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label className="text-base font-medium">Resultados Qualitativos <span className="text-destructive">*</span></Label>
        <Textarea placeholder="Descreva os resultados qualitativos esperados..." value={data.resultados_qualitativos} onChange={e => onChange({ resultados_qualitativos: e.target.value })} className="min-h-[120px] resize-none" maxLength={1000} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={data.resultados_qualitativos.length < 100 ? "text-accent-dark" : "text-success"}>{data.resultados_qualitativos.length < 100 ? `Mínimo 100 (faltam ${100 - data.resultados_qualitativos.length})` : "✓ Mínimo atingido"}</span>
          <span>{data.resultados_qualitativos.length}/1000</span>
        </div>
      </div>

      {temVagas && (
        <div className="space-y-2">
          <Label className="text-base font-medium">Impacto para Artistas CENA <span className="text-destructive">*</span></Label>
          <Textarea placeholder="Descreva o impacto para os artistas da base CENA..." value={data.impacto_artistas_cena || ""} onChange={e => onChange({ impacto_artistas_cena: e.target.value })} className="resize-none" maxLength={500} />
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Registro e Documentação <span className="text-destructive">*</span></h3>
          <div className="grid grid-cols-2 gap-2">
            {REGISTRO_DOCUMENTACAO.map(r => (
              <div key={r} className="flex items-center space-x-2">
                <Checkbox id={r} checked={data.registro_documentacao.includes(r)} onCheckedChange={() => handleRegistroToggle(r)} />
                <label htmlFor={r} className="text-sm cursor-pointer">{r}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Indicadores de Impacto</h3><Button type="button" variant="outline" size="sm" onClick={handleAddIndicador}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button></div>
          {data.indicadores.map(i => (
            <div key={i.id} className="flex gap-2 items-center">
              <Input placeholder="Indicador" value={i.indicador} onChange={e => handleUpdateIndicador(i.id, { indicador: e.target.value })} className="flex-1" />
              <Input placeholder="Meta" value={i.meta} onChange={e => handleUpdateIndicador(i.id, { meta: e.target.value })} className="w-28" />
              <Input placeholder="Forma de medição" value={i.forma_medicao} onChange={e => handleUpdateIndicador(i.id, { forma_medicao: e.target.value })} className="flex-1" />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveIndicador(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {!validation.isValid && data.resultados_qualitativos && <Alert variant="destructive" className="bg-pe-red-lighter border-error/30"><AlertCircle className="h-4 w-4" /><AlertDescription><ul className="list-disc list-inside">{validation.errors.map((e, i) => <li key={i}>{e}</li>)}</ul></AlertDescription></Alert>}
    </div>
  );
}
