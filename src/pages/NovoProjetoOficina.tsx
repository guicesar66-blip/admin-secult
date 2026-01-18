import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Send,
  User,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Target,
  BookOpen,
  Megaphone,
  Accessibility,
  Package,
  Users,
  Calendar,
  DollarSign,
  Trophy,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateOficina } from "@/hooks/useOficinas";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface OficinaInfo {
  titulo?: string;
  justificativa?: string;
  objetivoGeral?: string;
  objetivosEspecificos?: string[];
  metodologia?: string;
  divulgacao?: string;
  planoDeMidia?: string;
  acessibilidade?: string;
  equipamentos?: string;
  publicoQuantidade?: string;
  cronograma?: string;
  custos?: { item: string; quantidade: string; valorUnitario: number; total: number }[];
  resultadosEsperados?: string[];
}

// 11 etapas baseadas no documento de Oficina
const etapasOficina = [
  { id: "titulo", label: "Nome da Oficina", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "justificativa", label: "Justificativa", icon: <FileText className="h-4 w-4" /> },
  { id: "objetivos", label: "Objetivos", icon: <Target className="h-4 w-4" /> },
  { id: "metodologia", label: "Metodologia", icon: <BookOpen className="h-4 w-4" /> },
  { id: "divulgacao", label: "Divulgação", icon: <Megaphone className="h-4 w-4" /> },
  { id: "planoMidia", label: "Plano de Mídia", icon: <Megaphone className="h-4 w-4" /> },
  { id: "acessibilidade", label: "Acessibilidade", icon: <Accessibility className="h-4 w-4" /> },
  { id: "equipamentos", label: "Equipamentos", icon: <Package className="h-4 w-4" /> },
  { id: "publico", label: "Público", icon: <Users className="h-4 w-4" /> },
  { id: "cronograma", label: "Cronograma", icon: <Calendar className="h-4 w-4" /> },
  { id: "custos", label: "Custos", icon: <DollarSign className="h-4 w-4" /> },
  { id: "resultados", label: "Resultados Esperados", icon: <Trophy className="h-4 w-4" /> },
];

const perguntasOficina = [
  {
    etapa: "inicio",
    mensagem: "Olá! 👋 Sou o assistente CENA e vou te ajudar a estruturar sua **Oficina Cultural**. Vamos seguir 11 etapas para criar um projeto completo. Para começar, me conta: **qual é o nome da sua oficina?**",
  },
  {
    etapa: "justificativa",
    mensagem: "Ótimo nome! Agora vamos para a **Justificativa**. Por que essa oficina é importante? Qual problema ela resolve ou qual oportunidade ela aproveita? Descreva o contexto e a relevância do projeto.",
  },
  {
    etapa: "objetivoGeral",
    mensagem: "Entendi a importância! Qual é o **Objetivo Geral** da oficina? Descreva o que você pretende alcançar de forma ampla. Exemplo: 'Capacitar iniciantes em audiovisual, explorando técnicas tradicionais e uso de celulares.'",
  },
  {
    etapa: "objetivosEspecificos",
    mensagem: "Agora me conta os **Objetivos Específicos**. Liste as metas detalhadas que vão contribuir para o objetivo geral. Separe cada objetivo com vírgula. Exemplo: 'Introduzir conceitos de roteiro, ensinar técnicas de filmagem, promover produção colaborativa'",
  },
  {
    etapa: "metodologia",
    mensagem: "Excelente objetivos! Qual será a **Metodologia** da oficina? Descreva como será o formato: quantidade de encontros, duração, tipo de atividades (práticas, teóricas), dinâmicas, produção coletiva, etc.",
  },
  {
    etapa: "divulgacao",
    mensagem: "Agora vamos falar de **Divulgação e Marca**. Como você pretende divulgar a oficina? Em quais canais? Haverá parceria com alguma instituição que precise ter a marca em destaque?",
  },
  {
    etapa: "planoDeMidia",
    mensagem: "Vamos detalhar o **Plano de Mídia**. Quais estratégias de comunicação você vai usar? Redes sociais, WhatsApp, parcerias com escolas, rádios comunitárias, cartazes em espaços culturais?",
  },
  {
    etapa: "acessibilidade",
    mensagem: "Muito importante: **Acessibilidade e Acolhimento**. Como você garantirá que a oficina seja inclusiva? Pense em: legendas, intérprete de Libras, espaço acessível, materiais em linguagem simples, apoio individual.",
  },
  {
    etapa: "equipamentos",
    mensagem: "Quais **Equipamentos** serão necessários para a oficina? Liste os materiais e recursos técnicos. Exemplo: câmeras, microfones, computadores, projetores, materiais didáticos, etc.",
  },
  {
    etapa: "publicoQuantidade",
    mensagem: "Sobre o **Público e Quantidade de Pessoas**: quantos participantes você espera? Quem são os instrutores? Haverá equipe de apoio (técnicos, intérpretes)?",
  },
  {
    etapa: "cronograma",
    mensagem: "Vamos ao **Cronograma**. Defina as fases do projeto com datas aproximadas. Exemplo: 'Divulgação: Março, Oficinas: Abril-Maio, Produção: Junho, Mostra: Agosto'",
  },
  {
    etapa: "custos",
    mensagem: "Agora a **Planilha de Custos**. Liste os principais itens de despesa com valores estimados. Formato: 'Item - Quantidade - Valor'. Exemplo: 'Instrutores - 2 - R$4.000, Locação - 1 - R$2.000, Equipamentos - diversos - R$5.000'",
  },
  {
    etapa: "resultados",
    mensagem: "Por fim, quais são os **Resultados Esperados**? O que você espera alcançar ao final da oficina? Separe por vírgula. Exemplo: 'Formação de 40 iniciantes, produção de 10 vídeos, realização de mostra pública'",
  },
  {
    etapa: "finalizacao",
    mensagem: "🎉 Excelente! Sua oficina está estruturada com todas as 11 seções! Vou criar um resumo completo do projeto. Você poderá revisar e ajustar antes de prosseguir para a fase de **Divulgação**, onde vamos buscar apoio e participantes!",
  },
];

