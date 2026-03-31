// Mock data for the Censo Cultural Vivo dashboard

export interface Artista {
  id: string;
  nome: string;
  nomeArtistico?: string;
  location: { lat: number; lng: number };
  categoria: string; // linguagem artística
  subcategoria?: string;
  bairro: string;
  municipio: string;
  genero: "Masculino" | "Feminino" | "Não-binário" | "Prefiro não informar";
  raca: "Preta" | "Parda" | "Branca" | "Indígena" | "Amarela" | "Não informado";
  statusFiscal: "Regular" | "Irregular" | "Pendente" | "Isento";
  tempoAtuacao: string;
  formalizacao: string;
  telefone?: string;
  email?: string;
  redesSociais?: { instagram?: string; facebook?: string; youtube?: string };
  projetosAprovados: number;
  scoreImpacto: number;
  statusAuditoria: "Concluído" | "Em andamento" | "Pendente" | "Atrasado";
  bio?: string;
  avatar?: string;
}

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
}

export interface InsightIA {
  id: string;
  tipo: "deserto_cultural" | "sugestao_edital" | "alerta";
  titulo: string;
  descricao: string;
  regiao: string;
  impacto: number;
  prioridade: "alta" | "media" | "baixa";
}

// ===== ARTISTAS MOCK =====
export const artistasMock: Artista[] = [
  // Boa Viagem
  { id: "001", nome: "Mestre Salustiano Jr", nomeArtistico: "Sal do Maracatu", location: { lat: -8.1190, lng: -34.9010 }, categoria: "Música", subcategoria: "Maracatu", bairro: "Boa Viagem", municipio: "Recife", genero: "Masculino", raca: "Preta", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "MEI", projetosAprovados: 5, scoreImpacto: 92, statusAuditoria: "Concluído", bio: "Mestre de Maracatu com 30 anos de tradição cultural.", redesSociais: { instagram: "@saldomaracatu" }, telefone: "(81) 99999-0001" },
  { id: "002", nome: "Ana Beatriz Silva", nomeArtistico: "Bia Dança", location: { lat: -8.1215, lng: -34.9055 }, categoria: "Dança", subcategoria: "Contemporânea", bairro: "Boa Viagem", municipio: "Recife", genero: "Feminino", raca: "Parda", statusFiscal: "Regular", tempoAtuacao: "5 a 10 anos", formalizacao: "CNPJ", projetosAprovados: 3, scoreImpacto: 78, statusAuditoria: "Em andamento", bio: "Bailarina e coreógrafa de dança contemporânea." },
  { id: "003", nome: "Carlos Eduardo Mendes", location: { lat: -8.1170, lng: -34.8980 }, categoria: "Artesanato", subcategoria: "Cerâmica", bairro: "Boa Viagem", municipio: "Recife", genero: "Masculino", raca: "Branca", statusFiscal: "Pendente", tempoAtuacao: "1 a 3 anos", formalizacao: "Informal", projetosAprovados: 0, scoreImpacto: 35, statusAuditoria: "Pendente" },

  // Casa Forte
  { id: "004", nome: "Maria do Carmo Santos", nomeArtistico: "Carminha Frevo", location: { lat: -8.0310, lng: -34.9200 }, categoria: "Dança", subcategoria: "Frevo", bairro: "Casa Forte", municipio: "Recife", genero: "Feminino", raca: "Preta", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "MEI", projetosAprovados: 8, scoreImpacto: 95, statusAuditoria: "Concluído", bio: "Passista de Frevo reconhecida como Patrimônio Vivo.", redesSociais: { instagram: "@carminhafrevo", youtube: "CaminhaFrevoOficial" } },
  { id: "005", nome: "José Henrique Lins", location: { lat: -8.0335, lng: -34.9175 }, categoria: "Teatro", subcategoria: "Popular", bairro: "Casa Forte", municipio: "Recife", genero: "Masculino", raca: "Parda", statusFiscal: "Irregular", tempoAtuacao: "5 a 10 anos", formalizacao: "Informal", projetosAprovados: 2, scoreImpacto: 60, statusAuditoria: "Atrasado" },

  // Recife Antigo
  { id: "006", nome: "Patrícia Moura", nomeArtistico: "Pat Arte Visual", location: { lat: -8.0630, lng: -34.8710 }, categoria: "Artes Visuais", subcategoria: "Grafite", bairro: "Recife Antigo", municipio: "Recife", genero: "Feminino", raca: "Parda", statusFiscal: "Regular", tempoAtuacao: "3 a 5 anos", formalizacao: "MEI", projetosAprovados: 4, scoreImpacto: 82, statusAuditoria: "Concluído", bio: "Grafiteira e muralista urbana." },
  { id: "007", nome: "Ricardo Alves", location: { lat: -8.0645, lng: -34.8730 }, categoria: "Música", subcategoria: "MPB", bairro: "Recife Antigo", municipio: "Recife", genero: "Masculino", raca: "Branca", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "CNPJ", projetosAprovados: 6, scoreImpacto: 88, statusAuditoria: "Em andamento" },
  { id: "008", nome: "Fernanda Costa Lima", location: { lat: -8.0620, lng: -34.8695 }, categoria: "Literatura", subcategoria: "Cordel", bairro: "Recife Antigo", municipio: "Recife", genero: "Feminino", raca: "Preta", statusFiscal: "Isento", tempoAtuacao: "1 a 3 anos", formalizacao: "Informal", projetosAprovados: 1, scoreImpacto: 45, statusAuditoria: "Pendente" },

  // Ibura
  { id: "009", nome: "Wellington Santos", nomeArtistico: "MC Well", location: { lat: -8.1130, lng: -34.9430 }, categoria: "Música", subcategoria: "Rap/Hip-Hop", bairro: "Ibura", municipio: "Recife", genero: "Masculino", raca: "Preta", statusFiscal: "Pendente", tempoAtuacao: "3 a 5 anos", formalizacao: "Informal", projetosAprovados: 1, scoreImpacto: 55, statusAuditoria: "Pendente" },
  { id: "010", nome: "Luciana Ferreira", location: { lat: -8.1155, lng: -34.9405 }, categoria: "Dança", subcategoria: "Afro", bairro: "Ibura", municipio: "Recife", genero: "Feminino", raca: "Preta", statusFiscal: "Regular", tempoAtuacao: "5 a 10 anos", formalizacao: "MEI", projetosAprovados: 3, scoreImpacto: 70, statusAuditoria: "Concluído" },

  // Várzea
  { id: "011", nome: "Pedro Augusto Melo", nomeArtistico: "Pê Tambor", location: { lat: -8.0420, lng: -34.9560 }, categoria: "Música", subcategoria: "Percussão", bairro: "Várzea", municipio: "Recife", genero: "Masculino", raca: "Parda", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "MEI", projetosAprovados: 4, scoreImpacto: 80, statusAuditoria: "Concluído" },
  { id: "012", nome: "Adriana Souza", location: { lat: -8.0445, lng: -34.9535 }, categoria: "Artesanato", subcategoria: "Bordado", bairro: "Várzea", municipio: "Recife", genero: "Feminino", raca: "Indígena", statusFiscal: "Isento", tempoAtuacao: "Mais de 10 anos", formalizacao: "Informal", projetosAprovados: 2, scoreImpacto: 65, statusAuditoria: "Em andamento" },

  // Santo Amaro
  { id: "013", nome: "Marcos Vinícius Barros", location: { lat: -8.0530, lng: -34.8830 }, categoria: "Teatro", subcategoria: "Mamulengos", bairro: "Santo Amaro", municipio: "Recife", genero: "Masculino", raca: "Preta", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "MEI", projetosAprovados: 7, scoreImpacto: 90, statusAuditoria: "Concluído", bio: "Mestre mamulengueiro, preserva tradições do teatro de bonecos." },

  // Torre
  { id: "014", nome: "Juliana Monteiro", nomeArtistico: "Ju Circo", location: { lat: -8.0580, lng: -34.9060 }, categoria: "Circo", subcategoria: "Acrobacia", bairro: "Torre", municipio: "Recife", genero: "Feminino", raca: "Branca", statusFiscal: "Regular", tempoAtuacao: "5 a 10 anos", formalizacao: "CNPJ", projetosAprovados: 3, scoreImpacto: 75, statusAuditoria: "Em andamento" },

  // Pina
  { id: "015", nome: "Roberto Nascimento", location: { lat: -8.0960, lng: -34.8770 }, categoria: "Música", subcategoria: "Manguebeat", bairro: "Pina", municipio: "Recife", genero: "Masculino", raca: "Parda", statusFiscal: "Regular", tempoAtuacao: "5 a 10 anos", formalizacao: "MEI", projetosAprovados: 4, scoreImpacto: 83, statusAuditoria: "Concluído" },
  { id: "016", nome: "Tatiane Oliveira", location: { lat: -8.0945, lng: -34.8785 }, categoria: "Dança", subcategoria: "Coco", bairro: "Pina", municipio: "Recife", genero: "Feminino", raca: "Preta", statusFiscal: "Pendente", tempoAtuacao: "3 a 5 anos", formalizacao: "Informal", projetosAprovados: 1, scoreImpacto: 48, statusAuditoria: "Pendente" },

  // Madalena
  { id: "017", nome: "André Luiz Pereira", location: { lat: -8.0555, lng: -34.9130 }, categoria: "Audiovisual", subcategoria: "Documentário", bairro: "Madalena", municipio: "Recife", genero: "Masculino", raca: "Branca", statusFiscal: "Regular", tempoAtuacao: "5 a 10 anos", formalizacao: "CNPJ", projetosAprovados: 5, scoreImpacto: 85, statusAuditoria: "Concluído" },

  // Encruzilhada
  { id: "018", nome: "Sandra Regina", nomeArtistico: "Sandra Coco", location: { lat: -8.0340, lng: -34.8890 }, categoria: "Música", subcategoria: "Coco de Roda", bairro: "Encruzilhada", municipio: "Recife", genero: "Feminino", raca: "Preta", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "MEI", projetosAprovados: 6, scoreImpacto: 88, statusAuditoria: "Concluído", bio: "Mestra de Coco de Roda, preservando a tradição afrodescendente." },

  // Imbiribeira
  { id: "019", nome: "Gabriel Mendonça", location: { lat: -8.1070, lng: -34.9170 }, categoria: "Artesanato", subcategoria: "Xilogravura", bairro: "Imbiribeira", municipio: "Recife", genero: "Masculino", raca: "Parda", statusFiscal: "Isento", tempoAtuacao: "1 a 3 anos", formalizacao: "Informal", projetosAprovados: 0, scoreImpacto: 30, statusAuditoria: "Pendente" },

  // Cohab
  { id: "020", nome: "Renata Barbosa", location: { lat: -8.0780, lng: -34.9310 }, categoria: "Dança", subcategoria: "Passinho", bairro: "Cohab", municipio: "Recife", genero: "Feminino", raca: "Preta", statusFiscal: "Pendente", tempoAtuacao: "1 a 3 anos", formalizacao: "Informal", projetosAprovados: 0, scoreImpacto: 40, statusAuditoria: "Pendente" },

  // Caxangá
  { id: "021", nome: "Leonardo Amaral", location: { lat: -8.0370, lng: -34.9460 }, categoria: "Artes Visuais", subcategoria: "Pintura", bairro: "Caxangá", municipio: "Recife", genero: "Masculino", raca: "Branca", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "CNPJ", projetosAprovados: 9, scoreImpacto: 93, statusAuditoria: "Concluído" },

  // Espinheiro
  { id: "022", nome: "Camila Torres", nomeArtistico: "Cami Letra", location: { lat: -8.0390, lng: -34.8950 }, categoria: "Literatura", subcategoria: "Poesia Falada", bairro: "Espinheiro", municipio: "Recife", genero: "Feminino", raca: "Parda", statusFiscal: "Regular", tempoAtuacao: "3 a 5 anos", formalizacao: "MEI", projetosAprovados: 2, scoreImpacto: 62, statusAuditoria: "Em andamento" },

  // Afogados
  { id: "023", nome: "Edson Rodrigues", location: { lat: -8.0750, lng: -34.9110 }, categoria: "Música", subcategoria: "Forró", bairro: "Afogados", municipio: "Recife", genero: "Masculino", raca: "Parda", statusFiscal: "Irregular", tempoAtuacao: "5 a 10 anos", formalizacao: "Informal", projetosAprovados: 1, scoreImpacto: 50, statusAuditoria: "Atrasado" },

  // Jordão
  { id: "024", nome: "Daniela Freitas", location: { lat: -8.1200, lng: -34.9340 }, categoria: "Teatro", subcategoria: "Comunitário", bairro: "Jordão", municipio: "Recife", genero: "Feminino", raca: "Preta", statusFiscal: "Isento", tempoAtuacao: "3 a 5 anos", formalizacao: "Informal", projetosAprovados: 1, scoreImpacto: 55, statusAuditoria: "Em andamento" },

  // Alto José do Pinho
  { id: "025", nome: "Thiago Nascimento", nomeArtistico: "Nação Quilombo", location: { lat: -8.0200, lng: -34.9080 }, categoria: "Música", subcategoria: "Maracatu", bairro: "Alto José do Pinho", municipio: "Recife", genero: "Masculino", raca: "Preta", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "MEI", projetosAprovados: 6, scoreImpacto: 87, statusAuditoria: "Concluído" },

  // Mustardinha
  { id: "026", nome: "Viviane Arruda", location: { lat: -8.0800, lng: -34.9250 }, categoria: "Artesanato", subcategoria: "Bonecos de Barro", bairro: "Mustardinha", municipio: "Recife", genero: "Feminino", raca: "Parda", statusFiscal: "Pendente", tempoAtuacao: "5 a 10 anos", formalizacao: "Informal", projetosAprovados: 0, scoreImpacto: 42, statusAuditoria: "Pendente" },

  // Brasília Teimosa
  { id: "027", nome: "Paulo André Ferreira", location: { lat: -8.0880, lng: -34.8680 }, categoria: "Música", subcategoria: "Ciranda", bairro: "Brasília Teimosa", municipio: "Recife", genero: "Masculino", raca: "Preta", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "MEI", projetosAprovados: 3, scoreImpacto: 72, statusAuditoria: "Concluído" },

  // Dois Irmãos
  { id: "028", nome: "Letícia Wanderley", location: { lat: -8.0130, lng: -34.9450 }, categoria: "Dança", subcategoria: "Ballet Clássico", bairro: "Dois Irmãos", municipio: "Recife", genero: "Feminino", raca: "Branca", statusFiscal: "Regular", tempoAtuacao: "Mais de 10 anos", formalizacao: "CNPJ", projetosAprovados: 7, scoreImpacto: 91, statusAuditoria: "Concluído" },

  // Campo Grande
  { id: "029", nome: "Fábio Gomes", location: { lat: -8.0680, lng: -34.8930 }, categoria: "Audiovisual", subcategoria: "Curta-metragem", bairro: "Campo Grande", municipio: "Recife", genero: "Masculino", raca: "Parda", statusFiscal: "Regular", tempoAtuacao: "3 a 5 anos", formalizacao: "MEI", projetosAprovados: 2, scoreImpacto: 63, statusAuditoria: "Em andamento" },

  // Tejipió
  { id: "030", nome: "Aline Ramos", location: { lat: -8.0650, lng: -34.9400 }, categoria: "Artesanato", subcategoria: "Renda Renascença", bairro: "Tejipió", municipio: "Recife", genero: "Feminino", raca: "Parda", statusFiscal: "Isento", tempoAtuacao: "Mais de 10 anos", formalizacao: "Informal", projetosAprovados: 1, scoreImpacto: 58, statusAuditoria: "Em andamento" },
];

