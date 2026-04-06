import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  User,
  Phone,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Building,
  Award,
} from "lucide-react";
import type { Oficina } from "@/hooks/useOficinas";

interface Oportunidade {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  status: string;
  data_evento: string | null;
  horario: string | null;
  local: string | null;
  municipio: string | null;
  vagas: number | null;
  remuneracao: number | null;
  cena_coins: number | null;
  criador_nome: string;
  criador_contato: string | null;
  requisitos: string | null;
  area_cultural: string | null;
  duracao: string;
}

interface ProjetoInfoCompletaProps {
  projeto: Oficina | Oportunidade;
  isOficina: boolean;
}

// Type guard para oficina
function isOficinaType(projeto: Oficina | Oportunidade): projeto is Oficina {
  return 'facilitador_nome' in projeto;
}

// Type guards para campos JSON
interface ObjetivoEspecifico {
  id: string;
  titulo: string;
  emoji?: string;
}

interface EtapaEncontro {
  id: string;
  titulo: string;
  duracao_horas: number;
  descricao?: string;
}

interface EquipamentoCategoria {
  id: string;
  nome_categoria: string;
  itens: { id: string; nome: string; quantidade: number }[];
}

interface EquipeMembro {
  id: string;
  nome: string;
  funcao: string;
}

interface MarcaParceira {
  id: string;
  nome: string;
  tipo?: string;
}

interface ItemCusto {
  id: string;
  descricao: string;
  categoria: string;
  valor_unitario: number;
  quantidade: number;
  total: number;
}

interface ResultadoQuantitativo {
  id: string;
  descricao: string;
  meta_numerica: number;
  unidade: string;
}

interface IndicadorSucesso {
  id: string;
  descricao: string;
}

