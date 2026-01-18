import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  User,
  Phone,
  FileText,
  BarChart3,
  Wallet,
  XCircle,
  Loader2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useOportunidade, useDeleteOportunidade } from "@/hooks/useOportunidades";
import { useOficina, useDeleteOficina } from "@/hooks/useOficinas";
import { useCandidaturasByOportunidade, useUpdateCandidaturaStatus } from "@/hooks/useCandidaturas";
import { useUpdateOportunidade, useUpdateOficina } from "@/hooks/useUpdateOportunidade";
import { DeleteProjectDialog } from "@/components/projeto/DeleteProjectDialog";
import { EditProjectDialog } from "@/components/projeto/EditProjectDialog";
import { CandidatosTab } from "@/components/projeto/CandidatosTab";
import { FinanceiroTab } from "@/components/projeto/FinanceiroTab";

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-4 w-4" />, color: "bg-blue-500" },
  vaga: { label: "Vaga", icon: <Briefcase className="h-4 w-4" />, color: "bg-emerald-500" },
  oficina: { label: "Oficina", icon: <GraduationCap className="h-4 w-4" />, color: "bg-amber-500" },
  projeto_bairro: { label: "Projeto de Bairro", icon: <MapPin className="h-4 w-4" />, color: "bg-purple-500" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ativa: { label: "Ativa", color: "bg-green-500/20 text-green-600" },
  encerrada: { label: "Encerrada", color: "bg-gray-500/20 text-gray-600" },
  cancelada: { label: "Cancelada", color: "bg-red-500/20 text-red-600" },
  inscricoes_abertas: { label: "Inscrições Abertas", color: "bg-green-500/20 text-green-600" },
};

const ProjetoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Hooks - tenta buscar como oportunidade primeiro, depois como oficina
  const { data: oportunidade, isLoading: loadingOportunidade } = useOportunidade(id || "");
  const { data: oficina, isLoading: loadingOficina } = useOficina(id || "");
  
  const deleteOportunidade = useDeleteOportunidade();
  const deleteOficina = useDeleteOficina();
  const updateOportunidade = useUpdateOportunidade();
  const updateOficina = useUpdateOficina();

  // Candidaturas (apenas para oportunidades)
  const { 
    data: candidaturas = [], 
    isLoading: loadingCandidaturas 
  } = useCandidaturasByOportunidade(oportunidade?.id || "");
  
  const updateCandidaturaStatus = useUpdateCandidaturaStatus();

  const isLoading = loadingOportunidade && loadingOficina;
  const projeto = oportunidade || oficina;
  const isOficina = !oportunidade && !!oficina;

  // Handlers
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      if (isOficina) {
        await deleteOficina.mutateAsync(id);
      } else {
        await deleteOportunidade.mutateAsync(id);
      }
      navigate("/oportunidades");
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSaveEdit = async (data: Record<string, unknown>) => {
    if (!id) return;
    
    try {
      if (isOficina) {
        await updateOficina.mutateAsync({ id, data });
      } else {
        await updateOportunidade.mutateAsync({ id, data: data as Parameters<typeof updateOportunidade.mutateAsync>[0]["data"] });
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleCancelarProjeto = async () => {
    if (!id) return;
    
    try {
      if (isOficina) {
        await updateOficina.mutateAsync({ id, data: { status: "cancelada" } });
      } else {
        await updateOportunidade.mutateAsync({ id, data: { status: "cancelada" } });
      }
    } catch (error) {
      console.error("Error canceling:", error);
    }
  };

  const handleAprovarCandidato = (candidaturaId: string) => {
    updateCandidaturaStatus.mutate({ id: candidaturaId, status: "aprovada" });
  };

  const handleReprovarCandidato = (candidaturaId: string, motivo: string) => {
    updateCandidaturaStatus.mutate({ id: candidaturaId, status: "reprovada", motivo_reprovacao: motivo });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!projeto) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground">Projeto não encontrado</p>
          <Button onClick={() => navigate("/oportunidades")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const tipo = isOficina ? "oficina" : (oportunidade?.tipo || "evento");
  const tipoInfo = tipoConfig[tipo] || tipoConfig.evento;
  const statusInfo = statusConfig[projeto.status] || statusConfig.ativa;

  // Dados comuns
  const titulo = projeto.titulo;
  const descricao = "descricao" in projeto ? projeto.descricao : null;
  const status = projeto.status;
  const local = "local" in projeto ? projeto.local : null;
  const dataEvento = "data_evento" in projeto ? projeto.data_evento : ("data_inicio" in projeto ? projeto.data_inicio : null);
  const horario = "horario" in projeto ? projeto.horario : null;
  const vagas = "vagas" in projeto ? projeto.vagas : ("vagas_total" in projeto ? projeto.vagas_total : 0);
  const remuneracao = "remuneracao" in projeto ? (projeto.remuneracao || 0) : 0;
  const cenaCoins = "cena_coins" in projeto ? (projeto.cena_coins || 0) : 0;
  const criadorNome = "criador_nome" in projeto ? projeto.criador_nome : ("facilitador_nome" in projeto ? projeto.facilitador_nome : null);
  const criadorContato = "criador_contato" in projeto ? projeto.criador_contato : null;
  const requisitos = "requisitos" in projeto ? projeto.requisitos : ("prerequisitos" in projeto ? projeto.prerequisitos : null);
  const municipio = "municipio" in projeto ? projeto.municipio : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit gap-2"
            onClick={() => navigate("/oportunidades")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos projetos
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight">{titulo}</h1>
                <Badge variant="outline" className={`${tipoInfo.color} text-white border-0`}>
                  <span className="flex items-center gap-1.5">{tipoInfo.icon} {tipoInfo.label}</span>
                </Badge>
                <Badge variant="outline" className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
              </div>
              {descricao && (
                <p className="text-muted-foreground mt-2 max-w-2xl">{descricao}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={() => setEditDialogOpen(true)}>
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={handleCancelarProjeto}
                    disabled={status === "cancelada"}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Projeto
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Projeto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="info" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Informações</span>
            </TabsTrigger>
            <TabsTrigger value="candidatos" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Candidatos</span>
              {candidaturas.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                  {candidaturas.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="estatisticas" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Informações */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detalhes do Projeto */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dataEvento && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Data</div>
                        <div className="text-muted-foreground">
                          {new Date(dataEvento).toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {horario && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Horário</div>
                        <div className="text-muted-foreground">{horario}</div>
                      </div>
                    </div>
                  )}
                  {(local || municipio) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Local</div>
                        <div className="text-muted-foreground">
                          {local}{municipio && local ? `, ${municipio}` : municipio}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Vagas</div>
                      <div className="text-muted-foreground">{vagas || 0} vaga(s)</div>
                    </div>
                  </div>
                  {remuneracao > 0 && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Remuneração</div>
                        <div className="text-muted-foreground">
                          R$ {remuneracao.toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Responsável e Requisitos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Responsável & Requisitos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {criadorNome && (
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Responsável</div>
                        <div className="text-muted-foreground">{criadorNome}</div>
                      </div>
                    </div>
                  )}
                  {criadorContato && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Contato</div>
                        <div className="text-muted-foreground">{criadorContato}</div>
                      </div>
                    </div>
                  )}
                  {requisitos && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Requisitos</div>
                        <div className="text-muted-foreground whitespace-pre-wrap">{requisitos}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Candidatos */}
          <TabsContent value="candidatos">
            <CandidatosTab
              candidaturas={candidaturas}
              isLoading={loadingCandidaturas}
              onAprovar={handleAprovarCandidato}
              onReprovar={handleReprovarCandidato}
              isUpdating={updateCandidaturaStatus.isPending}
            />
          </TabsContent>

          {/* Tab: Estatísticas */}
          <TabsContent value="estatisticas">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{candidaturas.length}</div>
                      <div className="text-sm text-muted-foreground">Candidaturas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
                        {candidaturas.filter(c => c.status === "aprovada").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Aprovados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{cenaCoins}</div>
                      <div className="text-sm text-muted-foreground">Cena Coins</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Financeiro */}
          <TabsContent value="financeiro">
            <FinanceiroTab
              remuneracao={remuneracao}
              vagas={vagas || 0}
              cenaCoins={cenaCoins}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        projectTitle={titulo}
        onConfirm={handleDelete}
        isDeleting={deleteOportunidade.isPending || deleteOficina.isPending}
      />

      {!isOficina && oportunidade && (
        <EditProjectDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          project={oportunidade}
          onSave={handleSaveEdit}
          isSaving={updateOportunidade.isPending}
        />
      )}
    </DashboardLayout>
  );
};

export default ProjetoDetalhes;
