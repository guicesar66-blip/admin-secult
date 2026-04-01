export interface AcessibilidadeEspaco {
  rampa: boolean;
  elevador: boolean;
  banheiro_adaptado: boolean;
  piso_tatil: boolean;
  vagas_pcd: boolean;
  audiodescricao: boolean;
  libras: boolean;
}

export interface EquipamentoCultural {
  id: string;
  nome: string;
  tipo: "Teatro" | "Museu" | "Biblioteca" | "CEU" | "Espaço Independente";
  municipio: string;
  mesorregiao: "Metropolitana" | "Agreste" | "Sertão" | "Vale do São Francisco";
  bairro?: string;
  capacidade?: number;
  gestao: "Público" | "Privado" | "Misto";
  status: "Ativo" | "Inativo";
  conservacao: "Excelente" | "Bom" | "Regular" | "Precário";
  acessibilidade: AcessibilidadeEspaco;
  nivelAcessibilidade: "Total" | "Parcial" | "Não acessível";
  linguagens: string[];
  publicoMensal: number;
  projetosRealizados: number;
  avaliacaoArtistas: number;
  avaliacaoCidadaos: number;
  location: { lat: number; lng: number };
}

export interface MunicipioAcesso {
  municipio: string;
  tempoMedio: number;
  equipamentoProximo: string;
  tipoEquipamento: string;
  distanciaKm: number;
  location: { lat: number; lng: number };
}

function acessivel(a: AcessibilidadeEspaco): "Total" | "Parcial" | "Não acessível" {
  const total = Object.values(a).filter(Boolean).length;
  if (total === 7) return "Total";
  if (total >= 3) return "Parcial";
  return "Não acessível";
}

const a1: AcessibilidadeEspaco = { rampa: true, elevador: false, banheiro_adaptado: true, piso_tatil: false, vagas_pcd: true, audiodescricao: true, libras: false };
const a2: AcessibilidadeEspaco = { rampa: true, elevador: true, banheiro_adaptado: true, piso_tatil: true, vagas_pcd: true, audiodescricao: true, libras: true };
const a3: AcessibilidadeEspaco = { rampa: true, elevador: false, banheiro_adaptado: true, piso_tatil: false, vagas_pcd: true, audiodescricao: false, libras: false };
const a4: AcessibilidadeEspaco = { rampa: false, elevador: false, banheiro_adaptado: false, piso_tatil: false, vagas_pcd: false, audiodescricao: false, libras: false };
const a5: AcessibilidadeEspaco = { rampa: true, elevador: true, banheiro_adaptado: true, piso_tatil: true, vagas_pcd: true, audiodescricao: false, libras: false };
const a6: AcessibilidadeEspaco = { rampa: true, elevador: false, banheiro_adaptado: false, piso_tatil: false, vagas_pcd: true, audiodescricao: false, libras: false };

