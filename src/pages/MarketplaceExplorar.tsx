import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  Music,
  Film,
  Palette,
  Theater,
  Flame,
  Heart,
  DollarSign,
  Filter,
  ArrowRight,
} from "lucide-react";

type TipoOportunidade = "evento" | "ep" | "filme" | "festival" | "exposicao" | "teatro";
type CategoriaFiltro = "todos" | "cultura" | "musica" | "audiovisual" | "artes";

interface Oportunidade {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: TipoOportunidade;
  local: string;
  dataInicio: string;
  metaFinanciamento: number;
  arrecadado: number;
  apoiadores: number;
  imagemCapa?: string;
  emAlta?: boolean;
  tags: string[];
  responsavel: string;
}

const oportunidadesData: Oportunidade[] = [
  {
    id: "1",
    titulo: "Festival de Jazz da Praça",
    subtitulo: "Celebração musical ao ar livre com artistas locais",
    tipo: "festival",
    local: "São Paulo, SP",
    dataInicio: "2024-06-20",
    metaFinanciamento: 80000,
    arrecadado: 52000,
    apoiadores: 128,
    emAlta: true,
    tags: ["Jazz", "Música", "Festival"],
    responsavel: "Maria Silva",
  },
  {
    id: "2",
    titulo: "Documentário Vozes da Periferia",
    subtitulo: "Histórias de artistas independentes das comunidades",
    tipo: "filme",
    local: "Rio de Janeiro, RJ",
    dataInicio: "2024-04-30",
    metaFinanciamento: 120000,
    arrecadado: 89000,
    apoiadores: 245,
    emAlta: true,
    tags: ["Documentário", "Social", "Cultura"],
    responsavel: "Ana Costa",
  },
  {
    id: "3",
    titulo: "EP Raízes Urbanas",
    subtitulo: "Hip-hop com elementos da cultura regional",
    tipo: "ep",
    local: "Recife, PE",
    dataInicio: "2024-08-15",
    metaFinanciamento: 35000,
    arrecadado: 28000,
    apoiadores: 89,
    emAlta: true,
    tags: ["Hip-hop", "Música", "Regional"],
    responsavel: "João Santos",
  },
  {
    id: "4",
    titulo: "Exposição Arte Digital",
    subtitulo: "Mostra interativa de arte contemporânea digital",
    tipo: "exposicao",
    local: "Belo Horizonte, MG",
    dataInicio: "2024-05-10",
    metaFinanciamento: 45000,
    arrecadado: 15000,
    apoiadores: 42,
    tags: ["Arte Digital", "Exposição", "Tecnologia"],
    responsavel: "Pedro Lima",
  },
  {
    id: "5",
    titulo: "Peça Teatral Memórias",
    subtitulo: "Drama contemporâneo sobre histórias familiares",
    tipo: "teatro",
    local: "Porto Alegre, RS",
    dataInicio: "2024-07-10",
    metaFinanciamento: 60000,
    arrecadado: 22000,
    apoiadores: 67,
    tags: ["Teatro", "Drama", "Familiar"],
    responsavel: "Carla Mendes",
  },
  {
    id: "6",
    titulo: "Show Acústico Coletivo",
    subtitulo: "Encontro de artistas independentes em show único",
    tipo: "evento",
    local: "Curitiba, PR",
    dataInicio: "2024-05-15",
    metaFinanciamento: 25000,
    arrecadado: 8000,
    apoiadores: 34,
    tags: ["Acústico", "Música", "Coletivo"],
    responsavel: "Lucas Alves",
  },
  {
    id: "7",
    titulo: "Festival de Cinema LGBTQ+",
    subtitulo: "Celebração da diversidade através da sétima arte",
    tipo: "festival",
    local: "Salvador, BA",
    dataInicio: "2024-09-01",
    metaFinanciamento: 95000,
    arrecadado: 71000,
    apoiadores: 312,
    emAlta: true,
    tags: ["Cinema", "Diversidade", "Festival"],
    responsavel: "Rafael Souza",
  },
  {
    id: "8",
    titulo: "Álbum Sonhos do Sertão",
    subtitulo: "Fusão de MPB com ritmos nordestinos",
    tipo: "ep",
    local: "Fortaleza, CE",
    dataInicio: "2024-10-20",
    metaFinanciamento: 40000,
    arrecadado: 12000,
    apoiadores: 56,
    tags: ["MPB", "Nordeste", "Música"],
    responsavel: "Fernanda Oliveira",
  },
];

