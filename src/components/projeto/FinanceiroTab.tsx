import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useLancamentosFinanceiros,
  useRepassesColaboradores,
  useCreateLancamento,
  useCreateRepasse,
  useDeleteLancamento,
  useDeleteRepasse,
  useUpdateLancamento,
  useUpdateRepasse,
} from "@/hooks/useFinanceiro";

interface FinanceiroTabProps {
  projetoId: string;
  tipoEntidade: "oportunidade" | "oficina";
  remuneracao: number;
  vagas: number;
  cenaCoins: number;
}

const statusLancamentoLabels: Record<string, string> = {
  previsto: "Previsto",
  confirmado: "Confirmado",
  pago: "Pago",
  cancelado: "Cancelado",
};

const statusRepasseLabels: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  cancelado: "Cancelado",
};

export function FinanceiroTab({ projetoId, tipoEntidade, remuneracao, vagas, cenaCoins }: FinanceiroTabProps) {
  const { user } = useAuth();
  const [novoLancamentoOpen, setNovoLancamentoOpen] = useState(false);
  const [novoRepasseOpen, setNovoRepasseOpen] = useState(false);

  // Form states
  const [lancamentoForm, setLancamentoForm] = useState({
    tipo: "receita" as "receita" | "despesa",
    descricao: "",
    valor: "",
    data: "",
    status: "previsto" as "previsto" | "confirmado" | "pago" | "cancelado",
    categoria: "",
  });

  const [repasseForm, setRepasseForm] = useState({
    colaborador_nome: "",
    valor: "",
    status: "pendente" as "pendente" | "pago" | "cancelado",
  });

  // Hooks
  const { data: lancamentos = [], isLoading: loadingLancamentos } = useLancamentosFinanceiros(projetoId, tipoEntidade);
  const { data: repasses = [], isLoading: loadingRepasses } = useRepassesColaboradores(projetoId, tipoEntidade);
  
  const createLancamento = useCreateLancamento();
  const createRepasse = useCreateRepasse();
  const deleteLancamento = useDeleteLancamento();
  const deleteRepasse = useDeleteRepasse();
  const updateLancamento = useUpdateLancamento();
  const updateRepasse = useUpdateRepasse();

  // Cálculos
  const receitas = lancamentos.filter(l => l.tipo === "receita");
  const despesas = lancamentos.filter(l => l.tipo === "despesa");
  const totalReceitas = receitas.reduce((acc, r) => acc + Number(r.valor), 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor), 0);
  const balanco = totalReceitas - totalDespesas;

  const handleCreateLancamento = async () => {
    if (!user?.id || !lancamentoForm.descricao || !lancamentoForm.valor || !lancamentoForm.data) return;

    await createLancamento.mutateAsync({
      ...(tipoEntidade === "oportunidade" 
        ? { oportunidade_id: projetoId, oficina_id: null }
        : { oportunidade_id: null, oficina_id: projetoId }
      ),
      tipo: lancamentoForm.tipo,
      descricao: lancamentoForm.descricao,
      valor: parseFloat(lancamentoForm.valor),
      data: lancamentoForm.data,
      status: lancamentoForm.status,
      categoria: lancamentoForm.categoria || null,
      criador_id: user.id,
    });

    setLancamentoForm({
      tipo: "receita",
      descricao: "",
      valor: "",
      data: "",
      status: "previsto",
      categoria: "",
    });
    setNovoLancamentoOpen(false);
  };

  const handleCreateRepasse = async () => {
    if (!user?.id || !repasseForm.colaborador_nome || !repasseForm.valor) return;

    await createRepasse.mutateAsync({
      ...(tipoEntidade === "oportunidade" 
        ? { oportunidade_id: projetoId, oficina_id: null }
        : { oportunidade_id: null, oficina_id: projetoId }
      ),
      colaborador_nome: repasseForm.colaborador_nome,
      colaborador_id: null,
      valor: parseFloat(repasseForm.valor),
      status: repasseForm.status,
      data_pagamento: null,
      criador_id: user.id,
    });

    setRepasseForm({
      colaborador_nome: "",
      valor: "",
      status: "pendente",
    });
    setNovoRepasseOpen(false);
  };

  const handleToggleRepasseStatus = async (repasse: { id: string; status: string }) => {
    const newStatus = repasse.status === "pendente" ? "pago" : "pendente";
    await updateRepasse.mutateAsync({
      id: repasse.id,
      data: { 
        status: newStatus,
        data_pagamento: newStatus === "pago" ? new Date().toISOString().split('T')[0] : null,
      },
    });
  };

  const handleToggleLancamentoStatus = async (lancamento: { id: string; status: string }) => {
    const statusOrder: Array<"previsto" | "confirmado" | "pago"> = ["previsto", "confirmado", "pago"];
    const currentIndex = statusOrder.indexOf(lancamento.status as typeof statusOrder[number]);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    await updateLancamento.mutateAsync({
      id: lancamento.id,
      data: { status: nextStatus },
    });
  };

  if (loadingLancamentos || loadingRepasses) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Receitas</div>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Despesas</div>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Balanço</div>
                <div className={`text-2xl font-bold ${balanco >= 0 ? "text-green-600" : "text-red-600"}`}>
                  R$ {balanco.toLocaleString("pt-BR")}
                </div>
              </div>
              <div className={`p-2 rounded-full ${balanco >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                <DollarSign className={`h-5 w-5 ${balanco >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Cena Coins</div>
                <div className="text-2xl font-bold text-amber-600">
                  {cenaCoins || 0}
                </div>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receitas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-600">
            <ArrowUpRight className="h-5 w-5" />
            Receitas
          </CardTitle>
          <Dialog open={novoLancamentoOpen && lancamentoForm.tipo === "receita"} onOpenChange={(open) => {
            setNovoLancamentoOpen(open);
            if (open) setLancamentoForm(prev => ({ ...prev, tipo: "receita" }));
          }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Receita</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Descrição</Label>
                  <Input
                    value={lancamentoForm.descricao}
                    onChange={(e) => setLancamentoForm(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Ex: Patrocínio Principal"
                  />
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    value={lancamentoForm.valor}
                    onChange={(e) => setLancamentoForm(prev => ({ ...prev, valor: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={lancamentoForm.data}
                    onChange={(e) => setLancamentoForm(prev => ({ ...prev, data: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={lancamentoForm.status} 
                    onValueChange={(value) => setLancamentoForm(prev => ({ ...prev, status: value as typeof lancamentoForm.status }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="previsto">Previsto</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreateLancamento} 
                  className="w-full"
                  disabled={createLancamento.isPending}
                >
                  {createLancamento.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Salvar Receita
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {receitas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma receita cadastrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receitas.map((receita) => (
                  <TableRow key={receita.id}>
                    <TableCell className="font-medium">{receita.descricao}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(receita.data).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={receita.status === "pago" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleLancamentoStatus(receita)}
                      >
                        {statusLancamentoLabels[receita.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      R$ {Number(receita.valor).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteLancamento.mutate(receita.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Despesas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <ArrowDownRight className="h-5 w-5" />
            Despesas
          </CardTitle>
          <Dialog open={novoLancamentoOpen && lancamentoForm.tipo === "despesa"} onOpenChange={(open) => {
            setNovoLancamentoOpen(open);
            if (open) setLancamentoForm(prev => ({ ...prev, tipo: "despesa" }));
          }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Despesa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Descrição</Label>
                  <Input
                    value={lancamentoForm.descricao}
                    onChange={(e) => setLancamentoForm(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Ex: Infraestrutura"
                  />
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    value={lancamentoForm.valor}
                    onChange={(e) => setLancamentoForm(prev => ({ ...prev, valor: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={lancamentoForm.data}
                    onChange={(e) => setLancamentoForm(prev => ({ ...prev, data: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={lancamentoForm.status} 
                    onValueChange={(value) => setLancamentoForm(prev => ({ ...prev, status: value as typeof lancamentoForm.status }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="previsto">Previsto</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreateLancamento} 
                  className="w-full"
                  disabled={createLancamento.isPending}
                >
                  {createLancamento.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Salvar Despesa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {despesas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma despesa cadastrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {despesas.map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell className="font-medium">{despesa.descricao}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(despesa.data).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={despesa.status === "pago" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleLancamentoStatus(despesa)}
                      >
                        {statusLancamentoLabels[despesa.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium">
                      R$ {Number(despesa.valor).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteLancamento.mutate(despesa.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Repasses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Repasses aos Colaboradores
          </CardTitle>
          <Dialog open={novoRepasseOpen} onOpenChange={setNovoRepasseOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Repasse</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Colaborador</Label>
                  <Input
                    value={repasseForm.colaborador_nome}
                    onChange={(e) => setRepasseForm(prev => ({ ...prev, colaborador_nome: e.target.value }))}
                    placeholder="Nome do artista/colaborador"
                  />
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    value={repasseForm.valor}
                    onChange={(e) => setRepasseForm(prev => ({ ...prev, valor: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={repasseForm.status} 
                    onValueChange={(value) => setRepasseForm(prev => ({ ...prev, status: value as typeof repasseForm.status }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreateRepasse} 
                  className="w-full"
                  disabled={createRepasse.isPending}
                >
                  {createRepasse.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Salvar Repasse
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {repasses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum repasse cadastrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repasses.map((repasse) => (
                  <TableRow key={repasse.id}>
                    <TableCell className="font-medium">{repasse.colaborador_nome}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={repasse.status === "pago" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleRepasseStatus(repasse)}
                      >
                        {statusRepasseLabels[repasse.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {Number(repasse.valor).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteRepasse.mutate(repasse.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