export function ProjetoInfoCompleta({ projeto, isOficina }: ProjetoInfoCompletaProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Não definido";
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Se for oficina, extrair dados específicos
  if (isOficina && isOficinaType(projeto)) {
    const oficina = projeto as unknown as Oficina & {
      justificativa?: string | null;
      linguagem_artistica?: string | null;
      objetivo_geral?: string | null;
      objetivos_especificos?: ObjetivoEspecifico[] | null;
      metodologia_descricao?: string | null;
      etapas_encontros?: EtapaEncontro[] | null;
      canais_divulgacao?: string[] | null;
      marcas_parceiras?: MarcaParceira[] | null;
      estrategia_campanha?: string | null;
      cobertura_evento?: string[] | null;
      recursos_acessibilidade?: string[] | null;
      descricao_acolhimento?: string | null;
      equipamentos_materiais?: EquipamentoCategoria[] | null;
      equipe_instrutores?: EquipeMembro[] | null;
      equipe_apoio?: EquipeMembro[] | null;
      quantidade_participantes?: number | null;
      faixa_etaria_min?: number | null;
      faixa_etaria_max?: number | null;
      tamanho_grupos?: number | null;
      perfil_participante?: string | null;
      periodo_inscricoes_inicio?: string | null;
      periodo_inscricoes_fim?: string | null;
      periodo_oficinas_inicio?: string | null;
      periodo_oficinas_fim?: string | null;
      periodo_producao_inicio?: string | null;
      periodo_producao_fim?: string | null;
      itens_custo?: ItemCusto[] | null;
      orcamento_total?: number | null;
      reserva_tecnica_percentual?: number | null;
      resultados_quantitativos?: ResultadoQuantitativo[] | null;
      resultados_qualitativos?: string | null;
      indicadores_sucesso?: IndicadorSucesso[] | null;
      territorios?: string[] | null;
      endereco_completo?: string | null;
    };

    const objetivosEspecificos = Array.isArray(oficina.objetivos_especificos) 
      ? oficina.objetivos_especificos 
      : [];
    const etapasEncontros = Array.isArray(oficina.etapas_encontros) 
      ? oficina.etapas_encontros 
      : [];
    const equipamentosMateriais = Array.isArray(oficina.equipamentos_materiais) 
      ? oficina.equipamentos_materiais 
      : [];
    const equipeInstrutores = Array.isArray(oficina.equipe_instrutores) 
      ? oficina.equipe_instrutores 
      : [];
    const equipeApoio = Array.isArray(oficina.equipe_apoio) 
      ? oficina.equipe_apoio 
      : [];
    const itensCusto = Array.isArray(oficina.itens_custo) 
      ? oficina.itens_custo 
      : [];
    const resultadosQuantitativos = Array.isArray(oficina.resultados_quantitativos) 
      ? oficina.resultados_quantitativos 
      : [];
    const indicadoresSucesso = Array.isArray(oficina.indicadores_sucesso) 
      ? oficina.indicadores_sucesso 
      : [];
    const marcasParceiras = Array.isArray(oficina.marcas_parceiras) 
      ? oficina.marcas_parceiras 
      : [];
    const canaisDivulgacao = Array.isArray(oficina.canais_divulgacao) 
      ? oficina.canais_divulgacao 
      : [];
    const coberturaEvento = Array.isArray(oficina.cobertura_evento) 
      ? oficina.cobertura_evento 
      : [];
    const recursosAcessibilidade = Array.isArray(oficina.recursos_acessibilidade) 
      ? oficina.recursos_acessibilidade 
      : [];
    const territorios = Array.isArray(oficina.territorios) 
      ? oficina.territorios 
      : [];

    const totalHoras = etapasEncontros.reduce((acc, e) => acc + (e.duracao_horas || 0), 0);
    const totalEquipamentos = equipamentosMateriais.reduce((acc, c) => acc + (c.itens?.length || 0), 0);
    const totalEquipe = equipeInstrutores.length + equipeApoio.length;

    return (
      <div className="space-y-6">
        {/* Header com título destacado */}
        <Card className="bg-gradient-to-r from-accent/10 to-warning/10 border-accent/30">
          <CardContent className="py-6">
            <h2 className="text-2xl font-bold text-center">{oficina.titulo}</h2>
            <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
              {oficina.linguagem_artistica && (
                <Badge className="bg-accent">{oficina.linguagem_artistica}</Badge>
              )}
              <Badge variant="outline" className="capitalize">{oficina.modalidade}</Badge>
              <Badge variant="outline">{oficina.nivel}</Badge>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {totalHoras > 0 ? `${totalHoras}h` : `${oficina.carga_horaria}h`}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Seções em Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Justificativa */}
          {(oficina.justificativa || oficina.descricao) && (
            <Card>
              <CardHeader className="py-3 bg-neutral-50">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
                  <FileText className="h-4 w-4" />
                  Justificativa
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {oficina.justificativa || oficina.descricao}
                </p>
                {territorios.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {territorios.map(t => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Objetivo Geral */}
          {oficina.objetivo_geral && (
            <Card>
              <CardHeader className="py-3 bg-pe-green-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-success">
                  <Target className="h-4 w-4" />
                  Objetivo Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <p className="text-sm">{oficina.objetivo_geral}</p>
              </CardContent>
            </Card>
          )}

          {/* Objetivos Específicos */}
          {objetivosEspecificos.length > 0 && (
            <Card>
              <CardHeader className="py-3 bg-neutral-50">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-pe-blue-dark">
                  <ListChecks className="h-4 w-4" />
                  Objetivos Específicos ({objetivosEspecificos.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-2">
                {objetivosEspecificos.map((obj) => (
                  <div key={obj.id} className="flex items-start gap-2 text-sm">
                    <span className="text-lg">{obj.emoji || "📌"}</span>
                    <span>{obj.titulo}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Metodologia */}
          <Card>
            <CardHeader className="py-3 bg-pe-orange-lighter">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-warning">
                <BookOpen className="h-4 w-4" />
                Metodologia
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className="capitalize">{oficina.modalidade}</Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {oficina.carga_horaria}h carga horária
                </Badge>
                <Badge variant="outline">
                  {oficina.num_encontros} encontros
                </Badge>
              </div>
              {oficina.metodologia_descricao && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {oficina.metodologia_descricao}
                </p>
              )}
              {etapasEncontros.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Cronograma de Encontros</p>
                  {etapasEncontros.map((etapa, idx) => (
                    <div key={etapa.id} className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                      <span className="font-medium text-warning">{idx + 1}.</span>
                      <span>{etapa.titulo}</span>
                      <Badge variant="outline" className="ml-auto text-xs">{etapa.duracao_horas}h</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Local e Horário */}
          <Card>
            <CardHeader className="py-3 bg-neutral-50">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Local e Horário
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 space-y-3">
              {(oficina.local || oficina.endereco_completo) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{oficina.endereco_completo || oficina.local}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{oficina.horario}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {oficina.dias_semana.map(dia => (
                  <Badge key={dia} variant="outline" className="text-xs capitalize">
                    {dia}
                  </Badge>
                ))}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Início</p>
                  <p className="font-medium">{formatDate(oficina.data_inicio)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Término</p>
                  <p className="font-medium">{formatDate(oficina.data_fim)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Facilitador e Organização */}
          <Card>
            <CardHeader className="py-3 bg-pe-blue-lighter">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
                <User className="h-4 w-4" />
                Facilitador & Organização
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 space-y-3">
              <div className="flex items-center gap-3">
                {oficina.facilitador_avatar && (
                  <img 
                    src={oficina.facilitador_avatar} 
                    alt={oficina.facilitador_nome}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{oficina.facilitador_nome}</p>
                  <p className="text-sm text-muted-foreground">Facilitador(a)</p>
                </div>
              </div>
              {oficina.facilitador_bio && (
                <p className="text-sm text-muted-foreground">{oficina.facilitador_bio}</p>
              )}
              <Separator />
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{oficina.organizacao}</span>
              </div>
            </CardContent>
          </Card>

          {/* Divulgação */}
          {canaisDivulgacao.length > 0 && (
            <Card>
              <CardHeader className="py-3 bg-pe-red-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-secondary">
                  <Megaphone className="h-4 w-4" />
                  Divulgação e Marca
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {canaisDivulgacao.map(canal => (
                    <Badge key={canal} variant="outline" className="text-xs">
                      {canal.split("(")[0].trim()}
                    </Badge>
                  ))}
                </div>
                {marcasParceiras.length > 0 && (
                  <>
                    <Separator />
                    <p className="text-xs font-medium text-muted-foreground uppercase">Marcas Parceiras</p>
                    <div className="flex flex-wrap gap-2">
                      {marcasParceiras.map(marca => (
                        <Badge key={marca.id} variant="secondary" className="text-xs">
                          {marca.nome}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Plano de Mídia */}
          {(oficina.estrategia_campanha || coberturaEvento.length > 0) && (
            <Card>
              <CardHeader className="py-3 bg-pe-blue-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
                  <Radio className="h-4 w-4" />
                  Plano de Mídia
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                {oficina.estrategia_campanha && (
                  <p className="text-sm text-muted-foreground">{oficina.estrategia_campanha}</p>
                )}
                {coberturaEvento.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {coberturaEvento.map(c => (
                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Acessibilidade */}
          {(recursosAcessibilidade.length > 0 || oficina.descricao_acolhimento) && (
            <Card>
              <CardHeader className="py-3 bg-pe-blue-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
                  <Accessibility className="h-4 w-4" />
                  Acessibilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                {recursosAcessibilidade.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recursosAcessibilidade.map(r => (
                      <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
                    ))}
                  </div>
                )}
                {oficina.descricao_acolhimento && (
                  <p className="text-sm text-muted-foreground">{oficina.descricao_acolhimento}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Equipamentos */}
          {equipamentosMateriais.length > 0 && (
            <Card>
              <CardHeader className="py-3 bg-pe-yellow-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-accent-dark">
                  <Package className="h-4 w-4" />
                  Equipamentos ({totalEquipamentos} itens)
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                {equipamentosMateriais.map(cat => (
                  <div key={cat.id}>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">{cat.nome_categoria}</p>
                    <div className="flex flex-wrap gap-1">
                      {cat.itens.map(item => (
                        <Badge key={item.id} variant="secondary" className="text-xs">
                          {item.nome} {item.quantidade > 1 && `(${item.quantidade})`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Público e Cronograma */}
          <Card>
            <CardHeader className="py-3 bg-pe-green-lighter">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-success">
                <Users className="h-4 w-4" />
                Público e Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Vagas</p>
                  <p className="font-medium">{oficina.vagas_total}</p>
                </div>
                {oficina.quantidade_participantes && (
                  <div>
                    <p className="text-muted-foreground text-xs">Participantes</p>
                    <p className="font-medium">{oficina.quantidade_participantes}</p>
                  </div>
                )}
                {(oficina.faixa_etaria_min || oficina.faixa_etaria_max) && (
                  <div>
                    <p className="text-muted-foreground text-xs">Faixa etária</p>
                    <p className="font-medium">{oficina.faixa_etaria_min || 0} - {oficina.faixa_etaria_max || 99} anos</p>
                  </div>
                )}
                {totalEquipe > 0 && (
                  <div>
                    <p className="text-muted-foreground text-xs">Equipe</p>
                    <p className="font-medium">{totalEquipe} pessoas</p>
                  </div>
                )}
              </div>
              {oficina.publico_alvo && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Público-alvo</p>
                    <p className="text-sm">{oficina.publico_alvo}</p>
                  </div>
                </>
              )}
              {oficina.perfil_participante && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Perfil do Participante</p>
                  <p className="text-sm">{oficina.perfil_participante}</p>
                </div>
              )}
              {(oficina.periodo_inscricoes_inicio || oficina.periodo_oficinas_inicio) && (
                <>
                  <Separator />
                  <div className="space-y-2 text-xs">
                    {oficina.periodo_inscricoes_inicio && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Inscrições: {formatDate(oficina.periodo_inscricoes_inicio)} - {formatDate(oficina.periodo_inscricoes_fim)}</span>
                      </div>
                    )}
                    {oficina.periodo_oficinas_inicio && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Oficinas: {formatDate(oficina.periodo_oficinas_inicio)} - {formatDate(oficina.periodo_oficinas_fim)}</span>
                      </div>
                    )}
                    {oficina.periodo_producao_inicio && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Produção: {formatDate(oficina.periodo_producao_inicio)} - {formatDate(oficina.periodo_producao_fim)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Equipe */}
          {totalEquipe > 0 && (
            <Card>
              <CardHeader className="py-3 bg-pe-red-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-secondary">
                  <Users className="h-4 w-4" />
                  Equipe ({totalEquipe})
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                {equipeInstrutores.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Instrutores</p>
                    {equipeInstrutores.map(membro => (
                      <div key={membro.id} className="flex items-center justify-between text-sm py-1">
                        <span>{membro.nome}</span>
                        <Badge variant="outline" className="text-xs">{membro.funcao}</Badge>
                      </div>
                    ))}
                  </div>
                )}
                {equipeApoio.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Apoio</p>
                    {equipeApoio.map(membro => (
                      <div key={membro.id} className="flex items-center justify-between text-sm py-1">
                        <span>{membro.nome}</span>
                        <Badge variant="outline" className="text-xs">{membro.funcao}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Orçamento */}
          {(itensCusto.length > 0 || oficina.orcamento_total) && (
            <Card>
              <CardHeader className="py-3 bg-pe-green-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-success">
                  <DollarSign className="h-4 w-4" />
                  Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-3">
                <div className="text-2xl font-bold text-success">
                  {formatCurrency(oficina.orcamento_total)}
                </div>
                {itensCusto.length > 0 && (
                  <>
                    <div className="text-sm text-muted-foreground">
                      {itensCusto.length} itens • {oficina.reserva_tecnica_percentual || 0}% reserva técnica
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {['equipe', 'equipamento', 'producao', 'divulgacao', 'outros'].map(cat => {
                        const total = itensCusto
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
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resultados Esperados */}
          {(resultadosQuantitativos.length > 0 || oficina.resultados_qualitativos) && (
            <Card className="md:col-span-2">
              <CardHeader className="py-3 bg-yellow-50">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-600">
                  <Trophy className="h-4 w-4" />
                  Resultados Esperados
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resultadosQuantitativos.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Metas Quantitativas</p>
                      <div className="space-y-2">
                        {resultadosQuantitativos.map(r => (
                          <div key={r.id} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span>{r.descricao}: <strong>{r.meta_numerica} {r.unidade}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {oficina.resultados_qualitativos && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Resultados Qualitativos</p>
                      <p className="text-sm text-muted-foreground">{oficina.resultados_qualitativos}</p>
                    </div>
                  )}
                </div>
                {indicadoresSucesso.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Indicadores de Sucesso</p>
                      <div className="flex flex-wrap gap-2">
                        {indicadoresSucesso.map(ind => (
                          <Badge key={ind.id} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {ind.descricao}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Certificado */}
          {oficina.emite_certificado && (
            <Card>
              <CardHeader className="py-3 bg-pe-green-lighter">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-success">
                  <Award className="h-4 w-4" />
                  Certificação
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm">Este curso emite certificado de conclusão</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Para oportunidades (evento, vaga, projeto de bairro)
  const oportunidade = projeto as Oportunidade;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-neutral-200">
        <CardContent className="py-6">
          <h2 className="text-2xl font-bold text-center">{oportunidade.titulo}</h2>
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <Badge className="bg-primary capitalize">{oportunidade.tipo}</Badge>
            {oportunidade.area_cultural && (
              <Badge variant="outline">{oportunidade.area_cultural}</Badge>
            )}
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {oportunidade.duracao}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descrição */}
        {oportunidade.descricao && (
          <Card className="md:col-span-2">
            <CardHeader className="py-3 bg-neutral-50">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{oportunidade.descricao}</p>
            </CardContent>
          </Card>
        )}

        {/* Detalhes do Evento/Vaga */}
        <Card>
          <CardHeader className="py-3 bg-neutral-50">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <Briefcase className="h-4 w-4" />
              Detalhes
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 space-y-3">
            {oportunidade.data_evento && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDate(oportunidade.data_evento)}</span>
              </div>
            )}
            {oportunidade.horario && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{oportunidade.horario}</span>
              </div>
            )}
            {(oportunidade.local || oportunidade.municipio) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {oportunidade.local}{oportunidade.municipio && oportunidade.local ? `, ${oportunidade.municipio}` : oportunidade.municipio}
                </span>
              </div>
            )}
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Vagas</p>
                <p className="font-medium">{oportunidade.vagas || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Duração</p>
                <p className="font-medium">{oportunidade.duracao}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remuneração */}
        <Card>
          <CardHeader className="py-3 bg-pe-green-lighter">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-success">
              <DollarSign className="h-4 w-4" />
              Remuneração
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 space-y-3">
            {(oportunidade.remuneracao && oportunidade.remuneracao > 0) && (
              <div className="text-2xl font-bold text-success">
                {formatCurrency(oportunidade.remuneracao)}
              </div>
            )}
            {(oportunidade.cena_coins && oportunidade.cena_coins > 0) && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg">
                  🪙 {oportunidade.cena_coins} Cena Coins
                </Badge>
              </div>
            )}
            {(!oportunidade.remuneracao && !oportunidade.cena_coins) && (
              <p className="text-sm text-muted-foreground">Não remunerado / a definir</p>
            )}
          </CardContent>
        </Card>

        {/* Responsável */}
        <Card>
          <CardHeader className="py-3 bg-pe-blue-lighter">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
              <User className="h-4 w-4" />
              Responsável
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{oportunidade.criador_nome}</span>
            </div>
            {oportunidade.criador_contato && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{oportunidade.criador_contato}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requisitos */}
        {oportunidade.requisitos && (
          <Card>
            <CardHeader className="py-3 bg-pe-yellow-lighter">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-accent-dark">
                <ListChecks className="h-4 w-4" />
                Requisitos
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{oportunidade.requisitos}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
