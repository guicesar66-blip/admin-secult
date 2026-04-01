import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginacaoTabelaProps {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  onPaginaChange: (pagina: number) => void;
  labelItens?: string;
}

export function PaginacaoTabela({ paginaAtual, totalPaginas, totalItens, onPaginaChange, labelItens = "itens" }: PaginacaoTabelaProps) {
  if (totalPaginas <= 1) return null;

  const paginas: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPaginas; i++) {
    if (i === 1 || i === totalPaginas || (i >= paginaAtual - 1 && i <= paginaAtual + 1)) {
      paginas.push(i);
    } else if (paginas[paginas.length - 1] !== "ellipsis") {
      paginas.push("ellipsis");
    }
  }

  return (
    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
      <p className="text-xs text-muted-foreground">
        Página {paginaAtual} de {totalPaginas} · {totalItens} {labelItens}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => paginaAtual > 1 && onPaginaChange(paginaAtual - 1)}
              className={paginaAtual <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {paginas.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === paginaAtual} onClick={() => onPaginaChange(p)} className="cursor-pointer">
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => paginaAtual < totalPaginas && onPaginaChange(paginaAtual + 1)}
              className={paginaAtual >= totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
