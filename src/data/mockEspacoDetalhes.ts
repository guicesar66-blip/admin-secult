import teatroInterior from "@/assets/espacos/teatro-santa-isabel-interior.jpg";
import teatroFachada from "@/assets/espacos/teatro-santa-isabel-fachada.jpg";
import teatroPalco from "@/assets/espacos/teatro-palco.jpg";
import teatroFoyer from "@/assets/espacos/teatro-foyer.jpg";
import museuInterior from "@/assets/espacos/museu-interior.jpg";
import bibliotecaInterior from "@/assets/espacos/biblioteca-interior.jpg";

export interface AcessibilidadeItem {
  recurso: string;
  disponivel: boolean;
}

export interface FotoEspaco {
  url: string;
  legenda: string;
  data: string;
}

export interface MetricasEspaco {
  totalProjetos: number;
  pessoasImpactadas: number;
  mediaPublicoEvento: number;
  rendaGerada: number;
  evolucaoMensal: { mes: string; eventos: number }[];
  demografiaPublico: {
    faixaEtaria: { label: string; valor: number }[];
    genero: { label: string; valor: number }[];
  };
}

export interface InstrumentoFomento {
  nome: string;
  projetos: number;
}

export interface Comentario {
  id: string;
  avatar?: string;
  nome: string;
  data: string;
  texto: string;
  estrelas: number;
}

export interface ResponsavelEspaco {
  nome: string;
  tipoVinculo: "Proprietário" | "Cogestor" | "Parceiro fixo" | "Secretaria responsável" | "Gestão operacional";
  periodoVinculo: string;
  logo?: string;
  contato?: string;
}

export interface ArtistaVinculado {
  id: string;
  nome: string;
  linguagem: string;
  ultimaApresentacao: string;
}

export interface EspacoDetalhe {
  id: string; // matches EquipamentoCultural.id
  descricao: string;
  horarios: string;
  cnpj: string;
  contatoNome: string;
  contatoEmail: string;
  contatoTelefone: string;
  conservacao: "Excelente" | "Bom" | "Regular" | "Precário";
  acessibilidadeGeral: "Totalmente acessível" | "Parcialmente acessível" | "Não acessível";
  acessibilidadeItens: AcessibilidadeItem[];
  acessibilidadeObs: string;
  fotos: FotoEspaco[];
  metricas: MetricasEspaco;
  fomento: InstrumentoFomento[];
  comentariosArtistas: { media: number; total: number; lista: Comentario[] };
  comentariosCidadaos: { media: number; total: number; lista: Comentario[] };
  responsaveis: ResponsavelEspaco[];
  artistasVinculados: ArtistaVinculado[];
}

const fotosTeatro: FotoEspaco[] = [
  { url: teatroFachada, legenda: "Fachada principal do Teatro Santa Isabel", data: "15/03/2025" },
  { url: teatroInterior, legenda: "Vista interna — plateia e balcões", data: "15/03/2025" },
  { url: teatroPalco, legenda: "Palco com iluminação técnica", data: "20/02/2025" },
  { url: teatroFoyer, legenda: "Foyer e área de convivência", data: "20/02/2025" },
];

const fotosMuseu: FotoEspaco[] = [
  { url: museuInterior, legenda: "Galeria principal de exposições", data: "10/01/2025" },
  { url: teatroFoyer, legenda: "Hall de entrada do museu", data: "10/01/2025" },
  { url: teatroFachada, legenda: "Fachada do edifício", data: "05/12/2024" },
  { url: bibliotecaInterior, legenda: "Sala de acervo documental", data: "05/12/2024" },
];

const fotosBiblioteca: FotoEspaco[] = [
  { url: bibliotecaInterior, legenda: "Salão de leitura principal", data: "08/02/2025" },
  { url: museuInterior, legenda: "Ala de exposições temporárias", data: "08/02/2025" },
  { url: teatroFoyer, legenda: "Recepção e área infantil", data: "15/01/2025" },
  { url: teatroInterior, legenda: "Auditório multiuso", data: "15/01/2025" },
];

