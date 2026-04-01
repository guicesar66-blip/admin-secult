import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer, TileLayer, CircleMarker, Popup, Marker, Circle,
  useMap, useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Eye, Building2, Users, FolderKanban, AlertTriangle,
  ChevronDown, ChevronRight, Layers, Search, Map as MapIcon,
  Satellite, RotateCcw, X,
} from "lucide-react";
import type { AgenteCenso } from "@/data/mockCensoAuxiliar";
import { coresLinguagem } from "@/data/mockCensoAuxiliar";
import { equipamentosMock, iconesTipoEquipamento } from "@/data/mockEquipamentosCulturais";
import {
  projetosMapaMock, desertosCulturaisMock,
  statusProjetoCores, statusProjetoLabels,
  prioridadeDesertoCores,
  type ProjetoMapa, type DesertoCultural,
} from "@/data/mockMapaEntidades";
import { municipiosPE } from "@/data/mockMunicipios";

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

interface MapaCensoProps {
  artistas: AgenteCenso[];
  onArtistaClick: (artista: AgenteCenso) => void;
  modoCalor: boolean;
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
      // Reset to PE view
      map.flyTo([-8.3, -36.5], 7, { duration: 1.2 });
      return;
    }
    // Find coordinates from known lists
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

// ===== Component =====
export function MapaCenso({ artistas, onArtistaClick, modoCalor }: MapaCensoProps) {
  const navigate = useNavigate();
  const PE_CENTER: [number, number] = [-8.3, -36.5];

  // Camadas toggles (US-02)
  const [camadas, setCamadas] = useState<CamadasState>({
    produtores: true,
    projetos: true,
    espacos: true,
    desertos: true,
  });
  const [painelAberto, setPainelAberto] = useState(true);

  // Sub-filters per layer
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  // Satellite (US-06)
  const [isSatellite, setIsSatellite] = useState(false);

  // Search (US-05)
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

  const handleSelectMunicipio = (nome: string) => {
    setSelectedMunicipio(nome);
    setSearchQuery(nome);
    setShowSuggestions(false);
  };

  const handleResetView = () => {
    setSelectedMunicipio(null);
    setSearchQuery("");
  };

  const toggleCamada = (key: keyof CamadasState) => {
    setCamadas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const mostrarTodas = () => {
    setCamadas({ produtores: true, projetos: true, espacos: true, desertos: true });
  };

  const totalVisiveis = contarEntidadesVisiveis(camadas, artistas);

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
      count: projetosMapaMock.length,
    },
    {
      key: "espacos" as const,
      label: "Espaços Culturais",
      icon: <Building2 className="h-4 w-4" />,
      cor: CORES_CAMADA.espacos,
      count: equipamentosMock.length,
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
      {/* Search bar (US-05) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar município..."
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
            <RotateCcw className="h-3.5 w-3.5" /> Ver Pernambuco completo
          </Button>
        )}
      </div>

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
          <ZoomToMunicipio municipio={selectedMunicipio} onReset={handleResetView} />

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
                <div className="text-sm space-y-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-semibold">{dc.regiao}</span>
                  </div>
                  <p className="text-xs">Pop. {(dc.populacao / 1000).toFixed(0)}k · {dc.agentes} agentes</p>
                  <p className="text-xs">Cobertura: {dc.cobertura100k}/100k hab.</p>
                  <Badge
                    variant="outline"
                    className="text-xs mt-1"
                    style={{ borderColor: prioridadeDesertoCores[dc.prioridade], color: prioridadeDesertoCores[dc.prioridade] }}
                  >
                    Prioridade {dc.prioridade}
                  </Badge>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* ===== CAMADA: Espaços Culturais (z=450) ===== */}
          {camadas.espacos && equipamentosMock.map((eq) => (
            <Marker
              key={eq.id}
              position={[eq.location.lat, eq.location.lng]}
              icon={createEmojiIcon(iconesTipoEquipamento[eq.tipo])}
              pane="espacoPane"
            >
              <Popup>
                <div className="text-sm space-y-1 min-w-[180px]">
                  <p className="font-semibold">{iconesTipoEquipamento[eq.tipo]} {eq.nome}</p>
                  <p className="text-muted-foreground">{eq.tipo} · {eq.municipio}</p>
                  {eq.capacidade && <p className="text-muted-foreground">Capacidade: {eq.capacidade}</p>}
                  <div className="flex gap-2 pt-1">
                    <Badge variant="outline" className="text-[10px]">{eq.gestao}</Badge>
                    <Badge variant={eq.status === "Ativo" ? "default" : "destructive"} className="text-[10px]">{eq.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{eq.projetosRealizados} projetos realizados</p>
                  <Button
                    size="sm" variant="link" className="text-xs p-0 h-auto mt-1 gap-1"
                    onClick={(e) => { e.stopPropagation(); navigate(`/dados/espaco/${eq.id}`); }}
                  >
                    <Eye className="h-3 w-3" /> Ver detalhe
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* ===== CAMADA: Projetos (z=500) ===== */}
          {camadas.projetos && projetosMapaMock.map((proj) => (
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
                <div className="text-sm space-y-1 min-w-[200px]">
                  <p className="font-semibold">{proj.nome}</p>
                  <p className="text-xs text-muted-foreground">{proj.proponenteNome} · {proj.instrumento}</p>
                  <Badge
                    variant="outline"
                    className="text-[10px]"
                    style={{ borderColor: statusProjetoCores[proj.status], color: statusProjetoCores[proj.status] }}
                  >
                    {statusProjetoLabels[proj.status]}
                  </Badge>
                  <p className="text-xs">{proj.publicoImpactado.toLocaleString("pt-BR")} pessoas impactadas</p>
                </div>
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
                <div className="text-sm space-y-1 min-w-[180px]">
                  <p className="font-semibold">{artista.nomeArtistico || artista.nome}</p>
                  <p className="text-xs text-muted-foreground">{artista.linguagem} · {artista.bairro}</p>
                  <p className="text-xs">Produtora: <strong>{artista.produtoraNome}</strong></p>
                  <p className="text-xs">Score: <strong>{artista.scoreReputacao}</strong></p>
                  <button
                    onClick={() => onArtistaClick(artista)}
                    className="text-xs text-primary underline mt-1 block"
                  >
                    Ver perfil completo →
                  </button>
                </div>
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
            Projetos ({projetosMapaMock.length})
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
