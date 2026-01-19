// Tipos para o Wizard de Criação de Oficinas - 11 Steps

// Constantes de opções
export const LINGUAGENS_ARTISTICAS = [
  "Música",
  "Teatro",
  "Dança",
  "Artes Visuais",
  "Audiovisual",
  "Literatura",
  "Circo",
  "Cultura Popular",
  "Multidisciplinar",
] as const;

export const TERRITORIOS_RMR = [
  // Recife
  "Boa Viagem",
  "Boa Vista",
  "Casa Amarela",
  "Casa Forte",
  "Derby",
  "Espinheiro",
  "Graças",
  "Ibura",
  "Imbiribeira",
  "Ipsep",
  "Madalena",
  "Pina",
  "Recife Antigo",
  "Santo Amaro",
  "Torre",
  "Várzea",
  // RMR
  "Olinda",
  "Jaboatão dos Guararapes",
  "Paulista",
  "Cabo de Santo Agostinho",
  "Camaragibe",
  "Igarassu",
  "São Lourenço da Mata",
  "Abreu e Lima",
  "Ipojuca",
  "Outro",
] as const;

export const MODALIDADES = ["presencial", "online", "hibrido"] as const;

export const CANAIS_DIVULGACAO = [
  "Redes sociais (Instagram, Facebook, TikTok)",
  "WhatsApp (grupos/comunidades)",
  "Cartazes e folders físicos",
  "Cartazes e folders digitais",
  "Rádios comunitárias",
  "Parcerias com escolas",
  "Parcerias com coletivos culturais",
  "Email marketing",
  "Imprensa local",
] as const;

export const RECURSOS_ACESSIBILIDADE = [
  "Legendas em português nos materiais",
  "Intérprete de Libras nos encontros",
  "Audiodescrição",
  "Espaço físico acessível (rampa, banheiro adaptado)",
  "Materiais em linguagem simples",
  "Materiais em braile",
  "Apoio individual para participantes com dificuldades",
] as const;

export const COBERTURA_EVENTO = [
  "Transmissão ao vivo",
  "Fotos profissionais",
  "Vídeo documentário",
  "Podcast/áudio",
  "Release para imprensa",
] as const;

// Tipos de dados estruturados
export interface ObjetivoEspecifico {
  id: string;
  titulo: string;
  descricao?: string;
  emoji?: string;
}

export interface EtapaEncontro {
  id: string;
  titulo: string;
  descricao?: string;
  duracao_horas: number;
  modalidade: typeof MODALIDADES[number];
}

export interface MarcaParceira {
  id: string;
  nome: string;
  tipo: "patrocinador" | "apoio" | "realizacao";
  logo_url?: string;
}

export interface ParceriaMidia {
  id: string;
  nome: string;
  tipo_parceria: string;
  contato?: string;
}

export interface CategoriaEquipamento {
  id: string;
  nome_categoria: string;
  itens: ItemEquipamento[];
}

export interface ItemEquipamento {
  id: string;
  nome: string;
  quantidade: number;
  tipo: "proprio" | "aluguel" | "compra";
  valor_unitario?: number;
}

export interface MembroEquipe {
  id: string;
  funcao: string;
  quantidade: number;
  valor_por_pessoa: number;
}

export interface ItemCusto {
  id: string;
  item: string;
  categoria: "equipe" | "equipamento" | "locacao" | "producao" | "divulgacao" | "acessibilidade" | "outros";
  quantidade: number;
  valor_unitario: number;
  total: number;
  fonte: "automatico" | "manual";
}

export interface ResultadoQuantitativo {
  id: string;
  descricao: string;
  meta_numerica: number;
  unidade: string;
}

export interface IndicadorSucesso {
  id: string;
  indicador: string;
  meta: string;
}

// Estado completo do wizard
export interface OficinaWizardData {
  // Step 1: Justificativa
  titulo: string;
  justificativa: string;
  linguagem_artistica: string;
  territorios: string[];

  // Step 2: Objetivo Geral
  objetivo_geral: string;

  // Step 3: Objetivos Específicos
  objetivos_especificos: ObjetivoEspecifico[];

  // Step 4: Metodologia
  modalidade: typeof MODALIDADES[number];
  metodologia_descricao: string;
  etapas_encontros: EtapaEncontro[];
  local?: string;
  endereco_completo?: string;

  // Step 5: Divulgação e Marca
  canais_divulgacao: string[];
  descricao_divulgacao: string;
  marcas_parceiras: MarcaParceira[];

  // Step 6: Plano de Mídia
  estrategia_campanha: string;
  parcerias_midia: ParceriaMidia[];
  cobertura_evento: string[];

  // Step 7: Acessibilidade e Acolhimento
  recursos_acessibilidade: string[];
  descricao_acolhimento: string;

  // Step 8: Equipamentos e Materiais
  equipamentos_materiais: CategoriaEquipamento[];

  // Step 9: Público e Cronograma
  quantidade_participantes: number;
  faixa_etaria_min: number;
  faixa_etaria_max: number;
  prerequisitos?: string;
  perfil_participante: string;
  equipe_instrutores: MembroEquipe[];
  equipe_apoio: MembroEquipe[];
  periodo_inscricoes_inicio?: string;
  periodo_inscricoes_fim?: string;
  periodo_oficinas_inicio?: string;
  periodo_oficinas_fim?: string;
  periodo_producao_inicio?: string;
  periodo_producao_fim?: string;
  data_evento_final?: string;
  tamanho_grupos: number;

