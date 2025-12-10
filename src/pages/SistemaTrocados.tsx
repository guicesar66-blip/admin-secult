import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Coins, TrendingUp, TrendingDown, Gift, ShoppingBag, Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, ShoppingCart, QrCode, FileText, Check, Package, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

const oportunidadesTransacoesData = [
  { id: 1, titulo: "Curso de Produção Musical", responsavel: "Maria Silva", valorTotal: 2500, valorPago: 2500, status: "pago", metodoPagamento: "pix", data: "2024-01-15", parcelas: 1 },
  { id: 2, titulo: "Workshop de Mixagem", responsavel: "João Santos", valorTotal: 1200, valorPago: 600, status: "parcial", metodoPagamento: "boleto", data: "2024-01-14", parcelas: 2 },
  { id: 3, titulo: "Mentoria Carreira Artística", responsavel: "Ana Costa", valorTotal: 3000, valorPago: 0, status: "pendente", metodoPagamento: null, data: "2024-01-13", parcelas: 0 },
  { id: 4, titulo: "Gravação de EP", responsavel: "Pedro Lima", valorTotal: 5000, valorPago: 5000, status: "pago", metodoPagamento: "pix", data: "2024-01-12", parcelas: 1 },
  { id: 5, titulo: "Consultoria de Marketing", responsavel: "Carla Mendes", valorTotal: 1800, valorPago: 900, status: "parcial", metodoPagamento: "boleto", data: "2024-01-11", parcelas: 3 },
  { id: 6, titulo: "Produção de Videoclipe", responsavel: "Lucas Oliveira", valorTotal: 4500, valorPago: 4500, status: "pago", metodoPagamento: "boleto", data: "2024-01-10", parcelas: 2 },
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

const pacotesTrocados = [
  { id: 1, trocados: 500, preco: 2.50, popular: false },
  { id: 2, trocados: 1000, preco: 5.00, popular: true },
  { id: 3, trocados: 2500, preco: 12.50, popular: false },
  { id: 4, trocados: 5000, preco: 25.00, popular: false },
];

const SistemaTrocados = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recompensaDialogOpen, setRecompensaDialogOpen] = useState(false);
  const [compraDialogOpen, setCompraDialogOpen] = useState(false);
  const [compraStep, setCompraStep] = useState<'pacote' | 'pagamento' | 'confirmacao'>('pacote');
  const [pacoteSelecionado, setPacoteSelecionado] = useState<number | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'boleto' | null>(null);
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

  const handleConfirmarCompra = () => {
    const pacote = pacotesTrocados.find(p => p.id === pacoteSelecionado);
    toast({
      title: "Pedido realizado!",
      description: `Compra de ${pacote?.trocados.toLocaleString()} trocados via ${metodoPagamento === 'pix' ? 'PIX' : 'Boleto'} registrada. Aguardando confirmação de pagamento.`
    });
    addNotification({
      type: 'balance',
      title: 'Compra de Trocados',
      message: `Pedido de ${pacote?.trocados.toLocaleString()} trocados por R$ ${pacote?.preco.toFixed(2)} aguardando pagamento via ${metodoPagamento === 'pix' ? 'PIX' : 'Boleto'}`
    });
    setCompraDialogOpen(false);
    setCompraStep('pacote');
    setPacoteSelecionado(null);
    setMetodoPagamento(null);
  };

  const resetCompraDialog = () => {
    setCompraDialogOpen(false);
    setCompraStep('pacote');
    setPacoteSelecionado(null);
    setMetodoPagamento(null);
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
          <Dialog open={compraDialogOpen} onOpenChange={(open) => open ? setCompraDialogOpen(true) : resetCompraDialog()}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Comprar Trocados
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {compraStep === 'pacote' && 'Escolha um pacote'}
                  {compraStep === 'pagamento' && 'Método de pagamento'}
                  {compraStep === 'confirmacao' && 'Confirmar compra'}
                </DialogTitle>
                <DialogDescription>
                  {compraStep === 'pacote' && 'Selecione a quantidade de trocados que deseja comprar'}
                  {compraStep === 'pagamento' && 'Como você prefere pagar?'}
                  {compraStep === 'confirmacao' && 'Revise os detalhes da sua compra'}
                </DialogDescription>
              </DialogHeader>

              {compraStep === 'pacote' && (
                <div className="grid grid-cols-2 gap-3 py-4">
                  {pacotesTrocados.map((pacote) => (
                    <div
                      key={pacote.id}
                      onClick={() => setPacoteSelecionado(pacote.id)}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                        pacoteSelecionado === pacote.id ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border'
                      }`}
                    >
                      {pacote.popular && (
                        <Badge className="absolute -top-2 right-2 bg-primary">Popular</Badge>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg">{pacote.trocados.toLocaleString()}</span>
                      </div>
                      <p className="text-xl font-bold text-foreground">R$ {pacote.preco.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        R$ {(pacote.preco / pacote.trocados * 100).toFixed(2)} / 100 trocados
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {compraStep === 'pagamento' && (
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div
                    onClick={() => setMetodoPagamento('pix')}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col items-center gap-3 ${
                      metodoPagamento === 'pix' ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border'
                    }`}
                  >
                    <QrCode className="h-10 w-10 text-primary" />
                    <span className="font-medium">PIX</span>
                    <span className="text-xs text-muted-foreground text-center">Aprovação instantânea</span>
                  </div>
                  <div
                    onClick={() => setMetodoPagamento('boleto')}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col items-center gap-3 ${
                      metodoPagamento === 'boleto' ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border'
                    }`}
                  >
                    <FileText className="h-10 w-10 text-primary" />
                    <span className="font-medium">Boleto</span>
                    <span className="text-xs text-muted-foreground text-center">Até 3 dias úteis</span>
                  </div>
                </div>
              )}

              {compraStep === 'confirmacao' && (
                <div className="py-4 space-y-4">
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Pacote</span>
                        <span className="font-medium flex items-center gap-1">
                          <Coins className="h-4 w-4 text-primary" />
                          {pacotesTrocados.find(p => p.id === pacoteSelecionado)?.trocados.toLocaleString()} trocados
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Pagamento</span>
                        <span className="font-medium flex items-center gap-1">
                          {metodoPagamento === 'pix' ? <QrCode className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          {metodoPagamento === 'pix' ? 'PIX' : 'Boleto'}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold text-primary">
                          R$ {pacotesTrocados.find(p => p.id === pacoteSelecionado)?.preco.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <DialogFooter className="gap-2">
                {compraStep !== 'pacote' && (
                  <Button variant="outline" onClick={() => setCompraStep(compraStep === 'confirmacao' ? 'pagamento' : 'pacote')}>
                    Voltar
                  </Button>
                )}
                {compraStep === 'pacote' && (
                  <Button onClick={() => setCompraStep('pagamento')} disabled={!pacoteSelecionado}>
                    Continuar
                  </Button>
                )}
                {compraStep === 'pagamento' && (
                  <Button onClick={() => setCompraStep('confirmacao')} disabled={!metodoPagamento}>
                    Continuar
                  </Button>
                )}
                {compraStep === 'confirmacao' && (
                  <Button onClick={handleConfirmarCompra} className="gap-2">
                    <Check className="h-4 w-4" />
                    Confirmar Compra
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

          {/* Transações por Oportunidade Tab */}
          <TabsContent value="transacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Transações por Oportunidade</CardTitle>
                    <CardDescription>Clique em uma oportunidade para ver os detalhes de pagamento</CardDescription>
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
                      <TableHead>Oportunidade</TableHead>
                      <TableHead className="hidden md:table-cell">Responsável</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead className="hidden sm:table-cell">Valor Pago</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Pagamento</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {oportunidadesTransacoesData
                      .filter(t => t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || t.responsavel.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((oportunidade) => (
                        <TableRow 
                          key={oportunidade.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/oportunidades/${oportunidade.id}`)}
                        >
                          <TableCell className="font-medium">{oportunidade.titulo}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{oportunidade.responsavel}</TableCell>
                          <TableCell>R$ {oportunidade.valorTotal.toLocaleString()}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className={oportunidade.valorPago === oportunidade.valorTotal ? "text-green-600" : oportunidade.valorPago > 0 ? "text-orange-600" : "text-muted-foreground"}>
                              R$ {oportunidade.valorPago.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={
                                oportunidade.status === "pago" 
                                  ? "bg-green-100 text-green-700" 
                                  : oportunidade.status === "parcial" 
                                    ? "bg-orange-100 text-orange-700" 
                                    : "bg-gray-100 text-gray-700"
                              }
                            >
                              {oportunidade.status === "pago" ? "Pago" : oportunidade.status === "parcial" ? "Parcial" : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {oportunidade.metodoPagamento ? (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                {oportunidade.metodoPagamento === "pix" ? (
                                  <><QrCode className="h-4 w-4" /> PIX</>
                                ) : (
                                  <><FileText className="h-4 w-4" /> Boleto</>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
