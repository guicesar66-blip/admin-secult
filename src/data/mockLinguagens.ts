// Mock data: Linguagens Culturais — tipos e subtipos com IDs únicos
// Baseado na estrutura oficial de fomento cultural de Pernambuco

export interface SubtipoLinguagem {
  id: string;
  tipo_id: string;          // FK → TipoLinguagem
  nome: string;
  descricao: string;
}

export interface TipoLinguagem {
  id: string;
  nome: string;
  descricao: string;
  subtipos: SubtipoLinguagem[];
}

// ============= TIPOS E SUBTIPOS =============

export const tiposLinguagem: TipoLinguagem[] = [
  {
    id: "tl1",
    nome: "Artes Cênicas",
    descricao: "Manifestações artísticas fundamentadas na performance física e representação.",
    subtipos: [
      { id: "sl1", tipo_id: "tl1", nome: "Teatro", descricao: "Peças dramáticas, comédias e performances" },
      { id: "sl2", tipo_id: "tl1", nome: "Dança", descricao: "Balé, dança contemporânea e urbana" },
      { id: "sl3", tipo_id: "tl1", nome: "Circo", descricao: "Malabarismo, acrobacias e arte de picadeiro" },
    ],
  },
  {
    id: "tl2",
    nome: "Música",
    descricao: "Expressões sonoras em diversos gêneros, abrangendo criação e difusão.",
    subtipos: [
      { id: "sl4", tipo_id: "tl2", nome: "Erudita", descricao: "Música sinfônica e de câmara" },
      { id: "sl5", tipo_id: "tl2", nome: "Popular", descricao: "Gêneros contemporâneos e de massa" },
      { id: "sl6", tipo_id: "tl2", nome: "Regional", descricao: "Ritmos típicos como Frevo e Maracatu" },
    ],
  },
  {
    id: "tl3",
    nome: "Audiovisual",
    descricao: "Produção de imagens em movimento e som para diversas telas.",
    subtipos: [
      { id: "sl7", tipo_id: "tl3", nome: "Cinema", descricao: "Longas e curtas-metragens" },
      { id: "sl8", tipo_id: "tl3", nome: "Difusão", descricao: "Cineclubes e festivais de cinema" },
      { id: "sl9", tipo_id: "tl3", nome: "Formação", descricao: "Oficinas de roteiro e técnica" },
    ],
  },
  {
    id: "tl4",
    nome: "Patrimônio",
    descricao: "Proteção e difusão de bens materiais e imateriais do estado.",
    subtipos: [
      { id: "sl10", tipo_id: "tl4", nome: "Material", descricao: "Restauração de monumentos e acervos" },
      { id: "sl11", tipo_id: "tl4", nome: "Imaterial", descricao: "Salvaguarda de saberes e celebrações" },
      { id: "sl12", tipo_id: "tl4", nome: "Museus", descricao: "Gestão e conservação de museus" },
    ],
  },
  {
    id: "tl5",
    nome: "Literatura",
    descricao: "Incentivo à escrita, leitura e mercado editorial.",
    subtipos: [
      { id: "sl13", tipo_id: "tl5", nome: "Publicação", descricao: "Edição de livros e coletâneas" },
      { id: "sl14", tipo_id: "tl5", nome: "Incentivo à Leitura", descricao: "Feiras literárias e bibliotecas" },
      { id: "sl15", tipo_id: "tl5", nome: "HQ", descricao: "Quadrinhos e novelas gráficas" },
    ],
  },
  {
    id: "tl6",
    nome: "Cultura Popular",
    descricao: "Manifestações tradicionais ligadas à identidade pernambucana.",
    subtipos: [
      { id: "sl16", tipo_id: "tl6", nome: "Artesanato", descricao: "Produção manual com identidade cultural" },
      { id: "sl17", tipo_id: "tl6", nome: "Mestres de Saberes", descricao: "Transmissão oral de tradições" },
      { id: "sl18", tipo_id: "tl6", nome: "Brinquedos Populares", descricao: "Grupos de Cavalo Marinho, Urso, etc." },
    ],
  },
  {
    id: "tl7",
    nome: "Artes Visuais",
    descricao: "Criação plástica, design e fotografia.",
    subtipos: [
      { id: "sl19", tipo_id: "tl7", nome: "Artes Plásticas", descricao: "Pintura, escultura e gravura" },
      { id: "sl20", tipo_id: "tl7", nome: "Fotografia", descricao: "Exposições e catálogos fotográficos" },
      { id: "sl21", tipo_id: "tl7", nome: "Design e Moda", descricao: "Criação visual e vestuário autoral" },
    ],
  },
  {
    id: "tl8",
    nome: "Gastronomia",
    descricao: "Reconhecimento da culinária como patrimônio e identidade.",
    subtipos: [
      { id: "sl22", tipo_id: "tl8", nome: "Culinária Tradicional", descricao: "Resgate de receitas ancestrais" },
      { id: "sl23", tipo_id: "tl8", nome: "Insumos Locais", descricao: "Valorização de produtos da terra" },
    ],
  },
];

// ============= FLAT HELPERS =============

/** All subtipos as a flat array */
export const todosSubtipos: SubtipoLinguagem[] = tiposLinguagem.flatMap((t) => t.subtipos);

/** Map subtipo_id → SubtipoLinguagem */
export const subtipoMap = new Map<string, SubtipoLinguagem>(
  todosSubtipos.map((s) => [s.id, s])
);

/** Map subtipo_id → TipoLinguagem */
export const subtipoToTipoMap = new Map<string, TipoLinguagem>(
  tiposLinguagem.flatMap((t) => t.subtipos.map((s) => [s.id, t] as [string, TipoLinguagem]))
);

/** Map tipo_id → TipoLinguagem */
export const tipoMap = new Map<string, TipoLinguagem>(
  tiposLinguagem.map((t) => [t.id, t])
);

/** Get tipo nome from subtipo_id */
export function getTipoBySubtipoId(subtipoId: string): TipoLinguagem | undefined {
  return subtipoToTipoMap.get(subtipoId);
}

/** Get subtipo nome from id */
export function getSubtipoNome(subtipoId: string): string {
  return subtipoMap.get(subtipoId)?.nome ?? "Desconhecido";
}

/** Get tipo nome from subtipo id */
export function getTipoNome(subtipoId: string): string {
  return subtipoToTipoMap.get(subtipoId)?.nome ?? "Desconhecido";
}

/** Get all subtipo_ids for a given tipo nome */
export function getSubtipoIdsByTipoNome(tipoNome: string): string[] {
  const tipo = tiposLinguagem.find((t) => t.nome === tipoNome);
  return tipo ? tipo.subtipos.map((s) => s.id) : [];
}
