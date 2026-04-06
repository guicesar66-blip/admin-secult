import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Heart,
  Share2,
  Briefcase,
  Target,
  FileText,
  Music,
  Film,
  Palette,
  Theater,
  GraduationCap,
  Building,
  Send,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { getProjetoById } from "@/data/mockVitrine";
import AffinityScore from "@/components/AffinityScore";

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento:    { label: "Evento",    icon: <Calendar className="h-5 w-5" />,      color: "bg-warning" },
  vaga:      { label: "Vaga",      icon: <Briefcase className="h-5 w-5" />,     color: "bg-primary" },
  oficina:   { label: "Oficina",   icon: <GraduationCap className="h-5 w-5" />, color: "bg-emerald-500" },
  bairro:    { label: "Bairro",    icon: <Building className="h-5 w-5" />,      color: "bg-primary" },
  ep:        { label: "EP/Álbum",  icon: <Music className="h-5 w-5" />,         color: "bg-pink-500" },
  filme:     { label: "Filme/Doc", icon: <Film className="h-5 w-5" />,          color: "bg-cyan-500" },
  festival:  { label: "Festival",  icon: <Users className="h-5 w-5" />,         color: "bg-violet-500" },
  exposicao: { label: "Exposição", icon: <Palette className="h-5 w-5" />,       color: "bg-emerald-500" },
  teatro:    { label: "Teatro",    icon: <Theater className="h-5 w-5" />,       color: "bg-accent" },
};

const contrapartidasOptions = [
  { id: "logo_material", label: "Logomarca em materiais de divulgação" },
  { id: "creditos",      label: "Créditos no projeto final" },
  { id: "ingressos",     label: "Ingressos ou acessos VIP" },
  { id: "networking",    label: "Acesso a eventos de networking" },
  { id: "relatorio",     label: "Relatório de impacto personalizado" },
  { id: "mencao_midia",  label: "Menção em entrevistas e mídia" },
  { id: "estande_venda", label: "Estande de venda" },
  { id: "compra_exclusiva", label: "Compra exclusiva de fornecedor" },
  { id: "divulgacao_marca", label: "Divulgação de marca no evento" },
];

type TipoInvestidor = "pessoa_fisica" | "empresa" | "instituicao";
type TipoApoio = "financeiro" | "servico" | "misto";

interface PropostaData {
  tipoInvestidor: TipoInvestidor;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  tipoApoio: TipoApoio;
  valorFinanceiro: string;
  descricaoServico: string;
  contrapartidas: string[];
  mensagem: string;
  aceitaTermos: boolean;
}

const PROPOSTA_INICIAL: PropostaData = {
  tipoInvestidor: "pessoa_fisica",
  nome: "",
  email: "",
  telefone: "",
  empresa: "",
  tipoApoio: "financeiro",
  valorFinanceiro: "",
  descricaoServico: "",
  contrapartidas: [],
  mensagem: "",
  aceitaTermos: false,
};

const VitrineDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [step, setStep] = useState(1);
  const [proposta, setProposta] = useState<PropostaData>(PROPOSTA_INICIAL);
  const [enviando, setEnviando] = useState(false);

  const projeto = id ? getProjetoById(id) : undefined;
  const config = projeto ? tipoConfig[projeto.tipo] || tipoConfig.evento : tipoConfig.evento;
  const percentCaptado =
    projeto && projeto.metaCaptacao > 0
      ? (projeto.captacaoAtual / projeto.metaCaptacao) * 100
      : 0;

  const totalSteps = 4;
  const stepTitles = ["Seus Dados", "Tipo de Apoio", "Contrapartidas", "Confirmação"];

  const canAdvance = () => {
    switch (step) {
      case 1: return !!(proposta.tipoInvestidor && proposta.nome && proposta.email);
      case 2: return !!(proposta.tipoApoio && (
        proposta.tipoApoio === "servico" ? proposta.descricaoServico : proposta.valorFinanceiro
      ));
      case 3: return proposta.contrapartidas.length > 0;
      case 4: return proposta.aceitaTermos;
      default: return true;
    }
  };

  const handleOpenDialog = () => {
    setStep(1);
    setProposta(PROPOSTA_INICIAL);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    setEnviando(true);
    // Simula envio com delay
    await new Promise((r) => setTimeout(r, 1200));
    setEnviando(false);
    setShowDialog(false);
    toast.success("Proposta enviada com sucesso!", {
      description: `Sua proposta para "${projeto?.titulo}" foi recebida e será analisada pelo responsável.`,
    });
  };

  const toggleContrapartida = (id: string, checked: boolean) => {
    setProposta((prev) => ({
      ...prev,
      contrapartidas: checked
        ? [...prev.contrapartidas, id]
        : prev.contrapartidas.filter((c) => c !== id),
    }));
  };

  if (!projeto) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
          <p className="text-muted-foreground mb-4">Este projeto não está disponível na vitrine.</p>
          <Button onClick={() => navigate("/dashboard")}>Voltar à Vitrine</Button>
        </div>
      </DashboardLayout>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-base font-semibold mb-3 block">Tipo de Investidor</Label>
              <RadioGroup
                value={proposta.tipoInvestidor}
                onValueChange={(v) => setProposta({ ...proposta, tipoInvestidor: v as TipoInvestidor })}
                className="grid grid-cols-3 gap-3"
              >
                {(["pessoa_fisica", "empresa", "instituicao"] as const).map((tipo) => (
                  <Label
                    key={tipo}
                    htmlFor={tipo}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                      proposta.tipoInvestidor === tipo ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem value={tipo} id={tipo} className="sr-only" />
                    {tipo === "pessoa_fisica" && <User className="h-6 w-6" />}
                    {tipo === "empresa"       && <Building2 className="h-6 w-6" />}
                    {tipo === "instituicao"   && <Heart className="h-6 w-6" />}
                    <span className="text-sm font-medium text-center leading-tight">
                      {tipo === "pessoa_fisica" ? "Pessoa Física" : tipo === "empresa" ? "Empresa" : "Instituição"}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="nome">Nome completo *</Label>
                <Input id="nome" value={proposta.nome} onChange={(e) => setProposta({ ...proposta, nome: e.target.value })} placeholder="Seu nome" />
              </div>
              {proposta.tipoInvestidor !== "pessoa_fisica" && (
                <div>
                  <Label htmlFor="empresa-field">
                    Nome da {proposta.tipoInvestidor === "empresa" ? "Empresa" : "Instituição"}
                  </Label>
                  <Input
                    id="empresa-field"
                    value={proposta.empresa}
                    onChange={(e) => setProposta({ ...proposta, empresa: e.target.value })}
                    placeholder={`Nome da ${proposta.tipoInvestidor === "empresa" ? "empresa" : "instituição"}`}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" value={proposta.email} onChange={(e) => setProposta({ ...proposta, email: e.target.value })} placeholder="seu@email.com" />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={proposta.telefone} onChange={(e) => setProposta({ ...proposta, telefone: e.target.value })} placeholder="(00) 00000-0000" />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-base font-semibold mb-3 block">Tipo de Apoio</Label>
              <RadioGroup
                value={proposta.tipoApoio}
                onValueChange={(v) => setProposta({ ...proposta, tipoApoio: v as TipoApoio })}
                className="grid grid-cols-3 gap-3"
              >
                {([
                  { v: "financeiro", icon: <DollarSign className="h-6 w-6 text-emerald-500" />, label: "Financeiro" },
                  { v: "servico",    icon: <Briefcase className="h-6 w-6 text-primary" />,    label: "Serviço" },
                  { v: "misto",      icon: <Sparkles className="h-6 w-6 text-accent" />,    label: "Misto" },
                ] as const).map(({ v, icon, label }) => (
                  <Label
                    key={v}
                    htmlFor={v}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                      proposta.tipoApoio === v ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem value={v} id={v} className="sr-only" />
                    {icon}
                    <span className="text-sm font-medium">{label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            {(proposta.tipoApoio === "financeiro" || proposta.tipoApoio === "misto") && (
              <div>
                <Label htmlFor="valor">Valor do investimento *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <Input id="valor" value={proposta.valorFinanceiro} onChange={(e) => setProposta({ ...proposta, valorFinanceiro: e.target.value })} placeholder="0,00" className="pl-10" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Meta: R$ {projeto.metaCaptacao.toLocaleString("pt-BR")} | Faltam: R$ {(projeto.metaCaptacao - projeto.captacaoAtual).toLocaleString("pt-BR")}
                </p>
              </div>
            )}
            {(proposta.tipoApoio === "servico" || proposta.tipoApoio === "misto") && (
              <div>
                <Label htmlFor="descricao-servico">Descrição do serviço *</Label>
                <Textarea id="descricao-servico" value={proposta.descricaoServico} onChange={(e) => setProposta({ ...proposta, descricaoServico: e.target.value })} placeholder="Descreva o serviço ou recurso que você pode oferecer..." rows={4} />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-1 block">Contrapartidas Desejadas</Label>
              <p className="text-sm text-muted-foreground mb-4">Selecione as contrapartidas que gostaria de receber em troca do apoio</p>
              <div className="grid gap-3">
                {contrapartidasOptions.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={`cp-${option.id}`}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      proposta.contrapartidas.includes(option.id) ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
                    }`}
                  >
                    <Checkbox
                      id={`cp-${option.id}`}
                      checked={proposta.contrapartidas.includes(option.id)}
                      onCheckedChange={(c) => toggleContrapartida(option.id, c as boolean)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <Label htmlFor="mensagem">Mensagem para o responsável (opcional)</Label>
              <Textarea id="mensagem" value={proposta.mensagem} onChange={(e) => setProposta({ ...proposta, mensagem: e.target.value })} placeholder="Conte um pouco sobre você e por que deseja apoiar este projeto..." rows={4} />
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2.5">
              <h4 className="font-semibold flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Resumo da proposta
              </h4>
              <div className="grid gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investidor:</span>
                  <span className="font-medium">{proposta.nome}{proposta.empresa ? ` — ${proposta.empresa}` : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de apoio:</span>
                  <span className="font-medium capitalize">{proposta.tipoApoio}</span>
                </div>
                {proposta.valorFinanceiro && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-medium text-emerald-500">R$ {proposta.valorFinanceiro}</span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Contrapartidas:</span>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                    {proposta.contrapartidas.map((c) => (
                      <Badge key={c} variant="secondary" className="text-[10px]">
                        {contrapartidasOptions.find((o) => o.id === c)?.label.split(" ")[0]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="termos"
                checked={proposta.aceitaTermos}
                onCheckedChange={(c) => setProposta({ ...proposta, aceitaTermos: c as boolean })}
              />
              <Label htmlFor="termos" className="text-sm leading-relaxed cursor-pointer">
                Declaro que li e concordo com os termos de investimento e entendo que esta é uma proposta inicial que será analisada pelo responsável do projeto.
              </Label>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
            Voltar à Vitrine
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setLiked(!liked)}>
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-error" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Banner */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
          <img src={projeto.imagem} alt={projeto.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badge de tipo */}
          <Badge className={`absolute top-4 left-4 ${config.color} text-white border-0 flex items-center gap-1`}>
            {config.icon}
            <span className="ml-1">{config.label}</span>
          </Badge>

          {/* AffinityScore no banner */}
          <div className="absolute top-4 right-4">
            <AffinityScore score={projeto.affinityScore} size={72} />
          </div>

          {/* Título sobre o banner */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {projeto.areaCultural && (
              <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-white/30">
                {projeto.areaCultural}
              </Badge>
            )}
            <h1 className="text-3xl font-bold text-white drop-shadow">{projeto.titulo}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/80">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {projeto.local}
              </div>
              {projeto.dataEvento && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(projeto.dataEvento).toLocaleDateString("pt-BR")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sobre o Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{projeto.descricao}</p>
              </CardContent>
            </Card>

            {projeto.incentivosLeis && projeto.incentivosLeis.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-5 w-5" />
                    Leis de Incentivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Este projeto se enquadra nas seguintes leis de incentivo cultural:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {projeto.incentivosLeis.map((lei) => (
                        <Badge key={lei.id} variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 transition-colors">
                          {lei.label}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                      <p className="text-xs text-pe-blue-dark">
                        <strong>Dica:</strong> Estas leis permitem que pessoas físicas e empresas façam deduções fiscais ao investir em projetos culturais enquadrados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Por que {projeto.affinityScore}% de afinidade?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {Object.values(projeto.affinityBreakdown).map((dim) => {
                  const color =
                    dim.value > 80
                      ? "text-emerald-600"
                      : dim.value >= 60
                      ? "text-accent-dark"
                      : "text-error";
                  const progressColor =
                    dim.value > 80
                      ? "[&>div]:bg-emerald-500"
                      : dim.value >= 60
                      ? "[&>div]:bg-accent"
                      : "[&>div]:bg-error";
                  return (
                    <div key={dim.label} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dim.label}</span>
                        <span className={`text-sm font-bold ${color}`}>{dim.value}%</span>
                      </div>
                      <Progress value={dim.value} className={`h-2 ${progressColor}`} />
                      <p className="text-xs text-muted-foreground">{dim.descricao}</p>
                    </div>
                  );
                })}
                {projeto.vagas > 0 && (
                  <div className="pt-2 border-t flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Público esperado: <strong className="text-foreground">{projeto.vagas} pessoas</strong></span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="border-primary/30 sticky top-20">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-500">
                    R$ {projeto.captacaoAtual.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    captado de R$ {projeto.metaCaptacao.toLocaleString("pt-BR")}
                  </p>
                </div>

                <Progress value={Math.min(percentCaptado, 100)} className="h-3" />

                <div className="grid grid-cols-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{percentCaptado.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">financiado</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{projeto.totalPropostas}</p>
                    <p className="text-xs text-muted-foreground">propostas</p>
                  </div>
                </div>

                <Button className="w-full gap-2" size="lg" onClick={handleOpenDialog}>
                  <DollarSign className="h-5 w-5" />
                  Investir neste Projeto
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Sua proposta será analisada pelo responsável do projeto
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Responsável pelo Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{projeto.criadorNome.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{projeto.criadorNome}</p>
                    <p className="text-sm text-muted-foreground">Produtor(a) Cultural</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de Investimento */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Investir em {projeto.titulo}
            </DialogTitle>
            <DialogDescription>
              Passo {step} de {totalSteps}: {stepTitles[step - 1]}
            </DialogDescription>
          </DialogHeader>

          {/* Barra de progresso */}
          <div className="py-1">
            <Progress value={(step / totalSteps) * 100} className="h-1.5" />
            <div className="flex justify-between mt-1.5">
              {stepTitles.map((title, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] ${idx + 1 <= step ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  {idx + 1}. {title}
                </span>
              ))}
            </div>
          </div>

          {renderStep()}

          <DialogFooter className="gap-2 sm:gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canAdvance()}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canAdvance() || enviando}>
                {enviando ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Proposta
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VitrineDetalhes;
