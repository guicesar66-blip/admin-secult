// Mock data: Vagas de Emprego Culturais

export interface Vaga {
  id: string;
  titulo: string;
  organizacao: string;
  cargo: string;
  tipo: "presencial" | "remoto" | "hibrido";
  local?: string;
  salario?: {
    minimo: number;
    maximo: number;
  };
  descricao: string;
  responsabilidades: string[];
  requisitos: string[];
  beneficios: string[];
  linguagem: string;
  dataPublicacao: string;
  dataLimite: string;
  candidatos?: number;
  featured?: boolean;
}

export const vagasMock: Vaga[] = [
  {
    id: "vaga-001",
    titulo: "Produtor Musical",
    organizacao: "Estúdio Som Criativo",
    cargo: "Produtor Musical",
    tipo: "presencial",
    local: "Recife",
    salario: { minimo: 3000, maximo: 5000 },
    descricao:
      "Buscamos produtor musical com experiência em produção de beats e arranjos eletrônicos para atuar em estúdio moderno.",
    responsabilidades: [
      "Produzir beats e trilhas para artistas",
      "Arranjar e mixar conteúdo musical",
      "Trabalhar com produção audiovisual",
      "Atender clientes e briefings",
    ],
    requisitos: [
      "Experiência mínima de 3 anos em produção",
      "Domínio de DAW (FL Studio, Ableton, Pro Tools)",
      "Conhecimento em engenharia de som",
    ],
    beneficios: [
      "Vale refeição",
      "Equipamento de qualidade",
      "Liberdade criativa",
      "Desenvolvimento profissional",
    ],
    linguagem: "Música",
    dataPublicacao: "01/04/2026",
    dataLimite: "30/04/2026",
    candidatos: 12,
    featured: true,
  },
  {
    id: "vaga-002",
    titulo: "Diretor de Arte",
    organizacao: "Coletivo Cultural Recife",
    cargo: "Diretor de Arte",
    tipo: "presencial",
    local: "Recife",
    salario: { minimo: 4000, maximo: 6500 },
    descricao:
      "Procuramos diretor de arte criativo para liderar projetos visuais e conceituais de grande escala.",
    responsabilidades: [
      "Definir direção visual dos projetos",
      "Coordenar equipe criativa",
      "Desenvolver conceitos artísticos",
      "Acompanhar execução de obras",
    ],
    requisitos: [
      "Portfólio com trabalhos autorais",
      "Formação em Artes ou similar",
      "Liderança e criatividade",
    ],
    beneficios: [
      "Flexibilidade de horário",
      "Vale cultura",
      "Participação em decisões criativas",
    ],
    linguagem: "Artes Visuais",
    dataPublicacao: "02/04/2026",
    dataLimite: "25/04/2026",
    candidatos: 8,
  },
  {
    id: "vaga-003",
    titulo: "Ator/Atriz",
    organizacao: "Companhia de Teatro Pernambucano",
    cargo: "Ator/Atriz",
    tipo: "presencial",
    local: "Recife",
    salario: { minimo: 2500, maximo: 4000 },
    descricao:
      "Estamos selecionando atores e atrizes para participar de nossa temporada de espetáculos 2026.",
    responsabilidades: [
      "Atuar em espetáculos teatrais",
      "Participar de ensaios e workshops",
      "Manter presença em redes sociais",
      "Engajar com público",
    ],
    requisitos: [
      "Experiência em teatro",
      "Presença de palco",
      "Flexibilidade com horários",
    ],
    beneficios: [
      "Salário por temporada",
      "Seguro saúde",
      "Cachês avulsos",
      "Visibilidade profissional",
    ],
    linguagem: "Teatro",
    dataPublicacao: "03/04/2026",
    dataLimite: "20/05/2026",
    candidatos: 25,
  },
  {
    id: "vaga-004",
    titulo: "Editor de Vídeo",
    organizacao: "Produtora Audiovisual Positivo",
    cargo: "Editor de Vídeo",
    tipo: "remoto",
    descricao:
      "Procuramos editor de vídeo para trabalhar em projetos de conteúdo digital, documentários e campanhas.",
    responsabilidades: [
      "Editar conteúdo para web e TV",
      "Trabalhar com motion graphics",
      "Otimizar vídeos para diferentes plataformas",
      "Manter comunicação com criadores",
    ],
    requisitos: [
      "Experiência com Adobe Premiere, DaVinci Resolve",
      "Motion graphics básico",
      "Compreensão de narrativa visual",
    ],
    beneficios: [
      "Trabalho 100% remoto",
      "Horário flexível",
      "Bônus por performance",
      "Equipamento",
    ],
    linguagem: "Audiovisual",
    dataPublicacao: "04/04/2026",
    dataLimite: "30/04/2026",
    candidatos: 15,
  },
  {
    id: "vaga-005",
    titulo: "Curador de Exposições",
    organizacao: "Museu de Arte Moderna Recife",
    cargo: "Curador de Exposições",
    tipo: "presencial",
    local: "Recife",
    salario: { minimo: 5000, maximo: 8000 },
    descricao:
      "Buscamos curador experiente para coordenar exposições de arte contemporânea e tradicional.",
    responsabilidades: [
      "Curadorias temáticas",
      "Gestão de acervo",
      "Comunicação com artistas",
      "Desenvolvimento de públicos",
    ],
    requisitos: [
      "Mestrado em Artes recomendado",
      "Experiência em curadoria",
      "Conhecimento de história da arte",
    ],
    beneficios: [
      "Salário competitivo",
      "Convênios",
      "Acesso a eventos exclusivos",
      "Desenvolvimento acadêmico",
    ],
    linguagem: "Artes Visuais",
    dataPublicacao: "05/04/2026",
    dataLimite: "15/05/2026",
    candidatos: 6,
    featured: true,
  },
  {
    id: "vaga-006",
    titulo: "Instrutor de Dança",
    organizacao: "Centro de Dança Corpo e Movimento",
    cargo: "Instrutor de Dança",
    tipo: "hibrido",
    local: "Recife",
    salario: { minimo: 2000, maximo: 3500 },
    descricao:
      "Procuramos instrutores de dança para realizar aulas presenciais e online de diferentes técnicas.",
    responsabilidades: [
      "Ministrar aulas de dança",
      "Preparar coreografias",
      "Acompanhar progresso de alunos",
      "Criar conteúdo para plataforma online",
    ],
    requisitos: [
      "Formação técnica em dança",
      "Experiência no ensino",
      "Flexibilidade com horários",
    ],
    beneficios: [
      "Flexibilidade de horário",
      "Participação em projetos especiais",
      "Treinamentos contínuos",
    ],
    linguagem: "Dança",
    dataPublicacao: "06/04/2026",
    dataLimite: "30/04/2026",
    candidatos: 18,
  },
  {
    id: "vaga-007",
    titulo: "Gestor de Projetos Culturais",
    organizacao: "SECULT Recife",
    cargo: "Gestor de Projetos Culturais",
    tipo: "presencial",
    local: "Recife",
    salario: { minimo: 3500, maximo: 5500 },
    descricao:
      "A SECULT busca profissional para gestão de projetos culturais, acompanhamento de editais e relacionamento com proponentes.",
    responsabilidades: [
      "Gerenciar cronograma de editais",
      "Avaliar propostas",
      "Acompanhar execução de projetos",
      "Elaborar relatórios",
    ],
    requisitos: [
      "Experiência em gestão cultural",
      "Conhecimento de políticas públicas",
      "Habilidades administrativas",
    ],
    beneficios: [
      "Estabilidade de cargo público",
      "Benefício de servidor",
      "Possibilidade de crescimento",
    ],
    linguagem: "Cultura Popular",
    dataPublicacao: "06/04/2026",
    dataLimite: "15/05/2026",
    candidatos: 32,
  },
  {
    id: "vaga-008",
    titulo: "Ilustrador Digital",
    organizacao: "Agência Criativa Pernambuco",
    cargo: "Ilustrador Digital",
    tipo: "remoto",
    descricao:
      "Buscamos ilustrador digital criativo para trabalhar em projetos de branding, editorial e campanhas.",
    responsabilidades: [
      "Criar ilustrações customizadas",
      "Trabalhar com conceitos criativos",
      "Revisar feedback de clientes",
      "Manter portfolio atualizado",
    ],
    requisitos: [
      "Domínio de Procreate, Photoshop ou similar",
      "Portfólio robusto",
      "Criatividade e originalidade",
    ],
    beneficios: [
      "100% remoto",
      "Flexibilidade de projetos",
      "Bônus por criatividade",
    ],
    linguagem: "Artes Visuais",
    dataPublicacao: "05/04/2026",
    dataLimite: "20/04/2026",
    candidatos: 11,
  },
];

export function getVagaById(id: string): Vaga | undefined {
  return vagasMock.find((v) => v.id === id);
}

export function getVagasPorLinguagem(linguagem: string): Vaga[] {
  return vagasMock.filter((v) => v.linguagem === linguagem);
}
