import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  OficinaWizardData,
  LINGUAGENS_ARTISTICAS,
} from "@/types/oficina-wizard";
import { 
  FileText, 
  Target, 
  ListChecks, 
  BookOpen, 
  Megaphone, 
  Radio, 
  Accessibility, 
  Package, 
  Users, 
  DollarSign, 
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface StepPreviewProps {
  data: OficinaWizardData;
  onChange: (updates: Partial<OficinaWizardData>) => void;
}

export function StepPreview({ data, onChange }: StepPreviewProps) {
  const [exibirVitrine, setExibirVitrine] = useState(true);
  const [mostrarProgresso, setMostrarProgresso] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Não definido";
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const totalHoras = data.etapas_encontros.reduce((acc, e) => acc + e.duracao_horas, 0);
  const totalEquipamentos = data.equipamentos_materiais.reduce((acc, c) => acc + c.itens.length, 0);
  const totalEquipe = data.equipe_instrutores.length + data.equipe_apoio.length;

  const sections = [
    {
      icon: FileText,
      title: "Justificativa",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      content: (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Título do Projeto</p>
            <p className="font-medium">{data.titulo || "—"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-amber-50">
              {data.linguagem_artistica || "Linguagem não definida"}
            </Badge>
            {data.territorios.map(t => (
              <Badge key={t} variant="secondary" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {t}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {data.justificativa || "Sem justificativa"}
          </p>
        </div>
      )
    },
    {
      icon: Target,
      title: "Objetivo Geral",
      color: "text-green-600",
      bgColor: "bg-green-50",
      content: (
        <p className="text-sm">{data.objetivo_geral || "—"}</p>
      )
    },
    {
      icon: ListChecks,
      title: "Objetivos Específicos",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      content: (
        <div className="space-y-2">
          {data.objetivos_especificos.slice(0, 5).map((obj, idx) => (
            <div key={obj.id} className="flex items-start gap-2 text-sm">
              <span className="text-lg">{obj.emoji || "📌"}</span>
              <span>{obj.titulo}</span>
            </div>
          ))}
          {data.objetivos_especificos.length > 5 && (
            <p className="text-xs text-muted-foreground">
              +{data.objetivos_especificos.length - 5} objetivos
            </p>
          )}
          {data.objetivos_especificos.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Nenhum objetivo definido</p>
          )}
        </div>
      )
    },
    {
      icon: BookOpen,
      title: "Metodologia",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className="capitalize">{data.modalidade}</Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {totalHoras}h total
            </Badge>
            <Badge variant="outline">
              {data.etapas_encontros.length} encontros
            </Badge>
          </div>
          {data.local && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{data.local}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {data.metodologia_descricao || "—"}
          </p>
        </div>
      )
    },
    {
      icon: Megaphone,
      title: "Divulgação e Marca",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      content: (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {data.canais_divulgacao.slice(0, 3).map(canal => (
              <Badge key={canal} variant="outline" className="text-xs">
                {canal.split("(")[0].trim()}
              </Badge>
            ))}
            {data.canais_divulgacao.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{data.canais_divulgacao.length - 3}
              </Badge>
            )}
          </div>
          {data.marcas_parceiras.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {data.marcas_parceiras.length} parceiro(s)
            </p>
          )}
        </div>
      )
    },
    {
      icon: Radio,
      title: "Plano de Mídia",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      content: (
        <div className="space-y-2">
          <p className="text-sm line-clamp-2">
            {data.estrategia_campanha || "—"}
          </p>
          {data.cobertura_evento.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.cobertura_evento.map(c => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      icon: Accessibility,
      title: "Acessibilidade",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      content: (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {data.recursos_acessibilidade.slice(0, 3).map(r => (
              <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
            ))}
            {data.recursos_acessibilidade.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{data.recursos_acessibilidade.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )
    },
    {
      icon: Package,
      title: "Equipamentos",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      content: (
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">{data.equipamentos_materiais.length}</span> categorias, 
            <span className="font-medium ml-1">{totalEquipamentos}</span> itens
          </p>
          <div className="flex flex-wrap gap-1">
            {data.equipamentos_materiais.map(cat => (
              <Badge key={cat.id} variant="outline" className="text-xs">
                {cat.nome_categoria} ({cat.itens.length})
              </Badge>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: Users,
      title: "Público e Cronograma",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Participantes</p>
              <p className="font-medium">{data.quantidade_participantes}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Faixa etária</p>
              <p className="font-medium">{data.faixa_etaria_min} - {data.faixa_etaria_max} anos</p>
            </div>
            <div>
              <p className="text-muted-foreground">Equipe</p>
              <p className="font-medium">{totalEquipe} pessoas</p>
            </div>
            <div>
              <p className="text-muted-foreground">Grupos</p>
              <p className="font-medium">{data.tamanho_grupos} por grupo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              Inscrições: {formatDate(data.periodo_inscricoes_inicio)} - {formatDate(data.periodo_inscricoes_fim)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              Oficinas: {formatDate(data.periodo_oficinas_inicio)} - {formatDate(data.periodo_oficinas_fim)}
            </span>
          </div>
        </div>
      )
    },
    {
      icon: DollarSign,
      title: "Orçamento",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      content: (
        <div className="space-y-2">
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(data.orcamento_total)}
          </div>
          <div className="text-sm text-muted-foreground">
            {data.itens_custo.length} itens • {data.reserva_tecnica_percentual}% reserva técnica
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['equipe', 'equipamento', 'producao', 'divulgacao'].map(cat => {
              const total = data.itens_custo
                .filter(i => i.categoria === cat)
                .reduce((acc, i) => acc + i.total, 0);
              if (total === 0) return null;
              return (
                <div key={cat} className="flex justify-between">
                  <span className="capitalize text-muted-foreground">{cat}</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    {
      icon: Trophy,
      title: "Resultados Esperados",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="font-medium">{data.resultados_quantitativos.length}</span>
              <span className="text-muted-foreground ml-1">metas</span>
            </div>
            <div>
              <span className="font-medium">{data.indicadores_sucesso.length}</span>
              <span className="text-muted-foreground ml-1">indicadores</span>
            </div>
          </div>
          {data.resultados_quantitativos.slice(0, 2).map(r => (
            <div key={r.id} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{r.descricao}: <strong>{r.meta_numerica} {r.unidade}</strong></span>
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Eye className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Preview do Projeto</h2>
          <p className="text-muted-foreground">
            Revise todas as informações antes de publicar
          </p>
        </div>
      </div>

      {/* Título destacado */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-200">
        <CardContent className="py-6">
          <h1 className="text-3xl font-bold text-center">{data.titulo || "Projeto sem título"}</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <Badge className="bg-amber-600">{data.linguagem_artistica}</Badge>
            <Badge variant="outline" className="capitalize">{data.modalidade}</Badge>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {totalHoras}h
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Grid de seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className={`py-3 ${section.bgColor}`}>
                <CardTitle className={`text-sm font-medium flex items-center gap-2 ${section.color}`}>
                  <Icon className="h-4 w-4" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                {section.content}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      {/* Opções de publicação */}
      <Card className="border-2 border-dashed border-amber-300 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-amber-600" />
            Opções de Publicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="exibir-vitrine" className="text-base font-medium">
                Exibir na Vitrine de Oportunidades
              </Label>
              <p className="text-sm text-muted-foreground">
                Seu projeto ficará visível para investidores e apoiadores
              </p>
            </div>
            <Switch
              id="exibir-vitrine"
              checked={exibirVitrine}
              onCheckedChange={setExibirVitrine}
            />
          </div>

          {exibirVitrine && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="mostrar-progresso" className="text-base font-medium">
                    Mostrar progresso de captação
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir barra de progresso com valor já captado
                  </p>
                </div>
                <Switch
                  id="mostrar-progresso"
                  checked={mostrarProgresso}
                  onCheckedChange={setMostrarProgresso}
                />
              </div>

              <div className="rounded-lg bg-white p-4 border">
                <p className="text-sm font-medium mb-2">Meta de Captação</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(data.orcamento_total)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Baseado na planilha de custos
                </p>
              </div>
            </>
          )}

          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Projeto pronto para publicação</p>
                <p className="text-sm text-green-700 mt-1">
                  Todas as 11 etapas foram preenchidas corretamente. Clique em "Publicar na Vitrine" 
                  para disponibilizar seu projeto para investidores.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
