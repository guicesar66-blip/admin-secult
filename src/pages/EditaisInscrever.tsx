import { useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Upload, X, Check, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getEditalById } from "@/data/mockEditais";
import { toast } from "sonner";

// ════════════════════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════════════════════

interface ProjetoInscricao {
  nome: string;
  descricao: string;
  linguagem: string;
  territorio: string;
  ods: string[];
  orcamento: number;
}

interface Documento {
  id: string;
  label: string;
  arquivo?: File;
  obrigatorio: boolean;
}

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ════════════════════════════════════════════════════════════════════════════════

const LINGUAGENS = [
  "Música",
  "Teatro",
  "Dança",
  "Artes Visuais",
  "Audiovisual",
  "Cultura Popular",
  "Literatura",
  "Circo",
];

const TERRITORIOS = ["Recife", "Olinda", "Caruaru", "Outros municípios de PE"];

const ODS_LIST = [
  { id: "1", label: "Pobreza" },
  { id: "2", label: "Fome" },
  { id: "3", label: "Saúde" },
  { id: "4", label: "Educação" },
  { id: "5", label: "Gênero" },
  { id: "6", label: "Água" },
  { id: "7", label: "Energia" },
  { id: "8", label: "Trabalho" },
  { id: "9", label: "Inovação" },
  { id: "10", label: "Desigualdade" },
  { id: "11", label: "Cidades" },
  { id: "12", label: "Consumo" },
  { id: "13", label: "Clima" },
  { id: "14", label: "Oceanos" },
  { id: "15", label: "Terra" },
  { id: "16", label: "Paz" },
  { id: "17", label: "Parcerias" },
];

const STEPS = [
  { id: 1, label: "Projeto" },
  { id: 2, label: "Documentos" },
  { id: 3, label: "Revisão" },
  { id: 4, label: "Confirmação" },
];

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENTES DAS ETAPAS
// ════════════════════════════════════════════════════════════════════════════════

// ProgressBar com navegação clicável entre etapas
interface ProgressBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

