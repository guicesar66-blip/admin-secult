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
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Users,
  Target,
  Heart,
  Handshake,
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

interface BairroInfo {
  titulo?: string;
  descricao?: string;
  bairro?: string;
  municipio?: string;
  duracao?: string;
  publicoAlvo?: string;
  vagas?: number;
  objetivos?: string;
  parcerias?: string;
  impactoSocial?: string;
}

const etapasBairro = [
  { id: "titulo", label: "Nome do Projeto", icon: <MapPin className="h-4 w-4" /> },
  { id: "descricao", label: "Descrição", icon: <FileText className="h-4 w-4" /> },
  { id: "local", label: "Bairro/Comunidade", icon: <MapPin className="h-4 w-4" /> },
  { id: "duracao", label: "Duração", icon: <Clock className="h-4 w-4" /> },
  { id: "publico", label: "Público-Alvo", icon: <Users className="h-4 w-4" /> },
  { id: "objetivos", label: "Objetivos", icon: <Target className="h-4 w-4" /> },
  { id: "parcerias", label: "Parcerias", icon: <Handshake className="h-4 w-4" /> },
  { id: "impacto", label: "Impacto Social", icon: <Heart className="h-4 w-4" /> },
];

const perguntasBairro = [
  {
    etapa: "inicio",
    mensagem: "Olá! 👋 Sou o assistente CENA e vou te ajudar a criar um **Projeto de Bairro**. Esses projetos focam em transformação comunitária! Para começar: **qual é o nome do seu projeto?**",
  },
  {
    etapa: "descricao",
    mensagem: "Descreva seu projeto. **Qual é a proposta principal?** O que vocês pretendem fazer na comunidade?",
  },
  {
    etapa: "local",
    mensagem: "Em qual **bairro ou comunidade** o projeto será realizado? Informe também o município. Exemplo: 'Alto José do Pinho, Recife'",
  },
  {
    etapa: "duracao",
    mensagem: "Qual a **duração estimada** do projeto? Exemplo: '3 meses', '1 ano', 'Ação pontual de 1 dia'",
  },
  {
    etapa: "publico",
    mensagem: "Quem é o **público-alvo** do projeto? Quantas pessoas você espera impactar? Exemplo: 'Jovens de 15-25 anos, cerca de 100 pessoas'",
  },
  {
    etapa: "objetivos",
    mensagem: "Quais são os **principais objetivos** do projeto? O que vocês querem alcançar?",
  },
  {
    etapa: "parcerias",
    mensagem: "Vocês terão **parcerias** com outras organizações, coletivos ou instituições? Se sim, quais?",
  },
  {
    etapa: "impacto",
    mensagem: "Qual o **impacto social esperado**? Como o projeto vai transformar a realidade da comunidade?",
  },
  {
    etapa: "finalizacao",
    mensagem: "🎉 Excelente! Seu projeto de bairro está estruturado! Vou salvar no sistema e você poderá acompanhar o progresso.",
  },
];

const NovoProjetoBairro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createOportunidade = useCreateOportunidade();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [bairroInfo, setBairroInfo] = useState<BairroInfo>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const progresso = Math.round((etapaAtual / (perguntasBairro.length - 1)) * 100);

  useEffect(() => {
    setTimeout(() => {
      addAssistantMessage(perguntasBairro[0].mensagem);
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
    const novaBairroInfo = { ...bairroInfo };

    switch (etapaAtual) {
      case 0:
        novaBairroInfo.titulo = resposta;
        break;
      case 1:
        novaBairroInfo.descricao = resposta;
        break;
      case 2:
        const partes = resposta.split(",").map(p => p.trim());
        novaBairroInfo.bairro = partes[0];
        novaBairroInfo.municipio = partes[1] || partes[0];
        break;
      case 3:
        novaBairroInfo.duracao = resposta;
        break;
      case 4:
        const vagasMatch = resposta.match(/(\d+)/);
        novaBairroInfo.vagas = vagasMatch ? parseInt(vagasMatch[1]) : 50;
        novaBairroInfo.publicoAlvo = resposta;
        break;
      case 5:
        novaBairroInfo.objetivos = resposta;
        break;
      case 6:
        novaBairroInfo.parcerias = resposta;
        break;
      case 7:
        novaBairroInfo.impactoSocial = resposta;
        break;
    }

    setBairroInfo(novaBairroInfo);
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

    if (proximaEtapa < perguntasBairro.length) {
      addAssistantMessage(perguntasBairro[proximaEtapa].mensagem);
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
      // Montar descrição completa com objetivos, parcerias e impacto
      const descricaoCompleta = [
        bairroInfo.descricao,
        bairroInfo.objetivos && `\n\nObjetivos: ${bairroInfo.objetivos}`,
        bairroInfo.parcerias && `\n\nParcerias: ${bairroInfo.parcerias}`,
        bairroInfo.impactoSocial && `\n\nImpacto Social: ${bairroInfo.impactoSocial}`,
      ].filter(Boolean).join("");

      await createOportunidade.mutateAsync({
        titulo: bairroInfo.titulo || "Novo Projeto de Bairro",
        descricao: descricaoCompleta,
        tipo: "projeto_bairro",
        local: bairroInfo.bairro,
        municipio: bairroInfo.municipio,
        duracao: bairroInfo.duracao || "A definir",
        vagas: bairroInfo.vagas,
        requisitos: bairroInfo.publicoAlvo,
        area_cultural: "Projeto Comunitário",
        criador_nome: user?.email || "Admin",
        criador_id: user?.id,
      });

      navigate(`/oportunidades`);
    } catch (error) {
      console.error("Error saving projeto bairro:", error);
      setIsSaving(false);
    }
  };

  const projetoCompleto = etapaAtual >= perguntasBairro.length - 1;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex gap-6">
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-purple-500/10 to-purple-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <MapPin className="h-5 w-5 text-pe-blue-dark" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Criar Projeto de Bairro</CardTitle>
                    <p className="text-sm text-muted-foreground">Assistente CENA - 8 etapas</p>
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
                          message.role === "assistant" ? "bg-primary/20 text-pe-blue-dark" : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                          message.role === "assistant" ? "bg-muted" : "bg-primary-dark text-white"
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
                      <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-primary/20 text-pe-blue-dark">
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
                    <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="bg-primary-dark hover:bg-purple-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={finalizarProjeto} disabled={isSaving} className="w-full gap-2 bg-primary-dark hover:bg-purple-700">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Salvar Projeto
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
            <CardHeader className="border-b bg-primary/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-pe-blue-dark" />
                Estrutura do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2">
                  {etapasBairro.map((etapa, index) => {
                    const isComplete = index < etapaAtual;
                    const isCurrent = index === etapaAtual;

                    return (
                      <div
                        key={etapa.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          isComplete ? "bg-emerald-500/10 text-emerald-600" : isCurrent ? "bg-primary/10 text-pe-blue-dark" : "text-muted-foreground"
                        }`}
                      >
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : etapa.icon}
                        <span className="text-sm font-medium">{etapa.label}</span>
                      </div>
                    );
                  })}
                </div>

                {bairroInfo.titulo && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-3">
                    <h4 className="font-semibold">{bairroInfo.titulo}</h4>
                    {bairroInfo.descricao && <p className="text-sm text-muted-foreground line-clamp-2">{bairroInfo.descricao}</p>}
                    {bairroInfo.bairro && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3" />
                        {bairroInfo.bairro}, {bairroInfo.municipio}
                      </div>
                    )}
                    {bairroInfo.vagas && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-3 w-3" />
                        {bairroInfo.vagas} pessoas impactadas
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

export default NovoProjetoBairro;
