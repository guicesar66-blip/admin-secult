import React from 'react';

interface GraficoComFiltroProps {
  titulo?: string;
  descricao?: string;
  filtros?: React.ReactNode;
  grafico: React.ReactNode;
  rodape?: React.ReactNode;
  carregando?: boolean;
  erro?: string;
  className?: string;
}

export const GraficoComFiltro: React.FC<GraficoComFiltroProps> = ({
  titulo,
  descricao,
  filtros,
  grafico,
  rodape,
  carregando = false,
  erro,
  className = '',
}) => {
  if (erro) {
    return (
      <div className={`border border-red-200 rounded-lg p-4 bg-red-50 ${className}`}>
        <p className="text-sm text-red-700">{erro}</p>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className={`border border-gray-200 rounded-lg p-8 bg-white flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-2 text-sm text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg p-4 bg-white ${className}`}>
      {/* Header */}
      {(titulo || descricao) && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          {titulo && <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>}
          {descricao && <p className="text-sm text-gray-600 mt-1">{descricao}</p>}
        </div>
      )}

      {/* Filtros */}
      {filtros && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          {filtros}
        </div>
      )}

      {/* Gráfico */}
      <div className="w-full overflow-x-auto">
        {grafico}
      </div>

      {/* Rodapé */}
      {rodape && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {rodape}
        </div>
      )}
    </div>
  );
};