function ProgressBar({ currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="flex items-start gap-2 mb-8">
      {STEPS.map((step, idx) => (
        <Fragment key={step.id}>
          <button
            onClick={() => currentStep > step.id && onStepClick(step.id)}
            disabled={currentStep <= step.id}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
              currentStep > step.id
                ? "bg-success text-white shadow-sm cursor-pointer hover:bg-success"
                : currentStep === step.id
                ? "bg-primary text-white shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
          </button>
          {idx < STEPS.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 mt-4 mx-2 transition-all",
                currentStep > step.id ? "bg-success" : "bg-border"
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

// Etapa 1: Criar Projeto
interface Etapa1Props {
  projeto: ProjetoInscricao;
  setProjeto: (p: ProjetoInscricao) => void;
  edital: any;
}

function Etapa1({ projeto, setProjeto, edital }: Etapa1Props) {
  const descricaoAtingeMinimoEmaximo =
    projeto.descricao.length >= 50 && projeto.descricao.length <= 2000;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Sobre qual projeto você vai se inscrever?
        </h2>
        <p className="text-base text-muted-foreground">
          Crie um novo projeto para este edital.
        </p>
      </div>

      <Card className="border-border/50 p-6">
        <div className="space-y-6">
          {/* Nome do projeto */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Nome do projeto <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Ex: Orquestra Periférica do Recife"
              value={projeto.nome}
              onChange={(e) => setProjeto({ ...projeto, nome: e.target.value })}
              className="text-base"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Descrição do projeto <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Descreva sua proposta, objetivos e impacto esperado..."
              value={projeto.descricao}
              onChange={(e) => setProjeto({ ...projeto, descricao: e.target.value })}
              className="text-base min-h-[120px]"
            />
            <div className="flex items-center justify-between text-sm">
              <span
                className={cn(
                  "font-medium",
                  descricaoAtingeMinimoEmaximo ? "text-success" : "text-muted-foreground"
                )}
              >
                {projeto.descricao.length} caracteres
              </span>
              <span className="text-muted-foreground text-xs">
                {projeto.descricao.length >= 50 && projeto.descricao.length <= 2000
                  ? "✓ Dentro do intervalo"
                  : `Mínimo 50 - Máximo 2000`}
              </span>
            </div>
          </div>

          {/* Linguagem (travada) */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Linguagem artística <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                disabled
                value={edital.linguagem}
                className="text-base bg-muted cursor-not-allowed"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-pe-blue-light text-primary border-0">
                  Herdado do edital
                </Badge>
              </div>
            </div>
          </div>

          {/* Território */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Território de execução</Label>
            <Select value={projeto.territorio} onValueChange={(val) => setProjeto({ ...projeto, territorio: val })}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Selecione um território..." />
              </SelectTrigger>
              <SelectContent>
                {TERRITORIOS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ODS */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Objetivos de Desenvolvimento Sustentável (ODS)
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {ODS_LIST.map((ods) => (
                <label
                  key={ods.id}
                  className="flex items-center gap-2 p-3 rounded border border-border cursor-pointer hover:bg-pe-blue-lighter transition-colors"
                >
                  <Checkbox
                    checked={projeto.ods.includes(ods.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setProjeto({ ...projeto, ods: [...projeto.ods, ods.id] });
                      } else {
                        setProjeto({
                          ...projeto,
                          ods: projeto.ods.filter((o) => o !== ods.id),
                        });
                      }
                    }}
                  />
                  <span className="text-xs font-semibold text-foreground">{ods.id}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Selecione os ODS com os quais seu projeto se alinha</p>
          </div>

          {/* Orçamento */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Orçamento solicitado <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base font-semibold text-foreground">
                R$
              </span>
              <Input
                type="number"
                placeholder="0,00"
                value={projeto.orcamento || ""}
                onChange={(e) =>
                  setProjeto({ ...projeto, orcamento: parseFloat(e.target.value) || 0 })
                }
                className="text-base pl-10"
              />
            </div>
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-medium p-3 rounded mt-2",
                projeto.orcamento > 0 && projeto.orcamento <= 50000
                  ? "bg-pe-green-lighter text-success-dark"
                  : projeto.orcamento > 50000
                  ? "bg-pe-yellow-lighter text-accent-dark"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {projeto.orcamento <= 0 ? (
                <>Defina um orçamento</>
              ) : projeto.orcamento <= 50000 ? (
                <>
                  <Check className="h-4 w-4" />
                  Dentro do limite (R$ 50.000)
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Acima do limite (máx R$ 50.000)
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Etapa 2: Upload de Documentos
interface Etapa2Props {
  documentos: Documento[];
  setDocumentos: (d: Documento[]) => void;
  edital: any;
}

function Etapa2({ documentos, setDocumentos, edital }: Etapa2Props) {
  const handleFileSelected = (docId: string, file: File) => {
    setDocumentos(
      documentos.map((d) => (d.id === docId ? { ...d, arquivo: file } : d))
    );
    toast.success("Arquivo adicionado com sucesso");
  };

  const handleFileRemove = (docId: string) => {
    setDocumentos(documentos.map((d) => (d.id === docId ? { ...d, arquivo: undefined } : d)));
  };

  const handleAddOptional = () => {
    const newDoc: Documento = {
      id: `optional-${Date.now()}`,
      label: "Documento opcional",
      obrigatorio: false,
    };
    setDocumentos([...documentos, newDoc]);
  };

  const obrigatoriosCompletos = documentos
    .filter((d) => d.obrigatorio)
    .every((d) => d.arquivo);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Documentos da inscrição
        </h2>
        <p className="text-base text-muted-foreground">
          Faça upload dos documentos exigidos pelo edital.
        </p>
      </div>

      {/* Cards de upload */}
      <div className="space-y-3">
        {documentos.map((doc) => (
          <Card
            key={doc.id}
            className="border-2 border-dashed border-border hover:border-primary/50 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    {doc.label}
                    {doc.obrigatorio && <span className="text-destructive"> *</span>}
                  </Label>
                  {edital.documentosExigidos.find((d: any) => d.label === doc.label) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {edital.documentosExigidos.find((d: any) => d.label === doc.label).formato} ·
                      Máx{" "}
                      {edital.documentosExigidos.find((d: any) => d.label === doc.label).tamanhoMaximo}MB
                    </p>
                  )}
                </div>

                {doc.arquivo ? (
                  <div className="flex items-center justify-between p-3 rounded bg-pe-green-lighter border border-success/30">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {doc.arquivo.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.arquivo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-3 p-8 rounded bg-muted border border-border cursor-pointer hover:bg-muted/80 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        Arraste ou clique para selecionar
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelected(doc.id, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão adicionar opcional */}
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={handleAddOptional}
      >
        + Adicionar documento opcional
      </Button>

      {/* Status de completude */}
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-medium p-4 rounded-lg border",
          obrigatoriosCompletos
            ? "bg-pe-green-lighter text-success-dark border-success/30"
            : "bg-pe-yellow-lighter text-accent-dark border-accent/30"
        )}
      >
        {obrigatoriosCompletos ? (
          <>
            <Check className="h-4 w-4 flex-shrink-0" />
            <span>
              ✓ Todos os {documentos.filter((d) => d.obrigatorio).length} documentos
              obrigatórios foram enviados
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              {documentos.filter((d) => d.obrigatorio && d.arquivo).length} de{" "}
              {documentos.filter((d) => d.obrigatorio).length} documentos obrigatórios
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// Etapa 3: Revisão
interface Etapa3Props {
  projeto: ProjetoInscricao;
  documentos: Documento[];
  edital: any;
  termos: boolean;
  setTermos: (t: boolean) => void;
}

function Etapa3({ projeto, documentos, edital, termos, setTermos }: Etapa3Props) {
  const docsEnviados = documentos.filter((d) => d.arquivo);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Revise sua inscrição
        </h2>
        <p className="text-base text-muted-foreground">Confirme os dados antes de enviar.</p>
      </div>

      {/* Card do edital */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <p className="font-semibold text-foreground">{edital.titulo}</p>
            <p className="text-muted-foreground">{edital.organizador}</p>
          </div>
          <p className="text-muted-foreground">
            Prazo: até <span className="font-semibold">{edital.dataLimiteInscricao}</span>
          </p>
        </CardContent>
      </Card>

      {/* Card do projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seu projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Nome</p>
            <p className="font-semibold text-foreground">{projeto.nome}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Linguagem</p>
            <p className="font-semibold text-foreground">{projeto.linguagem}</p>
          </div>
          {projeto.territorio && (
            <div>
              <p className="text-muted-foreground">Território</p>
              <p className="font-semibold text-foreground">{projeto.territorio}</p>
            </div>
          )}
          {projeto.ods.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-2">ODS</p>
              <div className="flex flex-wrap gap-1">
                {projeto.ods.map((ods) => (
                  <Badge key={ods} variant="secondary">
                    ODS {ods}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Orçamento solicitado</p>
            <p className="font-semibold text-foreground">
              R$ {projeto.orcamento.toLocaleString("pt-BR")}
            </p>
            {projeto.orcamento <= 50000 && (
              <p className="text-xs text-success font-medium mt-1">
                ✓ Dentro do limite
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card de documentos */}
      {docsEnviados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {docsEnviados.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  {doc.arquivo?.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Checkbox de termos */}
      <Card className="border-primary/30 bg-pe-blue-lighter/50">
        <CardContent className="pt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={termos}
              onCheckedChange={(checked) => setTermos(!!checked)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground leading-relaxed">
              Li e aceito os <strong>termos e condições</strong> do edital e declaro
              que as informações prestadas nesta inscrição são <strong>verdadeiras</strong> e
              <strong> completas</strong>.
            </span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

// Etapa 4: Confirmação
interface Etapa4Props {
  projeto: ProjetoInscricao;
  edital: any;
  protocol: string;
}

function Etapa4({ projeto, edital, protocol }: Etapa4Props) {
  const navigate = useNavigate();
  const hoje = new Date();
  const dataEnvio = hoje.toLocaleDateString("pt-BR") + " às " + hoje.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const dataResultado = edital.dataResultado;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Ícone de sucesso */}
      <div className="mb-8 animate-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-pe-green-light flex items-center justify-center">
          <Check className="h-10 w-10 text-success" />
        </div>
      </div>

      {/* Conteúdo centralizado */}
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Inscrição enviada com sucesso!
          </h1>
          <p className="text-base text-muted-foreground">
            Sua inscrição foi recebida e está em análise. Você acompanhará o processo pelo
            seu painel.
          </p>
        </div>

        {/* Card de protocolo */}
        <Card className="border-l-4 border-l-emerald-500 bg-pe-green-lighter/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Protocolo de inscrição</p>
            <p className="text-3xl font-bold text-foreground mb-4 font-mono">{protocol}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Data de envio</p>
                <p className="font-medium text-foreground">{dataEnvio}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Resultado previsto</p>
                <p className="font-medium text-foreground">Até {dataResultado}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <div className="text-left space-y-3">
          <p className="text-sm font-semibold text-foreground mb-4">O que acontece agora:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Inscrição recebida</p>
                <p className="text-xs text-muted-foreground">
                  Seu projeto foi enviado com sucesso
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">⏳</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Análise pela {edital.organizador}</p>
                <p className="text-xs text-muted-foreground">Até 30 dias</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">⏳</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Divulgação do resultado</p>
                <p className="text-xs text-muted-foreground">{dataResultado}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">⏳</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Assinatura do contrato</p>
                <p className="text-xs text-muted-foreground">Se aprovado</p>
              </div>
            </div>
          </div>
        </div>

          {/* Botão final */}
        <Button
          onClick={() => navigate("/projetos")}
          className="w-full bg-primary hover:bg-primary-dark text-white h-11 text-base font-semibold mt-6"
        >
          Voltar aos meus projetos
        </Button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════════

export function EditaisInscrever() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const edital = id ? getEditalById(id) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [projeto, setProjeto] = useState<ProjetoInscricao>({
    nome: "",
    descricao: "",
    linguagem: edital?.linguagem || "",
    territorio: "",
    ods: [],
    orcamento: 0,
  });

  const [documentos, setDocumentos] = useState<Documento[]>(
    edital?.documentosExigidos.map((doc, idx) => ({
      id: `doc-${idx}`,
      label: doc.label,
      arquivo: undefined,
      obrigatorio: doc.obrigatorio,
    })) || []
  );

  const [termos, setTermos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [protocol, setProtocol] = useState("");

  if (!edital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-muted-foreground">Edital não encontrado</p>
        </div>
      </div>
    );
  }

  const handleProximaEtapa = () => {
    // Validações
    if (currentStep === 1) {
      if (!projeto.nome.trim()) {
        toast.error("Nome do projeto é obrigatório");
        return;
      }
      if (projeto.descricao.length < 50 || projeto.descricao.length > 2000) {
        toast.error("Descrição deve ter entre 50 e 2000 caracteres");
        return;
      }
      if (projeto.orcamento <= 0) {
        toast.error("Orçamento é obrigatório");
        return;
      }
    }

    if (currentStep === 2) {
      const obrigatorios = documentos.filter((d) => d.obrigatorio);
      if (!obrigatorios.every((d) => d.arquivo)) {
        toast.error("Todos os documentos obrigatórios devem ser enviados");
        return;
      }
    }

    if (currentStep === 3) {
      if (!termos) {
        toast.error("Aceite os termos para continuar");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleEnviarInscricao = async () => {
    setEnviando(true);
    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newProtocol = `#SIC2026-${Math.floor(Math.random() * 10000)}`;
    setProtocol(newProtocol);
    setEnviando(false);
    setCurrentStep(4);
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header com voltar */}
      {currentStep < 4 && (
        <div className="border-b border-border bg-background sticky top-0 z-20">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-8">
        {currentStep < 4 && (
          <div className="space-y-8">
            {/* Progress Bar */}
            <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

            {/* Step Title and Badge */}
            <div className="space-y-2">
              <Badge variant="outline" className="bg-pe-blue-light text-primary border-0">
                {edital.titulo}
              </Badge>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <Etapa1 projeto={projeto} setProjeto={setProjeto} edital={edital} />
        )}
        {currentStep === 2 && (
          <Etapa2
            documentos={documentos}
            setDocumentos={setDocumentos}
            edital={edital}
          />
        )}
        {currentStep === 3 && (
          <Etapa3
            projeto={projeto}
            documentos={documentos}
            edital={edital}
            termos={termos}
            setTermos={setTermos}
          />
        )}
        {currentStep === 4 && (
          <Etapa4 projeto={projeto} edital={edital} protocol={protocol} />
        )}
      </main>

      {/* Botões de navegação */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-20">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < 3 && (
              <Button
                onClick={handleProximaEtapa}
                className="bg-primary hover:bg-primary-dark text-white gap-2"
              >
                Próxima etapa
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                onClick={handleEnviarInscricao}
                disabled={!termos || enviando}
                className="bg-primary hover:bg-primary-dark text-white gap-2"
              >
                {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
                {enviando ? "Enviando..." : "Enviar inscrição"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EditaisInscrever;
