// Mock data: Projetos culturais — tabela central para a ABA 4
// Referencia produtoras, municípios, linguagens e equipamentos existentes

import { produtorasMock } from "./mockProdutoras";
import { equipamentosMock } from "./mockEquipamentosCulturais";

// ===== TIPOS =====
export type StatusProjeto = "ativo" | "concluido" | "pendencia" | "irregular" | "cancelado";
export type FaseProjeto = "planejamento" | "execucao" | "prestacao_contas" | "encerrado";
export type InstrumentoFomento = "Funcultura" | "SIC" | "PNAB" | "Mecenato" | "Rouanet" | "Aldir Blanc";

export interface EventoProjeto {
  data: string;
  local: string;
  equipamentoId?: string;
  checkIns: number;
}

export interface NotaFiscal {
  numero: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

export interface ComentarioProjeto {
  id: string;
  projetoId: string;
  origem: "artista" | "cidadao";
  nome: string;
  avatar?: string;
  texto: string;
  data: string;
  avaliacao: number; // 1-5
}

export interface ChecklistItem {
  item: string;
  status: "ok" | "pendente" | "ausente";
}

export interface ProjetoCultural {
  id: string;
  nome: string;
  proponenteId: string; // FK → Produtora
  proponenteNome: string;
  linguagem: string;
  instrumento: InstrumentoFomento;
  municipio: string;
  mesorregiao: "Metropolitana" | "Agreste" | "Sertão" | "Vale do São Francisco";
  fase: FaseProjeto;
  status: StatusProjeto;
  publicoImpactado: number;
  valorCaptado: number;
  scoreConformidade: number; // 0-100
  scoreImpacto: number; // 0-100
  dataInicio: string;
  dataFim?: string;
  duracaoMeses: number;
  empregosGerados: number;
  totalEventos: number;
  eventos: EventoProjeto[];
  // Orçamento por categoria (%)
  orcamento: {
    cache_artistico: number;
    infraestrutura: number;
    material: number;
    divulgacao: number;
    administrativo: number;
  };
  // Orçamento planejado vs executado
  orcamentoPlanejado: number;
  orcamentoExecutado: number;
  notasFiscais: NotaFiscal[];
  checklist: ChecklistItem[];
  // Público breakdown
  publicoFaixaEtaria: { faixa: string; percent: number }[];
  publicoGenero: { genero: string; percent: number }[];
  publicoGratuito: number; // %
  publicoPago: number; // %
  volumeMarketplace: number;
  crowdfundingApoiadores: number;
  crowdfundingValor: number;
}

// ===== PROJETOS MOCK (12 projetos) =====
export const projetosMock: ProjetoCultural[] = [
  {
    id: "proj-001",
    nome: "Maracatu Raiz",
    proponenteId: "p1",
    proponenteNome: "Maracatu Raízes",
    linguagem: "Cultura Popular",
    instrumento: "Funcultura",
    municipio: "Recife",
    mesorregiao: "Metropolitana",
    fase: "execucao",
    status: "ativo",
    publicoImpactado: 1047,
    valorCaptado: 48000,
    scoreConformidade: 80,
    scoreImpacto: 87,
    dataInicio: "2025-01-15",
    duracaoMeses: 8,
    empregosGerados: 12,
    totalEventos: 3,
    eventos: [
      { data: "2025-02-12", local: "Pátio de São Pedro", equipamentoId: "eq-007", checkIns: 342 },
      { data: "2025-03-15", local: "CEU Recife Sul", equipamentoId: "eq-009", checkIns: 218 },
      { data: "2025-04-20", local: "Praça da República", checkIns: 487 },
    ],
    orcamento: { cache_artistico: 40, infraestrutura: 25, material: 15, divulgacao: 12, administrativo: 8 },
    orcamentoPlanejado: 48000,
    orcamentoExecutado: 38400,
    notasFiscais: [
      { numero: "NF-001", descricao: "Cachê artístico mês 1-3", valor: 14400, data: "2025-03-30", categoria: "cache_artistico" },
      { numero: "NF-002", descricao: "Aluguel espaço ensaio", valor: 6000, data: "2025-02-15", categoria: "infraestrutura" },
      { numero: "NF-003", descricao: "Figurinos e adereços", valor: 5200, data: "2025-01-28", categoria: "material" },
      { numero: "NF-004", descricao: "Impressão flyers", valor: 2800, data: "2025-02-01", categoria: "divulgacao" },
      { numero: "NF-005", descricao: "Contabilidade", valor: 3000, data: "2025-04-01", categoria: "administrativo" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais (3/3)", status: "ok" },
      { item: "Fotos do evento", status: "ok" },
      { item: "Lista de presença (2/3)", status: "pendente" },
      { item: "Check-ins georreferenciados", status: "ok" },
      { item: "Declaração de conclusão", status: "ausente" },
      { item: "Relatório financeiro", status: "ok" },
      { item: "Comprovantes de pagamento", status: "ok" },
      { item: "Clipping de mídia", status: "ok" },
      { item: "Avaliação de impacto", status: "ok" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 17 },
      { faixa: "18-35 anos", percent: 42 },
      { faixa: "36-50 anos", percent: 29 },
      { faixa: "51+ anos", percent: 12 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 54 },
      { genero: "Masculino", percent: 43 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 12400,
    crowdfundingApoiadores: 87,
    crowdfundingValor: 8200,
  },
  {
    id: "proj-002",
    nome: "Sarau das Periferias",
    proponenteId: "p2",
    proponenteNome: "Slam da Periferia",
    linguagem: "Literatura",
    instrumento: "Aldir Blanc",
    municipio: "Olinda",
    mesorregiao: "Metropolitana",
    fase: "prestacao_contas",
    status: "pendencia",
    publicoImpactado: 312,
    valorCaptado: 18000,
    scoreConformidade: 61,
    scoreImpacto: 72,
    dataInicio: "2025-02-01",
    duracaoMeses: 6,
    empregosGerados: 5,
    totalEventos: 4,
    eventos: [
      { data: "2025-03-10", local: "Casa da Cultura de Olinda", checkIns: 78 },
      { data: "2025-04-14", local: "Praça do Carmo", checkIns: 92 },
      { data: "2025-05-12", local: "Biblioteca Pública de Olinda", equipamentoId: "eq-015", checkIns: 68 },
      { data: "2025-06-08", local: "Centro Cultural", checkIns: 74 },
    ],
    orcamento: { cache_artistico: 35, infraestrutura: 20, material: 20, divulgacao: 15, administrativo: 10 },
    orcamentoPlanejado: 18000,
    orcamentoExecutado: 16200,
    notasFiscais: [
      { numero: "NF-010", descricao: "Cachês poetas", valor: 6300, data: "2025-06-15", categoria: "cache_artistico" },
      { numero: "NF-011", descricao: "Impressão antologia", valor: 3600, data: "2025-05-20", categoria: "material" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "pendente" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Lista de presença", status: "pendente" },
      { item: "Check-ins", status: "ok" },
      { item: "Declaração de conclusão", status: "ausente" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 22 },
      { faixa: "18-35 anos", percent: 48 },
      { faixa: "36-50 anos", percent: 22 },
      { faixa: "51+ anos", percent: 8 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 62 },
      { genero: "Masculino", percent: 35 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 4800,
    crowdfundingApoiadores: 42,
    crowdfundingValor: 3100,
  },
  {
    id: "proj-003",
    nome: "Festival Frevo Infantil",
    proponenteId: "p1",
    proponenteNome: "Maracatu Raízes",
    linguagem: "Música",
    instrumento: "Rouanet",
    municipio: "Recife",
    mesorregiao: "Metropolitana",
    fase: "prestacao_contas",
    status: "irregular",
    publicoImpactado: 2100,
    valorCaptado: 65000,
    scoreConformidade: 38,
    scoreImpacto: 91,
    dataInicio: "2024-11-01",
    duracaoMeses: 4,
    empregosGerados: 18,
    totalEventos: 2,
    eventos: [
      { data: "2025-01-25", local: "Paço do Frevo", equipamentoId: "eq-006", checkIns: 1200 },
      { data: "2025-02-08", local: "Marco Zero", checkIns: 900 },
    ],
    orcamento: { cache_artistico: 45, infraestrutura: 20, material: 10, divulgacao: 18, administrativo: 7 },
    orcamentoPlanejado: 65000,
    orcamentoExecutado: 61100,
    notasFiscais: [
      { numero: "NF-020", descricao: "Cachês músicos e dançarinos", valor: 29250, data: "2025-02-28", categoria: "cache_artistico" },
      { numero: "NF-021", descricao: "Sonorização e palco", valor: 13000, data: "2025-01-20", categoria: "infraestrutura" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ausente" },
      { item: "Notas fiscais", status: "pendente" },
      { item: "Fotos", status: "ok" },
      { item: "Check-ins", status: "ok" },
      { item: "Declaração de conclusão", status: "ausente" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 45 },
      { faixa: "18-35 anos", percent: 30 },
      { faixa: "36-50 anos", percent: 20 },
      { faixa: "51+ anos", percent: 5 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 52 },
      { genero: "Masculino", percent: 45 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 80,
    publicoPago: 20,
    volumeMarketplace: 18200,
    crowdfundingApoiadores: 156,
    crowdfundingValor: 12800,
  },
  {
    id: "proj-004",
    nome: "Oficinas Mamulengo",
    proponenteId: "p3",
    proponenteNome: "Cia. Movimento Livre",
    linguagem: "Artes Cênicas",
    instrumento: "Aldir Blanc",
    municipio: "Caruaru",
    mesorregiao: "Agreste",
    fase: "execucao",
    status: "ativo",
    publicoImpactado: 480,
    valorCaptado: 24000,
    scoreConformidade: 91,
    scoreImpacto: 78,
    dataInicio: "2025-03-01",
    duracaoMeses: 10,
    empregosGerados: 6,
    totalEventos: 5,
    eventos: [
      { data: "2025-03-22", local: "Teatro Rui Limeira Rosal", equipamentoId: "eq-011", checkIns: 95 },
      { data: "2025-04-19", local: "Museu do Barro", equipamentoId: "eq-012", checkIns: 88 },
      { data: "2025-05-17", local: "Praça do Rosário", checkIns: 110 },
      { data: "2025-06-14", local: "Escola Municipal", checkIns: 92 },
      { data: "2025-07-12", local: "CEU Garanhuns", equipamentoId: "eq-017", checkIns: 95 },
    ],
    orcamento: { cache_artistico: 30, infraestrutura: 15, material: 30, divulgacao: 15, administrativo: 10 },
    orcamentoPlanejado: 24000,
    orcamentoExecutado: 14400,
    notasFiscais: [
      { numero: "NF-030", descricao: "Materiais de oficina", valor: 7200, data: "2025-03-15", categoria: "material" },
      { numero: "NF-031", descricao: "Cachê instrutores", valor: 5400, data: "2025-05-30", categoria: "cache_artistico" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Lista de presença", status: "ok" },
      { item: "Check-ins", status: "ok" },
      { item: "Relatório parcial", status: "ok" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 55 },
      { faixa: "18-35 anos", percent: 25 },
      { faixa: "36-50 anos", percent: 15 },
      { faixa: "51+ anos", percent: 5 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 48 },
      { genero: "Masculino", percent: 49 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 3200,
    crowdfundingApoiadores: 28,
    crowdfundingValor: 2100,
  },
  {
    id: "proj-005",
    nome: "Audiovisual Agreste",
    proponenteId: "p4",
    proponenteNome: "Coletivo Canoa",
    linguagem: "Audiovisual",
    instrumento: "Mecenato",
    municipio: "Petrolina",
    mesorregiao: "Vale do São Francisco",
    fase: "execucao",
    status: "ativo",
    publicoImpactado: 890,
    valorCaptado: 38000,
    scoreConformidade: 75,
    scoreImpacto: 82,
    dataInicio: "2025-04-01",
    duracaoMeses: 12,
    empregosGerados: 8,
    totalEventos: 2,
    eventos: [
      { data: "2025-06-20", local: "Museu do Sertão", equipamentoId: "eq-018", checkIns: 420 },
      { data: "2025-08-15", local: "Auditório Municipal", checkIns: 470 },
    ],
    orcamento: { cache_artistico: 35, infraestrutura: 30, material: 15, divulgacao: 12, administrativo: 8 },
    orcamentoPlanejado: 38000,
    orcamentoExecutado: 19000,
    notasFiscais: [
      { numero: "NF-040", descricao: "Equipamento câmera", valor: 11400, data: "2025-04-15", categoria: "infraestrutura" },
      { numero: "NF-041", descricao: "Cachê equipe técnica", valor: 6650, data: "2025-06-30", categoria: "cache_artistico" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Check-ins", status: "pendente" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 8 },
      { faixa: "18-35 anos", percent: 52 },
      { faixa: "36-50 anos", percent: 28 },
      { faixa: "51+ anos", percent: 12 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 45 },
      { genero: "Masculino", percent: 52 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 60,
    publicoPago: 40,
    volumeMarketplace: 8900,
    crowdfundingApoiadores: 64,
    crowdfundingValor: 5400,
  },
  {
    id: "proj-006",
    nome: "Dança Contemporânea PE",
    proponenteId: "p3",
    proponenteNome: "Cia. Movimento Livre",
    linguagem: "Artes Cênicas",
    instrumento: "Funcultura",
    municipio: "Recife",
    mesorregiao: "Metropolitana",
    fase: "execucao",
    status: "ativo",
    publicoImpactado: 1580,
    valorCaptado: 52000,
    scoreConformidade: 85,
    scoreImpacto: 89,
    dataInicio: "2025-02-01",
    duracaoMeses: 10,
    empregosGerados: 15,
    totalEventos: 4,
    eventos: [
      { data: "2025-03-08", local: "Teatro Santa Isabel", equipamentoId: "eq-001", checkIns: 420 },
      { data: "2025-04-12", local: "Teatro Luiz Mendonça", equipamentoId: "eq-004", checkIns: 380 },
      { data: "2025-05-10", local: "Teatro Apolo", equipamentoId: "eq-007", checkIns: 450 },
      { data: "2025-06-14", local: "CEU das Artes", equipamentoId: "eq-009", checkIns: 330 },
    ],
    orcamento: { cache_artistico: 42, infraestrutura: 22, material: 12, divulgacao: 16, administrativo: 8 },
    orcamentoPlanejado: 52000,
    orcamentoExecutado: 36400,
    notasFiscais: [
      { numero: "NF-050", descricao: "Cachês bailarinos", valor: 21840, data: "2025-05-30", categoria: "cache_artistico" },
      { numero: "NF-051", descricao: "Cenografia", valor: 8320, data: "2025-03-01", categoria: "infraestrutura" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Lista de presença", status: "ok" },
      { item: "Check-ins", status: "ok" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 10 },
      { faixa: "18-35 anos", percent: 45 },
      { faixa: "36-50 anos", percent: 32 },
      { faixa: "51+ anos", percent: 13 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 60 },
      { genero: "Masculino", percent: 37 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 50,
    publicoPago: 50,
    volumeMarketplace: 15600,
    crowdfundingApoiadores: 112,
    crowdfundingValor: 9800,
  },
  {
    id: "proj-007",
    nome: "Artesanato do Agreste",
    proponenteId: "p5",
    proponenteNome: "Grupo Rabeca Viva",
    linguagem: "Cultura Popular",
    instrumento: "SIC",
    municipio: "Caruaru",
    mesorregiao: "Agreste",
    fase: "encerrado",
    status: "concluido",
    publicoImpactado: 920,
    valorCaptado: 28000,
    scoreConformidade: 95,
    scoreImpacto: 76,
    dataInicio: "2024-06-01",
    dataFim: "2024-12-15",
    duracaoMeses: 7,
    empregosGerados: 8,
    totalEventos: 3,
    eventos: [
      { data: "2024-08-10", local: "Museu do Barro", equipamentoId: "eq-012", checkIns: 310 },
      { data: "2024-10-05", local: "Feira de Artesanato", checkIns: 380 },
      { data: "2024-12-01", local: "Centro Cultural", checkIns: 230 },
    ],
    orcamento: { cache_artistico: 25, infraestrutura: 15, material: 35, divulgacao: 15, administrativo: 10 },
    orcamentoPlanejado: 28000,
    orcamentoExecutado: 27200,
    notasFiscais: [
      { numero: "NF-060", descricao: "Materiais artesanato", valor: 9800, data: "2024-07-15", categoria: "material" },
      { numero: "NF-061", descricao: "Cachê artesãos", valor: 7000, data: "2024-11-30", categoria: "cache_artistico" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Lista de presença", status: "ok" },
      { item: "Declaração de conclusão", status: "ok" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 5 },
      { faixa: "18-35 anos", percent: 30 },
      { faixa: "36-50 anos", percent: 40 },
      { faixa: "51+ anos", percent: 25 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 65 },
      { genero: "Masculino", percent: 33 },
      { genero: "Outros", percent: 2 },
    ],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 22400,
    crowdfundingApoiadores: 35,
    crowdfundingValor: 2800,
  },
  {
    id: "proj-008",
    nome: "Rabeca nas Escolas",
    proponenteId: "p5",
    proponenteNome: "Grupo Rabeca Viva",
    linguagem: "Música",
    instrumento: "PNAB",
    municipio: "Garanhuns",
    mesorregiao: "Agreste",
    fase: "execucao",
    status: "ativo",
    publicoImpactado: 640,
    valorCaptado: 32000,
    scoreConformidade: 88,
    scoreImpacto: 84,
    dataInicio: "2025-03-15",
    duracaoMeses: 9,
    empregosGerados: 7,
    totalEventos: 6,
    eventos: [
      { data: "2025-04-05", local: "Teatro Municipal", equipamentoId: "eq-016", checkIns: 105 },
      { data: "2025-04-26", local: "CEU Garanhuns", equipamentoId: "eq-017", checkIns: 112 },
      { data: "2025-05-17", local: "Escola Estadual", checkIns: 98 },
      { data: "2025-06-07", local: "Escola Municipal", checkIns: 108 },
      { data: "2025-06-28", local: "Praça Mestre Dominguinhos", checkIns: 120 },
      { data: "2025-07-19", local: "Escola Estadual 2", checkIns: 97 },
    ],
    orcamento: { cache_artistico: 38, infraestrutura: 12, material: 25, divulgacao: 15, administrativo: 10 },
    orcamentoPlanejado: 32000,
    orcamentoExecutado: 21000,
    notasFiscais: [
      { numero: "NF-070", descricao: "Cachê músicos", valor: 12160, data: "2025-06-30", categoria: "cache_artistico" },
      { numero: "NF-071", descricao: "Instrumentos", valor: 5000, data: "2025-03-20", categoria: "material" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Lista de presença", status: "ok" },
      { item: "Check-ins", status: "ok" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 65 },
      { faixa: "18-35 anos", percent: 15 },
      { faixa: "36-50 anos", percent: 15 },
      { faixa: "51+ anos", percent: 5 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 50 },
      { genero: "Masculino", percent: 48 },
      { genero: "Outros", percent: 2 },
    ],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 1200,
    crowdfundingApoiadores: 18,
    crowdfundingValor: 1400,
  },
  {
    id: "proj-009",
    nome: "Grafite Urbano Recife",
    proponenteId: "p2",
    proponenteNome: "Slam da Periferia",
    linguagem: "Artes Visuais",
    instrumento: "SIC",
    municipio: "Recife",
    mesorregiao: "Metropolitana",
    fase: "encerrado",
    status: "concluido",
    publicoImpactado: 3200,
    valorCaptado: 22000,
    scoreConformidade: 92,
    scoreImpacto: 88,
    dataInicio: "2024-08-01",
    dataFim: "2025-01-30",
    duracaoMeses: 6,
    empregosGerados: 10,
    totalEventos: 5,
    eventos: [
      { data: "2024-09-15", local: "Muro do Cais", checkIns: 650 },
      { data: "2024-10-20", local: "Viaduto Capitão Temudo", checkIns: 580 },
      { data: "2024-11-10", local: "Comunidade do Coque", checkIns: 720 },
      { data: "2024-12-05", local: "Escola Estadual", checkIns: 680 },
      { data: "2025-01-18", local: "Museu do Estado", equipamentoId: "eq-002", checkIns: 570 },
    ],
    orcamento: { cache_artistico: 35, infraestrutura: 10, material: 30, divulgacao: 18, administrativo: 7 },
    orcamentoPlanejado: 22000,
    orcamentoExecutado: 21800,
    notasFiscais: [
      { numero: "NF-080", descricao: "Tintas e materiais", valor: 6600, data: "2024-08-20", categoria: "material" },
      { numero: "NF-081", descricao: "Cachê grafiteiros", valor: 7700, data: "2025-01-25", categoria: "cache_artistico" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Lista de presença", status: "ok" },
      { item: "Declaração de conclusão", status: "ok" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 20 },
      { faixa: "18-35 anos", percent: 50 },
      { faixa: "36-50 anos", percent: 22 },
      { faixa: "51+ anos", percent: 8 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 48 },
      { genero: "Masculino", percent: 49 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 6800,
    crowdfundingApoiadores: 95,
    crowdfundingValor: 7200,
  },
  {
    id: "proj-010",
    nome: "Ciranda do São Francisco",
    proponenteId: "p4",
    proponenteNome: "Coletivo Canoa",
    linguagem: "Cultura Popular",
    instrumento: "PNAB",
    municipio: "Petrolina",
    mesorregiao: "Vale do São Francisco",
    fase: "execucao",
    status: "ativo",
    publicoImpactado: 750,
    valorCaptado: 35000,
    scoreConformidade: 82,
    scoreImpacto: 80,
    dataInicio: "2025-05-01",
    duracaoMeses: 8,
    empregosGerados: 9,
    totalEventos: 3,
    eventos: [
      { data: "2025-06-15", local: "Orla de Petrolina", checkIns: 280 },
      { data: "2025-07-20", local: "Praça Maria Auxiliadora", checkIns: 250 },
      { data: "2025-08-17", local: "Museu do Sertão", equipamentoId: "eq-018", checkIns: 220 },
    ],
    orcamento: { cache_artistico: 32, infraestrutura: 22, material: 18, divulgacao: 18, administrativo: 10 },
    orcamentoPlanejado: 35000,
    orcamentoExecutado: 17500,
    notasFiscais: [
      { numero: "NF-090", descricao: "Cachês artistas", valor: 11200, data: "2025-07-30", categoria: "cache_artistico" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Check-ins", status: "pendente" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 12 },
      { faixa: "18-35 anos", percent: 35 },
      { faixa: "36-50 anos", percent: 33 },
      { faixa: "51+ anos", percent: 20 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 55 },
      { genero: "Masculino", percent: 42 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 4500,
    crowdfundingApoiadores: 32,
    crowdfundingValor: 2600,
  },
  {
    id: "proj-011",
    nome: "Maracatu Digital de Chão",
    proponenteId: "p1",
    proponenteNome: "Maracatu Raízes",
    linguagem: "Cultura Popular",
    instrumento: "Funcultura",
    municipio: "Recife",
    mesorregiao: "Metropolitana",
    fase: "execucao",
    status: "ativo",
    publicoImpactado: 4200,
    valorCaptado: 72000,
    scoreConformidade: 78,
    scoreImpacto: 95,
    dataInicio: "2025-01-01",
    duracaoMeses: 12,
    empregosGerados: 22,
    totalEventos: 6,
    eventos: [
      { data: "2025-02-01", local: "Recife Antigo", checkIns: 820 },
      { data: "2025-03-01", local: "Pátio de São Pedro", checkIns: 750 },
      { data: "2025-04-05", local: "Teatro Apolo", equipamentoId: "eq-007", checkIns: 680 },
      { data: "2025-05-10", local: "CEU das Artes", equipamentoId: "eq-009", checkIns: 590 },
      { data: "2025-06-14", local: "Praça do Arsenal", checkIns: 710 },
      { data: "2025-07-12", local: "Marco Zero", checkIns: 650 },
    ],
    orcamento: { cache_artistico: 38, infraestrutura: 28, material: 10, divulgacao: 16, administrativo: 8 },
    orcamentoPlanejado: 72000,
    orcamentoExecutado: 42000,
    notasFiscais: [
      { numero: "NF-100", descricao: "Cachês elenco", valor: 27360, data: "2025-06-30", categoria: "cache_artistico" },
      { numero: "NF-101", descricao: "Tecnologia e equipamentos", valor: 12000, data: "2025-01-15", categoria: "infraestrutura" },
    ],
    checklist: [
      { item: "Relatório de atividades", status: "ok" },
      { item: "Notas fiscais", status: "ok" },
      { item: "Fotos", status: "ok" },
      { item: "Lista de presença", status: "pendente" },
      { item: "Check-ins", status: "ok" },
    ],
    publicoFaixaEtaria: [
      { faixa: "< 18 anos", percent: 15 },
      { faixa: "18-35 anos", percent: 40 },
      { faixa: "36-50 anos", percent: 30 },
      { faixa: "51+ anos", percent: 15 },
    ],
    publicoGenero: [
      { genero: "Feminino", percent: 52 },
      { genero: "Masculino", percent: 45 },
      { genero: "Outros", percent: 3 },
    ],
    publicoGratuito: 70,
    publicoPago: 30,
    volumeMarketplace: 28500,
    crowdfundingApoiadores: 312,
    crowdfundingValor: 22800,
  },
  {
    id: "proj-012",
    nome: "Exposição Barro & Fogo",
    proponenteId: "p5",
    proponenteNome: "Grupo Rabeca Viva",
    linguagem: "Artes Visuais",
    instrumento: "Mecenato",
    municipio: "Caruaru",
    mesorregiao: "Agreste",
    fase: "planejamento",
    status: "ativo",
    publicoImpactado: 0,
    valorCaptado: 15000,
    scoreConformidade: 45,
    scoreImpacto: 0,
    dataInicio: "2025-09-01",
    duracaoMeses: 4,
    empregosGerados: 4,
    totalEventos: 0,
    eventos: [],
    orcamento: { cache_artistico: 30, infraestrutura: 25, material: 25, divulgacao: 12, administrativo: 8 },
    orcamentoPlanejado: 15000,
    orcamentoExecutado: 0,
    notasFiscais: [],
    checklist: [
      { item: "Plano de trabalho", status: "ok" },
      { item: "Cronograma", status: "ok" },
      { item: "Orçamento detalhado", status: "pendente" },
    ],
    publicoFaixaEtaria: [],
    publicoGenero: [],
    publicoGratuito: 100,
    publicoPago: 0,
    volumeMarketplace: 0,
    crowdfundingApoiadores: 0,
    crowdfundingValor: 0,
  },
];

// ===== COMENTÁRIOS MOCK =====
export const comentariosMock: ComentarioProjeto[] = [
  { id: "c1", projetoId: "proj-003", origem: "artista", nome: "João Barros", texto: "Apoio da secretaria foi rápido, mas precisamos de mais suporte técnico de som.", data: "2025-03-14", avaliacao: 4 },
  { id: "c2", projetoId: "proj-004", origem: "cidadao", nome: "Anônimo", texto: "Levei meus filhos e foi transformador. Espero mais eventos assim no bairro.", data: "2025-04-22", avaliacao: 5 },
  { id: "c3", projetoId: "proj-001", origem: "artista", nome: "Ana Cristina", texto: "Excelente organização do festival. Material de qualidade e pagamento em dia.", data: "2025-04-25", avaliacao: 5 },
  { id: "c4", projetoId: "proj-006", origem: "cidadao", nome: "Maria Fernanda", texto: "O espetáculo de dança foi emocionante. Recife precisa de mais eventos culturais gratuitos.", data: "2025-05-12", avaliacao: 5 },
  { id: "c5", projetoId: "proj-011", origem: "artista", nome: "Carlos Henrique", texto: "O Maracatu Digital trouxe uma visibilidade incrível pro grupo. Faltou apenas melhor logística de transporte.", data: "2025-03-05", avaliacao: 4 },
  { id: "c6", projetoId: "proj-009", origem: "cidadao", nome: "Roberto Silva", texto: "Os grafites transformaram a cara do bairro. As crianças adoraram participar das oficinas.", data: "2025-01-20", avaliacao: 5 },
  { id: "c7", projetoId: "proj-002", origem: "artista", nome: "Mariana Costa", texto: "O sarau foi importante para a cena literária local, mas a divulgação poderia ter sido melhor.", data: "2025-06-10", avaliacao: 3 },
  { id: "c8", projetoId: "proj-008", origem: "cidadao", nome: "Dona Francisca", texto: "Meu neto aprendeu a tocar rabeca e agora não para! Projeto maravilhoso.", data: "2025-07-22", avaliacao: 5 },
];

// ===== DADOS AGREGADOS =====

export const evolucaoPortfolioMensal = [
  { mes: "Mai/25", iniciados: 3, concluidos: 1, desembolsado: 180000 },
  { mes: "Jun/25", iniciados: 4, concluidos: 2, desembolsado: 210000 },
  { mes: "Jul/25", iniciados: 5, concluidos: 1, desembolsado: 250000 },
  { mes: "Ago/25", iniciados: 3, concluidos: 3, desembolsado: 280000 },
  { mes: "Set/25", iniciados: 6, concluidos: 2, desembolsado: 320000 },
  { mes: "Out/25", iniciados: 4, concluidos: 4, desembolsado: 290000 },
  { mes: "Nov/25", iniciados: 5, concluidos: 3, desembolsado: 340000 },
  { mes: "Dez/25", iniciados: 2, concluidos: 5, desembolsado: 220000 },
  { mes: "Jan/26", iniciados: 4, concluidos: 2, desembolsado: 270000 },
  { mes: "Fev/26", iniciados: 6, concluidos: 3, desembolsado: 350000 },
  { mes: "Mar/26", iniciados: 5, concluidos: 4, desembolsado: 310000 },
  { mes: "Abr/26", iniciados: 3, concluidos: 2, desembolsado: 260000 },
];

export const receitaPorFonteMensal = [
  { mes: "Mai/25", fomento: 120000, patrocinio: 35000, marketplace: 18000, crowdfunding: 7000 },
  { mes: "Jun/25", fomento: 140000, patrocinio: 42000, marketplace: 22000, crowdfunding: 6000 },
  { mes: "Jul/25", fomento: 160000, patrocinio: 48000, marketplace: 25000, crowdfunding: 9000 },
  { mes: "Ago/25", fomento: 180000, patrocinio: 55000, marketplace: 28000, crowdfunding: 12000 },
  { mes: "Set/25", fomento: 200000, patrocinio: 60000, marketplace: 32000, crowdfunding: 8000 },
  { mes: "Out/25", fomento: 185000, patrocinio: 52000, marketplace: 30000, crowdfunding: 11000 },
  { mes: "Nov/25", fomento: 220000, patrocinio: 65000, marketplace: 35000, crowdfunding: 14000 },
  { mes: "Dez/25", fomento: 150000, patrocinio: 38000, marketplace: 20000, crowdfunding: 6000 },
  { mes: "Jan/26", fomento: 175000, patrocinio: 45000, marketplace: 26000, crowdfunding: 8500 },
  { mes: "Fev/26", fomento: 210000, patrocinio: 58000, marketplace: 32000, crowdfunding: 10000 },
  { mes: "Mar/26", fomento: 195000, patrocinio: 50000, marketplace: 28000, crowdfunding: 9500 },
  { mes: "Abr/26", fomento: 170000, patrocinio: 42000, marketplace: 24000, crowdfunding: 7500 },
];

export const evolucaoCrowdfundingMensal = [
  { mes: "Mai/25", valor: 7000, apoiadores: 82 },
  { mes: "Jun/25", valor: 6000, apoiadores: 71 },
  { mes: "Jul/25", valor: 9000, apoiadores: 105 },
  { mes: "Ago/25", valor: 12000, apoiadores: 134 },
  { mes: "Set/25", valor: 8000, apoiadores: 92 },
  { mes: "Out/25", valor: 11000, apoiadores: 118 },
  { mes: "Nov/25", valor: 14000, apoiadores: 152 },
  { mes: "Dez/25", valor: 6000, apoiadores: 68 },
  { mes: "Jan/26", valor: 8500, apoiadores: 95 },
  { mes: "Fev/26", valor: 10000, apoiadores: 112 },
  { mes: "Mar/26", valor: 9500, apoiadores: 108 },
  { mes: "Abr/26", valor: 7500, apoiadores: 85 },
];

export const evolucaoFormalizacaoTrimestral = [
  { trimestre: "Q1/25", Informal: 51, MEI: 28, Associação: 14, "ME/EPP": 7, projetos: 18 },
  { trimestre: "Q2/25", Informal: 49, MEI: 29, Associação: 15, "ME/EPP": 7, projetos: 26 },
  { trimestre: "Q3/25", Informal: 47, MEI: 30, Associação: 15, "ME/EPP": 8, projetos: 31 },
  { trimestre: "Q4/25", Informal: 44, MEI: 31, Associação: 16, "ME/EPP": 9, projetos: 38 },
];

export const orcamentoPorInstrumento = [
  { instrumento: "Funcultura", planejado: 45000000, empenhado: 38000000, pago: 31000000, percentExecutado: 69 },
  { instrumento: "SIC", planejado: 14000000, empenhado: 12000000, pago: 11000000, percentExecutado: 79 },
  { instrumento: "PNAB", planejado: 65000000, empenhado: 58000000, pago: 52000000, percentExecutado: 80 },
  { instrumento: "Mecenato", planejado: 8000000, empenhado: 5000000, pago: 4000000, percentExecutado: 50 },
  { instrumento: "Rouanet", planejado: 12000000, empenhado: 9000000, pago: 8000000, percentExecutado: 67 },
  { instrumento: "Aldir Blanc", planejado: 18000000, empenhado: 17000000, pago: 15000000, percentExecutado: 83 },
];

// ===== HELPERS =====
export const instrumentos: InstrumentoFomento[] = ["Funcultura", "SIC", "PNAB", "Mecenato", "Rouanet", "Aldir Blanc"];
export const fases: { value: FaseProjeto; label: string }[] = [
  { value: "planejamento", label: "Planejamento" },
  { value: "execucao", label: "Execução" },
  { value: "prestacao_contas", label: "Prestação de contas" },
  { value: "encerrado", label: "Encerrado" },
];
export const statusLabels: Record<StatusProjeto, string> = {
  ativo: "Ativo", concluido: "Concluído", pendencia: "Pendência", irregular: "Irregular", cancelado: "Cancelado",
};
export const statusCores: Record<StatusProjeto, string> = {
  ativo: "hsl(142, 71%, 45%)", concluido: "hsl(215, 60%, 50%)", pendencia: "hsl(45, 93%, 47%)", irregular: "hsl(0, 84%, 60%)", cancelado: "hsl(0, 0%, 55%)",
};

export function getProjetosFiltrados(filtroLinguagem: string = "todas", filtroCidades: string[] = []): ProjetoCultural[] {
  return projetosMock.filter(p => {
    if (filtroLinguagem !== "todas" && p.linguagem !== filtroLinguagem) return false;
    if (filtroCidades.length > 0 && !filtroCidades.includes(p.municipio)) return false;
    return true;
  });
}

export function getKPIsProjetos(filtroLinguagem: string = "todas", filtroCidades: string[] = []) {
  const dados = getProjetosFiltrados(filtroLinguagem, filtroCidades);
  const ativos = dados.filter(p => p.status === "ativo");
  const concluidos = dados.filter(p => p.status === "concluido");
  const comPendencia = dados.filter(p => p.status === "pendencia" || p.status === "irregular");
  const totalRecursos = dados.reduce((s, p) => s + p.valorCaptado, 0);
  const totalPublico = dados.reduce((s, p) => s + p.publicoImpactado, 0);
  const totalEmpregos = dados.reduce((s, p) => s + p.empregosGerados, 0);
  const totalEventos = dados.reduce((s, p) => s + p.totalEventos, 0);
  const totalMarketplace = dados.reduce((s, p) => s + p.volumeMarketplace, 0);
  const totalCrowdfunding = dados.reduce((s, p) => s + p.crowdfundingValor, 0);
  const totalApoiadores = dados.reduce((s, p) => s + p.crowdfundingApoiadores, 0);

  return {
    projetosAtivos: ativos.length,
    projetosConcluidos: concluidos.length,
    comPendencia: comPendencia.length,
    totalRecursos,
    totalPublico,
    totalEmpregos,
    totalEventos,
    totalMarketplace,
    totalCrowdfunding,
    totalApoiadores,
    eficienciaRepasse: 38, // dias
    variações: {
      ativos: 5, concluidos: 3, recursos: 18, publico: 11,
      empregos: 67, marketplace: 12, alavancagem: 0.4,
    },
  };
}
