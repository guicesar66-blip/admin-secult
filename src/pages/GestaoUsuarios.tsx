import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  FileText, 
  Users, 
  Building2, 
  Shield, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Music,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus
} from "lucide-react";
import { useState } from "react";
import { ReportPreviewDialog } from "@/components/ReportPreviewDialog";

// Dados mockados de usuários
const usuarios = [
  {
    id: 1,
    nome: "Ana Carolina Silva",
    email: "ana.silva@email.com",
    telefone: "(81) 99999-1111",
    tipo: "ARTISTA",
    status: "ATIVO",
    statusVariant: "success" as const,
    avatar: null,
    cidade: "Recife",
    dataCadastro: "15/03/2025",
    generoMusical: "MPB",
    seguidores: 12500,
    oportunidades: 8,
    incubacoes: 2
  },
  {
    id: 2,
    nome: "Pedro Henrique Costa",
    email: "pedro.costa@email.com",
    telefone: "(81) 99999-2222",
    tipo: "ARTISTA",
    status: "ATIVO",
    statusVariant: "success" as const,
    avatar: null,
    cidade: "Olinda",
    dataCadastro: "20/04/2025",
    generoMusical: "Forró",
    seguidores: 8300,
    oportunidades: 5,
    incubacoes: 1
  },
  {
    id: 3,
    nome: "Coletivo Musical Recife",
    email: "contato@coletivorecife.com",
    telefone: "(81) 3333-4444",
    tipo: "ORGANIZACAO",
    status: "ATIVO",
    statusVariant: "success" as const,
    avatar: null,
    cidade: "Recife",
    dataCadastro: "10/01/2025",
    cnpj: "12.345.678/0001-90",
    oportunidadesCriadas: 15,
    incubacoesCriadas: 3
  },
  {
    id: 4,
    nome: "Maria Eduarda Santos",
    email: "maria.santos@email.com",
    telefone: "(81) 99999-3333",
    tipo: "ARTISTA",
    status: "PENDENTE",
    statusVariant: "warning" as const,
    avatar: null,
    cidade: "Caruaru",
    dataCadastro: "01/12/2025",
    generoMusical: "Sertanejo",
    seguidores: 2100,
    oportunidades: 0,
    incubacoes: 0
  },
  {
    id: 5,
    nome: "João Admin",
    email: "joao.admin@cenna.com",
    telefone: "(81) 99999-0000",
    tipo: "ADMINISTRADOR",
    status: "ATIVO",
    statusVariant: "success" as const,
    avatar: null,
    cidade: "Recife",
    dataCadastro: "01/01/2025",
    permissoes: ["usuarios", "oportunidades", "incubacoes", "financeiro"]
  },
  {
    id: 6,
    nome: "Escola de Música PE",
    email: "contato@escolamusicape.com",
    telefone: "(81) 3333-5555",
    tipo: "ORGANIZACAO",
    status: "INATIVO",
    statusVariant: "error" as const,
    avatar: null,
    cidade: "Recife",
    dataCadastro: "05/02/2025",
    cnpj: "98.765.432/0001-10",
    oportunidadesCriadas: 8,
    incubacoesCriadas: 5
  }
];

const tipoLabels: Record<string, string> = {
  ARTISTA: "Artista",
  ORGANIZACAO: "Organização",
  ADMINISTRADOR: "Administrador"
};

const statusLabels: Record<string, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  PENDENTE: "Pendente"
};