const NovoProjetoOficina = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createOficina = useCreateOficina();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [oficinaInfo, setOficinaInfo] = useState<OficinaInfo>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const progresso = Math.round((etapaAtual / (perguntasOficina.length - 1)) * 100);

  useEffect(() => {
    setTimeout(() => {
      addAssistantMessage(perguntasOficina[0].mensagem);
    }, 500);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addAssistantMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const processarResposta = (resposta: string) => {
    const novaOficinaInfo = { ...oficinaInfo };

    switch (etapaAtual) {
      case 0:
        novaOficinaInfo.titulo = resposta;
        break;
      case 1:
        novaOficinaInfo.justificativa = resposta;
        break;
      case 2:
        novaOficinaInfo.objetivoGeral = resposta;
        break;
      case 3:
        novaOficinaInfo.objetivosEspecificos = resposta.split(",").map((o) => o.trim());
        break;
      case 4:
        novaOficinaInfo.metodologia = resposta;
        break;
      case 5:
        novaOficinaInfo.divulgacao = resposta;
        break;
      case 6:
        novaOficinaInfo.planoDeMidia = resposta;
        break;
      case 7:
        novaOficinaInfo.acessibilidade = resposta;
        break;
      case 8:
        novaOficinaInfo.equipamentos = resposta;
        break;
      case 9:
        novaOficinaInfo.publicoQuantidade = resposta;
        break;
      case 10:
        novaOficinaInfo.cronograma = resposta;
        break;
      case 11:
        // Parse custos
        const itens = resposta.split(",").map((item) => {
          const partes = item.trim().split("-").map((p) => p.trim());
          return {
            item: partes[0] || "",
            quantidade: partes[1] || "1",
            valorUnitario: parseFloat(partes[2]?.replace(/\D/g, "") || "0"),
            total: parseFloat(partes[2]?.replace(/\D/g, "") || "0"),
          };
        });
        novaOficinaInfo.custos = itens;
        break;
      case 12:
        novaOficinaInfo.resultadosEsperados = resposta.split(",").map((r) => r.trim());
        break;
    }

    setOficinaInfo(novaOficinaInfo);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: inputValue,
        timestamp: new Date(),
      },
    ]);

    processarResposta(inputValue);
    setInputValue("");

    const proximaEtapa = etapaAtual + 1;
    setEtapaAtual(proximaEtapa);

    if (proximaEtapa < perguntasOficina.length) {
      addAssistantMessage(perguntasOficina[proximaEtapa].mensagem);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const calcularOrcamentoTotal = () => {
    return oficinaInfo.custos?.reduce((acc, item) => acc + item.total, 0) || 0;
  };

  const finalizarProjeto = async () => {
    if (!user) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare data for the oficinas table
      const hoje = new Date();
      const dataInicio = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      const dataFim = new Date(dataInicio.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 days after start
      const inscricaoFim = new Date(dataInicio.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before start

      const oficinaData = {
        titulo: oficinaInfo.titulo || "Nova Oficina",
        descricao: [
          oficinaInfo.justificativa,
          oficinaInfo.objetivoGeral && `**Objetivo:** ${oficinaInfo.objetivoGeral}`,
          oficinaInfo.metodologia && `**Metodologia:** ${oficinaInfo.metodologia}`,
          oficinaInfo.acessibilidade && `**Acessibilidade:** ${oficinaInfo.acessibilidade}`,
          oficinaInfo.equipamentos && `**Equipamentos:** ${oficinaInfo.equipamentos}`,
        ].filter(Boolean).join("\n\n"),
        area_artistica: "Formação Cultural",
        categoria: "oficina",
        nivel: "iniciante",
        modalidade: "presencial",
        dias_semana: ["Sábado"],
        horario: "14:00 - 17:00",
        local: "A definir",
        data_inicio: dataInicio.toISOString().split("T")[0],
        data_fim: dataFim.toISOString().split("T")[0],
        inscricao_fim: inscricaoFim.toISOString().split("T")[0],
        carga_horaria: 12,
        num_encontros: 4,
        vagas_total: 30,
        publico_alvo: oficinaInfo.publicoQuantidade || "Público geral",
        prerequisitos: "",
        facilitador_nome: user.user_metadata?.nome_completo || user.email || "Facilitador",
        facilitador_bio: "",
        organizacao: user.user_metadata?.nome_coletivo || user.user_metadata?.nome_completo || "Organização",
        emite_certificado: true,
        criador_id: user.id,
      };

      const result = await createOficina.mutateAsync(oficinaData);
      
      // Navigate to the project details page
      navigate(`/oportunidades/${result.id}`, {
        state: {
          novoProjeto: result,
          faseInicial: "divulgacao",
        },
      });
    } catch (error) {
      console.error("Erro ao salvar oficina:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const projetoCompleto = etapaAtual >= perguntasOficina.length - 1;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Painel de Chat */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-amber-500/10 to-amber-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <GraduationCap className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Construção de Oficina</CardTitle>
                    <p className="text-sm text-muted-foreground">Assistente CENA - 11 etapas</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  IA Ativa
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso da construção</span>
                  <span className="font-medium">{progresso}%</span>
                </div>
                <Progress value={progresso} className="h-2" />
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                          message.role === "assistant"
                            ? "bg-amber-500/20 text-amber-600"
                            : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                          message.role === "assistant"
                            ? "bg-muted"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content.replace(/\*\*(.*?)\*\*/g, "$1")}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-amber-500/20 text-amber-600">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-muted">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-background">
                {!projetoCompleto ? (
                  <div className="flex gap-2">
                    <Textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua resposta... (Enter para enviar)"
                      className="flex-1 min-h-[60px] resize-none"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={finalizarProjeto}
                    disabled={isSaving}
                    className="w-full gap-2 bg-amber-600 hover:bg-amber-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Finalizar e ir para Divulgação
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral - Resumo do Projeto */}
        <div className="w-96 shrink-0">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b bg-amber-500/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-amber-600" />
                Estrutura da Oficina
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-4">
                  {/* Etapas de coleta */}
                  <div className="space-y-1">
                    {etapasOficina.map((etapa, index) => {
                      const isComplete = index < etapaAtual;
                      const isCurrent = index === etapaAtual;

                      return (
                        <div
                          key={etapa.id}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            isComplete
                              ? "bg-emerald-500/10 text-emerald-600"
                              : isCurrent
                              ? "bg-amber-500/10 text-amber-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            etapa.icon
                          )}
                          <span className="text-sm font-medium">{etapa.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Informações coletadas */}
                  {Object.keys(oficinaInfo).length > 0 && (
                    <div className="pt-4 border-t space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Informações Coletadas
                      </h4>

                      {oficinaInfo.titulo && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Nome da Oficina</p>
                          <p className="font-medium">{oficinaInfo.titulo}</p>
                        </div>
                      )}

                      {oficinaInfo.justificativa && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Justificativa</p>
                          <p className="text-sm line-clamp-3">{oficinaInfo.justificativa}</p>
                        </div>
                      )}

                      {oficinaInfo.objetivoGeral && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Objetivo Geral</p>
                          <p className="text-sm">{oficinaInfo.objetivoGeral}</p>
                        </div>
                      )}

                      {oficinaInfo.objetivosEspecificos && oficinaInfo.objetivosEspecificos.length > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Objetivos Específicos</p>
                          <ul className="text-sm list-disc list-inside mt-1">
                            {oficinaInfo.objetivosEspecificos.slice(0, 3).map((obj, i) => (
                              <li key={i} className="line-clamp-1">{obj}</li>
                            ))}
                            {oficinaInfo.objetivosEspecificos.length > 3 && (
                              <li className="text-muted-foreground">
                                +{oficinaInfo.objetivosEspecificos.length - 3} mais
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {oficinaInfo.metodologia && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Metodologia</p>
                          <p className="text-sm line-clamp-2">{oficinaInfo.metodologia}</p>
                        </div>
                      )}

                      {oficinaInfo.publicoQuantidade && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Público</p>
                          <p className="text-sm">{oficinaInfo.publicoQuantidade}</p>
                        </div>
                      )}

                      {oficinaInfo.cronograma && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Cronograma</p>
                          <p className="text-sm">{oficinaInfo.cronograma}</p>
                        </div>
                      )}

                      {oficinaInfo.custos && oficinaInfo.custos.length > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Orçamento Total</p>
                          <p className="font-medium text-lg">
                            {calcularOrcamentoTotal().toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                        </div>
                      )}

                      {oficinaInfo.resultadosEsperados && oficinaInfo.resultadosEsperados.length > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Resultados Esperados</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {oficinaInfo.resultadosEsperados.map((res, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {res}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NovoProjetoOficina;
