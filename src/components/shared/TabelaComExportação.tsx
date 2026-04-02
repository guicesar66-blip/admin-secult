import React from 'react';
import { Download, Search } from 'lucide-react';

interface TabelaComExportaçãoProps {
  titulo?: string;
  dados: any[];
  colunas: Array<{
    key: string;
    titulo: string;
    largura?: string;
    renderizador?: (valor: any, linha: any) => React.ReactNode;
  }>;
  busca?: {
    ativo: boolean;
    placeholder?: string;
    onMudar: (valor: string) => void;
  };
  paginacao?: {
    paginaAtual: number;
    itensPorPagina: number;
    onMudarPagina: (pagina: number) => void;
  };
  filtros?: React.ReactNode;
  onExportar?: () => void;
  onCliqueLinha?: (linha: any) => void;
  mostrarPaginacao?: boolean;
  carregando?: boolean;
  vazio?: boolean;
  mensagemVazia?: string;
  className?: string;
}

export const TabelaComExportação: React.FC<TabelaComExportaçãoProps> = ({
  titulo,
  dados,
  colunas,
  busca,
  paginacao,
  filtros,
  onExportar,
  onCliqueLinha,
  mostrarPaginacao = true,
  carregando = false,
  vazio = false,
  mensagemVazia = 'Nenhum dado encontrado',
  className = '',
}) => {
  // Calcular dados da página atual
  const itensPorPagina = paginacao?.itensPorPagina || 10;
  const paginaAtual = paginacao?.paginaAtual || 1;
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const dadosPagina = dados.slice(inicio, inicio + itensPorPagina);
  const totalPaginas = Math.ceil(dados.length / itensPorPagina);

  return (
    <div className={`border border-gray-200 rounded-lg bg-white ${className}`}>
      {/* Header */}
      {(titulo || onExportar || busca) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            {titulo && <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>}
            {onExportar && (
              <button
                onClick={onExportar}
                className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            )}
          </div>

          {busca?.ativo && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={busca.placeholder}
                onChange={(e) => busca.onMudar(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {filtros && <div className="mt-3">{filtros}</div>}
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {colunas.map((coluna) => (
                <th
                  key={coluna.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    coluna.largura || 'w-auto'
                  }`}
                >
                  {coluna.titulo}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={colunas.length} className="px-4 py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                </td>
              </tr>
            ) : vazio || dados.length === 0 ? (
              <tr>
                <td colSpan={colunas.length} className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-600">{mensagemVazia}</p>
                </td>
              </tr>
            ) : (
              dadosPagina.map((linha, idx) => (
                <tr
                  key={idx}
                  onClick={() => onCliqueLinha?.(linha)}
                  className={`border-b border-gray-200 ${
                    onCliqueLinha ? 'hover:bg-gray-50 cursor-pointer' : ''
                  } transition-colors`}
                >
                  {colunas.map((coluna) => (
                    <td key={coluna.key} className="px-4 py-3 text-sm text-gray-900">
                      {coluna.renderizador
                        ? coluna.renderizador(linha[coluna.key], linha)
                        : linha[coluna.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {mostrarPaginacao && totalPaginas > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {dados.length} resultado(s) encontrado(s)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => paginacao?.onMudarPagina(Math.max(1, paginaAtual - 1))}
              disabled={paginaAtual === 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Anterior
            </button>

            <div className="text-sm text-gray-600">
              Página {paginaAtual} de {totalPaginas}
            </div>

            <button
              onClick={() => paginacao?.onMudarPagina(Math.min(totalPaginas, paginaAtual + 1))}
              disabled={paginaAtual === totalPaginas}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
