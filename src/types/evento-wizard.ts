// Tipos para o Wizard de Criação de Eventos - 10 Steps

// ===============================================
// CONSTANTES DE OPÇÕES
// ===============================================

export const TIPOS_EVENTO = [
  "Show/Apresentação Musical",
  "Espetáculo de Teatro",
  "Espetáculo de Dança",
  "Festival/Mostra",
  "Sarau/Slam",
  "Exposição",
  "Feira Cultural",
  "Roda de Conversa/Encontro",
  "Evento Híbrido",
  "Outro",
] as const;

export const LINGUAGENS_ARTISTICAS_EVENTO = [
  "Música",
  "Teatro",
  "Dança",
  "Artes Visuais",
  "Audiovisual",
  "Literatura",
  "Circo",
  "Cultura Popular",
  "Performance",
  "Multidisciplinar",
] as const;

export const TIPOS_ESPACO = [
  "Teatro/Casa de Espetáculos",
  "Centro Cultural",
  "Praça/Espaço Público",
  "Bar/Restaurante",
  "Clube/Associação",
  "Escola/Universidade",
  "Galpão/Espaço Alternativo",
  "Arena/Estádio",
  "Museu/Galeria",
  "Igreja/Templo",
  "Outro",
] as const;

export const PLATAFORMAS_TRANSMISSAO = [
  "YouTube",
  "Instagram",
  "Twitch",
  "Zoom",
  "Outro",
] as const;

export const CLASSIFICACOES_ETARIAS = [
  "Livre",
  "10 anos",
  "12 anos",
  "14 anos",
  "16 anos",
  "18 anos",
] as const;

export const MODALIDADES_EVENTO = ["presencial", "online", "hibrido"] as const;

export const CANAIS_DIVULGACAO_EVENTO = [
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
  "WhatsApp (grupos/comunidades)",
  "Twitter/X",
  "Spotify (playlists)",
  "Rádios (comerciais e comunitárias)",
  "TV",
  "Jornais/Revistas",
  "Sites especializados (Sympla, Eventbrite, etc.)",
  "Cartazes físicos",
  "Panfletagem",
  "Parcerias com influenciadores",
  "Assessoria de imprensa",
] as const;

export const RECURSOS_ACESSIBILIDADE_EVENTO = {
  fisica: [
    "Rampa de acesso",
    "Banheiro adaptado",
    "Área reservada para cadeirantes",
    "Piso tátil",
    "Estacionamento preferencial",
  ],
  comunicacional: [
    "Intérprete de Libras",
    "Legendas em tempo real",
    "Audiodescrição",
    "Materiais em braile",
    "Materiais em linguagem simples",
    "Sinalização visual clara",
  ],
  sensorial: [
    "Área de baixo estímulo sensorial",
    "Protetor auricular disponível",
    "Iluminação adaptada",
  ],
  acolhimento: [
    "Equipe treinada para atendimento inclusivo",
    "Espaço para amamentação",
    "Espaço kids",
    "Área de descompressão",
    "Atendimento prioritário",
  ],
} as const;

export const CRITERIOS_SELECAO = [
  "Qualidade técnica do portfólio",
  "Aderência ao perfil do evento",
  "Experiência prévia",
  "Diversidade (território, gênero, raça)",
  "Artistas em formação (prioridade CENA)",
  "Proposta artística inovadora",
  "Disponibilidade na data",
] as const;

export const PROCESSOS_SELECAO = [
  "Análise de portfólio apenas",
  "Análise de portfólio + entrevista",
  "Audição presencial",
  "Audição por vídeo",
  "Sorteio entre inscritos qualificados",
  "Curadoria da organização",
] as const;

export const ESTRUTURAS_EVENTO = [
  "Gerador de energia",
  "Palco",
  "Tendas/Coberturas",
  "Arquibancada",
  "Banheiros químicos",
  "Camarim",
  "Área de alimentação",
  "Área técnica/mesa de som",
  "Gradil/Cercamento",
  "Pórtico/Entrada",
  "Iluminação cênica",
  "Telão/Projeção",
  "Sistema de som (PA)",
] as const;

