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
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOportunidades } from "@/hooks/useOportunidades";
import { useOficinas } from "@/hooks/useOficinas";
import { useAuth } from "@/contexts/AuthContext";

const tipoConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  evento: { label: "Evento", icon: <Calendar className="h-4 w-4" />, color: "bg-blue-500/20 text-blue-600" },
  vaga: { label: "Vaga", icon: <Briefcase className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600" },
  oficina: { label: "Oficina", icon: <GraduationCap className="h-4 w-4" />, color: "bg-amber-500/20 text-amber-600" },
  projeto_bairro: { label: "Projeto de Bairro", icon: <MapPin className="h-4 w-4" />, color: "bg-purple-500/20 text-purple-600" },
};

const Oportunidades = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const { data: oportunidades = [], isLoading: loadingOportunidades } = useOportunidades(undefined, user?.id);
  const { data: oficinas = [], isLoading: loadingOficinas } = useOficinas(user?.id);

  const isLoading = loadingOportunidades || loadingOficinas;

  // Combinar oportunidades e oficinas em uma lista unificada
  const projetos = [
    ...oportunidades.map(o => ({
      id: o.id,
      titulo: o.titulo,
      tipo: o.tipo,
      local: o.local || o.municipio || "-",
      data: o.data_evento || o.created_at.split("T")[0],
      vagas: o.vagas || 0,
      status: o.status,
      isOficina: false,
    })),
    ...oficinas.map(o => ({
      id: o.id,
      titulo: o.titulo,
      tipo: "oficina",
      local: o.local || "-",
      data: o.data_inicio,
      vagas: o.vagas_total,
      status: o.status,
      isOficina: true,
    })),
  ];

  const projetosFiltrados = projetos.filter((projeto) => {
    const matchSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === "todos" || projeto.tipo === filtroTipo;
    return matchSearch && matchTipo;
  });

  const estatisticas = {
    total: projetos.length,
    evento: projetos.filter((p) => p.tipo === "evento").length,
    vaga: projetos.filter((p) => p.tipo === "vaga").length,
    oficina: projetos.filter((p) => p.tipo === "oficina").length,
    projeto_bairro: projetos.filter((p) => p.tipo === "projeto_bairro").length,
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
                  <p className="text-xs text-muted-foreground">Oportunidades profissionais</p>
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
                onClick={() => navigate("/oportunidades/novo/bairro")}
                className="gap-3 cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="font-medium">Projetos de Bairro</p>
                  <p className="text-xs text-muted-foreground">Iniciativas comunitárias</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{estatisticas.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          {(Object.keys(tipoConfig) as Array<keyof typeof tipoConfig>).map((tipo) => (
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

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar projetos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="evento">Eventos</SelectItem>
                  <SelectItem value="vaga">Vagas</SelectItem>
                  <SelectItem value="oficina">Oficinas</SelectItem>
                  <SelectItem value="projeto_bairro">Projetos de Bairro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos ({projetosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : projetosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum projeto encontrado. Crie um novo projeto para começar.
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
                    <TableHead className="text-right">Vagas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projetosFiltrados.map((projeto) => {
                    const config = tipoConfig[projeto.tipo] || tipoConfig.evento;
                    return (
                      <TableRow 
                        key={projeto.id} 
                        className="cursor-pointer hover:bg-muted/50" 
                        onClick={() => navigate(`/oportunidades/${projeto.id}`)}
                      >
                        <TableCell><div className="font-medium">{projeto.titulo}</div></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            <span className="flex items-center gap-1.5">{config.icon}{config.label}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{projeto.local}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {projeto.data ? new Date(projeto.data).toLocaleDateString("pt-BR") : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={projeto.status === "ativa" ? "default" : "secondary"}>
                            {projeto.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{projeto.vagas}</span>
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
