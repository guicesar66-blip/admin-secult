import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload, AlertCircle, Megaphone, Building2 } from "lucide-react";
import { OficinaWizardData, CANAIS_DIVULGACAO, MarcaParceira } from "@/types/oficina-wizard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepDivulgacaoProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

export function StepDivulgacao({ data, onChange }: StepDivulgacaoProps) {
  const handleCanalToggle = (canal: string, checked: boolean) => {
    const updated = checked
      ? [...data.canais_divulgacao, canal]
      : data.canais_divulgacao.filter(c => c !== canal);
    onChange({ canais_divulgacao: updated });
  };

  const addMarcaParceira = () => {
    const novaMarca: MarcaParceira = {
      id: crypto.randomUUID(),
      nome: "",
      tipo: "apoio",
    };
    onChange({ marcas_parceiras: [...data.marcas_parceiras, novaMarca] });
  };

  const updateMarcaParceira = (id: string, updates: Partial<MarcaParceira>) => {
    const updated = data.marcas_parceiras.map(m =>
      m.id === id ? { ...m, ...updates } : m
    );
    onChange({ marcas_parceiras: updated });
  };

  const removeMarcaParceira = (id: string) => {
    onChange({ marcas_parceiras: data.marcas_parceiras.filter(m => m.id !== id) });
  };

  const showRedesSociaisWarning = data.canais_divulgacao.includes("Redes sociais (Instagram, Facebook, TikTok)");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-amber-600" />
          Divulgação e Marca
        </h2>
        <p className="text-muted-foreground mt-1">
          Planeje as ações de comunicação e uso de marcas institucionais.
        </p>
      </div>

      {/* Canais de Divulgação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Canais de Divulgação
            <Badge variant="secondary" className="font-normal">Obrigatório</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecione pelo menos um canal que será utilizado para divulgar o projeto.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CANAIS_DIVULGACAO.map((canal) => (
              <label
                key={canal}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={data.canais_divulgacao.includes(canal)}
                  onCheckedChange={(checked) => handleCanalToggle(canal, !!checked)}
                />
                <span className="text-sm">{canal}</span>
              </label>
            ))}
          </div>

          {showRedesSociaisWarning && (
            <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Para divulgação em redes sociais, prepare conteúdo visual atraente (imagens, vídeos curtos).
              </AlertDescription>
            </Alert>
          )}

          {data.canais_divulgacao.length === 0 && (
            <p className="text-sm text-destructive">
              Selecione pelo menos um canal de divulgação.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Descrição das Ações */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Descrição das Ações de Divulgação
            <Badge variant="secondary" className="font-normal">Obrigatório</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Descreva como serão realizadas as ações de divulgação. Exemplo: 'Criaremos uma série de posts para Instagram com prévia dos conteúdos, distribuiremos cartazes em pontos culturais do território...'"
            value={data.descricao_divulgacao}
            onChange={(e) => onChange({ descricao_divulgacao: e.target.value })}
            rows={5}
            className="resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Mínimo 100 caracteres</span>
            <span className={data.descricao_divulgacao.length < 100 ? "text-destructive" : ""}>
              {data.descricao_divulgacao.length}/1000
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Marcas Parceiras */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Marcas Parceiras
            <Badge variant="outline" className="font-normal">Opcional</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Adicione as marcas que estarão associadas ao projeto. A marca CENA é incluída automaticamente como apoio.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Marca CENA automática */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">CENA</p>
              <Badge variant="secondary" className="text-xs">Apoio (incluído automaticamente)</Badge>
            </div>
          </div>

          {/* Marcas adicionadas */}
          {data.marcas_parceiras.map((marca, index) => (
            <div key={marca.id} className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Marca {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMarcaParceira(marca.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Nome da Marca</Label>
                  <Input
                    placeholder="Ex: Fundarpe"
                    value={marca.nome}
                    onChange={(e) => updateMarcaParceira(marca.id, { nome: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tipo de Parceria</Label>
                  <Select
                    value={marca.tipo}
                    onValueChange={(v) => updateMarcaParceira(marca.id, { tipo: v as MarcaParceira["tipo"] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patrocinador">Patrocinador</SelectItem>
                      <SelectItem value="apoio">Apoio</SelectItem>
                      <SelectItem value="realizacao">Realização</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {marca.tipo === "patrocinador" && !marca.logo_url && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-xs">
                    Patrocinadores devem ter logo. Upload será disponibilizado em breve.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={addMarcaParceira} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Marca Parceira
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