export const ALVARAS_EVENTO = [
  "Alvará de funcionamento do local",
  "Licença para evento",
  "Autorização da Prefeitura",
  "Autorização ECAD",
  "Auto de Vistoria do Corpo de Bombeiros (AVCB)",
  "Seguro de responsabilidade civil",
] as const;

export const REGISTRO_DOCUMENTACAO = [
  "Fotos profissionais",
  "Vídeo documentário",
  "Transmissão ao vivo gravada",
  "Clipping de mídia",
  "Relatório de público",
  "Pesquisa de satisfação",
  "Depoimentos de artistas",
  "Conteúdo para redes sociais",
] as const;

export const FAIXAS_ETARIAS_PUBLICO = [
  "Crianças (até 12 anos)",
  "Adolescentes (13-17 anos)",
  "Jovens adultos (18-29 anos)",
  "Adultos (30-59 anos)",
  "Idosos (60+ anos)",
  "Todas as idades",
] as const;

export const CATEGORIAS_CUSTO_EVENTO = [
  "artistica",
  "tecnica",
  "producao",
  "locacao",
  "divulgacao",
  "acessibilidade",
  "alimentacao",
  "transporte",
  "seguranca",
  "outros",
] as const;

// ===============================================
// TIPOS DE DADOS ESTRUTURADOS
// ===============================================

export interface TipoIngresso {
  id: string;
  nome: string;
  valor: number;
  quantidade_disponivel?: number;
}

export interface Atracao {
  id: string;
  tipo: "confirmada" | "a_contratar_cena" | "a_definir";
  nome?: string;
  linguagem: string;
  descricao: string;
  horario_inicio: string;
  horario_fim: string;
  duracao_minutos: number;
  palco_area?: string;
  cache_previsto?: number;
  perfil_desejado?: string;
  quantidade_vagas?: number;
}

export interface Palco {
  id: string;
  nome: string;
  capacidade?: number;
  atracoes: Atracao[];
}

export interface VagaArtista {
  id: string;
  titulo: string;
  linguagem: string;
  quantidade: number;
  cache_por_apresentacao: number;
  duracao_apresentacao: number;
  requisitos: string;
  diferenciais?: string;
  equipamentos_fornecidos: string[];
  equipamentos_artista_traz: string[];
}

export interface FaseDivulgacao {
  id: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  acoes: string;
  canais: string[];
}

export interface MarcaEvento {
  id: string;
  nome: string;
  tipo: "realizacao" | "patrocinio_master" | "patrocinio" | "apoio" | "apoio_cultural" | "parceria_midia";
  logo_url?: string;
  posicao_destaque: number;
}

export interface MembroEquipeEvento {
  id: string;
  funcao: string;
  categoria: "producao" | "tecnica" | "apoio";
  quantidade: number;
  valor_unitario: number;
  tipo_contratacao: "diaria" | "evento_completo" | "hora";
  fonte: "interna" | "terceirizada" | "voluntario";
}

export interface ItemCustoEvento {
  id: string;
  item: string;
  categoria: typeof CATEGORIAS_CUSTO_EVENTO[number];
  quantidade: number;
  valor_unitario: number;
  total: number;
  fonte: "automatico" | "manual";
}

export interface FonteReceita {
  id: string;
  fonte: "bilheteria" | "patrocinio" | "edital" | "bar" | "venda_produtos" | "outro";
  descricao: string;
  valor_estimado: number;
}

export interface ResultadoQuantitativoEvento {
  id: string;
  descricao: string;
  meta_numerica: number;
  unidade: string;
}

export interface IndicadorEvento {
  id: string;
  indicador: string;
  meta: string;
  forma_medicao: string;
}

// ===============================================
// ESTADO COMPLETO DO WIZARD
// ===============================================

