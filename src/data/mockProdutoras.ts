// Mock data: Produtoras — grupos de artistas ou artistas solo que criam projetos culturais

export interface ProjetoProdutora {
  nome: string;
  instrumento: string;
  ano: number;
  valor: number;
  status: "concluido" | "em_execucao" | "cancelado";
}

export interface EspacoVinculado {
  nome: string;
  tipo: string;
  municipio: string;
}

export interface Produtora {
  id: string;
  nome: string;
  descricao: string;
  linguagem_principal: string;
  municipio: string;
  codigo_municipio: string;
  distrito?: string;
  estado: string;
  endereco: string;
  // Formalização flexível
  tipo_formalizacao?: string;  // "MEI", "ME", "Associação Cultural", "Informal", "Coletivo"
  cnpj?: string | null;
  // Contatos profissionais
  email: string;
  telefone: string;
  website?: string;
  redes_sociais?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    tiktok?: string;
  };
  // Visual
  avatar?: string;
  banner?: string;
  fotos_galeria?: string[];
  // Dados profissionais
  data_fundacao: string;
  status: "ativo" | "inativo";
  score_reputacao: number;
  ivc: "alta" | "media" | "baixa";
  total_captado: number;
  media_publico: number;
  // Relacionamentos
  projetos: ProjetoProdutora[];
  espacos_vinculados: EspacoVinculado[];
  // Geolocalização
  location: [number, number];
}

// =========== Constantes de referência ===========
export const SALARIO_MINIMO_2025 = 1518;
export const REFERENCIA_SUPERIOR_PE = 30.1; // IBGE SIIC 2024

export const IVC_COLORS = [
  "hsl(38, 69%, 50%)",   // warning - média
  "hsl(0, 66%, 48%)",    // destructive - alta
  "hsl(142, 60%, 40%)",  // success - baixa
];

