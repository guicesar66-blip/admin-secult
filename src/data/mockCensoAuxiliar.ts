// Dados auxiliares do Censo Cultural — auditoria, insights IA, cores e estatísticas
// Extraído de mockCensoCultural.ts para separar dados não-relacionais

import { tiposLinguagem } from "@/data/mockLinguagens";

// ===== CORES POR TIPO DE LINGUAGEM =====
export const coresLinguagem: Record<string, string> = {
  "Artes Cênicas": "#8b5cf6",
  "Música": "#3b82f6",
  "Audiovisual": "#ec4899",
  "Patrimônio": "#f59e0b",
  "Literatura": "#06b6d4",
  "Cultura Popular": "#eab308",
  "Artes Visuais": "#f97316",
  "Gastronomia": "#10b981",
};

// Lista de linguagens para filtros
export const linguagensArtisticas = tiposLinguagem.map((t) => t.nome);

// ===== TIPO AgenteCenso — view model para o mapa =====
export interface AgenteCenso {
  id: string;
  nome: string;
  nomeArtistico?: string;
  location: { lat: number; lng: number };
  linguagem: string; // tipo principal (ex: "Música")
  subtipos: string[]; // nomes dos subtipos
  bairro: string;
  municipio: string;
  genero: string;
  raca: string;
  formalizacao: string;
  tempoAtuacao: number;
  scoreReputacao: number;
  papel: string;
  produtoraNome: string;
  produtoraId: string;
  telefone?: string;
  email?: string;
  // Dados socioeconômicos simplificados
  escolaridade: string;
  faixaRenda: string;
  vulnerabilidades: string[];
}

// ===== PROJETOS EM AUDITORIA =====
export interface ProjetoAuditoria {
  id: string;
  titulo: string;
  artista: string;
  valor: number;
  status: "verde" | "amarelo" | "vermelho";
  statusLabel: string;
  evidencias: number;
  prazo: string;
  percentualConcluido: number;
  linguagem: string;
  municipio: string;
}

export const projetosAuditoriaMock: ProjetoAuditoria[] = [
  { id: "pa-001", titulo: "Festival de Maracatu Nação", artista: "Ana Cristina Lima", valor: 85000, status: "verde", statusLabel: "Em dia", evidencias: 12, prazo: "2026-06-15", percentualConcluido: 75, linguagem: "Cultura Popular", municipio: "Recife" },
  { id: "pa-002", titulo: "Oficina de Frevo nas Escolas", artista: "Fernanda Alves", valor: 42000, status: "verde", statusLabel: "Em dia", evidencias: 8, prazo: "2026-05-20", percentualConcluido: 90, linguagem: "Música", municipio: "Olinda" },
  { id: "pa-003", titulo: "Mostra de Grafite Urbano", artista: "Carla Souza", valor: 25000, status: "amarelo", statusLabel: "Pendência documental", evidencias: 5, prazo: "2026-04-30", percentualConcluido: 60, linguagem: "Artes Visuais", municipio: "Recife" },
  { id: "pa-004", titulo: "Documentário Mangue Rising", artista: "Thiago Ribeiro", valor: 120000, status: "verde", statusLabel: "Em dia", evidencias: 20, prazo: "2026-08-01", percentualConcluido: 45, linguagem: "Audiovisual", municipio: "Recife" },
  { id: "pa-005", titulo: "Circuito de Teatro de Bonecos", artista: "Marcos Vieira", valor: 35000, status: "vermelho", statusLabel: "Atraso na prestação", evidencias: 3, prazo: "2026-03-15", percentualConcluido: 40, linguagem: "Artes Cênicas", municipio: "Caruaru" },
  { id: "pa-006", titulo: "Slam de Poesia Periférica", artista: "Mariana Costa", valor: 18000, status: "amarelo", statusLabel: "NF com data divergente", evidencias: 4, prazo: "2026-05-10", percentualConcluido: 55, linguagem: "Literatura", municipio: "Recife" },
  { id: "pa-007", titulo: "Hip Hop Transforma", artista: "Lucas Fernandes", valor: 30000, status: "verde", statusLabel: "Em dia", evidencias: 9, prazo: "2026-07-20", percentualConcluido: 30, linguagem: "Música", municipio: "Petrolina" },
  { id: "pa-008", titulo: "Exposição Barro & Fogo", artista: "Tatiana Reis", valor: 15000, status: "vermelho", statusLabel: "CNPJ divergente", evidencias: 1, prazo: "2026-03-01", percentualConcluido: 20, linguagem: "Artes Visuais", municipio: "Garanhuns" },
];

