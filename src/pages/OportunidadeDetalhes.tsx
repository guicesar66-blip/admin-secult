import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, QrCode, FileText, Check, Clock, AlertCircle, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - em produção viria do backend
const oportunidadesData: Record<string, {
  id: number;
  titulo: string;
  responsavel: string;
  email: string;
  valorTotal: number;
  status: string;
  dataCriacao: string;
  parcelas: Array<{
    id: number;
    numero: number;
    valor: number;
    vencimento: string;
    status: string;
    metodoPagamento: string | null;
    dataPagamento: string | null;
    codigoBoleto?: string;
    chavePix?: string;
  }>;
}> = {
  "1": {
    id: 1,
    titulo: "Curso de Produção Musical",
    responsavel: "Maria Silva",
    email: "maria@email.com",
    valorTotal: 2500,
    status: "pago",
    dataCriacao: "2024-01-10",
    parcelas: [
      { id: 1, numero: 1, valor: 2500, vencimento: "2024-01-15", status: "pago", metodoPagamento: "pix", dataPagamento: "2024-01-15", chavePix: "00020126580014br.gov.bcb.pix0136..." }
    ]
  },
  "2": {
    id: 2,
    titulo: "Workshop de Mixagem",
    responsavel: "João Santos",
    email: "joao@email.com",
    valorTotal: 1200,
    status: "parcial",
    dataCriacao: "2024-01-08",
    parcelas: [
      { id: 1, numero: 1, valor: 600, vencimento: "2024-01-14", status: "pago", metodoPagamento: "boleto", dataPagamento: "2024-01-14", codigoBoleto: "23793.38128 60000.000003 00000.000400 1 84340000060000" },
      { id: 2, numero: 2, valor: 600, vencimento: "2024-02-14", status: "pendente", metodoPagamento: "boleto", dataPagamento: null, codigoBoleto: "23793.38128 60000.000003 00000.000401 2 85340000060000" }
    ]
  },
  "3": {
    id: 3,
    titulo: "Mentoria Carreira Artística",
    responsavel: "Ana Costa",
    email: "ana@email.com",
    valorTotal: 3000,
    status: "pendente",
    dataCriacao: "2024-01-12",
    parcelas: [
      { id: 1, numero: 1, valor: 1000, vencimento: "2024-01-20", status: "pendente", metodoPagamento: null, dataPagamento: null },
      { id: 2, numero: 2, valor: 1000, vencimento: "2024-02-20", status: "pendente", metodoPagamento: null, dataPagamento: null },
      { id: 3, numero: 3, valor: 1000, vencimento: "2024-03-20", status: "pendente", metodoPagamento: null, dataPagamento: null }
    ]
  },
  "4": {
    id: 4,
    titulo: "Gravação de EP",
    responsavel: "Pedro Lima",
    email: "pedro@email.com",
    valorTotal: 5000,
    status: "pago",
    dataCriacao: "2024-01-05",
    parcelas: [
      { id: 1, numero: 1, valor: 5000, vencimento: "2024-01-12", status: "pago", metodoPagamento: "pix", dataPagamento: "2024-01-12", chavePix: "00020126580014br.gov.bcb.pix0136..." }
    ]
  },
  "5": {
    id: 5,
    titulo: "Consultoria de Marketing",
    responsavel: "Carla Mendes",
    email: "carla@email.com",
    valorTotal: 1800,
    status: "parcial",
    dataCriacao: "2024-01-06",
    parcelas: [
      { id: 1, numero: 1, valor: 600, vencimento: "2024-01-11", status: "pago", metodoPagamento: "boleto", dataPagamento: "2024-01-11", codigoBoleto: "23793.38128 60000.000003 00000.000402 3 83340000060000" },
      { id: 2, numero: 2, valor: 600, vencimento: "2024-02-11", status: "pago", metodoPagamento: "boleto", dataPagamento: "2024-02-10", codigoBoleto: "23793.38128 60000.000003 00000.000403 4 84340000060000" },
      { id: 3, numero: 3, valor: 600, vencimento: "2024-03-11", status: "pendente", metodoPagamento: "boleto", dataPagamento: null, codigoBoleto: "23793.38128 60000.000003 00000.000404 5 85340000060000" }
    ]
  },
  "6": {
    id: 6,
    titulo: "Produção de Videoclipe",
    responsavel: "Lucas Oliveira",
    email: "lucas@email.com",
    valorTotal: 4500,
    status: "pago",
    dataCriacao: "2024-01-03",
    parcelas: [
      { id: 1, numero: 1, valor: 2250, vencimento: "2024-01-10", status: "pago", metodoPagamento: "boleto", dataPagamento: "2024-01-10", codigoBoleto: "23793.38128 60000.000003 00000.000405 6 83340000225000" },
      { id: 2, numero: 2, valor: 2250, vencimento: "2024-02-10", status: "pago", metodoPagamento: "boleto", dataPagamento: "2024-02-09", codigoBoleto: "23793.38128 60000.000003 00000.000406 7 84340000225000" }
    ]
  }
};

const OportunidadeDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const oportunidade = id ? oportunidadesData[id] : null;

  if (!oportunidade) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Oportunidade não encontrada</h2>
          <Button onClick={() => navigate("/trocados")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao histórico
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const valorPago = oportunidade.parcelas
    .filter(p => p.status === "pago")
    .reduce((acc, p) => acc + p.valor, 0);

  const handleCopiarCodigo = (codigo: string, tipo: string) => {
    navigator.clipboard.writeText(codigo);
    toast({
      title: "Código copiado!",
      description: `Código ${tipo} copiado para a área de transferência.`
    });
  };

  const handleGerarBoleto = (parcelaId: number) => {
    toast({
      title: "Boleto gerado",
      description: "O boleto foi gerado e está pronto para download."
    });
  };

  const handleGerarPix = (parcelaId: number) => {
    toast({
      title: "PIX gerado",
      description: "O código PIX foi gerado com sucesso."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/trocados")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{oportunidade.titulo}</h1>
            <p className="text-muted-foreground">Detalhes de pagamento da oportunidade</p>
          </div>
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
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{oportunidade.responsavel}</p>
              <p className="text-sm text-muted-foreground">{oportunidade.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ {oportunidade.valorTotal.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Pago: <span className="text-green-600">R$ {valorPago.toLocaleString()}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Parcelas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {oportunidade.parcelas.filter(p => p.status === "pago").length}/{oportunidade.parcelas.length}
              </p>
              <p className="text-sm text-muted-foreground">parcelas pagas</p>
            </CardContent>
          </Card>
        </div>

        {/* Parcelas Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento de Parcelas</CardTitle>
            <CardDescription>Histórico e status de cada parcela</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {oportunidade.parcelas.map((parcela) => (
                  <TableRow key={parcela.id}>
                    <TableCell className="font-medium">{parcela.numero}ª Parcela</TableCell>
                    <TableCell>R$ {parcela.valor.toLocaleString()}</TableCell>
                    <TableCell>{new Date(parcela.vencimento).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={parcela.status === "pago" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                      >
                        {parcela.status === "pago" ? (
                          <><Check className="h-3 w-3 mr-1" /> Pago</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" /> Pendente</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {parcela.metodoPagamento ? (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          {parcela.metodoPagamento === "pix" ? (
                            <><QrCode className="h-4 w-4" /> PIX</>
                          ) : (
                            <><FileText className="h-4 w-4" /> Boleto</>
                          )}
                          {parcela.dataPagamento && (
                            <span className="text-xs ml-2">
                              em {new Date(parcela.dataPagamento).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {parcela.status === "pago" ? (
                        <div className="flex justify-end gap-2">
                          {parcela.codigoBoleto && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCopiarCodigo(parcela.codigoBoleto!, "do boleto")}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copiar
                            </Button>
                          )}
                          {parcela.chavePix && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCopiarCodigo(parcela.chavePix!, "PIX")}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copiar PIX
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGerarPix(parcela.id)}
                          >
                            <QrCode className="h-4 w-4 mr-1" />
                            Gerar PIX
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGerarBoleto(parcela.id)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Gerar Boleto
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
      </div>
    </DashboardLayout>
  );
};

export default OportunidadeDetalhes;