import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
  MapPin,
  ChevronDown,
  Film,
  Palette,
  Theater,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROJETOS_VITRINE_MOCK, type ProjetoStatus } from "@/data/mockVitrine";

const PROJETO_STATUS_CONFIG: Record<ProjetoStatus, { label: string; color: string }> = {
  rascunho:          { label: "Rascunho",         color: "bg-zinc-500/15 text-zinc-600 border-zinc-500/30" },
  submetido:         { label: "Submetido",         color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  em_analise:        { label: "Em Análise",        color: "bg-violet-500/15 text-violet-700 border-violet-500/30" },
  aprovado:          { label: "Aprovado",          color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  em_execucao:       { label: "Em Execução",       color: "bg-sky-500/15 text-sky-700 border-sky-500/30" },
  prestacao_enviada: { label: "Prestação Enviada", color: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  concluido:         { label: "Concluído",         color: "bg-green-500/15 text-green-700 border-green-500/30" },
};

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-4 w-4" />, color: "bg-blue-500/20 text-blue-600" },
  vaga: { label: "Vaga", icon: <Briefcase className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600" },
  oficina: { label: "Oficina", icon: <GraduationCap className="h-4 w-4" />, color: "bg-amber-500/20 text-amber-600" },
  festival: { label: "Festival", icon: <Users className="h-4 w-4" />, color: "bg-violet-500/20 text-violet-600" },
  filme: { label: "Filme/Doc", icon: <Film className="h-4 w-4" />, color: "bg-cyan-500/20 text-cyan-600" },
  exposicao: { label: "Exposição", icon: <Palette className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600" },
  teatro: { label: "Teatro", icon: <Theater className="h-4 w-4" />, color: "bg-amber-500/20 text-amber-600" },
  ep: { label: "EP/Álbum", icon: <Music className="h-4 w-4" />, color: "bg-pink-500/20 text-pink-600" },
  projeto_bairro: { label: "Projeto de Bairro", icon: <MapPin className="h-4 w-4" />, color: "bg-purple-500/20 text-purple-600" },
};

const Oportunidades = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const projetos = PROJETOS_VITRINE_MOCK.map((p) => ({
    id: p.id,
    titulo: p.titulo,
    tipo: p.tipo,
    local: p.local,
    data: p.dataEvento,
    vagas: p.vagas,
    projetoStatus: p.projetoStatus,
    isOficina: p.isOficina,
  }));

  const projetosFiltrados = projetos.filter((projeto) => {
    const matchSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === "todos" || projeto.tipo === filtroTipo;
    return matchSearch && matchTipo;
  });

  const estatisticas = {
    total: projetos.length,
    evento: projetos.filter((p) => p.tipo === "evento").length,
    festival: projetos.filter((p) => p.tipo === "festival").length,
    filme: projetos.filter((p) => p.tipo === "filme").length,
    exposicao: projetos.filter((p) => p.tipo === "exposicao").length,
    teatro: projetos.filter((p) => p.tipo === "teatro").length,
    ep: projetos.filter((p) => p.tipo === "ep").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Projetos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus projetos culturais em todas as fases</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Projeto
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/evento")}
                className="gap-3 cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium">Eventos</p>
                  <p className="text-xs text-muted-foreground">Shows, festivais, apresentações</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/vaga")}
                className="gap-3 cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-medium">Vaga de Trabalho</p>
                  <p className="text-xs text-muted-foreground">Emprego, freelancer, cachê</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/oportunidades/novo/oficina")}
                className="gap-3 cursor-pointer"
              >
                <GraduationCap className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium">Oficinas</p>
                  <p className="text-xs text-muted-foreground">Cursos, workshops, formações</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled
                className="gap-3 cursor-not-allowed opacity-50"
              >
                <MapPin className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="font-medium">Projetos de Bairro</p>
                  <p className="text-xs text-muted-foreground">Em breve</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{estatisticas.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          {(["evento", "festival", "filme", "teatro"] as const).map((tipo) => (
            <Card key={tipo} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${tipoConfig[tipo].color}`}>{tipoConfig[tipo].icon}</div>
                  <div>
                    <div className="text-xl font-bold">{estatisticas[tipo] || 0}</div>
                    <div className="text-xs text-muted-foreground">{tipoConfig[tipo].label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="evento">Eventos</SelectItem>
                  <SelectItem value="festival">Festivais</SelectItem>
                  <SelectItem value="filme">Filmes/Docs</SelectItem>
                  <SelectItem value="exposicao">Exposições</SelectItem>
                  <SelectItem value="teatro">Teatro</SelectItem>
                  <SelectItem value="ep">EP/Álbum</SelectItem>
                  <SelectItem value="oficina">Oficinas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Projetos ({projetosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {projetosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum projeto encontrado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Público</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projetosFiltrados.map((projeto) => {
                    const config = tipoConfig[projeto.tipo] || tipoConfig.evento;
                    return (
                      <TableRow
                        key={projeto.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          navigate(`/oportunidades/${projeto.id}`)
                        }
                      >
                        <TableCell>
                          <div className="font-medium">{projeto.titulo}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            <span className="flex items-center gap-1.5">
                              {config.icon}
                              {config.label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{projeto.local}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {projeto.data
                            ? new Date(projeto.data).toLocaleDateString("pt-BR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={PROJETO_STATUS_CONFIG[projeto.projetoStatus].color}
                          >
                            {PROJETO_STATUS_CONFIG[projeto.projetoStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{projeto.vagas || "-"}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Oportunidades;
