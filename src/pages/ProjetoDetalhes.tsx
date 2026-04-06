import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Check,
  Clock,
  FileText,
  Upload,
  Download,
  History,
  Info,
  Loader2,
  PenLine,
  Trophy,
  Play,
  ClipboardList,
  Send,
  Search,
  FilePlus,
} from "lucide-react";
import { toast } from "sonner";
import { getProjetoById, type ProjetoStatus } from "@/data/mockVitrine";

// ── Configuração de status ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProjetoStatus,
  {
    label: string;
    badgeColor: string;
    cardBorder: string;
    cardBg: string;
    titleColor: string;
    emoji: string;
    descricao: string;
    pingColor: string;
  }
> = {
  rascunho: {
    label: "Rascunho",
    badgeColor: "bg-muted/80 text-muted-foreground border-border",
    cardBorder: "border-zinc-400/30",
    cardBg: "bg-zinc-500/5",
    titleColor: "text-zinc-700 dark:text-zinc-300",
    emoji: "✏️",
    descricao: "Seu projeto foi criado mas ainda não foi submetido a nenhum edital.",
    pingColor: "bg-zinc-500",
  },
  submetido: {
    label: "Submetido",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    cardBorder: "border-primary/30",
    cardBg: "bg-primary/5",
    titleColor: "text-pe-blue-dark dark:text-primary/60",
    emoji: "📤",
    descricao: "Sua inscrição foi enviada e aguarda triagem inicial pela SECULT Recife.",
    pingColor: "bg-primary",
  },
  em_analise: {
    label: "Em Análise",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    cardBorder: "border-primary/30",
    cardBg: "bg-primary/5",
    titleColor: "text-violet-800 dark:text-violet-300",
    emoji: "🔍",
    descricao: "Sua inscrição foi recebida pela SECULT Recife e está sendo avaliada.",
    pingColor: "bg-primary",
  },
  aprovado: {
    label: "Aprovado",
    badgeColor: "bg-success/15 text-success-dark border-success/30",
    cardBorder: "border-success/30",
    cardBg: "bg-success/5",
    titleColor: "text-emerald-800 dark:text-emerald-300",
    emoji: "✅",
    descricao: "Parabéns! Seu projeto foi selecionado para financiamento pelo edital.",
    pingColor: "bg-success",
  },
  em_execucao: {
    label: "Em Execução",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    cardBorder: "border-primary/30",
    cardBg: "bg-sky-500/5",
    titleColor: "text-sky-800 dark:text-sky-300",
    emoji: "🎵",
    descricao: "Seu projeto está em andamento. Registre as atividades conforme o cronograma aprovado.",
    pingColor: "bg-sky-500",
  },
  prestacao_enviada: {
    label: "Prestação Enviada",
    badgeColor: "bg-accent/15 text-accent-dark border-accent/30",
    cardBorder: "border-accent/30",
    cardBg: "bg-accent/5",
    titleColor: "text-pe-orange-dark dark:text-accent/60",
    emoji: "📋",
    descricao: "Os documentos de prestação de contas foram enviados e estão sendo verificados.",
    pingColor: "bg-accent",
  },
  concluido: {
    label: "Concluído",
    badgeColor: "bg-success/15 text-pe-green-dark border-success/30",
    cardBorder: "border-success/30",
    cardBg: "bg-success/5",
    titleColor: "text-pe-green-dark dark:text-success/60",
    emoji: "🏆",
    descricao: "Projeto finalizado e aprovado pela SECULT. Certificado disponível para download.",
    pingColor: "bg-success",
  },
};

const STATUS_TO_STEP: Record<ProjetoStatus, number> = {
  rascunho:          1,
  submetido:         2,
  em_analise:        3,
  aprovado:          4,
  em_execucao:       5,
  prestacao_enviada: 6,
  concluido:         7,
};

// ── Documentos e histórico mock ───────────────────────────────────────────────

const DOCUMENTOS = [
  { id: 1, nome: "Portfólio_Projeto.pdf",        data: "05/04/2026", status: "Recebido" },
  { id: 2, nome: "Curriculo_Responsavel.pdf",    data: "05/04/2026", status: "Recebido" },
  { id: 3, nome: "Orcamento_Detalhado.pdf",      data: "08/04/2026", status: "Recebido" },
];

const HISTORICO = [
  { icon: "🔍", data: "10/04", texto: "Inscrição recebida pela SECULT Recife" },
  { icon: "📤", data: "10/04", texto: "Projeto submetido ao edital SIC 2026" },
  { icon: "📝", data: "08/04", texto: "Orçamento detalhado adicionado" },
  { icon: "✏️", data: "05/04", texto: "Projeto criado via IA de Voz" },
];

