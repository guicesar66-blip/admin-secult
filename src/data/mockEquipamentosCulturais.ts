export interface EquipamentoCultural {
  id: string;
  nome: string;
  tipo: "Teatro" | "Museu" | "Biblioteca" | "CEU" | "Espaço Independente";
  municipio: string;
  bairro?: string;
  capacidade?: number;
  gestao: "Público" | "Privado" | "Misto";
  status: "Ativo" | "Inativo";
  location: { lat: number; lng: number };
}

export interface MunicipioAcesso {
  municipio: string;
  tempoMedio: number; // minutos
  equipamentoProximo: string;
  tipoEquipamento: string;
  distanciaKm: number;
  location: { lat: number; lng: number };
}

export const equipamentosMock: EquipamentoCultural[] = [
  // Recife
  { id: "eq-001", nome: "Teatro Santa Isabel", tipo: "Teatro", municipio: "Recife", bairro: "Santo Antônio", capacidade: 700, gestao: "Público", status: "Ativo", location: { lat: -8.0631, lng: -34.8760 } },
  { id: "eq-002", nome: "Museu do Estado de PE", tipo: "Museu", municipio: "Recife", bairro: "Graças", gestao: "Público", status: "Ativo", location: { lat: -8.0445, lng: -34.9005 } },
  { id: "eq-003", nome: "Biblioteca Pública de PE", tipo: "Biblioteca", municipio: "Recife", bairro: "Santo Amaro", gestao: "Público", status: "Ativo", location: { lat: -8.0540, lng: -34.8820 } },
  { id: "eq-004", nome: "Teatro Luiz Mendonça", tipo: "Teatro", municipio: "Recife", bairro: "Parque Dona Lindu", capacidade: 200, gestao: "Público", status: "Ativo", location: { lat: -8.1310, lng: -34.9070 } },
  { id: "eq-005", nome: "Museu Cais do Sertão", tipo: "Museu", municipio: "Recife", bairro: "Recife Antigo", gestao: "Público", status: "Ativo", location: { lat: -8.0590, lng: -34.8700 } },
  { id: "eq-006", nome: "Paço do Frevo", tipo: "Museu", municipio: "Recife", bairro: "Recife Antigo", gestao: "Público", status: "Ativo", location: { lat: -8.0612, lng: -34.8710 } },
  { id: "eq-007", nome: "Teatro Apolo", tipo: "Teatro", municipio: "Recife", bairro: "Santo Antônio", capacidade: 818, gestao: "Público", status: "Ativo", location: { lat: -8.0625, lng: -34.8775 } },
  { id: "eq-008", nome: "Espaço Cultural Estrela de Lia", tipo: "Espaço Independente", municipio: "Recife", bairro: "Alto José do Pinho", gestao: "Privado", status: "Ativo", location: { lat: -8.0210, lng: -34.9095 } },
  { id: "eq-009", nome: "CEU das Artes Recife", tipo: "CEU", municipio: "Recife", bairro: "Ibura", capacidade: 500, gestao: "Público", status: "Ativo", location: { lat: -8.1140, lng: -34.9420 } },
  { id: "eq-010", nome: "Biblioteca Popular de Casa Amarela", tipo: "Biblioteca", municipio: "Recife", bairro: "Casa Amarela", gestao: "Público", status: "Ativo", location: { lat: -8.0180, lng: -34.9200 } },

  // Caruaru
  { id: "eq-011", nome: "Teatro Rui Limeira Rosal", tipo: "Teatro", municipio: "Caruaru", capacidade: 420, gestao: "Público", status: "Ativo", location: { lat: -8.2844, lng: -35.9761 } },
  { id: "eq-012", nome: "Museu do Barro", tipo: "Museu", municipio: "Caruaru", gestao: "Público", status: "Ativo", location: { lat: -8.2820, lng: -35.9710 } },
  { id: "eq-013", nome: "Espaço Cultural Tancredo Neves", tipo: "Espaço Independente", municipio: "Caruaru", gestao: "Público", status: "Ativo", location: { lat: -8.2830, lng: -35.9740 } },

  // Olinda
  { id: "eq-014", nome: "Museu do Mamulengo", tipo: "Museu", municipio: "Olinda", gestao: "Público", status: "Ativo", location: { lat: -8.0117, lng: -34.8515 } },
  { id: "eq-015", nome: "Biblioteca Pública de Olinda", tipo: "Biblioteca", municipio: "Olinda", gestao: "Público", status: "Ativo", location: { lat: -8.0135, lng: -34.8530 } },

  // Garanhuns
  { id: "eq-016", nome: "Teatro Municipal de Garanhuns", tipo: "Teatro", municipio: "Garanhuns", capacidade: 350, gestao: "Público", status: "Ativo", location: { lat: -8.8900, lng: -36.4966 } },
  { id: "eq-017", nome: "CEU das Artes Garanhuns", tipo: "CEU", municipio: "Garanhuns", capacidade: 400, gestao: "Público", status: "Ativo", location: { lat: -8.8920, lng: -36.4950 } },

  // Petrolina
  { id: "eq-018", nome: "Museu do Sertão", tipo: "Museu", municipio: "Petrolina", gestao: "Público", status: "Ativo", location: { lat: -9.3891, lng: -40.5028 } },
  { id: "eq-019", nome: "Biblioteca Municipal de Petrolina", tipo: "Biblioteca", municipio: "Petrolina", gestao: "Público", status: "Inativo", location: { lat: -9.3880, lng: -40.5010 } },

  // Arcoverde
  { id: "eq-020", nome: "Espaço Cultural de Arcoverde", tipo: "Espaço Independente", municipio: "Arcoverde", gestao: "Misto", status: "Ativo", location: { lat: -8.4190, lng: -37.0540 } },

  // Jaboatão dos Guararapes
  { id: "eq-021", nome: "Teatro Municipal de Jaboatão", tipo: "Teatro", municipio: "Jaboatão dos Guararapes", capacidade: 280, gestao: "Público", status: "Ativo", location: { lat: -8.1130, lng: -35.0156 } },
  { id: "eq-022", nome: "Biblioteca Pública de Jaboatão", tipo: "Biblioteca", municipio: "Jaboatão dos Guararapes", gestao: "Público", status: "Ativo", location: { lat: -8.1120, lng: -35.0140 } },

  // Serra Talhada
  { id: "eq-023", nome: "Museu do Cangaço", tipo: "Museu", municipio: "Serra Talhada", gestao: "Público", status: "Ativo", location: { lat: -7.9861, lng: -38.2921 } },

  // Gravatá
  { id: "eq-024", nome: "Centro Cultural de Gravatá", tipo: "Espaço Independente", municipio: "Gravatá", gestao: "Misto", status: "Ativo", location: { lat: -8.2005, lng: -35.5649 } },

  // Cabo de Santo Agostinho
  { id: "eq-025", nome: "CEU das Artes Cabo", tipo: "CEU", municipio: "Cabo de Santo Agostinho", capacidade: 350, gestao: "Público", status: "Ativo", location: { lat: -8.2844, lng: -35.0290 } },
];

