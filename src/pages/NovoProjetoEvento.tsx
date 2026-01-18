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
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Megaphone,
  Target,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateOportunidade } from "@/hooks/useOportunidades";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface EventoInfo {
  titulo?: string;
  descricao?: string;
  local?: string;
  municipio?: string;
  dataEvento?: string;
  horario?: string;
  duracao?: string;
  publicoAlvo?: string;
  vagas?: number;
  remuneracao?: number;
  requisitos?: string;
  divulgacao?: string;
}

const etapasEvento = [
  { id: "titulo", label: "Nome do Evento", icon: <Calendar className="h-4 w-4" /> },
  { id: "descricao", label: "Descrição", icon: <FileText className="h-4 w-4" /> },
  { id: "local", label: "Local", icon: <MapPin className="h-4 w-4" /> },
  { id: "dataHorario", label: "Data e Horário", icon: <Clock className="h-4 w-4" /> },
  { id: "duracao", label: "Duração", icon: <Clock className="h-4 w-4" /> },
  { id: "publico", label: "Público e Vagas", icon: <Users className="h-4 w-4" /> },
  { id: "remuneracao", label: "Cachê/Remuneração", icon: <DollarSign className="h-4 w-4" /> },
  { id: "requisitos", label: "Requisitos", icon: <Target className="h-4 w-4" /> },
  { id: "divulgacao", label: "Divulgação", icon: <Megaphone className="h-4 w-4" /> },
];

const perguntasEvento = [
  {
    etapa: "inicio",
    mensagem: "Olá! 👋 Sou o assistente CENA e vou te ajudar a criar seu **Evento Cultural**. Vamos seguir 9 etapas simples. Para começar, me conta: **qual é o nome do seu evento?**",
  },
  {
    etapa: "descricao",
    mensagem: "Ótimo nome! Agora descreva seu evento. **O que vai acontecer?** Conte sobre a proposta, atrações, e o que o público pode esperar.",
  },
  {
    etapa: "local",
    mensagem: "Onde o evento vai acontecer? Informe o **local** (nome do espaço) e o **município/cidade**. Exemplo: 'Teatro Municipal, Recife'",
  },
  {
    etapa: "dataHorario",
    mensagem: "Quando será o evento? Informe a **data** e o **horário de início**. Exemplo: '25/03/2025 às 19h'",
  },
  {
    etapa: "duracao",
    mensagem: "Qual a **duração estimada** do evento? Exemplo: '2 horas', 'o dia todo', '3 dias'",
  },
  {
    etapa: "publico",
    mensagem: "Sobre o **público**: quem é o público-alvo e quantas **vagas/lugares** estão disponíveis? Exemplo: 'Público geral, 200 lugares'",
  },
  {
    etapa: "remuneracao",
    mensagem: "Haverá **cachê ou remuneração** para artistas/participantes? Se sim, qual o valor estimado? (Digite 0 se não houver)",
  },
  {
    etapa: "requisitos",
    mensagem: "Quais são os **requisitos** para participar ou se apresentar? Exemplo: 'Experiência em música ao vivo, equipamento próprio'",
  },
  {
    etapa: "divulgacao",
    mensagem: "Como você pretende **divulgar** o evento? Redes sociais, parcerias, mídia local?",
  },
  {
    etapa: "finalizacao",
    mensagem: "🎉 Excelente! Seu evento está estruturado! Vou salvar no sistema e você poderá gerenciá-lo na listagem de projetos.",
  },
];

