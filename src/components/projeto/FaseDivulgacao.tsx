import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  Users,
  DollarSign,
  Briefcase,
  MessageSquare,
  Heart,
  Clock,
  MapPin,
  Star,
  Send,
  Eye,
  UserPlus,
} from "lucide-react";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
}

interface FaseDivulgacaoProps {
  projeto: Projeto;
}

const investidoresInteressados = [
  { id: "1", nome: "Instituto Cultural ABC", tipo: "Patrocinador", valor: "R$ 15.000", status: "negociando" },
  { id: "2", nome: "Fundação Arte Viva", tipo: "Apoiador", valor: "R$ 8.000", status: "aprovado" },
  { id: "3", nome: "Empresa XYZ", tipo: "Patrocinador", valor: "R$ 25.000", status: "pendente" },
];

const candidatosTrabalhadores = [
  { id: "1", nome: "Carlos Diretor", funcao: "Diretor de Fotografia", experiencia: "5 anos", local: "São Paulo, SP", avaliacao: 4.8 },
  { id: "2", nome: "Marina Som", funcao: "Técnica de Som", experiencia: "3 anos", local: "Rio de Janeiro, RJ", avaliacao: 4.5 },
  { id: "3", nome: "Roberto Luz", funcao: "Iluminador", experiencia: "7 anos", local: "Belo Horizonte, MG", avaliacao: 4.9 },
  { id: "4", nome: "Patrícia Prod", funcao: "Assistente de Produção", experiencia: "2 anos", local: "São Paulo, SP", avaliacao: 4.3 },
];

export const FaseDivulgacao = ({ projeto }: FaseDivulgacaoProps) => {
  const [activeTab, setActiveTab] = useState("investidores");

  const metaFinanciamento = 50000;
  const arrecadado = 23000;
  const percentArrecadado = (arrecadado / metaFinanciamento) * 100;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1.2k</p>
                <p className="text-sm text-muted-foreground">Visualizações</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-sm text-muted-foreground">Interessados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Investidores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <UserPlus className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Candidatos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meta de financiamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Meta de Financiamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-emerald-500">
                  R$ {arrecadado.toLocaleString("pt-BR")}
                </p>
                <p className="text-muted-foreground">
                  de R$ {metaFinanciamento.toLocaleString("pt-BR")}
                </p>
              </div>
              <p className="text-lg font-semibold">{percentArrecadado.toFixed(0)}%</p>
            </div>
            <Progress value={percentArrecadado} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="investidores" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Investidores
          </TabsTrigger>
          <TabsTrigger value="trabalhadores" className="gap-2">
            <Users className="h-4 w-4" />
            Trabalhadores Culturais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investidores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Investidores Interessados</CardTitle>
              <CardDescription>
                Gerencie as propostas de patrocínio e apoio ao projeto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investidoresInteressados.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{inv.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{inv.nome}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          {inv.tipo}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-emerald-500">{inv.valor}</p>
                        <Badge
                          variant={
                            inv.status === "aprovado"
                              ? "default"
                              : inv.status === "negociando"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trabalhadores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidatos para o Projeto</CardTitle>
              <CardDescription>
                Profissionais interessados em participar do projeto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidatosTrabalhadores.map((cand) => (
                  <div key={cand.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{cand.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{cand.nome}</p>
                          <p className="text-sm text-primary">{cand.funcao}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{cand.avaliacao}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cand.experiencia}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cand.local}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1">
                        Convidar
                      </Button>
                      <Button size="sm" variant="outline">
                        Ver perfil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ação de divulgação */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Ampliar Divulgação</h3>
                <p className="text-sm text-muted-foreground">
                  Publique seu projeto na vitrine da CENA para mais visibilidade
                </p>
              </div>
            </div>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Publicar na Vitrine
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
