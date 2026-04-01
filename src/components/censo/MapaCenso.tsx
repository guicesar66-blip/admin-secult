import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer, TileLayer, CircleMarker, Popup, Marker, Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Building2, Users, FolderKanban, AlertTriangle,
  ChevronDown, ChevronRight, Layers, Map as MapIcon,
  Satellite, Filter,
} from "lucide-react";
import type { AgenteCenso } from "@/data/mockCensoAuxiliar";
import { equipamentosMock, iconesTipoEquipamento } from "@/data/mockEquipamentosCulturais";
import {
  projetosMapaMock, desertosCulturaisMock,
  statusProjetoCores, statusProjetoLabels,
  prioridadeDesertoCores,
  type ProjetoMapa, type DesertoCultural,
} from "@/data/mockMapaEntidades";
import { useMapFilter, type FilterEntityType } from "@/contexts/MapFilterContext";

// ===== Cores das camadas conforme spec =====
const CORES_CAMADA = {
  produtores: "#3155A4",
  projetos: "#00AD4A",
  espacos: "#FFB511",
  desertos: "#C34342",
};

// ===== Tile URLs =====
const TILE_STREET = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_SATELLITE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

// ===== Icons per entity type =====
const ENTITY_ICONS: Record<FilterEntityType, string> = {
  produtor: "🎭",
  projeto: "📋",
  espaco: "🏛",
  deserto: "📍",
};

interface MapaCensoProps {
  artistas: AgenteCenso[];
  onArtistaClick: (artista: AgenteCenso) => void;
  modoCalor: boolean;
  searchQuery: string;
  selectedMunicipio: string | null;
  onSearchQueryChange: (q: string) => void;
  onSelectMunicipio: (nome: string) => void;
  onResetView: () => void;
  filtroLinguagem?: string;
  filtroCidades?: string[];
}