export default function GestaoUsuarios() {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof usuarios[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterTipo, setFilterTipo] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = usuarios.filter(user => {
    const matchesTipo = filterTipo === "all" || user.tipo === filterTipo;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTipo && matchesStatus && matchesSearch;
  });

  const artistas = usuarios.filter(u => u.tipo === "ARTISTA");
  const organizacoes = usuarios.filter(u => u.tipo === "ORGANIZACAO");
  const admins = usuarios.filter(u => u.tipo === "ADMINISTRADOR");

  const openDetails = (user: typeof usuarios[0]) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Gestão de Usuários
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie artistas, organizações e administradores da plataforma
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setReportOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuários</p>
                  <p className="text-2xl font-bold text-foreground">{usuarios.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Music className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Artistas</p>
                  <p className="text-2xl font-bold text-foreground">{artistas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Organizações</p>
                  <p className="text-2xl font-bold text-foreground">{organizacoes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-info" />
                <div>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold text-foreground">{admins.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="artistas">Artistas</TabsTrigger>
            <TabsTrigger value="organizacoes">Organizações</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          {/* Tab Todos */}
          <TabsContent value="todos" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="ARTISTA">Artista</SelectItem>
                      <SelectItem value="ORGANIZACAO">Organização</SelectItem>
                      <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="ATIVO">Ativo</SelectItem>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="INATIVO">Inativo</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative sm:col-span-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por nome ou email..." 
                      className="pl-9" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Usuários */}
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(user)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.nome}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            user.tipo === "ARTISTA" ? "bg-success/10 text-success" :
                            user.tipo === "ORGANIZACAO" ? "bg-warning/10 text-warning" :
                            "bg-info/10 text-info"
                          }`}>
                            {tipoLabels[user.tipo]}
                          </span>
                        </TableCell>
                        <TableCell>{user.cidade}</TableCell>
                        <TableCell>
                          <BadgeStatus variant={user.statusVariant}>
                            {statusLabels[user.status]}
                          </BadgeStatus>
                        </TableCell>
                        <TableCell>{user.dataCadastro}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" size="sm" onClick={() => openDetails(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Artistas */}
          <TabsContent value="artistas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artistas.map((artista) => (
                <Card key={artista.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetails(artista)}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={artista.avatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {artista.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{artista.nome}</h3>
                          <BadgeStatus variant={artista.statusVariant}>
                            {statusLabels[artista.status]}
                          </BadgeStatus>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{artista.generoMusical}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {artista.cidade}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {artista.seguidores?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{artista.oportunidades}</p>
                        <p className="text-xs text-muted-foreground">Oportunidades</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{artista.incubacoes}</p>
                        <p className="text-xs text-muted-foreground">Incubações</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Organizações */}
          <TabsContent value="organizacoes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizacoes.map((org) => (
                <Card key={org.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetails(org)}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-warning" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{org.nome}</h3>
                          <BadgeStatus variant={org.statusVariant}>
                            {statusLabels[org.status]}
                          </BadgeStatus>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{org.cnpj}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {org.cidade}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {org.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{org.oportunidadesCriadas}</p>
                        <p className="text-xs text-muted-foreground">Oportunidades Criadas</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{org.incubacoesCriadas}</p>
                        <p className="text-xs text-muted-foreground">Incubações Criadas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Admins */}
          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Administradores do Sistema</CardTitle>
                <CardDescription>Usuários com acesso administrativo à plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Administrador</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Permissões</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-info/10 text-info">
                                {admin.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{admin.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {admin.permissoes?.map((perm) => (
                              <span key={perm} className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                {perm}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <BadgeStatus variant={admin.statusVariant}>
                            {statusLabels[admin.status]}
                          </BadgeStatus>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de Detalhes */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            {selectedUser && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedUser.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{selectedUser.nome}</span>
                      <p className="text-sm font-normal text-muted-foreground">
                        {tipoLabels[selectedUser.tipo]}
                      </p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Informações de Contato */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {selectedUser.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Telefone</Label>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {selectedUser.telefone}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Cidade</Label>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {selectedUser.cidade}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Data de Cadastro</Label>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {selectedUser.dataCadastro}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <Label className="text-muted-foreground">Status da Conta</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <BadgeStatus variant={selectedUser.statusVariant}>
                          {statusLabels[selectedUser.status]}
                        </BadgeStatus>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedUser.status === "PENDENTE" && (
                        <>
                          <Button size="sm" variant="outline" className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejeitar
                          </Button>
                          <Button size="sm">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Aprovar
                          </Button>
                        </>
                      )}
                      {selectedUser.status === "ATIVO" && (
                        <Button size="sm" variant="outline" className="text-destructive">
                          <XCircle className="mr-2 h-4 w-4" />
                          Desativar
                        </Button>
                      )}
                      {selectedUser.status === "INATIVO" && (
                        <Button size="sm">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Reativar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Informações específicas por tipo */}
                  {selectedUser.tipo === "ARTISTA" && (
                    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{selectedUser.seguidores?.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Seguidores</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{selectedUser.oportunidades}</p>
                        <p className="text-sm text-muted-foreground">Oportunidades</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{selectedUser.incubacoes}</p>
                        <p className="text-sm text-muted-foreground">Incubações</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.tipo === "ORGANIZACAO" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <Label className="text-muted-foreground">CNPJ</Label>
                        <p className="font-medium">{selectedUser.cnpj}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.oportunidadesCriadas}</p>
                          <p className="text-sm text-muted-foreground">Oportunidades Criadas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{selectedUser.incubacoesCriadas}</p>
                          <p className="text-sm text-muted-foreground">Incubações Criadas</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <ReportPreviewDialog 
          open={reportOpen} 
          onOpenChange={setReportOpen}
          type="pessoas"
          title="Relatório de Usuários"
        />
      </div>
    </DashboardLayout>
  );
}
