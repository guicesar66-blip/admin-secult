import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, FileText, Users, Calendar, Clock, BookOpen, GraduationCap, Video, CheckCircle2, Eye, Edit, Trash2, UserPlus, Award, BarChart3 } from "lucide-react";
import { useState } from "react";
import { ReportPreviewDialog } from "@/components/ReportPreviewDialog";

// Dados mockados de incubações
const incubacoes = [{
  id: 1,
  titulo: "Formação em Produção Musical",
  categoria: "FORMACAO",
  status: "EM_ANDAMENTO",
  statusVariant: "success" as const,
  descricao: "Curso completo de produção musical com foco em música eletrônica e gravação",
  modalidade: "HIBRIDO",
  cargaHoraria: 120,
  vagas: 30,
  vagasPreenchidas: 28,
  dataInicio: "01/11/2025",
  dataFim: "28/02/2026",
  facilitadores: ["Maria Santos", "João Produtor"],
  avaliacaoMedia: 4.8,
  taxaConclusao: 85,
  modulos: 8,
  criador: "Escola de Música Recife"
}, {
  id: 2,
  titulo: "Mentoria para Artistas Independentes",
  categoria: "MENTORIA",
  status: "PUBLICADO",
  statusVariant: "info" as const,
  descricao: "Programa de mentoria individual para desenvolvimento de carreira artística",
  modalidade: "ONLINE",
  cargaHoraria: 40,
  vagas: 15,
  vagasPreenchidas: 8,
  dataInicio: "15/12/2025",
  dataFim: "15/03/2026",
  facilitadores: ["Carlos Mentor"],
  avaliacaoMedia: null,
  taxaConclusao: null,
  modulos: 4,
  criador: "Coletivo Artístico PE"
}, {
  id: 3,
  titulo: "Workshop de Marketing Digital para Músicos",
  categoria: "WORKSHOP",
  status: "CONCLUIDO",
  statusVariant: "info" as const,
  descricao: "Workshop intensivo sobre estratégias de marketing digital para artistas",
  modalidade: "PRESENCIAL",
  cargaHoraria: 16,
  vagas: 25,
  vagasPreenchidas: 25,
  dataInicio: "10/10/2025",
  dataFim: "12/10/2025",
  facilitadores: ["Ana Marketing"],
  avaliacaoMedia: 4.5,
  taxaConclusao: 92,
  modulos: 2,
  criador: "Agência Cultural"
}, {
  id: 4,
  titulo: "Consultoria em Gestão de Carreira",
  categoria: "CONSULTORIA",
  status: "RASCUNHO",
  statusVariant: "warning" as const,
  descricao: "Consultoria personalizada para gestão de carreira artística",
  modalidade: "ONLINE",
  cargaHoraria: 20,
  vagas: 10,
  vagasPreenchidas: 0,
  dataInicio: "01/01/2026",
  dataFim: "01/03/2026",
  facilitadores: ["Pedro Consultor"],
  avaliacaoMedia: null,
  taxaConclusao: null,
  modulos: 3,
  criador: "Minha Organização"
}];

