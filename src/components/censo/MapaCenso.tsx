import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { Badge } from "@/components/ui/badge";
import type { AgenteCenso } from "@/data/mockCensoAuxiliar";
import { coresLinguagem } from "@/data/mockCensoAuxiliar";

interface MapaCensoProps {
  artistas: AgenteCenso[];
  onArtistaClick: (artista: AgenteCenso) => void;
  modoCalor: boolean;
}

// Heatmap layer component
function HeatmapLayer({ artistas }: { artistas: AgenteCenso[] }) {
  const map = useMap();

  useEffect(() => {
    if (artistas.length === 0) return;

    // @ts-ignore
    const heat = (L as any).heatLayer(
      artistas.map(a => [a.location.lat, a.location.lng, 0.5]),
      {
        radius: 30,
        blur: 20,
        maxZoom: 17,
        gradient: {
          0.2: "#ffffb2",
          0.4: "#fd8d3c",
          0.6: "#f03b20",
          0.8: "#bd0026",
          1.0: "#800026",
        },
      }
    );

    heat.addTo(map);
    return () => {
      map.removeLayer(heat);
    };
  }, [map, artistas]);

  return null;
}

export function MapaCenso({ artistas, onArtistaClick, modoCalor }: MapaCensoProps) {
  const center: [number, number] = [-8.0576, -34.8770];

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full z-0"
        style={{ minHeight: "500px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {modoCalor ? (
          <HeatmapLayer artistas={artistas} />
        ) : (
          artistas.map((artista) => (
            <CircleMarker
              key={artista.id}
              center={[artista.location.lat, artista.location.lng]}
              radius={8 + (artista.scoreReputacao / 20)}
              pathOptions={{
                fillColor: coresLinguagem[artista.linguagem] || "#6b7280",
                fillOpacity: 0.8,
                color: "#fff",
                weight: 2,
              }}
              eventHandlers={{
                click: () => onArtistaClick(artista),
              }}
            >
              <Popup>
                <div className="text-sm space-y-1 min-w-[180px]">
                  <p className="font-semibold">{artista.nomeArtistico || artista.nome}</p>
                  <p className="text-xs text-gray-500">{artista.linguagem} • {artista.bairro}</p>
                  <p className="text-xs">Produtora: <strong>{artista.produtoraNome}</strong></p>
                  <p className="text-xs">Score: <strong>{artista.scoreReputacao}</strong></p>
                  <button
                    onClick={() => onArtistaClick(artista)}
                    className="text-xs text-blue-600 underline mt-1 block"
                  >
                    Ver perfil completo →
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))
        )}
      </MapContainer>
    </div>
  );
}
