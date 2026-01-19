import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  OficinaWizardData, 
  LINGUAGENS_ARTISTICAS, 
  TERRITORIOS_RMR,
  validateStep1 
} from "@/types/oficina-wizard";
import { FileText, MapPin, X } from "lucide-react";

interface StepJustificativaProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

export function StepJustificativa({ data, onChange }: StepJustificativaProps) {
  const validation = validateStep1(data);
  const charCountJustificativa = data.justificativa?.length || 0;
  const charCountTitulo = data.titulo?.length || 0;

  const handleAddTerritorio = (territorio: string) => {
    if (!data.territorios.includes(territorio)) {
      onChange({ territorios: [...data.territorios, territorio] });
    }
  };

  const handleRemoveTerritorio = (territorio: string) => {
    onChange({ territorios: data.territorios.filter(t => t !== territorio) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Step 1: Justificativa</h2>
          <p className="text-sm text-muted-foreground">
            Contextualizar a relevância do projeto e sua conexão com o território/comunidade
          </p>
        </div>
      </div>

      {/* Título do Projeto */}
      <div className="space-y-2">
        <Label htmlFor="titulo" className="flex items-center gap-2">
          Título do Projeto <span className="text-destructive">*</span>
        </Label>
        <Input
          id="titulo"
          value={data.titulo}
          onChange={(e) => onChange({ titulo: e.target.value })}
          placeholder="Ex: Oficina de Audiovisual para Iniciantes"
          maxLength={100}
          className="text-lg"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Máximo 100 caracteres</span>
          <span className={charCountTitulo > 100 ? "text-destructive" : ""}>
            {charCountTitulo}/100
          </span>
        </div>
      </div>

      {/* Justificativa */}
      <div className="space-y-2">
        <Label htmlFor="justificativa" className="flex items-center gap-2">
          Justificativa <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Por que essa oficina é importante? Qual problema ela resolve ou qual oportunidade ela aproveita?
        </p>
        <Textarea
          id="justificativa"
          value={data.justificativa}
          onChange={(e) => onChange({ justificativa: e.target.value })}
          placeholder="Descreva o contexto e a relevância do projeto. Inclua informações sobre o território, comunidade beneficiada e a importância da temática abordada..."
          className="min-h-[180px] resize-none"
          maxLength={2000}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mínimo 200 caracteres</span>
          <span className={charCountJustificativa < 200 ? "text-amber-600" : charCountJustificativa > 2000 ? "text-destructive" : "text-green-600"}>
            {charCountJustificativa}/2000
          </span>
        </div>
      </div>

      {/* Linguagem Artística */}
      <div className="space-y-2">
        <Label htmlFor="linguagem" className="flex items-center gap-2">
          Linguagem Artística <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.linguagem_artistica}
          onValueChange={(value) => onChange({ linguagem_artistica: value })}
        >
          <SelectTrigger id="linguagem">
            <SelectValue placeholder="Selecione a linguagem artística" />
          </SelectTrigger>
          <SelectContent>
            {LINGUAGENS_ARTISTICAS.map((linguagem) => (
              <SelectItem key={linguagem} value={linguagem}>
                {linguagem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Território/Bairro de Atuação */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Território/Bairro de Atuação <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Selecione os bairros onde a oficina será realizada ou terá impacto
        </p>
        
        <Select onValueChange={handleAddTerritorio}>
          <SelectTrigger>
            <SelectValue placeholder="Adicionar território..." />
          </SelectTrigger>
          <SelectContent>
            {TERRITORIOS_RMR.filter(t => !data.territorios.includes(t)).map((territorio) => (
              <SelectItem key={territorio} value={territorio}>
                {territorio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {data.territorios.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.territorios.map((territorio) => (
              <Badge 
                key={territorio} 
                variant="secondary" 
                className="gap-1 py-1 px-3"
              >
                {territorio}
                <button
                  type="button"
                  onClick={() => handleRemoveTerritorio(territorio)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Validação visual */}
      {!validation.isValid && data.titulo && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm font-medium text-amber-700 mb-2">Pendências:</p>
          <ul className="text-sm text-amber-600 list-disc list-inside space-y-1">
            {validation.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
