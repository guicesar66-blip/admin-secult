// Tipos para o Wizard de Criação de Vaga de Emprego - 7 Steps

// ===============================================
// CONSTANTES DE OPÇÕES
// ===============================================

export const AREAS_CULTURAIS_VAGA = [
  "Música",
  "Teatro",
  "Dança",
  "Artes Visuais",
  "Audiovisual / Cinema",
  "Literatura",
  "Circo",
  "Cultura Popular",
  "Performance",
  "Produção Cultural",
  "Gestão Cultural",
  "Comunicação e Marketing Cultural",
  "Educação Artística",
  "Patrimônio Cultural",
  "Artesanato",
  "Multidisciplinar",
  "Outra",
] as const;

export const TIPOS_CONTRATO = [
  "CLT (Carteira Assinada)",
  "PJ (Pessoa Jurídica)",
  "Freelancer / Autônomo",
  "Temporário",
  "Estágio",
  "Voluntário",
  "Bolsa / Auxílio",
  "Outro",
] as const;

export const MODALIDADES_TRABALHO = [
  "Presencial",
  "Remoto",
  "Híbrido",
] as const;

export const REGIMES_JORNADA = [
  "Integral (40h/semana)",
  "Meio período (20h/semana)",
  "Por projeto",
  "Fins de semana",
  "Noturno",
  "Flexível",
  "Outro",
] as const;

export const NIVEIS_EXPERIENCIA = [
  "Sem experiência (Júnior)",
  "1 a 2 anos",
  "2 a 5 anos",
  "Acima de 5 anos",
  "Não especificado",
] as const;

export const NIVEIS_ESCOLARIDADE = [
  "Ensino Fundamental",
  "Ensino Médio",
  "Ensino Superior em andamento",
  "Ensino Superior completo",
  "Pós-graduação",
  "Não exigido",
] as const;

export const BENEFICIOS_OPCOES = [
  "Vale-transporte",
  "Vale-refeição / Alimentação",
  "Plano de saúde",
  "Plano odontológico",
  "FGTS",
  "Férias remuneradas",
  "13º salário",
  "Auxílio home office",
  "Seguro de vida",
  "Participação nos lucros",
  "Cursos e capacitações",
] as const;

export const ETAPAS_PROCESSO_SELETIVO = [
  "Análise de currículo",
  "Teste prático / Portfólio",
  "Entrevista online",
  "Entrevista presencial",
  "Prova de conhecimentos",
  "Dinâmica de grupo",
  "Apresentação de projeto",
] as const;

export const MUNICIPIOS_PE = [
  "Recife",
  "Olinda",
  "Caruaru",
  "Petrolina",
  "CARUARU",
  "Paulista",
  "Camaçari",
  "Jaboatão dos Guararapes",
  "Abreu e Lima",
  "Camaragibe",
  "São Lourenço da Mata",
  "Cabo de Santo Agostinho",
  "Igarassu",
  "Ipojuca",
  "Vitória de Santo Antão",
  "Santa Cruz do Capibaribe",
  "Garanhuns",
  "Outros",
] as const;

// ===============================================
// TIPOS PRINCIPAIS
// ===============================================

export interface VagaWizardData {
  // Step 1 - Informações Básicas
  titulo: string;
  area_cultural: string;
  descricao: string;

  // Step 2 - Local e Modalidade
  modalidade: string;
  local: string;
  municipio: string;
  bairro: string;

  // Step 3 - Carga Horária e Período
  tipo_contrato: string;
  regime_jornada: string;
  horario_trabalho: string;
  data_inicio: string;
  data_fim: string;
  periodo_determinado: boolean;

  // Step 4 - Remuneração e Benefícios
  remuneracao_valor: number | null;
  remuneracao_a_combinar: boolean;
  beneficios: string[];
  observacoes_remuneracao: string;

  // Step 5 - Vagas e Requisitos
  num_vagas: number;
  nivel_experiencia: string;
  escolaridade_minima: string;
  requisitos_obrigatorios: string;
  requisitos_desejaveis: string;
  habilidades: string[];

  // Step 6 - Processo Seletivo
  prazo_inscricao: string;
  etapas_selecao: string[];
  como_candidatar: string;
  informacoes_adicionais: string;
}

