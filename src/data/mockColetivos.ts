// Mock data para US-09B, 09C, 09D, 09E — Coletivos culturais

export interface MembroColetivo {
  id: string;
  nome: string;
  foto: string;
  funcao: string;
  status: "ativo" | "inativo";
  representanteLegal: boolean;
  cpf: string;
  nascimento: string;
  genero: string;
  racaCor: string;
  municipio: string;
  endereco?: string;
  cep?: string;
  email: string;
  telefone: string;
  escolaridade: string;
  areaFormacao?: string;
  certificacoes: string[];
  faixaRenda: string;
  situacaoMoradia: string;
  servicosBasicos: {
    agua: boolean;
    energia: boolean;
    coletaLixo: boolean;
    esgoto: boolean;
    internet: boolean;
  };
  vulnerabilidades: string[];
  beneficiarioProgramaSocial: "sim" | "nao" | "prefiro_nao_declarar";
  linguagens: string[];
  tempoAtuacao: number;
  formalizacao: string;
  scoreReputacao: number;
  coletivosRelacionados: {
    nome: string;
    periodo: string;
    status: "ativo" | "encerrado";
    representante?: boolean;
  }[];
}

export interface ProjetoColetivo {
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

export interface Coletivo {
  id: string;
  avatar: string;
  banner?: string;
  nome: string;
  linguagem: string;
  municipio: string;
  membros: number;
  tempoExistencia: number;
  status: "ativo" | "inativo";
  scoreReputacao: number;
  cnpj: string | null;
  descricao: string;
  dataFundacao: string;
  formalizacao: string;
  endereco: string;
  email: string;
  telefone: string;
  redesSociais?: { instagram?: string; facebook?: string };
  ivc: "alta" | "media" | "baixa";
  rendaMediaMembros: number;
  percentAbaixoSM: number;
  escolaridadePredominante: string;
  escolaridadeDistribuicao: { name: string; value: number; percent: number }[];
  servicosBasicos: {
    agua: number;
    energia: number;
    coletaLixo: number;
    esgoto: number;
    internet: number;
  };
  vulnerabilidades: { label: string; percent: number }[];
  membrosLista: MembroColetivo[];
  projetos: ProjetoColetivo[];
  espacosVinculados: EspacoVinculado[];
  totalCaptado: number;
  mediaPublico: number;
  location: [number, number];
}

// =========== Dados socioeconômicos agregados (US-09B) ===========

export const dadosRendaColetivos = [
  { name: "Sem renda", value: 119, percent: 18 },
  { name: "Até R$ 600", value: 159, percent: 24 },
  { name: "R$ 600–1.320", value: 205, percent: 31 },
  { name: "R$ 1.320–2.640", value: 126, percent: 19 },
  { name: "Acima R$ 2.640", value: 53, percent: 8 },
];

export const RENDA_MEDIA_MEMBROS = 890;
export const SALARIO_MINIMO_2025 = 1518;

export const dadosRendaPorLinguagem = [
  { linguagem: "Música", semRenda: 12, ate600: 20, ate1320: 35, ate2640: 23, acima2640: 10 },
  { linguagem: "Cult. Popular", semRenda: 22, ate600: 30, ate1320: 28, ate2640: 14, acima2640: 6 },
  { linguagem: "Artes Visuais", semRenda: 15, ate600: 22, ate1320: 32, ate2640: 21, acima2640: 10 },
  { linguagem: "Teatro", semRenda: 18, ate600: 25, ate1320: 30, ate2640: 19, acima2640: 8 },
  { linguagem: "Dança", semRenda: 20, ate600: 28, ate1320: 30, ate2640: 16, acima2640: 6 },
  { linguagem: "Audiovisual", semRenda: 10, ate600: 15, ate1320: 28, ate2640: 30, acima2640: 17 },
];

export const dadosEscolaridade = [
  { name: "Médio completo", value: 252, percent: 38 },
  { name: "Superior incompleto", value: 146, percent: 22 },
  { name: "Superior completo", value: 113, percent: 17 },
  { name: "Fundamental", value: 93, percent: 14 },
  { name: "Pós-graduação", value: 33, percent: 5 },
  { name: "Sem escolaridade", value: 26, percent: 4 },
];

export const REFERENCIA_SUPERIOR_PE = 30.1; // IBGE SIIC 2024

export const dadosServicosBasicos = [
  { name: "Energia elétrica", percent: 97 },
  { name: "Água encanada", percent: 91 },
  { name: "Coleta de lixo", percent: 84 },
  { name: "Internet em casa", percent: 72 },
  { name: "Esgoto tratado", percent: 61 },
];

export const PERCENT_SEM_SERVICO = 29;

export const dadosVulnerabilidade = [
  { name: "Dependentes sem renda", percent: 41 },
  { name: "Benef. programa social", percent: 34 },
  { name: "Insegurança alimentar", percent: 22 },
  { name: "Familiar com deficiência", percent: 18 },
  { name: "Condição de rua (passada)", percent: 6 },
];

export const PERCENT_COLETIVOS_VULNERAVEL = 67;

export const dadosIVC = [
  { name: "Média vulnerabilidade", value: 291, percent: 44 },
  { name: "Alta vulnerabilidade", value: 205, percent: 31 },
  { name: "Baixa vulnerabilidade", value: 166, percent: 25 },
];

export const IVC_COLORS = [
  "hsl(38, 69%, 50%)",   // warning - média
  "hsl(0, 66%, 48%)",    // destructive - alta
  "hsl(142, 60%, 40%)",  // success - baixa
];

// =========== Coletivos mockados (US-09C, 09D) ===========

const membroAnaLima: MembroColetivo = {
  id: "m1",
  nome: "Ana Cristina Lima",
  foto: "",
  funcao: "Percussionista",
  status: "ativo",
  representanteLegal: true,
  cpf: "123.000.000-45",
  nascimento: "1988-03-12",
  genero: "Mulher cis",
  racaCor: "Parda",
  municipio: "Recife",
  endereco: "Rua do Sol, 100 — Recife, PE",
  cep: "50030-220",
  email: "anacristina@email.com",
  telefone: "(81) 99900-1234",
  escolaridade: "Superior completo",
  areaFormacao: "Licenciatura em Artes Cênicas (UFPE)",
  certificacoes: ["Percussão Afro-brasileira (FUNDARPE 2019)", "Gestão Cultural (ESCULT 2022)"],
  faixaRenda: "R$ 600–1.320",
  situacaoMoradia: "Alugada",
  servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: false, internet: true },
  vulnerabilidades: ["Insegurança alimentar", "2 dependentes sem renda"],
  beneficiarioProgramaSocial: "nao",
  linguagens: ["Percussão", "Dança", "Artes Cênicas"],
  tempoAtuacao: 14,
  formalizacao: "MEI",
  scoreReputacao: 91,
  coletivosRelacionados: [
    { nome: "Maracatu Raízes", periodo: "2013–atual", status: "ativo", representante: true },
    { nome: "Tambores do Recife", periodo: "2010–2015", status: "encerrado" },
    { nome: "Cia. Arte Popular PE", periodo: "2018–2021", status: "encerrado" },
  ],
};

