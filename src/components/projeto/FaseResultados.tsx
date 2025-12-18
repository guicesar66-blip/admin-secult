import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Upload,
  Image,
  Video,
  FileText,
  Users,
  DollarSign,
  Calendar,
  Star,
  Share2,
  CheckCircle2,
  MessageSquare,
  Send,
  BarChart3,
  Heart,
  Eye,
} from "lucide-react";

interface Projeto {
  id: string;
  titulo: string;
}

interface FaseResultadosProps {
  projeto: Projeto;
}

const metricas = [
  { label: "Público alcançado", valor: "2.500", icone: Users, cor: "text-blue-500" },
  { label: "Investimento total", valor: "R$ 45.000", icone: DollarSign, cor: "text-emerald-500" },
  { label: "Artistas envolvidos", valor: "18", icone: Star, cor: "text-amber-500" },
  { label: "Dias de evento", valor: "3", icone: Calendar, cor: "text-purple-500" },
];

const feedbacks = [
  { id: "1", autor: "Secretaria de Cultura", texto: "Projeto muito bem executado! Parabéns pela organização.", data: "15/03/2024", nota: 5 },
  { id: "2", autor: "Instituto Cultural ABC", texto: "Ficamos muito satisfeitos com o retorno do investimento.", data: "14/03/2024", nota: 4 },
  { id: "3", autor: "Público Geral", texto: "Melhor festival da região! Esperamos a próxima edição.", data: "13/03/2024", nota: 5 },
];

const checklistColeta = [
  { id: "1", label: "Fotos profissionais do evento", done: true },
  { id: "2", label: "Vídeo resumo (até 3 min)", done: true },
  { id: "3", label: "Relatório de público e alcance", done: false },
  { id: "4", label: "Depoimentos dos participantes", done: false },
  { id: "5", label: "Prestação de contas", done: false },
  { id: "6", label: "Clipping de mídia", done: false },
];

export const FaseResultados = ({ projeto }: FaseResultadosProps) => {
  const [descricaoResultado, setDescricaoResultado] = useState("");

  const completedItems = checklistColeta.filter((item) => item.done).length;
  const progressPercent = (completedItems / checklistColeta.length) * 100;

  return (
    <div className="space-y-6">
      {/* Banner de sucesso */}
      <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-amber-500/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-500 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Parabéns! Projeto concluído</h2>
              <p className="text-muted-foreground mt-1">
                Agora é hora de documentar os resultados e compartilhar na CENA
              </p>
            </div>
            <Button className="gap-2">
              <Share2 className="h-4 w-4" />
              Publicar na CENA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricas.map((metrica) => (
          <Card key={metrica.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-muted rounded-lg ${metrica.cor}`}>
                  <metrica.icone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrica.valor}</p>
                  <p className="text-sm text-muted-foreground">{metrica.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coleta de materiais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Coleta de Materiais
              </CardTitle>
              <CardDescription>
                O time da CENA vai ajudar a documentar e divulgar seu projeto
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={progressPercent} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  {completedItems}/{checklistColeta.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklistColeta.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      item.done ? "bg-emerald-500/5 border-emerald-500/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className={item.done ? "text-muted-foreground" : ""}>{item.label}</span>
                    </div>
                    {!item.done && (
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Galeria de mídia */}
          <Card>
            <CardHeader>
              <CardTitle>Galeria do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors"
                  >
                    {i <= 2 ? (
                      <div className="text-center">
                        <Image className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Foto {i}</span>
                      </div>
                    ) : i === 3 ? (
                      <div className="text-center">
                        <Video className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Vídeo</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Adicionar</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Descrição para publicação */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição para Publicação</CardTitle>
              <CardDescription>
                Escreva um resumo do projeto para ser publicado na CENA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Conte como foi a realização do projeto, os destaques, desafios superados e impacto na comunidade..."
                value={descricaoResultado}
                onChange={(e) => setDescricaoResultado(e.target.value)}
                className="min-h-[150px]"
              />
              <div className="flex justify-end">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Salvar Descrição
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alcance na CENA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Alcance na CENA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>Visualizações</span>
                </div>
                <span className="font-bold">3.2k</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>Curtidas</span>
                </div>
                <span className="font-bold">248</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                  <span>Compartilhamentos</span>
                </div>
                <span className="font-bold">56</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comentários</span>
                </div>
                <span className="font-bold">32</span>
              </div>
            </CardContent>
          </Card>

          {/* Feedbacks */}
          <Card>
            <CardHeader>
              <CardTitle>Feedbacks Recebidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{feedback.autor}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: feedback.nota }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{feedback.texto}</p>
                    <p className="text-xs text-muted-foreground mt-2">{feedback.data}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contato CENA */}
          <Card className="border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Precisa de ajuda?</p>
                  <p className="text-xs text-muted-foreground">
                    O time CENA está disponível para auxiliar na coleta de resultados
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3" size="sm">
                Falar com a CENA
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
