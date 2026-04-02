import React from 'react';

interface CardMetricaProps {
  titulo: string;
  valor: string | number;
  unidade?: string;
  subtitulo?: string;
  variacao?: {
    percentual: number;
    tipo: 'up' | 'down' | 'stable';
  };
  status?: 'normal' | 'alerta' | 'crítico';
  icon?: React.ReactNode;
  className?: string;
}

export const CardMetrica: React.FC<CardMetricaProps> = ({
  titulo,
  valor,
  unidade,
  subtitulo,
  variacao,
  status = 'normal',
  icon,
  className = '',
}) => {
  const statusClasses = {
    normal: 'border-gray-200 bg-white',
    alerta: 'border-orange-200 bg-orange-50',
    crítico: 'border-red-200 bg-red-50',
  };

  const statusTextClasses = {
    normal: 'text-gray-900',
    alerta: 'text-orange-900',
    crítico: 'text-red-900',
  };

  const variationColor = variacao?.tipo === 'up' ? 'text-green-600' : 
                        variacao?.tipo === 'down' ? 'text-red-600' : 
                        'text-gray-600';

  return (
    <div className={`border rounded-lg p-4 ${statusClasses[status]} ${className}`}>
      {/* Header com ícone */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{titulo}</p>
          {subtitulo && <p className="text-xs text-gray-500 mt-1">{subtitulo}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      {/* Valor */}
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${statusTextClasses[status]}`}>
          {valor}
        </span>
        {unidade && <span className="text-sm text-gray-600">{unidade}</span>}
      </div>

      {/* Variação */}
      {variacao && (
        <div className={`mt-2 text-xs font-medium ${variationColor}`}>
          {variacao.tipo === 'up' ? '↑' : variacao.tipo === 'down' ? '↓' : '→'} 
          {variacao.percentual}%
        </div>
      )}
    </div>
  );
};
