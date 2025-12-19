import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, DollarSign, Target, Eye } from "lucide-react";

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

export default function Investimentos() {
  const navigate = useNavigate();

  const totalInvestido = meusInvestimentos.reduce((acc, inv) => acc + inv.valorInvestido, 0);
  const retornoTotal = meusInvestimentos.reduce((acc, inv) => acc + inv.retornoEsperado, 0);

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

        {/* Lista de Investimentos */}
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
                  <Button variant="outline" size="sm" onClick={() => navigate(`/investimentos/${investimento.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}