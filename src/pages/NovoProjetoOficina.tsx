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
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOficina } from "@/hooks/useOficinas";
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
  const { user } = useAuth();
  const createOficina = useCreateOficina();
  
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
    if (!user) {
      toast.error("Você precisa estar logado para publicar");
      return;
    }

    setIsPublishing(true);
    try {
      const oficinaData = {
        titulo: wizardData.titulo,
        descricao: wizardData.justificativa,
        area_artistica: wizardData.linguagem_artistica,
        categoria: "oficina",
        nivel: "iniciante" as const,
        modalidade: wizardData.modalidade,
        dias_semana: ["Sábado"],
        horario: "14:00 - 17:00",
        local: wizardData.local,
        data_inicio: wizardData.periodo_oficinas_inicio || new Date().toISOString().split("T")[0],
        data_fim: wizardData.periodo_oficinas_fim || new Date().toISOString().split("T")[0],
        inscricao_fim: wizardData.periodo_inscricoes_fim || new Date().toISOString().split("T")[0],
        carga_horaria: wizardData.etapas_encontros.reduce((acc, e) => acc + e.duracao_horas, 0) || 12,
        num_encontros: wizardData.etapas_encontros.length || 4,
        vagas_total: wizardData.quantidade_participantes || 30,
        publico_alvo: wizardData.perfil_participante,
        prerequisitos: wizardData.prerequisitos,
        facilitador_nome: user.user_metadata?.nome_completo || user.email || "Facilitador",
        organizacao: user.user_metadata?.nome_coletivo || user.user_metadata?.nome_completo || "Organização",
        emite_certificado: true,
        criador_id: user.id,
        // Campos do wizard completo
        justificativa: wizardData.justificativa,
        linguagem_artistica: wizardData.linguagem_artistica,
        territorios: wizardData.territorios,
        objetivo_geral: wizardData.objetivo_geral,
        objetivos_especificos: wizardData.objetivos_especificos,
        metodologia_descricao: wizardData.metodologia_descricao,
        etapas_encontros: wizardData.etapas_encontros,
        endereco_completo: wizardData.endereco_completo,
        canais_divulgacao: wizardData.canais_divulgacao,
        descricao_divulgacao: wizardData.descricao_divulgacao,
        marcas_parceiras: wizardData.marcas_parceiras,
        estrategia_campanha: wizardData.estrategia_campanha,
        parcerias_midia: wizardData.parcerias_midia,
        cobertura_evento: wizardData.cobertura_evento,
        recursos_acessibilidade: wizardData.recursos_acessibilidade,
        descricao_acolhimento: wizardData.descricao_acolhimento,
        equipamentos_materiais: wizardData.equipamentos_materiais,
        quantidade_participantes: wizardData.quantidade_participantes,
        faixa_etaria_min: wizardData.faixa_etaria_min,
        faixa_etaria_max: wizardData.faixa_etaria_max,
        perfil_participante: wizardData.perfil_participante,
        equipe_instrutores: wizardData.equipe_instrutores,
        equipe_apoio: wizardData.equipe_apoio,
        periodo_inscricoes_inicio: wizardData.periodo_inscricoes_inicio,
        periodo_inscricoes_fim: wizardData.periodo_inscricoes_fim,
        periodo_oficinas_inicio: wizardData.periodo_oficinas_inicio,
        periodo_oficinas_fim: wizardData.periodo_oficinas_fim,
        periodo_producao_inicio: wizardData.periodo_producao_inicio,
        periodo_producao_fim: wizardData.periodo_producao_fim,
        data_evento_final: wizardData.data_evento_final,
        tamanho_grupos: wizardData.tamanho_grupos,
        itens_custo: wizardData.itens_custo,
        reserva_tecnica_percentual: wizardData.reserva_tecnica_percentual,
        orcamento_total: wizardData.orcamento_total,
        resultados_quantitativos: wizardData.resultados_quantitativos,
        resultados_qualitativos: wizardData.resultados_qualitativos,
        indicadores_sucesso: wizardData.indicadores_sucesso,
        // Publicação
        status: "inscricoes_abertas",
        status_wizard: "publicado",
        step_atual: 12,
        exibir_vitrine: exibirVitrine,
        mostrar_progresso: mostrarProgresso,
        meta_captacao: wizardData.orcamento_total,
        captacao_atual: 0,
      };

      const result = await createOficina.mutateAsync(oficinaData);
      toast.success("Projeto publicado com sucesso na Vitrine!");
      navigate(`/oportunidades/${result.id}`);
    } catch (error) {
      console.error("Erro ao publicar:", error);
      toast.error("Erro ao publicar projeto");
    } finally {
      setIsPublishing(false);
    }
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
    if (!user) {
      toast.error("Você precisa estar logado para salvar");
      return;
    }

    setIsSaving(true);
    try {
      // Preparar dados para salvar como rascunho
      const hoje = new Date();
      const dataInicio = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      const dataFim = new Date(dataInicio.getTime() + 60 * 24 * 60 * 60 * 1000);
      const inscricaoFim = new Date(dataInicio.getTime() - 7 * 24 * 60 * 60 * 1000);

      const oficinaData = {
        titulo: wizardData.titulo || "Rascunho - Nova Oficina",
        descricao: wizardData.justificativa,
        area_artistica: wizardData.linguagem_artistica || "Formação Cultural",
        categoria: "oficina",
        nivel: "iniciante" as const,
        modalidade: wizardData.modalidade,
        dias_semana: ["Sábado"],
        horario: "14:00 - 17:00",
        local: wizardData.local,
        data_inicio: dataInicio.toISOString().split("T")[0],
        data_fim: dataFim.toISOString().split("T")[0],
        inscricao_fim: inscricaoFim.toISOString().split("T")[0],
        carga_horaria: wizardData.etapas_encontros.reduce((acc, e) => acc + e.duracao_horas, 0) || 12,
        num_encontros: wizardData.etapas_encontros.length || 4,
        vagas_total: wizardData.quantidade_participantes || 30,
        publico_alvo: wizardData.perfil_participante,
        prerequisitos: wizardData.prerequisitos,
        facilitador_nome: user.user_metadata?.nome_completo || user.email || "Facilitador",
        organizacao: user.user_metadata?.nome_coletivo || user.user_metadata?.nome_completo || "Organização",
        emite_certificado: true,
        criador_id: user.id,
      };

      const result = await createOficina.mutateAsync(oficinaData);
      toast.success("Rascunho salvo com sucesso!");
      navigate(`/oportunidades/${result.id}`);
    } catch (error) {
      console.error("Erro ao salvar rascunho:", error);
      toast.error("Erro ao salvar rascunho");
    } finally {
      setIsSaving(false);
    }
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
            <CardHeader className="border-b bg-gradient-to-r from-amber-500/10 to-amber-500/5 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/20">
                  <GraduationCap className="h-5 w-5 text-amber-600" />
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
                  const isAccessible = step.id <= highestStepReached;
                  const hasError = step.id < currentStep && !isStepValid(step.id);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => isAccessible && setCurrentStep(step.id)}
                      disabled={!isAccessible}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        isCurrent 
                          ? "bg-amber-500/10 border border-amber-500/30" 
                          : !isAccessible 
                            ? "opacity-50 cursor-not-allowed" 
                            : hasError
                              ? "hover:bg-red-500/5 border border-red-500/20"
                              : "hover:bg-muted"
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                        isCompleted 
                          ? "bg-green-500 text-white" 
                          : hasError
                            ? "bg-red-500 text-white"
                            : isCurrent 
                              ? "bg-amber-500 text-white" 
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
                        <p className={`text-sm font-medium truncate ${isCurrent ? "text-amber-700" : ""}`}>
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
                    disabled={isSaving || !wizardData.titulo}
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
                      className="gap-2 bg-amber-600 hover:bg-amber-700"
                    >
                      Próximo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="gap-2 bg-green-600 hover:bg-green-700"
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
