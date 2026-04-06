import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CardComparaçãoProps {
  titulo: string;
  valor: string | number;
  unidade?: string;
  variacao?: {
    percentual: number;
    anterior: string | number;
    tendencia: 'up' | 'down' | 'stable';
  };
  referencia?: {
    label: string;
    valor: string | number;
    indicador?: string; // ex: "acima", "abaixo", "igual"
  };
  cor?: 'blue' | 'green' | 'orange' | 'red';
  icon?: React.ReactNode;
  className?: string;
}

export const CardComparação: React.FC<CardComparaçãoProps> = ({
  titulo,
  valor,
  unidade,
  variacao,
  referencia,
  cor = 'blue',
  icon,
  className = '',
}) => {
  const corClasses = {
    blue: 'border-neutral-200 bg-neutral-50',
    green: 'border-success/30 bg-pe-green-lighter',
    orange: 'border-orange-200 bg-pe-orange-lighter',
    red: 'border-error/30 bg-pe-red-lighter',
  };

  const textCorClasses = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    orange: 'text-orange-900',
    red: 'text-red-900',
  };

  const getTrendIcon = (tendencia: 'up' | 'down' | 'stable') => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${corClasses[cor]} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-700">{titulo}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      {/* Valor Principal */}
      <div className="mb-3">
        <div className={`text-3xl font-bold ${textCorClasses[cor]}`}>
          {valor}
          {unidade && <span className="text-lg ml-1">{unidade}</span>}
        </div>
      </div>

      {/* Variação */}
      {variacao && (
        <div className="mb-2 pb-2 border-b border-border border-opacity-50">
          <div className="flex items-center gap-2">
            {getTrendIcon(variacao.tendencia)}
            <span className={`text-sm font-medium ${
              variacao.tendencia === 'up' ? 'text-success' : 
              variacao.tendencia === 'down' ? 'text-error' : 
              'text-muted-foreground'
            }`}>
              {variacao.tendencia === 'up' ? '+' : variacao.tendencia === 'down' ? '-' : ''}
              {Math.abs(variacao.percentual)}% vs. período anterior
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Anterior: {variacao.anterior}</span>
        </div>
      )}

      {/* Referência */}
      {referencia && (
        <div className="text-xs">
          <span className="text-muted-foreground">{referencia.label}: </span>
          <span className={`font-semibold ${
            referencia.indicador === 'acima' ? 'text-success' :
            referencia.indicador === 'abaixo' ? 'text-warning' :
            'text-muted-foreground'
          }`}>
            {referencia.valor}
            {referencia.indicador && ` (${referencia.indicador} da média)`}
          </span>
        </div>
      )}
    </div>
  );
};
