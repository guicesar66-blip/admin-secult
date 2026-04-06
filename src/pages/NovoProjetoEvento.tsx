import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Check, 
  Calendar,
  FileText,
  MapPin,
  Music,
  Users,
  Megaphone,
  Accessibility,
  DollarSign,
  Package,
  Trophy,
  Eye,
  Loader2,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { 
  EventoWizardData, 
  EVENTO_WIZARD_INITIAL_STATE,
  EVENTO_WIZARD_STEPS,
  validateEventoStep1,
  validateEventoStep2,
  validateEventoStep3,
  validateEventoStep4,
  validateEventoStep5,
  validateEventoStep6,
  validateEventoStep7,
  validateEventoStep8,
  validateEventoStep9,
  validateEventoStep10,
} from "@/types/evento-wizard";
import { 
  StepInformacoesBasicas, 
  StepDataLocal, 
  StepProgramacao, 
  StepVagasArtistas,
  StepDivulgacaoEvento,
  StepAcessibilidadeEvento,
  StepPublicoEquipe,
  StepCustosEvento,
  StepInfraestrutura,
  StepResultadosEvento,
  StepPreviewEvento,
} from "@/components/evento-wizard";

const STEP_ICONS: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-4 w-4" />,
  MapPin: <MapPin className="h-4 w-4" />,
  Music: <Music className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  Accessibility: <Accessibility className="h-4 w-4" />,
  DollarSign: <DollarSign className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  Trophy: <Trophy className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />,
};

const NovoProjetoEvento = () => {
  const navigate = useNavigate();

  const [wizardData, setWizardData] = useState<EventoWizardData>(EVENTO_WIZARD_INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStepReached, setHighestStepReached] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [exibirVitrine, setExibirVitrine] = useState(true);
  const [mostrarProgresso, setMostrarProgresso] = useState(true);

  const progress = Math.round((currentStep / EVENTO_WIZARD_STEPS.length) * 100);

  const handleDataChange = (updates: Partial<EventoWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return validateEventoStep1(wizardData).isValid;
      case 2: return validateEventoStep2(wizardData).isValid;
      case 3: return validateEventoStep3(wizardData).isValid;
      case 4: return validateEventoStep4(wizardData).isValid;
      case 5: return validateEventoStep5(wizardData).isValid;
      case 6: return validateEventoStep6(wizardData).isValid;
      case 7: return validateEventoStep7(wizardData).isValid;
      case 8: return validateEventoStep8(wizardData).isValid;
      case 9: return validateEventoStep9(wizardData).isValid;
      case 10: return validateEventoStep10(wizardData).isValid;
      case 11: return true; // Preview é sempre válido
      default: return true;
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPublishing(false);
    toast.success("Evento publicado com sucesso na Vitrine!");
    navigate("/oportunidades");
  };

  const canGoNext = isStepValid(currentStep);

  const handleNext = () => {
    if (currentStep < EVENTO_WIZARD_STEPS.length && canGoNext) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setHighestStepReached(prev => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success("Rascunho salvo com sucesso!");
    navigate("/oportunidades");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepInformacoesBasicas data={wizardData} onChange={handleDataChange} />;
      case 2:
        return <StepDataLocal data={wizardData} onChange={handleDataChange} />;
      case 3:
        return <StepProgramacao data={wizardData} onChange={handleDataChange} />;
      case 4:
        return <StepVagasArtistas data={wizardData} onChange={handleDataChange} />;
      case 5:
        return <StepDivulgacaoEvento data={wizardData} onChange={handleDataChange} />;
      case 6:
        return <StepAcessibilidadeEvento data={wizardData} onChange={handleDataChange} />;
      case 7:
        return <StepPublicoEquipe data={wizardData} onChange={handleDataChange} />;
      case 8:
        return <StepCustosEvento data={wizardData} onChange={handleDataChange} />;
      case 9:
        return <StepInfraestrutura data={wizardData} onChange={handleDataChange} />;
      case 10:
        return <StepResultadosEvento data={wizardData} onChange={handleDataChange} />;
      case 11:
        return (
          <StepPreviewEvento 
            data={wizardData} 
            onChange={handleDataChange}
            exibirVitrine={exibirVitrine}
            setExibirVitrine={setExibirVitrine}
            mostrarProgresso={mostrarProgresso}
            setMostrarProgresso={setMostrarProgresso}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Sidebar - Navegação dos Steps */}
        <div className="w-72 shrink-0">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500/10 to-blue-500/5 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Novo Evento</h2>
                  <p className="text-xs text-muted-foreground">11 etapas</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 h-[calc(100%-130px)]">
              <div className="p-3 space-y-1">
                {EVENTO_WIZARD_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep && isStepValid(step.id);
                  const isCurrent = step.id === currentStep;
                  const hasError = step.id < currentStep && !isStepValid(step.id);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isCurrent
                          ? "bg-primary/10 border border-primary/30"
                          : hasError
                              ? "hover:bg-error/5 border border-error/20"
                              : "hover:bg-muted"
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                        isCompleted 
                          ? "bg-success text-white" 
                          : hasError
                            ? "bg-error text-white"
                            : isCurrent 
                              ? "bg-primary text-white" 
                              : "bg-muted text-muted-foreground"
                      }`}>
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : hasError ? (
                          <span className="text-sm font-medium">!</span>
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${isCurrent ? "text-pe-blue-dark" : ""}`}>
                          {step.label}
                        </p>
                      </div>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          Atual
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="p-6">
                {renderCurrentStep()}
              </div>
            </ScrollArea>

            {/* Footer com navegação */}
            <div className="border-t p-4 bg-background shrink-0">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Salvar Rascunho
                  </Button>

                  {currentStep < EVENTO_WIZARD_STEPS.length ? (
                    <Button
                      onClick={handleNext}
                      disabled={!canGoNext}
                      className="gap-2 bg-primary hover:bg-blue-700"
                    >
                      Próximo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="gap-2 bg-success hover:bg-green-700"
                    >
                      {isPublishing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Rocket className="h-4 w-4" />
                      )}
                      Publicar na Vitrine
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NovoProjetoEvento;
