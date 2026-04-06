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
  Briefcase,
  Check,
  ClipboardList,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Save,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  VagaWizardData,
  VAGA_WIZARD_INITIAL_STATE,
  VAGA_WIZARD_STEPS,
  validateVagaStep1,
  validateVagaStep2,
  validateVagaStep3,
  validateVagaStep4,
  validateVagaStep5,
  validateVagaStep6,
} from "@/types/vaga-wizard";
import {
  StepInformacoesBasicas,
  StepLocalModalidade,
  StepCargaHoraria,
  StepRemuneracao,
  StepVagasRequisitos,
  StepProcessoSeletivo,
  StepPreviewVaga,
} from "@/components/vaga-wizard";

const STEP_ICONS: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-4 w-4" />,
  MapPin: <MapPin className="h-4 w-4" />,
  Clock: <Clock className="h-4 w-4" />,
  DollarSign: <DollarSign className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  ClipboardList: <ClipboardList className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />,
};

const NovoProjetoVaga = () => {
  const navigate = useNavigate();

  const [wizardData, setWizardData] = useState<VagaWizardData>(VAGA_WIZARD_INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStepReached, setHighestStepReached] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = VAGA_WIZARD_STEPS.length;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const updateData = (updates: Partial<VagaWizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const getStepValidation = (step: number) => {
    switch (step) {
      case 1: return validateVagaStep1(wizardData);
      case 2: return validateVagaStep2(wizardData);
      case 3: return validateVagaStep3(wizardData);
      case 4: return validateVagaStep4(wizardData);
      case 5: return validateVagaStep5(wizardData);
      case 6: return validateVagaStep6(wizardData);
      default: return { isValid: true, errors: [] };
    }
  };

  const isCurrentStepValid = getStepValidation(currentStep).isValid;

  const handleNext = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > highestStepReached) setHighestStepReached(next);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    toast.success("Vaga publicada com sucesso!");
    navigate("/oportunidades");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepInformacoesBasicas data={wizardData} onChange={updateData} />;
      case 2: return <StepLocalModalidade data={wizardData} onChange={updateData} />;
      case 3: return <StepCargaHoraria data={wizardData} onChange={updateData} />;
      case 4: return <StepRemuneracao data={wizardData} onChange={updateData} />;
      case 5: return <StepVagasRequisitos data={wizardData} onChange={updateData} />;
      case 6: return <StepProcessoSeletivo data={wizardData} onChange={updateData} />;
      case 7: return <StepPreviewVaga data={wizardData} />;
      default: return null;
    }
  };

  const currentStepInfo = VAGA_WIZARD_STEPS[currentStep - 1];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Sidebar de navegação */}
        <div className="w-72 shrink-0">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b bg-emerald-500/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-500/20">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Nova Vaga de Emprego</p>
                  <p className="text-xs text-muted-foreground">
                    Etapa {currentStep} de {totalSteps}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={progress} className="h-1.5" />
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-110px)]">
              <div className="p-3 space-y-1">
                {VAGA_WIZARD_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  const stepValidation = step.id < currentStep ? getStepValidation(step.id) : null;
                  const hasError = stepValidation && !stepValidation.isValid;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isCurrent
                          ? "bg-emerald-500/10 text-emerald-700 font-medium"
                          : "hover:bg-muted cursor-pointer text-foreground"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                          hasError
                            ? "bg-pe-red-light text-error"
                            : isCompleted
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-emerald-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted && !hasError ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{step.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    {STEP_ICONS[currentStepInfo.icon]}
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">{currentStepInfo.title}</h1>
                    <p className="text-sm text-muted-foreground">{currentStepInfo.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {currentStep}/{totalSteps}
                </Badge>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1">
              <div className="p-6 max-w-3xl mx-auto">
                {renderStep()}
              </div>
            </ScrollArea>

            {/* Rodapé de navegação */}
            <div className="border-t p-4 bg-background shrink-0">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>

                <div className="flex items-center gap-2">
                  {currentStep < totalSteps ? (
                    <Button
                      onClick={handleNext}
                      disabled={!isCurrentStepValid}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Próximo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Publicando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Publicar Vaga
                        </>
                      )}
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

export default NovoProjetoVaga;
