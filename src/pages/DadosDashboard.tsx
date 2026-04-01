import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { getKPIsProjetos } from "@/data/mockProjetos";
import { FiltroCidadeMultiSelect } from "@/components/censo/FiltroCidadeMultiSelect";
import { useMapFilter } from "@/contexts/MapFilterContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Map,
  FileCheck,
  Brain,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Thermometer,
  Filter,
  X,
  Info,
  Search,
  RotateCcw,
  UserCheck,
  CalendarDays,
  Building2,
  Palette,
} from "lucide-react";
import { MapaCenso } from "@/components/censo/MapaCenso";
import { ArtistaDrawer } from "@/components/censo/ArtistaDrawer";
import { AuditoriaPanel } from "@/components/censo/AuditoriaPanel";

import { PerfilEcossistema } from "@/components/censo/PerfilEcossistema";
import { InfraestruturaTab } from "@/components/infraestrutura/InfraestruturaTab";
import { ProjetosResultadosTab } from "@/components/projetos-dados/ProjetosResultadosTab";
import { CollapseSectionProvider } from "@/contexts/CollapseSectionContext";
import {
  buildAgentesCenso,
  
  linguagensArtisticas,
  coresLinguagem,
  type AgenteCenso,
} from "@/data/mockCensoAuxiliar";
import { municipiosPE } from "@/data/mockMunicipios";