// ── Componente ────────────────────────────────────────────────────────────────

const ProjetoDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDescricao, setUploadDescricao] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("informacoes");

  const projeto = getProjetoById(id ?? "");

  if (!projeto) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground">Projeto não encontrado.</p>
          <Button variant="outline" onClick={() => navigate("/oportunidades")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentStatus = STATUS_CONFIG[projeto.projetoStatus];
  const currentStepId = STATUS_TO_STEP[projeto.projetoStatus];

  const handleUploadSubmit = async () => {
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSending(false);
    setUploadOpen(false);
    setUploadFile(null);
    setUploadDescricao("");
    toast.success("Documento enviado com sucesso!");
  };

  const handleCloseUpload = () => {
    setUploadOpen(false);
    setUploadFile(null);
    setUploadDescricao("");
  };

  interface StepDef {
    id: number;
    label: string;
    icon: React.ReactNode;
    descricao: string;
    data?: string;
    previsao?: string;
    actionLabel?: string;
    actionHandler?: () => void;
  }

  const steps: StepDef[] = [
    {
      id: 1,
      label: "Rascunho",
      icon: <PenLine className="h-3.5 w-3.5" />,
      descricao: "Projeto criado",
      data: "05/04/2026",
      actionLabel: "Editar projeto",
    },
    {
      id: 2,
      label: "Submetido",
      icon: <Send className="h-3.5 w-3.5" />,
      descricao: "Inscrito no edital SIC 2026 — " + projeto.areaCultural,
      data: "10/04/2026",
      actionLabel: "Cancelar inscrição",
    },
    {
      id: 3,
      label: "Em Análise",
      icon: <Search className="h-3.5 w-3.5" />,
      descricao: "SECULT Recife está avaliando seu projeto",
      previsao: "Resultado até 30/05/2026",
      actionLabel: "Enviar documento adicional",
      actionHandler: () => setUploadOpen(true),
    },
    {
      id: 4,
      label: "Aprovado",
      icon: <Check className="h-3.5 w-3.5" />,
      descricao: "Projeto selecionado para financiamento",
      data: currentStepId >= 4 ? "15/05/2026" : undefined,
      actionLabel: "Assinar contrato digital",
    },
    {
      id: 5,
      label: "Em Execução",
      icon: <Play className="h-3.5 w-3.5" />,
      descricao: "Projeto em andamento",
      data: currentStepId >= 5 ? "01/06/2026" : undefined,
      actionLabel: "Registrar atividade",
    },
    {
      id: 6,
      label: "Prestação Enviada",
      icon: <ClipboardList className="h-3.5 w-3.5" />,
      descricao: "Documentos de prestação de contas enviados",
      data: currentStepId >= 6 ? "10/08/2026" : undefined,
      actionLabel: "Ver prestação de contas",
    },
    {
      id: 7,
      label: "Concluído",
      icon: <Trophy className="h-3.5 w-3.5" />,
      descricao: "Projeto finalizado e aprovado pela SECULT",
      data: currentStepId >= 7 ? "20/08/2026" : undefined,
    },
  ];

  const infoItems = [
    { label: "Artista / Responsável", value: projeto.criadorNome },
    { label: "Linguagem Cultural",    value: projeto.areaCultural },
    { label: "Território",             value: projeto.local },
    { label: "ODS",                    value: "ODS 4 · ODS 8 · ODS 10" },
    {
      label: "Orçamento aprovado",
      value: `R$ ${projeto.metaCaptacao.toLocaleString("pt-BR")}`,
    },
    {
      label: "Edital",
      value: `SIC 2026 — ${projeto.areaCultural} · SECULT Recife`,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => navigate("/oportunidades")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-tight">
                {projeto.titulo}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                SIC 2026 — {projeto.areaCultural} · SECULT Recife
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`shrink-0 mt-1 ${currentStatus.badgeColor}`}>
            {currentStatus.label}
          </Badge>
        </div>

        {/* ── SEÇÃO 1 — Status atual em destaque ── */}
        <Card className={`${currentStatus.cardBorder} ${currentStatus.cardBg}`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl leading-none mt-0.5">{currentStatus.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className={`text-lg font-semibold ${currentStatus.titleColor}`}>
                    {currentStatus.label}
                  </h2>
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatus.pingColor} opacity-75`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${currentStatus.pingColor}`}
                    />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {currentStatus.descricao}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Enviado em 10/04/2026
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SEÇÃO 2 — Linha do tempo ── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Acompanhamento do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <div className="relative">
              <div
                className="absolute left-[18px] top-[22px] w-0.5 bg-border"
                style={{ bottom: "22px" }}
              />

              <div className="space-y-0">
                {steps.map((step, index) => {
                  const isCompleted = step.id < currentStepId;
                  const isCurrent   = step.id === currentStepId;
                  const isFuture    = step.id > currentStepId;
                  const isLast      = index === steps.length - 1;

                  return (
                    <div
                      key={step.id}
                      className={`relative flex gap-5 ${isLast ? "" : "pb-7"}`}
                    >
                      {/* Indicador circular */}
                      <div className="z-10 shrink-0">
                        {isCompleted ? (
                          <div className="w-9 h-9 rounded-full bg-success text-white flex items-center justify-center shadow-sm">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : isCurrent ? (
                          <div className="relative w-9 h-9 flex items-center justify-center">
                            <span
                              className={`animate-ping absolute inline-flex h-9 w-9 rounded-full ${currentStatus.pingColor} opacity-20`}
                            />
                            <div
                              className={`relative w-9 h-9 rounded-full ${currentStatus.pingColor} text-white flex items-center justify-center shadow-md`}
                            >
                              {step.icon}
                            </div>
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full border-2 border-border bg-background flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                              {step.id}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 pt-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`font-semibold text-sm ${
                              isFuture
                                ? "text-muted-foreground"
                                : isCurrent
                                ? currentStatus.titleColor
                                : "text-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          {(isCompleted || (isCurrent && step.data)) && step.data && (
                            <span className="text-xs text-muted-foreground">· {step.data}</span>
                          )}
                        </div>

                        <p
                          className={`text-sm mt-0.5 ${
                            isFuture ? "text-muted-foreground/50" : "text-muted-foreground"
                          }`}
                        >
                          {step.descricao}
                        </p>

                        {isCurrent && step.previsao && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground">{step.previsao}</span>
                          </div>
                        )}

                        {/* Ação do step atual */}
                        {isCurrent && step.actionLabel && step.id !== 7 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 h-8 text-xs gap-1.5"
                            onClick={step.actionHandler}
                          >
                            <Upload className="h-3.5 w-3.5" />
                            {step.actionLabel}
                          </Button>
                        )}

                        {/* Ação especial do step Concluído */}
                        {step.id === 7 && isCurrent && (
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <Badge className="bg-success hover:bg-pe-green-lighter0 text-white text-xs">
                              ✓ Concluído com sucesso
                            </Badge>
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                              <Download className="h-3.5 w-3.5" />
                              Baixar certificado
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SEÇÃO 3 — Abas ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacoes" className="gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="documentos" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-1.5">
              <History className="h-3.5 w-3.5" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Aba Informações */}
          <TabsContent value="informacoes">
            <Card>
              <CardContent className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {infoItems.map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Documentos */}
          <TabsContent value="documentos">
            <Card>
              <CardContent className="p-6 space-y-3">
                {DOCUMENTOS.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{doc.nome}</p>
                        <p className="text-xs text-muted-foreground">{doc.data}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 ml-3 text-success border-success/30 bg-success/10 text-xs"
                    >
                      ✓ {doc.status}
                    </Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 gap-2"
                  onClick={() => setUploadOpen(true)}
                >
                  <FilePlus className="h-4 w-4" />
                  Adicionar documento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Histórico */}
          <TabsContent value="historico">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {HISTORICO.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-lg shrink-0 leading-none mt-0.5">{item.icon}</span>
                      <p className="flex-1 text-sm">{item.texto}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{item.data}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Modal: Enviar documento ── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar documento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-violet-500 bg-primary/5"
                  : uploadFile
                  ? "border-emerald-500 bg-success/5"
                  : "border-border hover:border-muted-foreground/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) setUploadFile(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setUploadFile(f);
                }}
              />
              {uploadFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-success" />
                  <p className="text-sm font-medium">{uploadFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Arraste o arquivo ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG · Máximo 10MB
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc-doc">
                Descrição do documento{" "}
                <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Textarea
                id="desc-doc"
                placeholder="Ex: Memorial descritivo atualizado com cronograma revisado..."
                value={uploadDescricao}
                onChange={(e) => setUploadDescricao(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseUpload}>
              Cancelar
            </Button>
            <Button
              disabled={!uploadFile || isSending}
              onClick={handleUploadSubmit}
              className="bg-primary hover:bg-primary-dark"
            >
              {isSending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Enviar documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProjetoDetalhes;
