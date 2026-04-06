import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Check, 
  GraduationCap,
  FileText,
  Target,
  ListChecks,
  BookOpen,
  Megaphone,
  Radio,
  Accessibility,
  Package,
  Users,
  DollarSign,
  Trophy,
  Loader2,
  Eye,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { 
  OficinaWizardData, 
  OFICINA_WIZARD_INITIAL_STATE,
  WIZARD_STEPS,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateStep6,
  validateStep7,
  validateStep8,
  validateStep9,
  validateStep10,
  validateStep11,
} from "@/types/oficina-wizard";
import { 
  StepJustificativa, 
  StepObjetivoGeral, 
  StepObjetivosEspecificos, 
  StepMetodologia,
  StepDivulgacao,
  StepPlanoMidia,
  StepAcessibilidade,
  StepEquipamentos,
  StepPublicoCronograma,
  StepPlanilhaCustos,
  StepResultados,
  StepPreview,
} from "@/components/oficina-wizard";

const STEP_ICONS: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-4 w-4" />,
  Target: <Target className="h-4 w-4" />,
  ListChecks: <ListChecks className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  Radio: <Radio className="h-4 w-4" />,
  Accessibility: <Accessibility className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  DollarSign: <DollarSign className="h-4 w-4" />,
  Trophy: <Trophy className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />,
};

const NovoProjetoOficina = () => {
  const navigate = useNavigate();

  const [wizardData, setWizardData] = useState<OficinaWizardData>(OFICINA_WIZARD_INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStepReached, setHighestStepReached] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [exibirVitrine, setExibirVitrine] = useState(true);
  const [mostrarProgresso, setMostrarProgresso] = useState(true);

  const progress = Math.round((currentStep / WIZARD_STEPS.length) * 100);

  const handleDataChange = (updates: Partial<OficinaWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return validateStep1(wizardData).isValid;
      case 2: return validateStep2(wizardData).isValid;
      case 3: return validateStep3(wizardData).isValid;
      case 4: return validateStep4(wizardData).isValid;
      case 5: return validateStep5(wizardData).isValid;
      case 6: return validateStep6(wizardData).isValid;
      case 7: return validateStep7(wizardData).isValid;
      case 8: return validateStep8(wizardData).isValid;
      case 9: return validateStep9(wizardData).isValid;
      case 10: return validateStep10(wizardData).isValid;
      case 11: return validateStep11(wizardData).isValid;
      case 12: return true; // Preview é sempre válido
      default: return true;
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPublishing(false);
    toast.success("Oficina publicada com sucesso na Vitrine!");
    navigate("/oportunidades");
  };

  const canGoNext = isStepValid(currentStep);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length && canGoNext) {
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
        return <StepJustificativa data={wizardData} onChange={handleDataChange} />;
      case 2:
        return <StepObjetivoGeral data={wizardData} onChange={handleDataChange} />;
      case 3:
        return <StepObjetivosEspecificos data={wizardData} onChange={handleDataChange} />;
      case 4:
        return <StepMetodologia data={wizardData} onChange={handleDataChange} />;
      case 5:
        return <StepDivulgacao data={wizardData} onChange={handleDataChange} />;
      case 6:
        return <StepPlanoMidia data={wizardData} onChange={handleDataChange} />;
      case 7:
        return <StepAcessibilidade data={wizardData} onChange={handleDataChange} />;
      case 8:
        return <StepEquipamentos data={wizardData} onChange={handleDataChange} />;
      case 9:
        return <StepPublicoCronograma data={wizardData} onChange={handleDataChange} />;
      case 10:
        return <StepPlanilhaCustos data={wizardData} onChange={handleDataChange} />;
      case 11:
        return <StepResultados data={wizardData} onChange={handleDataChange} />;
      case 12:
        return <StepPreview data={wizardData} onChange={handleDataChange} />;
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
            <CardHeader className="border-b bg-gradient-to-r from-accent/10 to-accent/5 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent/20">
                  <GraduationCap className="h-5 w-5 text-accent-dark" />
                </div>
                <div>
                  <h2 className="font-semibold">Nova Oficina</h2>
                  <p className="text-xs text-muted-foreground">12 etapas</p>
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
                {WIZARD_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep && isStepValid(step.id);
                  const isCurrent = step.id === currentStep;
                  const hasError = step.id < currentStep && !isStepValid(step.id);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isCurrent
                          ? "bg-accent/10 border border-accent/30"
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
                              ? "bg-accent text-white" 
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
                        <p className={`text-sm font-medium truncate ${isCurrent ? "text-accent-dark" : ""}`}>
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

                  {currentStep < WIZARD_STEPS.length ? (
                    <Button
                      onClick={handleNext}
                      disabled={!canGoNext}
                      className="gap-2 bg-accent hover:bg-warning"
                    >
                      Próximo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="gap-2 bg-success hover:bg-success-dark"
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

export default NovoProjetoOficina;
