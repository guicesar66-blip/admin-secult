import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Edit, 
  Eye, 
  Trash2, 
  FileText,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Handshake,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Check
} from "lucide-react";
import { useState } from "react";
import { ReportPreviewDialog } from "@/components/ReportPreviewDialog";
import { ApprovalDialog } from "@/components/ApprovalDialog";
import { useToast } from "@/hooks/use-toast";

const oportunidades = [
  {
    id: 1,
    titulo: "Festival Rock Recife 2025",
    tipo: "Show",
    status: "Ativa",
    statusVariant: "success" as const,
    inscricoes: "45/100",
    descricao: "Festival de rock com múltiplas bandas locais",
    local: "Marco Zero, Recife",
    data: "15/12/2025",
    orcamento: "R$ 50.000",
    criador: "Secretaria de Cultura",
    interessados: 23,
  },
  {
    id: 2,
    titulo: "Workshop Produção Musical",
    tipo: "Curso",
    status: "Ativa",
    statusVariant: "success" as const,
    inscricoes: "23/30",
    descricao: "Workshop prático de produção musical para iniciantes",
    local: "Online",
    data: "20/11/2025",
    orcamento: "R$ 15.000",
    criador: "Escola de Música Recife",
    interessados: 18,
  },
  {
    id: 3,
    titulo: "Edital Carnaval 2025",
    tipo: "Fomento",
    status: "Finalizada",
    statusVariant: "info" as const,
    inscricoes: "156/200",
    descricao: "Edital para apoio a projetos culturais no carnaval",
    local: "Recife",
    data: "10/02/2025",
    orcamento: "R$ 200.000",
    criador: "Prefeitura do Recife",
    interessados: 89,
  },
  {
    id: 4,
    titulo: "Show na Praça do Marco Zero",
    tipo: "Show",
    status: "Ativa",
    statusVariant: "success" as const,
    inscricoes: "67/80",
    descricao: "Show acústico ao ar livre",
    local: "Praça do Marco Zero",
    data: "05/12/2025",
    orcamento: "R$ 25.000",
    criador: "Associação Cultural",
    interessados: 34,
  },
  {
    id: 5,
    titulo: "Curso de Violão Básico",
    tipo: "Curso",
    status: "Aguardando Aprovação",
    statusVariant: "error" as const,
    inscricoes: "12/25",
    descricao: "Curso básico de violão para iniciantes",
    local: "Centro Cultural",
    data: "01/12/2025",
    orcamento: "R$ 8.000",
    criador: "Professor João Silva",
    interessados: 5,
  },
];

const candidaturas = [
  { id: 1, candidato: "Maria Silva", oportunidade: "Festival Rock Recife 2025", data: "2024-11-15", status: "pendente", portfolio: "Cantora MPB, 5 anos de experiência" },
  { id: 2, candidato: "João Santos", oportunidade: "Festival Rock Recife 2025", data: "2024-11-14", status: "aprovado", portfolio: "Guitarrista de rock, banda local" },
  { id: 3, candidato: "Ana Costa", oportunidade: "Workshop Produção Musical", data: "2024-11-13", status: "pendente", portfolio: "Produtora iniciante, interesse em eletrônica" },
  { id: 4, candidato: "Pedro Lima", oportunidade: "Festival Rock Recife 2025", data: "2024-11-12", status: "rejeitado", portfolio: "Baterista, 3 anos de experiência" },
  { id: 5, candidato: "Carla Mendes", oportunidade: "Show na Praça do Marco Zero", data: "2024-11-11", status: "pendente", portfolio: "Cantora sertaneja, 2 álbuns lançados" },
  { id: 6, candidato: "Lucas Oliveira", oportunidade: "Workshop Produção Musical", data: "2024-11-10", status: "aprovado", portfolio: "DJ e produtor, 4 anos de experiência" },
];

