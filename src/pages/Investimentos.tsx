import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, TrendingUp, Search, Filter, DollarSign, Calendar, Users, Target, Eye, QrCode, FileText, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const meusInvestimentos = [
  { 
    id: 1, 
    titulo: "Festival Rock Recife 2025", 
    valorInvestido: 5000, 
    retornoEsperado: 7500, 
    status: "ativo", 
    progresso: 65,
    dataInvestimento: "2024-10-15",
    dataRetorno: "2025-03-15"
  },
  { 
    id: 2, 
    titulo: "Workshop Produção Musical", 
    valorInvestido: 2000, 
    retornoEsperado: 2800, 
    status: "concluido", 
    progresso: 100,
    dataInvestimento: "2024-08-01",
    dataRetorno: "2024-11-30"
  },
  { 
    id: 3, 
    titulo: "Edital Carnaval 2025", 
    valorInvestido: 10000, 
    retornoEsperado: 15000, 
    status: "ativo", 
    progresso: 30,
    dataInvestimento: "2024-11-01",
    dataRetorno: "2025-02-28"
  },
];

const oportunidadesInvestimento = [
  { 
    id: 1, 
    titulo: "Show na Praça do Marco Zero", 
    meta: 25000, 
    arrecadado: 18500, 
    investidores: 12, 
    retornoEstimado: "40%",
    prazo: "60 dias",
    risco: "baixo"
  },
  { 
    id: 2, 
    titulo: "Produção de Videoclipe Coletivo", 
    meta: 15000, 
    arrecadado: 8200, 
    investidores: 8, 
    retornoEstimado: "35%",
    prazo: "90 dias",
    risco: "médio"
  },
  { 
    id: 3, 
    titulo: "Gravação de Álbum Independente", 
    meta: 30000, 
    arrecadado: 5000, 
    investidores: 3, 
    retornoEstimado: "50%",
    prazo: "120 dias",
    risco: "alto"
  },
];

