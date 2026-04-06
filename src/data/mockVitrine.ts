// Dados mockados compartilhados entre as páginas da Vitrine

import festivalJazzImg from "@/assets/oportunidades/festival-jazz.jpg";
import documentarioVozesImg from "@/assets/oportunidades/documentario-vozes.jpg";
import epRaizesUrbanasImg from "@/assets/oportunidades/ep-raizes-urbanas.jpg";
import exposicaoDigitalImg from "@/assets/oportunidades/exposicao-digital.jpg";
import showAcusticoImg from "@/assets/oportunidades/show-acustico.jpg";
import teatroMemoriasImg from "@/assets/oportunidades/teatro-memorias.jpg";
import festivalLgbtqImg from "@/assets/oportunidades/festival-lgbtq.jpg";
import albumSertaoImg from "@/assets/oportunidades/album-sertao.jpg";

export interface AffinityDimension {
  label: string;
  value: number;
  descricao: string;
}

export type ProjetoStatus =
  | "rascunho"
  | "submetido"
  | "em_analise"
  | "aprovado"
  | "em_execucao"
  | "prestacao_enviada"
  | "concluido";

export interface IncentuvoLei {
  id: string;
  label: string;
  descricao: string;
}

export interface ProjetoVitrineMock {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  local: string;
  dataEvento: string | null;
  imagem: string;
  areaCultural: string;
  criadorNome: string;
  criadorId: string;
  metaCaptacao: number;
  captacaoAtual: number;
  mostrarProgresso: boolean;
  totalPropostas: number;
  isOficina: boolean;
  status: string;
  projetoStatus: ProjetoStatus;
  vagas: number;
  affinityScore: number;
  incentivosLeis?: IncentuvoLei[];
  affinityBreakdown: {
    geolocalizacao: AffinityDimension;
    persona: AffinityDimension;
    ods: AffinityDimension;
    historico: AffinityDimension;
  };
}