// ===== CATEGORIAS (Linguagens Artísticas) =====
export const categoriasArtisticas = [
  "Música", "Dança", "Teatro", "Artes Visuais", "Artesanato",
  "Literatura", "Audiovisual", "Circo"
];

export const coresCategoria: Record<string, string> = {
  "Música": "#3b82f6",
  "Dança": "#ef4444",
  "Teatro": "#8b5cf6",
  "Artes Visuais": "#f97316",
  "Artesanato": "#eab308",
  "Literatura": "#06b6d4",
  "Audiovisual": "#ec4899",
  "Circo": "#10b981",
};

// ===== PROJETOS EM AUDITORIA =====
export const projetosAuditoriaMock: ProjetoAuditoria[] = [
  { id: "pa-001", titulo: "Festival de Maracatu Nação", artista: "Mestre Salustiano Jr", valor: 85000, status: "verde", statusLabel: "Em dia", evidencias: 12, prazo: "2026-06-15", percentualConcluido: 75 },
  { id: "pa-002", titulo: "Oficina de Frevo nas Escolas", artista: "Maria do Carmo Santos", valor: 42000, status: "verde", statusLabel: "Em dia", evidencias: 8, prazo: "2026-05-20", percentualConcluido: 90 },
  { id: "pa-003", titulo: "Mostra de Grafite Urbano", artista: "Patrícia Moura", valor: 25000, status: "amarelo", statusLabel: "Pendência documental", evidencias: 5, prazo: "2026-04-30", percentualConcluido: 60 },
  { id: "pa-004", titulo: "Documentário Mangue Rising", artista: "André Luiz Pereira", valor: 120000, status: "verde", statusLabel: "Em dia", evidencias: 20, prazo: "2026-08-01", percentualConcluido: 45 },
  { id: "pa-005", titulo: "Circuito de Teatro de Bonecos", artista: "Marcos Vinícius Barros", valor: 35000, status: "vermelho", statusLabel: "Atraso na prestação", evidencias: 3, prazo: "2026-03-15", percentualConcluido: 40 },
  { id: "pa-006", titulo: "Slam de Poesia Periférica", artista: "Camila Torres", valor: 18000, status: "amarelo", statusLabel: "NF com data divergente", evidencias: 4, prazo: "2026-05-10", percentualConcluido: 55 },
  { id: "pa-007", titulo: "Hip Hop Transforma", artista: "Wellington Santos", valor: 30000, status: "verde", statusLabel: "Em dia", evidencias: 9, prazo: "2026-07-20", percentualConcluido: 30 },
  { id: "pa-008", titulo: "Exposição Barro & Fogo", artista: "Viviane Arruda", valor: 15000, status: "vermelho", statusLabel: "CNPJ divergente", evidencias: 1, prazo: "2026-03-01", percentualConcluido: 20 },
];

