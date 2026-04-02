// Utilitários para agregação de dados de Demografia

export interface DemografiaAgregada {
  totalAgentes: number;
  genero: {
    masculino: number;
    feminino: number;
    nao_binario: number;
    prefiro_nao_declarar: number;
  };
  raca: {
    branco: number;
    preto: number;
    pardo: number;
    asiatico: number;
    indigena: number;
    prefiro_nao_declarar: number;
  };
  faixaEtaria: {
    '18-24': number;
    '25-34': number;
    '35-49': number;
    '50-64': number;
    '65+': number;
  };
  formalização: {
    informal: number;
    mei: number;
    associacao: number;
    epp: number;
  };
  linguagem: Record<string, number>;
}

/**
 * Agrega dados demográficos de uma lista de artistas
 */
export function aggregarDemografia(artistas: any[]): DemografiaAgregada {
  const agregada: DemografiaAgregada = {
    totalAgentes: artistas.length,
    genero: {
      masculino: 0,
      feminino: 0,
      nao_binario: 0,
      prefiro_nao_declarar: 0,
    },
    raca: {
      branco: 0,
      preto: 0,
      pardo: 0,
      asiatico: 0,
      indigena: 0,
      prefiro_nao_declarar: 0,
    },
    faixaEtaria: {
      '18-24': 0,
      '25-34': 0,
      '35-49': 0,
      '50-64': 0,
      '65+': 0,
    },
    formalização: {
      informal: 0,
      mei: 0,
      associacao: 0,
      epp: 0,
    },
    linguagem: {},
  };

  artistas.forEach((artista) => {
    // Gênero (assumindo campo 'genero' no usuário relacionado)
    // Raça (assumindo campo 'raca')
    // Faixa etária (calculado de 'data_nascimento')

    // Formalização
    const formalizacao = (artista.formalizacao || 'Informal').toLowerCase();
    if (formalizacao.includes('mei')) agregada.formalização.mei++;
    else if (formalizacao.includes('associação')) agregada.formalização.associacao++;
    else if (formalizacao.includes('epp')) agregada.formalização.epp++;
    else agregada.formalização.informal++;

    // Linguagem (soma de subtipo_ids)
    if (artista.subtipo_ids && Array.isArray(artista.subtipo_ids)) {
      artista.subtipo_ids.forEach((id: string) => {
        agregada.linguagem[id] = (agregada.linguagem[id] || 0) + 1;
      });
    }
  });

  return agregada;
}

/**
 * Calcula variação entre dois períodos
 */
export function calcularVariacao(valorAtual: number, valorAnterior: number) {
  if (valorAnterior === 0) return { percentual: 0, tendencia: 'stable' as const };
  const percentual = Math.round(((valorAtual - valorAnterior) / valorAnterior) * 100);
  return {
    percentual: Math.abs(percentual),
    tendencia: valorAtual > valorAnterior ? ('up' as const) : valorAtual < valorAnterior ? ('down' as const) : ('stable' as const),
  };
}

/**
 * Formata dados para gráfico Donut (Recharts)
 */
export function formatarParaDonut(dados: Record<string, number>, cores?: string[]) {
  const padrao = ['#3155A4', '#00AD4A', '#FFB511', '#C34342', '#8B5CF6', '#EC4899'];
  const coresFinal = cores || padrao;

  return Object.entries(dados)
    .map(([name, value], index) => ({
      name,
      value,
      fill: coresFinal[index % coresFinal.length],
    }))
    .filter((item) => item.value > 0);
}

/**
 * Formata dados para gráfico de barras horizontal
 */
export function formatarParaBarrasHorizontal(dados: Record<string, number>) {
  return Object.entries(dados)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}
