import React, { useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface CamadaInfo {
  id: string;
  nome: string;
  cor: string;
  visivel: boolean;
  contador: number;
  icone?: React.ReactNode;
}

interface LegendaDinamicaProps {
  camadas: CamadaInfo[];
  onToggleCamada: (id: string) => void;
  totalVisivel: number;
  posicao?: 'bottom' | 'top-right' | 'top-left';
  className?: string;
}

export const LegendaDinamica: React.FC<LegendaDinamicaProps> = ({
  camadas,
  onToggleCamada,
  totalVisivel,
  posicao = 'bottom',
  className = '',
}) => {
  const posiçãoClasses = {
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 ${posiçãoClasses[posicao]} ${className}`}
    >
      {/* Título */}
      <div className="mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Camadas do Mapa</h3>
        <p className="text-xs text-gray-600 mt-1">
          {totalVisivel} entidade{totalVisivel !== 1 ? 's' : ''} visível{totalVisivel !== 1 ? 'eis' : ''}
        </p>
      </div>

      {/* Camadas */}
      <div className="space-y-2">
        {camadas.map((camada) => (
          <button
            key={camada.id}
            onClick={() => onToggleCamada(camada.id)}
            className={`w-full flex items-center gap-2 p-2 rounded transition-colors ${
              camada.visivel ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100 opacity-60 hover:bg-gray-200'
            }`}
          >
            {/* Indicador de visibilidade */}
            <div className="flex-shrink-0">
              {camada.visivel ? (
                <Eye className="w-4 h-4 text-gray-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </div>

            {/* Amostra de cor */}
            <div className={`flex-shrink-0 w-3 h-3 rounded-full border border-gray-300`} style={{ backgroundColor: camada.cor }} />

            {/* Info da camada */}
            <div className="flex-1 text-left">
              <p className={`text-sm font-medium ${camada.visível ? 'text-gray-900' : 'text-gray-600'}`}>
                {camada.nome}
              </p>
            </div>

            {/* Contador */}
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              camada.visivel
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {camada.contador}
            </span>
          </button>
        ))}
      </div>

      {/* Footer com info */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">Clique para mostrar/ocultar camadas</p>
      </div>
    </div>
  );
};
