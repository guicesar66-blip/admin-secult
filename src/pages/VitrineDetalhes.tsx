import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { InvestmentProposalDialog } from "@/components/InvestmentProposalDialog";
import { supabase } from "@/integrations/supabase/client";
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
  Sparkles,
  FileText,
  Music,
  Film,
  Palette,
  Theater,
  Clock,
  GraduationCap,
  Building,
} from "lucide-react";

// Imagens fallback
import festivalJazzImg from "@/assets/oportunidades/festival-jazz.jpg";

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-5 w-5" />, color: "bg-orange-500" },
  vaga: { label: "Vaga", icon: <Briefcase className="h-5 w-5" />, color: "bg-blue-500" },
  oficina: { label: "Oficina", icon: <GraduationCap className="h-5 w-5" />, color: "bg-emerald-500" },
  bairro: { label: "Bairro", icon: <Building className="h-5 w-5" />, color: "bg-purple-500" },
  ep: { label: "EP/Álbum", icon: <Music className="h-5 w-5" />, color: "bg-pink-500" },
  filme: { label: "Filme/Doc", icon: <Film className="h-5 w-5" />, color: "bg-cyan-500" },
  festival: { label: "Festival", icon: <Users className="h-5 w-5" />, color: "bg-violet-500" },
  exposicao: { label: "Exposição", icon: <Palette className="h-5 w-5" />, color: "bg-emerald-500" },
  teatro: { label: "Teatro", icon: <Theater className="h-5 w-5" />, color: "bg-amber-500" },
};

