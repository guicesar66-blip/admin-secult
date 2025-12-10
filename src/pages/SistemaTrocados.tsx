import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, TrendingUp, TrendingDown, Gift, ShoppingBag, Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

const transacoesData = [
  { id: 1, usuario: "Maria Silva", tipo: "credito", valor: 500, descricao: "Conclusão de curso", data: "2024-01-15", saldo: 1500 },
  { id: 2, usuario: "João Santos", tipo: "debito", valor: 200, descricao: "Resgate - Vale compras", data: "2024-01-14", saldo: 800 },
  { id: 3, usuario: "Ana Costa", tipo: "credito", valor: 300, descricao: "Participação em evento", data: "2024-01-13", saldo: 2100 },
  { id: 4, usuario: "Pedro Lima", tipo: "credito", valor: 1000, descricao: "Projeto finalizado", data: "2024-01-12", saldo: 3500 },
  { id: 5, usuario: "Carla Mendes", tipo: "debito", valor: 500, descricao: "Resgate - Equipamento", data: "2024-01-11", saldo: 450 },
  { id: 6, usuario: "Lucas Oliveira", tipo: "credito", valor: 250, descricao: "Mentoria concluída", data: "2024-01-10", saldo: 1250 },
];

const usuariosData = [
  { id: 1, nome: "Maria Silva", email: "maria@email.com", saldo: 1500, totalGanho: 2500, totalGasto: 1000 },
  { id: 2, nome: "João Santos", email: "joao@email.com", saldo: 800, totalGanho: 1800, totalGasto: 1000 },
  { id: 3, nome: "Ana Costa", email: "ana@email.com", saldo: 2100, totalGanho: 2400, totalGasto: 300 },
  { id: 4, nome: "Pedro Lima", email: "pedro@email.com", saldo: 3500, totalGanho: 4000, totalGasto: 500 },
  { id: 5, nome: "Carla Mendes", email: "carla@email.com", saldo: 450, totalGanho: 1950, totalGasto: 1500 },
];

const recompensasData = [
  { id: 1, nome: "Vale Compras R$50", custo: 500, disponivel: 10, categoria: "Voucher" },
  { id: 2, nome: "Equipamento Musical", custo: 2000, disponivel: 3, categoria: "Produto" },
  { id: 3, nome: "Curso Online Premium", custo: 800, disponivel: 15, categoria: "Educação" },
  { id: 4, nome: "Ingresso Show", custo: 300, disponivel: 20, categoria: "Entretenimento" },
  { id: 5, nome: "Kit Estúdio Básico", custo: 1500, disponivel: 5, categoria: "Produto" },
];

