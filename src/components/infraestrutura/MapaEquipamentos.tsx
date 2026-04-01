import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  equipamentosMock,
  tiposEquipamento,
  iconesTipoEquipamento,
  type EquipamentoCultural,
} from "@/data/mockEquipamentosCulturais";
import { artistasMock, coresCategoria } from "@/data/mockCensoCultural";

const coresTipo: Record<string, string> = {
  "Teatro": "#8b5cf6",
  "Museu": "#3b82f6",
  "Biblioteca": "#06b6d4",
  "CEU": "#f97316",
  "Espaço Independente": "#ec4899",
};

function createEmojiIcon(emoji: string) {
  return L.divIcon({
    html: `<span style="font-size:24px;line-height:1;display:block;text-align:center">${emoji}</span>`,
    className: "emoji-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function MapaEquipamentos() {
  const [tiposFiltro, setTiposFiltro] = useState<string[]>([...tiposEquipamento]);
  const [mostrarArtistas, setMostrarArtistas] = useState(false);

  const toggleTipo = (tipo: string) => {
    setTiposFiltro((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const equipamentosFiltrados = equipamentosMock.filter((e) =>
    tiposFiltro.includes(e.tipo)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-base font-semibold">
            Mapa de Equipamentos Culturais
          </CardTitle>
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
            {equipamentosFiltrados.length} equipamentos exibidos
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-border h-[480px]">
          <MapContainer
            center={[-8.3, -36.5]}
            zoom={7}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* Camada de artistas */}
            {mostrarArtistas &&
              artistasMock.map((artista) => (
                <CircleMarker
                  key={artista.id}
                  center={[artista.location.lat, artista.location.lng]}
                  radius={4}
                  pathOptions={{
                    fillColor: coresCategoria[artista.categoria] || "#94a3b8",
                    fillOpacity: 0.5,
                    color: coresCategoria[artista.categoria] || "#94a3b8",
                    weight: 1,
                  }}
                >
                  <LTooltip direction="top" offset={[0, -5]}>
                    <span className="text-xs">{artista.nome} · {artista.categoria}</span>
                  </LTooltip>
                </CircleMarker>
              ))}

            {/* Camada de equipamentos */}
            {equipamentosFiltrados.map((eq) => (
              <Marker
                key={eq.id}
                position={[eq.location.lat, eq.location.lng]}
                icon={createEmojiIcon(iconesTipoEquipamento[eq.tipo])}
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
                        variant="outline"
                        className={`text-[10px] ${eq.status === "Ativo" ? "border-green-500 text-green-700" : "border-red-500 text-red-700"}`}
                      >
                        {eq.status}
                      </Badge>
                    </div>
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
