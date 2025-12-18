import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Send,
  FileText,
  Target,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  Circle,
  Lightbulb,
} from "lucide-react";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
}

interface FaseConstrucaoProps {
  projeto: Projeto;
}

const checklistItems = [
  { id: "1", label: "Definir conceito do projeto", done: true },
  { id: "2", label: "Identificar público-alvo", done: true },
  { id: "3", label: "Estimar orçamento inicial", done: false },
  { id: "4", label: "Definir equipe mínima necessária", done: false },
  { id: "5", label: "Criar cronograma preliminar", done: false },
  { id: "6", label: "Elaborar proposta artística", done: false },
];

const sugestoesIA = [
  "Que tal definir 3 objetivos principais para o projeto?",
  "Considere mapear potenciais parceiros estratégicos",
  "Documente as referências artísticas que inspiram o projeto",
];

export const FaseConstrucao = ({ projeto }: FaseConstrucaoProps) => {
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `Olá! Sou o assistente de construção de projetos culturais. Estou aqui para ajudar você a desenvolver "${projeto.titulo}". O que você gostaria de definir primeiro? Posso ajudar com conceito, orçamento, cronograma ou equipe.`,
    },
  ]);

  const completedItems = checklistItems.filter((item) => item.done).length;
  const progressPercent = (completedItems / checklistItems.length) * 100;

  const handleEnviar = () => {
    if (!mensagem.trim()) return;

    setConversas((prev) => [
      ...prev,
      { role: "user", content: mensagem },
      {
        role: "assistant",
        content:
          "Entendi! Essa é uma ótima direção para o projeto. Sugiro documentarmos isso e pensarmos nos próximos passos. Quer que eu ajude a detalhar esse aspecto?",
      },
    ]);
    setMensagem("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Assistente IA */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Assistente de Construção
            </CardTitle>
            <CardDescription>
              Converse com a IA para desenvolver seu projeto cultural
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
              {conversas.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Descreva sua ideia ou faça perguntas sobre o projeto..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEnviar();
                  }
                }}
              />
              <Button onClick={handleEnviar} className="px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sugestoesIA.map((sugestao, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setMensagem(sugestao)}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {sugestao}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentos gerados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { titulo: "Proposta Artística", status: "rascunho" },
                { titulo: "Plano de Orçamento", status: "pendente" },
                { titulo: "Cronograma", status: "pendente" },
                { titulo: "Ficha Técnica", status: "pendente" },
              ].map((doc) => (
                <div
                  key={doc.titulo}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{doc.titulo}</span>
                  </div>
                  <Badge variant={doc.status === "rascunho" ? "secondary" : "outline"}>
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Checklist da Fase</CardTitle>
            <div className="flex items-center gap-2">
              <Progress value={progressPercent} className="flex-1" />
              <span className="text-sm text-muted-foreground">
                {completedItems}/{checklistItems.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={item.done ? "line-through text-muted-foreground" : ""}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumo rápido */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Target className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Objetivo</p>
                <p className="font-medium">A definir</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Público-alvo</p>
                <p className="font-medium">A definir</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orçamento estimado</p>
                <p className="font-medium">A definir</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duração prevista</p>
                <p className="font-medium">A definir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