export const equipamentosMock: EquipamentoCultural[] = [
  // Recife — Metropolitana
  { id: "eq-001", nome: "Teatro Santa Isabel", tipo: "Teatro", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Santo Antônio", capacidade: 700, gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a1, nivelAcessibilidade: acessivel(a1), linguagens: ["Música", "Teatro", "Dança"], publicoMensal: 4800, projetosRealizados: 38, avaliacaoArtistas: 4.2, avaliacaoCidadaos: 4.6, location: { lat: -8.0631, lng: -34.8760 } },
  { id: "eq-002", nome: "Museu do Estado de PE", tipo: "Museu", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Graças", gestao: "Público", status: "Ativo", conservacao: "Excelente", acessibilidade: a2, nivelAcessibilidade: acessivel(a2), linguagens: ["Artes Visuais", "Patrimônio"], publicoMensal: 3200, projetosRealizados: 15, avaliacaoArtistas: 4.0, avaliacaoCidadaos: 4.3, location: { lat: -8.0445, lng: -34.9005 } },
  { id: "eq-003", nome: "Biblioteca Pública de PE", tipo: "Biblioteca", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Santo Amaro", gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Literatura"], publicoMensal: 2100, projetosRealizados: 8, avaliacaoArtistas: 3.8, avaliacaoCidadaos: 4.1, location: { lat: -8.0540, lng: -34.8820 } },
  { id: "eq-004", nome: "Teatro Luiz Mendonça", tipo: "Teatro", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Parque Dona Lindu", capacidade: 200, gestao: "Público", status: "Ativo", conservacao: "Excelente", acessibilidade: a5, nivelAcessibilidade: acessivel(a5), linguagens: ["Teatro", "Música", "Dança"], publicoMensal: 3500, projetosRealizados: 22, avaliacaoArtistas: 4.5, avaliacaoCidadaos: 4.7, location: { lat: -8.1310, lng: -34.9070 } },
  { id: "eq-005", nome: "Museu Cais do Sertão", tipo: "Museu", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Recife Antigo", gestao: "Público", status: "Ativo", conservacao: "Excelente", acessibilidade: a2, nivelAcessibilidade: acessivel(a2), linguagens: ["Música", "Patrimônio", "Cultura Popular"], publicoMensal: 5200, projetosRealizados: 12, avaliacaoArtistas: 4.4, avaliacaoCidadaos: 4.8, location: { lat: -8.0590, lng: -34.8700 } },
  { id: "eq-006", nome: "Paço do Frevo", tipo: "Museu", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Recife Antigo", gestao: "Público", status: "Ativo", conservacao: "Excelente", acessibilidade: a2, nivelAcessibilidade: acessivel(a2), linguagens: ["Dança", "Música", "Patrimônio"], publicoMensal: 4100, projetosRealizados: 10, avaliacaoArtistas: 4.6, avaliacaoCidadaos: 4.9, location: { lat: -8.0612, lng: -34.8710 } },
  { id: "eq-007", nome: "Teatro Apolo", tipo: "Teatro", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Santo Antônio", capacidade: 818, gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a1, nivelAcessibilidade: acessivel(a1), linguagens: ["Teatro", "Música"], publicoMensal: 5500, projetosRealizados: 30, avaliacaoArtistas: 4.3, avaliacaoCidadaos: 4.5, location: { lat: -8.0625, lng: -34.8775 } },
  { id: "eq-008", nome: "Espaço Cultural Estrela de Lia", tipo: "Espaço Independente", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Alto José do Pinho", gestao: "Privado", status: "Ativo", conservacao: "Regular", acessibilidade: a6, nivelAcessibilidade: acessivel(a6), linguagens: ["Cultura Popular", "Música"], publicoMensal: 800, projetosRealizados: 5, avaliacaoArtistas: 4.1, avaliacaoCidadaos: 3.9, location: { lat: -8.0210, lng: -34.9095 } },
  { id: "eq-009", nome: "CEU das Artes Recife", tipo: "CEU", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Ibura", capacidade: 500, gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a5, nivelAcessibilidade: acessivel(a5), linguagens: ["Teatro", "Dança", "Música", "Artes Visuais"], publicoMensal: 3100, projetosRealizados: 18, avaliacaoArtistas: 3.9, avaliacaoCidadaos: 4.2, location: { lat: -8.1140, lng: -34.9420 } },
  { id: "eq-010", nome: "Biblioteca Popular de Casa Amarela", tipo: "Biblioteca", municipio: "Recife", mesorregiao: "Metropolitana", bairro: "Casa Amarela", gestao: "Público", status: "Ativo", conservacao: "Regular", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Literatura"], publicoMensal: 1500, projetosRealizados: 4, avaliacaoArtistas: 3.5, avaliacaoCidadaos: 3.8, location: { lat: -8.0180, lng: -34.9200 } },
  // Caruaru — Agreste
  { id: "eq-011", nome: "Teatro Rui Limeira Rosal", tipo: "Teatro", municipio: "Caruaru", mesorregiao: "Agreste", capacidade: 420, gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Teatro", "Música"], publicoMensal: 2800, projetosRealizados: 14, avaliacaoArtistas: 4.0, avaliacaoCidadaos: 4.2, location: { lat: -8.2844, lng: -35.9761 } },
  { id: "eq-012", nome: "Museu do Barro", tipo: "Museu", municipio: "Caruaru", mesorregiao: "Agreste", gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a6, nivelAcessibilidade: acessivel(a6), linguagens: ["Artesanato", "Cultura Popular"], publicoMensal: 1900, projetosRealizados: 6, avaliacaoArtistas: 4.2, avaliacaoCidadaos: 4.4, location: { lat: -8.2820, lng: -35.9710 } },
  { id: "eq-013", nome: "Espaço Cultural Tancredo Neves", tipo: "Espaço Independente", municipio: "Caruaru", mesorregiao: "Agreste", gestao: "Público", status: "Ativo", conservacao: "Regular", acessibilidade: a4, nivelAcessibilidade: acessivel(a4), linguagens: ["Teatro", "Música", "Dança"], publicoMensal: 1200, projetosRealizados: 8, avaliacaoArtistas: 3.6, avaliacaoCidadaos: 3.5, location: { lat: -8.2830, lng: -35.9740 } },
  // Olinda — Metropolitana
  { id: "eq-014", nome: "Museu do Mamulengo", tipo: "Museu", municipio: "Olinda", mesorregiao: "Metropolitana", gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a6, nivelAcessibilidade: acessivel(a6), linguagens: ["Teatro", "Cultura Popular"], publicoMensal: 2200, projetosRealizados: 7, avaliacaoArtistas: 4.3, avaliacaoCidadaos: 4.5, location: { lat: -8.0117, lng: -34.8515 } },
  { id: "eq-015", nome: "Biblioteca Pública de Olinda", tipo: "Biblioteca", municipio: "Olinda", mesorregiao: "Metropolitana", gestao: "Público", status: "Ativo", conservacao: "Regular", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Literatura"], publicoMensal: 1600, projetosRealizados: 3, avaliacaoArtistas: 3.4, avaliacaoCidadaos: 3.7, location: { lat: -8.0135, lng: -34.8530 } },
  // Garanhuns — Agreste
  { id: "eq-016", nome: "Teatro Municipal de Garanhuns", tipo: "Teatro", municipio: "Garanhuns", mesorregiao: "Agreste", capacidade: 350, gestao: "Público", status: "Ativo", conservacao: "Regular", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Teatro", "Música"], publicoMensal: 1800, projetosRealizados: 9, avaliacaoArtistas: 3.7, avaliacaoCidadaos: 3.9, location: { lat: -8.8900, lng: -36.4966 } },
  { id: "eq-017", nome: "CEU das Artes Garanhuns", tipo: "CEU", municipio: "Garanhuns", mesorregiao: "Agreste", capacidade: 400, gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a5, nivelAcessibilidade: acessivel(a5), linguagens: ["Dança", "Música", "Teatro"], publicoMensal: 2600, projetosRealizados: 11, avaliacaoArtistas: 4.1, avaliacaoCidadaos: 4.3, location: { lat: -8.8920, lng: -36.4950 } },
  // Petrolina — Vale do São Francisco
  { id: "eq-018", nome: "Museu do Sertão", tipo: "Museu", municipio: "Petrolina", mesorregiao: "Vale do São Francisco", gestao: "Público", status: "Ativo", conservacao: "Regular", acessibilidade: a6, nivelAcessibilidade: acessivel(a6), linguagens: ["Patrimônio", "Cultura Popular"], publicoMensal: 1400, projetosRealizados: 4, avaliacaoArtistas: 3.5, avaliacaoCidadaos: 3.6, location: { lat: -9.3891, lng: -40.5028 } },
  { id: "eq-019", nome: "Biblioteca Municipal de Petrolina", tipo: "Biblioteca", municipio: "Petrolina", mesorregiao: "Vale do São Francisco", gestao: "Público", status: "Inativo", conservacao: "Precário", acessibilidade: a4, nivelAcessibilidade: acessivel(a4), linguagens: ["Literatura"], publicoMensal: 0, projetosRealizados: 1, avaliacaoArtistas: 2.1, avaliacaoCidadaos: 2.0, location: { lat: -9.3880, lng: -40.5010 } },
  // Arcoverde — Sertão
  { id: "eq-020", nome: "Espaço Cultural de Arcoverde", tipo: "Espaço Independente", municipio: "Arcoverde", mesorregiao: "Sertão", gestao: "Misto", status: "Ativo", conservacao: "Regular", acessibilidade: a4, nivelAcessibilidade: acessivel(a4), linguagens: ["Música", "Cultura Popular"], publicoMensal: 900, projetosRealizados: 3, avaliacaoArtistas: 3.3, avaliacaoCidadaos: 3.4, location: { lat: -8.4190, lng: -37.0540 } },
  // Jaboatão — Metropolitana
  { id: "eq-021", nome: "Teatro Municipal de Jaboatão", tipo: "Teatro", municipio: "Jaboatão dos Guararapes", mesorregiao: "Metropolitana", capacidade: 280, gestao: "Público", status: "Ativo", conservacao: "Regular", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Teatro", "Música"], publicoMensal: 2000, projetosRealizados: 10, avaliacaoArtistas: 3.6, avaliacaoCidadaos: 3.8, location: { lat: -8.1130, lng: -35.0156 } },
  { id: "eq-022", nome: "Biblioteca Pública de Jaboatão", tipo: "Biblioteca", municipio: "Jaboatão dos Guararapes", mesorregiao: "Metropolitana", gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Literatura"], publicoMensal: 1300, projetosRealizados: 2, avaliacaoArtistas: 3.2, avaliacaoCidadaos: 3.5, location: { lat: -8.1120, lng: -35.0140 } },
  // Serra Talhada — Sertão
  { id: "eq-023", nome: "Museu do Cangaço", tipo: "Museu", municipio: "Serra Talhada", mesorregiao: "Sertão", gestao: "Público", status: "Ativo", conservacao: "Bom", acessibilidade: a6, nivelAcessibilidade: acessivel(a6), linguagens: ["Patrimônio", "Cultura Popular"], publicoMensal: 1100, projetosRealizados: 3, avaliacaoArtistas: 3.8, avaliacaoCidadaos: 4.0, location: { lat: -7.9861, lng: -38.2921 } },
  // Gravatá — Agreste
  { id: "eq-024", nome: "Centro Cultural de Gravatá", tipo: "Espaço Independente", municipio: "Gravatá", mesorregiao: "Agreste", gestao: "Misto", status: "Ativo", conservacao: "Bom", acessibilidade: a3, nivelAcessibilidade: acessivel(a3), linguagens: ["Artes Visuais", "Música"], publicoMensal: 1000, projetosRealizados: 5, avaliacaoArtistas: 3.9, avaliacaoCidadaos: 4.1, location: { lat: -8.2005, lng: -35.5649 } },
  // Cabo de Santo Agostinho — Metropolitana
  { id: "eq-025", nome: "CEU das Artes Cabo", tipo: "CEU", municipio: "Cabo de Santo Agostinho", mesorregiao: "Metropolitana", capacidade: 350, gestao: "Público", status: "Ativo", conservacao: "Excelente", acessibilidade: a5, nivelAcessibilidade: acessivel(a5), linguagens: ["Música", "Dança", "Teatro", "Artes Visuais"], publicoMensal: 2800, projetosRealizados: 13, avaliacaoArtistas: 4.2, avaliacaoCidadaos: 4.4, location: { lat: -8.2844, lng: -35.0290 } },
  // Salgueiro — Sertão (precário)
  { id: "eq-026", nome: "Cine-Teatro de Salgueiro", tipo: "Teatro", municipio: "Salgueiro", mesorregiao: "Sertão", capacidade: 180, gestao: "Público", status: "Inativo", conservacao: "Precário", acessibilidade: a4, nivelAcessibilidade: acessivel(a4), linguagens: ["Teatro"], publicoMensal: 0, projetosRealizados: 1, avaliacaoArtistas: 2.0, avaliacaoCidadaos: 1.8, location: { lat: -8.0744, lng: -39.1190 } },
  // Arcoverde — Sertão (precário)
  { id: "eq-027", nome: "Biblioteca de Arcoverde", tipo: "Biblioteca", municipio: "Arcoverde", mesorregiao: "Sertão", gestao: "Público", status: "Inativo", conservacao: "Precário", acessibilidade: a4, nivelAcessibilidade: acessivel(a4), linguagens: ["Literatura"], publicoMensal: 0, projetosRealizados: 0, avaliacaoArtistas: 1.5, avaliacaoCidadaos: 1.9, location: { lat: -8.4210, lng: -37.0560 } },
  // Camaragibe — Metropolitana (precário)
  { id: "eq-028", nome: "CEU Camaragibe", tipo: "CEU", municipio: "Camaragibe", mesorregiao: "Metropolitana", capacidade: 300, gestao: "Público", status: "Inativo", conservacao: "Precário", acessibilidade: a4, nivelAcessibilidade: acessivel(a4), linguagens: ["Música", "Dança"], publicoMensal: 0, projetosRealizados: 2, avaliacaoArtistas: 2.2, avaliacaoCidadaos: 2.5, location: { lat: -8.0235, lng: -34.9790 } },
];

export const tiposEquipamento = ["Teatro", "Museu", "Biblioteca", "CEU", "Espaço Independente"] as const;

export const iconesTipoEquipamento: Record<string, string> = {
  "Teatro": "🎭",
  "Museu": "🏛️",
  "Biblioteca": "📚",
  "CEU": "🏟️",
  "Espaço Independente": "🎨",
};

export const conservacaoCores: Record<string, string> = {
  "Excelente": "#22c55e",
  "Bom": "#eab308",
  "Regular": "#f97316",
  "Precário": "#ef4444",
};

export const municipiosAcessoMock: MunicipioAcesso[] = [
  { municipio: "Recife", tempoMedio: 12, equipamentoProximo: "Teatro Santa Isabel", tipoEquipamento: "Teatro", distanciaKm: 3, location: { lat: -8.0576, lng: -34.8770 } },
  { municipio: "Olinda", tempoMedio: 18, equipamentoProximo: "Museu do Mamulengo", tipoEquipamento: "Museu", distanciaKm: 5, location: { lat: -8.0117, lng: -34.8515 } },
  { municipio: "Jaboatão dos Guararapes", tempoMedio: 25, equipamentoProximo: "Teatro Municipal de Jaboatão", tipoEquipamento: "Teatro", distanciaKm: 8, location: { lat: -8.1130, lng: -35.0156 } },
  { municipio: "Cabo de Santo Agostinho", tempoMedio: 28, equipamentoProximo: "CEU das Artes Cabo", tipoEquipamento: "CEU", distanciaKm: 10, location: { lat: -8.2844, lng: -35.0290 } },
  { municipio: "Camaragibe", tempoMedio: 35, equipamentoProximo: "Biblioteca Popular de Casa Amarela", tipoEquipamento: "Biblioteca", distanciaKm: 15, location: { lat: -8.0235, lng: -34.9790 } },
  { municipio: "Paulista", tempoMedio: 38, equipamentoProximo: "Biblioteca Pública de Olinda", tipoEquipamento: "Biblioteca", distanciaKm: 18, location: { lat: -7.9395, lng: -34.8728 } },
  { municipio: "Igarassu", tempoMedio: 42, equipamentoProximo: "Biblioteca Pública de Olinda", tipoEquipamento: "Biblioteca", distanciaKm: 28, location: { lat: -7.8343, lng: -34.9069 } },
  { municipio: "Caruaru", tempoMedio: 15, equipamentoProximo: "Teatro Rui Limeira Rosal", tipoEquipamento: "Teatro", distanciaKm: 4, location: { lat: -8.2844, lng: -35.9761 } },
  { municipio: "Garanhuns", tempoMedio: 20, equipamentoProximo: "Teatro Municipal de Garanhuns", tipoEquipamento: "Teatro", distanciaKm: 6, location: { lat: -8.8900, lng: -36.4966 } },
  { municipio: "Gravatá", tempoMedio: 45, equipamentoProximo: "Centro Cultural de Gravatá", tipoEquipamento: "Espaço Independente", distanciaKm: 12, location: { lat: -8.2005, lng: -35.5649 } },
  { municipio: "Vitória de Santo Antão", tempoMedio: 68, equipamentoProximo: "Espaço Cultural Tancredo Neves", tipoEquipamento: "Espaço Independente", distanciaKm: 52, location: { lat: -8.1266, lng: -35.2914 } },
  { municipio: "Carpina", tempoMedio: 72, equipamentoProximo: "Biblioteca Pública de Olinda", tipoEquipamento: "Biblioteca", distanciaKm: 55, location: { lat: -7.8456, lng: -35.2555 } },
  { municipio: "Limoeiro", tempoMedio: 85, equipamentoProximo: "Espaço Cultural Tancredo Neves", tipoEquipamento: "Espaço Independente", distanciaKm: 72, location: { lat: -7.8740, lng: -35.4510 } },
  { municipio: "Serra Talhada", tempoMedio: 90, equipamentoProximo: "Museu do Cangaço", tipoEquipamento: "Museu", distanciaKm: 5, location: { lat: -7.9861, lng: -38.2921 } },
  { municipio: "Inajá", tempoMedio: 168, equipamentoProximo: "Teatro Municipal de Garanhuns", tipoEquipamento: "Teatro", distanciaKm: 185, location: { lat: -8.9022, lng: -37.8310 } },
  { municipio: "Itacuruba", tempoMedio: 192, equipamentoProximo: "Museu do Sertão", tipoEquipamento: "Museu", distanciaKm: 210, location: { lat: -8.7490, lng: -38.6960 } },
  { municipio: "Manari", tempoMedio: 151, equipamentoProximo: "Espaço Cultural de Arcoverde", tipoEquipamento: "Espaço Independente", distanciaKm: 145, location: { lat: -8.9610, lng: -37.6340 } },
  { municipio: "Betânia", tempoMedio: 165, equipamentoProximo: "Espaço Cultural de Arcoverde", tipoEquipamento: "Espaço Independente", distanciaKm: 160, location: { lat: -8.2736, lng: -38.0363 } },
  { municipio: "Calumbi", tempoMedio: 175, equipamentoProximo: "Museu do Cangaço", tipoEquipamento: "Museu", distanciaKm: 78, location: { lat: -7.9373, lng: -38.1466 } },
];

// ===== DADOS AGREGADOS PARA MÉTRICAS US-10 =====
export const evolucaoPublicoMensal = [
  { mes: "Mai/25", publico: 28500 },
  { mes: "Jun/25", publico: 31200 },
  { mes: "Jul/25", publico: 35800 },
  { mes: "Ago/25", publico: 33400 },
  { mes: "Set/25", publico: 29100 },
  { mes: "Out/25", publico: 32700 },
  { mes: "Nov/25", publico: 36200 },
  { mes: "Dez/25", publico: 42100 },
  { mes: "Jan/26", publico: 38900 },
  { mes: "Fev/26", publico: 45600 },
  { mes: "Mar/26", publico: 41200 },
  { mes: "Abr/26", publico: 37800 },
];

export const evolucaoConservacaoTrimestral = [
  { trimestre: "Q2/25", Excelente: 4, Bom: 10, Regular: 9, Precário: 5 },
  { trimestre: "Q3/25", Excelente: 4, Bom: 11, Regular: 8, Precário: 5 },
  { trimestre: "Q4/25", Excelente: 5, Bom: 11, Regular: 8, Precário: 4 },
  { trimestre: "Q1/26", Excelente: 5, Bom: 12, Regular: 8, Precário: 3 },
];

export const projetosPorInstrumento = [
  { instrumento: "Funcultura", projetos: 42 },
  { instrumento: "Lei Paulo Gustavo", projetos: 35 },
  { instrumento: "SIC Recife", projetos: 28 },
  { instrumento: "Aldir Blanc", projetos: 22 },
  { instrumento: "Lei Rouanet", projetos: 15 },
  { instrumento: "Edital Municipal", projetos: 12 },
];

// ===== HELPERS =====
export const acessoKPI = {
  percentualAte1h: 61,
  totalMunicipiosComEquipamento: 12,
  totalEquipamentos: equipamentosMock.length,
  municipiosCriticos: municipiosAcessoMock.filter(m => m.tempoMedio > 120).length,
};

export function getFaixaAcesso(minutos: number): { cor: string; label: string; classe: string } {
  if (minutos <= 30) return { cor: "#22c55e", label: "Até 30 min", classe: "success" };
  if (minutos <= 60) return { cor: "#eab308", label: "30 min – 1h", classe: "warning" };
  if (minutos <= 120) return { cor: "#f97316", label: "1h – 2h", classe: "orange" };
  return { cor: "#ef4444", label: "Mais de 2h", classe: "destructive" };
}

export function formatarTempo(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
}
