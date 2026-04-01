import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Download, ArrowUpDown, X } from "lucide-react";
import { produtorasMock, type Produtora } from "@/data/mockProdutoras";
import { getArtistasByProdutora } from "@/data/mockArtistas";
import { getSubtipoIdsByTipoNome } from "@/data/mockLinguagens";
import { toast } from "sonner";

interface TabelaProdutorasProps {
  filtroPeriodo: string;
  filtroLinguagem: string;
}

type SortKey = "nome" | "municipio" | "artistas" | "tempo" | "scoreReputacao";
type SortDir = "asc" | "desc";

const linguagens = [...new Set(produtorasMock.map((p) => p.linguagem_principal))];
const municipios = [...new Set(produtorasMock.map((p) => p.municipio))];

export function TabelaColetivos({ filtroPeriodo, filtroLinguagem }: TabelaProdutorasProps) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroLinguagemLocal, setFiltroLinguagemLocal] = useState("todos");
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
    let result = produtorasMock.map((p) => ({
      ...p,
      _artistas: getArtistasByProdutora(p.id),
      _tempo: Math.max(0, new Date().getFullYear() - new Date(p.data_fundacao).getFullYear()),
    }));

    // Global language filter
    if (filtroLinguagem !== "todas") {
      result = result.filter((p) =>
        p.linguagem_principal.toLowerCase().includes(filtroLinguagem.toLowerCase()) ||
        p._artistas.some((a) => {
          const subIds = getSubtipoIdsByTipoNome(filtroLinguagem);
          return a.subtipo_ids.some((sid: string) => subIds.includes(sid));
        })
      );
    }

    if (busca) {
      const q = busca.toLowerCase();
      result = result.filter((p) => p.nome.toLowerCase().includes(q) || p.municipio.toLowerCase().includes(q));
    }
    if (filtroLinguagemLocal !== "todos") result = result.filter((p) => p.linguagem_principal === filtroLinguagemLocal);
    if (filtroMunicipio !== "todos") result = result.filter((p) => p.municipio === filtroMunicipio);
    if (filtroStatus !== "todos") result = result.filter((p) => p.status === filtroStatus);
    if (filtroIVC !== "todos") result = result.filter((p) => p.ivc === filtroIVC);
    if (filtroCNPJ === "com") result = result.filter((p) => p.cnpj);
    if (filtroCNPJ === "sem") result = result.filter((p) => !p.cnpj);

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "nome": cmp = a.nome.localeCompare(b.nome); break;
        case "municipio": cmp = a.municipio.localeCompare(b.municipio); break;
        case "artistas": cmp = a._artistas.length - b._artistas.length; break;
        case "tempo": cmp = a._tempo - b._tempo; break;
        case "scoreReputacao": cmp = a.score_reputacao - b.score_reputacao; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [busca, filtroLinguagemLocal, filtroMunicipio, filtroStatus, filtroIVC, filtroCNPJ, filtroLinguagem, sortKey, sortDir]);

  const SortableHeader = ({ label, keyName }: { label: string; keyName: SortKey }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(keyName)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  const hasFilters = busca || filtroLinguagemLocal !== "todos" || filtroMunicipio !== "todos" || filtroStatus !== "todos" || filtroIVC !== "todos" || filtroCNPJ !== "todos";

  const clearFilters = () => {
    setBusca("");
    setFiltroLinguagemLocal("todos");
    setFiltroMunicipio("todos");
    setFiltroStatus("todos");
    setFiltroIVC("todos");
    setFiltroCNPJ("todos");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou município..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9" />
            </div>
            <Select value={filtroLinguagemLocal} onValueChange={setFiltroLinguagemLocal}>
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
                  
                  <SortableHeader label="Município" keyName="municipio" />
                  <SortableHeader label="Artistas" keyName="artistas" />
                  <SortableHeader label="Tempo" keyName="tempo" />
                  <TableHead>Status</TableHead>
                  <SortableHeader label="Score" keyName="scoreReputacao" />
                  <TableHead>CNPJ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/dados/produtora/${p.id}`)}
                  >
                    <TableCell>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {p.nome.charAt(0)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    
                    <TableCell>{p.municipio}</TableCell>
                    <TableCell className="tabular-nums">{p._artistas.length}</TableCell>
                    <TableCell className="tabular-nums">{p._tempo} anos</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "ativo" ? "default" : "secondary"} className="text-xs">
                        {p.status === "ativo" ? "✅ Ativo" : "⚠️ Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={p.score_reputacao} className="h-2 w-16" />
                        <span className="text-xs tabular-nums">{p.score_reputacao}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.cnpj || "—"}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      Nenhuma produtora encontrada com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Rodapé */}
          <p className="text-sm text-muted-foreground mt-3">
            {filtered.length} produtora{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
