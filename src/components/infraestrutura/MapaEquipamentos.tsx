import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Eye } from "lucide-react";
import {
  equipamentosMock,
  tiposEquipamento,
  iconesTipoEquipamento,
  municipiosAcessoMock,
  getFaixaAcesso,
  formatarTempo,
} from "@/data/mockEquipamentosCulturais";
import { buildAgentesCenso, coresLinguagem } from "@/data/mockCensoAuxiliar";

const raios = [
  { minutos: 30, metros: 15000, cor: "#22c55e", opacidade: 0.08 },
  { minutos: 60, metros: 35000, cor: "#eab308", opacidade: 0.06 },
  { minutos: 120, metros: 70000, cor: "#f97316", opacidade: 0.04 },
];

function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<span style="font-size:24px;line-height:1;display:block;text-align:center">${emoji}</span>`,
    className: "emoji-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

/** Creates custom panes with explicit z-index so radius always renders below markers */
function PaneSetup() {
  const map = useMap();
  useEffect(() => {
    if (!map.getPane("raioPane")) {
      const raio = map.createPane("raioPane");
      raio.style.zIndex = "350";
    }
    if (!map.getPane("municipioPane")) {
      const mun = map.createPane("municipioPane");
      mun.style.zIndex = "450";
    }
    if (!map.getPane("artistaPane")) {
      const art = map.createPane("artistaPane");
      art.style.zIndex = "500";
    }
    if (!map.getPane("equipamentoPane")) {
      const eq = map.createPane("equipamentoPane");
      eq.style.zIndex = "550";
    }
  }, [map]);
  return null;
}

/** Fires a reset event when the user clicks on an empty area of the map */
function MapResetClick({ onReset }: { onReset?: () => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onReset) return;
    const handler = () => onReset();
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [map, onReset]);
  return null;
}

export interface MapFilterEvent {
  type: "equipamento" | "municipio" | "artista" | "reset";
  municipio?: string;
  nome?: string;
  tipo?: string;
  categoria?: string;
}

interface MapaEquipamentosProps {
  filtroCritico?: boolean;
  onMapClick?: (filter: MapFilterEvent) => void;
}

export function MapaEquipamentos({ filtroCritico = false, onMapClick }: MapaEquipamentosProps) {
  const navigate = useNavigate();
  const [tiposFiltro, setTiposFiltro] = useState<string[]>([...tiposEquipamento]);
  const [mostrarArtistas, setMostrarArtistas] = useState(false);
  const [mostrarRaioAcesso, setMostrarRaioAcesso] = useState(false);

  const toggleTipo = (tipo: string) => {
    setTiposFiltro((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const municipiosCriticos = useMemo(
    () => municipiosAcessoMock.filter((m) => m.tempoMedio > 120),
    []
  );
  const equipamentosCriticosNomes = useMemo(
    () => new Set(municipiosCriticos.map((m) => m.equipamentoProximo)),
    [municipiosCriticos]
  );

  const equipamentosFiltrados = useMemo(() => {
    let resultado = equipamentosMock.filter((e) => tiposFiltro.includes(e.tipo));
    if (filtroCritico) {
      resultado = resultado.filter((e) => equipamentosCriticosNomes.has(e.nome));
    }
    return resultado;
  }, [tiposFiltro, filtroCritico, equipamentosCriticosNomes]);

  const municipiosFiltrados = useMemo(() => {
    if (filtroCritico) return municipiosCriticos;
    return municipiosAcessoMock;
  }, [filtroCritico, municipiosCriticos]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-base font-semibold">
            Mapa de Espaços Culturais
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="toggle-raio"
                checked={mostrarRaioAcesso}
                onCheckedChange={setMostrarRaioAcesso}
              />
              <Label htmlFor="toggle-raio" className="text-xs text-muted-foreground cursor-pointer">
                Raio de acesso
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="toggle-artistas"
                checked={mostrarArtistas}
                onCheckedChange={setMostrarArtistas}
              />
              <Label htmlFor="toggle-artistas" className="text-xs text-muted-foreground cursor-pointer">
                Sobrepor artistas
              </Label>
            </div>
          </div>
        </div>
        {/* Filtros por tipo */}
        <div className="flex flex-wrap gap-3 mt-2">
          {tiposEquipamento.map((tipo) => (
            <div key={tipo} className="flex items-center gap-1.5">
              <Checkbox
                id={`tipo-${tipo}`}
                checked={tiposFiltro.includes(tipo)}
                onCheckedChange={() => toggleTipo(tipo)}
              />
              <Label htmlFor={`tipo-${tipo}`} className="text-xs cursor-pointer flex items-center gap-1">
                <span>{iconesTipoEquipamento[tipo]}</span>
                {tipo}
              </Label>
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-auto flex items-center">
            {equipamentosFiltrados.length} espaços exibidos
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* relative z-0 creates a stacking context so Leaflet's internal z-indexes don't overflow above the page header */}
        <div className="rounded-lg overflow-hidden border border-border h-[480px] relative z-0">
          <MapContainer
            center={[-8.3, -36.5]}
            zoom={7}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <PaneSetup />
            <MapResetClick onReset={() => onMapClick?.({ type: "reset" })} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* Camada de raio de acesso - círculos concêntricos (pane mais baixo) */}
            {mostrarRaioAcesso &&
              equipamentosFiltrados
                .filter((eq) => eq.status === "Ativo")
                .map((eq) =>
                  raios.map((r) => (
                    <Circle
                      key={`${eq.id}-${r.minutos}`}
                      center={[eq.location.lat, eq.location.lng]}
                      radius={r.metros}
                      pane="raioPane"
                      pathOptions={{
                        fillColor: r.cor,
                        fillOpacity: r.opacidade,
                        color: r.cor,
                        weight: 0.5,
                        opacity: 0.3,
                      }}
                    />
                  ))
                )}

            {/* Camada de raio de acesso - pontos dos municípios */}
            {mostrarRaioAcesso &&
              municipiosFiltrados.map((m) => {
                const faixa = getFaixaAcesso(m.tempoMedio);
                return (
                  <CircleMarker
                    key={`acesso-${m.municipio}`}
                    center={[m.location.lat, m.location.lng]}
                    radius={m.tempoMedio > 120 ? 8 : 5}
                    pane="municipioPane"
                    pathOptions={{
                      fillColor: faixa.cor,
                      fillOpacity: 0.8,
                      color: faixa.cor,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => onMapClick?.({ type: "municipio", municipio: m.municipio }),
                    }}
                  >
                    <Popup>
                      <div className="text-sm space-y-1 min-w-[180px]">
                        <p className="font-semibold">{m.municipio}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Tempo médio</span>
                          <span className="text-xs font-medium" style={{ color: faixa.cor }}>
                            {formatarTempo(m.tempoMedio)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Mais próximo</span>
                          <span className="text-xs font-medium text-right max-w-[120px]">
                            {m.equipamentoProximo}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Tipo</span>
                          <span className="text-xs">
                            {iconesTipoEquipamento[m.tipoEquipamento]} {m.tipoEquipamento}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Distância</span>
                          <span className="text-xs font-medium">{m.distanciaKm} km</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Badge
                            variant="outline"
                            className="text-[10px]"
                            style={{ borderColor: faixa.cor, color: faixa.cor }}
                          >
                            {faixa.label}
                          </Badge>
                        </div>
                      </div>
                    </Popup>
                    <LTooltip direction="top" offset={[0, -5]}>
                      <span className="text-xs font-medium">
                        {m.municipio} · {formatarTempo(m.tempoMedio)}
                      </span>
                    </LTooltip>
                  </CircleMarker>
                );
              })}

            {/* Camada de artistas (via produtoras) */}
            {mostrarArtistas &&
              buildAgentesCenso().map((agente) => (
                <CircleMarker
                  key={agente.id}
                  center={[agente.location.lat, agente.location.lng]}
                  radius={4}
                  pane="artistaPane"
                  pathOptions={{
                    fillColor: coresLinguagem[agente.linguagem] || "#94a3b8",
                    fillOpacity: 0.5,
                    color: coresLinguagem[agente.linguagem] || "#94a3b8",
                    weight: 1,
                  }}
                  eventHandlers={{
                    click: () => onMapClick?.({ type: "artista", categoria: agente.linguagem, municipio: agente.municipio }),
                  }}
                >
                  <LTooltip direction="top" offset={[0, -5]}>
                    <span className="text-xs">{agente.nomeArtistico || agente.nome} · {agente.linguagem}</span>
                  </LTooltip>
                </CircleMarker>
              ))}

            {/* Camada de equipamentos (pane mais alto) */}
            {equipamentosFiltrados.map((eq) => (
              <Marker
                key={eq.id}
                position={[eq.location.lat, eq.location.lng]}
                icon={createEmojiIcon(iconesTipoEquipamento[eq.tipo])}
                pane="equipamentoPane"
                eventHandlers={{
                  click: () => onMapClick?.({ type: "equipamento", municipio: eq.municipio, nome: eq.nome, tipo: eq.tipo }),
                }}
              >
                <Popup>
                  <div className="text-sm space-y-1 min-w-[180px]">
                    <p className="font-semibold">{iconesTipoEquipamento[eq.tipo]} {eq.nome}</p>
                    <p className="text-muted-foreground">{eq.tipo} · {eq.municipio}</p>
                    {eq.capacidade && (
                      <p className="text-muted-foreground">Capacidade: {eq.capacidade}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {eq.gestao}
                      </Badge>
                      <Badge
                        variant={eq.status === "Ativo" ? "default" : "destructive"}
                        className="text-[10px]"
                      >
                        {eq.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="link"
                      className="text-xs p-0 h-auto mt-1 gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dados/espaco/${eq.id}`);
                      }}
                    >
                      <Eye className="h-3 w-3" /> Ver detalhe
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border">
          {tiposEquipamento.map((tipo) => (
            <div key={tipo} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{iconesTipoEquipamento[tipo]}</span>
              {tipo}
            </div>
          ))}
          {mostrarRaioAcesso && (
            <>
              <span className="text-xs text-muted-foreground">|</span>
              {[
                { cor: "#22c55e", label: "Até 30 min" },
                { cor: "#eab308", label: "30–1h" },
                { cor: "#f97316", label: "1h–2h" },
                { cor: "#ef4444", label: ">2h" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.cor }} />
                  {f.label}
                </div>
              ))}
            </>
          )}
          {mostrarArtistas && (
            <div className="text-xs text-muted-foreground ml-auto">
              ● Pontos coloridos = artistas do censo
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
