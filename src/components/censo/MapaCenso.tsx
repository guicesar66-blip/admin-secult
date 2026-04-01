import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, Circle, Tooltip as LTooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Building2, Radio } from "lucide-react";
import type { AgenteCenso } from "@/data/mockCensoAuxiliar";
import { coresLinguagem } from "@/data/mockCensoAuxiliar";
import {
  equipamentosMock, iconesTipoEquipamento, municipiosAcessoMock,
  getFaixaAcesso, formatarTempo,
} from "@/data/mockEquipamentosCulturais";

interface MapaCensoProps {
  artistas: AgenteCenso[];
  onArtistaClick: (artista: AgenteCenso) => void;
  modoCalor: boolean;
}

function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<span style="font-size:22px;line-height:1;display:block;text-align:center">${emoji}</span>`,
    className: "emoji-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

const raios = [
  { minutos: 30, metros: 15000, cor: "#22c55e", opacidade: 0.08 },
  { minutos: 60, metros: 35000, cor: "#eab308", opacidade: 0.06 },
  { minutos: 120, metros: 70000, cor: "#f97316", opacidade: 0.04 },
];

function PaneSetup() {
  const map = useMap();
  useEffect(() => {
    if (!map.getPane("raioPane")) { const p = map.createPane("raioPane"); p.style.zIndex = "350"; }
    if (!map.getPane("municipioPane")) { const p = map.createPane("municipioPane"); p.style.zIndex = "450"; }
    if (!map.getPane("equipamentoPane")) { const p = map.createPane("equipamentoPane"); p.style.zIndex = "550"; }
  }, [map]);
  return null;
}

function HeatmapLayer({ artistas }: { artistas: AgenteCenso[] }) {
  const map = useMap();
  useEffect(() => {
    if (artistas.length === 0) return;
    // @ts-ignore
    const heat = (L as any).heatLayer(
      artistas.map(a => [a.location.lat, a.location.lng, 0.5]),
      { radius: 30, blur: 20, maxZoom: 17, gradient: { 0.2: "#ffffb2", 0.4: "#fd8d3c", 0.6: "#f03b20", 0.8: "#bd0026", 1.0: "#800026" } }
    );
    heat.addTo(map);
    return () => { map.removeLayer(heat); };
  }, [map, artistas]);
  return null;
}

export function MapaCenso({ artistas, onArtistaClick, modoCalor }: MapaCensoProps) {
  const navigate = useNavigate();
  const center: [number, number] = [-8.0576, -34.8770];
  const [mostrarEspacos, setMostrarEspacos] = useState(false);
  const [mostrarRaioAcesso, setMostrarRaioAcesso] = useState(false);

  const equipamentosAtivos = useMemo(() => equipamentosMock.filter(e => e.status === "Ativo"), []);

  return (
    <div className="space-y-2">
      {/* Toggles para camadas extras */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Switch id="toggle-espacos" checked={mostrarEspacos} onCheckedChange={setMostrarEspacos} />
          <Label htmlFor="toggle-espacos" className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1">
            <Building2 className="h-3 w-3" /> Espaços culturais
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="toggle-raio" checked={mostrarRaioAcesso} onCheckedChange={setMostrarRaioAcesso} />
          <Label htmlFor="toggle-raio" className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1">
            <Radio className="h-3 w-3" /> Raio de acesso
          </Label>
        </div>
      </div>

      <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
        <MapContainer center={center} zoom={13} className="w-full h-full z-0" style={{ minHeight: "500px" }} scrollWheelZoom={true}>
          <PaneSetup />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Raio de acesso */}
          {mostrarRaioAcesso && equipamentosAtivos.map(eq =>
            raios.map(r => (
              <Circle key={`${eq.id}-${r.minutos}`} center={[eq.location.lat, eq.location.lng]} radius={r.metros} pane="raioPane"
                pathOptions={{ fillColor: r.cor, fillOpacity: r.opacidade, color: r.cor, weight: 0.5, opacity: 0.3 }} />
            ))
          )}

          {/* Municípios acesso */}
          {mostrarRaioAcesso && municipiosAcessoMock.map(m => {
            const faixa = getFaixaAcesso(m.tempoMedio);
            return (
              <CircleMarker key={`ac-${m.municipio}`} center={[m.location.lat, m.location.lng]} radius={m.tempoMedio > 120 ? 8 : 5} pane="municipioPane"
                pathOptions={{ fillColor: faixa.cor, fillOpacity: 0.8, color: faixa.cor, weight: 2 }}>
                <Popup>
                  <div className="text-sm space-y-1 min-w-[160px]">
                    <p className="font-semibold">{m.municipio}</p>
                    <p className="text-xs">Tempo: <span style={{ color: faixa.cor }} className="font-medium">{formatarTempo(m.tempoMedio)}</span></p>
                    <p className="text-xs">Mais próximo: {m.equipamentoProximo}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Heatmap ou artistas */}
          {modoCalor ? (
            <HeatmapLayer artistas={artistas} />
          ) : (
            artistas.map(artista => (
              <CircleMarker key={artista.id} center={[artista.location.lat, artista.location.lng]}
                radius={8 + (artista.scoreReputacao / 20)}
                pathOptions={{ fillColor: coresLinguagem[artista.linguagem] || "#6b7280", fillOpacity: 0.8, color: "#fff", weight: 2 }}
                eventHandlers={{ click: () => onArtistaClick(artista) }}>
                <Popup>
                  <div className="text-sm space-y-1 min-w-[180px]">
                    <p className="font-semibold">{artista.nomeArtistico || artista.nome}</p>
                    <p className="text-xs text-gray-500">{artista.linguagem} • {artista.bairro}</p>
                    <p className="text-xs">Produtora: <strong>{artista.produtoraNome}</strong></p>
                    <p className="text-xs">Score: <strong>{artista.scoreReputacao}</strong></p>
                    <button onClick={() => onArtistaClick(artista)} className="text-xs text-blue-600 underline mt-1 block">Ver perfil completo →</button>
                  </div>
                </Popup>
              </CircleMarker>
            ))
          )}

          {/* Espaços culturais */}
          {mostrarEspacos && equipamentosMock.map(eq => (
            <Marker key={eq.id} position={[eq.location.lat, eq.location.lng]} icon={createEmojiIcon(iconesTipoEquipamento[eq.tipo])} pane="equipamentoPane">
              <Popup>
                <div className="text-sm space-y-1 min-w-[180px]">
                  <p className="font-semibold">{iconesTipoEquipamento[eq.tipo]} {eq.nome}</p>
                  <p className="text-muted-foreground">{eq.tipo} · {eq.municipio}</p>
                  {eq.capacidade && <p className="text-muted-foreground">Capacidade: {eq.capacidade}</p>}
                  <div className="flex gap-2 pt-1">
                    <Badge variant="outline" className="text-[10px]">{eq.gestao}</Badge>
                    <Badge variant={eq.status === "Ativo" ? "default" : "destructive"} className="text-[10px]">{eq.status}</Badge>
                  </div>
                  <Button size="sm" variant="link" className="text-xs p-0 h-auto mt-1 gap-1"
                    onClick={e => { e.stopPropagation(); navigate(`/dados/espaco/${eq.id}`); }}>
                    <Eye className="h-3 w-3" /> Ver detalhe
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legenda */}
      {(mostrarEspacos || mostrarRaioAcesso) && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {mostrarEspacos && Object.entries(iconesTipoEquipamento).map(([t, icon]) => (
            <span key={t} className="flex items-center gap-1">{icon} {t}</span>
          ))}
          {mostrarRaioAcesso && <>
            <span>|</span>
            {[{ cor: "#22c55e", l: "≤30min" }, { cor: "#eab308", l: "30-1h" }, { cor: "#f97316", l: "1-2h" }, { cor: "#ef4444", l: ">2h" }].map(f => (
              <span key={f.l} className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.cor }} />{f.l}</span>
            ))}
          </>}
        </div>
      )}
    </div>
  );
}