// Dados mockados de matrículas
const matriculas = [{
  id: 1,
  aluno: "Ana Silva",
  incubacao: "Formação em Produção Musical",
  status: "CURSANDO",
  statusVariant: "success" as const,
  progresso: 65,
  dataMatricula: "01/11/2025",
  moduloAtual: "Módulo 5 - Mixagem"
}, {
  id: 2,
  aluno: "Pedro Santos",
  incubacao: "Formação em Produção Musical",
  status: "CURSANDO",
  statusVariant: "success" as const,
  progresso: 45,
  dataMatricula: "01/11/2025",
  moduloAtual: "Módulo 4 - Gravação"
}, {
  id: 3,
  aluno: "Maria Oliveira",
  incubacao: "Mentoria para Artistas Independentes",
  status: "PENDENTE",
  statusVariant: "warning" as const,
  progresso: 0,
  dataMatricula: "10/12/2025",
  moduloAtual: "-"
}, {
  id: 4,
  aluno: "João Costa",
  incubacao: "Workshop de Marketing Digital",
  status: "CONCLUIDO",
  statusVariant: "info" as const,
  progresso: 100,
  dataMatricula: "10/10/2025",
  moduloAtual: "Concluído"
}];
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
export default function Incubacoes() {
  const [reportOpen, setReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("explorar");
  const [showCreateForm, setShowCreateForm] = useState(false);
  return <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Incubações e Capacitações
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie programas de formação, mentorias e workshops
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setReportOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório
            </Button>
            <Button size="sm" onClick={() => {
            setActiveTab("minhas");
            setShowCreateForm(true);
          }}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Incubação
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="explorar">Explorar</TabsTrigger>
            <TabsTrigger value="minhas">Minhas Incubações</TabsTrigger>
            <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
          </TabsList>

          {/* Tab Explorar */}
          <TabsContent value="explorar" className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Disponíveis</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-8 w-8 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Em Andamento</p>
                      <p className="text-2xl font-bold text-foreground">5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-warning" />
                    <div>
                      <p className="text-sm text-muted-foreground">Participantes</p>
                      <p className="text-2xl font-bold text-foreground">248</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-info" />
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa Conclusão</p>
                      <p className="text-2xl font-bold text-foreground">87%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="formacao">Formação</SelectItem>
                      <SelectItem value="mentoria">Mentoria</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="publicado">Inscrições Abertas</SelectItem>
                      <SelectItem value="andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar incubação..." className="pl-9" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {incubacoes.filter(inc => inc.status !== "RASCUNHO").map(item => <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {categoriaLabels[item.categoria]}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {modalidadeLabels[item.modalidade]}
                          </span>
                        </div>
                        <CardTitle className="text-lg mb-2">{item.titulo}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.descricao}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{item.cargaHoraria}h de carga horária</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{item.dataInicio} - {item.dataFim}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{item.vagasPreenchidas}/{item.vagas} vagas</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{item.modulos} módulos</span>
                      </div>
                    </div>

                    {/* Barra de vagas */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Vagas preenchidas</span>
                        <span className="font-medium">{Math.round(item.vagasPreenchidas / item.vagas * 100)}%</span>
                      </div>
                      <Progress value={item.vagasPreenchidas / item.vagas * 100} className="h-2" />
                    </div>

                    {item.avaliacaoMedia && <div className="flex items-center gap-1 text-sm">
                        <span className="text-warning">★</span>
                        <span className="font-medium">{item.avaliacaoMedia}</span>
                        <span className="text-muted-foreground">• {item.taxaConclusao}% conclusão</span>
                      </div>}
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Por: <span className="font-medium text-foreground">{item.criador}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          Detalhes
                        </Button>
                        <Button size="sm" className="flex-1">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Inscrever
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>

          {/* Tab Minhas Incubações */}
          <TabsContent value="minhas" className="space-y-6">
            {/* Estatísticas Pessoais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Minhas Incubações</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">4</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">2</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Matrículas Totais</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">86</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Taxa Conclusão</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">89%</p>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Criação */}
            {showCreateForm && <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Criar Nova Incubação
                  </CardTitle>
                  <CardDescription>
                    Preencha os dados para criar um novo programa de capacitação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título</label>
                    <Input placeholder="Ex: Formação em Produção Musical" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categoria</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formacao">Formação</SelectItem>
                          <SelectItem value="mentoria">Mentoria</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="consultoria">Consultoria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Modalidade</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presencial">Presencial</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="hibrido">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Carga Horária</label>
                      <Input type="number" placeholder="Ex: 40" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <textarea className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Descreva o programa de capacitação..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Início</label>
                      <Input type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Fim</label>
                      <Input type="date" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vagas</label>
                      <Input type="number" placeholder="Ex: 30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facilitadores</label>
                    <Input placeholder="Nomes separados por vírgula" />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancelar
                    </Button>
                    <Button variant="secondary">
                      Salvar Rascunho
                    </Button>
                    <Button className="flex-1">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Publicar Incubação
                    </Button>
                  </div>
                </CardContent>
              </Card>}

            {/* Lista de Minhas Incubações */}
            {!showCreateForm && <>
                <Card className="border-dashed">
                  
                </Card>

                <div className="space-y-4">
                  {incubacoes.map(item => <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{item.titulo}</h3>
                              <BadgeStatus variant={item.statusVariant}>
                                {item.status === "EM_ANDAMENTO" ? "Em Andamento" : item.status === "PUBLICADO" ? "Publicado" : item.status === "CONCLUIDO" ? "Concluído" : "Rascunho"}
                              </BadgeStatus>
                              <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                {categoriaLabels[item.categoria]}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{item.descricao}</p>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {item.vagasPreenchidas}/{item.vagas} matrículas
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {item.cargaHoraria}h
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {item.modulos} módulos
                              </span>
                              {item.avaliacaoMedia && <span className="flex items-center gap-1">
                                  <span className="text-warning">★</span>
                                  {item.avaliacaoMedia}
                                </span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Métricas
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>
              </>}
          </TabsContent>

          {/* Tab Matrículas */}
          <TabsContent value="matriculas" className="space-y-6">
            {/* Estatísticas de Matrículas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Matrículas</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">86</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Cursando</p>
                  <p className="mt-1 text-2xl font-bold text-success">54</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="mt-1 text-2xl font-bold text-warning">12</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">20</p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Incubação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {incubacoes.map(inc => <SelectItem key={inc.id} value={String(inc.id)}>{inc.titulo}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="cursando">Cursando</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo período</SelectItem>
                      <SelectItem value="mes">Este mês</SelectItem>
                      <SelectItem value="trimestre">Último trimestre</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar aluno..." className="pl-9" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Matrículas */}
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Aluno</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Incubação</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Progresso</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Módulo Atual</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matriculas.map(mat => <tr key={mat.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                {mat.aluno.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium">{mat.aluno}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{mat.incubacao}</td>
                          <td className="py-3 px-4">
                            <BadgeStatus variant={mat.statusVariant}>{mat.status}</BadgeStatus>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Progress value={mat.progresso} className="h-2 w-20" />
                              <span className="text-sm text-muted-foreground">{mat.progresso}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{mat.moduloAtual}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ReportPreviewDialog open={reportOpen} onOpenChange={setReportOpen} title="Relatório de Incubações" type="incubacoes" />
    </DashboardLayout>;
}