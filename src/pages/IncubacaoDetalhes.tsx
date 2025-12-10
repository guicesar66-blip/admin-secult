import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Save, Users, Clock, BookOpen, Calendar, Award, TrendingUp, GraduationCap, UserCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Dados mockados - em produção viria do banco
const incubacoesData: Record<number, {
  id: number;
  titulo: string;
  categoria: string;
  status: string;
  statusVariant: "success" | "info" | "warning" | "error";
  descricao: string;
  modalidade: string;
  cargaHoraria: number;
  vagas: number;
  vagasPreenchidas: number;
  dataInicio: string;
  dataFim: string;
  facilitadores: string[];
  avaliacaoMedia: number | null;
  taxaConclusao: number | null;
  modulos: number;
  criador: string;
}> = {
  1: {
    id: 1,
    titulo: "Formação em Produção Musical",
    categoria: "FORMACAO",
    status: "EM_ANDAMENTO",
    statusVariant: "success",
    descricao: "Curso completo de produção musical com foco em música eletrônica e gravação",
    modalidade: "HIBRIDO",
    cargaHoraria: 120,
    vagas: 30,
    vagasPreenchidas: 28,
    dataInicio: "2025-11-01",
    dataFim: "2026-02-28",
    facilitadores: ["Maria Santos", "João Produtor"],
    avaliacaoMedia: 4.8,
    taxaConclusao: 85,
    modulos: 8,
    criador: "Escola de Música Recife"
  },
  2: {
    id: 2,
    titulo: "Mentoria para Artistas Independentes",
    categoria: "MENTORIA",
    status: "PUBLICADO",
    statusVariant: "info",
    descricao: "Programa de mentoria individual para desenvolvimento de carreira artística",
    modalidade: "ONLINE",
    cargaHoraria: 40,
    vagas: 15,
    vagasPreenchidas: 8,
    dataInicio: "2025-12-15",
    dataFim: "2026-03-15",
    facilitadores: ["Carlos Mentor"],
    avaliacaoMedia: null,
    taxaConclusao: 50,
    modulos: 4,
    criador: "Coletivo Artístico PE"
  },
  3: {
    id: 3,
    titulo: "Workshop de Marketing Digital para Músicos",
    categoria: "WORKSHOP",
    status: "CONCLUIDO",
    statusVariant: "info",
    descricao: "Workshop intensivo sobre estratégias de marketing digital para artistas",
    modalidade: "PRESENCIAL",
    cargaHoraria: 16,
    vagas: 25,
    vagasPreenchidas: 25,
    dataInicio: "2025-10-10",
    dataFim: "2025-10-12",
    facilitadores: ["Ana Marketing"],
    avaliacaoMedia: 4.5,
    taxaConclusao: 92,
    modulos: 2,
    criador: "Agência Cultural"
  },
  4: {
    id: 4,
    titulo: "Consultoria em Gestão de Carreira",
    categoria: "CONSULTORIA",
    status: "RASCUNHO",
    statusVariant: "warning",
    descricao: "Consultoria personalizada para gestão de carreira artística",
    modalidade: "ONLINE",
    cargaHoraria: 20,
    vagas: 10,
    vagasPreenchidas: 0,
    dataInicio: "2026-01-01",
    dataFim: "2026-03-01",
    facilitadores: ["Pedro Consultor"],
    avaliacaoMedia: null,
    taxaConclusao: null,
    modulos: 3,
    criador: "Minha Organização"
  }
};

const matriculasMock = [
  { id: 1, aluno: "Ana Silva", email: "ana@email.com", status: "CURSANDO", progresso: 65, dataMatricula: "01/11/2025" },
  { id: 2, aluno: "Pedro Santos", email: "pedro@email.com", status: "CURSANDO", progresso: 45, dataMatricula: "01/11/2025" },
  { id: 3, aluno: "Maria Oliveira", email: "maria@email.com", status: "PENDENTE", progresso: 0, dataMatricula: "10/11/2025" },
  { id: 4, aluno: "João Costa", email: "joao@email.com", status: "CONCLUIDO", progresso: 100, dataMatricula: "01/11/2025" },
];

const categoriaLabels: Record<string, string> = {
  FORMACAO: "Formação",
  MENTORIA: "Mentoria",
  WORKSHOP: "Workshop",
  CONSULTORIA: "Consultoria"
};

const modalidadeLabels: Record<string, string> = {
  PRESENCIAL: "Presencial",
  ONLINE: "Online",
  HIBRIDO: "Híbrido"
};

const statusLabels: Record<string, string> = {
  EM_ANDAMENTO: "Em Andamento",
  PUBLICADO: "Publicado",
  CONCLUIDO: "Concluído",
  RASCUNHO: "Rascunho"
};

