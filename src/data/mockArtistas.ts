// Mock data: Artistas — tabela intermediária entre Usuario e Produtora
// Um artista é um usuário que pertence a uma ou mais produtoras

export interface Artista {
  id: string;
  usuario_id: string;        // FK → Usuario
  produtora_id: string;      // FK → Produtora
  // Papel na produtora
  papel: string;             // ex: "Percussionista", "Vocalista", "Produtor"
  status: "ativo" | "inativo";
  data_entrada: string;
  data_saida?: string;
  representante_legal: boolean;
  // Dados socioeconômicos (do indivíduo no contexto artístico)
  escolaridade: string;
  area_formacao?: string;
  certificacoes: string[];
  faixa_renda: string;
  situacao_moradia: string;
  servicos_basicos: {
    agua: boolean;
    energia: boolean;
    coleta_lixo: boolean;
    esgoto: boolean;
    internet: boolean;
  };
  vulnerabilidades: string[];
  beneficiario_programa_social: "sim" | "nao" | "prefiro_nao_declarar";
  // Dados artísticos/profissionais — agora referencia IDs de subtipos
  subtipo_ids: string[];     // FK[] → SubtipoLinguagem.id
  tempo_atuacao: number;     // anos
  formalizacao: string;      // MEI, Informal, etc.
  score_reputacao: number;
  objetivos_carreira: string[];
  experiencia_profissional: string[];
  portfolio_url?: string;
  nome_artistico?: string;
}

// Helper to get usuario data for an artista
import { usuariosMock, type Usuario } from "./mockUsuarios";

export function getUsuarioByArtista(artista: Artista): Usuario | undefined {
  return usuariosMock.find((u) => u.id === artista.usuario_id);
}

// ============= ARTISTAS MOCK =============
// Each entry represents one usuario in one produtora
// subtipo_ids reference SubtipoLinguagem IDs from mockLinguagens.ts