const evolucaoPadrao = [
  { mes: "Mai/24", eventos: 3 }, { mes: "Jun/24", eventos: 5 }, { mes: "Jul/24", eventos: 4 },
  { mes: "Ago/24", eventos: 6 }, { mes: "Set/24", eventos: 4 }, { mes: "Out/24", eventos: 7 },
  { mes: "Nov/24", eventos: 5 }, { mes: "Dez/24", eventos: 8 }, { mes: "Jan/25", eventos: 3 },
  { mes: "Fev/25", eventos: 4 }, { mes: "Mar/25", eventos: 6 }, { mes: "Abr/25", eventos: 5 },
];

const demografiaPadrao = {
  faixaEtaria: [
    { label: "18-24", valor: 15 }, { label: "25-34", valor: 28 }, { label: "35-44", valor: 22 },
    { label: "45-54", valor: 18 }, { label: "55-64", valor: 12 }, { label: "65+", valor: 5 },
  ],
  genero: [
    { label: "Feminino", valor: 52 }, { label: "Masculino", valor: 44 }, { label: "Não-binário", valor: 4 },
  ],
};

const acessibilidadeCompleta: AcessibilidadeItem[] = [
  { recurso: "Rampa de acesso", disponivel: true },
  { recurso: "Elevador", disponivel: false },
  { recurso: "Banheiro adaptado", disponivel: true },
  { recurso: "Vagas de estacionamento para PCDs", disponivel: true },
  { recurso: "Piso tátil", disponivel: false },
  { recurso: "Audiodescrição disponível para eventos", disponivel: true },
  { recurso: "Intérprete de Libras disponível para eventos", disponivel: false },
];

const artistasPadrao: ArtistaVinculado[] = [
  { id: "av-1", nome: "Orquestra Sinfônica do Recife", linguagem: "Música Clássica", ultimaApresentacao: "20/04/2025" },
  { id: "av-2", nome: "Cia. Brasileira de Teatro", linguagem: "Teatro", ultimaApresentacao: "15/03/2025" },
  { id: "av-3", nome: "Grupo Grial", linguagem: "Dança", ultimaApresentacao: "02/02/2025" },
  { id: "av-4", nome: "Maestro Spok", linguagem: "Frevo / Música Instrumental", ultimaApresentacao: "18/01/2025" },
  { id: "av-5", nome: "Balé Popular do Recife", linguagem: "Dança Popular", ultimaApresentacao: "10/12/2024" },
  { id: "av-6", nome: "Cia. Fiandeiros de Teatro", linguagem: "Teatro", ultimaApresentacao: "22/11/2024" },
  { id: "av-7", nome: "Naná Vasconcelos Ensemble", linguagem: "Música Experimental", ultimaApresentacao: "05/10/2024" },
  { id: "av-8", nome: "Marco Polo", linguagem: "Stand-up / Humor", ultimaApresentacao: "28/09/2024" },
  { id: "av-9", nome: "Quinteto Violado", linguagem: "MPB / Regional", ultimaApresentacao: "14/08/2024" },
  { id: "av-10", nome: "Antônio Nóbrega", linguagem: "Multiartista", ultimaApresentacao: "30/07/2024" },
  { id: "av-11", nome: "Lenine", linguagem: "MPB", ultimaApresentacao: "15/06/2024" },
  { id: "av-12", nome: "Cordel do Fogo Encantado", linguagem: "Música / Performance", ultimaApresentacao: "02/05/2024" },
];

