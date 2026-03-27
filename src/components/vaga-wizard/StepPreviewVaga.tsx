import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Users,
} from "lucide-react";
import { VagaWizardData } from "@/types/vaga-wizard";

interface Props {
  data: VagaWizardData;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export function StepPreviewVaga({ data }: Props) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const remuneracaoDisplay = data.remuneracao_a_combinar
    ? "A combinar"
    : data.remuneracao_valor
    ? `R$ ${data.remuneracao_valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <Eye className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Revisão e Publicação</h2>
          <p className="text-muted-foreground mt-1">
            Confira todas as informações antes de publicar a vaga.
          </p>
        </div>
      </div>

      {/* Cabeçalho da vaga */}
      <Card className="border-emerald-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-t-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{data.titulo || "Título não informado"}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {data.area_cultural && (
                  <Badge className="bg-emerald-600">{data.area_cultural}</Badge>
                )}
                {data.modalidade && (
                  <Badge variant="outline">{data.modalidade}</Badge>
                )}
                {data.tipo_contrato && (
                  <Badge variant="secondary">{data.tipo_contrato}</Badge>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-emerald-600">{remuneracaoDisplay}</p>
              <p className="text-xs text-muted-foreground">{data.regime_jornada}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {(data.municipio || data.local) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{[data.bairro, data.municipio].filter(Boolean).join(", ") || data.local}</span>
              </div>
            )}
            {data.horario_trabalho && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{data.horario_trabalho}</span>
              </div>
            )}
            {data.num_vagas > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                <span>{data.num_vagas} {data.num_vagas === 1 ? "vaga" : "vagas"}</span>
              </div>
            )}
            {data.prazo_inscricao && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Prazo: {formatDate(data.prazo_inscricao)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Descrição */}
      {data.descricao && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-600" />
              Sobre a Vaga
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.descricao}</p>
          </CardContent>
        </Card>
      )}

      {/* Requisitos */}
      {(data.requisitos_obrigatorios || data.requisitos_desejaveis || data.habilidades.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              Perfil do Candidato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Nível de Experiência" value={data.nivel_experiencia} />
              <InfoRow label="Escolaridade Mínima" value={data.escolaridade_minima} />
            </div>
            {data.requisitos_obrigatorios && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Requisitos Obrigatórios</p>
                <p className="text-sm whitespace-pre-wrap">{data.requisitos_obrigatorios}</p>
              </div>
            )}
            {data.requisitos_desejaveis && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Requisitos Desejáveis</p>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{data.requisitos_desejaveis}</p>
              </div>
            )}
            {data.habilidades.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Habilidades</p>
                <div className="flex flex-wrap gap-1">
                  {data.habilidades.map((h) => (
                    <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Remuneração e Benefícios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Remuneração e Benefícios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Remuneração" value={remuneracaoDisplay} />
          {data.observacoes_remuneracao && (
            <InfoRow label="Observações" value={data.observacoes_remuneracao} />
          )}
          {data.beneficios.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Benefícios</p>
              <div className="flex flex-wrap gap-1">
                {data.beneficios.map((b) => (
                  <Badge key={b} variant="outline" className="text-xs">{b}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processo Seletivo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Processo Seletivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.prazo_inscricao && (
            <InfoRow label="Prazo de Inscrição" value={formatDate(data.prazo_inscricao)} />
          )}
          {data.etapas_selecao.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Etapas da Seleção</p>
              <div className="flex flex-wrap gap-1 items-center">
                {data.etapas_selecao.map((etapa, i) => (
                  <span key={etapa} className="flex items-center gap-1">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {i + 1}. {etapa}
                    </span>
                    {i < data.etapas_selecao.length - 1 && (
                      <span className="text-muted-foreground text-xs">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.como_candidatar && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Como se Candidatar</p>
              <p className="text-sm whitespace-pre-wrap">{data.como_candidatar}</p>
            </div>
          )}
          {data.informacoes_adicionais && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Informações Adicionais</p>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{data.informacoes_adicionais}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Período */}
      {data.periodo_determinado && (data.data_inicio || data.data_fim) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              Período de Atuação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Início" value={formatDate(data.data_inicio)} />
              <InfoRow label="Término" value={formatDate(data.data_fim)} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