export const artistasMock: Artista[] = [
  // --- Produtora p1: Maracatu Raízes ---
  {
    id: "a1", usuario_id: "u1", produtora_id: "p1",
    papel: "Percussionista", status: "ativo", data_entrada: "2013-03-15",
    representante_legal: true,
    escolaridade: "Superior completo", area_formacao: "Licenciatura em Artes Cênicas (UFPE)",
    certificacoes: ["Percussão Afro-brasileira (FUNDARPE 2019)", "Gestão Cultural (ESCULT 2022)"],
    faixa_renda: "R$ 600–1.320", situacao_moradia: "Alugada",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: false, internet: true },
    vulnerabilidades: ["Insegurança alimentar", "2 dependentes sem renda"],
    beneficiario_programa_social: "nao",
    subtipo_ids: ["sl6", "sl2", "sl1"],  // Regional, Dança, Teatro
    tempo_atuacao: 14, formalizacao: "MEI", score_reputacao: 91,
    objetivos_carreira: ["Expandir oficinas de percussão", "Gravar álbum autoral"],
    experiencia_profissional: ["14 anos em percussão afro", "Gestora cultural certificada"],
    nome_artistico: "Ana Raízes",
  },
  {
    id: "a2", usuario_id: "u2", produtora_id: "p1",
    papel: "Dançarino", status: "ativo", data_entrada: "2017-06-01",
    representante_legal: false,
    escolaridade: "Médio completo", certificacoes: ["Dança Contemporânea (SESC 2020)"],
    faixa_renda: "Até R$ 600", situacao_moradia: "Cedida",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: false, internet: false },
    vulnerabilidades: ["Dependente sem renda", "Beneficiário Bolsa Família"],
    beneficiario_programa_social: "sim",
    subtipo_ids: ["sl2", "sl6"],  // Dança, Regional
    tempo_atuacao: 8, formalizacao: "Informal", score_reputacao: 65,
    objetivos_carreira: ["Tornar-se coreógrafo"],
    experiencia_profissional: ["8 anos em dança popular"],
  },
  {
    id: "a3", usuario_id: "u3", produtora_id: "p1",
    papel: "Figurinista", status: "inativo", data_entrada: "2019-02-10", data_saida: "2023-12-01",
    representante_legal: false,
    escolaridade: "Superior incompleto", certificacoes: [],
    faixa_renda: "R$ 1.320–2.640", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl19", "sl21"],  // Artes Plásticas, Design e Moda
    tempo_atuacao: 5, formalizacao: "MEI", score_reputacao: 58,
    objetivos_carreira: ["Abrir ateliê próprio"],
    experiencia_profissional: ["5 anos em figurino para teatro e dança"],
  },

  // --- Produtora p2: Slam da Periferia ---
  {
    id: "a4", usuario_id: "u4", produtora_id: "p2",
    papel: "Poeta", status: "ativo", data_entrada: "2021-06-10",
    representante_legal: true,
    escolaridade: "Médio completo", certificacoes: [],
    faixa_renda: "Até R$ 600", situacao_moradia: "Alugada",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: false, internet: false },
    vulnerabilidades: ["Dependente sem renda", "Beneficiário Bolsa Família"],
    beneficiario_programa_social: "sim",
    subtipo_ids: ["sl13", "sl14"],  // Publicação, Incentivo à Leitura
    tempo_atuacao: 4, formalizacao: "Informal", score_reputacao: 70,
    objetivos_carreira: ["Publicar livro de poesias", "Participar de slams nacionais"],
    experiencia_profissional: ["4 anos em poesia falada"],
    nome_artistico: "Lucas Slam",
  },
  {
    id: "a5", usuario_id: "u5", produtora_id: "p2",
    papel: "Slammer", status: "ativo", data_entrada: "2022-01-15",
    representante_legal: false,
    escolaridade: "Superior incompleto", certificacoes: [],
    faixa_renda: "Sem renda", situacao_moradia: "Cedida",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: false, esgoto: false, internet: true },
    vulnerabilidades: ["Insegurança alimentar"],
    beneficiario_programa_social: "sim",
    subtipo_ids: ["sl13", "sl1"],  // Publicação, Teatro
    tempo_atuacao: 3, formalizacao: "Informal", score_reputacao: 62,
    objetivos_carreira: ["Fazer teatro profissional"],
    experiencia_profissional: ["3 anos em slam poetry"],
  },
  {
    id: "a6", usuario_id: "u6", produtora_id: "p2",
    papel: "Produtor", status: "ativo", data_entrada: "2021-06-10",
    representante_legal: false,
    escolaridade: "Médio completo", certificacoes: ["Produção Cultural (SESC 2022)"],
    faixa_renda: "R$ 600–1.320", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: false, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl14", "sl5"],  // Incentivo à Leitura, Popular (Música)
    tempo_atuacao: 6, formalizacao: "MEI", score_reputacao: 74,
    objetivos_carreira: ["Produzir festivais literários"],
    experiencia_profissional: ["6 anos em produção cultural"],
  },
  {
    id: "a7", usuario_id: "u7", produtora_id: "p2",
    papel: "Poeta", status: "ativo", data_entrada: "2022-03-01",
    representante_legal: false,
    escolaridade: "Fundamental", certificacoes: [],
    faixa_renda: "Até R$ 600", situacao_moradia: "Alugada",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: false, esgoto: false, internet: false },
    vulnerabilidades: ["Dependente sem renda", "Insegurança alimentar"],
    beneficiario_programa_social: "sim",
    subtipo_ids: ["sl13", "sl17"],  // Publicação, Mestres de Saberes
    tempo_atuacao: 5, formalizacao: "Informal", score_reputacao: 55,
    objetivos_carreira: ["Participar de antologias"],
    experiencia_profissional: ["5 anos em poesia e cultura popular"],
  },

  // --- Produtora p3: Cia. Movimento Livre ---
  {
    id: "a8", usuario_id: "u8", produtora_id: "p3",
    papel: "Coreógrafa", status: "ativo", data_entrada: "2017-01-20",
    representante_legal: true,
    escolaridade: "Superior completo", area_formacao: "Licenciatura em Dança (UFPE)",
    certificacoes: ["Dança Contemporânea (FGV 2020)"],
    faixa_renda: "R$ 1.320–2.640", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl2", "sl1"],  // Dança, Teatro
    tempo_atuacao: 12, formalizacao: "MEI", score_reputacao: 88,
    objetivos_carreira: ["Internacionalizar a companhia", "Criar escola de dança"],
    experiencia_profissional: ["12 anos em dança contemporânea", "Direção artística"],
    nome_artistico: "Fernanda Movimento",
  },
  {
    id: "a9", usuario_id: "u9", produtora_id: "p3",
    papel: "Bailarino", status: "ativo", data_entrada: "2018-05-10",
    representante_legal: false,
    escolaridade: "Superior incompleto", certificacoes: [],
    faixa_renda: "R$ 600–1.320", situacao_moradia: "Alugada",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: ["Dependente sem renda"], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl2", "sl5"],  // Dança, Popular (Música)
    tempo_atuacao: 7, formalizacao: "Informal", score_reputacao: 72,
    objetivos_carreira: ["Ser bailarino profissional em companhia nacional"],
    experiencia_profissional: ["7 anos em dança"],
  },
  {
    id: "a10", usuario_id: "u10", produtora_id: "p3",
    papel: "Bailarina", status: "ativo", data_entrada: "2021-03-15",
    representante_legal: false,
    escolaridade: "Superior incompleto", certificacoes: ["Dança Afro (SESC 2023)"],
    faixa_renda: "Até R$ 600", situacao_moradia: "Cedida",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: false, internet: true },
    vulnerabilidades: ["Insegurança alimentar"], beneficiario_programa_social: "sim",
    subtipo_ids: ["sl2"],  // Dança
    tempo_atuacao: 4, formalizacao: "Informal", score_reputacao: 65,
    objetivos_carreira: ["Criar grupo de dança afro"],
    experiencia_profissional: ["4 anos em dança afro-brasileira"],
  },
  {
    id: "a11", usuario_id: "u11", produtora_id: "p3",
    papel: "Iluminador", status: "ativo", data_entrada: "2017-01-20",
    representante_legal: false,
    escolaridade: "Pós-graduação", area_formacao: "Artes Cênicas",
    certificacoes: ["Iluminação Cênica (SP Escola de Teatro 2018)"],
    faixa_renda: "R$ 1.320–2.640", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl2", "sl1", "sl19"],  // Dança, Teatro, Artes Plásticas
    tempo_atuacao: 15, formalizacao: "MEI", score_reputacao: 82,
    objetivos_carreira: ["Ser referência em iluminação cênica no NE"],
    experiencia_profissional: ["15 anos em iluminação cênica e técnica"],
  },

  // --- Produtora p4: Coletivo Canoa ---
  {
    id: "a12", usuario_id: "u12", produtora_id: "p4",
    papel: "Diretor", status: "ativo", data_entrada: "2023-04-01",
    representante_legal: true,
    escolaridade: "Médio completo", certificacoes: [],
    faixa_renda: "Até R$ 600", situacao_moradia: "Alugada",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: false, esgoto: false, internet: false },
    vulnerabilidades: ["Insegurança alimentar", "Dependente sem renda"],
    beneficiario_programa_social: "sim",
    subtipo_ids: ["sl7", "sl5"],  // Cinema, Popular (Música)
    tempo_atuacao: 5, formalizacao: "Informal", score_reputacao: 50,
    objetivos_carreira: ["Produzir documentários profissionais"],
    experiencia_profissional: ["5 anos em produção audiovisual independente"],
  },
  {
    id: "a13", usuario_id: "u13", produtora_id: "p4",
    papel: "Câmera", status: "inativo", data_entrada: "2023-04-01", data_saida: "2024-06-01",
    representante_legal: false,
    escolaridade: "Superior incompleto", certificacoes: [],
    faixa_renda: "Sem renda", situacao_moradia: "Cedida",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: false, internet: true },
    vulnerabilidades: ["Condição de rua (passada)"],
    beneficiario_programa_social: "nao",
    subtipo_ids: ["sl7", "sl20"],  // Cinema, Fotografia
    tempo_atuacao: 2, formalizacao: "Informal", score_reputacao: 40,
    objetivos_carreira: ["Ser diretora de fotografia"],
    experiencia_profissional: ["2 anos em câmera e fotografia"],
  },
  {
    id: "a14", usuario_id: "u14", produtora_id: "p4",
    papel: "Editor", status: "ativo", data_entrada: "2023-04-01",
    representante_legal: false,
    escolaridade: "Médio completo", certificacoes: [],
    faixa_renda: "R$ 600–1.320", situacao_moradia: "Própria",
    servicos_basicos: { agua: false, energia: true, coleta_lixo: false, esgoto: false, internet: false },
    vulnerabilidades: ["Dependente sem renda"],
    beneficiario_programa_social: "nao",
    subtipo_ids: ["sl7", "sl8"],  // Cinema, Difusão
    tempo_atuacao: 8, formalizacao: "Informal", score_reputacao: 48,
    objetivos_carreira: ["Editar para plataformas de streaming"],
    experiencia_profissional: ["8 anos em edição de vídeo"],
  },

  // --- Produtora p5: Grupo Rabeca Viva ---
  {
    id: "a15", usuario_id: "u15", produtora_id: "p5",
    papel: "Rabequeiro", status: "ativo", data_entrada: "2019-08-12",
    representante_legal: true,
    escolaridade: "Superior completo", area_formacao: "Licenciatura em Música (UFPE)",
    certificacoes: ["Luteria (FUNDARPE 2016)"],
    faixa_renda: "R$ 1.320–2.640", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl6", "sl17"],  // Regional, Mestres de Saberes
    tempo_atuacao: 25, formalizacao: "MEI", score_reputacao: 92,
    objetivos_carreira: ["Preservar a tradição da rabeca", "Formar novos rabequeiros"],
    experiencia_profissional: ["25 anos em música tradicional", "Professor de rabeca"],
    nome_artistico: "Mestre Roberto",
  },
  {
    id: "a16", usuario_id: "u16", produtora_id: "p5",
    papel: "Vocalista", status: "ativo", data_entrada: "2019-08-12",
    representante_legal: false,
    escolaridade: "Pós-graduação", area_formacao: "Etnomusicologia",
    certificacoes: ["Canto Popular (UFPE 2015)"],
    faixa_renda: "Acima R$ 2.640", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl5", "sl6"],  // Popular, Regional
    tempo_atuacao: 18, formalizacao: "MEI", score_reputacao: 85,
    objetivos_carreira: ["Gravar álbum de música tradicional"],
    experiencia_profissional: ["18 anos em canto popular e etnomusicologia"],
    nome_artistico: "Sandra Moreira",
  },
  {
    id: "a17", usuario_id: "u17", produtora_id: "p5",
    papel: "Percussionista", status: "ativo", data_entrada: "2020-02-15",
    representante_legal: false,
    escolaridade: "Superior completo", certificacoes: [],
    faixa_renda: "R$ 600–1.320", situacao_moradia: "Alugada",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: ["Dependente sem renda"], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl6", "sl5"],  // Regional, Popular
    tempo_atuacao: 8, formalizacao: "Informal", score_reputacao: 70,
    objetivos_carreira: ["Tocar em festivais internacionais"],
    experiencia_profissional: ["8 anos em percussão"],
  },
  {
    id: "a18", usuario_id: "u18", produtora_id: "p5",
    papel: "Flautista", status: "ativo", data_entrada: "2019-08-12",
    representante_legal: false,
    escolaridade: "Pós-graduação", area_formacao: "Musicologia",
    certificacoes: ["Flauta Barroca (UNESP 2017)"],
    faixa_renda: "Acima R$ 2.640", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl4"],  // Erudita
    tempo_atuacao: 14, formalizacao: "MEI", score_reputacao: 80,
    objetivos_carreira: ["Pesquisar música barroca brasileira"],
    experiencia_profissional: ["14 anos em flauta e musicologia"],
  },

  // --- Cross-references: artista u1 also in p5 (M:N) ---
  {
    id: "a19", usuario_id: "u1", produtora_id: "p5",
    papel: "Percussionista convidada", status: "ativo", data_entrada: "2022-06-01",
    representante_legal: false,
    escolaridade: "Superior completo", area_formacao: "Licenciatura em Artes Cênicas (UFPE)",
    certificacoes: ["Percussão Afro-brasileira (FUNDARPE 2019)"],
    faixa_renda: "R$ 600–1.320", situacao_moradia: "Alugada",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: false, internet: true },
    vulnerabilidades: ["Insegurança alimentar", "2 dependentes sem renda"],
    beneficiario_programa_social: "nao",
    subtipo_ids: ["sl6", "sl2", "sl1"],  // Regional, Dança, Teatro
    tempo_atuacao: 14, formalizacao: "MEI", score_reputacao: 91,
    objetivos_carreira: ["Expandir oficinas de percussão"],
    experiencia_profissional: ["14 anos em percussão afro"],
    nome_artistico: "Ana Raízes",
  },

  // --- Cross-reference: u11 also in p1 (M:N) ---
  {
    id: "a20", usuario_id: "u11", produtora_id: "p1",
    papel: "Iluminador", status: "ativo", data_entrada: "2020-03-01",
    representante_legal: false,
    escolaridade: "Pós-graduação", area_formacao: "Artes Cênicas",
    certificacoes: ["Iluminação Cênica (SP Escola de Teatro 2018)"],
    faixa_renda: "R$ 1.320–2.640", situacao_moradia: "Própria",
    servicos_basicos: { agua: true, energia: true, coleta_lixo: true, esgoto: true, internet: true },
    vulnerabilidades: [], beneficiario_programa_social: "nao",
    subtipo_ids: ["sl2", "sl1", "sl19"],  // Dança, Teatro, Artes Plásticas
    tempo_atuacao: 15, formalizacao: "MEI", score_reputacao: 82,
    objetivos_carreira: ["Ser referência em iluminação cênica no NE"],
    experiencia_profissional: ["15 anos em iluminação cênica"],
  },
];

// Helper: get unique artistas by usuario_id (deduplicate M:N)
export function getArtistasUnicos(): Artista[] {
  const seen = new Set<string>();
  return artistasMock.filter((a) => {
    if (seen.has(a.usuario_id)) return false;
    seen.add(a.usuario_id);
    return true;
  });
}

// Helper: get artistas for a specific produtora
export function getArtistasByProdutora(produtoraId: string): Artista[] {
  return artistasMock.filter((a) => a.produtora_id === produtoraId);
}

// Helper: get produtora IDs for a specific usuario
export function getProdutoraIdsByUsuario(usuarioId: string): string[] {
  return [...new Set(artistasMock.filter((a) => a.usuario_id === usuarioId).map((a) => a.produtora_id))];
}
