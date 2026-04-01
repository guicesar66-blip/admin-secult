import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TOTAL_MUNICIPIOS_PE = 185;
const MUNICIPIOS_COM_AGENTES = 47;
const VARIACAO = "+3";
const PERCENTUAL = ((MUNICIPIOS_COM_AGENTES / TOTAL_MUNICIPIOS_PE) * 100).toFixed(1);

const mesorregioes = [
  { nome: "Metropolitana", comAgentes: 23, total: 25, percent: 92 },
  { nome: "Agreste", comAgentes: 14, total: 71, percent: 20 },
  { nome: "Sertão", comAgentes: 7, total: 57, percent: 12 },
  { nome: "Vale do S. Francisco", comAgentes: 3, total: 32, percent: 9 },
];

const pontosHeatmap: { lat: number; lng: number; intensidade: number; label: string }[] = [
  { lat: -8.05, lng: -34.87, intensidade: 0.92, label: "Metropolitana (23)" },
  { lat: -8.33, lng: -36.02, intensidade: 0.2, label: "Agreste (14)" },
  { lat: -8.07, lng: -38.3, intensidade: 0.12, label: "Sertão (7)" },
  { lat: -8.75, lng: -38.9, intensidade: 0.09, label: "Vale do S.F. (3)" },
];

function getIntensityColor(intensity: number): string {
  if (intensity >= 0.7) return "hsl(var(--primary))";
  if (intensity >= 0.3) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

interface CapilaridadeKPIProps {
  filtroPeriodo: string;
}

export function CapilaridadeKPI({ filtroPeriodo }: CapilaridadeKPIProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Índice de Capilaridade
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">

        {/* Progress bars per mesoregion */}
        <div className="space-y-2">
          {mesorregioes.map((m) => (
            <div key={m.nome} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{m.nome}</span>
                <span className="font-medium tabular-nums">
                  {m.comAgentes}/{m.total}{" "}
                  <span className="text-muted-foreground">({m.percent}%)</span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${m.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mini-map — z-index fixed to avoid overflowing header */}
        <div className="rounded-lg overflow-hidden border border-border h-[140px] relative z-0">
          <MapContainer
            center={[-8.3, -36.5]}
            zoom={6}
            scrollWheelZoom={false}
            dragging={false}
            zoomControl={false}
            attributionControl={false}
            className="h-full w-full"
            style={{ zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            />
            {pontosHeatmap.map((p) => (
              <CircleMarker
                key={p.label}
                center={[p.lat, p.lng]}
                radius={Math.max(8, p.intensidade * 28)}
                pathOptions={{
                  fillColor: getIntensityColor(p.intensidade),
                  fillOpacity: 0.6,
                  color: getIntensityColor(p.intensidade),
                  weight: 1,
                }}
              >
                <LTooltip direction="top" offset={[0, -5]}>
                  <span className="text-xs font-medium">{p.label}</span>
                </LTooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
