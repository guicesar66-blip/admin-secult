import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  DollarSign,
  Target,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Handshake,
  Briefcase,
  Calendar,
  AlertCircle,
} from "lucide-react";

type StatusProposta = "pendente" | "aprovada" | "rejeitada" | "contraproposta" | "cancelada";
type TipoApoio = "financeiro" | "servico" | "patrocinio";

const statusConfig: Record<StatusProposta, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: { label: "Pendente", color: "bg-amber-500/20 text-amber-600", icon: <Clock className="h-3 w-3" /> },
  aprovada: { label: "Aprovada", color: "bg-green-500/20 text-green-600", icon: <CheckCircle className="h-3 w-3" /> },
  rejeitada: { label: "Rejeitada", color: "bg-red-500/20 text-red-600", icon: <XCircle className="h-3 w-3" /> },
  contraproposta: { label: "Contraproposta", color: "bg-blue-500/20 text-blue-600", icon: <MessageSquare className="h-3 w-3" /> },
  cancelada: { label: "Cancelada", color: "bg-gray-500/20 text-gray-600", icon: <XCircle className="h-3 w-3" /> },
};

const tipoApoioConfig: Record<TipoApoio, { label: string; icon: React.ReactNode }> = {
  financeiro: { label: "Financeiro", icon: <DollarSign className="h-4 w-4" /> },
  servico: { label: "Serviço/Permuta", icon: <Handshake className="h-4 w-4" /> },
  patrocinio: { label: "Patrocínio", icon: <Briefcase className="h-4 w-4" /> },
};

const PROPOSTAS_MOCK = [
  {
    id: "prop-1",
    oportunidade_id: "demo-maracatu-nacoes",
    titulo_projeto: "Festival Maracatu das Nações",
    tipo_projeto: "festival",
    local_projeto: "Recife, PE",
    tipo_apoio: "patrocinio" as TipoApoio,
    valor_financeiro: 12000,
    descricao_servico: null,
    mensagem: "Temos grande interesse em apoiar a cultura pernambucana. Nosso público-alvo coincide com o do festival.",
    status: "aprovada" as StatusProposta,
    motivo_rejeicao: null,
    contrapartidas_desejadas: ["Logo no banner do evento", "Menção em entrevistas e mídia"],
    created_at: "2025-03-10T10:00:00",
    updated_at: "2025-03-15T14:30:00",
  },
  {
    id: "prop-2",
    oportunidade_id: "demo-documentario-vozes",
    titulo_projeto: "Documentário Vozes do Sertão",
    tipo_projeto: "filme",
    local_projeto: "Sertão, PE",
    tipo_apoio: "financeiro" as TipoApoio,
    valor_financeiro: 8500,
    descricao_servico: null,
    mensagem: null,
    status: "pendente" as StatusProposta,
    motivo_rejeicao: null,
    contrapartidas_desejadas: ["Créditos no projeto final", "Relatório de impacto personalizado"],
    created_at: "2025-03-20T09:15:00",
    updated_at: "2025-03-20T09:15:00",
  },
  {
    id: "prop-3",
    oportunidade_id: "demo-orquestra-periferica",
    titulo_projeto: "Orquestra Periférica do Recife",
    tipo_projeto: "evento",
    local_projeto: "Recife, PE",
    tipo_apoio: "servico" as TipoApoio,
    valor_financeiro: null,
    descricao_servico: "Fornecemos serviços de produção audiovisual — captação de vídeo e transmissão ao vivo do evento.",
    mensagem: "Podemos colocar nossa equipe à disposição para o registro do evento.",
    status: "contraproposta" as StatusProposta,
    motivo_rejeicao: null,
    contrapartidas_desejadas: ["Logomarca em materiais de divulgação", "Ingressos ou acessos VIP"],
    created_at: "2025-03-25T16:00:00",
    updated_at: "2025-03-28T11:00:00",
  },
  {
    id: "prop-4",
    oportunidade_id: "demo-arte-urbana",
    titulo_projeto: "Exposição Arte Urbana Recife",
    tipo_projeto: "exposicao",
    local_projeto: "Recife, PE",
    tipo_apoio: "financeiro" as TipoApoio,
    valor_financeiro: 5000,
    descricao_servico: null,
    mensagem: null,
    status: "rejeitada" as StatusProposta,
    motivo_rejeicao: "O valor proposto está abaixo do mínimo para cota de patrocínio principal.",
    contrapartidas_desejadas: ["Logomarca em materiais de divulgação"],
    created_at: "2025-02-14T08:00:00",
    updated_at: "2025-02-18T10:00:00",
  },
];

