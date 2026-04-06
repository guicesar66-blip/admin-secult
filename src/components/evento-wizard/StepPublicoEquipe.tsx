import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Plus, Trash2, AlertCircle } from "lucide-react";
import { EventoWizardData, FAIXAS_ETARIAS_PUBLICO, MembroEquipeEvento, validateEventoStep7 } from "@/types/evento-wizard";

interface StepPublicoEquipeProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

const FUNCOES_PRODUCAO = ["Produtor(a) Geral", "Produtor(a) Executivo", "Assistente de Produção", "Diretor(a) de Palco", "Coordenador(a) de Área"];
const FUNCOES_TECNICA = ["Técnico de Som", "Técnico de Luz", "Técnico de Vídeo/Transmissão", "DJ/Sonoplasta", "Roadie/Backline", "Operador de Mesa"];
const FUNCOES_APOIO = ["Recepcionista/Credenciamento", "Segurança", "Brigadista", "Limpeza", "Bilheteria", "Intérprete de Libras"];

export function StepPublicoEquipe({ data, onChange }: StepPublicoEquipeProps) {
  const validation = validateEventoStep7(data);

  const handleAddMembro = (categoria: "producao" | "tecnica" | "apoio") => {
    const novo: MembroEquipeEvento = { id: `eq-${Date.now()}`, funcao: "", categoria, quantidade: 1, valor_unitario: 0, tipo_contratacao: "evento_completo", fonte: "terceirizada" };
    const key = categoria === "producao" ? "equipe_producao" : categoria === "tecnica" ? "equipe_tecnica" : "equipe_apoio";
    onChange({ [key]: [...data[key], novo] });
  };

  const handleUpdateMembro = (categoria: "producao" | "tecnica" | "apoio", id: string, updates: Partial<MembroEquipeEvento>) => {
    const key = categoria === "producao" ? "equipe_producao" : categoria === "tecnica" ? "equipe_tecnica" : "equipe_apoio";
    onChange({ [key]: data[key].map(m => m.id === id ? { ...m, ...updates } : m) });
  };

  const handleRemoveMembro = (categoria: "producao" | "tecnica" | "apoio", id: string) => {
    const key = categoria === "producao" ? "equipe_producao" : categoria === "tecnica" ? "equipe_tecnica" : "equipe_apoio";
    onChange({ [key]: data[key].filter(m => m.id !== id) });
  };

  const handleFaixaToggle = (faixa: string) => {
    const updated = data.faixas_etarias_publico.includes(faixa) ? data.faixas_etarias_publico.filter(f => f !== faixa) : [...data.faixas_etarias_publico, faixa];
    onChange({ faixas_etarias_publico: updated });
  };

  const renderEquipeSection = (titulo: string, categoria: "producao" | "tecnica" | "apoio", funcoes: string[], obrigatorio = false) => {
    const equipe = categoria === "producao" ? data.equipe_producao : categoria === "tecnica" ? data.equipe_tecnica : data.equipe_apoio;
    return (
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{titulo} {obrigatorio && <span className="text-destructive">*</span>}</h4>
            <Button type="button" variant="outline" size="sm" onClick={() => handleAddMembro(categoria)}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
          </div>
          {equipe.map(m => (
            <div key={m.id} className="flex gap-2 items-center">
              <Select value={m.funcao} onValueChange={v => handleUpdateMembro(categoria, m.id, { funcao: v })}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Função" /></SelectTrigger>
                <SelectContent>{funcoes.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="number" placeholder="Qtd" value={m.quantidade} onChange={e => handleUpdateMembro(categoria, m.id, { quantidade: parseInt(e.target.value) || 1 })} className="w-16" min={1} />
              <Input type="number" placeholder="R$" value={m.valor_unitario || ""} onChange={e => handleUpdateMembro(categoria, m.id, { valor_unitario: parseFloat(e.target.value) || 0 })} className="w-24" />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveMembro(categoria, m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-indigo-500/10"><Users className="h-6 w-6 text-indigo-600" /></div>
        <div><h2 className="text-xl font-semibold">Público e Equipe</h2><p className="text-muted-foreground mt-1">Defina o público esperado e a equipe necessária.</p></div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Público</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Público Esperado <span className="text-destructive">*</span></Label>
              <Input type="number" value={data.publico_esperado} onChange={e => onChange({ publico_esperado: parseInt(e.target.value) || 0 })} min={10} max={data.capacidade_local || 100000} />
              {data.capacidade_local && <p className="text-xs text-muted-foreground">Máximo: {data.capacidade_local} (capacidade do local)</p>}
            </div>
            <div className="space-y-2">
              <Label>Faixa Etária do Público <span className="text-destructive">*</span></Label>
              <div className="flex flex-wrap gap-2">{FAIXAS_ETARIAS_PUBLICO.map(f => <Badge key={f} variant={data.faixas_etarias_publico.includes(f) ? "default" : "outline"} className="cursor-pointer" onClick={() => handleFaixaToggle(f)}>{f}</Badge>)}</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Perfil do Público <span className="text-destructive">*</span></Label>
            <Textarea placeholder="Descreva o perfil do público esperado..." value={data.perfil_publico} onChange={e => onChange({ perfil_publico: e.target.value })} className="resize-none" maxLength={500} />
          </div>
        </CardContent>
      </Card>

      {renderEquipeSection("Equipe de Produção", "producao", FUNCOES_PRODUCAO, true)}
      {renderEquipeSection("Equipe Técnica", "tecnica", FUNCOES_TECNICA)}
      {renderEquipeSection("Equipe de Apoio", "apoio", FUNCOES_APOIO)}

      {data.publico_esperado > 500 && (
        <Alert className="bg-pe-yellow-lighter border-accent/30"><AlertCircle className="h-4 w-4 text-accent-dark" /><AlertDescription>Eventos com mais de 500 pessoas devem ter brigadista na equipe.</AlertDescription></Alert>
      )}

      {!validation.isValid && data.perfil_publico && (
        <Alert variant="destructive" className="bg-pe-red-lighter border-error/30"><AlertCircle className="h-4 w-4" /><AlertDescription><ul className="list-disc list-inside">{validation.errors.map((e, i) => <li key={i}>{e}</li>)}</ul></AlertDescription></Alert>
      )}
    </div>
  );
}
