import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Briefcase,
  GraduationCap,
  Building,
  Target,
} from "lucide-react";
import { PROJETOS_VITRINE_MOCK, ProjetoVitrineMock } from "@/data/mockVitrine";
import AffinityScore from "@/components/AffinityScore";

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento:    { label: "Evento",    icon: <Calendar className="h-4 w-4" />,      color: "bg-orange-500/20 text-orange-600 border-orange-500/30" },
  vaga:      { label: "Vaga",      icon: <Briefcase className="h-4 w-4" />,     color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  oficina:   { label: "Oficina",   icon: <GraduationCap className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
  bairro:    { label: "Bairro",    icon: <Building className="h-4 w-4" />,      color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
  ep:        { label: "EP/Álbum",  icon: <Music className="h-4 w-4" />,         color: "bg-pink-500/20 text-pink-600 border-pink-500/30" },
  filme:     { label: "Filme/Doc", icon: <Film className="h-4 w-4" />,          color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30" },
  festival:  { label: "Festival",  icon: <Users className="h-4 w-4" />,         color: "bg-violet-500/20 text-violet-600 border-violet-500/30" },
  exposicao: { label: "Exposição", icon: <Palette className="h-4 w-4" />,       color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
  teatro:    { label: "Teatro",    icon: <Theater className="h-4 w-4" />,       color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
};

const MarketplaceExplorar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroLocal, setFiltroLocal] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<string>("recentes");

  const projetosVitrine = PROJETOS_VITRINE_MOCK;

  const emAlta = [...projetosVitrine]
    .sort((a, b) => b.totalPropostas - a.totalPropostas)
    .slice(0, 4);

  const totalProjetos = projetosVitrine.length;
  const totalPropostas = projetosVitrine.reduce((acc, p) => acc + p.totalPropostas, 0);

  const projetosFiltrados = projetosVitrine.filter((projeto) => {
    const matchSearch =
      projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.areaCultural?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === "todos" || projeto.tipo === filtroTipo;
    const matchLocal = filtroLocal === "todos" || projeto.local?.includes(filtroLocal);
    return matchSearch && matchTipo && matchLocal;
  });

  const projetosOrdenados = [...projetosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case "popularidade":
        return b.totalPropostas - a.totalPropostas;
      case "captacao": {
        const percA = a.metaCaptacao > 0 ? a.captacaoAtual / a.metaCaptacao : 0;
        const percB = b.metaCaptacao > 0 ? b.captacaoAtual / b.metaCaptacao : 0;
        return percB - percA;
      }
      default:
        return 0;
    }
  });

  const locaisUnicos = [...new Set(projetosVitrine.map((p) => p.local).filter(Boolean))];

  const ProjetoCard = ({
    projeto,
    featured = false,
  }: {
    projeto: ProjetoVitrineMock;
    featured?: boolean;
  }) => {
    const percentCaptado =
      projeto.metaCaptacao > 0
        ? (projeto.captacaoAtual / projeto.metaCaptacao) * 100
        : 0;
    const config = tipoConfig[projeto.tipo] || tipoConfig.evento;

    return (
      <Card
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative ${
          featured ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : ""
        }`}
        onClick={() =>
          navigate(`/vitrine/${projeto.id}?tipo=${projeto.isOficina ? "oficina" : "oportunidade"}`)
        }
      >
        {/* Imagem de capa */}
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            src={projeto.imagem}
            alt={projeto.titulo}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Gradiente suave no topo para legibilidade do score */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

          {featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-medium">
              <Flame className="h-3 w-3" />
              Em Alta
            </div>
          )}

          {/* Badge de tipo — canto inferior esquerdo */}
          <Badge
            variant="outline"
            className={`absolute bottom-3 left-3 ${config.color} bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm`}
          >
            {config.label}
          </Badge>
        </div>

        {/* AffinityScore — canto superior direito do card, sobrepõe imagem/conteúdo */}
        <div className="absolute top-2 right-2 z-10">
          <AffinityScore score={projeto.affinityScore} size={56} />
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors pr-10">
              {projeto.titulo}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {projeto.descricao || "Projeto cultural disponível para investimento"}
            </p>
          </div>

          {projeto.local && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {projeto.local}
            </div>
          )}

          {projeto.areaCultural && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {projeto.areaCultural}
            </Badge>
          )}

          {projeto.mostrarProgresso && projeto.metaCaptacao > 0 && (
            <div className="pt-2 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-emerald-500">
                  R$ {projeto.captacaoAtual.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {percentCaptado.toFixed(0)}%
                </span>
              </div>
              <Progress value={Math.min(percentCaptado, 100)} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Meta: R$ {projeto.metaCaptacao.toLocaleString("pt-BR")}</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {projeto.totalPropostas}
                </div>
              </div>
            </div>
          )}

          {(!projeto.mostrarProgresso || projeto.metaCaptacao === 0) && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>por {projeto.criadorNome}</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {projeto.totalPropostas} propostas
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vitrine de Investimentos</h1>
            <p className="text-muted-foreground mt-1">
              Descubra projetos culturais para investir, apoiar com serviços ou patrocinar
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{totalProjetos} projetos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium">{totalPropostas} propostas</span>
            </div>
          </div>
        </div>

        {/* Seção Em Alta */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Em Alta</h2>
              <p className="text-sm text-muted-foreground">Projetos com maior apoio popular</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emAlta.map((projeto) => (
              <ProjetoCard key={projeto.id} projeto={projeto} featured />
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
                  placeholder="Buscar por nome, área cultural..."
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
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="filme">Filme/Doc</SelectItem>
                    <SelectItem value="exposicao">Exposição</SelectItem>
                    <SelectItem value="teatro">Teatro</SelectItem>
                    <SelectItem value="ep">EP/Álbum</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroLocal} onValueChange={setFiltroLocal}>
                  <SelectTrigger className="w-[160px]">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os locais</SelectItem>
                    {locaisUnicos.map((local) => (
                      <SelectItem key={local} value={local!}>
                        {local}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recentes">Mais recentes</SelectItem>
                    <SelectItem value="popularidade">Mais populares</SelectItem>
                    <SelectItem value="captacao">Maior captação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Projetos */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Todos os Projetos ({projetosOrdenados.length})
          </h2>

          {projetosOrdenados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projetosOrdenados.map((projeto) => (
                <ProjetoCard key={projeto.id} projeto={projeto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Nenhum projeto encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default MarketplaceExplorar;