const tipoConfig: Record<TipoOportunidade, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-4 w-4" />, color: "bg-orange-500/20 text-orange-600 border-orange-500/30" },
  ep: { label: "EP/Álbum", icon: <Music className="h-4 w-4" />, color: "bg-pink-500/20 text-pink-600 border-pink-500/30" },
  filme: { label: "Filme/Doc", icon: <Film className="h-4 w-4" />, color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30" },
  festival: { label: "Festival", icon: <Users className="h-4 w-4" />, color: "bg-violet-500/20 text-violet-600 border-violet-500/30" },
  exposicao: { label: "Exposição", icon: <Palette className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
  teatro: { label: "Teatro", icon: <Theater className="h-4 w-4" />, color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
};

const MarketplaceExplorar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaFiltro>("todos");
  const [filtroLocal, setFiltroLocal] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<string>("popularidade");

  const oportunidadesEmAlta = oportunidadesData.filter((o) => o.emAlta);

  const oportunidadesFiltradas = oportunidadesData.filter((oportunidade) => {
    const matchSearch = 
      oportunidade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oportunidade.subtitulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      oportunidade.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchTipo = filtroTipo === "todos" || oportunidade.tipo === filtroTipo;
    const matchLocal = filtroLocal === "todos" || oportunidade.local.includes(filtroLocal);
    return matchSearch && matchTipo && matchLocal;
  });

  const oportunidadesOrdenadas = [...oportunidadesFiltradas].sort((a, b) => {
    switch (ordenacao) {
      case "popularidade":
        return b.apoiadores - a.apoiadores;
      case "arrecadacao":
        return (b.arrecadado / b.metaFinanciamento) - (a.arrecadado / a.metaFinanciamento);
      case "recentes":
        return new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime();
      default:
        return 0;
    }
  });

  const OportunidadeCard = ({ oportunidade, featured = false }: { oportunidade: Oportunidade; featured?: boolean }) => {
    const percentArrecadado = (oportunidade.arrecadado / oportunidade.metaFinanciamento) * 100;

    return (
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden ${
          featured ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : ""
        }`}
        onClick={() => navigate(`/marketplace/${oportunidade.id}`)}
      >
        {/* Imagem de capa */}
        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`p-4 rounded-full ${tipoConfig[oportunidade.tipo].color}`}>
              {tipoConfig[oportunidade.tipo].icon}
            </div>
          </div>
          {oportunidade.emAlta && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-medium">
              <Flame className="h-3 w-3" />
              Em Alta
            </div>
          )}
          <Badge 
            variant="outline" 
            className={`absolute top-3 right-3 ${tipoConfig[oportunidade.tipo].color}`}
          >
            {tipoConfig[oportunidade.tipo].label}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {oportunidade.titulo}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {oportunidade.subtitulo}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {oportunidade.local}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {oportunidade.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Progresso de financiamento */}
          <div className="pt-2 border-t space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-emerald-500">
                R$ {oportunidade.arrecadado.toLocaleString("pt-BR")}
              </span>
              <span className="text-xs text-muted-foreground">
                {percentArrecadado.toFixed(0)}%
              </span>
            </div>
            <Progress value={percentArrecadado} className="h-1.5" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Meta: R$ {oportunidade.metaFinanciamento.toLocaleString("pt-BR")}</span>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {oportunidade.apoiadores}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explorar Oportunidades</h1>
          <p className="text-muted-foreground mt-1">
            Descubra projetos culturais para investir e apoiar
          </p>
        </div>

        {/* Seção Em Alta */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Em Alta</h2>
                <p className="text-sm text-muted-foreground">Projetos com maior apoio popular</p>
              </div>
            </div>
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {oportunidadesEmAlta.slice(0, 4).map((oportunidade) => (
              <OportunidadeCard key={oportunidade.id} oportunidade={oportunidade} featured />
            ))}
          </div>
        </section>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, categoria ou tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="ep">EP/Álbum</SelectItem>
                    <SelectItem value="filme">Filme/Doc</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="exposicao">Exposição</SelectItem>
                    <SelectItem value="teatro">Teatro</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroLocal} onValueChange={setFiltroLocal}>
                  <SelectTrigger className="w-[160px]">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os locais</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                    <SelectItem value="Recife">Recife</SelectItem>
                    <SelectItem value="Salvador">Salvador</SelectItem>
                    <SelectItem value="Curitiba">Curitiba</SelectItem>
                    <SelectItem value="Porto Alegre">Porto Alegre</SelectItem>
                    <SelectItem value="Fortaleza">Fortaleza</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularidade">Mais populares</SelectItem>
                    <SelectItem value="arrecadacao">Maior arrecadação</SelectItem>
                    <SelectItem value="recentes">Mais recentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Oportunidades */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Todas as Oportunidades ({oportunidadesOrdenadas.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {oportunidadesOrdenadas.map((oportunidade) => (
              <OportunidadeCard key={oportunidade.id} oportunidade={oportunidade} />
            ))}
          </div>

          {oportunidadesOrdenadas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma oportunidade encontrada com os filtros selecionados.</p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default MarketplaceExplorar;