  // Step 10: Planilha de Custos
  itens_custo: ItemCusto[];
  reserva_tecnica_percentual: number;
  orcamento_total: number;

  // Step 11: Resultados Esperados
  resultados_quantitativos: ResultadoQuantitativo[];
  resultados_qualitativos: string;
  indicadores_sucesso: IndicadorSucesso[];

  // Controle
  step_atual: number;
  status_wizard: "rascunho" | "completo" | "publicado";
}

// Estado inicial vazio
export const OFICINA_WIZARD_INITIAL_STATE: OficinaWizardData = {
  titulo: "",
  justificativa: "",
  linguagem_artistica: "",
  territorios: [],
  objetivo_geral: "",
  objetivos_especificos: [],
  modalidade: "presencial",
  metodologia_descricao: "",
  etapas_encontros: [],
  canais_divulgacao: [],
  descricao_divulgacao: "",
  marcas_parceiras: [],
  estrategia_campanha: "",
  parcerias_midia: [],
  cobertura_evento: [],
  recursos_acessibilidade: [],
  descricao_acolhimento: "",
  equipamentos_materiais: [],
  quantidade_participantes: 30,
  faixa_etaria_min: 18,
  faixa_etaria_max: 60,
  perfil_participante: "",
  equipe_instrutores: [],
  equipe_apoio: [],
  tamanho_grupos: 5,
  itens_custo: [],
  reserva_tecnica_percentual: 10,
  orcamento_total: 0,
  resultados_quantitativos: [],
  resultados_qualitativos: "",
  indicadores_sucesso: [],
  step_atual: 1,
  status_wizard: "rascunho",
};

// Configuração dos steps
export const WIZARD_STEPS = [
  { id: 1, key: "justificativa", label: "Justificativa", icon: "FileText" },
  { id: 2, key: "objetivo_geral", label: "Objetivo Geral", icon: "Target" },
  { id: 3, key: "objetivos_especificos", label: "Objetivos Específicos", icon: "ListChecks" },
  { id: 4, key: "metodologia", label: "Metodologia", icon: "BookOpen" },
  { id: 5, key: "divulgacao", label: "Divulgação e Marca", icon: "Megaphone" },
  { id: 6, key: "plano_midia", label: "Plano de Mídia", icon: "Radio" },
  { id: 7, key: "acessibilidade", label: "Acessibilidade", icon: "Accessibility" },
  { id: 8, key: "equipamentos", label: "Equipamentos", icon: "Package" },
  { id: 9, key: "publico_cronograma", label: "Público e Cronograma", icon: "Users" },
  { id: 10, key: "custos", label: "Planilha de Custos", icon: "DollarSign" },
  { id: 11, key: "resultados", label: "Resultados Esperados", icon: "Trophy" },
] as const;

// Validações por step
export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

export function validateStep1(data: OficinaWizardData): StepValidation {
  const errors: string[] = [];
  
  if (!data.titulo || data.titulo.length < 5) {
    errors.push("Título deve ter pelo menos 5 caracteres");
  }
  if (data.titulo.length > 100) {
    errors.push("Título deve ter no máximo 100 caracteres");
  }
  if (!data.justificativa || data.justificativa.length < 200) {
    errors.push("Justificativa deve ter pelo menos 200 caracteres");
  }
  if (data.justificativa.length > 2000) {
    errors.push("Justificativa deve ter no máximo 2000 caracteres");
  }
  if (!data.linguagem_artistica) {
    errors.push("Selecione uma linguagem artística");
  }
  if (data.territorios.length === 0) {
    errors.push("Selecione pelo menos um território");
  }

  return { isValid: errors.length === 0, errors };
}

export function validateStep2(data: OficinaWizardData): StepValidation {
  const errors: string[] = [];
  
  if (!data.objetivo_geral || data.objetivo_geral.length < 50) {
    errors.push("Objetivo geral deve ter pelo menos 50 caracteres");
  }
  if (data.objetivo_geral.length > 500) {
    errors.push("Objetivo geral deve ter no máximo 500 caracteres");
  }

  return { isValid: errors.length === 0, errors };
}

export function validateStep3(data: OficinaWizardData): StepValidation {
  const errors: string[] = [];
  
  if (data.objetivos_especificos.length < 3) {
    errors.push("Adicione pelo menos 3 objetivos específicos");
  }
  if (data.objetivos_especificos.length > 10) {
    errors.push("Máximo de 10 objetivos específicos");
  }

  return { isValid: errors.length === 0, errors };
}

export function validateStep4(data: OficinaWizardData): StepValidation {
  const errors: string[] = [];
  
  if (!data.modalidade) {
    errors.push("Selecione a modalidade");
  }
  if (!data.metodologia_descricao || data.metodologia_descricao.length < 200) {
    errors.push("Descrição da metodologia deve ter pelo menos 200 caracteres");
  }
  if (data.metodologia_descricao.length > 2000) {
    errors.push("Descrição da metodologia deve ter no máximo 2000 caracteres");
  }
  if (data.etapas_encontros.length < 1) {
    errors.push("Adicione pelo menos uma etapa/encontro");
  }
  if ((data.modalidade === "presencial" || data.modalidade === "hibrido") && !data.local) {
    errors.push("Informe o local das atividades");
  }

  return { isValid: errors.length === 0, errors };
}
