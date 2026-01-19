import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building, AlertCircle } from "lucide-react";
import { EventoWizardData, ESTRUTURAS_EVENTO, ALVARAS_EVENTO, validateEventoStep9 } from "@/types/evento-wizard";

interface StepInfraestruturaProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepInfraestrutura({ data, onChange }: StepInfraestruturaProps) {
  const validation = validateEventoStep9(data);

  const handleEstruturaToggle = (e: string) => {
    const updated = data.estruturas_necessarias.includes(e) ? data.estruturas_necessarias.filter(x => x !== e) : [...data.estruturas_necessarias, e];
    onChange({ estruturas_necessarias: updated });
  };

  const handleAlvaraToggle = (a: string) => {
    const updated = data.alvaras_necessarios.includes(a) ? data.alvaras_necessarios.filter(x => x !== a) : [...data.alvaras_necessarios, a];
    onChange({ alvaras_necessarios: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-slate-500/10"><Building className="h-6 w-6 text-slate-600" /></div>
        <div><h2 className="text-xl font-semibold">Infraestrutura e Logística</h2><p className="text-muted-foreground mt-1">Detalhe a estrutura física e logística necessária.</p></div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Estruturas Necessárias</h3>
          <div className="grid grid-cols-3 gap-2">
            {ESTRUTURAS_EVENTO.map(e => (
              <div key={e} className="flex items-center space-x-2">
                <Checkbox id={e} checked={data.estruturas_necessarias.includes(e)} onCheckedChange={() => handleEstruturaToggle(e)} />
                <label htmlFor={e} className="text-sm cursor-pointer">{e}</label>
              </div>
            ))}
          </div>
          {data.estruturas_necessarias.length > 0 && (
            <div className="space-y-2">
              <Label>Detalhamento das Estruturas</Label>
              <Textarea placeholder="Detalhe as especificações das estruturas..." value={data.detalhamento_estrutura || ""} onChange={e => onChange({ detalhamento_estrutura: e.target.value })} className="resize-none" maxLength={1000} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Logística</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Horário de Montagem <span className="text-destructive">*</span></Label><Input type="datetime-local" value={data.horario_montagem || ""} onChange={e => onChange({ horario_montagem: e.target.value })} /></div>
            <div className="space-y-2"><Label>Horário de Desmontagem <span className="text-destructive">*</span></Label><Input type="datetime-local" value={data.horario_desmontagem || ""} onChange={e => onChange({ horario_desmontagem: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Necessidades de Camarim</Label><Textarea placeholder="Rider de camarim..." value={data.necessidades_camarim || ""} onChange={e => onChange({ necessidades_camarim: e.target.value })} className="resize-none" maxLength={500} /></div>
            <div className="space-y-2"><Label>Estacionamento</Label><Select value={data.estacionamento || ""} onValueChange={v => onChange({ estacionamento: v as any })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="disponivel">Disponível</SelectItem><SelectItem value="nao_disponivel">Não disponível</SelectItem><SelectItem value="pago">Pago</SelectItem></SelectContent></Select></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Documentação</h3>
          <div className="space-y-3">
            <Label>Alvarás Necessários</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALVARAS_EVENTO.map(a => (
                <div key={a} className="flex items-center space-x-2">
                  <Checkbox id={a} checked={data.alvaras_necessarios.includes(a)} onCheckedChange={() => handleAlvaraToggle(a)} />
                  <label htmlFor={a} className="text-sm cursor-pointer">{a}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2"><Label>Responsável pela Documentação <span className="text-destructive">*</span></Label><Input placeholder="Nome do responsável" value={data.responsavel_documentacao} onChange={e => onChange({ responsavel_documentacao: e.target.value })} /></div>
        </CardContent>
      </Card>

      {data.publico_esperado > 1000 && !data.alvaras_necessarios.includes("Auto de Vistoria do Corpo de Bombeiros (AVCB)") && (
        <Alert className="bg-amber-50 border-amber-200"><AlertCircle className="h-4 w-4 text-amber-600" /><AlertDescription>Eventos com mais de 1000 pessoas devem ter AVCB.</AlertDescription></Alert>
      )}

      {!validation.isValid && data.responsavel_documentacao && <Alert variant="destructive" className="bg-red-50 border-red-200"><AlertCircle className="h-4 w-4" /><AlertDescription><ul className="list-disc list-inside">{validation.errors.map((e, i) => <li key={i}>{e}</li>)}</ul></AlertDescription></Alert>}
    </div>
  );
}
