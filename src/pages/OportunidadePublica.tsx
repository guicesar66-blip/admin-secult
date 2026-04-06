import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InvestmentProposalDialog } from "@/components/InvestmentProposalDialog";
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
  CheckCircle2,
  Star,
} from "lucide-react";

type TipoOportunidade = "evento" | "ep" | "filme" | "festival" | "exposicao" | "teatro";

interface OportunidadeDetalhes {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  tipo: TipoOportunidade;
  local: string;
  dataInicio: string;
  dataFim: string;
  metaFinanciamento: number;
  arrecadado: number;
  apoiadores: number;
  diasRestantes: number;
  tags: string[];
  responsavel: {
    nome: string;
    bio: string;
    projetos: number;
  };
  profissionaisNecessarios: {
    cargo: string;
    quantidade: number;
    status: string;
  }[];
  retornoEsperado: string;
  impactoCultural: string;
  timeline: {
    fase: string;
    data: string;
    concluida: boolean;
  }[];
}

const oportunidadesData: Record<string, OportunidadeDetalhes> = {
  "1": {
    id: "1",
    titulo: "Festival de Jazz da Praça",
    subtitulo: "Uma celebração da música jazz ao ar livre com os melhores artistas locais e nacionais",
    descricao: "O Festival de Jazz da Praça é um evento que reúne os melhores artistas de jazz do Brasil em um ambiente ao ar livre. Durante 3 dias, o público poderá apreciar apresentações de músicos consagrados e novos talentos, em um espaço democrático e acessível a todos. O festival também contará com oficinas de música, exposições de arte e gastronomia local.",
    tipo: "festival",
    local: "São Paulo, SP",
    dataInicio: "2024-06-20",
    dataFim: "2024-06-23",
    metaFinanciamento: 80000,
    arrecadado: 52000,
    apoiadores: 128,
    diasRestantes: 45,
    tags: ["Jazz", "Música", "Festival", "Cultura", "Ao Ar Livre"],
    responsavel: {
      nome: "Maria Silva",
      bio: "Produtora cultural com 15 anos de experiência em eventos musicais",
      projetos: 23,
    },
    profissionaisNecessarios: [
      { cargo: "Técnico de Som", quantidade: 3, status: "2 confirmados" },
      { cargo: "Iluminador", quantidade: 2, status: "aberto" },
      { cargo: "Produtor de Palco", quantidade: 1, status: "confirmado" },
      { cargo: "Assistente de Produção", quantidade: 4, status: "2 confirmados" },
    ],
    retornoEsperado: "Alcançar 15.000 espectadores durante os 3 dias de evento, com cobertura em mídias especializadas e redes sociais",
    impactoCultural: "Democratizar o acesso à música de qualidade, fomentar a cena jazz local e criar oportunidades para artistas emergentes",
    timeline: [
      { fase: "Captação de Recursos", data: "Jan - Mar 2024", concluida: true },
      { fase: "Contratação de Artistas", data: "Abr 2024", concluida: true },
      { fase: "Produção e Logística", data: "Mai 2024", concluida: false },
      { fase: "Evento", data: "Jun 2024", concluida: false },
    ],
  },
  "2": {
    id: "2",
    titulo: "Documentário Vozes da Periferia",
    subtitulo: "Histórias reais de artistas independentes que transformam suas comunidades através da arte",
    descricao: "Vozes da Periferia é um documentário que retrata a vida e obra de artistas independentes que nasceram e cresceram nas periferias brasileiras. Através de entrevistas emocionantes e imagens impactantes, o filme mostra como a arte pode ser uma ferramenta de transformação social e empoderamento comunitário.",
    tipo: "filme",
    local: "Rio de Janeiro, RJ",
    dataInicio: "2024-04-30",
    dataFim: "2024-08-15",
    metaFinanciamento: 120000,
    arrecadado: 89000,
    apoiadores: 245,
    diasRestantes: 30,
    tags: ["Documentário", "Social", "Cultura", "Periferia", "Arte"],
    responsavel: {
      nome: "Ana Costa",
      bio: "Cineasta e documentarista premiada internacionalmente",
      projetos: 8,
    },
    profissionaisNecessarios: [
      { cargo: "Editor de Vídeo", quantidade: 1, status: "aberto" },
      { cargo: "Colorista", quantidade: 1, status: "aberto" },
      { cargo: "Designer de Som", quantidade: 1, status: "confirmado" },
    ],
    retornoEsperado: "Participação em festivais internacionais de cinema e distribuição em plataformas de streaming",
    impactoCultural: "Dar visibilidade a artistas periféricos e inspirar novas gerações a seguirem seus sonhos artísticos",
    timeline: [
      { fase: "Pré-produção", data: "Set - Nov 2023", concluida: true },
      { fase: "Filmagens", data: "Dez 2023 - Mar 2024", concluida: true },
      { fase: "Pós-produção", data: "Abr - Jul 2024", concluida: false },
      { fase: "Lançamento", data: "Ago 2024", concluida: false },
    ],
  },
  "3": {
    id: "3",
    titulo: "EP Raízes Urbanas",
    subtitulo: "Uma fusão única de hip-hop com elementos da cultura regional nordestina",
    descricao: "Raízes Urbanas é um EP que mistura batidas de hip-hop contemporâneo com instrumentos e ritmos tradicionais do Nordeste brasileiro. O projeto visa criar uma ponte entre a cultura urbana e as raízes regionais, apresentando uma sonoridade única e autêntica.",
    tipo: "ep",
    local: "Recife, PE",
    dataInicio: "2024-08-15",
    dataFim: "2024-10-30",
    metaFinanciamento: 35000,
    arrecadado: 28000,
    apoiadores: 89,
    diasRestantes: 60,
    tags: ["Hip-hop", "Música", "Regional", "Nordeste", "Urbano"],
    responsavel: {
      nome: "João Santos",
      bio: "Rapper e produtor musical com raízes no manguebeat",
      projetos: 5,
    },
    profissionaisNecessarios: [
      { cargo: "Engenheiro de Mixagem", quantidade: 1, status: "aberto" },
      { cargo: "Músicos de Apoio", quantidade: 3, status: "1 confirmado" },
    ],
    retornoEsperado: "Lançamento em todas as plataformas digitais e turnê de lançamento pelo Nordeste",
    impactoCultural: "Valorizar a cultura nordestina através de uma linguagem contemporânea e conectar diferentes gerações",
    timeline: [
      { fase: "Composição", data: "Fev - Abr 2024", concluida: true },
      { fase: "Gravação", data: "Ago - Set 2024", concluida: false },
      { fase: "Mixagem e Master", data: "Out 2024", concluida: false },
      { fase: "Lançamento", data: "Nov 2024", concluida: false },
    ],
  },
};

