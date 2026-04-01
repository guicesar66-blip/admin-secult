import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Download, Search, ArrowUpDown, X } from "lucide-react";
import {
  equipamentosMock, tiposEquipamento, iconesTipoEquipamento, conservacaoCores,
} from "@/data/mockEquipamentosCulturais";

type SortKey = "municipio" | "tipo" | "nome" | "capacidade" | "gestao" | "status" | "conservacao" | "nivelAcessibilidade";
type SortDir = "asc" | "desc";

interface InventarioEquipamentosProps {
  filtroMunicipio: string;
  onFiltroMunicipioChange: (value: string) => void;
  filtroTipo: string;
  onFiltroTipoChange: (value: string) => void;
  filtroConservacao: string;
  onFiltroConservacaoChange: (value: string) => void;
  filtroAcessibilidade: string;
  onFiltroAcessibilidadeChange: (value: string) => void;
  busca: string;
  onBuscaChange: (value: string) => void;
}

export function InventarioEquipamentos({
  filtroMunicipio, onFiltroMunicipioChange,
  filtroTipo, onFiltroTipoChange,
  filtroConservacao, onFiltroConservacaoChange,
  filtroAcessibilidade, onFiltroAcessibilidadeChange,
  busca, onBuscaChange,
}: InventarioEquipamentosProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>("municipio");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const municipios = useMemo(() => [...new Set(equipamentosMock.map(e => e.municipio))].sort(), []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const hasCriticalFilter = filtroConservacao === "Precário" || filtroAcessibilidade === "Não acessível";

  const dados = useMemo(() => {
    let resultado = [...equipamentosMock];
    if (busca) {
      const q = busca.toLowerCase();
      resultado = resultado.filter(e => e.nome.toLowerCase().includes(q) || e.municipio.toLowerCase().includes(q));
    }
    if (filtroMunicipio !== "todos") resultado = resultado.filter(e => e.municipio === filtroMunicipio);
    if (filtroTipo !== "todos") resultado = resultado.filter(e => e.tipo === filtroTipo);
    if (filtroConservacao !== "todos") resultado = resultado.filter(e => e.conservacao === filtroConservacao);
    if (filtroAcessibilidade !== "todos") resultado = resultado.filter(e => e.nivelAcessibilidade === filtroAcessibilidade);

    resultado.sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      const cmp = typeof valA === "number" && typeof valB === "number" ? valA - valB : String(valA).localeCompare(String(valB), "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return resultado;
  }, [busca, filtroMunicipio, filtroTipo, filtroConservacao, filtroAcessibilidade, sortKey, sortDir]);

  const handleExportCSV = () => {
    const headers = ["Município", "Tipo", "Nome", "Capacidade", "Acessibilidade PCD", "Conservação", "Gestão", "Status"];
    const rows = dados.map(e => [e.municipio, e.tipo, e.nome, e.capacidade ?? "", e.nivelAcessibilidade, e.conservacao, e.gestao, e.status]);
    const csv = [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "inventario_espacos_culturais.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const SortableHeader = ({ label, colKey }: { label: string; colKey: SortKey }) => (
    <TableHead className="cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => toggleSort(colKey)}>
      <div className="flex items-center gap-1">{label}<ArrowUpDown className="h-3 w-3 text-muted-foreground" /></div>
    </TableHead>
  );

  const acessBadgeVariant = (n: string) => n === "Total" ? "default" as const : n === "Parcial" ? "secondary" as const : "destructive" as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 flex-wrap">
            Inventário de Espaços Culturais
            {hasCriticalFilter && <Badge variant="destructive" className="text-[10px]">Filtro crítico ativo</Badge>}
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou município..." value={busca} onChange={e => onBuscaChange(e.target.value)} className="pl-8 pr-8 h-9" />
            {busca && <button type="button" onClick={() => onBuscaChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
          </div>
          <Select value={filtroMunicipio} onValueChange={onFiltroMunicipioChange}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Município" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos municípios</SelectItem>
              {municipios.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroTipo} onValueChange={onFiltroTipoChange}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos tipos</SelectItem>
              {tiposEquipamento.map(t => <SelectItem key={t} value={t}>{iconesTipoEquipamento[t]} {t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroConservacao} onValueChange={onFiltroConservacaoChange}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Conservação" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas conserv.</SelectItem>
              {["Excelente", "Bom", "Regular", "Precário"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroAcessibilidade} onValueChange={onFiltroAcessibilidadeChange}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Acessibilidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas acess.</SelectItem>
              <SelectItem value="Total">Total</SelectItem>
              <SelectItem value="Parcial">Parcial</SelectItem>
              <SelectItem value="Não acessível">Não acessível</SelectItem>
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
                <SortableHeader label="Acessibilidade PCD" colKey="nivelAcessibilidade" />
                <SortableHeader label="Conservação" colKey="conservacao" />
                <SortableHeader label="Gestão" colKey="gestao" />
                <SortableHeader label="Status" colKey="status" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhum espaço cultural encontrado.</TableCell></TableRow>
              ) : dados.map(eq => (
                <TableRow key={eq.id} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/dados/espaco/${eq.id}`)}>
                  <TableCell className="font-medium text-sm">{eq.municipio}</TableCell>
                  <TableCell className="text-sm"><span className="mr-1">{iconesTipoEquipamento[eq.tipo]}</span>{eq.tipo}</TableCell>
                  <TableCell className="text-sm">{eq.nome}</TableCell>
                  <TableCell className="text-sm tabular-nums">{eq.capacidade ?? "—"}</TableCell>
                  <TableCell><Badge variant={acessBadgeVariant(eq.nivelAcessibilidade)} className="text-[10px]">{eq.nivelAcessibilidade}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]" style={{ borderColor: conservacaoCores[eq.conservacao], color: conservacaoCores[eq.conservacao] }}>{eq.conservacao}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{eq.gestao}</Badge></TableCell>
                  <TableCell><Badge variant={eq.status === "Ativo" ? "default" : "destructive"} className="text-[10px]">{eq.status}</Badge></TableCell>
                </TableRow>
              ))}
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