// ===== Emoji icon helper =====
function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<span style="font-size:22px;line-height:1;display:block;text-align:center">${emoji}</span>`,
    className: "emoji-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

// ===== Pane setup (US-07) =====
function PaneSetup() {
  const map = useMap();
  useEffect(() => {
    const panes = [
      { name: "desertoPane", z: "350" },
      { name: "municipioPane", z: "400" },
      { name: "espacoPane", z: "450" },
      { name: "projetoPane", z: "500" },
      { name: "produtorPane", z: "550" },
    ];
    panes.forEach(({ name, z }) => {
      if (!map.getPane(name)) {
        const p = map.createPane(name);
        p.style.zIndex = z;
      }
    });
  }, [map]);
  return null;
}

// ===== Heatmap =====
function HeatmapLayer({ artistas }: { artistas: AgenteCenso[] }) {
  const map = useMap();
  useEffect(() => {
    if (artistas.length === 0) return;
    const heat = (L as any).heatLayer(
      artistas.map((a) => [a.location.lat, a.location.lng, 0.5]),
      { radius: 30, blur: 20, maxZoom: 17, gradient: { 0.2: "#ffffb2", 0.4: "#fd8d3c", 0.6: "#f03b20", 0.8: "#bd0026", 1.0: "#800026" } }
    );
    heat.addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, artistas]);
  return null;
}

// ===== Tile switcher =====
function TileSwitcher({ isSatellite }: { isSatellite: boolean }) {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }
    const url = isSatellite ? TILE_SATELLITE : TILE_STREET;
    const attribution = isSatellite
      ? '&copy; Esri'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    layerRef.current = L.tileLayer(url, { attribution }).addTo(map);
    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current);
    };
  }, [map, isSatellite]);

  return null;
}

// ===== Municipality search zoom =====
function ZoomToMunicipio({ municipio, onReset }: { municipio: string | null; onReset: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (!municipio) {
      map.flyTo([-8.3, -36.5], 7, { duration: 1.2 });
      return;
    }
    const known: Record<string, [number, number]> = {
      "Recife": [-8.0576, -34.8770],
      "Olinda": [-8.0117, -34.8515],
      "Caruaru": [-8.2844, -35.9761],
      "Petrolina": [-9.3891, -40.5028],
      "Garanhuns": [-8.8900, -36.4966],
      "Serra Talhada": [-7.9861, -38.2921],
      "Arcoverde": [-8.4190, -37.0540],
      "Jaboatão dos Guararapes": [-8.1130, -35.0156],
      "Gravatá": [-8.2005, -35.5649],
      "Cabo de Santo Agostinho": [-8.2844, -35.0290],
      "Camaragibe": [-8.0235, -34.9790],
      "Paulista": [-7.9395, -34.8728],
      "Igarassu": [-7.8343, -34.9069],
      "Vitória de Santo Antão": [-8.1266, -35.2914],
      "Carpina": [-7.8456, -35.2555],
      "Limoeiro": [-7.8740, -35.4510],
      "Salgueiro": [-8.0744, -39.1190],
      "Inajá": [-8.9022, -37.8310],
      "Itacuruba": [-8.7490, -38.6960],
      "Manari": [-8.9610, -37.6340],
      "Betânia": [-8.2736, -38.0363],
      "Calumbi": [-7.9373, -38.1466],
    };
    const coords = known[municipio];
    if (coords) {
      map.flyTo(coords, 13, { duration: 1.2 });
    }
  }, [municipio, map]);

  return null;
}

// ===== Contadores =====
function contarEntidadesVisiveis(
  camadas: CamadasState,
  artistas: AgenteCenso[],
) {
  let total = 0;
  if (camadas.produtores) total += artistas.length;
  if (camadas.projetos) total += projetosMapaMock.length;
  if (camadas.espacos) total += equipamentosMock.length;
  if (camadas.desertos) total += desertosCulturaisMock.length;
  return total;
}

// ===== Types =====
interface CamadasState {
  produtores: boolean;
  projetos: boolean;
  espacos: boolean;
  desertos: boolean;
}

// ===== Popup content components (US-03) =====
function PopupProdutor({ artista, onApplyFilter }: { artista: AgenteCenso; onApplyFilter: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="text-sm space-y-2 min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-2">
        <span className="text-base">🎭</span>
        <span className="font-semibold text-sm">{artista.nomeArtistico || artista.nome}</span>
        <Badge variant="outline" className="text-[10px] ml-auto" style={{ borderColor: CORES_CAMADA.produtores, color: CORES_CAMADA.produtores }}>
          Coletivo
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>🎨 {artista.linguagem}</p>
        <p>📍 {artista.municipio}</p>
        <p>📂 Produtora: <strong className="text-foreground">{artista.produtoraNome}</strong></p>
        <div className="flex items-center gap-2">
          <span>Score:</span>
          <Progress value={artista.scoreReputacao} className="h-1.5 flex-1" />
          <span className="font-medium text-foreground">{artista.scoreReputacao}/100</span>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Button size="sm" className="text-xs h-7 gap-1 flex-1" onClick={onApplyFilter}>
          <Filter className="h-3 w-3" /> Aplicar filtro global
        </Button>
        <Button size="sm" variant="link" className="text-xs h-7 p-0" onClick={() => navigate(`/dados/produtora/${artista.produtoraId}`)}>
          Ver detalhe →
        </Button>
      </div>
    </div>
  );
}

function PopupProjeto({ proj, onApplyFilter }: { proj: ProjetoMapa; onApplyFilter: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="text-sm space-y-2 min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-2">
        <span className="text-base">📋</span>
        <span className="font-semibold text-sm">{proj.nome}</span>
        <Badge variant="outline" className="text-[10px] ml-auto" style={{ borderColor: statusProjetoCores[proj.status], color: statusProjetoCores[proj.status] }}>
          {statusProjetoLabels[proj.status]}
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>👤 {proj.proponenteNome}</p>
        <p>📄 {proj.instrumento}</p>
        <p>👥 {proj.publicoImpactado.toLocaleString("pt-BR")} pessoas impactadas</p>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Button size="sm" className="text-xs h-7 gap-1 flex-1" onClick={onApplyFilter}>
          <Filter className="h-3 w-3" /> Aplicar filtro global
        </Button>
        <Button size="sm" variant="link" className="text-xs h-7 p-0" onClick={() => navigate(`/dados/projeto/${proj.id}`)}>
          Ver detalhe →
        </Button>
      </div>
    </div>
  );
}

function PopupEspaco({ eq, onApplyFilter }: { eq: typeof equipamentosMock[0]; onApplyFilter: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="text-sm space-y-2 min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-2">
        <span className="text-base">{iconesTipoEquipamento[eq.tipo]}</span>
        <span className="font-semibold text-sm">{eq.nome}</span>
        <Badge variant={eq.status === "Ativo" ? "default" : "destructive"} className="text-[10px] ml-auto">
          {eq.status}
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>🏗 {eq.tipo} · {eq.municipio}</p>
        {eq.capacidade && <p>👥 Capacidade: {eq.capacidade}</p>}
        <p>📊 {eq.projetosRealizados} projetos realizados</p>
        <p>🔧 Gestão: {eq.gestao}</p>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Button size="sm" className="text-xs h-7 gap-1 flex-1" onClick={onApplyFilter}>
          <Filter className="h-3 w-3" /> Aplicar filtro global
        </Button>
        <Button size="sm" variant="link" className="text-xs h-7 p-0" onClick={() => navigate(`/dados/espaco/${eq.id}`)}>
          Ver detalhe →
        </Button>
      </div>
    </div>
  );
}

function PopupDeserto({ dc, onApplyFilter }: { dc: DesertoCultural; onApplyFilter: () => void }) {
  return (
    <div className="text-sm space-y-2 min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-2">
        <span className="text-base">📍</span>
        <span className="font-semibold text-sm">{dc.regiao}</span>
        <Badge variant="outline" className="text-[10px] ml-auto" style={{ borderColor: prioridadeDesertoCores[dc.prioridade], color: prioridadeDesertoCores[dc.prioridade] }}>
          Prioridade {dc.prioridade}
        </Badge>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>👥 Pop. {(dc.populacao / 1000).toFixed(0)}k · {dc.agentes} agentes</p>
        <p>📊 {dc.agentes} agentes para {(dc.populacao / 1000).toFixed(0)}k habitantes — índice de cobertura {dc.cobertura100k}/100k</p>
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Button size="sm" className="text-xs h-7 gap-1 flex-1" onClick={onApplyFilter}>
          <Filter className="h-3 w-3" /> Aplicar filtro global
        </Button>
        <Button size="sm" variant="link" className="text-xs h-7 p-0">
          Ver detalhe →
        </Button>
      </div>
    </div>
  );
}

// ===== Component =====
export function MapaCenso({ artistas, onArtistaClick, modoCalor, searchQuery, selectedMunicipio, onSearchQueryChange, onSelectMunicipio, onResetView, filtroLinguagem = "todas", filtroCidades = [] }: MapaCensoProps) {
  const navigate = useNavigate();
  const { addFilter } = useMapFilter();
  const PE_CENTER: [number, number] = [-8.3, -36.5];

  // Filter projetos and espacos by global filters
  const projetosFiltrados = useMemo(() => {
    let result = projetosMapaMock;
    if (filtroLinguagem !== "todas") {
      result = result.filter(p => p.linguagem === filtroLinguagem);
    }
    if (filtroCidades.length > 0) {
      result = result.filter(p => filtroCidades.includes(p.municipio));
    }
    return result;
  }, [filtroLinguagem, filtroCidades]);

  const espacosFiltrados = useMemo(() => {
    let result = equipamentosMock;
    if (filtroLinguagem !== "todas") {
      result = result.filter(e => e.linguagens.some(l => l === filtroLinguagem));
    }
    if (filtroCidades.length > 0) {
      result = result.filter(e => filtroCidades.includes(e.municipio));
    }
    return result;
  }, [filtroLinguagem, filtroCidades]);

  // Camadas toggles (US-02)
  const [camadas, setCamadas] = useState<CamadasState>({
    produtores: true,
    projetos: true,
    espacos: true,
    desertos: true,
  });
  const [painelAberto, setPainelAberto] = useState(true);
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  const toggleCamada = (key: keyof CamadasState) => {
    setCamadas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const mostrarTodas = () => {
    setCamadas({ produtores: true, projetos: true, espacos: true, desertos: true });
  };

  const totalVisiveis = useMemo(() => {
    let total = 0;
    if (camadas.produtores) total += artistas.length;
    if (camadas.projetos) total += projetosFiltrados.length;
    if (camadas.espacos) total += espacosFiltrados.length;
    if (camadas.desertos) total += desertosCulturaisMock.length;
    return total;
  }, [camadas, artistas.length, projetosFiltrados.length, espacosFiltrados.length]);

  // Filter application handlers (US-03)
  const applyProdutorFilter = useCallback((artista: AgenteCenso) => {
    addFilter({
      id: `produtor-${artista.produtoraId}`,
      type: "produtor",
      name: artista.produtoraNome,
      icon: "🎭",
      meta: { municipio: artista.municipio, linguagem: artista.linguagem },
    });
  }, [addFilter]);

  const applyProjetoFilter = useCallback((proj: ProjetoMapa) => {
    addFilter({
      id: `projeto-${proj.id}`,
      type: "projeto",
      name: proj.nome,
      icon: "📋",
      meta: { municipio: proj.municipio, instrumento: proj.instrumento },
    });
  }, [addFilter]);

  const applyEspacoFilter = useCallback((eq: typeof equipamentosMock[0]) => {
    addFilter({
      id: `espaco-${eq.id}`,
      type: "espaco",
      name: eq.nome,
      icon: iconesTipoEquipamento[eq.tipo] || "🏛",
      meta: { municipio: eq.municipio, tipo: eq.tipo },
    });
  }, [addFilter]);

  const applyDesertoFilter = useCallback((dc: DesertoCultural) => {
    addFilter({
      id: `deserto-${dc.id}`,
      type: "deserto",
      name: dc.regiao,
      icon: "📍",
      meta: { regiao: dc.regiao },
    });
  }, [addFilter]);

  // Layer config for the control panel
  const layerConfig = [
    {
      key: "produtores" as const,
      label: "Produtores / Coletivos",
      icon: <Users className="h-4 w-4" />,
      cor: CORES_CAMADA.produtores,
      count: artistas.length,
    },
    {
      key: "projetos" as const,
      label: "Projetos",
      icon: <FolderKanban className="h-4 w-4" />,
      cor: CORES_CAMADA.projetos,
      count: projetosFiltrados.length,
    },
    {
      key: "espacos" as const,
      label: "Espaços Culturais",
      icon: <Building2 className="h-4 w-4" />,
      cor: CORES_CAMADA.espacos,
      count: espacosFiltrados.length,
    },
    {
      key: "desertos" as const,
      label: "Desertos Culturais",
      icon: <AlertTriangle className="h-4 w-4" />,
      cor: CORES_CAMADA.desertos,
      count: desertosCulturaisMock.length,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="relative w-full rounded-lg overflow-hidden border border-border" style={{ zIndex: 0 }}>
        <MapContainer
          center={PE_CENTER}
          zoom={7}
          className="w-full z-0"
          style={{ minHeight: "600px" }}
          scrollWheelZoom={true}
        >
          <PaneSetup />
          <TileSwitcher isSatellite={isSatellite} />
          <ZoomToMunicipio municipio={selectedMunicipio} onReset={onResetView} />

          {/* ===== CAMADA: Desertos Culturais (z=350) ===== */}
          {camadas.desertos && desertosCulturaisMock.map((dc) => (
            <Circle
              key={dc.id}
              center={[dc.location.lat, dc.location.lng]}
              radius={dc.raioKm * 1000}
              pane="desertoPane"
              pathOptions={{
                fillColor: prioridadeDesertoCores[dc.prioridade],
                fillOpacity: 0.15,
                color: prioridadeDesertoCores[dc.prioridade],
                weight: 2,
                dashArray: "8 4",
              }}
            >
              <Popup>
                <PopupDeserto dc={dc} onApplyFilter={() => applyDesertoFilter(dc)} />
              </Popup>
            </Circle>
          ))}

          {/* ===== CAMADA: Espaços Culturais (z=450) ===== */}
          {camadas.espacos && espacosFiltrados.map((eq) => (
            <Marker
              key={eq.id}
              position={[eq.location.lat, eq.location.lng]}
              icon={createEmojiIcon(iconesTipoEquipamento[eq.tipo])}
              pane="espacoPane"
            >
              <Popup>
                <PopupEspaco eq={eq} onApplyFilter={() => applyEspacoFilter(eq)} />
              </Popup>
            </Marker>
          ))}

          {/* ===== CAMADA: Projetos (z=500) ===== */}
          {camadas.projetos && projetosFiltrados.map((proj) => (
            <CircleMarker
              key={proj.id}
              center={[proj.location.lat, proj.location.lng]}
              radius={7}
              pane="projetoPane"
              pathOptions={{
                fillColor: statusProjetoCores[proj.status] || CORES_CAMADA.projetos,
                fillOpacity: 0.85,
                color: "#fff",
                weight: 2,
              }}
            >
              <Popup>
                <PopupProjeto proj={proj} onApplyFilter={() => applyProjetoFilter(proj)} />
              </Popup>
            </CircleMarker>
          ))}

          {/* ===== CAMADA: Produtores/Coletivos (z=550) ===== */}
          {camadas.produtores && !modoCalor && artistas.map((artista) => (
            <CircleMarker
              key={artista.id}
              center={[artista.location.lat, artista.location.lng]}
              radius={7}
              pane="produtorPane"
              pathOptions={{
                fillColor: CORES_CAMADA.produtores,
                fillOpacity: 0.8,
                color: "#fff",
                weight: 2,
              }}
              eventHandlers={{ click: () => onArtistaClick(artista) }}
            >
              <Popup>
                <PopupProdutor artista={artista} onApplyFilter={() => applyProdutorFilter(artista)} />
              </Popup>
            </CircleMarker>
          ))}

          {/* Heatmap mode */}
          {camadas.produtores && modoCalor && <HeatmapLayer artistas={artistas} />}
        </MapContainer>

        {/* ===== PAINEL DE CONTROLE (US-02) ===== */}
        <div className="absolute top-3 right-3 z-[1000]">
          <Collapsible open={painelAberto} onOpenChange={setPainelAberto}>
            <CollapsibleTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 shadow-md">
                <Layers className="h-4 w-4" />
                Camadas
                {painelAberto ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2 w-64 shadow-lg">
                <CardContent className="p-3 space-y-3">
                  <p className="text-xs text-muted-foreground font-medium">
                    {totalVisiveis} entidades no mapa
                  </p>

                  {layerConfig.map((layer) => (
                    <div key={layer.key}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={camadas[layer.key]}
                            onCheckedChange={() => toggleCamada(layer.key)}
                            id={`toggle-${layer.key}`}
                          />
                          <Label
                            htmlFor={`toggle-${layer.key}`}
                            className="text-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: layer.cor }}
                            />
                            {layer.label}
                          </Label>
                        </div>
                        <span className="text-xs text-muted-foreground">{layer.count}</span>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-7"
                    onClick={mostrarTodas}
                  >
                    Mostrar todas
                  </Button>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* ===== BASE MAP TOGGLE (US-06) ===== */}
        <div className="absolute bottom-3 right-3 z-[1000]">
          <div className="flex gap-1 bg-background/90 backdrop-blur rounded-md border border-border shadow-md p-0.5">
            <Button
              variant={!isSatellite ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1.5 px-2.5"
              onClick={() => setIsSatellite(false)}
            >
              <MapIcon className="h-3.5 w-3.5" /> Rua
            </Button>
            <Button
              variant={isSatellite ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1.5 px-2.5"
              onClick={() => setIsSatellite(true)}
            >
              <Satellite className="h-3.5 w-3.5" /> Satélite
            </Button>
          </div>
        </div>
      </div>

      {/* ===== LEGENDA DINÂMICA ===== */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {camadas.produtores && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CORES_CAMADA.produtores }} />
            Produtores ({artistas.length})
          </span>
        )}
        {camadas.projetos && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CORES_CAMADA.projetos }} />
            Projetos ({projetosFiltrados.length})
          </span>
        )}
        {camadas.espacos && (
          <>
            {Object.entries(iconesTipoEquipamento).map(([t, icon]) => (
              <span key={t} className="flex items-center gap-1">{icon} {t}</span>
            ))}
          </>
        )}
        {camadas.desertos && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-dashed" style={{ borderColor: CORES_CAMADA.desertos }} />
            Desertos Culturais ({desertosCulturaisMock.length})
          </span>
        )}
      </div>
    </div>
  );
}
