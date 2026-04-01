// Mock data: Projetos georreferenciados e Desertos Culturais para o mapa
// Reutiliza projetosMock e adiciona coordenadas derivadas dos municípios

import { projetosMock, type ProjetoCultural } from "./mockProjetos";

// ===== PROJETOS NO MAPA =====
export interface ProjetoMapa {
  id: string;
  nome: string;
  proponenteNome: string;
  instrumento: string;
  status: "ativo" | "concluido" | "pendencia" | "irregular" | "cancelado";
  publicoImpactado: number;
  municipio: string;
  location: { lat: number; lng: number };
}

// Coordenadas por município para georreferenciar projetos
const coordenadasMunicipios: Record<string, { lat: number; lng: number }> = {
  "Recife": { lat: -8.0576, lng: -34.8770 },
  "Olinda": { lat: -8.0117, lng: -34.8515 },
  "Caruaru": { lat: -8.2844, lng: -35.9761 },
  "Petrolina": { lat: -9.3891, lng: -40.5028 },
  "Garanhuns": { lat: -8.8900, lng: -36.4966 },
  "Serra Talhada": { lat: -7.9861, lng: -38.2921 },
  "Arcoverde": { lat: -8.4190, lng: -37.0540 },
  "Jaboatão dos Guararapes": { lat: -8.1130, lng: -35.0156 },
  "Gravatá": { lat: -8.2005, lng: -35.5649 },
  "Cabo de Santo Agostinho": { lat: -8.2844, lng: -35.0290 },
};

// Gerar variação de coordenada para não sobrepor marcadores
function jitter(val: number, range = 0.015): number {
  return val + (Math.random() - 0.5) * range;
}

export const projetosMapaMock: ProjetoMapa[] = projetosMock.map((p) => {
  const coords = coordenadasMunicipios[p.municipio] || { lat: -8.05, lng: -34.87 };
  return {
    id: p.id,
    nome: p.nome,
    proponenteNome: p.proponenteNome,
    instrumento: p.instrumento,
    status: p.status,
    publicoImpactado: p.publicoImpactado,
    municipio: p.municipio,
    location: { lat: jitter(coords.lat), lng: jitter(coords.lng) },
  };
});

// ===== DESERTOS CULTURAIS =====
export interface DesertoCultural {
  id: string;
  regiao: string;
  populacao: number;
  agentes: number;
  prioridade: "Alta" | "Média" | "Baixa";
  cobertura100k: number; // agentes por 100k habitantes
  location: { lat: number; lng: number };
  raioKm: number;
}

export const desertosCulturaisMock: DesertoCultural[] = [
  {
    id: "dc-001",
    regiao: "Sertão do Pajeú",
    populacao: 180000,
    agentes: 8,
    prioridade: "Alta",
    cobertura100k: 4.4,
    location: { lat: -7.93, lng: -38.30 },
    raioKm: 45,
  },
  {
    id: "dc-002",
    regiao: "Sertão do Moxotó",
    populacao: 120000,
    agentes: 5,
    prioridade: "Alta",
    cobertura100k: 4.2,
    location: { lat: -8.42, lng: -37.65 },
    raioKm: 40,
  },
  {
    id: "dc-003",
    regiao: "Baixo São Francisco",
    populacao: 95000,
    agentes: 3,
    prioridade: "Alta",
    cobertura100k: 3.2,
    location: { lat: -8.75, lng: -38.70 },
    raioKm: 35,
  },
  {
    id: "dc-004",
    regiao: "Sertão do Araripe",
    populacao: 200000,
    agentes: 12,
    prioridade: "Média",
    cobertura100k: 6.0,
    location: { lat: -7.60, lng: -40.10 },
    raioKm: 50,
  },
  {
    id: "dc-005",
    regiao: "Mata Sul",
    populacao: 160000,
    agentes: 18,
    prioridade: "Baixa",
    cobertura100k: 11.2,
    location: { lat: -8.68, lng: -35.58 },
    raioKm: 30,
  },
];

// Status labels e cores para projetos no mapa
export const statusProjetoCores: Record<string, string> = {
  ativo: "#00AD4A",
  concluido: "#3b82f6",
  pendencia: "#f59e0b",
  irregular: "#ef4444",
  cancelado: "#6b7280",
};

export const statusProjetoLabels: Record<string, string> = {
  ativo: "Ativo",
  concluido: "Concluído",
  pendencia: "Com pendência",
  irregular: "Irregular",
  cancelado: "Cancelado",
};

export const prioridadeDesertoCores: Record<string, string> = {
  Alta: "#C34342",
  Média: "#f59e0b",
  Baixa: "#6b7280",
};