export default function Investimentos() {
  const navigate = useNavigate();

  const totalInvestido = PROPOSTAS_MOCK
    .filter((p) => p.status === "aprovada" && p.valor_financeiro)
    .reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);

  const totalPendente = PROPOSTAS_MOCK
    .filter((p) => p.status === "pendente" && p.valor_financeiro)
    .reduce((acc, p) => acc + (p.valor_financeiro || 0), 0);

  const propostasAprovadas = PROPOSTAS_MOCK.filter((p) => p.status === "aprovada").length;
  const propostasPendentes = PROPOSTAS_MOCK.filter((p) => p.status === "pendente").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Investimentos</h1>
          <p className="text-muted-foreground">
            Acompanhe suas propostas de investimento em projetos culturais
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investido (Aprovado)</p>
                  <p className="text-xl font-bold text-green-600">
                    R$ {totalInvestido.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendente de Aprovação</p>
                  <p className="text-xl font-bold text-amber-600">
                    R$ {totalPendente.toLocaleString("pt-BR")}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Propostas Aprovadas</p>
                  <p className="text-xl font-bold text-foreground">{propostasAprovadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Propostas Pendentes</p>
                  <p className="text-xl font-bold text-foreground">{propostasPendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Propostas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Minhas Propostas</h2>

          {PROPOSTAS_MOCK.map((proposta) => {
            const statusInfo = statusConfig[proposta.status];
            const tipoApoioInfo = tipoApoioConfig[proposta.tipo_apoio];

            return (
              <Card key={proposta.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{proposta.titulo_projeto}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {proposta.tipo_projeto} • {proposta.local_projeto}
                          </p>
                        </div>
                        <Badge className={`${statusInfo.color} flex items-center gap-1`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Tipo de Apoio</p>
                          <p className="font-medium flex items-center gap-1.5">
                            {tipoApoioInfo.icon}
                            {tipoApoioInfo.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valor</p>
                          <p className="font-medium text-green-600">
                            {proposta.valor_financeiro
                              ? `R$ ${proposta.valor_financeiro.toLocaleString("pt-BR")}`
                              : proposta.descricao_servico
                              ? "Serviço/Permuta"
                              : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Data da Proposta</p>
                          <p className="font-medium">
                            {new Date(proposta.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Última Atualização</p>
                          <p className="font-medium">
                            {new Date(proposta.updated_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      {proposta.mensagem && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Sua mensagem:</p>
                          <p className="text-sm mt-1">{proposta.mensagem}</p>
                        </div>
                      )}

                      {proposta.descricao_servico && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Serviço oferecido:</p>
                          <p className="text-sm mt-1">{proposta.descricao_servico}</p>
                        </div>
                      )}

                      {proposta.status === "rejeitada" && proposta.motivo_rejeicao && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            Motivo da rejeição:
                          </p>
                          <p className="text-sm text-red-700 mt-1">{proposta.motivo_rejeicao}</p>
                        </div>
                      )}

                      {proposta.contrapartidas_desejadas.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground mb-1">Contrapartidas desejadas:</p>
                          <div className="flex flex-wrap gap-1">
                            {proposta.contrapartidas_desejadas.map((c, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/vitrine/${proposta.oportunidade_id}?tipo=oportunidade`)
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Projeto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