export const espacosDetalheMock: Record<string, EspacoDetalhe> = {
  "eq-001": {
    id: "eq-001",
    descricao: "Inaugurado em 1850, o Teatro Santa Isabel é um dos mais importantes e antigos teatros do Brasil. Patrimônio histórico nacional, abriga espetáculos de teatro, dança, música erudita e popular, além de cerimônias oficiais. Sua arquitetura neoclássica e acústica privilegiada o tornam referência para produções culturais em todo o Nordeste.",
    horarios: "Ter–Sex 10h–22h · Sáb–Dom 14h–22h · Seg fechado",
    cnpj: "10.000.001/0001-01",
    contatoNome: "Dra. Mariana Costa",
    contatoEmail: "mariana.costa@secult.recife.gov.br",
    contatoTelefone: "(81) 3355-8000",
    conservacao: "Bom",
    acessibilidadeGeral: "Parcialmente acessível",
    acessibilidadeItens: acessibilidadeCompleta,
    acessibilidadeObs: "O elevador encontra-se em manutenção desde jan/2025. Intérprete de Libras disponível sob agendamento prévio com 15 dias de antecedência.",
    fotos: fotosTeatro,
    metricas: {
      totalProjetos: 38, pessoasImpactadas: 42800, mediaPublicoEvento: 487, rendaGerada: 1200000,
      evolucaoMensal: evolucaoPadrao,
      demografiaPublico: demografiaPadrao,
    },
    fomento: [
      { nome: "Funcultura", projetos: 18 },
      { nome: "Lei Rouanet", projetos: 12 },
      { nome: "SIC Recife", projetos: 8 },
    ],
    comentariosArtistas: {
      media: 4.2, total: 14,
      lista: [
        { id: "ca-1", nome: "Carlos Lima", data: "12/03/2025", texto: "Estrutura técnica excelente, mas o elevador quebrado dificulta muito a montagem de cenografia pesada.", estrelas: 4 },
        { id: "ca-2", nome: "Ana Souza", data: "28/02/2025", texto: "Acústica fantástica. Equipe técnica muito profissional e atenciosa com os artistas.", estrelas: 5 },
        { id: "ca-3", nome: "Rafael Mendes", data: "15/01/2025", texto: "O camarim precisa de reforma urgente. Espelhos quebrados e iluminação fraca.", estrelas: 3 },
      ],
    },
    comentariosCidadaos: {
      media: 4.6, total: 89,
      lista: [
        { id: "cc-1", nome: "Anônimo", data: "08/04/2025", texto: "Ambiente incrível, ótima acústica. Falta sinalização para cadeirantes na entrada lateral.", estrelas: 4 },
        { id: "cc-2", nome: "Maria Fernanda", data: "22/03/2025", texto: "Espetáculo maravilhoso! O teatro é lindo e bem conservado. Voltarei com certeza.", estrelas: 5 },
        { id: "cc-3", nome: "João Pedro", data: "10/03/2025", texto: "Poltronas confortáveis, mas o estacionamento é péssimo. Difícil encontrar vaga.", estrelas: 4 },
      ],
    },
    responsaveis: [
      { nome: "SECULT Recife", tipoVinculo: "Secretaria responsável", periodoVinculo: "desde 1850", contato: "(81) 3355-8100" },
      { nome: "Fundação de Cultura Recife", tipoVinculo: "Gestão operacional", periodoVinculo: "desde 1990", contato: "fundacaocultura.recife.pe.gov.br" },
    ],
    artistasVinculados: artistasPadrao,
  },
  "eq-002": {
    id: "eq-002",
    descricao: "O Museu do Estado de Pernambuco (MEPE) é um dos mais antigos museus do Brasil, fundado em 1929. Possui acervo com mais de 14 mil peças entre pinturas, esculturas, mobiliário e objetos históricos. Referência em arte e história pernambucana.",
    horarios: "Ter–Sex 9h–17h · Sáb–Dom 14h–17h · Seg fechado",
    cnpj: "10.000.002/0001-02",
    contatoNome: "Dr. Paulo Henrique",
    contatoEmail: "mepe@cultura.pe.gov.br",
    contatoTelefone: "(81) 3427-9322",
    conservacao: "Regular",
    acessibilidadeGeral: "Parcialmente acessível",
    acessibilidadeItens: [
      { recurso: "Rampa de acesso", disponivel: true },
      { recurso: "Elevador", disponivel: true },
      { recurso: "Banheiro adaptado", disponivel: true },
      { recurso: "Vagas de estacionamento para PCDs", disponivel: false },
      { recurso: "Piso tátil", disponivel: false },
      { recurso: "Audiodescrição disponível para eventos", disponivel: false },
      { recurso: "Intérprete de Libras disponível para eventos", disponivel: false },
    ],
    acessibilidadeObs: "O museu está em processo de adequação do piso tátil, previsto para conclusão em 2026.",
    fotos: fotosMuseu,
    metricas: {
      totalProjetos: 22, pessoasImpactadas: 18500, mediaPublicoEvento: 210, rendaGerada: 450000,
      evolucaoMensal: evolucaoPadrao.map(e => ({ ...e, eventos: Math.max(1, e.eventos - 2) })),
      demografiaPublico: demografiaPadrao,
    },
    fomento: [
      { nome: "Funcultura", projetos: 10 },
      { nome: "Lei Rouanet", projetos: 8 },
      { nome: "Fundo Municipal de Cultura", projetos: 4 },
    ],
    comentariosArtistas: {
      media: 3.8, total: 8,
      lista: [
        { id: "ca-4", nome: "Lúcia Araújo", data: "05/03/2025", texto: "Espaço bonito mas com iluminação inadequada para exposições contemporâneas.", estrelas: 3 },
        { id: "ca-5", nome: "Fernando Costa", data: "20/02/2025", texto: "Equipe do museu muito receptiva. Montagem foi rápida e organizada.", estrelas: 5 },
        { id: "ca-6", nome: "Coletivo Cais", data: "10/01/2025", texto: "O espaço tem muito potencial, mas precisa de investimento em climatização.", estrelas: 4 },
      ],
    },
    comentariosCidadaos: {
      media: 4.1, total: 52,
      lista: [
        { id: "cc-4", nome: "Anônimo", data: "01/04/2025", texto: "Acervo riquíssimo! Pena que parte dele está em restauração.", estrelas: 4 },
        { id: "cc-5", nome: "Clara Santos", data: "18/03/2025", texto: "Ótimo passeio cultural, guia muito atencioso.", estrelas: 5 },
        { id: "cc-6", nome: "Anônimo", data: "02/03/2025", texto: "Achei o espaço meio abandonado. Poderiam investir mais na conservação.", estrelas: 3 },
      ],
    },
    responsaveis: [
      { nome: "SECULT-PE", tipoVinculo: "Secretaria responsável", periodoVinculo: "desde 1929" },
      { nome: "Fundação do Patrimônio Histórico", tipoVinculo: "Cogestor", periodoVinculo: "desde 2005" },
    ],
    artistasVinculados: artistasPadrao.slice(0, 6),
  },
};

