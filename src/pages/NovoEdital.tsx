import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Save,
  Rocket,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

// ── Constantes ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Dados Básicos" },
  { id: 2, label: "Critérios" },
  { id: 3, label: "Orçamento e Prazos" },
  { id: 4, label: "Revisão" },
];

const ODS_LIST = [
  { id: "1",  label: "Pobreza" },
  { id: "2",  label: "Fome" },
  { id: "3",  label: "Saúde" },
  { id: "4",  label: "Educação" },
  { id: "5",  label: "Gênero" },
  { id: "6",  label: "Água" },
  { id: "7",  label: "Energia" },
  { id: "8",  label: "Trabalho" },
  { id: "9",  label: "Inovação" },
  { id: "10", label: "Desigualdade" },
  { id: "11", label: "Cidades" },
  { id: "12", label: "Consumo" },
  { id: "13", label: "Clima" },
  { id: "14", label: "Oceanos" },
  { id: "15", label: "Terra" },
  { id: "16", label: "Paz" },
  { id: "17", label: "Parcerias" },
];

const LINGUAGENS = [
  "Todas as linguagens",
  "Música",
  "Teatro",
  "Dança",
  "Artes Visuais",
  "Audiovisual",
  "Cultura Popular",
  "Literatura",
  "Circo",
];

const TERRITORIOS = [
  "Pernambuco (todo o estado)",
  "Recife",
  "RMR",
  "Interior de PE",
  "Nacional",
  "Internacional",
];

const PERFIS = [
  { id: "artistas",   label: "Artistas individuais" },
  { id: "coletivos",  label: "Coletivos culturais" },
  { id: "mei",        label: "MEI (Microempreendedor Individual)" },
  { id: "pj",         label: "Pessoa Jurídica (CNPJ)" },
  { id: "osc",        label: "Organizações da sociedade civil" },
];

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface EditalData {
  tipo: "publico" | "privado" | null;
  titulo: string;
  descricao: string;
  linguagem: string;
  ods: string[];
  territorio: string;
  documentosExigidos: string;
  criteriosAvaliacao: string;
  numProjetos: string;
  perfilProponente: string[];
  valorTotal: string;
  valorMaxProjeto: string;
  dataAbertura: string;
  dataEncerramento: string;
  dataDivulgacao: string;
  dataInicioExecucao: string;
  dataFimExecucao: string;
}

const INITIAL_DATA: EditalData = {
  tipo: null,
  titulo: "",
  descricao: "",
  linguagem: "",
  ods: [],
  territorio: "",
  documentosExigidos: "",
  criteriosAvaliacao: "",
  numProjetos: "",
  perfilProponente: [],
  valorTotal: "",
  valorMaxProjeto: "",
  dataAbertura: "",
  dataEncerramento: "",
  dataDivulgacao: "",
  dataInicioExecucao: "",
  dataFimExecucao: "",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const parseCurrency = (val: string) => {
  const n = parseInt(val.replace(/\D/g, ""), 10);
  return isNaN(n) ? 0 : n;
};

const formatBRL = (val: string) => {
  const n = parseCurrency(val);
  if (n === 0) return "";
  return n.toLocaleString("pt-BR");
};

const formatBRLDisplay = (val: string) => {
  const n = parseCurrency(val);
  if (n === 0) return "R$ 0";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDate = (iso: string) => {
  if (!iso) return "–";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const daysBetween = (a: string, b: string) => {
  if (!a || !b) return null;
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000
  );
};

// ── Sub-componente: barra de progresso ───────────────────────────────────────

const ProgressBar = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-start mb-8">
    {STEPS.map((s, i) => (
      <Fragment key={s.id}>
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              currentStep > s.id
                ? "bg-emerald-500 text-white shadow-sm"
                : currentStep === s.id
                ? "bg-violet-600 text-white shadow-md"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > s.id ? <Check className="h-4 w-4" /> : s.id}
          </div>
          <span
            className={`text-xs font-medium text-center whitespace-nowrap ${
              currentStep === s.id
                ? "text-violet-700 dark:text-violet-400"
                : "text-muted-foreground"
            }`}
          >
            {s.label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`flex-1 h-0.5 mt-4 mx-2 transition-all ${
              currentStep > s.id ? "bg-emerald-500" : "bg-border"
            }`}
          />
        )}
      </Fragment>
    ))}
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────────