export interface EventoWizardData {
  // Step 1: Informações Básicas
  nome_evento: string;
  tipo_evento: string;
  linguagem_principal: string;
  linguagens_secundarias: string[];
  descricao_evento: string;
  edicao_versao?: string;

  // Step 2: Data, Local e Formato
  formato_duracao: "unico_dia" | "multiplos_dias";
  data_evento?: string;
  data_inicio?: string;
  data_fim?: string;
  horario_inicio: string;
  horario_termino: string;
  horario_abertura_portoes?: string;
  modalidade: typeof MODALIDADES_EVENTO[number];
  nome_local?: string;
  tipo_espaco?: string;
  endereco_completo?: string;
  bairro?: string;
  capacidade_local?: number;
  link_transmissao?: string;
  plataforma_transmissao?: string;
  classificacao_etaria: string;
  evento_com_ingresso: boolean;
  valor_ingresso?: number;
  tipos_ingresso: TipoIngresso[];
  link_venda?: string;

  // Step 3: Programação e Atrações
  estrutura_programacao: "atracao_unica" | "multiplas_atracoes" | "por_palco";
  atracoes: Atracao[];
  palcos: Palco[];

  // Step 4: Vagas para Artistas CENA
  descricao_geral_vagas: string;
  vagas_artistas: VagaArtista[];
  periodo_inscricoes_inicio?: string;
  periodo_inscricoes_fim?: string;
  criterios_selecao: string[];
  processo_selecao: string;

  // Step 5: Divulgação e Comunicação
  canais_divulgacao: string[];
  fases_divulgacao: FaseDivulgacao[];
  marcas: MarcaEvento[];

  // Step 6: Acessibilidade
  recursos_acessibilidade: string[];
  descricao_acessibilidade: string;
  momentos_interpretacao_libras?: string[];

  // Step 7: Público e Equipe
  publico_esperado: number;
  perfil_publico: string;
  faixas_etarias_publico: string[];
  equipe_producao: MembroEquipeEvento[];
  equipe_tecnica: MembroEquipeEvento[];
  equipe_apoio: MembroEquipeEvento[];

  // Step 8: Planilha de Custos
  itens_custo: ItemCustoEvento[];
  reserva_tecnica_percentual: number;
  incluir_receitas: boolean;
  fontes_receita: FonteReceita[];
  orcamento_total: number;

  // Step 9: Infraestrutura e Logística
  estruturas_necessarias: string[];
  detalhamento_estrutura?: string;
  rider_tecnico_url?: string;
  necessidades_camarim?: string;
  horario_montagem?: string;
  horario_desmontagem?: string;
  estacionamento?: "disponivel" | "nao_disponivel" | "pago";
  alvaras_necessarios: string[];
  responsavel_documentacao: string;

  // Step 10: Resultados Esperados
  resultados_quantitativos: ResultadoQuantitativoEvento[];
  resultados_qualitativos: string;
  impacto_artistas_cena?: string;
  registro_documentacao: string[];
  indicadores: IndicadorEvento[];

  // Controle
  step_atual: number;
  status_wizard: "rascunho" | "completo" | "publicado";
}

// ===============================================
// ESTADO INICIAL
// ===============================================

export const EVENTO_WIZARD_INITIAL_STATE: EventoWizardData = {
  nome_evento: "",
  tipo_evento: "",
  linguagem_principal: "",
  linguagens_secundarias: [],
  descricao_evento: "",
  edicao_versao: "",
  formato_duracao: "unico_dia",
  horario_inicio: "",
  horario_termino: "",
  modalidade: "presencial",
  classificacao_etaria: "Livre",
  evento_com_ingresso: false,
  tipos_ingresso: [],
  estrutura_programacao: "multiplas_atracoes",
  atracoes: [],
  palcos: [],
  descricao_geral_vagas: "",
  vagas_artistas: [],
  criterios_selecao: [],
  processo_selecao: "",
  canais_divulgacao: [],
  fases_divulgacao: [],
  marcas: [],
  recursos_acessibilidade: [],
  descricao_acessibilidade: "",
  publico_esperado: 100,
  perfil_publico: "",
  faixas_etarias_publico: [],
  equipe_producao: [],
  equipe_tecnica: [],
  equipe_apoio: [],
  itens_custo: [],
  reserva_tecnica_percentual: 10,
  incluir_receitas: false,
  fontes_receita: [],
  orcamento_total: 0,
  estruturas_necessarias: [],
  alvaras_necessarios: [],
  responsavel_documentacao: "",
  resultados_quantitativos: [],
  resultados_qualitativos: "",
  registro_documentacao: [],
  indicadores: [],
  step_atual: 1,
  status_wizard: "rascunho",
};

