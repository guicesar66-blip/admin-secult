import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Send,
  User,
  Lightbulb,
  Users,
  DollarSign,
  Calendar,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface ProjetoInfo {
  titulo?: string;
  tipo?: string;
  descricao?: string;
  objetivo?: string;
  publicoAlvo?: string;
  profissionais?: string[];
  orcamentoEstimado?: number;
  prazoEstimado?: string;
  retornoEsperado?: string;
  localizacao?: string;
}

const etapasColeta = [
  { id: "tipo", label: "Tipo do Projeto", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "descricao", label: "Descrição", icon: <Target className="h-4 w-4" /> },
  { id: "equipe", label: "Equipe Necessária", icon: <Users className="h-4 w-4" /> },
  { id: "orcamento", label: "Orçamento", icon: <DollarSign className="h-4 w-4" /> },
  { id: "cronograma", label: "Cronograma", icon: <Calendar className="h-4 w-4" /> },
];

const perguntasIA = [
  {
    etapa: "inicio",
    mensagem: "Olá! 👋 Sou o assistente CENA e vou te ajudar a estruturar seu projeto cultural. Para começarmos, me conta: **qual é o nome do seu projeto?**",
  },
  {
    etapa: "tipo",
    mensagem: "Ótimo nome! Agora me diz: **que tipo de projeto é esse?** Por exemplo: um show, festival, gravação de EP/álbum, documentário, peça de teatro, exposição de arte...",
  },
  {
    etapa: "descricao",
    mensagem: "Interessante! Me conta mais sobre a **ideia central do projeto**. O que você quer criar? Qual a história ou conceito por trás?",
  },
  {
    etapa: "objetivo",
    mensagem: "Entendi sua visão! Qual é o **principal objetivo** desse projeto? É difundir cultura local, gerar renda para artistas, documentar histórias, criar um espaço de entretenimento?",
  },
  {
    etapa: "publico",
    mensagem: "E quem você imagina como **público-alvo**? Jovens, famílias, público específico de algum gênero musical ou artístico, comunidade local?",
  },
  {
    etapa: "equipe",
    mensagem: "Agora vamos falar de equipe! **Quais profissionais você acha que vai precisar?** Por exemplo: músicos, técnicos de som, videomakers, produtores, designers, iluminadores...",
  },
  {
    etapa: "orcamento",
    mensagem: "Sobre investimento: você já tem uma **estimativa de orçamento**? Se não tiver certeza, me diz um valor aproximado que você imagina ou se precisa de ajuda pra calcular.",
  },
  {
    etapa: "prazo",
    mensagem: "Qual seria o **prazo ideal** para realizar esse projeto? Está pensando em algo para os próximos meses ou tem uma data específica em mente?",
  },
  {
    etapa: "retorno",
    mensagem: "Por fim, qual o **retorno esperado** com esse projeto? Pode ser financeiro, de visibilidade, impacto social, captação de patrocínio, construção de portfólio...",
  },
  {
    etapa: "finalizacao",
    mensagem: "Excelente! 🎉 Agora tenho uma boa base para estruturar seu projeto. Vou criar um resumo com todas as informações. Você poderá revisar e ajustar antes de prosseguir para a fase de **Divulgação**, onde vamos buscar investidores e profissionais culturais interessados!",
  },
];

