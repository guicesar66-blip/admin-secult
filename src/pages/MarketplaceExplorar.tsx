import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  BookOpen,
} from "lucide-react";
import { PROJETOS_VITRINE_MOCK, ProjetoVitrineMock } from "@/data/mockVitrine";
import { editaisMock, Edital } from "@/data/mockEditais";
import { vagasMock, Vaga } from "@/data/mockVagas";
import AffinityScore from "@/components/AffinityScore";

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento:    { label: "Evento",    icon: <Calendar className="h-4 w-4" />,      color: "bg-warning/20 text-warning border-orange-500/30" },
  vaga:      { label: "Vaga",      icon: <Briefcase className="h-4 w-4" />,     color: "bg-primary/20 text-primary border-primary/30" },
  oficina:   { label: "Oficina",   icon: <GraduationCap className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
  bairro:    { label: "Bairro",    icon: <Building className="h-4 w-4" />,      color: "bg-primary/20 text-pe-blue-dark border-purple-500/30" },
  ep:        { label: "EP/Álbum",  icon: <Music className="h-4 w-4" />,         color: "bg-pink-500/20 text-pink-600 border-pink-500/30" },
  filme:     { label: "Filme/Doc", icon: <Film className="h-4 w-4" />,          color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30" },
  festival:  { label: "Festival",  icon: <Users className="h-4 w-4" />,         color: "bg-violet-500/20 text-violet-600 border-violet-500/30" },
  exposicao: { label: "Exposição", icon: <Palette className="h-4 w-4" />,       color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
  teatro:    { label: "Teatro",    icon: <Theater className="h-4 w-4" />,       color: "bg-accent/20 text-accent-dark border-accent/30" },
};

const MarketplaceExplorar = () => {
  const navigate = useNavigate();
  const [abaSelecionada, setAbaSelecionada] = useState<"projetos" | "editais" | "vagas">("projetos");
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
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-warning text-white text-xs font-medium">
              <Flame className="h-3 w-3" />
              Em Alta
            </div>
          )}

          {/* Badge de tipo — canto inferior esquerdo */}
          <Badge
            variant="outline"
            className={`absolute bottom-3 left-3 ${config.color} bg-white/80 dark:bg-pe-dark/80 backdrop-blur-sm`}
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

          {projeto.incentivosLeis && projeto.incentivosLeis.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {projeto.incentivosLeis.slice(0, 2).map((lei) => (
                <Badge key={lei.id} variant="outline" className="text-[9px] px-1.5 py-0 bg-violet-50 text-violet-700 border-violet-200">
                  {lei.label}
                </Badge>
              ))}
              {projeto.incentivosLeis.length > 2 && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-neutral-100 text-muted-foreground border-border">
                  +{projeto.incentivosLeis.length - 2}
                </Badge>
              )}
            </div>
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

  // ════════════════════════════════════════════════════════════════════
  // SEÇÃO PROJETOS
  // ════════════════════════════════════════════════════════════════════

  const ProjetosSection = ({
    projetosVitrine,
    searchTerm,
    setSearchTerm,
    filtroTipo,
    setFiltroTipo,
    filtroLocal,
    setFiltroLocal,
    ordenacao,
    setOrdenacao,
    navigate,
  }: any) => {
    const emAlta = [...projetosVitrine]
      .sort((a) => (a.featured ? -1 : 1))
      .slice(0, 4);

    const totalPropostas = projetosVitrine.reduce((acc: number, p: ProjetoVitrineMock) => acc + p.totalPropostas, 0);

    const projetosFiltrados = projetosVitrine.filter((projeto: ProjetoVitrineMock) => {
      const matchSearch =
        projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projeto.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projeto.areaCultural?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = filtroTipo === "todos" || projeto.tipo === filtroTipo;
      const matchLocal = filtroLocal === "todos" || projeto.local?.includes(filtroLocal);
      return matchSearch && matchTipo && matchLocal;
    });

    const projetosOrdenados = [...projetosFiltrados].sort((a: ProjetoVitrineMock, b: ProjetoVitrineMock) => {
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

    const locaisUnicos = [...new Set(projetosVitrine.map((p: ProjetoVitrineMock) => p.local).filter(Boolean))];

    return (
      <>
        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{projetosVitrine.length} projetos</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">{totalPropostas} propostas</span>
          </div>
        </div>

        {/* Em Alta */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-warning/10">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Em Alta</h2>
              <p className="text-sm text-muted-foreground">Projetos com maior apoio popular</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emAlta.map((projeto: ProjetoVitrineMock) => (
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
                    {locaisUnicos.map((local: any) => (
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

        {/* Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Todos os Projetos ({projetosOrdenados.length})
          </h2>

          {projetosOrdenados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {projetosOrdenados.map((projeto: ProjetoVitrineMock) => (
                <ProjetoCard key={projeto.id} projeto={projeto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground">Nenhum projeto encontrado com os filtros selecionados.</p>
            </div>
          )}
        </section>
      </>
    );
  };

  // ════════════════════════════════════════════════════════════════════
  // SEÇÃO EDITAIS
  // ════════════════════════════════════════════════════════════════════

  const EditaisSection = ({ editais, searchTerm, setSearchTerm, navigate }: any) => {
    const editaisFiltrados = editais.filter((edital: Edital) => {
      const matchSearch =
        edital.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edital.linguagem.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });

    const linguagensUnices = [...new Set(editais.map((e: Edital) => e.linguagem))];

    return (
      <>
        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar editais por nome, organizador, linguagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Editais Abertos ({editaisFiltrados.length})
          </h2>

          {editaisFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {editaisFiltrados.map((edital: Edital) => (
                <Card
                  key={edital.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => navigate(`/editais/${edital.id}`)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Badge className="mb-2 bg-violet-600 hover:bg-violet-700">{edital.linguagem}</Badge>
                      <h3 className="font-semibold text-lg line-clamp-2">{edital.titulo}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{edital.organizador}</p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">{edital.descricao}</p>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Valor total</p>
                        <p className="font-semibold text-emerald-600">
                          R$ {(edital.valorTotal / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Selecionados</p>
                        <p className="font-semibold">{edital.projetosSelecionados} projetos</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Prazo</p>
                        <p className="font-semibold text-accent-dark">{edital.dataLimiteInscricao}</p>
                      </div>
                    </div>

                    <Button className="w-full bg-violet-600 hover:bg-violet-700" size="sm">
                      Inscrever →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum edital encontrado</h3>
              <p className="text-muted-foreground">Nenhum edital encontrado com os filtros selecionados.</p>
            </div>
          )}
        </section>
      </>
    );
  };

  // ════════════════════════════════════════════════════════════════════
  // SEÇÃO VAGAS
  // ════════════════════════════════════════════════════════════════════

  const VagasSection = ({ vagas, searchTerm, setSearchTerm, filtroTipo, setFiltroTipo, navigate }: any) => {
    const vagasFiltradas = vagas.filter((vaga: Vaga) => {
      const matchSearch =
        vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.organizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaga.linguagem.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = filtroTipo === "todos" || vaga.tipo === filtroTipo;
      return matchSearch && matchTipo;
    });

    return (
      <>
        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vagas por cargo, organização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Oportunidades de Emprego ({vagasFiltradas.length})
          </h2>

          {vagasFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vagasFiltradas.map((vaga: Vaga) => {
                const tipoColor = {
                  presencial: "bg-primary/10 text-primary",
                  remoto: "bg-primary/10 text-pe-blue-dark",
                  hibrido: "bg-emerald-500/10 text-emerald-600",
                };

                return (
                  <Card
                    key={vaga.id}
                    className={`cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 ${
                      vaga.featured ? "border-violet-300 border-2" : ""
                    }`}
                    onClick={() => navigate(`/vaga/${vaga.id}`)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {vaga.featured && <Flame className="h-4 w-4 text-warning" />}
                            <Badge variant="outline" className={tipoColor[vaga.tipo as keyof typeof tipoColor]}>
                              {vaga.tipo}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg line-clamp-2">{vaga.titulo}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{vaga.organizacao}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{vaga.descricao}</p>

                      <div className="space-y-2 pt-2 border-t">
                        {vaga.local && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{vaga.local}</span>
                          </div>
                        )}
                        {vaga.salario && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-3 w-3 text-emerald-600" />
                            <span className="font-semibold">
                              R$ {vaga.salario.minimo.toLocaleString("pt-BR")} - R${" "}
                              {vaga.salario.maximo.toLocaleString("pt-BR")}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Até {vaga.dataLimite}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge variant="secondary">{vaga.linguagem}</Badge>
                        <span className="text-xs text-muted-foreground">{vaga.candidatos || 0} candidatos</span>
                      </div>

                      <Button className="w-full bg-primary hover:bg-blue-700" size="sm">
                        Candidatar →
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-muted-foreground">Nenhuma vaga encontrada com os filtros selecionados.</p>
            </div>
          )}
        </section>
      </>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vitrine de Oportunidades</h1>
            <p className="text-muted-foreground mt-1">
              Descubra projetos, editais de fomento e vagas de emprego
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={abaSelecionada === "projetos" ? "default" : "ghost"}
            onClick={() => setAbaSelecionada("projetos")}
            className="justify-start gap-2"
          >
            <Target className="h-4 w-4" />
            Projetos ({projetosVitrine.length})
          </Button>
          <Button
            variant={abaSelecionada === "editais" ? "default" : "ghost"}
            onClick={() => setAbaSelecionada("editais")}
            className="justify-start gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Editais ({editaisMock.length})
          </Button>
          <Button
            variant={abaSelecionada === "vagas" ? "default" : "ghost"}
            onClick={() => setAbaSelecionada("vagas")}
            className="justify-start gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Vagas ({vagasMock.length})
          </Button>
        </div>

        {/* CONTEÚDO - PROJETOS */}
        {abaSelecionada === "projetos" && (
          <ProjetosSection
            projetosVitrine={projetosVitrine}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            filtroLocal={filtroLocal}
            setFiltroLocal={setFiltroLocal}
            ordenacao={ordenacao}
            setOrdenacao={setOrdenacao}
            navigate={navigate}
          />
        )}

        {/* CONTEÚDO - EDITAIS */}
        {abaSelecionada === "editais" && (
          <EditaisSection
            editais={editaisMock}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            navigate={navigate}
          />
        )}

        {/* CONTEÚDO - VAGAS */}
        {abaSelecionada === "vagas" && (
          <VagasSection
            vagas={vagasMock}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            navigate={navigate}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketplaceExplorar;
