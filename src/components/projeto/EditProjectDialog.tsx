import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2, Store, Eye, Target } from "lucide-react";
import type { Oportunidade } from "@/hooks/useOportunidades";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Oportunidade | null;
  onSave: (data: Partial<Oportunidade>) => void;
  isSaving: boolean;
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
  isSaving,
}: EditProjectDialogProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    local: "",
    municipio: "",
    data_evento: "",
    horario: "",
    vagas: 0,
    remuneracao: 0,
    requisitos: "",
    criador_nome: "",
    criador_contato: "",
    // Campos de vitrine
    exibir_vitrine: false,
    meta_captacao: 0,
    mostrar_progresso: true,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        titulo: project.titulo || "",
        descricao: project.descricao || "",
        tipo: project.tipo || "",
        local: project.local || "",
        municipio: project.municipio || "",
        data_evento: project.data_evento || "",
        horario: project.horario || "",
        vagas: project.vagas || 0,
        remuneracao: project.remuneracao || 0,
        requisitos: project.requisitos || "",
        criador_nome: project.criador_nome || "",
        criador_contato: project.criador_contato || "",
        // Campos de vitrine (podem não existir em projetos antigos)
        exibir_vitrine: (project as any).exibir_vitrine || false,
        meta_captacao: (project as any).meta_captacao || 0,
        mostrar_progresso: (project as any).mostrar_progresso ?? true,
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
          <DialogDescription>
            Atualize as informações do projeto. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="vaga">Vaga</SelectItem>
                  <SelectItem value="projeto_bairro">Projeto de Bairro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipio">Município</Label>
              <Input
                id="municipio"
                value={formData.municipio}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_evento">Data do Evento</Label>
              <Input
                id="data_evento"
                type="date"
                value={formData.data_evento}
                onChange={(e) => setFormData({ ...formData, data_evento: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                placeholder="Ex: 19h às 22h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vagas">Vagas</Label>
              <Input
                id="vagas"
                type="number"
                value={formData.vagas}
                onChange={(e) => setFormData({ ...formData, vagas: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remuneracao">Remuneração (R$)</Label>
              <Input
                id="remuneracao"
                type="number"
                step="0.01"
                value={formData.remuneracao}
                onChange={(e) => setFormData({ ...formData, remuneracao: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="requisitos">Requisitos</Label>
              <Textarea
                id="requisitos"
                value={formData.requisitos}
                onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="criador_nome">Nome do Responsável</Label>
              <Input
                id="criador_nome"
                value={formData.criador_nome}
                onChange={(e) => setFormData({ ...formData, criador_nome: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="criador_contato">Contato</Label>
              <Input
                id="criador_contato"
                value={formData.criador_contato}
                onChange={(e) => setFormData({ ...formData, criador_contato: e.target.value })}
              />
            </div>
          </div>

          {/* Seção de Vitrine de Investimentos */}
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Vitrine de Investimentos</CardTitle>
              </div>
              <CardDescription>
                Habilite para receber propostas de investimento, patrocínio e parcerias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="exibir_vitrine" className="font-medium">
                    Exibir na Vitrine
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Seu projeto aparecerá para investidores e patrocinadores
                  </p>
                </div>
                <Switch
                  id="exibir_vitrine"
                  checked={formData.exibir_vitrine}
                  onCheckedChange={(checked) => setFormData({ ...formData, exibir_vitrine: checked })}
                />
              </div>

              {formData.exibir_vitrine && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="meta_captacao" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Meta de Captação (R$)
                    </Label>
                    <Input
                      id="meta_captacao"
                      type="number"
                      step="0.01"
                      value={formData.meta_captacao}
                      onChange={(e) => setFormData({ ...formData, meta_captacao: parseFloat(e.target.value) || 0 })}
                      placeholder="Deixe 0 para não exibir meta"
                    />
                    <p className="text-xs text-muted-foreground">
                      Defina uma meta de captação. Deixe em 0 para apenas receber propostas sem meta.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mostrar_progresso" className="font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Mostrar Progresso
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Exibe o quanto já foi captado publicamente
                      </p>
                    </div>
                    <Switch
                      id="mostrar_progresso"
                      checked={formData.mostrar_progresso}
                      onCheckedChange={(checked) => setFormData({ ...formData, mostrar_progresso: checked })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