const NovoProjetoConstrucao = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [projetoInfo, setProjetoInfo] = useState<ProjetoInfo>({});
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const progresso = Math.round((etapaAtual / perguntasIA.length) * 100);

  useEffect(() => {
    // Mensagem inicial da IA
    setTimeout(() => {
      addAssistantMessage(perguntasIA[0].mensagem);
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
    const novoProjetoInfo = { ...projetoInfo };

    switch (etapaAtual) {
      case 0:
        novoProjetoInfo.titulo = resposta;
        break;
      case 1:
        novoProjetoInfo.tipo = resposta;
        break;
      case 2:
        novoProjetoInfo.descricao = resposta;
        break;
      case 3:
        novoProjetoInfo.objetivo = resposta;
        break;
      case 4:
        novoProjetoInfo.publicoAlvo = resposta;
        break;
      case 5:
        novoProjetoInfo.profissionais = resposta.split(",").map((p) => p.trim());
        break;
      case 6:
        novoProjetoInfo.orcamentoEstimado = parseFloat(resposta.replace(/\D/g, "")) || 0;
        break;
      case 7:
        novoProjetoInfo.prazoEstimado = resposta;
        break;
      case 8:
        novoProjetoInfo.retornoEsperado = resposta;
        break;
    }

    setProjetoInfo(novoProjetoInfo);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Adiciona mensagem do usuário
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

    // Avança para próxima pergunta
    const proximaEtapa = etapaAtual + 1;
    setEtapaAtual(proximaEtapa);

    if (proximaEtapa < perguntasIA.length) {
      addAssistantMessage(perguntasIA[proximaEtapa].mensagem);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const finalizarProjeto = () => {
    // Navegar para a página de detalhes com a fase de divulgação ativa
    const novoProjetoId = `novo-${Date.now()}`;
    navigate(`/oportunidades/${novoProjetoId}`, {
      state: {
        novoProjeto: {
          id: novoProjetoId,
          titulo: projetoInfo.titulo || "Novo Projeto",
          descricao: projetoInfo.descricao || "",
          tipo: projetoInfo.tipo || "outro",
          fase: "divulgacao" as const,
          dataInicio: new Date().toISOString().split("T")[0],
          prazo: projetoInfo.prazoEstimado || "",
          membros: [],
          progresso: 25,
          responsavel: "Você",
          orcamentoEstimado: projetoInfo.orcamentoEstimado,
          profissionais: projetoInfo.profissionais,
          objetivo: projetoInfo.objetivo,
          publicoAlvo: projetoInfo.publicoAlvo,
          retornoEsperado: projetoInfo.retornoEsperado,
        },
        faseInicial: "divulgacao",
      },
    });
  };

  const projetoCompleto = etapaAtual >= perguntasIA.length - 1;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Painel de Chat */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Assistente CENA</CardTitle>
                    <p className="text-sm text-muted-foreground">Construindo seu projeto cultural</p>
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
                            ? "bg-primary/20 text-primary"
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
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-primary/20 text-primary">
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
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua resposta..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={finalizarProjeto} className="w-full gap-2">
                    Finalizar e ir para Divulgação
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral - Resumo do Projeto */}
        <div className="w-96 shrink-0">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Resumo do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-4">
                  {/* Etapas de coleta */}
                  <div className="space-y-2">
                    {etapasColeta.map((etapa, index) => {
                      const isComplete = index < Math.floor(etapaAtual / 2);
                      const isCurrent = index === Math.floor(etapaAtual / 2);

                      return (
                        <div
                          key={etapa.id}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            isComplete
                              ? "bg-success/10 text-success"
                              : isCurrent
                              ? "bg-primary/10 text-primary"
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
                  {Object.keys(projetoInfo).length > 0 && (
                    <div className="pt-4 border-t space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Informações Coletadas
                      </h4>

                      {projetoInfo.titulo && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Nome</p>
                          <p className="font-medium">{projetoInfo.titulo}</p>
                        </div>
                      )}

                      {projetoInfo.tipo && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Tipo</p>
                          <p className="font-medium">{projetoInfo.tipo}</p>
                        </div>
                      )}

                      {projetoInfo.descricao && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Descrição</p>
                          <p className="text-sm">{projetoInfo.descricao}</p>
                        </div>
                      )}

                      {projetoInfo.objetivo && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Objetivo</p>
                          <p className="text-sm">{projetoInfo.objetivo}</p>
                        </div>
                      )}

                      {projetoInfo.publicoAlvo && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Público-alvo</p>
                          <p className="text-sm">{projetoInfo.publicoAlvo}</p>
                        </div>
                      )}

                      {projetoInfo.profissionais && projetoInfo.profissionais.length > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Profissionais</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {projetoInfo.profissionais.map((prof, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {prof}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {projetoInfo.orcamentoEstimado !== undefined && projetoInfo.orcamentoEstimado > 0 && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Orçamento Estimado</p>
                          <p className="font-medium">
                            {projetoInfo.orcamentoEstimado.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                        </div>
                      )}

                      {projetoInfo.prazoEstimado && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Prazo</p>
                          <p className="text-sm">{projetoInfo.prazoEstimado}</p>
                        </div>
                      )}

                      {projetoInfo.retornoEsperado && (
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground">Retorno Esperado</p>
                          <p className="text-sm">{projetoInfo.retornoEsperado}</p>
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

export default NovoProjetoConstrucao;