export default function DadosDashboard() {
  const { filters, removeFilter, clearFilters } = useMapFilter();
  const [activeTab, setActiveTab] = useState("mapa");
  const [selectedArtista, setSelectedArtista] = useState<AgenteCenso | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const [modoCalor, setModoCalor] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("ultimo-ano");
  const [filtroLinguagem, setFiltroLinguagem] = useState<string>("todas");
  const [filtroCidades, setFiltroCidades] = useState<string[]>([]);

  // Filters
  const [filtroGenero, setFiltroGenero] = useState<string>("todos");
  const [filtroRaca, setFiltroRaca] = useState<string>("todas");

  // Search municipality state (lifted from MapaCenso)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const municipioSuggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return municipiosPE
      .filter((m) => m.nome.toLowerCase().includes(q))
      .slice(0, 8)
      .map((m) => m.nome);
  }, [searchQuery]);

  const handleSelectMunicipio = useCallback((nome: string) => {
    setSelectedMunicipio(nome);
    setSearchQuery(nome);
    setShowSuggestions(false);
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedMunicipio(null);
    setSearchQuery("");
  }, []);

  const agentesCenso = useMemo(() => buildAgentesCenso(), []);

  // Filtered projects for top KPIs
  const projetosKPIs = useMemo(() => getKPIsProjetos(filtroLinguagem, filtroCidades), [filtroLinguagem, filtroCidades]);

  const artistasFiltrados = useMemo(() => {
    return agentesCenso.filter((a) => {
      if (filtroLinguagem !== "todas" && a.linguagem !== filtroLinguagem) return false;
      if (filtroGenero !== "todos" && !a.genero.toLowerCase().includes(filtroGenero.toLowerCase())) return false;
      if (filtroRaca !== "todas" && !a.raca.toLowerCase().includes(filtroRaca.toLowerCase())) return false;
      if (filtroCidades.length > 0 && !filtroCidades.includes(a.municipio)) return false;
      return true;
    });
  }, [agentesCenso, filtroLinguagem, filtroGenero, filtroRaca, filtroCidades]);

  const handleArtistaClick = (artista: AgenteCenso) => {
    setSelectedArtista(artista);
    setDrawerOpen(true);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);

  return (
    <DashboardLayout>
      <CollapseSectionProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Observatório Cultural</h1>
            <p className="text-muted-foreground mt-1">
              Ecossistema cultural em tempo real — Pernambuco
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FiltroCidadeMultiSelect
              selectedCidades={filtroCidades}
              onSelectedCidadesChange={setFiltroCidades}
            />
            <Select value={filtroLinguagem} onValueChange={setFiltroLinguagem}>
              <SelectTrigger className="w-[170px] h-9">
                <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Linguagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas linguagens</SelectItem>
                {linguagensArtisticas.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
              <SelectTrigger className="w-[180px] h-9">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ultimo-mes">Último mês</SelectItem>
                <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                <SelectItem value="ultimo-semestre">Último semestre</SelectItem>
                <SelectItem value="ultimo-ano">Último ano</SelectItem>
                <SelectItem value="todos">Todo período</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total de Artistas</p>
                  <p className="text-2xl font-bold">{artistasFiltrados.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Projetos Ativos</p>
                  <p className="text-2xl font-bold">{projetosKPIs.projetosAtivos}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">R$ Investido</p>
                  <p className="text-2xl font-bold">{formatCurrency(projetosKPIs.totalRecursos)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Alcance Populacional</p>
                  <p className="text-2xl font-bold">{(projetosKPIs.totalPublico / 1000).toFixed(0)}k</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
            <TabsTrigger value="mapa" className="gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Mapa Cultural</span>
            </TabsTrigger>
            <TabsTrigger value="perfil" className="gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil do Ecossistema</span>
            </TabsTrigger>
            <TabsTrigger value="infraestrutura" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Espaços Culturais</span>
            </TabsTrigger>
            <TabsTrigger value="projetos" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Projetos e Resultados</span>
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Auditoria</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">IA Preditiva</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== FILTER TAGS (US-04) ===== */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((f) => (
                <Badge
                  key={f.id}
                  variant="secondary"
                  className="gap-1.5 pl-2 pr-1 py-1 text-xs font-medium"
                >
                  <span>{f.icon}</span>
                  {f.name}
                  <button
                    onClick={() => removeFilter(f.id)}
                    className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.length > 1 && (
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={clearFilters}>
                  Limpar todos
                </Button>
              )}
            </div>
          )}

          {/* ===== FILTER WARNING BANNER (US-04) ===== */}
          {filters.length > 0 && activeTab !== "mapa" && (
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Dados filtrados por: <strong className="text-foreground">{filters.map((f) => f.name).join(" · ")}</strong>.
                {" "}Os gráficos e tabelas refletem apenas o contexto selecionado.
              </span>
            </div>
          )}

          {/* ===== MAPA CULTURAL ===== */}
          <TabsContent value="mapa" className="space-y-4">
            {/* Filtros rápidos de artistas */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtros de artistas:</span>
                  </div>

                  <Select value={filtroGenero} onValueChange={setFiltroGenero}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos gêneros</SelectItem>
                      <SelectItem value="Mulher">Feminino</SelectItem>
                      <SelectItem value="Homem">Masculino</SelectItem>
                      <SelectItem value="Não-binário">Não-binário</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtroRaca} onValueChange={setFiltroRaca}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Raça" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas raças</SelectItem>
                      <SelectItem value="Preta">Preta</SelectItem>
                      <SelectItem value="Parda">Parda</SelectItem>
                      <SelectItem value="Branca">Branca</SelectItem>
                      <SelectItem value="Indígena">Indígena</SelectItem>
                      <SelectItem value="Amarela">Amarela</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 ml-auto">
                    <Switch
                      id="modo-calor"
                      checked={modoCalor}
                      onCheckedChange={setModoCalor}
                    />
                    <Label htmlFor="modo-calor" className="text-sm flex items-center gap-1 cursor-pointer">
                      <Thermometer className="h-4 w-4" /> Heatmap
                    </Label>
                  </div>

                  <span className="text-xs text-muted-foreground flex items-center">
                    {artistasFiltrados.length} artistas exibidos
                  </span>
                </div>

                {/* Search municipality (US-05) */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar município no mapa..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                        if (e.target.value === "") setSelectedMunicipio(null);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="pl-9 h-9"
                    />
                    {showSuggestions && municipioSuggestions.length > 0 && (
                      <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {municipioSuggestions.map((nome) => (
                          <button
                            key={nome}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={() => handleSelectMunicipio(nome)}
                          >
                            {nome}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedMunicipio && (
                    <Button variant="outline" size="sm" onClick={handleResetView} className="gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5" /> Ver PE completo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <MapaCenso
              artistas={artistasFiltrados}
              onArtistaClick={handleArtistaClick}
              modoCalor={modoCalor}
              searchQuery={searchQuery}
              selectedMunicipio={selectedMunicipio}
              onSearchQueryChange={setSearchQuery}
              onSelectMunicipio={handleSelectMunicipio}
              onResetView={handleResetView}
            />
          </TabsContent>

          {/* ===== PERFIL DO ECOSSISTEMA ===== */}
          <TabsContent value="perfil" className="space-y-4">
            <PerfilEcossistema
              filtroPeriodo={
                filtroPeriodo === "ultimo-mes" ? "Último mês" :
                filtroPeriodo === "ultimo-trimestre" ? "Último trimestre" :
                filtroPeriodo === "ultimo-semestre" ? "Último semestre" :
                filtroPeriodo === "ultimo-ano" ? "Último ano" : "Todo período"
              }
              filtroLinguagem={filtroLinguagem}
              filtroCidades={filtroCidades}
            />
          </TabsContent>

          {/* ===== INFRAESTRUTURA CULTURAL ===== */}
          <TabsContent value="infraestrutura" className="space-y-4">
            <InfraestruturaTab filtroPeriodo={
              filtroPeriodo === "ultimo-mes" ? "Último mês" :
              filtroPeriodo === "ultimo-trimestre" ? "Último trimestre" :
              filtroPeriodo === "ultimo-semestre" ? "Último semestre" :
              filtroPeriodo === "ultimo-ano" ? "Último ano" : "Todo período"
            } filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} />
          </TabsContent>

          {/* ===== PROJETOS E RESULTADOS ===== */}
          <TabsContent value="projetos" className="space-y-4">
            <ProjetosResultadosTab
              filtroPeriodo={
                filtroPeriodo === "ultimo-mes" ? "Último mês" :
                filtroPeriodo === "ultimo-trimestre" ? "Último trimestre" :
                filtroPeriodo === "ultimo-semestre" ? "Último semestre" :
                filtroPeriodo === "ultimo-ano" ? "Último ano" : "Todo período"
              }
              filtroLinguagem={filtroLinguagem}
              filtroCidades={filtroCidades}
            />
          </TabsContent>

          {/* ===== AUDITORIA ===== */}
          <TabsContent value="auditoria">
            <AuditoriaPanel filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} />
          </TabsContent>

          {/* ===== IA PREDITIVA ===== */}
          <TabsContent value="insights">
            <div className="text-center py-12 space-y-4">
              <Brain className="h-16 w-16 mx-auto text-primary/40" />
              <h3 className="text-xl font-semibold">IA Preditiva — Em Desenvolvimento</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Módulo de análise preditiva com detecção de desertos culturais, sugestão automática de editais e simulador de impacto.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </CollapseSectionProvider>

      {/* Drawer do artista */}
      <ArtistaDrawer
        artista={selectedArtista}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

    </DashboardLayout>
  );
}
