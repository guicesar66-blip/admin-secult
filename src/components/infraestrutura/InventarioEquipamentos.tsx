import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, ArrowUpDown } from "lucide-react";
import {
  equipamentosMock,
  tiposEquipamento,
  iconesTipoEquipamento,
  municipiosAcessoMock,
} from "@/data/mockEquipamentosCulturais";

type SortKey = "municipio" | "tipo" | "nome" | "capacidade" | "gestao" | "status";
type SortDir = "asc" | "desc";

interface InventarioEquipamentosProps {
  filtroCritico?: boolean;
  filtroMunicipio: string;
  onFiltroMunicipioChange: (value: string) => void;
  filtroTipo: string;
  onFiltroTipoChange: (value: string) => void;
}

export function InventarioEquipamentos({
  filtroCritico = false,
  filtroMunicipio,
  onFiltroMunicipioChange,
  filtroTipo,
  onFiltroTipoChange,
}: InventarioEquipamentosProps) {
  const [busca, setBusca] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("municipio");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const equipamentosCriticosNomes = useMemo(
    () => new Set(
      municipiosAcessoMock
        .filter((m) => m.tempoMedio > 120)
        .map((m) => m.equipamentoProximo)
    ),
    []
  );

  const municipios = useMemo(
    () => [...new Set(equipamentosMock.map((e) => e.municipio))].sort(),
    []
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const dados = useMemo(() => {
    let resultado = [...equipamentosMock];

    if (filtroCritico) {
      resultado = resultado.filter((e) => equipamentosCriticosNomes.has(e.nome));
    }

    if (busca) {
      const q = busca.toLowerCase();
      resultado = resultado.filter(
        (e) =>
          e.nome.toLowerCase().includes(q) ||
          e.municipio.toLowerCase().includes(q)
      );
    }
    if (filtroMunicipio !== "todos") {
      resultado = resultado.filter((e) => e.municipio === filtroMunicipio);
    }
    if (filtroTipo !== "todos") {
      resultado = resultado.filter((e) => e.tipo === filtroTipo);
    }

    resultado.sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      const cmp = typeof valA === "number" && typeof valB === "number"
        ? valA - valB
        : String(valA).localeCompare(String(valB), "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });

    return resultado;
  }, [busca, filtroMunicipio, filtroTipo, sortKey, sortDir, filtroCritico, equipamentosCriticosNomes]);

  const SortableHeader = ({ label, colKey }: { label: string; colKey: SortKey }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => toggleSort(colKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 flex-wrap">
            Inventário de Espaços Culturais
            {filtroCritico && (
              <Badge variant="destructive" className="text-[10px]">
                Filtro crítico ativo
              </Badge>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => alert("Exportação CSV em desenvolvimento")}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou município..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <Select value={filtroMunicipio} onValueChange={onFiltroMunicipioChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Município" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos municípios</SelectItem>
              {municipios.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filtroTipo} onValueChange={onFiltroTipoChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos tipos</SelectItem>
              {tiposEquipamento.map((t) => (
                <SelectItem key={t} value={t}>
                  {iconesTipoEquipamento[t]} {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader label="Município" colKey="municipio" />
                <SortableHeader label="Tipo" colKey="tipo" />
                <SortableHeader label="Nome" colKey="nome" />
                <SortableHeader label="Capacidade" colKey="capacidade" />
                <SortableHeader label="Gestão" colKey="gestao" />
                <SortableHeader label="Status" colKey="status" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum espaço cultural encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                dados.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-medium text-sm">{eq.municipio}</TableCell>
                    <TableCell className="text-sm">
                      <span className="mr-1">{iconesTipoEquipamento[eq.tipo]}</span>
                      {eq.tipo}
                    </TableCell>
                    <TableCell className="text-sm">{eq.nome}</TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {eq.capacidade ? eq.capacidade : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {eq.gestao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={eq.status === "Ativo" ? "default" : "destructive"}
                        className="text-[10px]"
                      >
                        {eq.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {dados.length} espaço{dados.length !== 1 ? "s" : ""} cultural{dados.length !== 1 ? "is" : ""} encontrado{dados.length !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  );
}
