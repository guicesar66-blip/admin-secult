import React from 'react';
import { ChevronDown } from 'lucide-react';

interface BlocoSocioeconômicoProps {
  titulo: string;
  descricao?: string;
  grafico: React.ReactNode;
  cardResumo?: React.ReactNode;
  expandido?: boolean;
  onToggleExpandir?: () => void;
  className?: string;
}

export const BlocoSocioeconômico: React.FC<BlocoSocioeconômicoProps> = ({
  titulo,
  descricao,
  grafico,
  cardResumo,
  expandido = true,
  onToggleExpandir,
  className = '',
}) => {
  return (
    <div className={`border border-border rounded-lg p-4 bg-card ${className}`}>
      {/* Header com toggle */}
      <button
        onClick={onToggleExpandir}
        className="w-full flex items-start justify-between hover:bg-neutral-50 p-2 -m-2 rounded transition-colors"
      >
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-foreground">{titulo}</h3>
          {descricao && <p className="text-sm text-muted-foreground mt-1">{descricao}</p>}
        </div>
        {onToggleExpandir && (
          <ChevronDown
            className={`w-5 h-5 text-neutral-400 transition-transform ${expandido ? 'rotate-0' : '-rotate-90'}`}
          />
        )}
      </button>

      {/* Conteúdo */}
      {expandido && (
        <div className="mt-4">
          {/* Card resumido (opcional) */}
          {cardResumo && (
            <div className="mb-4 pb-4 border-b border-neutral-100">
              {cardResumo}
            </div>
          )}

          {/* Gráfico principal */}
          <div className="w-full h-full">
            {grafico}
          </div>
        </div>
      )}
    </div>
  );
};
