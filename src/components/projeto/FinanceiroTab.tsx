import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface FinanceiroTabProps {
  remuneracao: number;
  vagas: number;
  cenaCoins: number;
}

export function FinanceiroTab({ remuneracao, vagas, cenaCoins }: FinanceiroTabProps) {
  // Dados de exemplo - em produção viria do banco
  const receitas = [
    { id: "1", descricao: "Patrocínio Principal", valor: 5000, data: "2026-01-10", status: "confirmado" },
    { id: "2", descricao: "Venda de Ingressos", valor: 2500, data: "2026-01-15", status: "previsto" },
    { id: "3", descricao: "Apoio Cultural", valor: 1000, data: "2026-01-20", status: "confirmado" },
  ];

  const despesas = [
    { id: "1", descricao: "Cachê dos Artistas", valor: remuneracao * vagas, data: "2026-01-25", status: "previsto" },
    { id: "2", descricao: "Infraestrutura/Equipamentos", valor: 1500, data: "2026-01-20", status: "pago" },
    { id: "3", descricao: "Divulgação", valor: 800, data: "2026-01-18", status: "pago" },
  ];

  const repasses = [
    { id: "1", artista: "Artista 1", valor: remuneracao, status: "pendente" },
    { id: "2", artista: "Artista 2", valor: remuneracao, status: "pendente" },
  ];

  const totalReceitas = receitas.reduce((acc, r) => acc + r.valor, 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
  const balanco = totalReceitas - totalDespesas;

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <ArrowUpRight className="h-5 w-5" />
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
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
                    <Badge variant={receita.status === "confirmado" ? "default" : "secondary"}>
                      {receita.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    R$ {receita.valor.toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Despesas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <ArrowDownRight className="h-5 w-5" />
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
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
                    <Badge variant={despesa.status === "pago" ? "default" : "secondary"}>
                      {despesa.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    R$ {despesa.valor.toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Repasses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Repasses aos Colaboradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repasses.map((repasse) => (
                <TableRow key={repasse.id}>
                  <TableCell className="font-medium">{repasse.artista}</TableCell>
                  <TableCell>
                    <Badge variant={repasse.status === "pago" ? "default" : "secondary"}>
                      {repasse.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {repasse.valor.toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
