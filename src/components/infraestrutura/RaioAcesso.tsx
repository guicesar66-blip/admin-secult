import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip as LTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, AlertTriangle, MapPin } from "lucide-react";
import {
  equipamentosMock,
  municipiosAcessoMock,
  acessoKPI,
  getFaixaAcesso,
  formatarTempo,
  iconesTipoEquipamento,
} from "@/data/mockEquipamentosCulturais";

const raios = [
  { minutos: 30, metros: 15000, cor: "#22c55e", opacidade: 0.08 },
  { minutos: 60, metros: 35000, cor: "#eab308", opacidade: 0.06 },
  { minutos: 120, metros: 70000, cor: "#f97316", opacidade: 0.04 },
];

export function RaioAcesso() {
  const [municipioSel, setMunicipioSel] = useState<string | null>(null);
  const municipioInfo = municipiosAcessoMock.find((m) => m.municipio === municipioSel);
  const criticos = municipiosAcessoMock.filter((m) => m.tempoMedio > 120);

  return (
    <div className="space-y-4">
      {/* KPI Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6 pb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                População com acesso em até 1h a um equipamento cultural
              </p>
              <p className="text-4xl font-bold mt-1">{acessoKPI.percentualAte1h}%</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{acessoKPI.totalEquipamentos} equipamentos mapeados</span>
                <span>·</span>
                <span className="text-destructive font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {acessoKPI.municipiosCriticos} municípios com acesso crítico (&gt;2h)
                </span>
              </div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-7 w-7 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mapa de raios */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Raio de Acesso a Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-border h-[400px]">
              <MapContainer
                center={[-8.3, -36.5]}
                zoom={7}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Círculos concêntricos por equipamento */}
                {equipamentosMock
                  .filter((eq) => eq.status === "Ativo")
                  .map((eq) =>
                    raios.map((r) => (
                      <Circle
                        key={`${eq.id}-${r.minutos}`}
                        center={[eq.location.lat, eq.location.lng]}
                        radius={r.metros}
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

                {/* Pontos dos municípios */}
                {municipiosAcessoMock.map((m) => {
                  const faixa = getFaixaAcesso(m.tempoMedio);
                  return (
                    <CircleMarker
                      key={m.municipio}
                      center={[m.location.lat, m.location.lng]}
                      radius={m.tempoMedio > 120 ? 8 : 5}
                      pathOptions={{
                        fillColor: faixa.cor,
                        fillOpacity: 0.8,
                        color: faixa.cor,
                        weight: 2,
                      }}
                      eventHandlers={{
                        click: () => setMunicipioSel(m.municipio),
                      }}
                    >
                      <LTooltip direction="top" offset={[0, -5]}>
                        <span className="text-xs font-medium">
                          {m.municipio} · {formatarTempo(m.tempoMedio)}
                        </span>
                      </LTooltip>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border">
              {[
                { cor: "#22c55e", label: "Até 30 min" },
                { cor: "#eab308", label: "30 min – 1h" },
                { cor: "#f97316", label: "1h – 2h" },
                { cor: "#ef4444", label: "Mais de 2h" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: f.cor }}
                  />
                  {f.label}
                </div>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">
                Clique em um município para detalhes
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Painel lateral */}
        <div className="space-y-4">
          {/* Detalhe do município clicado */}
          {municipioInfo ? (
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {municipioInfo.municipio}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tempo médio</span>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: getFaixaAcesso(municipioInfo.tempoMedio).cor,
                      color: getFaixaAcesso(municipioInfo.tempoMedio).cor,
                    }}
                  >
                    {formatarTempo(municipioInfo.tempoMedio)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Equipamento mais próximo</span>
                  <span className="text-xs font-medium text-right max-w-[140px]">
                    {municipioInfo.equipamentoProximo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tipo</span>
                  <span className="text-xs">
                    {iconesTipoEquipamento[municipioInfo.tipoEquipamento]} {municipioInfo.tipoEquipamento}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Distância</span>
                  <span className="text-xs font-medium">{municipioInfo.distanciaKm} km</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Clique em um município no mapa para ver detalhes
                </p>
              </CardContent>
            </Card>
          )}

          {/* Municípios críticos */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Acesso Crítico (&gt;2h)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {criticos.map((m) => (
                <div
                  key={m.municipio}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setMunicipioSel(m.municipio)}
                >
                  <div>
                    <p className="text-xs font-medium">{m.municipio}</p>
                    <p className="text-[10px] text-muted-foreground">
                      → {m.equipamentoProximo}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-[10px]">
                    {formatarTempo(m.tempoMedio)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