const tipoConfig: Record<TipoOportunidade, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-5 w-5" />, color: "bg-warning" },
  ep: { label: "EP/Álbum", icon: <Music className="h-5 w-5" />, color: "bg-pink-500" },
  filme: { label: "Filme/Doc", icon: <Film className="h-5 w-5" />, color: "bg-cyan-500" },
  festival: { label: "Festival", icon: <Users className="h-5 w-5" />, color: "bg-violet-500" },
  exposicao: { label: "Exposição", icon: <Palette className="h-5 w-5" />, color: "bg-emerald-500" },
  teatro: { label: "Teatro", icon: <Theater className="h-5 w-5" />, color: "bg-accent" },
};

// Fallback para oportunidades não encontradas
const createFallbackOportunidade = (id: string): OportunidadeDetalhes => ({
  id,
  titulo: "Oportunidade de Investimento",
  subtitulo: "Projeto cultural aguardando seu apoio",
  descricao: "Este é um projeto cultural que busca apoio de investidores e parceiros para se tornar realidade.",
  tipo: "evento",
  local: "Brasil",
  dataInicio: "2024-06-01",
  dataFim: "2024-12-31",
  metaFinanciamento: 50000,
  arrecadado: 15000,
  apoiadores: 45,
  diasRestantes: 90,
  tags: ["Cultura", "Arte"],
  responsavel: {
    nome: "Responsável do Projeto",
    bio: "Produtor cultural",
    projetos: 1,
  },
  profissionaisNecessarios: [],
  retornoEsperado: "Realização do projeto com sucesso",
  impactoCultural: "Contribuir para a cultura local",
  timeline: [],
});

