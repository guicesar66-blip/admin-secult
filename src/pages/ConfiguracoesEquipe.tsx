import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Shield, Mail, MoreHorizontal, Edit, Trash2, Crown, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const membrosEquipe = [
  { 
    id: 1, 
    nome: "João Silva", 
    email: "joao@cenna.com", 
    role: "owner", 
    status: "ativo",
    avatar: null,
    ultimoAcesso: "2024-12-10"
  },
  { 
    id: 2, 
    nome: "Maria Santos", 
    email: "maria@cenna.com", 
    role: "admin", 
    status: "ativo",
    avatar: null,
    ultimoAcesso: "2024-12-09"
  },
  { 
    id: 3, 
    nome: "Pedro Costa", 
    email: "pedro@cenna.com", 
    role: "editor", 
    status: "ativo",
    avatar: null,
    ultimoAcesso: "2024-12-08"
  },
  { 
    id: 4, 
    nome: "Ana Lima", 
    email: "ana@cenna.com", 
    role: "viewer", 
    status: "pendente",
    avatar: null,
    ultimoAcesso: null
  },
];

const roleLabels: Record<string, string> = {
  owner: "Proprietário",
  admin: "Administrador",
  editor: "Editor",
  viewer: "Visualizador"
};

const roleColors: Record<string, string> = {
  owner: "bg-yellow-100 text-yellow-700",
  admin: "bg-purple-100 text-purple-700",
  editor: "bg-blue-100 text-blue-700",
  viewer: "bg-gray-100 text-gray-700"
};

const roleIcons: Record<string, React.ElementType> = {
  owner: Crown,
  admin: Shield,
  editor: Edit,
  viewer: Eye
};

export default function ConfiguracoesEquipe() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoMembro, setNovoMembro] = useState({ email: "", role: "viewer" });

  const handleConvidar = () => {
    if (!novoMembro.email) {
      toast({
        title: "Erro",
        description: "Informe o email do membro",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Convite enviado",
      description: `Um convite foi enviado para ${novoMembro.email}`
    });
    setDialogOpen(false);
    setNovoMembro({ email: "", role: "viewer" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Equipe e Permissões</h1>
            <p className="text-muted-foreground">
              Gerencie os membros da sua organização e suas permissões
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Convidar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar Novo Membro</DialogTitle>
                <DialogDescription>
                  Envie um convite por email para adicionar um novo membro à equipe
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={novoMembro.email}
                    onChange={(e) => setNovoMembro({ ...novoMembro, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Função</Label>
                  <Select value={novoMembro.role} onValueChange={(v) => setNovoMembro({ ...novoMembro, role: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleConvidar}>Enviar Convite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Membros</p>
                  <p className="text-2xl font-bold text-foreground">{membrosEquipe.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold text-foreground">
                    {membrosEquipe.filter(m => m.role === "admin" || m.role === "owner").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Convites Pendentes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {membrosEquipe.filter(m => m.status === "pendente").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Edit className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Editores</p>
                  <p className="text-2xl font-bold text-foreground">
                    {membrosEquipe.filter(m => m.role === "editor").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roles Description */}
        <Card>
          <CardHeader>
            <CardTitle>Níveis de Permissão</CardTitle>
            <CardDescription>Entenda as permissões de cada função</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold">Proprietário</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Controle total sobre a organização, incluindo exclusão e transferência
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Administrador</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gerencia membros, configurações e tem acesso a todas as funcionalidades
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Edit className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Editor</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pode criar e editar oportunidades, incubações e conteúdos
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold">Visualizador</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Apenas visualiza dados e relatórios, sem permissão de edição
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Membros da Equipe</CardTitle>
            <CardDescription>Lista de todos os membros com acesso à organização</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membrosEquipe.map((membro) => {
                  const RoleIcon = roleIcons[membro.role];
                  return (
                    <TableRow key={membro.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={membro.avatar || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {membro.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{membro.nome}</p>
                            <p className="text-sm text-muted-foreground">{membro.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={roleColors[membro.role]}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleLabels[membro.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={membro.status === "ativo" ? "default" : "secondary"}>
                          {membro.status === "ativo" ? "Ativo" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {membro.ultimoAcesso 
                          ? new Date(membro.ultimoAcesso).toLocaleDateString("pt-BR")
                          : "Nunca acessou"
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        {membro.role !== "owner" && (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}