export default function IncubacaoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incubacaoId = parseInt(id || "1");
  const incubacaoOriginal = incubacoesData[incubacaoId];

  const [formData, setFormData] = useState({
    titulo: incubacaoOriginal?.titulo || "",
    descricao: incubacaoOriginal?.descricao || "",
    categoria: incubacaoOriginal?.categoria || "",
    modalidade: incubacaoOriginal?.modalidade || "",
    cargaHoraria: incubacaoOriginal?.cargaHoraria || 0,
    vagas: incubacaoOriginal?.vagas || 0,
    dataInicio: incubacaoOriginal?.dataInicio || "",
    dataFim: incubacaoOriginal?.dataFim || "",
    modulos: incubacaoOriginal?.modulos || 0,
    facilitadores: incubacaoOriginal?.facilitadores?.join(", ") || ""
  });

  if (!incubacaoOriginal) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Incubação não encontrada</h2>
          <Button onClick={() => navigate("/incubacoes")}>Voltar para Incubações</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSave = () => {
    toast({
      title: "Alterações salvas",
      description: "As informações da incubação foram atualizadas com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/incubacoes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-foreground">{incubacaoOriginal.titulo}</h2>
                <BadgeStatus variant={incubacaoOriginal.statusVariant}>
                  {statusLabels[incubacaoOriginal.status]}
                </BadgeStatus>
              </div>
              <p className="text-sm text-muted-foreground">
                Criado por: {incubacaoOriginal.criador}
              </p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Matrículas</p>
                  <p className="text-2xl font-bold">{incubacaoOriginal.vagasPreenchidas}/{incubacaoOriginal.vagas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Conclusão</p>
                  <p className="text-2xl font-bold">{incubacaoOriginal.taxaConclusao ?? "N/A"}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Avaliação</p>
                  <p className="text-2xl font-bold">{incubacaoOriginal.avaliacaoMedia ?? "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-info" />
                <div>
                  <p className="text-sm text-muted-foreground">Carga Horária</p>
                  <p className="text-2xl font-bold">{incubacaoOriginal.cargaHoraria}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Módulos</p>
                  <p className="text-2xl font-bold">{incubacaoOriginal.modulos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="informacoes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="informacoes">Informações</TabsTrigger>
            <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
          </TabsList>

          {/* Tab Informações */}
          <TabsContent value="informacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Incubação</CardTitle>
                <CardDescription>Edite as informações básicas do programa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input 
                    value={formData.titulo} 
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea 
                    value={formData.descricao} 
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => setFormData({...formData, categoria: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FORMACAO">Formação</SelectItem>
                        <SelectItem value="MENTORIA">Mentoria</SelectItem>
                        <SelectItem value="WORKSHOP">Workshop</SelectItem>
                        <SelectItem value="CONSULTORIA">Consultoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modalidade</label>
                    <Select 
                      value={formData.modalidade} 
                      onValueChange={(value) => setFormData({...formData, modalidade: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                        <SelectItem value="ONLINE">Online</SelectItem>
                        <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Carga Horária</label>
                    <Input 
                      type="number" 
                      value={formData.cargaHoraria} 
                      onChange={(e) => setFormData({...formData, cargaHoraria: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Início</label>
                    <Input 
                      type="date" 
                      value={formData.dataInicio} 
                      onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Fim</label>
                    <Input 
                      type="date" 
                      value={formData.dataFim} 
                      onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vagas</label>
                    <Input 
                      type="number" 
                      value={formData.vagas} 
                      onChange={(e) => setFormData({...formData, vagas: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número de Módulos</label>
                    <Input 
                      type="number" 
                      value={formData.modulos} 
                      onChange={(e) => setFormData({...formData, modulos: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facilitadores (separados por vírgula)</label>
                    <Input 
                      value={formData.facilitadores} 
                      onChange={(e) => setFormData({...formData, facilitadores: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Matrículas */}
          <TabsContent value="matriculas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alunos Matriculados</CardTitle>
                <CardDescription>Lista de participantes do programa</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Data Matrícula</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matriculasMock.map((matricula) => (
                      <TableRow key={matricula.id}>
                        <TableCell className="font-medium">{matricula.aluno}</TableCell>
                        <TableCell>{matricula.email}</TableCell>
                        <TableCell>
                          <BadgeStatus variant={
                            matricula.status === "CURSANDO" ? "success" : 
                            matricula.status === "CONCLUIDO" ? "info" : "warning"
                          }>
                            {matricula.status === "CURSANDO" ? "Cursando" : 
                             matricula.status === "CONCLUIDO" ? "Concluído" : "Pendente"}
                          </BadgeStatus>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={matricula.progresso} className="w-20 h-2" />
                            <span className="text-sm">{matricula.progresso}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{matricula.dataMatricula}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Métricas */}
          <TabsContent value="metricas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Progresso Geral
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Ocupação das vagas</span>
                      <span className="font-medium">{Math.round((incubacaoOriginal.vagasPreenchidas / incubacaoOriginal.vagas) * 100)}%</span>
                    </div>
                    <Progress value={(incubacaoOriginal.vagasPreenchidas / incubacaoOriginal.vagas) * 100} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Taxa de conclusão</span>
                      <span className="font-medium">{incubacaoOriginal.taxaConclusao ?? 0}%</span>
                    </div>
                    <Progress value={incubacaoOriginal.taxaConclusao ?? 0} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Engajamento médio</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Distribuição de Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-sm">Cursando</span>
                      </div>
                      <span className="font-medium">18 alunos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-info" />
                        <span className="text-sm">Concluído</span>
                      </div>
                      <span className="font-medium">8 alunos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <span className="text-sm">Pendente</span>
                      </div>
                      <span className="font-medium">2 alunos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-sm">Desistente</span>
                      </div>
                      <span className="font-medium">0 alunos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Avaliações por Módulo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: incubacaoOriginal.modulos }, (_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-sm w-24">Módulo {i + 1}</span>
                        <Progress value={70 + Math.random() * 30} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12">{(4 + Math.random()).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
