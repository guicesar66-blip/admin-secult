import { useMemo } from "react";
import { artistasMock, getArtistasUnicos, getArtistasByProdutora, type Artista } from "@/data/mockArtistas";
import { usuariosMock, type Usuario } from "@/data/mockUsuarios";
import { produtorasMock, type Produtora } from "@/data/mockProdutoras";
import {
  tiposLinguagem,
  getTipoNome,
  getSubtipoNome,
  getSubtipoIdsByTipoNome,
  type TipoLinguagem,
} from "@/data/mockLinguagens";

function getAge(nascimento: string): number {
  const birth = new Date(nascimento);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age;
}

function getAgeBracket(age: number): string {
  if (age < 26) return "18-25a";
  if (age < 36) return "26-35a";
  if (age < 46) return "36-45a";
  if (age < 61) return "46-60a";
  return "60+";
}

function mapRendaToCategory(faixaRenda: string): string {
  if (faixaRenda.includes("Sem renda") || faixaRenda === "Sem renda") return "Sem renda";
  if (faixaRenda.includes("Até R$ 600") || faixaRenda === "Até R$ 600") return "Até R$ 600";
  if (faixaRenda.includes("600") && faixaRenda.includes("1.320")) return "R$ 600–1.320";
  if (faixaRenda.includes("1.320") && faixaRenda.includes("2.640")) return "R$ 1.320–2.640";
  if (faixaRenda.includes("Acima") || faixaRenda.includes("acima") || faixaRenda.includes("2.640")) return "Acima R$ 2.640";
  return "Sem renda";
}

function normalizeGenero(genero: string): string {
  const g = genero.toLowerCase();
  if (g.includes("mulher") || g.includes("feminino") || g === "f") return "Feminino";
  if (g.includes("homem") || g.includes("masculino") || g === "m") return "Masculino";
  return "Não-binário/outro";
}

function normalizeRaca(raca: string): string {
  const r = raca.toLowerCase();
  if (r.includes("parda")) return "Parda";
  if (r.includes("preta") || r.includes("negra")) return "Preta";
  if (r.includes("branca")) return "Branca";
  if (r.includes("indígena") || r.includes("indigena")) return "Indígena";
  if (r.includes("amarela")) return "Amarela";
  return "Outros";
}

function normalizeEscolaridade(esc: string): string {
  const e = esc.toLowerCase();
  if (e.includes("pós") || e.includes("pos")) return "Pós-graduação";
  if (e.includes("superior completo") && !e.includes("incompleto")) return "Superior completo";
  if (e.includes("superior incompleto")) return "Superior incompleto";
  if (e.includes("médio") || e.includes("medio")) return "Médio completo";
  if (e.includes("fundamental")) return "Fundamental";
  return "Sem escolaridade";
}

function normalizeFormalizacao(f: string): string {
  const fl = f.toLowerCase();
  if (fl.includes("mei")) return "MEI";
  if (fl.includes("me") || fl.includes("epp")) return "ME/EPP";
  if (fl.includes("coletivo") || fl.includes("associação") || fl.includes("associacao")) return "Coletivo";
  return "Informal";
}

export interface CountItem {
  name: string;
  value: number;
  percent: number;
}

function countBy(items: string[]): CountItem[] {
  const map = new Map<string, number>();
  items.forEach((item) => map.set(item, (map.get(item) || 0) + 1));
  const total = items.length || 1;
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value, percent: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value);
}

// Enriched artista with usuario data for charts
export interface ArtistaEnriquecido extends Artista {
  usuario: Usuario;
}

export interface EcossistemaData {
  artistas: ArtistaEnriquecido[];
  produtoras: Produtora[];
  totalArtistas: number;
  totalProdutoras: number;
  genero: CountItem[];
  raca: CountItem[];
  faixaEtaria: CountItem[];
  formalizacao: (CountItem & { fullMark: number })[];
  // Linguagem: tipos principais quando sem filtro, subtipos quando filtrado
  linguagem: CountItem[];
  linguagemSubtipos: CountItem[];
  filtroTipoNome: string | null;
  renda: CountItem[];
  escolaridade: CountItem[];
  rendaMedia: number;
  percentAbaixoSM: number;
  servicosBasicos: { name: string; percent: number }[];
  percentSemServico: number;
  vulnerabilidades: { name: string; percent: number }[];
  percentProdutorasVulneravel: number;
  ivc: CountItem[];
}

