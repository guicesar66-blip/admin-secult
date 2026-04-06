import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, DollarSign, AlertCircle, Sparkles, PieChart } from "lucide-react";
import { OficinaWizardData, ItemCusto } from "@/types/oficina-wizard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepPlanilhaCustosProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

const CATEGORIAS_CUSTO = [
  { value: "equipe", label: "Equipe" },
  { value: "equipamento", label: "Equipamento" },
  { value: "locacao", label: "Locação" },
  { value: "producao", label: "Produção" },
  { value: "divulgacao", label: "Divulgação" },
  { value: "acessibilidade", label: "Acessibilidade" },
  { value: "outros", label: "Outros" },
] as const;

const CATEGORIA_COLORS: Record<string, string> = {
  equipe: "bg-primary",
  equipamento: "bg-success",
  locacao: "bg-primary",
  producao: "bg-warning",
  divulgacao: "bg-secondary",
  acessibilidade: "bg-primary",
  outros: "bg-neutral-500",
};

export function StepPlanilhaCustos({ data, onChange }: StepPlanilhaCustosProps) {
  // Gerar itens automáticos baseados nos steps anteriores
  useEffect(() => {
    const itensAutomaticos: ItemCusto[] = [];

    // Equipamentos (Step 8)
    data.equipamentos_materiais.forEach(cat => {
      cat.itens.forEach(item => {
        if (item.tipo !== "proprio" && item.valor_unitario) {
          itensAutomaticos.push({
            id: `equip-${item.id}`,
            item: `${item.nome} (${cat.nome_categoria})`,
            categoria: "equipamento",
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            total: item.quantidade * item.valor_unitario,
            fonte: "automatico",
          });
        }
      });
    });

    // Equipe (Step 9)
    data.equipe_instrutores.forEach(membro => {
      if (membro.valor_por_pessoa > 0) {
        itensAutomaticos.push({
          id: `inst-${membro.id}`,
          item: membro.funcao || "Instrutor",
          categoria: "equipe",
          quantidade: membro.quantidade,
          valor_unitario: membro.valor_por_pessoa,
          total: membro.quantidade * membro.valor_por_pessoa,
          fonte: "automatico",
        });
      }
    });

    data.equipe_apoio.forEach(membro => {
      if (membro.valor_por_pessoa > 0) {
        itensAutomaticos.push({
          id: `apoio-${membro.id}`,
          item: membro.funcao || "Apoio",
          categoria: "equipe",
          quantidade: membro.quantidade,
          valor_unitario: membro.valor_por_pessoa,
          total: membro.quantidade * membro.valor_por_pessoa,
          fonte: "automatico",
        });
      }
    });

    // Intérprete de Libras (Step 7)
    if (data.recursos_acessibilidade.includes("Intérprete de Libras nos encontros")) {
      const numEncontros = data.etapas_encontros.length || 4;
      itensAutomaticos.push({
        id: "libras-auto",
        item: "Intérprete de Libras",
        categoria: "acessibilidade",
        quantidade: numEncontros,
        valor_unitario: 500,
        total: numEncontros * 500,
        fonte: "automatico",
      });
    }

    // Transmissão ao vivo (Step 6)
    if (data.cobertura_evento.includes("Transmissão ao vivo")) {
      itensAutomaticos.push({
        id: "transmissao-auto",
        item: "Técnico de Transmissão",
        categoria: "producao",
        quantidade: 1,
        valor_unitario: 800,
        total: 800,
        fonte: "automatico",
      });
    }

    // Locação de espaço (Step 4)
    if ((data.modalidade === "presencial" || data.modalidade === "hibrido") && data.local) {
      itensAutomaticos.push({
        id: "locacao-auto",
        item: `Locação - ${data.local}`,
        categoria: "locacao",
        quantidade: 1,
        valor_unitario: 2000,
        total: 2000,
        fonte: "automatico",
      });
    }

    // Mesclar com itens manuais existentes
    const itensManuais = data.itens_custo.filter(i => i.fonte === "manual");
    const novosItens = [...itensAutomaticos, ...itensManuais];
    
    // Só atualiza se houver mudança
    if (JSON.stringify(novosItens.map(i => i.id).sort()) !== 
        JSON.stringify(data.itens_custo.map(i => i.id).sort())) {
      onChange({ itens_custo: novosItens });
    }
  }, [
    data.equipamentos_materiais,
    data.equipe_instrutores,
    data.equipe_apoio,
    data.recursos_acessibilidade,
    data.cobertura_evento,
    data.modalidade,
    data.local,
    data.etapas_encontros.length,
  ]);

  const addItemManual = () => {
    const novoItem: ItemCusto = {
      id: crypto.randomUUID(),
      item: "",
      categoria: "outros",
      quantidade: 1,
      valor_unitario: 0,
      total: 0,
      fonte: "manual",
    };
    onChange({ itens_custo: [...data.itens_custo, novoItem] });
  };

  const updateItem = (id: string, updates: Partial<ItemCusto>) => {
    const updated = data.itens_custo.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        newItem.total = newItem.quantidade * newItem.valor_unitario;
        return newItem;
      }
      return item;
    });
    onChange({ itens_custo: updated });
  };

  const removeItem = (id: string) => {
    onChange({ itens_custo: data.itens_custo.filter(i => i.id !== id) });
  };

  // Cálculos
  const subtotal = data.itens_custo.reduce((acc, i) => acc + i.total, 0);
  const reservaTecnica = subtotal * (data.reserva_tecnica_percentual / 100);
  const total = subtotal + reservaTecnica;

  // Distribuição por categoria
  const distribuicao = CATEGORIAS_CUSTO.map(cat => ({
    ...cat,
    total: data.itens_custo.filter(i => i.categoria === cat.value).reduce((acc, i) => acc + i.total, 0),
  })).filter(c => c.total > 0);

  // RN10.3: Categoria equipe não pode exceder 60%
  const percentualEquipe = subtotal > 0 
    ? (data.itens_custo.filter(i => i.categoria === "equipe").reduce((acc, i) => acc + i.total, 0) / subtotal) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-accent-dark" />
          Planilha de Custos
        </h2>
        <p className="text-muted-foreground mt-1">
          Consolidação de todos os custos do projeto. Itens automáticos são gerados com base nos steps anteriores.
        </p>
      </div>

      {/* Alertas */}
      {percentualEquipe > 60 && (
        <Alert className="border-accent/50 bg-accent/10">
          <AlertCircle className="h-4 w-4 text-accent-dark" />
          <AlertDescription className="text-pe-orange-dark">
            A categoria "Equipe" representa {percentualEquipe.toFixed(1)}% do orçamento. Recomenda-se não exceder 60%.
          </AlertDescription>
        </Alert>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Subtotal</div>
          <div className="text-xl font-bold">
            R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Reserva Técnica ({data.reserva_tecnica_percentual}%)</div>
          <div className="text-xl font-bold">
            R$ {reservaTecnica.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </Card>
        <Card className="p-4 bg-accent/10 border-accent/30">
          <div className="text-sm text-accent-dark">Total Geral</div>
          <div className="text-2xl font-bold text-accent-dark">
            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Itens</div>
          <div className="text-xl font-bold">{data.itens_custo.length}</div>
        </Card>
      </div>

      {/* Distribuição por Categoria */}
      {distribuicao.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {distribuicao.map(cat => {
                const percent = subtotal > 0 ? (cat.total / subtotal) * 100 : 0;
                return (
                  <div key={cat.value} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${CATEGORIA_COLORS[cat.value]}`} />
                    <span className="text-sm flex-1">{cat.label}</span>
                    <span className="text-sm font-medium">{percent.toFixed(1)}%</span>
                    <span className="text-sm text-muted-foreground w-32 text-right">
                      R$ {cat.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de Custos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Itens de Custo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.itens_custo.map((item) => (
            <div 
              key={item.id} 
              className={`grid grid-cols-12 gap-3 p-3 rounded-lg items-end ${
                item.fonte === "automatico" ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
              }`}
            >
              <div className="col-span-4">
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-xs">Item</Label>
                  {item.fonte === "automatico" && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Sparkles className="h-3 w-3" />
                      Auto
                    </Badge>
                  )}
                </div>
                <Input
                  placeholder="Nome do item"
                  value={item.item}
                  onChange={(e) => updateItem(item.id, { item: e.target.value })}
                  disabled={item.fonte === "automatico"}
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Categoria</Label>
                <Select
                  value={item.categoria}
                  onValueChange={(v) => updateItem(item.id, { categoria: v as ItemCusto["categoria"] })}
                  disabled={item.fonte === "automatico"}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS_CUSTO.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label className="text-xs">Qtd</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={(e) => updateItem(item.id, { quantidade: parseInt(e.target.value) || 1 })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Valor Unit. (R$)</Label>
                <Input
                  type="number"
                  min={0}
                  step={10}
                  value={item.valor_unitario}
                  onChange={(e) => updateItem(item.id, { valor_unitario: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Total (R$)</Label>
                <Input
                  value={item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  disabled
                  className="mt-1 bg-muted font-medium"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addItemManual} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Item Manual
          </Button>
        </CardContent>
      </Card>

      {/* Reserva Técnica */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reserva Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={data.reserva_tecnica_percentual > 0}
                onCheckedChange={(checked) => onChange({ reserva_tecnica_percentual: checked ? 10 : 0 })}
              />
              <span className="text-sm">Incluir reserva técnica</span>
            </label>
            {data.reserva_tecnica_percentual > 0 && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={5}
                  max={15}
                  value={data.reserva_tecnica_percentual}
                  onChange={(e) => onChange({ reserva_tecnica_percentual: parseFloat(e.target.value) || 10 })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            )}
          </div>
          {data.reserva_tecnica_percentual === 0 && (
            <Alert className="mt-3 border-accent/50 bg-accent/10">
              <AlertCircle className="h-4 w-4 text-accent-dark" />
              <AlertDescription className="text-pe-orange-dark text-sm">
                Recomendamos incluir uma reserva técnica de 10% para imprevistos.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