const membroJoaoBarros: MembroColetivo = {
  id: "m2",
  nome: "João Pedro Barros",
  foto: "",
  funcao: "Dançarino",
  status: "ativo",
  representanteLegal: false,
  cpf: "456.000.000-78",
  nascimento: "1995-07-22",
  genero: "Homem cis",
  racaCor: "Preta",
  municipio: "Recife",
  email: "joao.barros@email.com",
  telefone: "(81) 99800-5678",
  escolaridade: "Médio completo",
  certificacoes: ["Dança Contemporânea (SESC 2020)"],
  faixaRenda: "Até R$ 600",
  situacaoMoradia: "Cedida",
  servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: false, internet: false },
  vulnerabilidades: ["Dependente sem renda", "Beneficiário Bolsa Família"],
  beneficiarioProgramaSocial: "sim",
  linguagens: ["Dança", "Percussão"],
  tempoAtuacao: 8,
  formalizacao: "Informal",
  scoreReputacao: 65,
  coletivosRelacionados: [
    { nome: "Maracatu Raízes", periodo: "2017–atual", status: "ativo" },
  ],
};

const membroCarlaSouza: MembroColetivo = {
  id: "m3",
  nome: "Carla Souza",
  foto: "",
  funcao: "Figurinista",
  status: "inativo",
  representanteLegal: false,
  cpf: "789.000.000-12",
  nascimento: "1992-11-05",
  genero: "Mulher cis",
  racaCor: "Branca",
  municipio: "Olinda",
  email: "carla.souza@email.com",
  telefone: "(81) 99700-9012",
  escolaridade: "Superior incompleto",
  certificacoes: [],
  faixaRenda: "R$ 1.320–2.640",
  situacaoMoradia: "Própria",
  servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: true, internet: true },
  vulnerabilidades: [],
  beneficiarioProgramaSocial: "nao",
  linguagens: ["Artes Visuais", "Figurino"],
  tempoAtuacao: 5,
  formalizacao: "MEI",
  scoreReputacao: 58,
  coletivosRelacionados: [
    { nome: "Maracatu Raízes", periodo: "2019–2023", status: "encerrado" },
  ],
};