export const VAGA_WIZARD_STEPS = [
  {
    id: 1,
    title: "Informações Básicas",
    description: "Título, área cultural e descrição da vaga",
    icon: "FileText",
  },
  {
    id: 2,
    title: "Local e Modalidade",
    description: "Onde e como o trabalho será realizado",
    icon: "MapPin",
  },
  {
    id: 3,
    title: "Carga Horária",
    description: "Regime de trabalho, jornada e período",
    icon: "Clock",
  },
  {
    id: 4,
    title: "Remuneração e Benefícios",
    description: "Salário, benefícios e condições financeiras",
    icon: "DollarSign",
  },
  {
    id: 5,
    title: "Vagas e Requisitos",
    description: "Número de vagas, perfil e competências exigidas",
    icon: "Users",
  },
  {
    id: 6,
    title: "Processo Seletivo",
    description: "Prazo, etapas e como se candidatar",
    icon: "ClipboardList",
  },
  {
    id: 7,
    title: "Revisão e Publicação",
    description: "Confira todas as informações antes de publicar",
    icon: "Eye",
  },
] as const;

export const VAGA_WIZARD_INITIAL_STATE: VagaWizardData = {
  titulo: "",
  area_cultural: "",
  descricao: "",
  modalidade: "",
  local: "",
  municipio: "",
  bairro: "",
  tipo_contrato: "",
  regime_jornada: "",
  horario_trabalho: "",
  data_inicio: "",
  data_fim: "",
  periodo_determinado: false,
  remuneracao_valor: null,
  remuneracao_a_combinar: false,
  beneficios: [],
  observacoes_remuneracao: "",
  num_vagas: 1,
  nivel_experiencia: "",
  escolaridade_minima: "",
  requisitos_obrigatorios: "",
  requisitos_desejaveis: "",
  habilidades: [],
  prazo_inscricao: "",
  etapas_selecao: [],
  como_candidatar: "",
  informacoes_adicionais: "",
};

// ===============================================
// VALIDAÇÕES POR STEP
// ===============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateVagaStep1(data: VagaWizardData): ValidationResult {
  const errors: string[] = [];
  if (!data.titulo.trim()) errors.push("O título da vaga é obrigatório.");
  if (data.titulo.length > 100) errors.push("O título deve ter no máximo 100 caracteres.");
  if (!data.area_cultural) errors.push("A área cultural é obrigatória.");
  if (!data.descricao.trim()) errors.push("A descrição da vaga é obrigatória.");
  if (data.descricao.length < 100) errors.push(`A descrição deve ter pelo menos 100 caracteres (faltam ${100 - data.descricao.length}).`);
  return { isValid: errors.length === 0, errors };
}

export function validateVagaStep2(data: VagaWizardData): ValidationResult {
  const errors: string[] = [];
  if (!data.modalidade) errors.push("A modalidade de trabalho é obrigatória.");
  if (data.modalidade !== "Remoto") {
    if (!data.municipio) errors.push("O município é obrigatório para vagas presenciais.");
    if (!data.local.trim()) errors.push("O local de trabalho é obrigatório.");
  }
  return { isValid: errors.length === 0, errors };
}

export function validateVagaStep3(data: VagaWizardData): ValidationResult {
  const errors: string[] = [];
  if (!data.tipo_contrato) errors.push("O tipo de contrato é obrigatório.");
  if (!data.regime_jornada) errors.push("O regime de jornada é obrigatório.");
  if (!data.horario_trabalho.trim()) errors.push("O horário de trabalho é obrigatório.");
  return { isValid: errors.length === 0, errors };
}

export function validateVagaStep4(data: VagaWizardData): ValidationResult {
  const errors: string[] = [];
  if (!data.remuneracao_a_combinar && (data.remuneracao_valor === null || data.remuneracao_valor <= 0)) {
    errors.push("Informe o valor da remuneração ou marque como 'a combinar'.");
  }
  return { isValid: errors.length === 0, errors };
}

export function validateVagaStep5(data: VagaWizardData): ValidationResult {
  const errors: string[] = [];
  if (!data.num_vagas || data.num_vagas < 1) errors.push("O número de vagas deve ser pelo menos 1.");
  if (!data.nivel_experiencia) errors.push("O nível de experiência é obrigatório.");
  if (!data.requisitos_obrigatorios.trim()) errors.push("Os requisitos obrigatórios são necessários.");
  return { isValid: errors.length === 0, errors };
}

export function validateVagaStep6(data: VagaWizardData): ValidationResult {
  const errors: string[] = [];
  if (!data.prazo_inscricao) errors.push("O prazo de inscrição é obrigatório.");
  if (!data.como_candidatar.trim()) errors.push("Informe como o candidato deve se candidatar.");
  return { isValid: errors.length === 0, errors };
}
