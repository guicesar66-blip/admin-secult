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
  Lightbulb,
  Megaphone,
  Play,
  Trophy,
  Calendar,
  Users,
  Music,
  Film,
  Palette,
  Theater,
  GraduationCap,
  Briefcase,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type FaseType = "construcao" | "divulgacao" | "execucao" | "resultados";
type TipoProjeto = "evento" | "ep" | "filme" | "festival" | "exposicao" | "teatro";

interface Projeto {
  id: string;
  titulo: string;
  tipo: TipoProjeto;
  fase: FaseType;
  dataInicio: string;
  prazo: string;
  membros: number;
  progresso: number;
  responsavel: string;
}

const projetos: Projeto[] = [
  { id: "1", titulo: "Festival de Jazz da Praça", tipo: "festival", fase: "execucao", dataInicio: "2024-01-15", prazo: "2024-06-20", membros: 12, progresso: 65, responsavel: "Maria Silva" },
  { id: "2", titulo: "EP Raízes Urbanas", tipo: "ep", fase: "construcao", dataInicio: "2024-02-01", prazo: "2024-08-15", membros: 4, progresso: 20, responsavel: "João Santos" },
  { id: "3", titulo: "Documentário Vozes da Periferia", tipo: "filme", fase: "divulgacao", dataInicio: "2023-09-10", prazo: "2024-04-30", membros: 8, progresso: 45, responsavel: "Ana Costa" },
  { id: "4", titulo: "Exposição Arte Digital", tipo: "exposicao", fase: "resultados", dataInicio: "2023-06-01", prazo: "2024-02-28", membros: 6, progresso: 100, responsavel: "Pedro Lima" },
  { id: "5", titulo: "Peça Teatral Memórias", tipo: "teatro", fase: "execucao", dataInicio: "2024-01-20", prazo: "2024-07-10", membros: 15, progresso: 40, responsavel: "Carla Mendes" },
  { id: "6", titulo: "Show Acústico Coletivo", tipo: "evento", fase: "construcao", dataInicio: "2024-03-01", prazo: "2024-05-15", membros: 3, progresso: 10, responsavel: "Lucas Alves" },
];

const faseConfig: Record<FaseType, { label: string; icon: React.ReactNode; color: string }> = {
  construcao: { label: "Construção", icon: <Lightbulb className="h-4 w-4" />, color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
  divulgacao: { label: "Divulgação", icon: <Megaphone className="h-4 w-4" />, color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  execucao: { label: "Execução", icon: <Play className="h-4 w-4" />, color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
  resultados: { label: "Resultados", icon: <Trophy className="h-4 w-4" />, color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
};

const tipoConfig: Record<TipoProjeto, { label: string; icon: React.ReactNode }> = {
  evento: { label: "Evento", icon: <Calendar className="h-4 w-4" /> },
  ep: { label: "EP/Álbum", icon: <Music className="h-4 w-4" /> },
  filme: { label: "Filme/Doc", icon: <Film className="h-4 w-4" /> },
  festival: { label: "Festival", icon: <Users className="h-4 w-4" /> },
  exposicao: { label: "Exposição", icon: <Palette className="h-4 w-4" /> },
  teatro: { label: "Teatro", icon: <Theater className="h-4 w-4" /> },
};

const Oportunidades = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroFase, setFiltroFase] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const projetosFiltrados = projetos.filter((projeto) => {
    const matchSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFase = filtroFase === "todas" || projeto.fase === filtroFase;
    const matchTipo = filtroTipo === "todos" || projeto.tipo === filtroTipo;
    return matchSearch && matchFase && matchTipo;
  });

  const estatisticas = {
    total: projetos.length,
    construcao: projetos.filter((p) => p.fase === "construcao").length,
    divulgacao: projetos.filter((p) => p.fase === "divulgacao").length,
    execucao: projetos.filter((p) => p.fase === "execucao").length,
    resultados: projetos.filter((p) => p.fase === "resultados").length,
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
          {(Object.keys(faseConfig) as FaseType[]).map((fase) => (
            <Card key={fase} className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${faseConfig[fase].color}`}>{faseConfig[fase].icon}</div>
                  <div>
                    <div className="text-xl font-bold">{estatisticas[fase]}</div>
                    <div className="text-xs text-muted-foreground">{faseConfig[fase].label}</div>
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
              <Select value={filtroFase} onValueChange={setFiltroFase}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as fases</SelectItem>
                  <SelectItem value="construcao">Construção</SelectItem>
                  <SelectItem value="divulgacao">Divulgação</SelectItem>
                  <SelectItem value="execucao">Execução</SelectItem>
                  <SelectItem value="resultados">Resultados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="ep">EP/Álbum</SelectItem>
                  <SelectItem value="filme">Filme/Doc</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="exposicao">Exposição</SelectItem>
                  <SelectItem value="teatro">Teatro</SelectItem>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="text-right">Equipe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projetosFiltrados.map((projeto) => (
                  <TableRow key={projeto.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/oportunidades/${projeto.id}`)}>
                    <TableCell><div className="font-medium">{projeto.titulo}</div></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {tipoConfig[projeto.tipo].icon}
                        <span className="text-sm">{tipoConfig[projeto.tipo].label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={faseConfig[projeto.fase].color}>
                        <span className="flex items-center gap-1.5">{faseConfig[projeto.fase].icon}{faseConfig[projeto.fase].label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{projeto.responsavel}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(projeto.prazo).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${projeto.progresso}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{projeto.progresso}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{projeto.membros}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Oportunidades;
