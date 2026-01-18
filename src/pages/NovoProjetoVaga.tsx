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
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  MapPin,
  Clock,
  DollarSign,
  Target,
  Calendar,
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

interface VagaInfo {
  titulo?: string;
  descricao?: string;
  local?: string;
  municipio?: string;
  duracao?: string;
  horario?: string;
  remuneracao?: number;
  vagas?: number;
  requisitos?: string;
  prazoInscricao?: string;
  areaCultural?: string;
}

const etapasVaga = [
  { id: "titulo", label: "Título da Vaga", icon: <Briefcase className="h-4 w-4" /> },
  { id: "descricao", label: "Descrição", icon: <FileText className="h-4 w-4" /> },
  { id: "area", label: "Área Cultural", icon: <Target className="h-4 w-4" /> },
  { id: "local", label: "Local de Trabalho", icon: <MapPin className="h-4 w-4" /> },
  { id: "horario", label: "Carga Horária", icon: <Clock className="h-4 w-4" /> },
  { id: "remuneracao", label: "Remuneração", icon: <DollarSign className="h-4 w-4" /> },
  { id: "vagas", label: "Número de Vagas", icon: <Briefcase className="h-4 w-4" /> },
  { id: "requisitos", label: "Requisitos", icon: <Target className="h-4 w-4" /> },
  { id: "prazo", label: "Prazo de Inscrição", icon: <Calendar className="h-4 w-4" /> },
];

const perguntasVaga = [
  {
    etapa: "inicio",
    mensagem: "Olá! 👋 Sou o assistente CENA e vou te ajudar a criar uma **Vaga de Trabalho**. Vamos seguir 9 etapas. Para começar: **qual é o título da vaga?** Exemplo: 'Produtor Cultural', 'Técnico de Som'",
  },
  {
    etapa: "descricao",
    mensagem: "Descreva a vaga. **Quais são as principais atividades e responsabilidades?**",
  },
  {
    etapa: "area",
    mensagem: "Qual **área cultural** essa vaga pertence? Exemplo: 'Música', 'Teatro', 'Audiovisual', 'Artes Visuais', 'Produção Cultural'",
  },
  {
    etapa: "local",
    mensagem: "Onde será o **local de trabalho**? Informe o endereço ou se é remoto. Exemplo: 'Centro Cultural, Recife' ou 'Remoto'",
  },
  {
    etapa: "horario",
    mensagem: "Qual a **carga horária** ou regime de trabalho? Exemplo: '40h semanais', 'Por projeto', 'Fins de semana'",
  },
  {
    etapa: "remuneracao",
    mensagem: "Qual a **remuneração** oferecida? Informe o valor em reais. Exemplo: '3000' para R$ 3.000,00",
  },
  {
    etapa: "vagas",
    mensagem: "Quantas **vagas** estão disponíveis para esta posição?",
  },
  {
    etapa: "requisitos",
    mensagem: "Quais são os **requisitos** para a vaga? Formação, experiência, habilidades necessárias...",
  },
  {
    etapa: "prazo",
    mensagem: "Qual o **prazo para inscrições**? Informe a data limite. Exemplo: '31/03/2025'",
  },
  {
    etapa: "finalizacao",
    mensagem: "🎉 Excelente! Sua vaga está estruturada! Vou salvar no sistema e ela ficará disponível para candidatos.",
  },
];

