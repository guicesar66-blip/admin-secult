import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  List,
  CalendarDays,
  Plus,
  GripVertical,
  Clock,
  User,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";

interface Projeto {
  id: string;
  titulo: string;
}

interface FaseExecucaoProps {
  projeto: Projeto;
}

interface Tarefa {
  id: string;
  titulo: string;
  status: "todo" | "doing" | "review" | "done";
  prioridade: "baixa" | "media" | "alta";
  responsavel: string;
  prazo: string;
  tags: string[];
}

const tarefasIniciais: Tarefa[] = [
  { id: "1", titulo: "Contratar equipe técnica", status: "done", prioridade: "alta", responsavel: "Maria", prazo: "2024-02-15", tags: ["equipe"] },
  { id: "2", titulo: "Alugar equipamentos", status: "doing", prioridade: "alta", responsavel: "João", prazo: "2024-02-20", tags: ["logística"] },
  { id: "3", titulo: "Definir palco e estrutura", status: "doing", prioridade: "media", responsavel: "Ana", prazo: "2024-02-25", tags: ["estrutura"] },
  { id: "4", titulo: "Confirmar artistas", status: "review", prioridade: "alta", responsavel: "Maria", prazo: "2024-03-01", tags: ["artístico"] },
  { id: "5", titulo: "Criar material gráfico", status: "todo", prioridade: "media", responsavel: "Carlos", prazo: "2024-03-05", tags: ["marketing"] },
  { id: "6", titulo: "Contratar segurança", status: "todo", prioridade: "baixa", responsavel: "João", prazo: "2024-03-10", tags: ["logística"] },
  { id: "7", titulo: "Montar cronograma do evento", status: "todo", prioridade: "media", responsavel: "Ana", prazo: "2024-03-15", tags: ["planejamento"] },
  { id: "8", titulo: "Testar som e iluminação", status: "todo", prioridade: "alta", responsavel: "Pedro", prazo: "2024-03-20", tags: ["técnico"] },
];

const statusConfig = {
  todo: { label: "A Fazer", color: "bg-slate-500" },
  doing: { label: "Em Andamento", color: "bg-blue-500" },
  review: { label: "Em Revisão", color: "bg-amber-500" },
  done: { label: "Concluído", color: "bg-emerald-500" },
};

const prioridadeConfig = {
  baixa: { label: "Baixa", color: "text-slate-500" },
  media: { label: "Média", color: "text-amber-500" },
  alta: { label: "Alta", color: "text-red-500" },
};

export const FaseExecucao = ({ projeto }: FaseExecucaoProps) => {
  const [visualizacao, setVisualizacao] = useState<"kanban" | "lista" | "timeline">("kanban");
  const [tarefas] = useState<Tarefa[]>(tarefasIniciais);

  const tarefasPorStatus = {
    todo: tarefas.filter((t) => t.status === "todo"),
    doing: tarefas.filter((t) => t.status === "doing"),
    review: tarefas.filter((t) => t.status === "review"),
    done: tarefas.filter((t) => t.status === "done"),
  };

  const TarefaCard = ({ tarefa }: { tarefa: Tarefa }) => (
    <div className="bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{tarefa.titulo}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {tarefa.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(tarefa.prazo).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </div>
        <div className="flex items-center gap-1">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">{tarefa.responsavel.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      {tarefa.prioridade === "alta" && (
        <div className={`mt-2 flex items-center gap-1 text-xs ${prioridadeConfig[tarefa.prioridade].color}`}>
          <AlertCircle className="h-3 w-3" />
          Prioridade alta
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header com visualizações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Gestão de Tarefas</h2>
          <p className="text-sm text-muted-foreground">
            {tarefas.length} tarefas · {tarefasPorStatus.done.length} concluídas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg p-1">
            <Button
              variant={visualizacao === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setVisualizacao("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={visualizacao === "lista" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setVisualizacao("lista")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={visualizacao === "timeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setVisualizacao("timeline")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Visualização Kanban */}
      {visualizacao === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusConfig[status].color}`} />
                  <span className="font-medium text-sm">{statusConfig[status].label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tarefasPorStatus[status].length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-2">
                {tarefasPorStatus[status].map((tarefa) => (
                  <TarefaCard key={tarefa.id} tarefa={tarefa} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visualização Lista */}
      {visualizacao === "lista" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {tarefa.status === "done" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <p className={`font-medium ${tarefa.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                      {tarefa.titulo}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {tarefa.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge variant="outline" className={statusConfig[tarefa.status].color + " text-white border-0"}>
                    {statusConfig[tarefa.status].label}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(tarefa.prazo).toLocaleDateString("pt-BR")}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{tarefa.responsavel.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualização Timeline */}
      {visualizacao === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle>Cronograma do Projeto</CardTitle>
            <CardDescription>Visualização temporal das tarefas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Meses */}
              <div className="flex border-b pb-2 mb-4">
                {["Fev", "Mar", "Abr", "Mai", "Jun"].map((mes) => (
                  <div key={mes} className="flex-1 text-center text-sm font-medium text-muted-foreground">
                    {mes}
                  </div>
                ))}
              </div>

              {/* Tarefas no timeline */}
              <div className="space-y-3">
                {tarefas.map((tarefa, index) => {
                  const startPercent = Math.min(100, Math.max(0, (index * 10) + 5));
                  const width = 20 + Math.random() * 15;

                  return (
                    <div key={tarefa.id} className="flex items-center gap-4">
                      <div className="w-40 truncate text-sm">{tarefa.titulo}</div>
                      <div className="flex-1 h-8 bg-muted/30 rounded relative">
                        <div
                          className={`absolute h-full rounded ${statusConfig[tarefa.status].color} opacity-80 flex items-center px-2`}
                          style={{ left: `${startPercent}%`, width: `${width}%` }}
                        >
                          <span className="text-xs text-white truncate">{tarefa.responsavel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo da equipe */}
      <Card>
        <CardHeader>
          <CardTitle>Equipe do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {["Maria", "João", "Ana", "Carlos", "Pedro"].map((nome) => {
              const tarefasPessoa = tarefas.filter((t) => t.responsavel === nome);
              const concluidas = tarefasPessoa.filter((t) => t.status === "done").length;

              return (
                <div key={nome} className="flex items-center gap-3 p-3 border rounded-lg min-w-[200px]">
                  <Avatar>
                    <AvatarFallback>{nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {concluidas}/{tarefasPessoa.length} tarefas
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