const SistemaTrocados = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recompensaDialogOpen, setRecompensaDialogOpen] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState({
    usuario: "",
    tipo: "credito",
    valor: "",
    descricao: ""
  });
  const [novaRecompensa, setNovaRecompensa] = useState({
    nome: "",
    custo: "",
    disponivel: "",
    categoria: ""
  });

  const handleCriarTransacao = () => {
    if (!novaTransacao.usuario || !novaTransacao.valor || !novaTransacao.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const usuario = usuariosData.find(u => u.id.toString() === novaTransacao.usuario);
    
    toast({
      title: "Transação registrada",
      description: `${novaTransacao.tipo === "credito" ? "Crédito" : "Débito"} de ${novaTransacao.valor} trocados registrado com sucesso`
    });

    addNotification({
      type: 'balance',
      title: novaTransacao.tipo === "credito" ? 'Crédito Recebido' : 'Débito Registrado',
      message: `${usuario?.nome || 'Usuário'} ${novaTransacao.tipo === "credito" ? 'recebeu' : 'teve debitado'} ${novaTransacao.valor} trocados: ${novaTransacao.descricao}`
    });

    setDialogOpen(false);
    setNovaTransacao({ usuario: "", tipo: "credito", valor: "", descricao: "" });
  };

  const handleCriarRecompensa = () => {
    if (!novaRecompensa.nome || !novaRecompensa.custo || !novaRecompensa.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Recompensa criada",
      description: `"${novaRecompensa.nome}" adicionada ao catálogo`
    });

    addNotification({
      type: 'reward',
      title: 'Nova Recompensa Disponível',
      message: `"${novaRecompensa.nome}" foi adicionada ao catálogo por ${novaRecompensa.custo} trocados!`
    });

    setRecompensaDialogOpen(false);
    setNovaRecompensa({ nome: "", custo: "", disponivel: "", categoria: "" });
  };

  const totalEmCirculacao = usuariosData.reduce((acc, u) => acc + u.saldo, 0);
  const totalDistribuido = usuariosData.reduce((acc, u) => acc + u.totalGanho, 0);
  const totalResgatado = usuariosData.reduce((acc, u) => acc + u.totalGasto, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sistema de Trocados</h1>
            <p className="text-muted-foreground">Gerencie a moeda virtual e recompensas da plataforma</p>
          </div>
          <Button className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Comprar Trocados
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Em Circulação</CardTitle>
              <Coins className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmCirculacao.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">trocados ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Distribuído</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalDistribuido.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">trocados creditados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Resgatado</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalResgatado.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">trocados utilizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recompensas</CardTitle>
              <Gift className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recompensasData.length}</div>
              <p className="text-xs text-muted-foreground">itens no catálogo</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transacoes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="saldos">Saldos</TabsTrigger>
            <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
          </TabsList>

          {/* Transações Tab */}
          <TabsContent value="transacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Histórico de Transações</CardTitle>
                    <CardDescription>Todas as movimentações de trocados</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar..."
                        className="pl-9 w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="hidden md:table-cell">Descrição</TableHead>
                      <TableHead className="hidden sm:table-cell">Data</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoesData
                      .filter(t => t.usuario.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((transacao) => (
                        <TableRow key={transacao.id}>
                          <TableCell className="font-medium">{transacao.usuario}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={transacao.tipo === "credito" ? "default" : "secondary"}
                              className={transacao.tipo === "credito" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
                            >
                              {transacao.tipo === "credito" ? (
                                <ArrowDownLeft className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              )}
                              {transacao.tipo === "credito" ? "Crédito" : "Débito"}
                            </Badge>
                          </TableCell>
                          <TableCell className={transacao.tipo === "credito" ? "text-green-600" : "text-orange-600"}>
                            {transacao.tipo === "credito" ? "+" : "-"}{transacao.valor}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {transacao.descricao}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {new Date(transacao.data).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {transacao.saldo.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saldos Tab */}
          <TabsContent value="saldos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saldos por Usuário</CardTitle>
                <CardDescription>Visão geral dos trocados de cada usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="text-right">Saldo Atual</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Total Ganho</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Total Gasto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosData.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{usuario.email}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-primary">{usuario.saldo.toLocaleString()}</span>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell text-green-600">
                          +{usuario.totalGanho.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell text-orange-600">
                          -{usuario.totalGasto.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recompensas Tab */}
          <TabsContent value="recompensas" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Catálogo de Recompensas</CardTitle>
                    <CardDescription>Itens disponíveis para resgate</CardDescription>
                  </div>
                  <Dialog open={recompensaDialogOpen} onOpenChange={setRecompensaDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Recompensa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Recompensa</DialogTitle>
                        <DialogDescription>
                          Crie um novo item para o catálogo de recompensas
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Nome da Recompensa</Label>
                          <Input
                            placeholder="Ex: Vale Compras R$100"
                            value={novaRecompensa.nome}
                            onChange={(e) => setNovaRecompensa({ ...novaRecompensa, nome: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Custo (Trocados)</Label>
                            <Input
                              type="number"
                              placeholder="Ex: 1000"
                              value={novaRecompensa.custo}
                              onChange={(e) => setNovaRecompensa({ ...novaRecompensa, custo: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              placeholder="Ex: 10"
                              value={novaRecompensa.disponivel}
                              onChange={(e) => setNovaRecompensa({ ...novaRecompensa, disponivel: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Categoria</Label>
                          <Select
                            value={novaRecompensa.categoria}
                            onValueChange={(value) => setNovaRecompensa({ ...novaRecompensa, categoria: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Voucher">Voucher</SelectItem>
                              <SelectItem value="Produto">Produto</SelectItem>
                              <SelectItem value="Educação">Educação</SelectItem>
                              <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRecompensaDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCriarRecompensa}>Adicionar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recompensasData.map((recompensa) => (
                    <Card key={recompensa.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{recompensa.nome}</h3>
                            <Badge variant="outline">{recompensa.categoria}</Badge>
                          </div>
                          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-primary" />
                            <span className="font-bold text-primary">{recompensa.custo.toLocaleString()}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {recompensa.disponivel} disponíveis
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SistemaTrocados;