// =========== PRODUTORAS MOCK ===========
export const produtorasMock: Produtora[] = [
  {
    id: "p1",
    nome: "Maracatu Raízes",
    descricao: "O Maracatu Raízes é uma produtora cultural fundada em 2013 com foco na preservação e difusão do maracatu de baque virado nas comunidades periféricas do Recife. Promove oficinas, cortejos e participação em festivais.",
    linguagem_principal: "Cultura Popular",
    municipio: "Recife", codigo_municipio: "2611606", distrito: "Recife", estado: "PE",
    endereco: "Rua do Maracatu, 44 — Recife, PE",
    tipo_formalizacao: "Associação Cultural",
    cnpj: "12.345.678/0001-90",
    email: "maracatu.raizes@email.com", telefone: "(81) 99900-1234",
    redes_sociais: { instagram: "@maracaturaizes", facebook: "maracaturaizes" },
    avatar: "", banner: "",
    data_fundacao: "2013-03-15", status: "ativo", score_reputacao: 87,
    ivc: "media", total_captado: 312000, media_publico: 890,
    projetos: [
      { nome: "Maracatu no Bairro", instrumento: "Funcultura", ano: 2023, valor: 48000, status: "concluido" },
      { nome: "Tambores da Periferia", instrumento: "SIC Recife", ano: 2024, valor: 65000, status: "em_execucao" },
      { nome: "Memória Viva", instrumento: "Aldir Blanc", ano: 2022, valor: 32000, status: "concluido" },
    ],
    espacos_vinculados: [
      { nome: "Teatro Santa Isabel", tipo: "Teatro", municipio: "Recife" },
      { nome: "Pátio de São Pedro", tipo: "Espaço público", municipio: "Recife" },
    ],
    location: [-8.063, -34.871],
  },
  {
    id: "p2",
    nome: "Slam da Periferia",
    descricao: "Produtora de poesia falada e slam que promove competições e saraus nas periferias de Olinda e Recife.",
    linguagem_principal: "Literatura/Slam",
    municipio: "Olinda", estado: "PE",
    endereco: "Rua do Amparo, 12 — Olinda, PE",
    tipo_formalizacao: "Informal",
    cnpj: null,
    email: "slamperiferia@email.com", telefone: "(81) 99800-4567",
    data_fundacao: "2021-06-10", status: "ativo", score_reputacao: 72,
    ivc: "alta", total_captado: 25000, media_publico: 320,
    projetos: [
      { nome: "Slam nas Escolas", instrumento: "Funcultura", ano: 2023, valor: 25000, status: "concluido" },
    ],
    espacos_vinculados: [
      { nome: "Centro Cultural de Olinda", tipo: "Centro Cultural", municipio: "Olinda" },
    ],
    location: [-8.009, -34.855],
  },
  {
    id: "p3",
    nome: "Cia. Movimento Livre",
    descricao: "Companhia de dança contemporânea com sede em Caruaru que explora a interseção entre tradição e modernidade.",
    linguagem_principal: "Dança",
    municipio: "Caruaru", estado: "PE",
    endereco: "Av. Agamenon Magalhães, 500 — Caruaru, PE",
    tipo_formalizacao: "MEI",
    cnpj: "98.765.432/0001-11",
    email: "movimentolivre@email.com", telefone: "(81) 99600-7890",
    data_fundacao: "2017-01-20", status: "ativo", score_reputacao: 81,
    ivc: "media", total_captado: 97000, media_publico: 650,
    projetos: [
      { nome: "Corpo e Território", instrumento: "SIC Recife", ano: 2024, valor: 55000, status: "em_execucao" },
      { nome: "Dança na Praça", instrumento: "Lei Paulo Gustavo", ano: 2023, valor: 42000, status: "concluido" },
    ],
    espacos_vinculados: [
      { nome: "Teatro Rui Limeira", tipo: "Teatro", municipio: "Caruaru" },
    ],
    location: [-8.283, -35.971],
  },
  {
    id: "p4",
    nome: "Coletivo Canoa",
    descricao: "Produtora de conteúdo audiovisual independente focada em documentários sobre a cultura ribeirinha do São Francisco.",
    linguagem_principal: "Audiovisual",
    municipio: "Petrolina", estado: "PE",
    endereco: "Rua do Rio, 78 — Petrolina, PE",
    tipo_formalizacao: "Informal",
    cnpj: null,
    email: "coletivocanoa@email.com", telefone: "(87) 99500-3456",
    data_fundacao: "2023-04-01", status: "inativo", score_reputacao: 45,
    ivc: "alta", total_captado: 0, media_publico: 0,
    projetos: [],
    espacos_vinculados: [],
    location: [-9.389, -40.502],
  },
  {
    id: "p5",
    nome: "Grupo Rabeca Viva",
    descricao: "Grupo musical dedicado à preservação da rabeca e da música tradicional pernambucana com projetos educacionais.",
    linguagem_principal: "Música",
    municipio: "Recife", estado: "PE",
    endereco: "Rua da Rabeca, 33 — Recife, PE",
    tipo_formalizacao: "Associação Cultural",
    cnpj: "55.123.456/0001-33",
    email: "rabecaviva@email.com", telefone: "(81) 99400-6789",
    redes_sociais: { instagram: "@rabecaviva" },
    avatar: "", banner: "",
    data_fundacao: "2019-08-12", status: "ativo", score_reputacao: 79,
    ivc: "baixa", total_captado: 188000, media_publico: 720,
    projetos: [
      { nome: "Rabeca na Escola", instrumento: "Funcultura", ano: 2023, valor: 38000, status: "concluido" },
      { nome: "Sons do Sertão", instrumento: "Lei Paulo Gustavo", ano: 2024, valor: 50000, status: "em_execucao" },
    ],
    espacos_vinculados: [
      { nome: "Paço do Frevo", tipo: "Museu", municipio: "Recife" },
      { nome: "Marco Zero", tipo: "Espaço público", municipio: "Recife" },
    ],
    location: [-8.057, -34.877],
  },
];
