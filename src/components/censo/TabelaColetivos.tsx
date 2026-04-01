import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Download, ArrowUpDown, X } from "lucide-react";
import { coletivosMock, type Coletivo } from "@/data/mockColetivos";
import { toast } from "sonner";

interface TabelaColetivosProps {
  filtroPeriodo: string;
}

type SortKey = "nome" | "municipio" | "membros" | "tempoExistencia" | "scoreReputacao";
type SortDir = "asc" | "desc";

const linguagens = [...new Set(coletivosMock.map((c) => c.linguagem))];
const municipios = [...new Set(coletivosMock.map((c) => c.municipio))];

export function TabelaColetivos({ filtroPeriodo }: TabelaColetivosProps) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroLinguagem, setFiltroLinguagem] = useState("todos");
  const [filtroMunicipio, setFiltroMunicipio] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroIVC, setFiltroIVC] = useState("todos");
  const [filtroCNPJ, setFiltroCNPJ] = useState("todos");
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = coletivosMock;

    if (busca) {
      const q = busca.toLowerCase();
      result = result.filter((c) => c.nome.toLowerCase().includes(q) || c.municipio.toLowerCase().includes(q));
    }
    if (filtroLinguagem !== "todos") result = result.filter((c) => c.linguagem === filtroLinguagem);
    if (filtroMunicipio !== "todos") result = result.filter((c) => c.municipio === filtroMunicipio);
    if (filtroStatus !== "todos") result = result.filter((c) => c.status === filtroStatus);
    if (filtroIVC !== "todos") result = result.filter((c) => c.ivc === filtroIVC);
    if (filtroCNPJ === "com") result = result.filter((c) => c.cnpj !== null);
    if (filtroCNPJ === "sem") result = result.filter((c) => c.cnpj === null);

    result = [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [busca, filtroLinguagem, filtroMunicipio, filtroStatus, filtroIVC, filtroCNPJ, sortKey, sortDir]);

  const SortableHeader = ({ label, keyName }: { label: string; keyName: SortKey }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(keyName)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  const hasFilters = busca || filtroLinguagem !== "todos" || filtroMunicipio !== "todos" || filtroStatus !== "todos" || filtroIVC !== "todos" || filtroCNPJ !== "todos";

  const clearFilters = () => {
    setBusca("");
    setFiltroLinguagem("todos");
    setFiltroMunicipio("todos");
    setFiltroStatus("todos");
    setFiltroIVC("todos");
    setFiltroCNPJ("todos");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Coletivos Cadastrados</h3>

      <Card>
        <CardContent className="pt-6">
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou município..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
            </div>
            <Select value={filtroLinguagem} onValueChange={setFiltroLinguagem}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Linguagem" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas linguagens</SelectItem>
                {linguagens.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtroMunicipio} onValueChange={setFiltroMunicipio}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Município" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos municípios</SelectItem>
                {municipios.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroIVC} onValueChange={setFiltroIVC}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="IVC" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todo IVC</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroCNPJ} onValueChange={setFiltroCNPJ}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="CNPJ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">CNPJ: Todos</SelectItem>
                <SelectItem value="com">Com CNPJ</SelectItem>
                <SelectItem value="sem">Sem CNPJ</SelectItem>
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-3 w-3" /> Limpar
              </Button>
            )}

            <Button variant="outline" size="sm" className="ml-auto gap-1" onClick={() => toast.info("Exportação CSV disponível em breve")}>
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
          </div>

          {/* Tabela */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]" />
                  <SortableHeader label="Nome" keyName="nome" />
                  <TableHead>Linguagem</TableHead>
                  <SortableHeader label="Município" keyName="municipio" />
                  <SortableHeader label="Membros" keyName="membros" />
                  <SortableHeader label="Tempo" keyName="tempoExistencia" />
                  <TableHead>Status</TableHead>
                  <SortableHeader label="Score" keyName="scoreReputacao" />
                  <TableHead>CNPJ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/dados/coletivo/${c.id}`)}
                  >
                    <TableCell>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {c.nome.charAt(0)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{c.linguagem}</Badge></TableCell>
                    <TableCell>{c.municipio}</TableCell>
                    <TableCell className="tabular-nums">{c.membros}</TableCell>
                    <TableCell className="tabular-nums">{c.tempoExistencia} anos</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "ativo" ? "default" : "secondary"} className="text-xs">
                        {c.status === "ativo" ? "✅ Ativo" : "⚠️ Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={c.scoreReputacao} className="h-2 w-16" />
                        <span className="text-xs tabular-nums">{c.scoreReputacao}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.cnpj || "—"}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      Nenhum coletivo encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Rodapé */}
          <p className="text-sm text-muted-foreground mt-3">
            {filtered.length} coletivo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