/** Returns detail for a given equipment ID, falling back to a generated default */
export function getEspacoDetalhe(id: string): EspacoDetalhe {
  if (espacosDetalheMock[id]) return espacosDetalheMock[id];

  // Generate sensible defaults for equipment without explicit detail
  return {
    id,
    descricao: "Espaço cultural cadastrado no sistema. Informações detalhadas em processo de atualização.",
    horarios: "Seg–Sex 8h–17h",
    cnpj: "00.000.000/0001-00",
    contatoNome: "Administração local",
    contatoEmail: "contato@cultura.pe.gov.br",
    contatoTelefone: "(81) 3000-0000",
    conservacao: "Bom",
    acessibilidadeGeral: "Não acessível",
    acessibilidadeItens: acessibilidadeCompleta.map(i => ({ ...i, disponivel: false })),
    acessibilidadeObs: "Dados de acessibilidade em levantamento.",
    fotos: fotosMuseu,
    metricas: {
      totalProjetos: 5, pessoasImpactadas: 2000, mediaPublicoEvento: 120, rendaGerada: 80000,
      evolucaoMensal: evolucaoPadrao.map(e => ({ ...e, eventos: Math.max(1, Math.floor(e.eventos / 2)) })),
      demografiaPublico: demografiaPadrao,
    },
    fomento: [{ nome: "Funcultura", projetos: 3 }, { nome: "Lei Rouanet", projetos: 2 }],
    comentariosArtistas: {
      media: 3.5, total: 4,
      lista: [
        { id: "def-ca1", nome: "Artista Local", data: "01/02/2025", texto: "Espaço com potencial, precisa de melhorias na infraestrutura.", estrelas: 3 },
        { id: "def-ca2", nome: "Coletivo Cultural", data: "15/12/2024", texto: "Boa receptividade da equipe local.", estrelas: 4 },
        { id: "def-ca3", nome: "Grupo Arte Viva", data: "20/10/2024", texto: "Adequado para apresentações de pequeno porte.", estrelas: 4 },
      ],
    },
    comentariosCidadaos: {
      media: 3.8, total: 15,
      lista: [
        { id: "def-cc1", nome: "Anônimo", data: "10/03/2025", texto: "Espaço simples mas acolhedor.", estrelas: 4 },
        { id: "def-cc2", nome: "Anônimo", data: "05/02/2025", texto: "Falta sinalização de acesso.", estrelas: 3 },
        { id: "def-cc3", nome: "Visitante", data: "20/01/2025", texto: "Bom para eventos comunitários.", estrelas: 4 },
      ],
    },
    responsaveis: [
      { nome: "Prefeitura Municipal", tipoVinculo: "Secretaria responsável", periodoVinculo: "desde 2010" },
    ],
    artistasVinculados: artistasPadrao.slice(0, 4),
  };
}
