import { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronDown, ChevronRight, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { municipiosPE, getRegioesUnicas, getMunicipiosByRegiao } from "@/data/mockMunicipios";
import { cn } from "@/lib/utils";

interface FiltroCidadeMultiSelectProps {
  selectedCidades: string[];
  onSelectedCidadesChange: (cidades: string[]) => void;
}

export function FiltroCidadeMultiSelect({
  selectedCidades,
  onSelectedCidadesChange,
}: FiltroCidadeMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedRegioes, setExpandedRegioes] = useState<Set<string>>(new Set());
  const [expandedCidades, setExpandedCidades] = useState<Set<string>>(new Set());
  const regioes = useMemo(() => getRegioesUnicas(), []);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearch("");
    }
  }, [open]);

  const filteredByRegiao = useMemo(() => {
    const searchLower = search.toLowerCase();
    return regioes.map((regiao) => {
      const municipios = getMunicipiosByRegiao(regiao).filter((m) =>
        searchLower ? m.nome.toLowerCase().includes(searchLower) : true
      );
      return { regiao, municipios };
    }).filter((r) => r.municipios.length > 0);
  }, [regioes, search]);

  const toggleCidade = (nome: string) => {
    if (selectedCidades.includes(nome)) {
      onSelectedCidadesChange(selectedCidades.filter((c) => c !== nome));
    } else {
      onSelectedCidadesChange([...selectedCidades, nome]);
    }
  };

  const toggleRegiao = (regiao: string) => {
    const municipiosRegiao = getMunicipiosByRegiao(regiao).map((m) => m.nome);
    const allSelected = municipiosRegiao.every((m) => selectedCidades.includes(m));
    if (allSelected) {
      onSelectedCidadesChange(selectedCidades.filter((c) => !municipiosRegiao.includes(c)));
    } else {
      const newSet = new Set([...selectedCidades, ...municipiosRegiao]);
      onSelectedCidadesChange([...newSet]);
    }
  };

  const toggleExpandRegiao = (regiao: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRegioes(prev => {
      const next = new Set(prev);
      if (next.has(regiao)) next.delete(regiao);
      else next.add(regiao);
      return next;
    });
  };

  const toggleExpand = (nome: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCidades(prev => {
      const next = new Set(prev);
      if (next.has(nome)) next.delete(nome);
      else next.add(nome);
      return next;
    });
  };

  const clearAll = () => onSelectedCidadesChange([]);

  const label =
    selectedCidades.length === 0
      ? "Todas cidades"
      : selectedCidades.length === 1
        ? selectedCidades[0]
        : `${selectedCidades.length} cidades`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] h-9 justify-between font-normal"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{label}</span>
          </div>
          <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        {/* Search */}
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Buscar município..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Selected badges */}
        {selectedCidades.length > 0 && (
          <div className="p-2 border-b border-border flex flex-wrap gap-1">
            {selectedCidades.slice(0, 5).map((c) => (
              <Badge
                key={c}
                variant="secondary"
                className="text-xs cursor-pointer gap-1"
                onClick={() => toggleCidade(c)}
              >
                {c}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            {selectedCidades.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{selectedCidades.length - 5}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs text-muted-foreground"
              onClick={clearAll}
            >
              Limpar
            </Button>
          </div>
        )}

        {/* List grouped by region */}
        <ScrollArea className="h-[280px]">
          <div className="p-1">
            {filteredByRegiao.map(({ regiao, municipios }) => {
              const municipiosRegiao = getMunicipiosByRegiao(regiao).map((m) => m.nome);
              const allSelected = municipiosRegiao.every((m) => selectedCidades.includes(m));
              const someSelected = municipiosRegiao.some((m) => selectedCidades.includes(m));

              return (
                <div key={regiao} className="mb-1">
                  {/* Region header */}
                  <button
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm",
                      "text-muted-foreground hover:bg-accent/50 transition-colors"
                    )}
                    onClick={() => toggleRegiao(regiao)}
                  >
                    <div
                      className={cn(
                        "h-3.5 w-3.5 rounded-sm border flex items-center justify-center shrink-0",
                        allSelected
                          ? "bg-primary border-primary"
                          : someSelected
                            ? "bg-primary/30 border-primary"
                            : "border-muted-foreground/30"
                      )}
                    >
                      {(allSelected || someSelected) && (
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      )}
                    </div>
                    {regiao}
                  </button>

                  {/* Municipalities */}
                  {municipios.map((m) => {
                    const isSelected = selectedCidades.includes(m.nome);
                    const isExpanded = expandedCidades.has(m.nome);
                    const hasDistritos = m.distritos.length > 0;

                    return (
                      <div key={m.codigo}>
                        <button
                          className={cn(
                            "w-full flex items-center gap-2 px-2 pl-6 py-1.5 text-sm rounded-sm",
                            "hover:bg-accent transition-colors",
                            isSelected && "bg-accent/50"
                          )}
                          onClick={() => toggleCidade(m.nome)}
                        >
                          <div
                            className={cn(
                              "h-3.5 w-3.5 rounded-sm border flex items-center justify-center shrink-0",
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {isSelected && (
                              <Check className="h-2.5 w-2.5 text-primary-foreground" />
                            )}
                          </div>
                          <span className="truncate">{m.nome}</span>
                          {hasDistritos && (
                            <span
                              role="button"
                              className="ml-auto flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
                              onClick={(e) => toggleExpand(m.nome, e)}
                            >
                              <span className="text-[10px]">{m.distritos.length}d</span>
                              <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
                            </span>
                          )}
                        </button>

                        {/* Distritos (bairros) */}
                        {isExpanded && hasDistritos && (
                          <div className="pl-10 pr-2 pb-1">
                            {m.distritos.map((distrito) => (
                              <div
                                key={distrito.codigo}
                                className="text-xs text-muted-foreground py-0.5 px-2 rounded-sm hover:bg-accent/30 transition-colors"
                              >
                                {distrito.nome}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {filteredByRegiao.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum município encontrado
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}