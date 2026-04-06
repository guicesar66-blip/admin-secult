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
    normal: 'border-border bg-card',
    alerta: 'border-warning/30 bg-pe-orange-lighter',
    crítico: 'border-error/30 bg-pe-red-lighter',
  };

  const statusTextClasses = {
    normal: 'text-foreground',
    alerta: 'text-orange-900',
    crítico: 'text-pe-red-dark',
  };

  const variationColor = variacao?.tipo === 'up' ? 'text-success' : 
                        variacao?.tipo === 'down' ? 'text-error' : 
                        'text-muted-foreground';

  return (
    <div className={`border rounded-lg p-4 ${statusClasses[status]} ${className}`}>
      {/* Header com ícone */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{titulo}</p>
          {subtitulo && <p className="text-xs text-muted-foreground mt-1">{subtitulo}</p>}
        </div>
        {icon && <div className="text-neutral-400">{icon}</div>}
      </div>

      {/* Valor */}
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${statusTextClasses[status]}`}>
          {valor}
        </span>
        {unidade && <span className="text-sm text-muted-foreground">{unidade}</span>}
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
