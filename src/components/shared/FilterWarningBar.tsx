import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface FilterWarningBarProps {
  filtros: string[];
  onLimpar: () => void;
  mostrar?: boolean;
  className?: string;
}

export const FilterWarningBar: React.FC<FilterWarningBarProps> = ({
  filtros,
  onLimpar,
  mostrar = true,
  className = '',
}) => {
  if (!mostrar || filtros.length === 0) {
    return null;
  }

  return (
    <div className={`bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
        <p className="text-sm text-pe-dark">
          Dados filtrados por: <strong>{filtros.join(', ')}</strong>. Os gráficos refletem apenas o contexto selecionado.
        </p>
      </div>
      <button
        onClick={onLimpar}
        className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-pe-blue-dark hover:bg-neutral-100 rounded transition-colors"
      >
        <X className="w-4 h-4" />
        Limpar filtros
      </button>
    </div>
  );
};
