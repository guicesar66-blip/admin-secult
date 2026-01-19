import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Plus, Trash2, AlertCircle } from "lucide-react";
import { EventoWizardData, CATEGORIAS_CUSTO_EVENTO, ItemCustoEvento, FonteReceita, gerarItensCustoAutomaticos, validateEventoStep8 } from "@/types/evento-wizard";
import { useEffect } from "react";

interface StepCustosEventoProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepCustosEvento({ data, onChange }: StepCustosEventoProps) {
  const validation = validateEventoStep8(data);

  useEffect(() => {
    if (data.itens_custo.filter(i => i.fonte === "automatico").length === 0) {
      const itensAuto = gerarItensCustoAutomaticos(data);
      if (itensAuto.length > 0) onChange({ itens_custo: [...itensAuto, ...data.itens_custo.filter(i => i.fonte === "manual")] });
    }
  }, []);

  const handleAddItem = () => {
    const novo: ItemCustoEvento = { id: `custo-${Date.now()}`, item: "", categoria: "outros", quantidade: 1, valor_unitario: 0, total: 0, fonte: "manual" };
    onChange({ itens_custo: [...data.itens_custo, novo] });
  };

  const handleUpdateItem = (id: string, updates: Partial<ItemCustoEvento>) => {
    onChange({
      itens_custo: data.itens_custo.map(i => {
        if (i.id !== id) return i;
        const updated = { ...i, ...updates };
        updated.total = updated.quantidade * updated.valor_unitario;
        return updated;
      })
    });
  };

  const handleRemoveItem = (id: string) => onChange({ itens_custo: data.itens_custo.filter(i => i.id !== id) });

  const handleAddReceita = () => {
    const nova: FonteReceita = { id: `rec-${Date.now()}`, fonte: "outro", descricao: "", valor_estimado: 0 };
    onChange({ fontes_receita: [...data.fontes_receita, nova] });
  };

  const handleUpdateReceita = (id: string, updates: Partial<FonteReceita>) => onChange({ fontes_receita: data.fontes_receita.map(r => r.id === id ? { ...r, ...updates } : r) });
  const handleRemoveReceita = (id: string) => onChange({ fontes_receita: data.fontes_receita.filter(r => r.id !== id) });

  const totalCustos = data.itens_custo.reduce((acc, i) => acc + i.total, 0);
  const totalReceitas = data.fontes_receita.reduce((acc, r) => acc + r.valor_estimado, 0);
  const reservaTecnica = totalCustos * (data.reserva_tecnica_percentual / 100);

  useEffect(() => { onChange({ orcamento_total: totalCustos + reservaTecnica }); }, [totalCustos, reservaTecnica]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-green-500/10"><DollarSign className="h-6 w-6 text-green-600" /></div>
        <div><h2 className="text-xl font-semibold">Planilha de Custos</h2><p className="text-muted-foreground mt-1">Consolide todos os custos do evento.</p></div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Itens de Custo</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
          </div>
          <div className="space-y-2">
            {data.itens_custo.map(item => (
              <div key={item.id} className={`flex gap-2 items-center p-2 rounded ${item.fonte === "automatico" ? "bg-blue-50" : ""}`}>
                <Input placeholder="Item" value={item.item} onChange={e => handleUpdateItem(item.id, { item: e.target.value })} className="flex-1" disabled={item.fonte === "automatico"} />
                <Select value={item.categoria} onValueChange={v => handleUpdateItem(item.id, { categoria: v as any })} disabled={item.fonte === "automatico"}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIAS_CUSTO_EVENTO.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" value={item.quantidade} onChange={e => handleUpdateItem(item.id, { quantidade: parseInt(e.target.value) || 1 })} className="w-16" min={1} />
                <Input type="number" value={item.valor_unitario || ""} onChange={e => handleUpdateItem(item.id, { valor_unitario: parseFloat(e.target.value) || 0 })} className="w-24" placeholder="R$" />
                <span className="w-24 text-right font-medium">R$ {item.total.toLocaleString()}</span>
                {item.fonte === "manual" && <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-4 border-t">
            <Label>Reserva Técnica (%)</Label>
            <Input type="number" value={data.reserva_tecnica_percentual} onChange={e => onChange({ reserva_tecnica_percentual: parseFloat(e.target.value) || 0 })} className="w-20" min={0} max={20} />
            <span className="text-muted-foreground">= R$ {reservaTecnica.toLocaleString()}</span>
          </div>
          <div className="flex justify-end text-lg font-bold">Total: R$ {(totalCustos + reservaTecnica).toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            <Switch checked={data.incluir_receitas} onCheckedChange={c => onChange({ incluir_receitas: c })} />
            <Label>Incluir Receitas</Label>
          </div>
          {data.incluir_receitas && (
            <>
              <div className="flex items-center justify-between"><h4 className="font-medium">Fontes de Receita</h4><Button type="button" variant="outline" size="sm" onClick={handleAddReceita}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button></div>
              {data.fontes_receita.map(r => (
                <div key={r.id} className="flex gap-2 items-center">
                  <Select value={r.fonte} onValueChange={v => handleUpdateReceita(r.id, { fonte: v as any })}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bilheteria">Bilheteria</SelectItem><SelectItem value="patrocinio">Patrocínio</SelectItem><SelectItem value="edital">Edital</SelectItem><SelectItem value="bar">Bar</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent></Select>
                  <Input placeholder="Descrição" value={r.descricao} onChange={e => handleUpdateReceita(r.id, { descricao: e.target.value })} className="flex-1" />
                  <Input type="number" value={r.valor_estimado || ""} onChange={e => handleUpdateReceita(r.id, { valor_estimado: parseFloat(e.target.value) || 0 })} className="w-28" placeholder="R$" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveReceita(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t">
                <span>Total Receitas: R$ {totalReceitas.toLocaleString()}</span>
                <span className={totalReceitas >= totalCustos + reservaTecnica ? "text-green-600" : "text-red-600"}>Saldo: R$ {(totalReceitas - totalCustos - reservaTecnica).toLocaleString()}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {!validation.isValid && <Alert variant="destructive" className="bg-red-50 border-red-200"><AlertCircle className="h-4 w-4" /><AlertDescription><ul className="list-disc list-inside">{validation.errors.map((e, i) => <li key={i}>{e}</li>)}</ul></AlertDescription></Alert>}
    </div>
  );
}
