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
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    orange: 'border-orange-200 bg-orange-50',
    red: 'border-red-200 bg-red-50',
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
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${corClasses[cor]} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{titulo}</h3>
        {icon && <div className="text-gray-500">{icon}</div>}
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
        <div className="mb-2 pb-2 border-b border-gray-200 border-opacity-50">
          <div className="flex items-center gap-2">
            {getTrendIcon(variacao.tendencia)}
            <span className={`text-sm font-medium ${
              variacao.tendencia === 'up' ? 'text-green-600' : 
              variacao.tendencia === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {variacao.tendencia === 'up' ? '+' : variacao.tendencia === 'down' ? '-' : ''}
              {Math.abs(variacao.percentual)}% vs. período anterior
            </span>
          </div>
          <span className="text-xs text-gray-600">Anterior: {variacao.anterior}</span>
        </div>
      )}

      {/* Referência */}
      {referencia && (
        <div className="text-xs">
          <span className="text-gray-600">{referencia.label}: </span>
          <span className={`font-semibold ${
            referencia.indicador === 'acima' ? 'text-green-600' :
            referencia.indicador === 'abaixo' ? 'text-orange-600' :
            'text-gray-600'
          }`}>
            {referencia.valor}
            {referencia.indicador && ` (${referencia.indicador} da média)`}
          </span>
        </div>
      )}
    </div>
  );
};