// ===============================================
// CONFIGURAÇÃO DOS STEPS
// ===============================================

export const EVENTO_WIZARD_STEPS = [
  { id: 1, key: "informacoes_basicas", label: "Informações Básicas", icon: "FileText" },
  { id: 2, key: "data_local", label: "Data, Local e Formato", icon: "MapPin" },
  { id: 3, key: "programacao", label: "Programação e Atrações", icon: "Music" },
  { id: 4, key: "vagas_artistas", label: "Vagas para Artistas", icon: "Users", condicional: true },
  { id: 5, key: "divulgacao", label: "Divulgação", icon: "Megaphone" },
  { id: 6, key: "acessibilidade", label: "Acessibilidade", icon: "Accessibility" },
  { id: 7, key: "publico_equipe", label: "Público e Equipe", icon: "UserCheck" },
  { id: 8, key: "custos", label: "Planilha de Custos", icon: "DollarSign" },
  { id: 9, key: "infraestrutura", label: "Infraestrutura", icon: "Building" },
  { id: 10, key: "resultados", label: "Resultados Esperados", icon: "Trophy" },
  { id: 11, key: "preview", label: "Preview e Publicar", icon: "Eye" },
] as const;

// ===============================================
// VALIDAÇÕES POR STEP
// ===============================================

export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

// Step 1: Informações Básicas
export function validateEventoStep1(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (!data.nome_evento || data.nome_evento.length < 5) {
    errors.push("Nome do evento deve ter pelo menos 5 caracteres");
  }
  if (data.nome_evento.length > 100) {
    errors.push("Nome do evento deve ter no máximo 100 caracteres");
  }
  if (!data.tipo_evento) {
    errors.push("Selecione o tipo de evento");
  }
  if (!data.linguagem_principal) {
    errors.push("Selecione a linguagem artística principal");
  }
  if (!data.descricao_evento || data.descricao_evento.length < 200) {
    errors.push("Descrição do evento deve ter pelo menos 200 caracteres");
  }
  if (data.descricao_evento.length > 2000) {
    errors.push("Descrição do evento deve ter no máximo 2000 caracteres");
  }

  return { isValid: errors.length === 0, errors };
}

// Step 2: Data, Local e Formato
export function validateEventoStep2(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (data.formato_duracao === "unico_dia" && !data.data_evento) {
    errors.push("Informe a data do evento");
  }
  if (data.formato_duracao === "multiplos_dias") {
    if (!data.data_inicio) errors.push("Informe a data de início");
    if (!data.data_fim) errors.push("Informe a data de término");
    if (data.data_inicio && data.data_fim && new Date(data.data_fim) < new Date(data.data_inicio)) {
      errors.push("Data de término deve ser igual ou posterior à data de início");
    }
  }
  if (!data.horario_inicio) {
    errors.push("Informe o horário de início");
  }
  if (!data.horario_termino) {
    errors.push("Informe o horário de término");
  }
  if (!data.modalidade) {
    errors.push("Selecione a modalidade do evento");
  }
  
  const isPresencial = data.modalidade === "presencial" || data.modalidade === "hibrido";
  const isOnline = data.modalidade === "online" || data.modalidade === "hibrido";

  if (isPresencial) {
    if (!data.nome_local) errors.push("Informe o nome do local");
    if (!data.tipo_espaco) errors.push("Selecione o tipo de espaço");
    if (!data.endereco_completo) errors.push("Informe o endereço completo");
    if (!data.bairro) errors.push("Informe o bairro");
    if (!data.capacidade_local || data.capacidade_local < 10) {
      errors.push("Capacidade do local deve ser de pelo menos 10 pessoas");
    }
  }
  if (isOnline) {
    if (!data.link_transmissao) errors.push("Informe o link da transmissão");
    if (!data.plataforma_transmissao) errors.push("Selecione a plataforma de transmissão");
  }

  if (!data.classificacao_etaria) {
    errors.push("Selecione a classificação etária");
  }

  if (data.evento_com_ingresso && (data.valor_ingresso === undefined || data.valor_ingresso < 0)) {
    errors.push("Informe o valor do ingresso");
  }

  return { isValid: errors.length === 0, errors };
}