const RENDA_VALUES: Record<string, number> = {
  "Sem renda": 0,
  "Até R$ 600": 400,
  "R$ 600–1.320": 960,
  "R$ 1.320–2.640": 1980,
  "Acima R$ 2.640": 3500,
};

/**
 * Checks if an artista has at least one subtipo belonging to the given tipo nome.
 */
function artistaTemTipo(artista: Artista, tipoNome: string): boolean {
  const subIds = getSubtipoIdsByTipoNome(tipoNome);
  return artista.subtipo_ids.some((sid) => subIds.includes(sid));
}

export function useEcossistemaData(filtroLinguagem: string, filtroCidades: string[] = []): EcossistemaData {
  return useMemo(() => {
    // Get unique artistas (deduplicate M:N by usuario_id)
    const uniqueArtistas = getArtistasUnicos();

    // Filter by municipio (from usuario)
    const usuarioMap = new Map(usuariosMock.map((u) => [u.id, u]));
    const afterCityFilter =
      filtroCidades.length === 0
        ? uniqueArtistas
        : uniqueArtistas.filter((a) => {
            const usuario = usuarioMap.get(a.usuario_id);
            return usuario ? filtroCidades.includes(usuario.municipio) : false;
          });

    // Filter by tipo principal de linguagem
    const filteredArtistas =
      filtroLinguagem === "todas"
        ? afterCityFilter
        : afterCityFilter.filter((a) => artistaTemTipo(a, filtroLinguagem));

    // Enrich with usuario data
    const usuarioMap = new Map(usuariosMock.map((u) => [u.id, u]));
    const artistas: ArtistaEnriquecido[] = filteredArtistas
      .map((a) => {
        const usuario = usuarioMap.get(a.usuario_id);
        if (!usuario) return null;
        return { ...a, usuario };
      })
      .filter(Boolean) as ArtistaEnriquecido[];

    // Filter produtoras: keep those that have at least one artista with the selected linguagem
    const produtoras =
      filtroLinguagem === "todas"
        ? produtorasMock
        : produtorasMock.filter((p) =>
            getArtistasByProdutora(p.id).some((a) => artistaTemTipo(a, filtroLinguagem))
          );

    const total = artistas.length || 1;

    // Demographics from usuario data
    const genero = countBy(artistas.map((a) => normalizeGenero(a.usuario.genero)));
    const raca = countBy(artistas.map((a) => normalizeRaca(a.usuario.raca_cor)));

    const ageBrackets = ["18-25a", "26-35a", "36-45a", "46-60a", "60+"];
    const ageMap = new Map<string, number>();
    ageBrackets.forEach((b) => ageMap.set(b, 0));
    artistas.forEach((a) => {
      const bracket = getAgeBracket(getAge(a.usuario.nascimento));
      ageMap.set(bracket, (ageMap.get(bracket) || 0) + 1);
    });
    const faixaEtaria = ageBrackets.map((name) => {
      const value = ageMap.get(name) || 0;
      return { name, value, percent: Math.round((value / total) * 100) };
    });

    // Formalizacao
    const formRaw = countBy(artistas.map((a) => normalizeFormalizacao(a.formalizacao)));
    const formalizacao = formRaw.map((f) => ({ ...f, fullMark: 50 }));

    // Linguagem — tipos principais (count artistas per tipo)
    const linguagem: CountItem[] = tiposLinguagem.map((tipo) => {
      const count = artistas.filter((a) => artistaTemTipo(a, tipo.nome)).length;
      return { name: tipo.nome, value: count, percent: Math.round((count / total) * 100) };
    }).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);

    // Linguagem subtipos — only when filtered by a specific tipo
    let linguagemSubtipos: CountItem[] = [];
    let filtroTipoNome: string | null = null;
    if (filtroLinguagem !== "todas") {
      filtroTipoNome = filtroLinguagem;
      const tipo = tiposLinguagem.find((t) => t.nome === filtroLinguagem);
      if (tipo) {
        linguagemSubtipos = tipo.subtipos.map((sub) => {
          const count = artistas.filter((a) => a.subtipo_ids.includes(sub.id)).length;
          return { name: sub.nome, value: count, percent: Math.round((count / total) * 100) };
        }).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
      }
    }

    // Renda
    const rendaCats = ["Sem renda", "Até R$ 600", "R$ 600–1.320", "R$ 1.320–2.640", "Acima R$ 2.640"];
    const rendaMap = new Map<string, number>();
    rendaCats.forEach((c) => rendaMap.set(c, 0));
    artistas.forEach((a) => {
      const cat = mapRendaToCategory(a.faixa_renda);
      rendaMap.set(cat, (rendaMap.get(cat) || 0) + 1);
    });
    const renda = rendaCats.map((name) => {
      const value = rendaMap.get(name) || 0;
      return { name, value, percent: Math.round((value / total) * 100) };
    });

    const rendaMedia = artistas.length > 0
      ? Math.round(artistas.reduce((sum, a) => sum + (RENDA_VALUES[mapRendaToCategory(a.faixa_renda)] || 0), 0) / artistas.length)
      : 0;

    const SALARIO_MINIMO = 1518;
    const abaixoSM = artistas.filter((a) => (RENDA_VALUES[mapRendaToCategory(a.faixa_renda)] || 0) < SALARIO_MINIMO).length;
    const percentAbaixoSM = Math.round((abaixoSM / total) * 100);

    const escolaridade = countBy(artistas.map((a) => normalizeEscolaridade(a.escolaridade)));

    const serviceKeys: (keyof Artista["servicos_basicos"])[] = ["agua", "energia", "coleta_lixo", "esgoto", "internet"];
    const serviceLabels: Record<string, string> = {
      agua: "Água encanada",
      energia: "Energia elétrica",
      coleta_lixo: "Coleta de lixo",
      esgoto: "Esgoto tratado",
      internet: "Internet em casa",
    };
    const servicosBasicos = serviceKeys.map((key) => {
      const count = artistas.filter((a) => a.servicos_basicos[key]).length;
      return { name: serviceLabels[key], percent: Math.round((count / total) * 100) };
    }).sort((a, b) => b.percent - a.percent);

    const artistasSemServico = artistas.filter((a) =>
      !a.servicos_basicos.agua || !a.servicos_basicos.energia || !a.servicos_basicos.coleta_lixo || !a.servicos_basicos.esgoto || !a.servicos_basicos.internet
    ).length;
    const percentSemServico = Math.round((artistasSemServico / total) * 100);

    const vulnLabels = ["Dependentes sem renda", "Benef. programa social", "Insegurança alimentar", "Familiar com deficiência", "Condição de rua (passada)"];
    const vulnerabilidades = vulnLabels.map((label) => {
      const count = artistas.filter((a) =>
        a.vulnerabilidades.some((v) => v.toLowerCase().includes(label.toLowerCase().slice(0, 10)))
      ).length;
      return { name: label, percent: Math.round((count / total) * 100) };
    }).filter((v) => v.percent > 0).sort((a, b) => b.percent - a.percent);

    const produtorasComVuln = produtoras.filter((p) =>
      getArtistasByProdutora(p.id).some((a) => a.vulnerabilidades.length > 0)
    ).length;
    const percentProdutorasVulneravel = produtoras.length > 0
      ? Math.round((produtorasComVuln / produtoras.length) * 100)
      : 0;

    const ivcMap = new Map<string, number>();
    ["Média vulnerabilidade", "Alta vulnerabilidade", "Baixa vulnerabilidade"].forEach((k) => ivcMap.set(k, 0));
    produtoras.forEach((p) => {
      const label = p.ivc === "alta" ? "Alta vulnerabilidade" : p.ivc === "media" ? "Média vulnerabilidade" : "Baixa vulnerabilidade";
      ivcMap.set(label, (ivcMap.get(label) || 0) + 1);
    });
    const totalP = produtoras.length || 1;
    const ivc: CountItem[] = ["Média vulnerabilidade", "Alta vulnerabilidade", "Baixa vulnerabilidade"].map((name) => {
      const value = ivcMap.get(name) || 0;
      return { name, value, percent: Math.round((value / totalP) * 100) };
    });

    return {
      artistas,
      produtoras,
      totalArtistas: artistas.length,
      totalProdutoras: produtoras.length,
      genero,
      raca,
      faixaEtaria,
      formalizacao,
      linguagem,
      linguagemSubtipos,
      filtroTipoNome,
      renda,
      escolaridade,
      rendaMedia,
      percentAbaixoSM,
      servicosBasicos,
      percentSemServico,
      vulnerabilidades,
      percentProdutorasVulneravel,
      ivc,
    };
  }, [filtroLinguagem]);
}
