import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Users,
  MapPin,
  DollarSign
} from "lucide-react";

// Dados mockados expandidos
const investimentosData = [
  { 
    id: 1, 
    titulo: "Festival Rock Recife 2025", 
    valorInvestido: 5000, 
    retornoEsperado: 7500, 
    status: "ativo", 
    progresso: 65,
    dataInvestimento: "2024-10-15",
    dataRetorno: "2025-03-15",
    descricao: "Festival de rock com bandas locais e nacionais no Marco Zero",
    local: "Marco Zero, Recife - PE",
    organizador: "Coletivo Rock PE",
    categoria: "Festival",
    etapas: [
      { nome: "Planejamento Inicial", status: "concluido", percentual: 100, dataPrevista: "2024-10-30", dataConclusao: "2024-10-28" },
      { nome: "Contratação de Artistas", status: "concluido", percentual: 100, dataPrevista: "2024-11-15", dataConclusao: "2024-11-12" },
      { nome: "Infraestrutura e Logística", status: "em_andamento", percentual: 70, dataPrevista: "2025-01-15", dataConclusao: null },
      { nome: "Divulgação e Marketing", status: "em_andamento", percentual: 45, dataPrevista: "2025-02-15", dataConclusao: null },
      { nome: "Execução do Evento", status: "pendente", percentual: 0, dataPrevista: "2025-03-01", dataConclusao: null },
      { nome: "Prestação de Contas", status: "pendente", percentual: 0, dataPrevista: "2025-03-15", dataConclusao: null },
    ],
    atualizacoes: [
      { data: "2024-12-15", texto: "Confirmação de 8 bandas para o line-up principal", tipo: "sucesso" },
      { data: "2024-12-01", texto: "Contrato de locação do palco assinado", tipo: "info" },
      { data: "2024-11-20", texto: "Início da campanha de divulgação nas redes sociais", tipo: "info" },
      { data: "2024-11-12", texto: "Todas as bandas contratadas com sucesso", tipo: "sucesso" },
    ],
    metricas: {
      ingressosVendidos: 1200,
      metaIngressos: 3000,
      engajamentoRedes: 45000,
      patrocinadores: 5
    }
  },
  { 
    id: 2, 
    titulo: "Workshop Produção Musical", 
    valorInvestido: 2000, 
    retornoEsperado: 2800, 
    status: "concluido", 
    progresso: 100,
    dataInvestimento: "2024-08-01",
    dataRetorno: "2024-11-30",
    descricao: "Workshop de produção musical para artistas independentes",
    local: "Studio Central, Boa Viagem",
    organizador: "Academia de Música PE",
    categoria: "Workshop",
    etapas: [
      { nome: "Planejamento do Conteúdo", status: "concluido", percentual: 100, dataPrevista: "2024-08-15", dataConclusao: "2024-08-14" },
      { nome: "Matrículas e Inscrições", status: "concluido", percentual: 100, dataPrevista: "2024-09-01", dataConclusao: "2024-08-28" },
      { nome: "Realização das Aulas", status: "concluido", percentual: 100, dataPrevista: "2024-11-15", dataConclusao: "2024-11-10" },
      { nome: "Certificação e Encerramento", status: "concluido", percentual: 100, dataPrevista: "2024-11-20", dataConclusao: "2024-11-18" },
      { nome: "Prestação de Contas", status: "concluido", percentual: 100, dataPrevista: "2024-11-30", dataConclusao: "2024-11-25" },
    ],
    atualizacoes: [
      { data: "2024-11-25", texto: "Prestação de contas aprovada, retorno depositado", tipo: "sucesso" },
      { data: "2024-11-18", texto: "30 alunos certificados com sucesso", tipo: "sucesso" },
      { data: "2024-11-10", texto: "Última aula realizada com avaliação média de 4.8/5", tipo: "info" },
    ],
    metricas: {
      alunosCertificados: 30,
      metaAlunos: 30,
      avaliacaoMedia: 4.8,
      horasMinistradas: 40
    }
  },
  { 
    id: 3, 
    titulo: "Edital Carnaval 2025", 
    valorInvestido: 10000, 
    retornoEsperado: 15000, 
    status: "ativo", 
    progresso: 30,
    dataInvestimento: "2024-11-01",
    dataRetorno: "2025-02-28",
    descricao: "Produção de blocos e eventos carnavalescos em Olinda e Recife",
    local: "Olinda e Recife - PE",
    organizador: "Federação Carnavalesca de PE",
    categoria: "Festival",
    etapas: [
      { nome: "Seleção dos Blocos", status: "concluido", percentual: 100, dataPrevista: "2024-11-30", dataConclusao: "2024-11-28" },
      { nome: "Contratos e Documentação", status: "em_andamento", percentual: 60, dataPrevista: "2024-12-20", dataConclusao: null },
      { nome: "Ensaios e Preparação", status: "pendente", percentual: 0, dataPrevista: "2025-01-31", dataConclusao: null },
      { nome: "Infraestrutura dos Polos", status: "pendente", percentual: 0, dataPrevista: "2025-02-15", dataConclusao: null },
      { nome: "Realização do Carnaval", status: "pendente", percentual: 0, dataPrevista: "2025-02-28", dataConclusao: null },
      { nome: "Prestação de Contas", status: "pendente", percentual: 0, dataPrevista: "2025-03-15", dataConclusao: null },
    ],
    atualizacoes: [
      { data: "2024-12-10", texto: "15 blocos selecionados para participação", tipo: "sucesso" },
      { data: "2024-12-05", texto: "Início da documentação com os blocos", tipo: "info" },
      { data: "2024-11-28", texto: "Edital de seleção encerrado com 45 inscrições", tipo: "info" },
    ],
    metricas: {
      blocosConfirmados: 15,
      metaBlocos: 20,
      publicoEstimado: 50000,
      investidoresTotais: 12
    }
  },
];