const NovoEdital = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [data, setData] = useState<EditalData>(INITIAL_DATA);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAllDocs, setShowAllDocs] = useState(false);

  const update = (patch: Partial<EditalData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const label = data.tipo === "privado" ? "Chamada" : "Edital";

  // Validações por etapa
  const isStep1Valid =
    data.titulo.trim().length > 0 &&
    data.descricao.trim().length >= 100 &&
    data.linguagem.length > 0;

  const isStep2Valid =
    data.documentosExigidos.trim().length > 0 &&
    data.numProjetos.length > 0 &&
    parseInt(data.numProjetos) >= 1;

  const encrAtAbr =
    data.dataAbertura &&
    data.dataEncerramento &&
    data.dataEncerramento < data.dataAbertura;

  const isStep3Valid =
    data.valorTotal.length > 0 &&
    data.valorMaxProjeto.length > 0 &&
    data.dataAbertura.length > 0 &&
    data.dataEncerramento.length > 0 &&
    !encrAtAbr;

  const canGoNext =
    step === 1 ? isStep1Valid :
    step === 2 ? isStep2Valid :
    step === 3 ? isStep3Valid :
    true;

  // Cálculo de projetos possíveis
  const totalNum = parseCurrency(data.valorTotal);
  const maxNum   = parseCurrency(data.valorMaxProjeto);
  const possiveisProjetos = totalNum > 0 && maxNum > 0 ? Math.floor(totalNum / maxNum) : null;

  // Aviso de período curto
  const diasInscricao = daysBetween(data.dataAbertura, data.dataEncerramento);
  const periodoAlerta = diasInscricao !== null && diasInscricao < 15 && diasInscricao >= 0;

  // Handlers
  const handleBack = () => {
    if (step <= 1) navigate("/oportunidades");
    else setStep((s) => s - 1);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success(`${label} salvo como rascunho!`);
    navigate("/oportunidades");
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsPublishing(false);
    setSuccessOpen(true);
  };

  const handleToggleOds = (id: string) => {
    update({
      ods: data.ods.includes(id)
        ? data.ods.filter((o) => o !== id)
        : [...data.ods, id],
    });
  };

  const handleTogglePerfil = (id: string) => {
    update({
      perfilProponente: data.perfilProponente.includes(id)
        ? data.perfilProponente.filter((p) => p !== id)
        : [...data.perfilProponente, id],
    });
  };

  // ── STEP 0 — Seleção do tipo ──────────────────────────────────────────────

  const renderStep0 = () => (
    <div className="max-w-xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Criar novo edital</h1>
        <p className="text-muted-foreground mt-1">
          Selecione o tipo de chamada que deseja publicar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Edital Público */}
        <button
          type="button"
          onClick={() => update({ tipo: "publico" })}
          className={`text-left p-5 rounded-xl border-2 transition-all space-y-3 hover:border-violet-400 hover:bg-violet-500/3 ${
            data.tipo === "publico"
              ? "border-violet-500 bg-violet-500/5"
              : "border-border bg-card"
          }`}
        >
          <span className="text-4xl">🏛️</span>
          <div>
            <p className="font-semibold text-base">Edital Público</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Para secretarias de cultura. Financiamento com recursos públicos.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            SECULT · Prefeituras · Estado
          </Badge>
        </button>

        {/* Chamada Privada */}
        <button
          type="button"
          onClick={() => update({ tipo: "privado" })}
          className={`text-left p-5 rounded-xl border-2 transition-all space-y-3 hover:border-violet-400 hover:bg-violet-500/3 ${
            data.tipo === "privado"
              ? "border-violet-500 bg-violet-500/5"
              : "border-border bg-card"
          }`}
        >
          <span className="text-4xl">🏢</span>
          <div>
            <p className="font-semibold text-base">Chamada Privada</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Para empresas. Patrocínio cultural com critérios de ESG.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Empresas · Marcas · Institutos
          </Badge>
        </button>
      </div>

      <Button
        className="w-full gap-2 bg-violet-600 hover:bg-violet-700"
        disabled={!data.tipo}
        onClick={() => setStep(1)}
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );

  // ── STEP 1 — Dados Básicos ────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-5">
      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="titulo">
          Título <span className="text-destructive">*</span>
        </Label>
        <Input
          id="titulo"
          placeholder={`Ex: SIC 2026 — Linguagem Música`}
          value={data.titulo}
          onChange={(e) => update({ titulo: e.target.value })}
        />
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="descricao">
            Descrição <span className="text-destructive">*</span>
          </Label>
          <span
            className={`text-xs ${
              data.descricao.length < 100
                ? "text-muted-foreground"
                : "text-emerald-600"
            }`}
          >
            {data.descricao.length}/2000
            {data.descricao.length < 100 && ` (mín. 100)`}
          </span>
        </div>
        <Textarea
          id="descricao"
          rows={5}
          maxLength={2000}
          placeholder="Descreva o objetivo, público-alvo e impacto esperado do edital..."
          value={data.descricao}
          onChange={(e) => update({ descricao: e.target.value })}
        />
        {data.descricao.length > 0 && data.descricao.length < 100 && (
          <p className="text-xs text-accent-dark">
            Faltam {100 - data.descricao.length} caracteres para o mínimo.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Linguagem */}
        <div className="space-y-1.5">
          <Label>
            Linguagem Artística <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.linguagem}
            onValueChange={(v) => update({ linguagem: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma linguagem" />
            </SelectTrigger>
            <SelectContent>
              {LINGUAGENS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Território */}
        <div className="space-y-1.5">
          <Label>Território de abrangência</Label>
          <Select
            value={data.territorio}
            onValueChange={(v) => update({ territorio: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o território" />
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
      </div>

      {/* ODS */}
      <div className="space-y-2.5">
        <Label>ODS relacionados</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {ODS_LIST.map((ods) => (
            <label
              key={ods.id}
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                data.ods.includes(ods.id)
                  ? "border-violet-500 bg-violet-500/5 text-violet-700"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <Checkbox
                checked={data.ods.includes(ods.id)}
                onCheckedChange={() => handleToggleOds(ods.id)}
                className="shrink-0"
              />
              <span className="font-medium">{ods.id}·</span>
              <span className="truncate">{ods.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // ── STEP 2 — Critérios ────────────────────────────────────────────────────

  const renderStep2 = () => (
    <div className="space-y-5">
      {/* Documentos exigidos */}
      <div className="space-y-1.5">
        <Label htmlFor="docs">
          Documentos exigidos <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="docs"
          rows={5}
          placeholder={`Liste os documentos necessários para inscrição.\nEx:\n- Portfólio atualizado (PDF, máx 10MB)\n- Currículo do responsável\n- Orçamento detalhado por categoria`}
          value={data.documentosExigidos}
          onChange={(e) => update({ documentosExigidos: e.target.value })}
        />
      </div>

      {/* Critérios de avaliação */}
      <div className="space-y-1.5">
        <Label htmlFor="criterios">Critérios de avaliação e pesos</Label>
        <Textarea
          id="criterios"
          rows={5}
          placeholder={`Descreva como os projetos serão avaliados.\nEx:\n- Originalidade e inovação: 30%\n- Impacto social e cultural: 40%\n- Viabilidade técnica e orçamentária: 30%`}
          value={data.criteriosAvaliacao}
          onChange={(e) => update({ criteriosAvaliacao: e.target.value })}
        />
      </div>

      {/* Número de projetos */}
      <div className="space-y-1.5 max-w-xs">
        <Label htmlFor="num-projetos">
          Número de projetos a selecionar{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="num-projetos"
          type="number"
          min={1}
          max={999}
          placeholder="Ex: 10"
          value={data.numProjetos}
          onChange={(e) => update({ numProjetos: e.target.value })}
        />
      </div>

      {/* Perfil do proponente */}
      <div className="space-y-2.5">
        <Label>Perfil do proponente</Label>
        <div className="space-y-2">
          {PERFIS.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                checked={data.perfilProponente.includes(p.id)}
                onCheckedChange={() => handleTogglePerfil(p.id)}
              />
              <span className="text-sm">{p.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // ── STEP 3 — Orçamento e Prazos ───────────────────────────────────────────

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Valores */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Orçamento
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Valor total */}
          <div className="space-y-1.5">
            <Label htmlFor="valor-total">
              Valor total disponível{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-ring">
              <span className="px-3 py-2 bg-muted text-muted-foreground text-sm border-r select-none">
                R$
              </span>
              <input
                id="valor-total"
                className="flex-1 px-3 py-2 text-sm bg-background outline-none"
                placeholder="0"
                value={data.valorTotal ? formatBRL(data.valorTotal) : ""}
                onChange={(e) =>
                  update({ valorTotal: e.target.value.replace(/\D/g, "") })
                }
              />
            </div>
          </div>

          {/* Valor máximo por projeto */}
          <div className="space-y-1.5">
            <Label htmlFor="valor-max">
              Valor máximo por projeto{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center rounded-md border overflow-hidden focus-within:ring-2 focus-within:ring-ring">
              <span className="px-3 py-2 bg-muted text-muted-foreground text-sm border-r select-none">
                R$
              </span>
              <input
                id="valor-max"
                className="flex-1 px-3 py-2 text-sm bg-background outline-none"
                placeholder="0"
                value={data.valorMaxProjeto ? formatBRL(data.valorMaxProjeto) : ""}
                onChange={(e) =>
                  update({ valorMaxProjeto: e.target.value.replace(/\D/g, "") })
                }
              />
            </div>
          </div>
        </div>

        {/* Cálculo dinâmico */}
        {possiveisProjetos !== null && (
          <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 text-sm text-violet-700 dark:text-violet-400">
            Com {formatBRLDisplay(data.valorTotal)} total e máximo{" "}
            {formatBRLDisplay(data.valorMaxProjeto)} por projeto, é possível
            financiar até{" "}
            <strong>{possiveisProjetos}</strong>{" "}
            {possiveisProjetos === 1 ? "projeto" : "projetos"}.
          </div>
        )}
      </div>

      {/* Prazos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Prazos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="data-abertura">
              Abertura das inscrições{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="data-abertura"
              type="date"
              value={data.dataAbertura}
              onChange={(e) => update({ dataAbertura: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="data-encerramento">
              Encerramento das inscrições{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="data-encerramento"
              type="date"
              value={data.dataEncerramento}
              onChange={(e) => update({ dataEncerramento: e.target.value })}
              min={data.dataAbertura || undefined}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="data-resultado">Divulgação dos resultados</Label>
            <Input
              id="data-resultado"
              type="date"
              value={data.dataDivulgacao}
              onChange={(e) => update({ dataDivulgacao: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="data-inicio">Início da execução dos projetos</Label>
            <Input
              id="data-inicio"
              type="date"
              value={data.dataInicioExecucao}
              onChange={(e) => update({ dataInicioExecucao: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="data-fim">Fim da execução dos projetos</Label>
            <Input
              id="data-fim"
              type="date"
              value={data.dataFimExecucao}
              onChange={(e) => update({ dataFimExecucao: e.target.value })}
            />
          </div>
        </div>

        {/* Validação: encerramento antes da abertura */}
        {encrAtAbr && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            O encerramento não pode ser anterior à abertura das inscrições.
          </div>
        )}

        {/* Aviso de período curto */}
        {periodoAlerta && !encrAtAbr && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent-dark dark:text-accent">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            Recomendamos pelo menos 15 dias para inscrições. O período atual
            é de {diasInscricao} {diasInscricao === 1 ? "dia" : "dias"}.
          </div>
        )}
      </div>
    </div>
  );

  // ── STEP 4 — Revisão ──────────────────────────────────────────────────────

  const renderStep4 = () => {
    const docsLines = data.documentosExigidos
      .split("\n")
      .filter((l) => l.trim());
    const docsToShow = showAllDocs ? docsLines : docsLines.slice(0, 2);

    const perfisLabels = PERFIS.filter((p) =>
      data.perfilProponente.includes(p.id)
    ).map((p) => p.label);

    return (
      <div className="space-y-4">
        <div className="mb-2">
          <h2 className="text-lg font-semibold">Revise antes de publicar</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Após publicar, o {label.toLowerCase()} ficará visível para todos os
            artistas cadastrados na CENA.
          </p>
        </div>

        {/* Card Dados Básicos */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Dados Básicos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <span className="text-muted-foreground">Tipo: </span>
                <span className="font-medium">
                  {data.tipo === "publico" ? "Edital Público" : "Chamada Privada"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Linguagem: </span>
                <span className="font-medium">{data.linguagem || "–"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Título: </span>
                <span className="font-medium">{data.titulo || "–"}</span>
              </div>
              {data.territorio && (
                <div>
                  <span className="text-muted-foreground">Território: </span>
                  <span className="font-medium">{data.territorio}</span>
                </div>
              )}
            </div>
            {data.ods.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.ods.map((id) => (
                  <Badge
                    key={id}
                    variant="outline"
                    className="text-xs bg-violet-500/10 border-violet-500/30 text-violet-700"
                  >
                    ODS {id}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Critérios */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Critérios
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">
                Projetos a selecionar:{" "}
              </span>
              <span className="font-medium">{data.numProjetos || "–"}</span>
            </div>
            {docsLines.length > 0 && (
              <div>
                <span className="text-muted-foreground block mb-1">
                  Documentos exigidos:
                </span>
                <ul className="space-y-0.5 text-muted-foreground">
                  {docsToShow.map((l, i) => (
                    <li key={i} className="text-xs">{l}</li>
                  ))}
                </ul>
                {docsLines.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllDocs((v) => !v)}
                    className="text-xs text-violet-600 hover:underline mt-1"
                  >
                    {showAllDocs
                      ? "ver menos"
                      : `+ ${docsLines.length - 2} linha(s)`}
                  </button>
                )}
              </div>
            )}
            {perfisLabels.length > 0 && (
              <div>
                <span className="text-muted-foreground block mb-1">
                  Perfil do proponente:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {perfisLabels.map((l) => (
                    <Badge key={l} variant="secondary" className="text-xs">
                      {l}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Orçamento e Prazos */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Orçamento e Prazos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Valor total: </span>
              <span className="font-medium">
                {formatBRLDisplay(data.valorTotal)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Por projeto: </span>
              <span className="font-medium">
                {formatBRLDisplay(data.valorMaxProjeto)}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Inscrições: </span>
              <span className="font-medium">
                {formatDate(data.dataAbertura)} até{" "}
                {formatDate(data.dataEncerramento)}
              </span>
            </div>
            {data.dataDivulgacao && (
              <div>
                <span className="text-muted-foreground">Resultado: </span>
                <span className="font-medium">
                  {formatDate(data.dataDivulgacao)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // ── Rodapé de navegação (steps 1–4) ──────────────────────────────────────

  const renderFooter = () => {
    if (step === 4) {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 mr-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Editar informações
          </button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar como rascunho
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="gap-2 bg-violet-600 hover:bg-violet-700"
          >
            {isPublishing ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            Publicar {label}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {step === 1 ? "Cancelar" : "Voltar"}
        </Button>
        <Button
          onClick={() => setStep((s) => s + 1)}
          disabled={!canGoNext}
          className="gap-2 bg-violet-600 hover:bg-violet-700"
        >
          Próxima etapa
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // ── Modal de sucesso ──────────────────────────────────────────────────────

  const renderSuccessModal = () => (
    <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Ícone */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-emerald-500" />
          </div>

          {/* Título */}
          <div>
            <h2 className="text-xl font-bold">{label} publicado com sucesso!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {data.titulo || `${label} sem título`} já está visível para os
              artistas cadastrados.
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-3 w-full border rounded-xl p-4 bg-muted/30">
            <div className="text-center">
              <p className="text-lg font-bold">34.000</p>
              <p className="text-xs text-muted-foreground">artistas notificados</p>
            </div>
            <div className="text-center border-x">
              <p className="text-lg font-bold">
                {data.valorTotal
                  ? `R$ ${formatBRL(data.valorTotal)}`
                  : "R$ 0"}
              </p>
              <p className="text-xs text-muted-foreground">disponíveis</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">
                {data.dataEncerramento
                  ? formatDate(data.dataEncerramento)
                  : "–"}
              </p>
              <p className="text-xs text-muted-foreground">prazo final</p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2 w-full">
            <Button
              className="w-full bg-violet-600 hover:bg-violet-700"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/oportunidades");
              }}
            >
              Ver {label.toLowerCase()} publicado
            </Button>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSuccessOpen(false);
                setData(INITIAL_DATA);
                setStep(0);
              }}
            >
              Publicar outro {label.toLowerCase()}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ── Render principal ──────────────────────────────────────────────────────

  const stepTitles: Record<number, string> = {
    1: "Dados Básicos",
    2: "Critérios de Seleção",
    3: "Orçamento e Prazos",
    4: "Revisão e Publicação",
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto pb-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              step === 0 ? navigate("/oportunidades") : setStep(0)
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              {step === 0
                ? "Novo Edital / Chamada"
                : `Criar ${label} — ${stepTitles[step]}`}
            </h1>
            {step > 0 && data.titulo && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {data.titulo}
              </p>
            )}
          </div>
        </div>

        {step === 0 ? (
          renderStep0()
        ) : (
          <>
            {/* Barra de progresso */}
            <ProgressBar currentStep={step} />

            {/* Conteúdo da etapa */}
            <Card>
              <CardContent className="p-6">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
              </CardContent>
            </Card>

            {/* Rodapé de navegação */}
            <div className="mt-4">{renderFooter()}</div>
          </>
        )}
      </div>

      {renderSuccessModal()}
    </DashboardLayout>
  );
};

export default NovoEdital;
