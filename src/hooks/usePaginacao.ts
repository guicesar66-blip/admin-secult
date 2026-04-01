import { useState, useMemo } from "react";

const ITENS_POR_PAGINA = 6;

export function usePaginacao<T>(dados: T[]) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(dados.length / ITENS_POR_PAGINA));
  const paginaSegura = Math.min(paginaAtual, totalPaginas);

  const dadosPaginados = useMemo(() => {
    const inicio = (paginaSegura - 1) * ITENS_POR_PAGINA;
    return dados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [dados, paginaSegura]);

  // Reset to page 1 when data changes significantly
  useMemo(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(1);
  }, [dados.length]);

  return {
    dadosPaginados,
    paginaAtual: paginaSegura,
    totalPaginas,
    totalItens: dados.length,
    setPaginaAtual,
    temAnterior: paginaSegura > 1,
    temProxima: paginaSegura < totalPaginas,
    irParaAnterior: () => setPaginaAtual(p => Math.max(1, p - 1)),
    irParaProxima: () => setPaginaAtual(p => Math.min(totalPaginas, p + 1)),
  };
}