// ===== INSIGHTS IA =====
export const insightsIAMock: InsightIA[] = [
  {
    id: "ia-001",
    tipo: "deserto_cultural",
    titulo: "Deserto Cultural Detectado: Ibura e Jordão",
    descricao: "Detectamos apenas 3 artistas cadastrados na região Ibura/Jordão, com 0 editais específicos nos últimos 2 anos. A densidade artística é 85% menor que a média municipal. Sugestão: Abertura de edital de fomento à cultura periférica para a Zona Sul.",
    regiao: "Ibura / Jordão",
    impacto: 45,
    prioridade: "alta",
  },
  {
    id: "ia-002",
    tipo: "sugestao_edital",
    titulo: "Potencial: Artesanato Tradicional na Várzea",
    descricao: "Identificamos 8 artesãos de bordado e cerâmica na região da Várzea/Caxangá com alto score de impacto (média 65) mas baixa formalização. Sugestão: Edital de capacitação e formalização de artesãos tradicionais.",
    regiao: "Várzea / Caxangá",
    impacto: 32,
    prioridade: "media",
  },
  {
    id: "ia-003",
    tipo: "alerta",
    titulo: "Concentração: 60% dos Investimentos no Centro",
    descricao: "A análise histórica mostra que 60% dos repasses concentram-se em Recife Antigo, Boa Viagem e Casa Forte. Recomendamos redistribuição para garantir equidade territorial conforme a Lei Aldir Blanc.",
    regiao: "Recife (geral)",
    impacto: 120,
    prioridade: "alta",
  },
  {
    id: "ia-004",
    tipo: "sugestao_edital",
    titulo: "Oportunidade: Manguebeat como Patrimônio Imaterial",
    descricao: "O Pina concentra artistas do Manguebeat com alto impacto cultural (score médio 83). Sugestão: Edital de registro e salvaguarda do Manguebeat como Patrimônio Cultural Imaterial de Pernambuco.",
    regiao: "Pina",
    impacto: 28,
    prioridade: "media",
  },
];

// ===== ESTATÍSTICAS GERAIS =====
export const estatisticasGerais = {
  totalArtistas: artistasMock.length,
  projetosAtivos: projetosAuditoriaMock.filter(p => p.status !== "vermelho").length,
  totalInvestido: projetosAuditoriaMock.reduce((acc, p) => acc + p.valor, 0),
  alcancePopulacional: 184500,
};
