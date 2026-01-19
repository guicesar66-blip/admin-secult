import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Package, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { OficinaWizardData, CategoriaEquipamento, ItemEquipamento } from "@/types/oficina-wizard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface StepEquipamentosProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

// Sugestões baseadas na linguagem artística
const SUGESTOES_CATEGORIAS: Record<string, string[]> = {
  "Audiovisual": ["Gravação", "Iluminação", "Edição", "Som"],
  "Música": ["Instrumentos", "Sonorização", "Gravação", "Estúdio"],
  "Teatro": ["Cenografia", "Figurino", "Iluminação", "Som"],
  "Dança": ["Som", "Figurino", "Iluminação", "Acessórios"],
  "Artes Visuais": ["Materiais de Pintura", "Ferramentas", "Suportes", "Acabamento"],
  "Literatura": ["Material Didático", "Impressão", "Publicação"],
  "Circo": ["Aparelhos", "Figurino", "Som", "Iluminação"],
  "Cultura Popular": ["Instrumentos", "Figurino", "Adereços", "Som"],
  "Multidisciplinar": ["Equipamento Geral", "Material Didático", "Som", "Iluminação"],
};

export function StepEquipamentos({ data, onChange }: StepEquipamentosProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const sugestoes = SUGESTOES_CATEGORIAS[data.linguagem_artistica] || SUGESTOES_CATEGORIAS["Multidisciplinar"];

  const toggleCategory = (id: string) => {
    setOpenCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const addCategoria = (nomeCategoria?: string) => {
    const novaCategoria: CategoriaEquipamento = {
      id: crypto.randomUUID(),
      nome_categoria: nomeCategoria || "",
      itens: [],
    };
    onChange({ equipamentos_materiais: [...data.equipamentos_materiais, novaCategoria] });
    setOpenCategories(prev => [...prev, novaCategoria.id]);
  };

  const updateCategoria = (id: string, updates: Partial<CategoriaEquipamento>) => {
    const updated = data.equipamentos_materiais.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    onChange({ equipamentos_materiais: updated });
  };

  const removeCategoria = (id: string) => {
    onChange({ equipamentos_materiais: data.equipamentos_materiais.filter(c => c.id !== id) });
  };

  const addItem = (categoriaId: string) => {
    const novoItem: ItemEquipamento = {
      id: crypto.randomUUID(),
      nome: "",
      quantidade: 1,
      tipo: "proprio",
    };
    const updated = data.equipamentos_materiais.map(c =>
      c.id === categoriaId ? { ...c, itens: [...c.itens, novoItem] } : c
    );
    onChange({ equipamentos_materiais: updated });
  };

  const updateItem = (categoriaId: string, itemId: string, updates: Partial<ItemEquipamento>) => {
    const updated = data.equipamentos_materiais.map(c =>
      c.id === categoriaId
        ? {
            ...c,
            itens: c.itens.map(i => (i.id === itemId ? { ...i, ...updates } : i)),
          }
        : c
    );
    onChange({ equipamentos_materiais: updated });
  };

  const removeItem = (categoriaId: string, itemId: string) => {
    const updated = data.equipamentos_materiais.map(c =>
      c.id === categoriaId
        ? { ...c, itens: c.itens.filter(i => i.id !== itemId) }
        : c
    );
    onChange({ equipamentos_materiais: updated });
  };

  const totalItens = data.equipamentos_materiais.reduce((acc, c) => acc + c.itens.length, 0);
  const totalCusto = data.equipamentos_materiais.reduce((acc, c) => {
    return acc + c.itens.reduce((itemAcc, item) => {
      if (item.tipo !== "proprio" && item.valor_unitario) {
        return itemAcc + (item.quantidade * item.valor_unitario);
      }
      return itemAcc;
    }, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-amber-600" />
          Equipamentos e Materiais
        </h2>
        <p className="text-muted-foreground mt-1">
          Liste todos os recursos materiais necessários para execução do projeto.
        </p>
      </div>

      {/* Sugestões de Categorias */}
      {data.equipamentos_materiais.length === 0 && (
        <Card className="bg-amber-500/5 border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              Sugestões para {data.linguagem_artistica || "seu projeto"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Clique em uma categoria sugerida ou crie uma personalizada.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sugestoes.map((sugestao) => (
                <Button
                  key={sugestao}
                  variant="outline"
                  size="sm"
                  onClick={() => addCategoria(sugestao)}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" />
                  {sugestao}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      {data.equipamentos_materiais.length > 0 && (
        <div className="flex gap-4">
          <Card className="flex-1 p-4">
            <div className="text-sm text-muted-foreground">Categorias</div>
            <div className="text-2xl font-bold">{data.equipamentos_materiais.length}</div>
          </Card>
          <Card className="flex-1 p-4">
            <div className="text-sm text-muted-foreground">Total de Itens</div>
            <div className="text-2xl font-bold">{totalItens}</div>
          </Card>
          <Card className="flex-1 p-4">
            <div className="text-sm text-muted-foreground">Custo Estimado</div>
            <div className="text-2xl font-bold text-amber-600">
              R$ {totalCusto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </Card>
        </div>
      )}

      {/* Categorias */}
      <div className="space-y-4">
        {data.equipamentos_materiais.map((categoria, catIndex) => (
          <Collapsible
            key={categoria.id}
            open={openCategories.includes(categoria.id)}
            onOpenChange={() => toggleCategory(categoria.id)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {openCategories.includes(categoria.id) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Input
                        placeholder="Nome da categoria (ex: Gravação)"
                        value={categoria.nome_categoria}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateCategoria(categoria.id, { nome_categoria: e.target.value });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-xs"
                      />
                      <Badge variant="secondary">
                        {categoria.itens.length} {categoria.itens.length === 1 ? "item" : "itens"}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCategoria(categoria.id);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Itens da Categoria */}
                  {categoria.itens.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-3 p-3 rounded-lg bg-muted/30 items-end"
                    >
                      <div className="col-span-4">
                        <Label className="text-xs">Nome do Item</Label>
                        <Input
                          placeholder="Ex: Câmera DSLR"
                          value={item.nome}
                          onChange={(e) => updateItem(categoria.id, item.id, { nome: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Quantidade</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantidade}
                          onChange={(e) => updateItem(categoria.id, item.id, { quantidade: parseInt(e.target.value) || 1 })}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Tipo</Label>
                        <Select
                          value={item.tipo}
                          onValueChange={(v) => updateItem(categoria.id, item.id, { tipo: v as ItemEquipamento["tipo"] })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="proprio">Próprio</SelectItem>
                            <SelectItem value="aluguel">Aluguel</SelectItem>
                            <SelectItem value="compra">Compra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">
                          Valor Unitário {item.tipo !== "proprio" && "(R$)"}
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder={item.tipo === "proprio" ? "-" : "0,00"}
                          value={item.valor_unitario || ""}
                          onChange={(e) => updateItem(categoria.id, item.id, { valor_unitario: parseFloat(e.target.value) || 0 })}
                          disabled={item.tipo === "proprio"}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(categoria.id, item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(categoria.id)}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Item
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Botão Adicionar Categoria */}
      <Button variant="outline" onClick={() => addCategoria()} className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Adicionar Categoria de Equipamentos
      </Button>

      {data.equipamentos_materiais.length === 0 && (
        <p className="text-sm text-destructive text-center">
          Adicione pelo menos uma categoria com itens.
        </p>
      )}
    </div>
  );
}