export default function Investimentos() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [investirDialogOpen, setInvestirDialogOpen] = useState(false);
  const [selectedOportunidade, setSelectedOportunidade] = useState<typeof oportunidadesInvestimento[0] | null>(null);
  const [valorInvestimento, setValorInvestimento] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState<"pix" | "boleto" | null>(null);
  const [step, setStep] = useState<"valor" | "pagamento" | "confirmacao">("valor");

  const totalInvestido = meusInvestimentos.reduce((acc, inv) => acc + inv.valorInvestido, 0);
  const retornoTotal = meusInvestimentos.reduce((acc, inv) => acc + inv.retornoEsperado, 0);

  const handleInvestir = (oportunidade: typeof oportunidadesInvestimento[0]) => {
    setSelectedOportunidade(oportunidade);
    setInvestirDialogOpen(true);
    setStep("valor");
    setValorInvestimento("");
    setMetodoPagamento(null);
  };

  const handleConfirmarInvestimento = () => {
    toast({
      title: "Investimento registrado!",
      description: `Investimento de R$ ${valorInvestimento} em "${selectedOportunidade?.titulo}" via ${metodoPagamento === "pix" ? "PIX" : "Boleto"}. Aguardando confirmação de pagamento.`
    });
    setInvestirDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Investimentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus investimentos em oportunidades da plataforma
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Investido</p>
                  <p className="text-xl font-bold text-foreground">R$ {totalInvestido.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retorno Esperado</p>
                  <p className="text-xl font-bold text-green-600">R$ {retornoTotal.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investimentos Ativos</p>
                  <p className="text-xl font-bold text-foreground">{meusInvestimentos.filter(i => i.status === "ativo").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lucro Estimado</p>
                  <p className="text-xl font-bold text-foreground">R$ {(retornoTotal - totalInvestido).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="meus" className="space-y-4">
          <TabsList>
            <TabsTrigger value="meus">Meus Investimentos</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
          </TabsList>

          <TabsContent value="meus" className="space-y-4">
            <div className="space-y-4">
              {meusInvestimentos.map((investimento) => (
                <Card key={investimento.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{investimento.titulo}</h3>
                          <Badge variant={investimento.status === "ativo" ? "default" : "secondary"}>
                            {investimento.status === "ativo" ? "Ativo" : "Concluído"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Investido</p>
                            <p className="font-medium">R$ {investimento.valorInvestido.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Retorno Esperado</p>
                            <p className="font-medium text-green-600">R$ {investimento.retornoEsperado.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Data Investimento</p>
                            <p className="font-medium">{new Date(investimento.dataInvestimento).toLocaleDateString("pt-BR")}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Data Retorno</p>
                            <p className="font-medium">{new Date(investimento.dataRetorno).toLocaleDateString("pt-BR")}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{investimento.progresso}%</span>
                          </div>
                          <Progress value={investimento.progresso} className="h-2" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="oportunidades" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar oportunidades..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oportunidadesInvestimento.map((oportunidade) => (
                <Card key={oportunidade.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{oportunidade.titulo}</CardTitle>
                    <CardDescription>
                      {oportunidade.investidores} investidores • {oportunidade.prazo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Arrecadado</span>
                        <span className="font-medium">
                          R$ {oportunidade.arrecadado.toLocaleString()} / R$ {oportunidade.meta.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(oportunidade.arrecadado / oportunidade.meta) * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Retorno Estimado</p>
                        <p className="font-bold text-green-600">{oportunidade.retornoEstimado}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Risco</p>
                        <Badge variant={oportunidade.risco === "baixo" ? "default" : oportunidade.risco === "médio" ? "secondary" : "destructive"}>
                          {oportunidade.risco}
                        </Badge>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => handleInvestir(oportunidade)}>
                      Investir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog de Investimento */}
        <Dialog open={investirDialogOpen} onOpenChange={setInvestirDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {step === "valor" && "Valor do Investimento"}
                {step === "pagamento" && "Método de Pagamento"}
                {step === "confirmacao" && "Confirmar Investimento"}
              </DialogTitle>
              <DialogDescription>
                {selectedOportunidade?.titulo}
              </DialogDescription>
            </DialogHeader>

            {step === "valor" && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor a investir (R$)</label>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={valorInvestimento}
                    onChange={(e) => setValorInvestimento(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Retorno estimado: <span className="text-green-600 font-medium">
                    R$ {valorInvestimento ? (parseFloat(valorInvestimento) * 1.4).toFixed(2) : "0,00"}
                  </span>
                </p>
              </div>
            )}

            {step === "pagamento" && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div
                  onClick={() => setMetodoPagamento("pix")}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col items-center gap-3 ${
                    metodoPagamento === "pix" ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <QrCode className="h-10 w-10 text-primary" />
                  <span className="font-medium">PIX</span>
                  <span className="text-xs text-muted-foreground text-center">Aprovação instantânea</span>
                </div>
                <div
                  onClick={() => setMetodoPagamento("boleto")}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col items-center gap-3 ${
                    metodoPagamento === "boleto" ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <FileText className="h-10 w-10 text-primary" />
                  <span className="font-medium">Boleto</span>
                  <span className="text-xs text-muted-foreground text-center">Até 3 dias úteis</span>
                </div>
              </div>
            )}

            {step === "confirmacao" && (
              <div className="py-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Valor</span>
                      <span className="font-medium">R$ {parseFloat(valorInvestimento).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pagamento</span>
                      <span className="font-medium flex items-center gap-1">
                        {metodoPagamento === "pix" ? <QrCode className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        {metodoPagamento === "pix" ? "PIX" : "Boleto"}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-medium">Retorno Estimado</span>
                      <span className="text-xl font-bold text-green-600">
                        R$ {(parseFloat(valorInvestimento) * 1.4).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter className="gap-2">
              {step !== "valor" && (
                <Button variant="outline" onClick={() => setStep(step === "confirmacao" ? "pagamento" : "valor")}>
                  Voltar
                </Button>
              )}
              {step === "valor" && (
                <Button onClick={() => setStep("pagamento")} disabled={!valorInvestimento || parseFloat(valorInvestimento) <= 0}>
                  Continuar
                </Button>
              )}
              {step === "pagamento" && (
                <Button onClick={() => setStep("confirmacao")} disabled={!metodoPagamento}>
                  Continuar
                </Button>
              )}
              {step === "confirmacao" && (
                <Button onClick={handleConfirmarInvestimento} className="gap-2">
                  <Check className="h-4 w-4" />
                  Confirmar Investimento
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}