export default function InvestimentoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const investimento = investimentosData.find(i => i.id === Number(id));

  if (!investimento) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Investimento não encontrado</h2>
          <Button variant="outline" onClick={() => navigate("/investimentos")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Investimentos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const etapasConcluidas = investimento.etapas.filter(e => e.status === "concluido").length;
  const progressoGeral = Math.round((etapasConcluidas / investimento.etapas.length) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "em_andamento": return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concluido": return "Concluído";
      case "em_andamento": return "Em Andamento";
      default: return "Pendente";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/investimentos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{investimento.titulo}</h1>
              <Badge variant={investimento.status === "ativo" ? "default" : "secondary"}>
                {investimento.status === "ativo" ? "Ativo" : "Concluído"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{investimento.descricao}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Investido</p>
                  <p className="text-xl font-bold">R$ {investimento.valorInvestido.toLocaleString()}</p>
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
                  <p className="text-xl font-bold text-green-600">R$ {investimento.retornoEsperado.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Retorno</p>
                  <p className="text-xl font-bold">{new Date(investimento.dataRetorno).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Geral</p>
                  <p className="text-xl font-bold">{progressoGeral}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Etapas do Projeto */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Etapas do Projeto
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso de cada fase do projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {investimento.etapas.map((etapa, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(etapa.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{etapa.nome}</h4>
                        <Badge 
                          variant={etapa.status === "concluido" ? "default" : etapa.status === "em_andamento" ? "secondary" : "outline"}
                        >
                          {getStatusLabel(etapa.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>Previsto: {new Date(etapa.dataPrevista).toLocaleDateString("pt-BR")}</span>
                        {etapa.dataConclusao && (
                          <span className="text-green-600">
                            Concluído: {new Date(etapa.dataConclusao).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                      <Progress value={etapa.percentual} className="h-2" />
                    </div>
                  </div>
                  {index < investimento.etapas.length - 1 && (
                    <div className="absolute left-6 top-16 h-4 w-0.5 bg-border" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Organizador</p>
                    <p className="font-medium">{investimento.organizador}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p className="font-medium">{investimento.local}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data do Investimento</p>
                    <p className="font-medium">{new Date(investimento.dataInvestimento).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro Estimado</p>
                    <p className="font-medium text-green-600">
                      R$ {(investimento.retornoEsperado - investimento.valorInvestido).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atualizações Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atualizações Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {investimento.atualizacoes.map((atualizacao, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                      atualizacao.tipo === "sucesso" ? "bg-green-500" : "bg-blue-500"
                    }`} />
                    <div>
                      <p className="text-sm">{atualizacao.texto}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(atualizacao.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