export const tiposEquipamento = ["Teatro", "Museu", "Biblioteca", "CEU", "Espaço Independente"] as const;

export const iconesTipoEquipamento: Record<string, string> = {
  "Teatro": "🎭",
  "Museu": "🏛️",
  "Biblioteca": "📚",
  "CEU": "🏟️",
  "Espaço Independente": "🎨",
};

export const municipiosAcessoMock: MunicipioAcesso[] = [
  // Acesso bom (< 30min)
  { municipio: "Recife", tempoMedio: 12, equipamentoProximo: "Teatro Santa Isabel", tipoEquipamento: "Teatro", distanciaKm: 3, location: { lat: -8.0576, lng: -34.8770 } },
  { municipio: "Olinda", tempoMedio: 18, equipamentoProximo: "Museu do Mamulengo", tipoEquipamento: "Museu", distanciaKm: 5, location: { lat: -8.0117, lng: -34.8515 } },
  { municipio: "Jaboatão dos Guararapes", tempoMedio: 25, equipamentoProximo: "Teatro Municipal de Jaboatão", tipoEquipamento: "Teatro", distanciaKm: 8, location: { lat: -8.1130, lng: -35.0156 } },
  { municipio: "Cabo de Santo Agostinho", tempoMedio: 28, equipamentoProximo: "CEU das Artes Cabo", tipoEquipamento: "CEU", distanciaKm: 10, location: { lat: -8.2844, lng: -35.0290 } },

  // Acesso moderado (30-60min)
  { municipio: "Camaragibe", tempoMedio: 35, equipamentoProximo: "Biblioteca Popular de Casa Amarela", tipoEquipamento: "Biblioteca", distanciaKm: 15, location: { lat: -8.0235, lng: -34.9790 } },
  { municipio: "Paulista", tempoMedio: 38, equipamentoProximo: "Biblioteca Pública de Olinda", tipoEquipamento: "Biblioteca", distanciaKm: 18, location: { lat: -7.9395, lng: -34.8728 } },
  { municipio: "Igarassu", tempoMedio: 42, equipamentoProximo: "Biblioteca Pública de Olinda", tipoEquipamento: "Biblioteca", distanciaKm: 28, location: { lat: -7.8343, lng: -34.9069 } },
  { municipio: "Caruaru", tempoMedio: 15, equipamentoProximo: "Teatro Rui Limeira Rosal", tipoEquipamento: "Teatro", distanciaKm: 4, location: { lat: -8.2844, lng: -35.9761 } },
  { municipio: "Garanhuns", tempoMedio: 20, equipamentoProximo: "Teatro Municipal de Garanhuns", tipoEquipamento: "Teatro", distanciaKm: 6, location: { lat: -8.8900, lng: -36.4966 } },
  { municipio: "Gravatá", tempoMedio: 45, equipamentoProximo: "Centro Cultural de Gravatá", tipoEquipamento: "Espaço Independente", distanciaKm: 12, location: { lat: -8.2005, lng: -35.5649 } },

  // Acesso ruim (1-2h)
  { municipio: "Vitória de Santo Antão", tempoMedio: 68, equipamentoProximo: "Espaço Cultural Tancredo Neves", tipoEquipamento: "Espaço Independente", distanciaKm: 52, location: { lat: -8.1266, lng: -35.2914 } },
  { municipio: "Carpina", tempoMedio: 72, equipamentoProximo: "Biblioteca Pública de Olinda", tipoEquipamento: "Biblioteca", distanciaKm: 55, location: { lat: -7.8456, lng: -35.2555 } },
  { municipio: "Limoeiro", tempoMedio: 85, equipamentoProximo: "Espaço Cultural Tancredo Neves", tipoEquipamento: "Espaço Independente", distanciaKm: 72, location: { lat: -7.8740, lng: -35.4510 } },
  { municipio: "Serra Talhada", tempoMedio: 90, equipamentoProximo: "Museu do Cangaço", tipoEquipamento: "Museu", distanciaKm: 5, location: { lat: -7.9861, lng: -38.2921 } },

  // Acesso crítico (>2h)
  { municipio: "Inajá", tempoMedio: 168, equipamentoProximo: "Teatro Municipal de Garanhuns", tipoEquipamento: "Teatro", distanciaKm: 185, location: { lat: -8.9022, lng: -37.8310 } },
  { municipio: "Itacuruba", tempoMedio: 192, equipamentoProximo: "Museu do Sertão", tipoEquipamento: "Museu", distanciaKm: 210, location: { lat: -8.7490, lng: -38.6960 } },
  { municipio: "Manari", tempoMedio: 151, equipamentoProximo: "Espaço Cultural de Arcoverde", tipoEquipamento: "Espaço Independente", distanciaKm: 145, location: { lat: -8.9610, lng: -37.6340 } },
  { municipio: "Betânia", tempoMedio: 165, equipamentoProximo: "Espaço Cultural de Arcoverde", tipoEquipamento: "Espaço Independente", distanciaKm: 160, location: { lat: -8.2736, lng: -38.0363 } },
  { municipio: "Calumbi", tempoMedio: 175, equipamentoProximo: "Museu do Cangaço", tipoEquipamento: "Museu", distanciaKm: 78, location: { lat: -7.9373, lng: -38.1466 } },
];

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
