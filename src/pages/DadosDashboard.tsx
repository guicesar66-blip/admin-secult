import { useState, useMemo } from "react";
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
  Sparkles,
  UserCheck,
  CalendarDays,
  Building2,
  Palette,
} from "lucide-react";
import { MapaCenso } from "@/components/censo/MapaCenso";
import { ArtistaDrawer } from "@/components/censo/ArtistaDrawer";
import { AuditoriaPanel } from "@/components/censo/AuditoriaPanel";
import { InsightsIAModal } from "@/components/censo/InsightsIAModal";
import { PerfilEcossistema } from "@/components/censo/PerfilEcossistema";
import { InfraestruturaTab } from "@/components/infraestrutura/InfraestruturaTab";
import { CollapseSectionProvider } from "@/contexts/CollapseSectionContext";
import {
  artistasMock,
  categoriasArtisticas,
  coresCategoria,
  estatisticasGerais,
  type Artista,
} from "@/data/mockCensoCultural";

export default function DadosDashboard() {
  const [activeTab, setActiveTab] = useState("mapa");
  const [selectedArtista, setSelectedArtista] = useState<Artista | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [modoCalor, setModoCalor] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("ultimo-ano");
  const [filtroLinguagem, setFiltroLinguagem] = useState<string>("todas");

  // Filters
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [filtroGenero, setFiltroGenero] = useState<string>("todos");
  const [filtroRaca, setFiltroRaca] = useState<string>("todas");
  const [filtroFiscal, setFiltroFiscal] = useState<string>("todos");

  const artistasFiltrados = useMemo(() => {
    return artistasMock.filter((a) => {
      if (filtroCategoria !== "todas" && a.categoria !== filtroCategoria) return false;
      if (filtroGenero !== "todos" && a.genero !== filtroGenero) return false;
      if (filtroRaca !== "todas" && a.raca !== filtroRaca) return false;
      if (filtroFiscal !== "todos" && a.statusFiscal !== filtroFiscal) return false;
      return true;
    });
  }, [filtroCategoria, filtroGenero, filtroRaca, filtroFiscal]);

  const handleArtistaClick = (artista: Artista) => {
    setSelectedArtista(artista);
    setDrawerOpen(true);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Central de Inteligência Territorial</h1>
            <p className="text-muted-foreground mt-1">
              Ecossistema cultural em tempo real — Recife, PE
            </p>
          </div>
          <div className="flex items-center gap-3">
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
            <Button
              onClick={() => setInsightsOpen(true)}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              AI Insights
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Artistas</p>
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
                  <p className="text-2xl font-bold">{estatisticasGerais.projetosAtivos}</p>
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
                  <p className="text-2xl font-bold">{formatCurrency(estatisticasGerais.totalInvestido)}</p>
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
                  <p className="text-2xl font-bold">{(estatisticasGerais.alcancePopulacional / 1000).toFixed(0)}k</p>
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="mapa" className="gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Censo Cultural</span>
            </TabsTrigger>
            <TabsTrigger value="perfil" className="gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil do Ecossistema</span>
            </TabsTrigger>
            <TabsTrigger value="infraestrutura" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Infraestrutura Cultural</span>
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

          {/* ===== MAPA / CENSO ===== */}
          <TabsContent value="mapa" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtros:</span>
                  </div>

                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue placeholder="Linguagem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas linguagens</SelectItem>
                      {categoriasArtisticas.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtroGenero} onValueChange={setFiltroGenero}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos gêneros</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
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

                  <Select value={filtroFiscal} onValueChange={setFiltroFiscal}>
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue placeholder="Status Fiscal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos status</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Irregular">Irregular</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                      <SelectItem value="Isento">Isento</SelectItem>
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
                </div>

                {/* Legend */}
                {!modoCalor && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                    {categoriasArtisticas.map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="text-xs cursor-pointer transition-opacity"
                        style={{
                          backgroundColor: coresCategoria[cat] + "18",
                          color: coresCategoria[cat],
                          borderColor: coresCategoria[cat] + "44",
                          opacity: filtroCategoria === "todas" || filtroCategoria === cat ? 1 : 0.4,
                        }}
                        onClick={() => setFiltroCategoria(filtroCategoria === cat ? "todas" : cat)}
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full mr-1"
                          style={{ backgroundColor: coresCategoria[cat] }}
                        />
                        {cat}
                      </Badge>
                    ))}
                    <span className="text-xs text-muted-foreground ml-2 flex items-center">
                      {artistasFiltrados.length} artistas exibidos
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Map */}
            <div className="h-[520px]">
              <MapaCenso
                artistas={artistasFiltrados}
                onArtistaClick={handleArtistaClick}
                modoCalor={modoCalor}
              />
            </div>
          </TabsContent>

          {/* ===== PERFIL DO ECOSSISTEMA ===== */}
          <TabsContent value="perfil" className="space-y-4">
            <PerfilEcossistema filtroPeriodo={
              filtroPeriodo === "ultimo-mes" ? "Último mês" :
              filtroPeriodo === "ultimo-trimestre" ? "Último trimestre" :
              filtroPeriodo === "ultimo-semestre" ? "Último semestre" :
              filtroPeriodo === "ultimo-ano" ? "Último ano" : "Todo período"
            } />
          </TabsContent>

          {/* ===== INFRAESTRUTURA CULTURAL ===== */}
          <TabsContent value="infraestrutura" className="space-y-4">
            <InfraestruturaTab filtroPeriodo={
              filtroPeriodo === "ultimo-mes" ? "Último mês" :
              filtroPeriodo === "ultimo-trimestre" ? "Último trimestre" :
              filtroPeriodo === "ultimo-semestre" ? "Último semestre" :
              filtroPeriodo === "ultimo-ano" ? "Último ano" : "Todo período"
            } />
          </TabsContent>

          {/* ===== AUDITORIA ===== */}
          <TabsContent value="auditoria">
            <AuditoriaPanel />
          </TabsContent>

          {/* ===== IA PREDITIVA ===== */}
          <TabsContent value="insights">
            <div className="text-center py-12 space-y-4">
              <Brain className="h-16 w-16 mx-auto text-primary/40" />
              <h3 className="text-xl font-semibold">IA Preditiva — Em Desenvolvimento</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Módulo de análise preditiva com detecção de desertos culturais, sugestão automática de editais e simulador de impacto.
              </p>
              <Button onClick={() => setInsightsOpen(true)} className="gap-2">
                <Sparkles className="h-4 w-4" /> Ver Insights Disponíveis
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Drawer do artista */}
      <ArtistaDrawer
        artista={selectedArtista}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Modal AI Insights */}
      <InsightsIAModal
        open={insightsOpen}
        onOpenChange={setInsightsOpen}
      />
    </DashboardLayout>
  );
}