export const coletivosMock: Coletivo[] = [
  {
    id: "c1",
    avatar: "",
    nome: "Maracatu Raízes",
    linguagem: "Cultura Popular",
    municipio: "Recife",
    membros: 18,
    tempoExistencia: 12,
    status: "ativo",
    scoreReputacao: 87,
    cnpj: "12.345.678/0001-90",
    descricao: "O Maracatu Raízes é um coletivo cultural fundado em 2013 com foco na preservação e difusão do maracatu de baque virado nas comunidades periféricas do Recife. O grupo promove oficinas, cortejos e participação em festivais.",
    dataFundacao: "2013-03-15",
    formalizacao: "Associação Cultural",
    endereco: "Rua do Maracatu, 44 — Recife, PE",
    email: "maracatu.raizes@email.com",
    telefone: "(81) 99900-1234",
    redesSociais: { instagram: "@maracaturaizes", facebook: "maracaturaizes" },
    ivc: "media",
    rendaMediaMembros: 780,
    percentAbaixoSM: 71,
    escolaridadePredominante: "Ensino Médio Completo (56%)",
    escolaridadeDistribuicao: [
      { name: "Médio completo", value: 10, percent: 56 },
      { name: "Superior incompleto", value: 4, percent: 22 },
      { name: "Fundamental", value: 3, percent: 17 },
      { name: "Superior completo", value: 1, percent: 5 },
    ],
    servicosBasicos: { agua: 94, energia: 100, coletaLixo: 89, esgoto: 44, internet: 78 },
    vulnerabilidades: [
      { label: "Insegurança alimentar", percent: 38 },
      { label: "Dependentes sem renda", percent: 52 },
      { label: "Prog. social", percent: 28 },
    ],
    membrosLista: [membroAnaLima, membroJoaoBarros, membroCarlaSouza],
    projetos: [
      { nome: "Maracatu no Bairro", instrumento: "Funcultura", ano: 2023, valor: 48000, status: "concluido" },
      { nome: "Tambores da Periferia", instrumento: "SIC Recife", ano: 2024, valor: 65000, status: "em_execucao" },
      { nome: "Memória Viva", instrumento: "Aldir Blanc", ano: 2022, valor: 32000, status: "concluido" },
    ],
    espacosVinculados: [
      { nome: "Teatro Santa Isabel", tipo: "Teatro", municipio: "Recife" },
      { nome: "Pátio de São Pedro", tipo: "Espaço público", municipio: "Recife" },
    ],
    totalCaptado: 312000,
    mediaPublico: 890,
    location: [-8.063, -34.871],
  },
  {
    id: "c2",
    avatar: "",
    nome: "Slam da Periferia",
    linguagem: "Literatura/Slam",
    municipio: "Olinda",
    membros: 7,
    tempoExistencia: 4,
    status: "ativo",
    scoreReputacao: 72,
    cnpj: null,
    descricao: "Coletivo de poesia falada e slam que promove competições e saraus nas periferias de Olinda e Recife.",
    dataFundacao: "2021-06-10",
    formalizacao: "Informal",
    endereco: "Rua do Amparo, 12 — Olinda, PE",
    email: "slamperiferia@email.com",
    telefone: "(81) 99800-4567",
    ivc: "alta",
    rendaMediaMembros: 620,
    percentAbaixoSM: 85,
    escolaridadePredominante: "Médio completo (57%)",
    escolaridadeDistribuicao: [
      { name: "Médio completo", value: 4, percent: 57 },
      { name: "Superior incompleto", value: 2, percent: 29 },
      { name: "Fundamental", value: 1, percent: 14 },
    ],
    servicosBasicos: { agua: 86, energia: 100, coletaLixo: 71, esgoto: 29, internet: 57 },
    vulnerabilidades: [
      { label: "Insegurança alimentar", percent: 43 },
      { label: "Dependentes sem renda", percent: 57 },
      { label: "Prog. social", percent: 71 },
    ],
    membrosLista: [
      {
        id: "m4", nome: "Lucas Fernandes", foto: "", funcao: "Poeta", status: "ativo",
        representanteLegal: true, cpf: "111.000.000-01", nascimento: "1998-01-15",
        genero: "Homem cis", racaCor: "Preta", municipio: "Olinda",
        email: "lucas.f@email.com", telefone: "(81) 99100-0001",
        escolaridade: "Médio completo", certificacoes: [], faixaRenda: "Até R$ 600",
        situacaoMoradia: "Alugada",
        servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: false, internet: false },
        vulnerabilidades: ["Dependente sem renda", "Beneficiário Bolsa Família"],
        beneficiarioProgramaSocial: "sim", linguagens: ["Literatura", "Slam"],
        tempoAtuacao: 4, formalizacao: "Informal", scoreReputacao: 70,
        coletivosRelacionados: [{ nome: "Slam da Periferia", periodo: "2021–atual", status: "ativo", representante: true }],
      },
      {
        id: "m5", nome: "Mariana Costa", foto: "", funcao: "Slammer", status: "ativo",
        representanteLegal: false, cpf: "111.000.000-02", nascimento: "2001-05-22",
        genero: "Mulher cis", racaCor: "Parda", municipio: "Olinda",
        email: "mariana.c@email.com", telefone: "(81) 99100-0002",
        escolaridade: "Superior incompleto", certificacoes: [], faixaRenda: "Sem renda",
        situacaoMoradia: "Cedida",
        servicosBasicos: { agua: true, energia: true, coletaLixo: false, esgoto: false, internet: true },
        vulnerabilidades: ["Insegurança alimentar"],
        beneficiarioProgramaSocial: "sim", linguagens: ["Literatura", "Teatro"],
        tempoAtuacao: 3, formalizacao: "Informal", scoreReputacao: 62,
        coletivosRelacionados: [{ nome: "Slam da Periferia", periodo: "2022–atual", status: "ativo" }],
      },
      {
        id: "m6", nome: "Rafael Oliveira", foto: "", funcao: "Produtor", status: "ativo",
        representanteLegal: false, cpf: "111.000.000-03", nascimento: "1993-11-08",
        genero: "Homem cis", racaCor: "Parda", municipio: "Recife",
        email: "rafael.o@email.com", telefone: "(81) 99100-0003",
        escolaridade: "Médio completo", certificacoes: ["Produção Cultural (SESC 2022)"],
        faixaRenda: "R$ 600–1.320", situacaoMoradia: "Própria",
        servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: false, internet: true },
        vulnerabilidades: [], beneficiarioProgramaSocial: "nao",
        linguagens: ["Literatura", "Música"], tempoAtuacao: 6, formalizacao: "MEI", scoreReputacao: 74,
        coletivosRelacionados: [{ nome: "Slam da Periferia", periodo: "2021–atual", status: "ativo" }],
      },
      {
        id: "m7", nome: "Tatiana Reis", foto: "", funcao: "Poeta", status: "ativo",
        representanteLegal: false, cpf: "111.000.000-04", nascimento: "1990-07-30",
        genero: "Mulher cis", racaCor: "Preta", municipio: "Olinda",
        email: "tatiana.r@email.com", telefone: "(81) 99100-0004",
        escolaridade: "Fundamental", certificacoes: [], faixaRenda: "Até R$ 600",
        situacaoMoradia: "Alugada",
        servicosBasicos: { agua: true, energia: true, coletaLixo: false, esgoto: false, internet: false },
        vulnerabilidades: ["Dependente sem renda", "Insegurança alimentar"],
        beneficiarioProgramaSocial: "sim", linguagens: ["Literatura", "Cultura Popular"],
        tempoAtuacao: 5, formalizacao: "Informal", scoreReputacao: 55,
        coletivosRelacionados: [{ nome: "Slam da Periferia", periodo: "2022–atual", status: "ativo" }],
      },
    ],
    projetos: [
      { nome: "Slam nas Escolas", instrumento: "Funcultura", ano: 2023, valor: 25000, status: "concluido" },
    ],
    espacosVinculados: [
      { nome: "Centro Cultural de Olinda", tipo: "Centro Cultural", municipio: "Olinda" },
    ],
    totalCaptado: 25000,
    mediaPublico: 320,
    location: [-8.009, -34.855],
  },
  {
    id: "c3",
    avatar: "",
    nome: "Cia. Movimento Livre",
    linguagem: "Dança",
    municipio: "Caruaru",
    membros: 11,
    tempoExistencia: 8,
    status: "ativo",
    scoreReputacao: 81,
    cnpj: "98.765.432/0001-11",
    descricao: "Companhia de dança contemporânea com sede em Caruaru que explora a interseção entre tradição e modernidade.",
    dataFundacao: "2017-01-20",
    formalizacao: "MEI Coletivo",
    endereco: "Av. Agamenon Magalhães, 500 — Caruaru, PE",
    email: "movimentolivre@email.com",
    telefone: "(81) 99600-7890",
    ivc: "media",
    rendaMediaMembros: 950,
    percentAbaixoSM: 55,
    escolaridadePredominante: "Superior incompleto (36%)",
    escolaridadeDistribuicao: [
      { name: "Superior incompleto", value: 4, percent: 36 },
      { name: "Médio completo", value: 3, percent: 27 },
      { name: "Superior completo", value: 3, percent: 27 },
      { name: "Pós-graduação", value: 1, percent: 10 },
    ],
    servicosBasicos: { agua: 100, energia: 100, coletaLixo: 91, esgoto: 73, internet: 82 },
    vulnerabilidades: [
      { label: "Dependentes sem renda", percent: 36 },
      { label: "Prog. social", percent: 18 },
    ],
    membrosLista: [
      {
        id: "m8", nome: "Fernanda Alves", foto: "", funcao: "Coreógrafa", status: "ativo",
        representanteLegal: true, cpf: "222.000.000-01", nascimento: "1987-04-10",
        genero: "Mulher cis", racaCor: "Branca", municipio: "Caruaru",
        email: "fernanda.a@email.com", telefone: "(81) 99200-0001",
        escolaridade: "Superior completo", areaFormacao: "Licenciatura em Dança (UFPE)",
        certificacoes: ["Dança Contemporânea (FGV 2020)"], faixaRenda: "R$ 1.320–2.640",
        situacaoMoradia: "Própria",
        servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: true, internet: true },
        vulnerabilidades: [], beneficiarioProgramaSocial: "nao",
        linguagens: ["Dança", "Artes Cênicas"], tempoAtuacao: 12, formalizacao: "MEI", scoreReputacao: 88,
        coletivosRelacionados: [{ nome: "Cia. Movimento Livre", periodo: "2017–atual", status: "ativo", representante: true }],
      },
      {
        id: "m9", nome: "Diego Santos", foto: "", funcao: "Bailarino", status: "ativo",
        representanteLegal: false, cpf: "222.000.000-02", nascimento: "1996-09-18",
        genero: "Homem cis", racaCor: "Parda", municipio: "Caruaru",
        email: "diego.s@email.com", telefone: "(81) 99200-0002",
        escolaridade: "Superior incompleto", certificacoes: [],
        faixaRenda: "R$ 600–1.320", situacaoMoradia: "Alugada",
        servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: true, internet: true },
        vulnerabilidades: ["Dependente sem renda"], beneficiarioProgramaSocial: "nao",
        linguagens: ["Dança", "Música"], tempoAtuacao: 7, formalizacao: "Informal", scoreReputacao: 72,
        coletivosRelacionados: [{ nome: "Cia. Movimento Livre", periodo: "2018–atual", status: "ativo" }],
      },
      {
        id: "m10", nome: "Patrícia Lima", foto: "", funcao: "Bailarina", status: "ativo",
        representanteLegal: false, cpf: "222.000.000-03", nascimento: "2000-02-25",
        genero: "Mulher cis", racaCor: "Preta", municipio: "Caruaru",
        email: "patricia.l@email.com", telefone: "(81) 99200-0003",
        escolaridade: "Superior incompleto", certificacoes: ["Dança Afro (SESC 2023)"],
        faixaRenda: "Até R$ 600", situacaoMoradia: "Cedida",
        servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: false, internet: true },
        vulnerabilidades: ["Insegurança alimentar"], beneficiarioProgramaSocial: "sim",
        linguagens: ["Dança"], tempoAtuacao: 4, formalizacao: "Informal", scoreReputacao: 65,
        coletivosRelacionados: [{ nome: "Cia. Movimento Livre", periodo: "2021–atual", status: "ativo" }],
      },
      {
        id: "m11", nome: "Marcos Vieira", foto: "", funcao: "Iluminador", status: "ativo",
        representanteLegal: false, cpf: "222.000.000-04", nascimento: "1985-12-01",
        genero: "Homem cis", racaCor: "Parda", municipio: "Caruaru",
        email: "marcos.v@email.com", telefone: "(81) 99200-0004",
        escolaridade: "Pós-graduação", areaFormacao: "Artes Cênicas",
        certificacoes: ["Iluminação Cênica (SP Escola de Teatro 2018)"],
        faixaRenda: "R$ 1.320–2.640", situacaoMoradia: "Própria",
        servicosBasicos: { agua: true, energia: true, coletaLixo: true, esgoto: true, internet: true },
        vulnerabilidades: [], beneficiarioProgramaSocial: "nao",
        linguagens: ["Dança", "Teatro", "Artes Visuais"], tempoAtuacao: 15, formalizacao: "MEI", scoreReputacao: 82,
        coletivosRelacionados: [{ nome: "Cia. Movimento Livre", periodo: "2017–atual", status: "ativo" }],
      },
    ],
    projetos: [
      { nome: "Corpo e Território", instrumento: "SIC Recife", ano: 2024, valor: 55000, status: "em_execucao" },
      { nome: "Dança na Praça", instrumento: "Lei Paulo Gustavo", ano: 2023, valor: 42000, status: "concluido" },
    ],
    espacosVinculados: [
      { nome: "Teatro Rui Limeira", tipo: "Teatro", municipio: "Caruaru" },
    ],
    totalCaptado: 97000,
    mediaPublico: 650,
    location: [-8.283, -35.971],
  },
  {
    id: "c4",
    avatar: "",
    nome: "Coletivo Canoa",
    linguagem: "Audiovisual",
    municipio: "Petrolina",
    membros: 5,
    tempoExistencia: 2,
    status: "inativo",
    scoreReputacao: 45,
    cnpj: null,
    descricao: "Coletivo de produção audiovisual independente focado em documentários sobre a cultura ribeirinha do São Francisco.",
    dataFundacao: "2023-04-01",
    formalizacao: "Informal",
    endereco: "Rua do Rio, 78 — Petrolina, PE",
    email: "coletivocanoa@email.com",
    telefone: "(87) 99500-3456",
    ivc: "alta",
    rendaMediaMembros: 540,
    percentAbaixoSM: 80,
    escolaridadePredominante: "Médio completo (60%)",
    escolaridadeDistribuicao: [
      { name: "Médio completo", value: 3, percent: 60 },
      { name: "Fundamental", value: 1, percent: 20 },
      { name: "Superior incompleto", value: 1, percent: 20 },
    ],
    servicosBasicos: { agua: 80, energia: 100, coletaLixo: 60, esgoto: 20, internet: 40 },
    vulnerabilidades: [
      { label: "Insegurança alimentar", percent: 60 },
      { label: "Dependentes sem renda", percent: 40 },
      { label: "Condição de rua (passada)", percent: 20 },
    ],
    membrosLista: [],
    projetos: [],
    espacosVinculados: [],
    totalCaptado: 0,
    mediaPublico: 0,
    location: [-9.389, -40.502],
  },
  {
    id: "c5",
    avatar: "",
    nome: "Grupo Rabeca Viva",
    linguagem: "Música",
    municipio: "Recife",
    membros: 9,
    tempoExistencia: 6,
    status: "ativo",
    scoreReputacao: 79,
    cnpj: "55.123.456/0001-33",
    descricao: "Grupo musical dedicado à preservação da rabeca e da música tradicional pernambucana com projetos educacionais.",
    dataFundacao: "2019-08-12",
    formalizacao: "Associação Cultural",
    endereco: "Rua da Rabeca, 33 — Recife, PE",
    email: "rabecaviva@email.com",
    telefone: "(81) 99400-6789",
    redesSociais: { instagram: "@rabecaviva" },
    ivc: "baixa",
    rendaMediaMembros: 1250,
    percentAbaixoSM: 33,
    escolaridadePredominante: "Superior completo (44%)",
    escolaridadeDistribuicao: [
      { name: "Superior completo", value: 4, percent: 44 },
      { name: "Médio completo", value: 3, percent: 33 },
      { name: "Pós-graduação", value: 2, percent: 23 },
    ],
    servicosBasicos: { agua: 100, energia: 100, coletaLixo: 100, esgoto: 89, internet: 100 },
    vulnerabilidades: [
      { label: "Dependentes sem renda", percent: 22 },
    ],
    membrosLista: [],
    projetos: [
      { nome: "Rabeca na Escola", instrumento: "Funcultura", ano: 2023, valor: 38000, status: "concluido" },
      { nome: "Sons do Sertão", instrumento: "Lei Paulo Gustavo", ano: 2024, valor: 50000, status: "em_execucao" },
    ],
    espacosVinculados: [
      { nome: "Paço do Frevo", tipo: "Museu", municipio: "Recife" },
      { nome: "Marco Zero", tipo: "Espaço público", municipio: "Recife" },
    ],
    totalCaptado: 188000,
    mediaPublico: 720,
    location: [-8.057, -34.877],
  },
];