// ===== INSIGHTS IA =====
export interface InsightIA {
  id: string;
  tipo: "deserto_cultural" | "sugestao_edital" | "alerta";
  titulo: string;
  descricao: string;
  regiao: string;
  impacto: number;
  prioridade: "alta" | "media" | "baixa";
}

export const insightsIAMock: InsightIA[] = [
  {
    id: "ia-001",
    tipo: "deserto_cultural",
    titulo: "Deserto Cultural Detectado: Petrolina",
    descricao: "Detectamos apenas 3 artistas cadastrados na região de Petrolina, com 0 editais específicos nos últimos 2 anos. A densidade artística é 85% menor que a média estadual. Sugestão: Abertura de edital de fomento à cultura do São Francisco.",
    regiao: "Petrolina",
    impacto: 45,
    prioridade: "alta",
  },
  {
    id: "ia-002",
    tipo: "sugestao_edital",
    titulo: "Potencial: Cultura Popular em Olinda",
    descricao: "Identificamos agentes culturais em Olinda com alto score de reputação (média 65) mas baixa formalização. Sugestão: Edital de capacitação e formalização de artistas tradicionais.",
    regiao: "Olinda",
    impacto: 32,
    prioridade: "media",
  },
  {
    id: "ia-003",
    tipo: "alerta",
    titulo: "Concentração: 60% dos Investimentos no Recife",
    descricao: "A análise histórica mostra que 60% dos repasses concentram-se em Recife. Recomendamos redistribuição para garantir equidade territorial conforme a Lei Aldir Blanc.",
    regiao: "Recife (geral)",
    impacto: 120,
    prioridade: "alta",
  },
  {
    id: "ia-004",
    tipo: "sugestao_edital",
    titulo: "Oportunidade: Música Tradicional como Patrimônio",
    descricao: "O Recife concentra artistas de música regional com alto impacto cultural (score médio 83). Sugestão: Edital de registro e salvaguarda da música tradicional pernambucana.",
    regiao: "Recife",
    impacto: 28,
    prioridade: "media",
  },
];

// ===== FUNÇÃO: construir AgenteCenso[] a partir dos dados relacionais =====
import { getArtistasUnicos, type Artista } from "@/data/mockArtistas";
import { usuariosMock } from "@/data/mockUsuarios";
import { produtorasMock } from "@/data/mockProdutoras";
import { getTipoNome, getSubtipoNome } from "@/data/mockLinguagens";

export function buildAgentesCenso(): AgenteCenso[] {
  const uniqueArtistas = getArtistasUnicos();
  const usuarioMap = new Map(usuariosMock.map((u) => [u.id, u]));
  const produtoraMap = new Map(produtorasMock.map((p) => [p.id, p]));

  return uniqueArtistas
    .map((a) => {
      const usuario = usuarioMap.get(a.usuario_id);
      const produtora = produtoraMap.get(a.produtora_id);
      if (!usuario || !produtora) return null;

      // Derive primary linguagem from first subtipo
      const linguagem = a.subtipo_ids.length > 0 ? getTipoNome(a.subtipo_ids[0]) : "Outros";
      const subtipos = a.subtipo_ids.map(getSubtipoNome);

      return {
        id: a.id,
        nome: usuario.nome_completo,
        nomeArtistico: a.nome_artistico,
        location: { lat: produtora.location[0], lng: produtora.location[1] },
        linguagem,
        subtipos,
        bairro: usuario.bairro || "Não informado",
        municipio: usuario.municipio,
        genero: usuario.genero,
        raca: usuario.raca_cor,
        formalizacao: a.formalizacao,
        tempoAtuacao: a.tempo_atuacao,
        scoreReputacao: a.score_reputacao,
        papel: a.papel,
        produtoraNome: produtora.nome,
        produtoraId: produtora.id,
        telefone: usuario.telefone,
        email: usuario.email,
        escolaridade: a.escolaridade,
        faixaRenda: a.faixa_renda,
        vulnerabilidades: a.vulnerabilidades,
      } as AgenteCenso;
    })
    .filter(Boolean) as AgenteCenso[];
}

// ===== ESTATÍSTICAS GERAIS (derivadas) =====
export function getEstatisticasGerais() {
  const agentes = buildAgentesCenso();
  return {
    totalAgentes: agentes.length,
    projetosAtivos: projetosAuditoriaMock.filter((p) => p.status !== "vermelho").length,
    totalInvestido: projetosAuditoriaMock.reduce((acc, p) => acc + p.valor, 0),
    alcancePopulacional: 184500,
  };
}