export const PROJETOS_VITRINE_MOCK: ProjetoVitrineMock[] = [
  {
    id: "demo-orquestra-periferica",
    titulo: "Orquestra Periférica do Recife",
    descricao:
      "Projeto de música erudita que leva cultura sinfônica às comunidades periféricas do Recife, formando jovens músicos e democratizando o acesso à arte.",
    tipo: "evento",
    local: "Recife, PE",
    dataEvento: "2025-07-15",
    imagem: showAcusticoImg,
    areaCultural: "Música",
    criadorNome: "Associação Cultural Recife Vivo",
    criadorId: "user-demo-1",
    metaCaptacao: 35000,
    captacaoAtual: 21000,
    mostrarProgresso: true,
    totalPropostas: 12,
    isOficina: false,
    status: "ativa",
    projetoStatus: "em_analise",
    vagas: 80,
    affinityScore: 95,
    incentivosLeis: [
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
      { id: "lei-procultura", label: "PROCULTURA", descricao: "Programa de Fomento à Cultura PE" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 95, descricao: "Empresa em Recife, projeto em Recife" },
      persona:        { label: "Persona",         value: 90, descricao: "Público jovem adulto — alinha com seus clientes" },
      ods:            { label: "ODS",              value: 98, descricao: "ODS 4 e 8 — prioridades declaradas da empresa" },
      historico:      { label: "Histórico",        value: 88, descricao: "Produtor com 4 projetos concluídos e aprovados" },
    },
  },
  {
    id: "demo-maracatu-nacoes",
    titulo: "Festival Maracatu das Nações",
    descricao:
      "Celebração anual do Maracatu de Baque Virado reunindo nações de todo Pernambuco, com cortejo, shows, oficinas e exposição fotográfica.",
    tipo: "festival",
    local: "Recife, PE",
    dataEvento: "2025-02-28",
    imagem: festivalJazzImg,
    areaCultural: "Cultura Popular",
    criadorNome: "Federação Pernambucana de Maracatu",
    criadorId: "user-demo-2",
    metaCaptacao: 48000,
    captacaoAtual: 31000,
    mostrarProgresso: true,
    totalPropostas: 18,
    isOficina: false,
    status: "ativa",
    projetoStatus: "aprovado",
    vagas: 500,
    affinityScore: 87,
    incentivosLeis: [
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
      { id: "lei-turismo", label: "Lei de Incentivo ao Turismo", descricao: "Incentivos para patrimônio cultural" },
      { id: "lei-procultura", label: "PROCULTURA", descricao: "Programa de Fomento à Cultura PE" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 92, descricao: "Festival no Recife Antigo — alta visibilidade regional" },
      persona:        { label: "Persona",         value: 85, descricao: "Público amplo e diverso — compatível com marca de consumo" },
      ods:            { label: "ODS",              value: 88, descricao: "ODS 10 e 11 — redução de desigualdades e cidades inclusivas" },
      historico:      { label: "Histórico",        value: 83, descricao: "Organizador com 7 edições realizadas consecutivamente" },
    },
  },
  {
    id: "demo-documentario-vozes",
    titulo: "Documentário Vozes do Sertão",
    descricao:
      "Longa-metragem documental que registra histórias de resistência e identidade cultural de comunidades do Sertão pernambucano, com distribuição nacional.",
    tipo: "filme",
    local: "Sertão, PE",
    dataEvento: null,
    imagem: documentarioVozesImg,
    areaCultural: "Audiovisual",
    criadorNome: "Produtora Sertão Filmes",
    criadorId: "user-demo-3",
    metaCaptacao: 60000,
    captacaoAtual: 42000,
    mostrarProgresso: true,
    totalPropostas: 9,
    isOficina: false,
    status: "ativa",
    projetoStatus: "em_execucao",
    vagas: 0,
    affinityScore: 82,
    incentivosLeis: [
      { id: "lei-audiovisual", label: "Lei do Audiovisual", descricao: "Incentivo fiscal para audiovisual" },
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 78, descricao: "Produção no Sertão — distribuição nacional e streaming" },
      persona:        { label: "Persona",         value: 80, descricao: "Audiência adulta engajada com cultura e identidade nordestina" },
      ods:            { label: "ODS",              value: 90, descricao: "ODS 4 e 16 — educação e valorização cultural" },
      historico:      { label: "Histórico",        value: 82, descricao: "Produtora premiada em festivais nacionais de documentário" },
    },
  },
  {
    id: "demo-cia-danca",
    titulo: "Cia de Dança Contemporânea PE",
    descricao:
      "Espetáculo que dialoga com ritmos afro-brasileiros, refletindo sobre corpo, território e identidade nordestina com elenco de dançarinos pernambucanos.",
    tipo: "evento",
    local: "Recife, PE",
    dataEvento: "2025-08-20",
    imagem: festivalLgbtqImg,
    areaCultural: "Dança",
    criadorNome: "Cia MoviMento PE",
    criadorId: "user-demo-4",
    metaCaptacao: 22000,
    captacaoAtual: 13000,
    mostrarProgresso: true,
    totalPropostas: 6,
    isOficina: false,
    status: "ativa",
    projetoStatus: "submetido",
    vagas: 200,
    affinityScore: 78,
    incentivosLeis: [
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
      { id: "lei-procultura", label: "PROCULTURA", descricao: "Programa de Fomento à Cultura PE" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 88, descricao: "Espetáculo no Recife — público local qualificado" },
      persona:        { label: "Persona",         value: 75, descricao: "Público jovem e adulto urbano com perfil cultural" },
      ods:            { label: "ODS",              value: 82, descricao: "ODS 5 e 10 — equidade de gênero e inclusão social" },
      historico:      { label: "Histórico",        value: 68, descricao: "Companhia com 3 anos e 2 temporadas bem-sucedidas" },
    },
  },
  {
    id: "demo-arte-urbana",
    titulo: "Exposição Arte Urbana Recife",
    descricao:
      "Mostra coletiva de artistas urbanos pernambucanos com intervenções em espaços públicos, painéis e instalações que ressignificam o espaço da cidade.",
    tipo: "exposicao",
    local: "Recife, PE",
    dataEvento: "2025-09-10",
    imagem: exposicaoDigitalImg,
    areaCultural: "Artes Visuais",
    criadorNome: "Coletivo Recife em Arte",
    criadorId: "user-demo-5",
    metaCaptacao: 18000,
    captacaoAtual: 9500,
    mostrarProgresso: true,
    totalPropostas: 5,
    isOficina: false,
    status: "ativa",
    projetoStatus: "rascunho",
    vagas: 150,
    affinityScore: 71,
    incentivosLeis: [
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
      { id: "lei-procultura", label: "PROCULTURA", descricao: "Programa de Fomento à Cultura PE" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 85, descricao: "Intervenções no centro e bairros do Recife" },
      persona:        { label: "Persona",         value: 70, descricao: "Público diverso — alcance massivo em espaços públicos" },
      ods:            { label: "ODS",              value: 72, descricao: "ODS 11 — cidades e comunidades sustentáveis" },
      historico:      { label: "Histórico",        value: 58, descricao: "Coletivo jovem com primeira exposição de grande escala" },
    },
  },
  {
    id: "demo-teatro-inclusivo",
    titulo: "Teatro Inclusivo do Nordeste",
    descricao:
      "Grupo teatral com elenco misto — atores com e sem deficiência — que apresenta peças do repertório nacional com audiodescrição e LIBRAS.",
    tipo: "teatro",
    local: "Caruaru, PE",
    dataEvento: "2025-10-05",
    imagem: teatroMemoriasImg,
    areaCultural: "Teatro",
    criadorNome: "Grupo Palco Inclusivo",
    criadorId: "user-demo-6",
    metaCaptacao: 28000,
    captacaoAtual: 11000,
    mostrarProgresso: true,
    totalPropostas: 4,
    isOficina: false,
    status: "ativa",
    projetoStatus: "concluido",
    vagas: 120,
    affinityScore: 65,
    incentivosLeis: [
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
      { id: "lei-procultura", label: "PROCULTURA", descricao: "Programa de Fomento à Cultura PE" },
      { id: "lei-inclusao", label: "Lei de Incentivo à Inclusão", descricao: "Projetos com foco em acessibilidade" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 72, descricao: "Caruaru — distância da sua operação principal" },
      persona:        { label: "Persona",         value: 62, descricao: "Público familiar e educacional — parcialmente alinhado" },
      ods:            { label: "ODS",              value: 78, descricao: "ODS 3 e 10 — saúde, bem-estar e redução de desigualdades" },
      historico:      { label: "Histórico",        value: 48, descricao: "Grupo iniciante — primeira temporada formal em 2024" },
    },
  },
  {
    id: "demo-ep-raizes",
    titulo: "EP Raízes Urbanas",
    descricao:
      "Projeto musical que mescla funk, baião e rap para falar das periferias do Recife. Um EP de 6 faixas com videoclipes e shows de lançamento.",
    tipo: "ep",
    local: "Recife, PE",
    dataEvento: null,
    imagem: epRaizesUrbanasImg,
    areaCultural: "Música",
    criadorNome: "MC Renata Monteiro",
    criadorId: "user-demo-7",
    metaCaptacao: 15000,
    captacaoAtual: 7200,
    mostrarProgresso: true,
    totalPropostas: 3,
    isOficina: false,
    status: "ativa",
    projetoStatus: "prestacao_enviada",
    vagas: 0,
    affinityScore: 74,
    incentivosLeis: [
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
      { id: "lei-procultura", label: "PROCULTURA", descricao: "Programa de Fomento à Cultura PE" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 80, descricao: "Artista e lançamento no Recife — mercado local ativo" },
      persona:        { label: "Persona",         value: 78, descricao: "Público jovem de 18–30 anos — audiência digital forte" },
      ods:            { label: "ODS",              value: 70, descricao: "ODS 10 — redução de desigualdades via arte periférica" },
      historico:      { label: "Histórico",        value: 68, descricao: "Artista independente com 2 singles lançados com boa repercussão" },
    },
  },
  {
    id: "demo-album-sertao",
    titulo: "Álbum do Sertão — Forró Raiz",
    descricao:
      "Gravação de álbum de forró tradicional resgatando canções do sertão pernambucano com instrumentos acústicos e arranjos autorais.",
    tipo: "ep",
    local: "Caruaru, PE",
    dataEvento: null,
    imagem: albumSertaoImg,
    areaCultural: "Música",
    criadorNome: "Banda Raízes do Agreste",
    criadorId: "user-demo-8",
    metaCaptacao: 20000,
    captacaoAtual: 8500,
    mostrarProgresso: true,
    totalPropostas: 7,
    isOficina: false,
    status: "ativa",
    projetoStatus: "aprovado",
    vagas: 0,
    affinityScore: 69,
    incentivosLeis: [
      { id: "lei-rouanet", label: "Lei Rouanet", descricao: "Incentivo Fiscal à Cultura" },
      { id: "lei-patrimonio", label: "Lei de Patrimônio Cultural", descricao: "Preservação do patrimônio imaterial" },
    ],
    affinityBreakdown: {
      geolocalizacao: { label: "Geolocalização", value: 65, descricao: "Caruaru — fora do seu território prioritário" },
      persona:        { label: "Persona",         value: 72, descricao: "Público adulto regional — coincide com presença no interior" },
      ods:            { label: "ODS",              value: 75, descricao: "ODS 4 e 11 — preservação cultural e identidade regional" },
      historico:      { label: "Histórico",        value: 63, descricao: "Banda com 5 anos e um álbum anterior independente" },
    },
  },
];

export const getProjetoById = (id: string): ProjetoVitrineMock | undefined =>
  PROJETOS_VITRINE_MOCK.find((p) => p.id === id);
