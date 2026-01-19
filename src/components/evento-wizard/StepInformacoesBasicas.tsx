import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, Info, Lightbulb, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  EventoWizardData, 
  TIPOS_EVENTO, 
  LINGUAGENS_ARTISTICAS_EVENTO,
  validateEventoStep1 
} from "@/types/evento-wizard";

interface StepInformacoesBasicasProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
}

export function StepInformacoesBasicas({ data, onChange }: StepInformacoesBasicasProps) {
  const validation = validateEventoStep1(data);

  const handleLinguagemSecundariaToggle = (linguagem: string) => {
    const updated = data.linguagens_secundarias.includes(linguagem)
      ? data.linguagens_secundarias.filter(l => l !== linguagem)
      : [...data.linguagens_secundarias, linguagem];
    onChange({ linguagens_secundarias: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-500/10">
          <FileText className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Informações Básicas do Evento</h2>
          <p className="text-muted-foreground mt-1">
            Defina as informações essenciais que identificam o evento.
          </p>
        </div>
      </div>

      {/* Dicas */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-medium text-purple-900">Dicas para um bom evento:</p>
              <ul className="list-disc list-inside text-purple-700 space-y-1">
                <li>Escolha um nome memorável e que reflita a identidade do evento</li>
                <li>A descrição deve informar claramente o que o público pode esperar</li>
                <li>A linguagem artística principal ajuda no matching com artistas da base CENA</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campos do formulário */}
      <div className="space-y-6">
        {/* Nome do Evento */}
        <div className="space-y-2">
          <Label htmlFor="nome_evento" className="text-base font-medium">
            Nome do Evento <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nome_evento"
            placeholder="Ex: Festival Recife Jazz, Mostra de Dança Contemporânea..."
            value={data.nome_evento}
            onChange={(e) => onChange({ nome_evento: e.target.value })}
            maxLength={100}
            className="text-base"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Nome único e memorável</span>
            <span className={data.nome_evento.length > 90 ? "text-amber-600" : ""}>
              {data.nome_evento.length}/100
            </span>
          </div>
        </div>

        {/* Tipo de Evento e Edição (lado a lado) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Tipo de Evento <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.tipo_evento}
              onValueChange={(value) => onChange({ tipo_evento: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_EVENTO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edicao" className="text-base font-medium">
              Edição/Versão
            </Label>
            <Input
              id="edicao"
              placeholder="Ex: 3ª Edição, Volume 2..."
              value={data.edicao_versao || ""}
              onChange={(e) => onChange({ edicao_versao: e.target.value })}
            />
          </div>
        </div>

        {/* Linguagem Artística Principal */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Linguagem Artística Principal <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.linguagem_principal}
            onValueChange={(value) => onChange({ linguagem_principal: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a linguagem principal" />
            </SelectTrigger>
            <SelectContent>
              {LINGUAGENS_ARTISTICAS_EVENTO.map((linguagem) => (
                <SelectItem key={linguagem} value={linguagem}>
                  {linguagem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            A linguagem principal é usada para matching com artistas da base CENA
          </p>
        </div>

        {/* Linguagens Secundárias */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Linguagens Secundárias
          </Label>
          <p className="text-sm text-muted-foreground">
            Selecione outras linguagens artísticas presentes no evento
          </p>
          <div className="flex flex-wrap gap-2">
            {LINGUAGENS_ARTISTICAS_EVENTO
              .filter(l => l !== data.linguagem_principal)
              .map((linguagem) => {
                const isSelected = data.linguagens_secundarias.includes(linguagem);
                return (
                  <Badge
                    key={linguagem}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "hover:bg-purple-50 hover:border-purple-300"
                    }`}
                    onClick={() => handleLinguagemSecundariaToggle(linguagem)}
                  >
                    {linguagem}
                    {isSelected && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                );
              })}
          </div>
        </div>

        {/* Descrição do Evento */}
        <div className="space-y-2">
          <Label htmlFor="descricao" className="text-base font-medium">
            Descrição do Evento <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="descricao"
            placeholder="Descreva o evento de forma completa: o que é, para quem, o que o público pode esperar, diferenciais..."
            value={data.descricao_evento}
            onChange={(e) => onChange({ descricao_evento: e.target.value })}
            className="min-h-[180px] text-base resize-none"
            maxLength={2000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={data.descricao_evento.length < 200 ? "text-amber-600" : "text-green-600"}>
              {data.descricao_evento.length < 200 
                ? `Mínimo 200 caracteres (faltam ${200 - data.descricao_evento.length})`
                : "✓ Mínimo atingido"
              }
            </span>
            <span className={data.descricao_evento.length > 1800 ? "text-amber-600" : ""}>
              {data.descricao_evento.length}/2000
            </span>
          </div>
        </div>
      </div>

      {/* Validação */}
      {!validation.isValid && data.nome_evento && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