// Step 3: Programação e Atrações
export function validateEventoStep3(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (!data.estrutura_programacao) {
    errors.push("Selecione a estrutura da programação");
  }

  if (data.estrutura_programacao === "por_palco") {
    if (data.palcos.length < 2) {
      errors.push("Adicione pelo menos 2 palcos/áreas");
    }
    const totalAtracoes = data.palcos.reduce((acc, p) => acc + p.atracoes.length, 0);
    if (totalAtracoes === 0) {
      errors.push("Adicione pelo menos uma atração");
    }
  } else {
    if (data.atracoes.length === 0) {
      errors.push("Adicione pelo menos uma atração");
    }
  }

  // Validar atrações
  const todasAtracoes = data.estrutura_programacao === "por_palco" 
    ? data.palcos.flatMap(p => p.atracoes)
    : data.atracoes;

  todasAtracoes.forEach((atracao, index) => {
    if (atracao.tipo === "confirmada" && !atracao.nome) {
      errors.push(`Atração ${index + 1}: informe o nome do artista`);
    }
    if (!atracao.linguagem) {
      errors.push(`Atração ${index + 1}: selecione a linguagem artística`);
    }
    if (atracao.tipo === "a_contratar_cena") {
      if (!atracao.cache_previsto || atracao.cache_previsto <= 0) {
        errors.push(`Atração ${index + 1}: informe o cachê previsto`);
      }
      if (!atracao.quantidade_vagas || atracao.quantidade_vagas < 1) {
        errors.push(`Atração ${index + 1}: informe a quantidade de vagas`);
      }
    }
  });

  return { isValid: errors.length === 0, errors };
}

