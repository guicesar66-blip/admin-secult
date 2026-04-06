import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

interface MunicipioDado {
  municipio: string;
  lat: number;
  lng: number;
  valor: number;
  maxValor: number;
}

interface MinimapaMunicipalProps {
  dados: MunicipioDado[];
  titulo?: string;
  altura?: string;
  mostrarLegenda?: boolean;
  getCorPorValor?: (valor: number, maxValor: number) => string;
  onClick?: (municipio: string) => void;
  className?: string;
}

const getCorPadrao = (valor: number, maxValor: number): string => {
  const percentual = (valor / maxValor) * 100;
  if (percentual >= 70) return '#00A84F'; // Verde PE
  if (percentual >= 40) return '#FFB511'; // Amarelo
  return '#C34342'; // Vermelho
};

export const MinimapaMunicipal: React.FC<MinimapaMunicipalProps> = ({
  dados,
  titulo,
  altura = 'h-80',
  mostrarLegenda = true,
  getCorPorValor = getCorPadrao,
  onClick,
  className = '',
}) => {
  const center: [number, number] = [-8.5, -56.0]; // Centro do Pernambuco

  const maxValor = useMemo(() => Math.max(...dados.map(d => d.valor), 1), [dados]);

  return (
    <div className={className}>
      {titulo && <h4 className="text-sm font-semibold text-foreground mb-2">{titulo}</h4>}

      <div className={`border border-border rounded-lg overflow-hidden bg-white ${altura}`}>
        <MapContainer
          center={center}
          zoom={8}
          scrollWheelZoom={false}
          dragging={false}
          className="w-full h-full"
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />

          {dados.map((municipio) => (
            <CircleMarker
              key={municipio.municipio}
              center={[municipio.lat, municipio.lng]}
              radius={Math.max(3, (municipio.valor / maxValor) * 15)}
              fillColor={getCorPorValor(municipio.valor, maxValor)}
              color={getCorPorValor(municipio.valor, maxValor)}
              weight={1}
              opacity={0.8}
              fillOpacity={0.7}
              eventHandlers={
                onClick
                  ? {
                      click: () => onClick(municipio.municipio),
                    }
                  : {}
              }
            >
              <Tooltip>
                <div className="text-xs">
                  <p className="font-semibold">{municipio.municipio}</p>
                  <p className="text-muted-foreground">{municipio.valor} entidades</p>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {mostrarLegenda && (
        <div className="mt-2 flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Alta densidade (≥70%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Média (40-69%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-error" />
            <span className="text-muted-foreground">Baixa (&lt;40%)</span>
          </div>
        </div>
      )}
    </div>
  );
};
