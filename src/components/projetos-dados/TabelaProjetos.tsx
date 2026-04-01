import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, Search, ArrowUpDown, X, Filter, ChevronDown } from "lucide-react";
import { usePaginacao } from "@/hooks/usePaginacao";
import { PaginacaoTabela } from "@/components/PaginacaoTabela";
import {
  projetosMock, instrumentos, fases, statusLabels, statusCores,
  type StatusProjeto, type FaseProjeto, type InstrumentoFomento,
} from "@/data/mockProjetos";
import { linguagensArtisticas } from "@/data/mockCensoAuxiliar";

type SortKey = "nome" | "proponenteNome" | "linguagem" | "instrumento" | "municipio" | "fase" | "status" | "publicoImpactado" | "valorCaptado" | "scoreConformidade";
type SortDir = "asc" | "desc";

interface TabelaProjetosProps {
  filtroLinguagem?: string;
  filtroCidades?: string[];
}

export function TabelaProjetos({ filtroLinguagem: filtroLinguagemGlobal = "todas", filtroCidades: filtroCidadesGlobal = [] }: TabelaProjetosProps) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtroInstrumento, setFiltroInstrumento] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroLinguagem, setFiltroLinguagem] = useState("todas");
  const [filtroFase, setFiltroFase] = useState("todas");
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const municipios = useMemo(() => [...new Set(projetosMock.map(p => p.municipio))].sort(), []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const dados = useMemo(() => {
    let resultado = [...projetosMock];
    // Global filters
    if (filtroLinguagemGlobal !== "todas") resultado = resultado.filter(p => p.linguagem === filtroLinguagemGlobal);
    if (filtroCidadesGlobal.length > 0) resultado = resultado.filter(p => filtroCidadesGlobal.includes(p.municipio));
    // Local filters
    if (busca) {
      const q = busca.toLowerCase();
      resultado = resultado.filter(p => p.nome.toLowerCase().includes(q) || p.proponenteNome.toLowerCase().includes(q));
    }
    if (filtroInstrumento !== "todos") resultado = resultado.filter(p => p.instrumento === filtroInstrumento);
    if (filtroStatus !== "todos") resultado = resultado.filter(p => p.status === filtroStatus);
    if (filtroLinguagem !== "todas") resultado = resultado.filter(p => p.linguagem === filtroLinguagem);
    if (filtroFase !== "todas") resultado = resultado.filter(p => p.fase === filtroFase);

    resultado.sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";
      const cmp = typeof valA === "number" && typeof valB === "number" ? valA - valB : String(valA).localeCompare(String(valB), "pt-BR");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return resultado;
  }, [busca, filtroInstrumento, filtroStatus, filtroLinguagem, filtroFase, sortKey, sortDir, filtroLinguagemGlobal, filtroCidadesGlobal]);

  const { dadosPaginados, paginaAtual, totalPaginas, setPaginaAtual } = usePaginacao(dados);

  const handleExportCSV = () => {
    const headers = ["Nome", "Proponente", "Linguagem", "Instrumento", "Município", "Fase", "Status", "Público", "Valor (R$)", "Conformidade (%)"];
    const rows = dados.map(p => [p.nome, p.proponenteNome, p.linguagem, p.instrumento, p.municipio, fases.find(f => f.value === p.fase)?.label, statusLabels[p.status], p.publicoImpactado, p.valorCaptado, p.scoreConformidade]);
    const csv = [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "projetos_culturais.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(v);

  const SortableHeader = ({ label, colKey }: { label: string; colKey: SortKey }) => (
    <TableHead className="cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => toggleSort(colKey)}>
      <div className="flex items-center gap-1">{label}<ArrowUpDown className="h-3 w-3 text-muted-foreground" /></div>
    </TableHead>
  );

  const getConformidadeColor = (score: number) => {
    if (score >= 80) return "hsl(142, 71%, 45%)";
    if (score >= 50) return "hsl(45, 93%, 47%)";
    return "hsl(0, 84%, 60%)";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-base font-semibold">Projetos Culturais</CardTitle>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou proponente..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-8 pr-8 h-9" />
            {busca && <button onClick={() => setBusca("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
          </div>
          <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
            <Filter className="h-4 w-4" /> Filtros <ChevronDown className={`h-3 w-3 transition-transform ${filtrosAbertos ? "rotate-180" : ""}`} />
          </Button>
        </div>
        <Collapsible open={filtrosAbertos}>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border">
              <Select value={filtroInstrumento} onValueChange={setFiltroInstrumento}>
                <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Instrumento" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos instrum.</SelectItem>
                  {instrumentos.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos status</SelectItem>
                  {Object.entries(statusLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filtroLinguagem} onValueChange={setFiltroLinguagem}>
                <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Linguagem" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas linguagens</SelectItem>
                  {linguagensArtisticas.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filtroFase} onValueChange={setFiltroFase}>
                <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Fase" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas fases</SelectItem>
                  {fases.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader label="Nome" colKey="nome" />
                <SortableHeader label="Proponente" colKey="proponenteNome" />
                <SortableHeader label="Linguagem" colKey="linguagem" />
                <SortableHeader label="Instrumento" colKey="instrumento" />
                <SortableHeader label="Município" colKey="municipio" />
                <SortableHeader label="Fase" colKey="fase" />
                <SortableHeader label="Status" colKey="status" />
                <SortableHeader label="Público" colKey="publicoImpactado" />
                <SortableHeader label="Valor" colKey="valorCaptado" />
                <TableHead>Conformidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosPaginados.length === 0 ? (
                <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">Nenhum projeto encontrado.</TableCell></TableRow>
              ) : dadosPaginados.map(p => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-accent/50" onClick={() => navigate(`/dados/projeto/${p.id}`)}>
                  <TableCell className="font-medium text-sm">{p.nome}</TableCell>
                  <TableCell className="text-sm">{p.proponenteNome}</TableCell>
                  <TableCell className="text-sm">{p.linguagem}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{p.instrumento}</Badge></TableCell>
                  <TableCell className="text-sm">{p.municipio}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{fases.find(f => f.value === p.fase)?.label}</Badge></TableCell>
                  <TableCell><Badge className="text-[10px]" style={{ backgroundColor: statusCores[p.status], color: "#fff" }}>{statusLabels[p.status]}</Badge></TableCell>
                  <TableCell className="text-sm tabular-nums">{p.publicoImpactado.toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="text-sm tabular-nums">{formatCurrency(p.valorCaptado)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Progress value={p.scoreConformidade} className="h-2 flex-1" style={{ "--progress-foreground": getConformidadeColor(p.scoreConformidade) } as React.CSSProperties} />
                      <span className="text-xs font-medium tabular-nums" style={{ color: getConformidadeColor(p.scoreConformidade) }}>{p.scoreConformidade}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <PaginacaoTabela paginaAtual={paginaAtual} totalPaginas={totalPaginas} totalItens={dados.length} onPaginaChange={setPaginaAtual} labelItens="projetos" />
      </CardContent>
    </Card>
  );
}
