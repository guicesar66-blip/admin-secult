import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, MapPin } from "lucide-react";
import {
  municipiosAcessoMock,
  acessoKPI,
  getFaixaAcesso,
  formatarTempo,
  iconesTipoEquipamento,
} from "@/data/mockEquipamentosCulturais";

export function RaioAcesso() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Ative "Raio de acesso" no mapa e clique em um município para ver detalhes
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
                onClick={() => onMunicipioClick(m.municipio)}
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
  );
}