const NovoProjetoEvento = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createOportunidade = useCreateOportunidade();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [eventoInfo, setEventoInfo] = useState<EventoInfo>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const progresso = Math.round((etapaAtual / (perguntasEvento.length - 1)) * 100);

  useEffect(() => {
    setTimeout(() => {
      addAssistantMessage(perguntasEvento[0].mensagem);
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
    const novoEventoInfo = { ...eventoInfo };

    switch (etapaAtual) {
      case 0:
        novoEventoInfo.titulo = resposta;
        break;
      case 1:
        novoEventoInfo.descricao = resposta;
        break;
      case 2:
        const partes = resposta.split(",").map(p => p.trim());
        novoEventoInfo.local = partes[0];
        novoEventoInfo.municipio = partes[1] || partes[0];
        break;
      case 3:
        const dataMatch = resposta.match(/(\d{2}\/\d{2}\/\d{4})/);
        if (dataMatch) {
          const [dia, mes, ano] = dataMatch[1].split("/");
          novoEventoInfo.dataEvento = `${ano}-${mes}-${dia}`;
        }
        const horaMatch = resposta.match(/(\d{1,2}h|\d{1,2}:\d{2})/);
        novoEventoInfo.horario = horaMatch ? horaMatch[1] : resposta;
        break;
      case 4:
        novoEventoInfo.duracao = resposta;
        break;
      case 5:
        const vagasMatch = resposta.match(/(\d+)/);
        novoEventoInfo.vagas = vagasMatch ? parseInt(vagasMatch[1]) : 100;
        novoEventoInfo.publicoAlvo = resposta;
        break;
      case 6:
        const valorMatch = resposta.match(/(\d+[\.,]?\d*)/);
        novoEventoInfo.remuneracao = valorMatch ? parseFloat(valorMatch[1].replace(",", ".")) : 0;
        break;
      case 7:
        novoEventoInfo.requisitos = resposta;
        break;
      case 8:
        novoEventoInfo.divulgacao = resposta;
        break;
    }

    setEventoInfo(novoEventoInfo);
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

    if (proximaEtapa < perguntasEvento.length) {
      addAssistantMessage(perguntasEvento[proximaEtapa].mensagem);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const finalizarProjeto = async () => {
    setIsSaving(true);
    
    try {
      const result = await createOportunidade.mutateAsync({
        titulo: eventoInfo.titulo || "Novo Evento",
        descricao: eventoInfo.descricao,
        tipo: "evento",
        local: eventoInfo.local,
        municipio: eventoInfo.municipio,
        data_evento: eventoInfo.dataEvento,
        horario: eventoInfo.horario,
        duracao: eventoInfo.duracao || "A definir",
        vagas: eventoInfo.vagas,
        remuneracao: eventoInfo.remuneracao,
        requisitos: eventoInfo.requisitos,
        criador_nome: user?.email || "Admin",
        criador_id: user?.id,
      });

      navigate(`/oportunidades`);
    } catch (error) {
      console.error("Error saving evento:", error);
      setIsSaving(false);
    }
  };

  const projetoCompleto = etapaAtual >= perguntasEvento.length - 1;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        {/* Painel de Chat */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500/10 to-blue-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Criar Evento</CardTitle>
                    <p className="text-sm text-muted-foreground">Assistente CENA - 9 etapas</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  IA Ativa
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
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
                            ? "bg-blue-500/20 text-blue-600"
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
                            : "bg-blue-600 text-white"
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
                      <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-blue-500/20 text-blue-600">
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
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={finalizarProjeto}
                    disabled={isSaving}
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Salvar Evento
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="w-80 shrink-0">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b bg-blue-500/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Estrutura do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2">
                  {etapasEvento.map((etapa, index) => {
                    const isComplete = index < etapaAtual;
                    const isCurrent = index === etapaAtual;

                    return (
                      <div
                        key={etapa.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          isComplete
                            ? "bg-emerald-500/10 text-emerald-600"
                            : isCurrent
                            ? "bg-blue-500/10 text-blue-600"
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

                {eventoInfo.titulo && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-3">
                    <h4 className="font-semibold">{eventoInfo.titulo}</h4>
                    {eventoInfo.descricao && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{eventoInfo.descricao}</p>
                    )}
                    {eventoInfo.local && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3" />
                        {eventoInfo.local}
                      </div>
                    )}
                    {eventoInfo.dataEvento && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        {eventoInfo.dataEvento} {eventoInfo.horario && `às ${eventoInfo.horario}`}
                      </div>
                    )}
                    {eventoInfo.vagas && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-3 w-3" />
                        {eventoInfo.vagas} vagas
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NovoProjetoEvento;