const NovoProjetoVaga = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createOportunidade = useCreateOportunidade();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [vagaInfo, setVagaInfo] = useState<VagaInfo>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const progresso = Math.round((etapaAtual / (perguntasVaga.length - 1)) * 100);

  useEffect(() => {
    setTimeout(() => {
      addAssistantMessage(perguntasVaga[0].mensagem);
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
    const novaVagaInfo = { ...vagaInfo };

    switch (etapaAtual) {
      case 0:
        novaVagaInfo.titulo = resposta;
        break;
      case 1:
        novaVagaInfo.descricao = resposta;
        break;
      case 2:
        novaVagaInfo.areaCultural = resposta;
        break;
      case 3:
        const partes = resposta.split(",").map(p => p.trim());
        novaVagaInfo.local = partes[0];
        novaVagaInfo.municipio = partes[1] || partes[0];
        break;
      case 4:
        novaVagaInfo.duracao = resposta;
        novaVagaInfo.horario = resposta;
        break;
      case 5:
        const valorMatch = resposta.match(/(\d+[\.,]?\d*)/);
        novaVagaInfo.remuneracao = valorMatch ? parseFloat(valorMatch[1].replace(",", ".")) : 0;
        break;
      case 6:
        const vagasMatch = resposta.match(/(\d+)/);
        novaVagaInfo.vagas = vagasMatch ? parseInt(vagasMatch[1]) : 1;
        break;
      case 7:
        novaVagaInfo.requisitos = resposta;
        break;
      case 8:
        const dataMatch = resposta.match(/(\d{2}\/\d{2}\/\d{4})/);
        if (dataMatch) {
          const [dia, mes, ano] = dataMatch[1].split("/");
          novaVagaInfo.prazoInscricao = `${ano}-${mes}-${dia}`;
        }
        break;
    }

    setVagaInfo(novaVagaInfo);
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

    if (proximaEtapa < perguntasVaga.length) {
      addAssistantMessage(perguntasVaga[proximaEtapa].mensagem);
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
      await createOportunidade.mutateAsync({
        titulo: vagaInfo.titulo || "Nova Vaga",
        descricao: vagaInfo.descricao,
        tipo: "vaga",
        local: vagaInfo.local,
        municipio: vagaInfo.municipio,
        horario: vagaInfo.horario,
        duracao: vagaInfo.duracao || "A definir",
        vagas: vagaInfo.vagas,
        remuneracao: vagaInfo.remuneracao,
        requisitos: vagaInfo.requisitos,
        prazo_inscricao: vagaInfo.prazoInscricao,
        area_cultural: vagaInfo.areaCultural,
        criador_nome: user?.email || "Admin",
        criador_id: user?.id,
      });

      navigate(`/oportunidades`);
    } catch (error) {
      console.error("Error saving vaga:", error);
      setIsSaving(false);
    }
  };

  const projetoCompleto = etapaAtual >= perguntasVaga.length - 1;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-500/10 to-emerald-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-500/20">
                    <Briefcase className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Criar Vaga de Trabalho</CardTitle>
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
                            ? "bg-emerald-500/20 text-emerald-600"
                            : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                          message.role === "assistant" ? "bg-muted" : "bg-emerald-600 text-white"
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
                      <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-emerald-500/20 text-emerald-600">
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
                    <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={finalizarProjeto} disabled={isSaving} className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Salvar Vaga
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-80 shrink-0">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b bg-emerald-500/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Estrutura da Vaga
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2">
                  {etapasVaga.map((etapa, index) => {
                    const isComplete = index < etapaAtual;
                    const isCurrent = index === etapaAtual;

                    return (
                      <div
                        key={etapa.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          isComplete ? "bg-emerald-500/10 text-emerald-600" : isCurrent ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground"
                        }`}
                      >
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : etapa.icon}
                        <span className="text-sm font-medium">{etapa.label}</span>
                      </div>
                    );
                  })}
                </div>

                {vagaInfo.titulo && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-3">
                    <h4 className="font-semibold">{vagaInfo.titulo}</h4>
                    {vagaInfo.areaCultural && <Badge variant="outline">{vagaInfo.areaCultural}</Badge>}
                    {vagaInfo.descricao && <p className="text-sm text-muted-foreground line-clamp-2">{vagaInfo.descricao}</p>}
                    {vagaInfo.local && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3" />
                        {vagaInfo.local}
                      </div>
                    )}
                    {vagaInfo.remuneracao && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-3 w-3" />
                        R$ {vagaInfo.remuneracao.toLocaleString("pt-BR")}
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

export default NovoProjetoVaga;
