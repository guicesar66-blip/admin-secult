import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Handshake,
  Briefcase,
  GraduationCap,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useMinhasPropostas, StatusProposta, TipoApoio } from "@/hooks/usePropostasInvestimento";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusConfig: Record<StatusProposta, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { label: "Pendente", color: "bg-amber-500/20 text-amber-600", icon: <Clock className="h-3 w-3" /> },
  aprovada: { label: "Aprovada", color: "bg-green-500/20 text-green-600", icon: <CheckCircle className="h-3 w-3" /> },
  rejeitada: { label: "Rejeitada", color: "bg-red-500/20 text-red-600", icon: <XCircle className="h-3 w-3" /> },
  contraproposta: { label: "Contraproposta", color: "bg-blue-500/20 text-blue-600", icon: <MessageSquare className="h-3 w-3" /> },
  cancelada: { label: "Cancelada", color: "bg-gray-500/20 text-gray-600", icon: <XCircle className="h-3 w-3" /> },
};

const tipoApoioConfig: Record<TipoApoio, { label: string; icon: React.ReactNode }> = {
  financeiro: { label: "Financeiro", icon: <DollarSign className="h-4 w-4" /> },
  servico: { label: "Serviço/Permuta", icon: <Handshake className="h-4 w-4" /> },
  patrocinio: { label: "Patrocínio", icon: <Briefcase className="h-4 w-4" /> },
};

export default function Investimentos() {
  const navigate = useNavigate();
  const { data: propostas = [], isLoading: loadingPropostas } = useMinhasPropostas();

  // Buscar detalhes dos projetos (oportunidades e oficinas)
  const oportunidadeIds = propostas
    .filter(p => p.oportunidade_id)
    .map(p => p.oportunidade_id as string);
  
  const oficinaIds = propostas
    .filter(p => p.oficina_id)
    .map(p => p.oficina_id as string);

  const { data: oportunidades = [] } = useQuery({
    queryKey: ["oportunidades-investidas", oportunidadeIds],
    queryFn: async () => {
      if (oportunidadeIds.length === 0) return [];
      const { data, error } = await supabase
        .from("oportunidades")
        .select("id, titulo, tipo, status, data_evento, local, imagem")
        .in("id", oportunidadeIds);
      if (error) throw error;
      return data;
    },
    enabled: oportunidadeIds.length > 0,
  });

  const { data: oficinas = [] } = useQuery({
    queryKey: ["oficinas-investidas", oficinaIds],
    queryFn: async () => {
      if (oficinaIds.length === 0) return [];
      const { data, error } = await supabase
        .from("oficinas")
        .select("id, titulo, status, data_inicio, local, imagem")
        .in("id", oficinaIds);
      if (error) throw error;
      return data;
    },
    enabled: oficinaIds.length > 0,
  });

  // Mapear projetos por ID
  const projetosMap = new Map<string, { titulo: string; tipo: string; status: string; data: string | null; local: string | null }>();
  
  oportunidades.forEach(op => {
    projetosMap.set(op.id, {
      titulo: op.titulo,
      tipo: op.tipo,
      status: op.status,
      data: op.data_evento,
      local: op.local,
    });
  });

  oficinas.forEach(of => {
    projetosMap.set(of.id, {
      titulo: of.titulo,
      tipo: "oficina",
      status: of.status,
      data: of.data_inicio,
      local: of.local,
    });
  });

  // Calcular estatísticas
  const totalInvestido = propostas
    .filter(p => p.status === "aprovada" && p.valor_financeiro)
    .reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);

  const totalPendente = propostas
    .filter(p => p.status === "pendente" && p.valor_financeiro)
    .reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);

  const propostasAprovadas = propostas.filter(p => p.status === "aprovada").length;
  const propostasPendentes = propostas.filter(p => p.status === "pendente").length;

  const isLoading = loadingPropostas;

  const getProjetoInfo = (proposta: typeof propostas[0]) => {
    const projetoId = proposta.oportunidade_id || proposta.oficina_id;
    if (!projetoId) return null;
    return projetosMap.get(projetoId);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "oficina":
        return <GraduationCap className="h-4 w-4" />;
      case "evento":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Investimentos</h1>
          <p className="text-muted-foreground">
            Acompanhe suas propostas de investimento em projetos culturais
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investido (Aprovado)</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <p className="text-xl font-bold text-green-600">
                      R$ {totalInvestido.toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendente de Aprovação</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <p className="text-xl font-bold text-amber-600">
                      R$ {totalPendente.toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Propostas Aprovadas</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-xl font-bold text-foreground">{propostasAprovadas}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Propostas Pendentes</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-xl font-bold text-foreground">{propostasPendentes}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Propostas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Minhas Propostas</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-1/3" />
                      <div className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-12" />
                        <Skeleton className="h-12" />
                        <Skeleton className="h-12" />
                        <Skeleton className="h-12" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : propostas.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Nenhuma proposta enviada</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Explore a vitrine de projetos e envie sua primeira proposta de investimento
                    </p>
                  </div>
                  <Button onClick={() => navigate("/vitrine")}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Explorar Vitrine
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            propostas.map((proposta) => {
              const projeto = getProjetoInfo(proposta);
              const statusInfo = statusConfig[proposta.status];
              const tipoApoioInfo = tipoApoioConfig[proposta.tipo_apoio];
              const projetoId = proposta.oportunidade_id || proposta.oficina_id;

              return (
                <Card key={proposta.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {projeto && (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {getTipoIcon(projeto.tipo)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {projeto?.titulo || "Projeto não encontrado"}
                            </h3>
                            {projeto && (
                              <p className="text-sm text-muted-foreground capitalize">
                                {projeto.tipo} • {projeto.local || "Local não definido"}
                              </p>
                            )}
                          </div>
                          <Badge className={`${statusInfo.color} flex items-center gap-1`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tipo de Apoio</p>
                            <p className="font-medium flex items-center gap-1.5">
                              {tipoApoioInfo.icon}
                              {tipoApoioInfo.label}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Valor</p>
                            <p className="font-medium text-green-600">
                              {proposta.valor_financeiro 
                                ? `R$ ${proposta.valor_financeiro.toLocaleString("pt-BR")}`
                                : proposta.descricao_servico 
                                  ? "Serviço/Permuta"
                                  : "-"
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Data da Proposta</p>
                            <p className="font-medium">
                              {new Date(proposta.created_at).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Última Atualização</p>
                            <p className="font-medium">
                              {new Date(proposta.updated_at).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>

                        {proposta.mensagem && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Sua mensagem:</p>
                            <p className="text-sm mt-1">{proposta.mensagem}</p>
                          </div>
                        )}

                        {proposta.status === "rejeitada" && proposta.motivo_rejeicao && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Motivo da rejeição:
                            </p>
                            <p className="text-sm text-red-700 mt-1">{proposta.motivo_rejeicao}</p>
                          </div>
                        )}

                        {proposta.contrapartidas_desejadas && proposta.contrapartidas_desejadas.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground mb-1">Contrapartidas desejadas:</p>
                            <div className="flex flex-wrap gap-1">
                              {proposta.contrapartidas_desejadas.map((c, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {projetoId && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/oportunidades/${projetoId}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Projeto
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