const OportunidadePublica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [liked, setLiked] = useState(false);

  const oportunidade = oportunidadesData[id || ""] || createFallbackOportunidade(id || "0");
  const percentArrecadado = (oportunidade.arrecadado / oportunidade.metaFinanciamento) * 100;
  const config = tipoConfig[oportunidade.tipo];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate("/marketplace")}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Marketplace
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setLiked(!liked)}>
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-error" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Banner */}
        <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`p-6 rounded-full ${config.color} text-white`}>
              {config.icon}
            </div>
          </div>
          <Badge className={`absolute top-4 right-4 ${config.color} text-white border-0`}>
            {config.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título e Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {oportunidade.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold">{oportunidade.titulo}</h1>
              <p className="text-lg text-muted-foreground mt-2">{oportunidade.subtitulo}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {oportunidade.local}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {oportunidade.dataInicio} - {oportunidade.dataFim}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {oportunidade.diasRestantes} dias restantes
                </div>
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
                <p className="text-muted-foreground leading-relaxed">
                  {oportunidade.descricao}
                </p>
              </CardContent>
            </Card>

            {/* Retorno e Impacto */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-5 w-5 text-primary" />
                    Retorno Esperado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{oportunidade.retornoEsperado}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Impacto Cultural
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{oportunidade.impactoCultural}</p>
                </CardContent>
              </Card>
            </div>

            {/* Profissionais Necessários */}
            {oportunidade.profissionaisNecessarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Profissionais Necessários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {oportunidade.profissionaisNecessarios.map((prof, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{prof.cargo}</p>
                          <p className="text-sm text-muted-foreground">{prof.status}</p>
                        </div>
                        <Badge variant="outline">{prof.quantidade}x</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            {oportunidade.timeline.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cronograma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {oportunidade.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.concluida ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {item.concluida ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${item.concluida ? "" : "text-muted-foreground"}`}>
                            {item.fase}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.data}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Card de Financiamento */}
            <Card className="border-primary/30 sticky top-20">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-500">
                    R$ {oportunidade.arrecadado.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    arrecadado de R$ {oportunidade.metaFinanciamento.toLocaleString("pt-BR")}
                  </p>
                </div>

                <Progress value={percentArrecadado} className="h-3" />

                <div className="grid grid-cols-3 text-center">
                  <div>
                    <p className="text-lg font-bold">{percentArrecadado.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">financiado</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{oportunidade.apoiadores}</p>
                    <p className="text-xs text-muted-foreground">apoiadores</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{oportunidade.diasRestantes}</p>
                    <p className="text-xs text-muted-foreground">dias</p>
                  </div>
                </div>

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
                      {oportunidade.responsavel.nome.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{oportunidade.responsavel.nome}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 text-accent" />
                      {oportunidade.responsavel.projetos} projetos realizados
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {oportunidade.responsavel.bio}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog de Investimento */}
        <InvestmentProposalDialog
          open={showInvestDialog}
          onOpenChange={setShowInvestDialog}
          projeto={{
            id: oportunidade.id,
            titulo: oportunidade.titulo,
            metaFinanciamento: oportunidade.metaFinanciamento,
            arrecadado: oportunidade.arrecadado,
            criadorId: oportunidade.id, // Using oportunidade.id as fallback since this is mock data
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default OportunidadePublica;