export default function Oportunidades() {
  const { toast } = useToast();
  const [reportOpen, setReportOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("marketplace");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCandidaturas, setSelectedCandidaturas] = useState<number[]>([]);

  const handleAcaoEmLote = (acao: "aprovar" | "rejeitar") => {
    toast({
      title: acao === "aprovar" ? "Candidaturas aprovadas" : "Candidaturas rejeitadas",
      description: `${selectedCandidaturas.length} candidatura(s) ${acao === "aprovar" ? "aprovada(s)" : "rejeitada(s)"} com sucesso.`
    });
    setSelectedCandidaturas([]);
  };

  const toggleCandidatura = (id: number) => {
    setSelectedCandidaturas(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Marketplace de Oportunidades
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore oportunidades e crie conexões de parceria
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setReportOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório
            </Button>
            <Button size="sm" onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Oportunidade
            </Button>
          </div>
        </div>

        {/* Tabs para Marketplace, Minhas Oportunidades e Candidaturas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="minhas">Minhas Oportunidades</TabsTrigger>
            <TabsTrigger value="candidaturas">Candidaturas</TabsTrigger>
          </TabsList>

          {/* Tab Marketplace */}
          <TabsContent value="marketplace" className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Oportunidades Disponíveis</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">24</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Conexões Realizadas</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">156</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Parceiros Ativos</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">89</p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="show">Show</SelectItem>
                      <SelectItem value="curso">Curso</SelectItem>
                      <SelectItem value="fomento">Fomento</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="active">Ativas</SelectItem>
                      <SelectItem value="pending">Aguardando</SelectItem>
                      <SelectItem value="finished">Finalizadas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Este mês" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Este mês</SelectItem>
                      <SelectItem value="quarter">Último trimestre</SelectItem>
                      <SelectItem value="year">Este ano</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar oportunidade..." className="pl-9" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid de Cards de Oportunidades */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {oportunidades.filter(op => op.status === "Ativa").map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{item.titulo}</CardTitle>
                        <BadgeStatus variant={item.statusVariant} className="mb-2">
                          {item.status}
                        </BadgeStatus>
                        <p className="text-sm text-muted-foreground">{item.descricao}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{item.local}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{item.data}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{item.orcamento}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{item.interessados} interessados</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Criado por: <span className="font-medium text-foreground">{item.criador}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedItem(item);
                            setApprovalOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                        >
                          <Handshake className="mr-2 h-4 w-4" />
                          Conectar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Minhas Oportunidades */}
          <TabsContent value="minhas" className="space-y-6">
            {/* Estatísticas Pessoais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Minhas Oportunidades</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">5</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">3</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Conexões Feitas</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">12</p>
                </CardContent>
              </Card>
            </div>

            {/* Botão Criar Nova Oportunidade */}
            {!showCreateForm && (
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Crie sua primeira oportunidade</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      Divulgue seus projetos, eventos ou oportunidades e encontre parceiros ideais
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Oportunidade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formulário de Criação */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Criar Nova Oportunidade
                  </CardTitle>
                  <CardDescription>
                    Preencha os dados abaixo para criar e divulgar sua oportunidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título da Oportunidade</label>
                    <Input placeholder="Ex: Festival de Música 2025" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="show">Show</SelectItem>
                          <SelectItem value="curso">Curso</SelectItem>
                          <SelectItem value="fomento">Fomento</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data</label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Local</label>
                    <Input placeholder="Ex: Marco Zero, Recife" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <textarea 
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Descreva sua oportunidade em detalhes..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Orçamento (opcional)</label>
                      <Input placeholder="R$ 0,00" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vagas Disponíveis</label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Publicar Oportunidade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Minhas Oportunidades */}
            {!showCreateForm && (
              <div className="space-y-4">
                {oportunidades.filter(op => op.criador === "Professor João Silva").map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{item.titulo}</h3>
                            <BadgeStatus variant={item.statusVariant}>
                              {item.status}
                            </BadgeStatus>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.descricao}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {item.interessados} interessados
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {item.data}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Candidaturas Recebidas */}
          <TabsContent value="candidaturas" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Candidaturas</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{candidaturas.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="mt-1 text-2xl font-bold text-yellow-600">{candidaturas.filter(c => c.status === "pendente").length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Aprovadas</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{candidaturas.filter(c => c.status === "aprovado").length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Rejeitadas</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">{candidaturas.filter(c => c.status === "rejeitado").length}</p>
                </CardContent>
              </Card>
            </div>

            {selectedCandidaturas.length > 0 && (
              <Card className="border-primary">
                <CardContent className="pt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{selectedCandidaturas.length} candidatura(s) selecionada(s)</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleAcaoEmLote("rejeitar")} className="text-destructive">
                      <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                    <Button size="sm" onClick={() => handleAcaoEmLote("aprovar")}>
                      <Check className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Candidaturas Recebidas</CardTitle>
                <CardDescription>Gerencie as candidaturas às suas oportunidades</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Candidato</TableHead>
                      <TableHead>Oportunidade</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidaturas.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCandidaturas.includes(c.id)}
                            onCheckedChange={() => toggleCandidatura(c.id)}
                            disabled={c.status !== "pendente"}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {c.candidato.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{c.candidato}</p>
                              <p className="text-xs text-muted-foreground">{c.portfolio}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{c.oportunidade}</TableCell>
                        <TableCell>{new Date(c.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <BadgeStatus variant={c.status === "aprovado" ? "success" : c.status === "rejeitado" ? "error" : "warning"}>
                            {c.status === "aprovado" ? "Aprovado" : c.status === "rejeitado" ? "Rejeitado" : "Pendente"}
                          </BadgeStatus>
                        </TableCell>
                        <TableCell className="text-right">
                          {c.status === "pendente" && (
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ReportPreviewDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        title="Relatório de Oportunidades"
        type="oportunidades"
      />
      
      {selectedItem && (
        <ApprovalDialog
          open={approvalOpen}
          onOpenChange={setApprovalOpen}
          type="oportunidade"
          item={selectedItem}
        />
      )}
    </DashboardLayout>
  );
}