// Step 4: Vagas para Artistas (condicional)
export function validateEventoStep4(data: EventoWizardData): StepValidation {
  const errors: string[] = [];
  
  // Este step só é obrigatório se houver atrações a_contratar_cena
  const temVagas = hasVagasParaArtistas(data);
  if (!temVagas) {
    return { isValid: true, errors: [] };
  }

  if (!data.descricao_geral_vagas || data.descricao_geral_vagas.length < 100) {
    errors.push("Descrição geral das vagas deve ter pelo menos 100 caracteres");
  }
  if (data.descricao_geral_vagas.length > 500) {
    errors.push("Descrição geral das vagas deve ter no máximo 500 caracteres");
  }

  if (data.vagas_artistas.length === 0) {
    errors.push("Adicione pelo menos uma vaga");
  }

  if (!data.periodo_inscricoes_inicio || !data.periodo_inscricoes_fim) {
    errors.push("Defina o período de inscrições");
  }

  // RN4.1: Período de inscrições deve terminar 7 dias antes do evento
  const dataEvento = data.formato_duracao === "unico_dia" ? data.data_evento : data.data_inicio;
  if (dataEvento && data.periodo_inscricoes_fim) {
    const diffDias = Math.ceil(
      (new Date(dataEvento).getTime() - new Date(data.periodo_inscricoes_fim).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDias < 7) {
      errors.push("O período de inscrições deve terminar pelo menos 7 dias antes do evento");
    }
  }

  if (data.criterios_selecao.length === 0) {
    errors.push("Selecione pelo menos um critério de seleção");
  }

  if (!data.processo_selecao) {
    errors.push("Selecione o processo de seleção");
  }

  return { isValid: errors.length === 0, errors };
}

// Step 5: Divulgação
export function validateEventoStep5(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (data.canais_divulgacao.length === 0) {
    errors.push("Selecione pelo menos um canal de divulgação");
  }

  if (data.fases_divulgacao.length === 0) {
    errors.push("Adicione pelo menos uma fase de divulgação");
  }

  // RN5.3: Primeira fase deve começar pelo menos 14 dias antes do evento
  const dataEvento = data.formato_duracao === "unico_dia" ? data.data_evento : data.data_inicio;
  if (dataEvento && data.fases_divulgacao.length > 0) {
    const primeiraFase = data.fases_divulgacao.sort(
      (a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime()
    )[0];
    
    const diffDias = Math.ceil(
      (new Date(dataEvento).getTime() - new Date(primeiraFase.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDias < 14) {
      errors.push("A primeira fase de divulgação deve começar pelo menos 14 dias antes do evento");
    }
  }

  return { isValid: errors.length === 0, errors };
}

// Step 6: Acessibilidade
export function validateEventoStep6(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (data.recursos_acessibilidade.length === 0) {
    errors.push("Selecione pelo menos um recurso de acessibilidade");
  }

  // RN6.1: Se presencial, pelo menos 2 recursos físicos são recomendados
  const isPresencial = data.modalidade === "presencial" || data.modalidade === "hibrido";
  if (isPresencial) {
    const recursosFisicos = data.recursos_acessibilidade.filter(r => 
      RECURSOS_ACESSIBILIDADE_EVENTO.fisica.includes(r as any)
    );
    if (recursosFisicos.length < 2) {
      errors.push("Para eventos presenciais, recomenda-se pelo menos 2 recursos de acessibilidade física");
    }
  }

  // RN6.3: Eventos com mais de 500 pessoas devem ter pelo menos 5 recursos
  if (data.publico_esperado > 500 && data.recursos_acessibilidade.length < 5) {
    errors.push("Eventos com mais de 500 pessoas devem ter no mínimo 5 recursos de acessibilidade");
  }

  if (!data.descricao_acessibilidade || data.descricao_acessibilidade.length < 50) {
    errors.push("Descrição da acessibilidade deve ter pelo menos 50 caracteres");
  }
  if (data.descricao_acessibilidade.length > 500) {
    errors.push("Descrição da acessibilidade deve ter no máximo 500 caracteres");
  }

  // Se Intérprete de Libras selecionado, verificar momentos
  if (data.recursos_acessibilidade.includes("Intérprete de Libras") && 
      (!data.momentos_interpretacao_libras || data.momentos_interpretacao_libras.length === 0)) {
    errors.push("Informe os momentos com interpretação em Libras");
  }

  return { isValid: errors.length === 0, errors };
}

// Step 7: Público e Equipe
export function validateEventoStep7(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  // RN7.1: Público esperado não pode exceder capacidade do local
  if (data.capacidade_local && data.publico_esperado > data.capacidade_local) {
    errors.push("Público esperado não pode exceder a capacidade do local");
  }

  if (data.publico_esperado < 10) {
    errors.push("Público esperado deve ser de pelo menos 10 pessoas");
  }

  if (!data.perfil_publico || data.perfil_publico.length < 50) {
    errors.push("Perfil do público deve ter pelo menos 50 caracteres");
  }
  if (data.perfil_publico.length > 500) {
    errors.push("Perfil do público deve ter no máximo 500 caracteres");
  }

  if (data.faixas_etarias_publico.length === 0) {
    errors.push("Selecione pelo menos uma faixa etária do público");
  }

  if (data.equipe_producao.length === 0) {
    errors.push("Adicione pelo menos um membro da equipe de produção");
  }

  // RN7.4: Se público > 500, brigadista é obrigatório
  if (data.publico_esperado > 500) {
    const temBrigadista = [...data.equipe_producao, ...data.equipe_tecnica, ...data.equipe_apoio]
      .some(m => m.funcao.toLowerCase().includes("brigadista"));
    if (!temBrigadista) {
      errors.push("Eventos com mais de 500 pessoas devem ter brigadista na equipe");
    }
  }

  return { isValid: errors.length === 0, errors };
}

// Step 8: Planilha de Custos
export function validateEventoStep8(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (data.itens_custo.length === 0) {
    errors.push("Adicione pelo menos um item de custo");
  }

  const totalCustos = data.itens_custo.reduce((acc, i) => acc + i.total, 0);
  if (totalCustos <= 0) {
    errors.push("O orçamento total deve ser maior que zero");
  }

  // RN8.3: Categoria artística deve representar pelo menos 30% do total
  const custoArtistico = data.itens_custo
    .filter(i => i.categoria === "artistica")
    .reduce((acc, i) => acc + i.total, 0);
  
  if (totalCustos > 0 && (custoArtistico / totalCustos) < 0.3) {
    // Apenas warning, não bloqueia
    // errors.push("Recomenda-se que a categoria artística represente pelo menos 30% do orçamento");
  }

  if (data.incluir_receitas) {
    const totalReceitas = data.fontes_receita.reduce((acc, r) => acc + r.valor_estimado, 0);
    if (totalReceitas < totalCustos) {
      // Warning de déficit, não bloqueia
    }
  }

  return { isValid: errors.length === 0, errors };
}

// Step 9: Infraestrutura e Logística
export function validateEventoStep9(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (data.estruturas_necessarias.length > 0 && (!data.detalhamento_estrutura || data.detalhamento_estrutura.length < 50)) {
    errors.push("Detalhe as estruturas necessárias (mínimo 50 caracteres)");
  }

  if (!data.horario_montagem) {
    errors.push("Informe o horário de montagem");
  }

  if (!data.horario_desmontagem) {
    errors.push("Informe o horário de desmontagem");
  }

  // RN9.3: Horário de montagem deve ser pelo menos 4h antes do evento
  if (data.horario_montagem && data.horario_inicio) {
    // Simplificado - validação de horário
  }

  if (!data.responsavel_documentacao) {
    errors.push("Informe o responsável pela documentação");
  }

  // RN9.1: Se evento em espaço público, alvarás municipais são obrigatórios
  if (data.tipo_espaco === "Praça/Espaço Público" && 
      !data.alvaras_necessarios.includes("Autorização da Prefeitura")) {
    errors.push("Para eventos em espaço público, autorização da Prefeitura é obrigatória");
  }

  // RN9.2: Se público > 1000, AVCB é obrigatório
  if (data.publico_esperado > 1000 && 
      !data.alvaras_necessarios.includes("Auto de Vistoria do Corpo de Bombeiros (AVCB)")) {
    errors.push("Para eventos com mais de 1000 pessoas, AVCB é obrigatório");
  }

  return { isValid: errors.length === 0, errors };
}

// Step 10: Resultados Esperados
export function validateEventoStep10(data: EventoWizardData): StepValidation {
  const errors: string[] = [];

  if (data.resultados_quantitativos.length < 3) {
    errors.push("Adicione pelo menos 3 resultados quantitativos");
  }

  if (!data.resultados_qualitativos || data.resultados_qualitativos.length < 100) {
    errors.push("Resultados qualitativos devem ter pelo menos 100 caracteres");
  }
  if (data.resultados_qualitativos.length > 1000) {
    errors.push("Resultados qualitativos devem ter no máximo 1000 caracteres");
  }

  // RN10.1: Se houver vagas para artistas CENA, impacto é obrigatório
  if (hasVagasParaArtistas(data) && (!data.impacto_artistas_cena || data.impacto_artistas_cena.length < 50)) {
    errors.push("Descreva o impacto para artistas CENA (mínimo 50 caracteres)");
  }

  if (data.registro_documentacao.length === 0) {
    errors.push("Selecione pelo menos um tipo de registro/documentação");
  }

  // RN10.3: Pelo menos um tipo de registro fotográfico é obrigatório
  if (!data.registro_documentacao.includes("Fotos profissionais")) {
    errors.push("Fotos profissionais são obrigatórias para documentação");
  }

  return { isValid: errors.length === 0, errors };
}

// ===============================================
// FUNÇÕES AUXILIARES
// ===============================================

export function hasVagasParaArtistas(data: EventoWizardData): boolean {
  const todasAtracoes = data.estrutura_programacao === "por_palco"
    ? data.palcos.flatMap(p => p.atracoes)
    : data.atracoes;
  
  return todasAtracoes.some(a => a.tipo === "a_contratar_cena");
}

export function calcularTotalCaches(data: EventoWizardData): number {
  const todasAtracoes = data.estrutura_programacao === "por_palco"
    ? data.palcos.flatMap(p => p.atracoes)
    : data.atracoes;
  
  return todasAtracoes
    .filter(a => a.cache_previsto)
    .reduce((acc, a) => acc + (a.cache_previsto! * (a.quantidade_vagas || 1)), 0);
}

export function calcularTotalEquipe(data: EventoWizardData): number {
  const todasEquipes = [...data.equipe_producao, ...data.equipe_tecnica, ...data.equipe_apoio];
  return todasEquipes.reduce((acc, m) => acc + (m.quantidade * m.valor_unitario), 0);
}

export function gerarItensCustoAutomaticos(data: EventoWizardData): ItemCustoEvento[] {
  const itens: ItemCustoEvento[] = [];

  // Cachês das atrações
  const todasAtracoes = data.estrutura_programacao === "por_palco"
    ? data.palcos.flatMap(p => p.atracoes)
    : data.atracoes;

  todasAtracoes.forEach(atracao => {
    if (atracao.cache_previsto && atracao.cache_previsto > 0) {
      itens.push({
        id: `cache-${atracao.id}`,
        item: `Cachê - ${atracao.nome || atracao.perfil_desejado || 'Atração'}`,
        categoria: "artistica",
        quantidade: atracao.quantidade_vagas || 1,
        valor_unitario: atracao.cache_previsto,
        total: atracao.cache_previsto * (atracao.quantidade_vagas || 1),
        fonte: "automatico",
      });
    }
  });

  // Equipe
  [...data.equipe_producao, ...data.equipe_tecnica, ...data.equipe_apoio].forEach(membro => {
    if (membro.valor_unitario > 0) {
      const categoria = membro.categoria === "producao" ? "producao" : 
                       membro.categoria === "tecnica" ? "tecnica" : "seguranca";
      itens.push({
        id: `equipe-${membro.id}`,
        item: membro.funcao,
        categoria,
        quantidade: membro.quantidade,
        valor_unitario: membro.valor_unitario,
        total: membro.quantidade * membro.valor_unitario,
        fonte: "automatico",
      });
    }
  });

  // Intérprete de Libras
  if (data.recursos_acessibilidade.includes("Intérprete de Libras")) {
    itens.push({
      id: "acess-libras",
      item: "Intérprete de Libras",
      categoria: "acessibilidade",
      quantidade: 1,
      valor_unitario: 500,
      total: 500,
      fonte: "automatico",
    });
  }

  // Brigadista para eventos grandes
  if (data.publico_esperado > 500) {
    const numBrigadistas = Math.ceil(data.publico_esperado / 500);
    itens.push({
      id: "seg-brigadista",
      item: "Brigadista",
      categoria: "seguranca",
      quantidade: numBrigadistas,
      valor_unitario: 300,
      total: numBrigadistas * 300,
      fonte: "automatico",
    });
  }

  return itens;
}