const VitrineDetalhes = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") || "oportunidade";
  const navigate = useNavigate();
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [liked, setLiked] = useState(false);

  // Query para oportunidade
  const { data: oportunidade, isLoading: loadingOportunidade } = useQuery({
    queryKey: ["vitrine-oportunidade", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oportunidades_vitrine")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: tipo === "oportunidade" && !!id,
  });

  // Query para oficina
  const { data: oficina, isLoading: loadingOficina } = useQuery({
    queryKey: ["vitrine-oficina", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oficinas_vitrine")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: tipo === "oficina" && !!id,
  });

  const isLoading = loadingOportunidade || loadingOficina;
  
  // Normalizar dados para exibição
  const projeto = tipo === "oficina" && oficina ? {
    id: oficina.id,
    titulo: oficina.titulo,
    descricao: oficina.descricao,
    tipo: "oficina",
    local: oficina.local,
    imagem: oficina.imagem || festivalJazzImg,
    areaCultural: oficina.area_artistica,
    criadorNome: oficina.organizacao,
    facilitadorNome: oficina.facilitador_nome,
    facilitadorBio: oficina.facilitador_bio,
    metaCaptacao: oficina.meta_captacao || 0,
    captacaoAtual: oficina.captacao_atual || 0,
    mostrarProgresso: oficina.mostrar_progresso ?? true,
    totalPropostas: oficina.total_propostas || 0,
    valorCaptado: oficina.valor_captado || 0,
    dataInicio: oficina.data_inicio,
    dataFim: oficina.data_fim,
    cargaHoraria: oficina.carga_horaria,
    numEncontros: oficina.num_encontros,
    nivel: oficina.nivel,
    modalidade: oficina.modalidade,
    publicoAlvo: oficina.publico_alvo,
    prerequisitos: oficina.prerequisitos,
    emiteCertificado: oficina.emite_certificado,
    diasSemana: oficina.dias_semana,
    horario: oficina.horario,
  } : oportunidade ? {
    id: oportunidade.id,
    titulo: oportunidade.titulo,
    descricao: oportunidade.descricao,
    tipo: oportunidade.tipo,
    local: oportunidade.local || oportunidade.municipio,
    imagem: oportunidade.imagem || festivalJazzImg,
    areaCultural: oportunidade.area_cultural,
    criadorNome: oportunidade.criador_nome_completo || oportunidade.criador_nome_artistico || oportunidade.criador_nome,
    metaCaptacao: oportunidade.meta_captacao || 0,
    captacaoAtual: oportunidade.captacao_atual || 0,
    mostrarProgresso: oportunidade.mostrar_progresso ?? true,
    totalPropostas: oportunidade.total_propostas || 0,
    valorCaptado: oportunidade.valor_captado || 0,
    dataEvento: oportunidade.data_evento,
    horario: oportunidade.horario,
    duracao: oportunidade.duracao,
    requisitos: oportunidade.requisitos,
    vagas: oportunidade.vagas,
    remuneracao: oportunidade.remuneracao,
    cenaCoins: oportunidade.cena_coins,
  } : null;

  const config = projeto ? tipoConfig[projeto.tipo] || tipoConfig.evento : tipoConfig.evento;
  const percentCaptado = projeto && projeto.metaCaptacao > 0 
    ? (projeto.captacaoAtual / projeto.metaCaptacao) * 100 
    : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-5xl mx-auto">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!projeto) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
          <p className="text-muted-foreground mb-4">Este projeto não está mais disponível na vitrine.</p>
          <Button onClick={() => navigate("/dashboard")}>Voltar à Vitrine</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à Vitrine
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setLiked(!liked)}>
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Banner com Imagem */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
          <img 
            src={projeto.imagem} 
            alt={projeto.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className={`absolute top-4 right-4 ${config.color} text-white border-0`}>
            {config.icon}
            <span className="ml-1">{config.label}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título e Info */}
            <div>
              {projeto.areaCultural && (
                <Badge variant="secondary" className="mb-3">
                  {projeto.areaCultural}
                </Badge>
              )}
              <h1 className="text-3xl font-bold">{projeto.titulo}</h1>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {projeto.local && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {projeto.local}
                  </div>
                )}
                {projeto.tipo === "oficina" && projeto.dataInicio && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(projeto.dataInicio).toLocaleDateString("pt-BR")} - {new Date(projeto.dataFim).toLocaleDateString("pt-BR")}
                  </div>
                )}
                {projeto.tipo !== "oficina" && projeto.dataEvento && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(projeto.dataEvento).toLocaleDateString("pt-BR")}
                  </div>
                )}
                {projeto.horario && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {projeto.horario}
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sobre o Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {projeto.descricao || "Descrição não disponível."}
                </p>
              </CardContent>
            </Card>

            {/* Detalhes específicos de Oficina */}
            {projeto.tipo === "oficina" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Detalhes da Oficina
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {projeto.cargaHoraria && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Carga horária:</strong> {projeto.cargaHoraria}h</span>
                        </div>
                      )}
                      {projeto.numEncontros && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Encontros:</strong> {projeto.numEncontros}</span>
                        </div>
                      )}
                      {projeto.nivel && (
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Nível:</strong> {projeto.nivel}</span>
                        </div>
                      )}
                      {projeto.modalidade && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Modalidade:</strong> {projeto.modalidade}</span>
                        </div>
                      )}
                      {projeto.emiteCertificado !== undefined && (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Certificado:</strong> {projeto.emiteCertificado ? "Sim" : "Não"}</span>
                        </div>
                      )}
                      {projeto.diasSemana && projeto.diasSemana.length > 0 && (
                        <div className="flex items-center gap-2 col-span-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span><strong>Dias:</strong> {projeto.diasSemana.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {projeto.publicoAlvo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="h-5 w-5 text-primary" />
                        Público Alvo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{projeto.publicoAlvo}</p>
                    </CardContent>
                  </Card>
                )}

                {projeto.prerequisitos && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-5 w-5 text-amber-500" />
                        Pré-requisitos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{projeto.prerequisitos}</p>
                    </CardContent>
                  </Card>
                )}

                {projeto.facilitadorNome && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Facilitador(a)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{projeto.facilitadorNome.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{projeto.facilitadorNome}</p>
                          <p className="text-sm text-muted-foreground">{projeto.criadorNome}</p>
                        </div>
                      </div>
                      {projeto.facilitadorBio && (
                        <p className="text-sm text-muted-foreground">{projeto.facilitadorBio}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Detalhes específicos de Oportunidade (vaga, evento, etc) */}
            {projeto.tipo !== "oficina" && (
              <>
                {projeto.requisitos && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="h-5 w-5 text-amber-500" />
                        Requisitos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{projeto.requisitos}</p>
                    </CardContent>
                  </Card>
                )}

                {(projeto.vagas || projeto.remuneracao || projeto.cenaCoins) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Informações da Vaga
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {projeto.vagas && (
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-xl font-bold">{projeto.vagas}</p>
                            <p className="text-xs text-muted-foreground">vagas</p>
                          </div>
                        )}
                        {projeto.remuneracao && projeto.remuneracao > 0 && (
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <DollarSign className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
                            <p className="text-xl font-bold">R$ {projeto.remuneracao.toLocaleString("pt-BR")}</p>
                            <p className="text-xs text-muted-foreground">remuneração</p>
                          </div>
                        )}
                        {projeto.cenaCoins && projeto.cenaCoins > 0 && (
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Sparkles className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                            <p className="text-xl font-bold">{projeto.cenaCoins}</p>
                            <p className="text-xs text-muted-foreground">Cena Coins</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Card de Financiamento */}
            <Card className="border-primary/30 sticky top-20">
              <CardContent className="p-6 space-y-4">
                {projeto.mostrarProgresso && projeto.metaCaptacao > 0 ? (
                  <>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-500">
                        R$ {projeto.valorCaptado.toLocaleString("pt-BR")}
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
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{projeto.totalPropostas}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">propostas de apoio recebidas</p>
                  </div>
                )}

                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={() => setShowInvestDialog(true)}
                >
                  <DollarSign className="h-5 w-5" />
                  Investir neste Projeto
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Sua proposta será analisada pelo responsável do projeto
                </p>
              </CardContent>
            </Card>

            {/* Card do Responsável */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Responsável pelo Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {projeto.criadorNome?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
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
      {projeto && (
        <InvestmentProposalDialog
          open={showInvestDialog}
          onOpenChange={setShowInvestDialog}
          projeto={{
            id: projeto.id!,
            titulo: projeto.titulo!,
            metaFinanciamento: projeto.metaCaptacao,
            arrecadado: projeto.valorCaptado,
            criadorId: tipo === "oficina" ? oficina?.criador_id || "" : oportunidade?.criador_id || "",
            isOficina: tipo === "oficina",
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default VitrineDetalhes;
