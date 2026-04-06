// Mock data: Editais de Fomento Cultural
// Para fluxo de inscrição em /editais/:id/inscrever

export interface Edital {
  id: string;
  titulo: string;
  linguagem: string;
  descricao: string;
  organizador: string;
  valorTotal: number;
  projetosSelecionados: number;
  dataLimiteInscricao: string; // "DD/MM/YYYY"
  dataResultado: string;
  territorios: string[];
  documentosExigidos: {
    label: string;
    formato: string;
    tamanhoMaximo: number; // em MB
    obrigatorio: boolean;
  }[];
  criteriosAvaliacao: Array<{
    criterio: string;
    peso: number; // em %
  }>;
  prazos: Array<{
    evento: string;
    data: string;
  }>;
}

export const editaisMock: Edital[] = [
  {
    id: "sic-2026-musica",
    titulo: "SIC 2026 — Música",
    linguagem: "Música",
    descricao: `O Edital SIC 2026 para a linguagem Música visa promover projetos inovadores que fortaleçam o ecossistema musical pernambucano. Esta edição busca artistas e coletivos que desenvolvam ações de impacto social e cultural através da música, com foco em inclusão, diversidade e sustentabilidade.

    Os projetos podem incluir desde apresentações em espaços públicos, criação de conteúdo audiovisual, workshops de educação musical, até produção de álbuns e participação em festivais.

    O SECULT Recife reafirma seu compromisso com os artistas locais e com a valorização da música como ferramenta de transformação social.`,
    organizador: "SECULT Recife",
    valorTotal: 50000,
    projetosSelecionados: 10,
    dataLimiteInscricao: "30/05/2026",
    dataResultado: "20/06/2026",
    territorios: ["Recife", "RMR", "Pernambuco"],
    documentosExigidos: [
      {
        label: "Portfólio atualizado",
        formato: "PDF",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
      {
        label: "Currículo do responsável",
        formato: "PDF",
        tamanhoMaximo: 5,
        obrigatorio: true,
      },
      {
        label: "Orçamento detalhado por categoria",
        formato: "PDF, XLS",
        tamanhoMaximo: 15,
        obrigatorio: false,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Originalidade e inovação", peso: 30 },
      { criterio: "Impacto social e cultural", peso: 40 },
      { criterio: "Viabilidade técnica", peso: 30 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições", data: "30/05/2026" },
      { evento: "Resultado", data: "20/06/2026" },
      { evento: "Execução", data: "Jul-Dez/2026" },
    ],
  },
  {
    id: "sic-2026-teatro",
    titulo: "SIC 2026 — Teatro",
    linguagem: "Teatro",
    descricao: `Edital para fomento de projetos teatrais que promovam experimentação, inovação cênica e maior acesso à arte teatral.`,
    organizador: "SECULT Recife",
    valorTotal: 40000,
    projetosSelecionados: 8,
    dataLimiteInscricao: "15/06/2026",
    dataResultado: "10/07/2026",
    territorios: ["Recife", "RMR"],
    documentosExigidos: [
      {
        label: "Portfólio atualizado",
        formato: "PDF",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
      {
        label: "Currículo do responsável",
        formato: "PDF",
        tamanhoMaximo: 5,
        obrigatorio: true,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Qualidade cênica", peso: 35 },
      { criterio: "Impacto comunitário", peso: 40 },
      { criterio: "Sustentabilidade", peso: 25 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições", data: "15/06/2026" },
      { evento: "Resultado", data: "10/07/2026" },
    ],
  },
  {
    id: "sic-2026-danca",
    titulo: "SIC 2026 — Dança",
    linguagem: "Dança",
    descricao: `Edital de fomento para projetos de dança que explorem diferentes linguagens, técnicas e processos criativos. Incentiva projetos de cunho experimental, educativo e comunitário.`,
    organizador: "SECULT Recife",
    valorTotal: 35000,
    projetosSelecionados: 7,
    dataLimiteInscricao: "25/05/2026",
    dataResultado: "15/06/2026",
    territorios: ["Recife", "RMR", "Pernambuco"],
    documentosExigidos: [
      {
        label: "Vídeo do trabalho (link YouTube ou Vimeo)",
        formato: "Link",
        tamanhoMaximo: 0,
        obrigatorio: true,
      },
      {
        label: "Proposta técnica",
        formato: "PDF",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
      {
        label: "Currículo resumido",
        formato: "PDF",
        tamanhoMaximo: 5,
        obrigatorio: true,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Qualidade artística", peso: 35 },
      { criterio: "Inovação coreográfica", peso: 30 },
      { criterio: "Impacto social", peso: 35 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições", data: "25/05/2026" },
      { evento: "Resultado", data: "15/06/2026" },
      { evento: "Execução", data: "Jul-Ago/2026" },
    ],
  },
  {
    id: "sic-2026-audiovisual",
    titulo: "SIC 2026 — Audiovisual",
    linguagem: "Audiovisual",
    descricao: `Edital voltado para produção de conteúdo audiovisual em Pernambuco. Incentiva filmes, documentários, séries, web-séries e conteúdo multiplataforma que reflita a diversidade cultural pernambucana.`,
    organizador: "SECULT Recife",
    valorTotal: 60000,
    projetosSelecionados: 5,
    dataLimiteInscricao: "10/07/2026",
    dataResultado: "31/07/2026",
    territorios: ["Recife", "RMR", "Pernambuco"],
    documentosExigidos: [
      {
        label: "Roteiro e sinopse",
        formato: "PDF, DOC",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
      {
        label: "Orçamento detalhado",
        formato: "XLS, PDF",
        tamanhoMaximo: 15,
        obrigatorio: true,
      },
      {
        label: "Portfólio de produções anteriores",
        formato: "PDF, Link",
        tamanhoMaximo: 20,
        obrigatorio: false,
      },
      {
        label: "Currículo da equipe",
        formato: "PDF",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Qualidade da proposta", peso: 25 },
      { criterio: "Relevância cultural", peso: 30 },
      { criterio: "Viabilidade orçamentária", peso: 25 },
      { criterio: "Experiência da equipe", peso: 20 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições abertas", data: "10/07/2026" },
      { evento: "Resultado", data: "31/07/2026" },
      { evento: "Produção", data: "Ago-Dez/2026" },
    ],
  },
  {
    id: "sic-2026-artes-visuais",
    titulo: "SIC 2026 — Artes Visuais",
    linguagem: "Artes Visuais",
    descricao: `Edital para apoio a projetos de artes visuais incluindo pintura, escultura, fotografia, instalação, arte digital e outras expressões. Busca projetos com impacto estético e social significativo.`,
    organizador: "SECULT Recife",
    valorTotal: 30000,
    projetosSelecionados: 12,
    dataLimiteInscricao: "05/06/2026",
    dataResultado: "25/06/2026",
    territorios: ["Recife", "RMR"],
    documentosExigidos: [
      {
        label: "Portfólio de imagens (máx 20 imagens)",
        formato: "PDF",
        tamanhoMaximo: 30,
        obrigatorio: true,
      },
      {
        label: "Proposta conceitual",
        formato: "PDF, DOC",
        tamanhoMaximo: 8,
        obrigatorio: true,
      },
      {
        label: "Currículo",
        formato: "PDF",
        tamanhoMaximo: 5,
        obrigatorio: true,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Qualidade técnica e artística", peso: 40 },
      { criterio: "Originalidade", peso: 35 },
      { criterio: "Capacidade de execução", peso: 25 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições", data: "05/06/2026" },
      { evento: "Resultado", data: "25/06/2026" },
      { evento: "Exposição", data: "Jul/2026" },
    ],
  },
  {
    id: "sic-2026-literatura",
    titulo: "SIC 2026 — Literatura",
    linguagem: "Literatura",
    descricao: `Edital para apoio a projetos literários com foco em novas vozes, diversidade de narrativas e impacto cultural. Podem participar autores, coletivos de leitura, projetos de publicação e eventos literários.`,
    organizador: "SECULT Recife",
    valorTotal: 25000,
    projetosSelecionados: 6,
    dataLimiteInscricao: "20/06/2026",
    dataResultado: "10/07/2026",
    territorios: ["Recife", "RMR", "Pernambuco"],
    documentosExigidos: [
      {
        label: "Obra ou amostra de texto (primeiras páginas)",
        formato: "PDF, DOC",
        tamanhoMaximo: 8,
        obrigatorio: true,
      },
      {
        label: "Bio do autor",
        formato: "PDF",
        tamanhoMaximo: 3,
        obrigatorio: true,
      },
      {
        label: "Currículo e histórico literário",
        formato: "PDF",
        tamanhoMaximo: 5,
        obrigatorio: false,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Qualidade literária", peso: 40 },
      { criterio: "Potencial de impacto", peso: 35 },
      { criterio: "Ineditismo/Inovação", peso: 25 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições", data: "20/06/2026" },
      { evento: "Resultado", data: "10/07/2026" },
      { evento: "Publicação", data: "Ago/2026" },
    ],
  },
  {
    id: "sic-2026-circo",
    titulo: "SIC 2026 — Circo",
    linguagem: "Circo",
    descricao: `Edital dedicado a empresas de circo, artistas circenses e projetos de circo contemporâneo. Busca fortalecer a tradição circense pernambucana e incentivar novas experiências.`,
    organizador: "SECULT Recife",
    valorTotal: 45000,
    projetosSelecionados: 4,
    dataLimiteInscricao: "01/07/2026",
    dataResultado: "20/07/2026",
    territorios: ["Recife", "RMR", "Pernambuco"],
    documentosExigidos: [
      {
        label: "Vídeo de apresentação (link)",
        formato: "Link",
        tamanhoMaximo: 0,
        obrigatorio: true,
      },
      {
        label: "Descrição técnica do espetáculo",
        formato: "PDF",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
      {
        label: "Currículo da companhia",
        formato: "PDF",
        tamanhoMaximo: 8,
        obrigatorio: true,
      },
      {
        label: "Orçamento",
        formato: "XLS, PDF",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Qualidade técnica e criativa", peso: 35 },
      { criterio: "Potencial de circulação", peso: 30 },
      { criterio: "Viabilidade orçamentária", peso: 35 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições", data: "01/07/2026" },
      { evento: "Resultado", data: "20/07/2026" },
      { evento: "Apresentações", data: "Ago-Set/2026" },
    ],
  },
  {
    id: "sic-2026-cultura-popular",
    titulo: "SIC 2026 — Cultura Popular",
    linguagem: "Cultura Popular",
    descricao: `Edital dedicado à preservação, dinamização e ressignificação da cultura popular pernambucana. Incentiva manifestações tradicionais como maracatu, frevo, cavalo-marinho e outras expressões.`,
    organizador: "SECULT Recife",
    valorTotal: 50000,
    projetosSelecionados: 8,
    dataLimiteInscricao: "15/05/2026",
    dataResultado: "05/06/2026",
    territorios: ["Recife", "RMR", "Pernambuco"],
    documentosExigidos: [
      {
        label: "Registro em vídeo da manifestação",
        formato: "Link",
        tamanhoMaximo: 0,
        obrigatorio: true,
      },
      {
        label: "Histórico e contextualização cultural",
        formato: "PDF",
        tamanhoMaximo: 10,
        obrigatorio: true,
      },
      {
        label: "Currículo do(s) responsável(is)",
        formato: "PDF",
        tamanhoMaximo: 5,
        obrigatorio: true,
      },
    ],
    criteriosAvaliacao: [
      { criterio: "Autenticidade cultural", peso: 30 },
      { criterio: "Valor educativo e comunitário", peso: 40 },
      { criterio: "Viabilidade e sustentabilidade", peso: 30 },
    ],
    prazos: [
      { evento: "Hoje", data: "06/04/2026" },
      { evento: "Inscrições", data: "15/05/2026" },
      { evento: "Resultado", data: "05/06/2026" },
      { evento: "Atividades", data: "Jun-Ago/2026" },
    ],
  },
];

export function getEditalById(id: string): Edital | undefined {
  return editaisMock.find((e) => e.id === id);
}
