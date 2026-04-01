import { useMemo } from "react";
import { coletivosMock, type MembroColetivo, type Coletivo } from "@/data/mockColetivos";

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

interface CountItem {
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

export interface EcossistemaData {
  membros: MembroColetivo[];
  coletivos: Coletivo[];
  totalMembros: number;
  totalColetivos: number;
  genero: CountItem[];
  raca: CountItem[];
  faixaEtaria: CountItem[];
  formalizacao: (CountItem & { fullMark: number })[];
  linguagem: CountItem[];
  renda: CountItem[];
  escolaridade: CountItem[];
  rendaMedia: number;
  percentAbaixoSM: number;
  servicosBasicos: { name: string; percent: number }[];
  percentSemServico: number;
  vulnerabilidades: { name: string; percent: number }[];
  percentColetivosVulneravel: number;
  ivc: CountItem[];
}

const RENDA_VALUES: Record<string, number> = {
  "Sem renda": 0,
  "Até R$ 600": 400,
  "R$ 600–1.320": 960,
  "R$ 1.320–2.640": 1980,
  "Acima R$ 2.640": 3500,
};

export function useEcossistemaData(filtroLinguagem: string): EcossistemaData {
  return useMemo(() => {
    const allMembros = coletivosMock.flatMap((c) => c.membrosLista);

    const membros =
      filtroLinguagem === "todas"
        ? allMembros
        : allMembros.filter((m) =>
            m.linguagens.some((l) => l.toLowerCase().includes(filtroLinguagem.toLowerCase()))
          );

    const coletivos =
      filtroLinguagem === "todas"
        ? coletivosMock
        : coletivosMock.filter((c) =>
            c.membrosLista.some((m) =>
              m.linguagens.some((l) => l.toLowerCase().includes(filtroLinguagem.toLowerCase()))
            )
          );

    const total = membros.length || 1;

    const genero = countBy(membros.map((m) => normalizeGenero(m.genero)));
    const raca = countBy(membros.map((m) => normalizeRaca(m.racaCor)));

    const ageBrackets = ["18-25a", "26-35a", "36-45a", "46-60a", "60+"];
    const ageMap = new Map<string, number>();
    ageBrackets.forEach((b) => ageMap.set(b, 0));
    membros.forEach((m) => {
      const bracket = getAgeBracket(getAge(m.nascimento));
      ageMap.set(bracket, (ageMap.get(bracket) || 0) + 1);
    });
    const faixaEtaria = ageBrackets.map((name) => {
      const value = ageMap.get(name) || 0;
      return { name, value, percent: Math.round((value / total) * 100) };
    });

    const formRaw = countBy(membros.map((m) => normalizeFormalizacao(m.formalizacao)));
    const formalizacao = formRaw.map((f) => ({ ...f, fullMark: 50 }));

    const allLinguagens = membros.flatMap((m) => m.linguagens);
    const linguagem = countBy(allLinguagens);

    const rendaCats = ["Sem renda", "Até R$ 600", "R$ 600–1.320", "R$ 1.320–2.640", "Acima R$ 2.640"];
    const rendaMap = new Map<string, number>();
    rendaCats.forEach((c) => rendaMap.set(c, 0));
    membros.forEach((m) => {
      const cat = mapRendaToCategory(m.faixaRenda);
      rendaMap.set(cat, (rendaMap.get(cat) || 0) + 1);
    });
    const renda = rendaCats.map((name) => {
      const value = rendaMap.get(name) || 0;
      return { name, value, percent: Math.round((value / total) * 100) };
    });

    const rendaMedia = membros.length > 0
      ? Math.round(membros.reduce((sum, m) => sum + (RENDA_VALUES[mapRendaToCategory(m.faixaRenda)] || 0), 0) / membros.length)
      : 0;

    const SALARIO_MINIMO = 1518;
    const abaixoSM = membros.filter((m) => (RENDA_VALUES[mapRendaToCategory(m.faixaRenda)] || 0) < SALARIO_MINIMO).length;
    const percentAbaixoSM = Math.round((abaixoSM / total) * 100);

    const escolaridade = countBy(membros.map((m) => normalizeEscolaridade(m.escolaridade)));

    const serviceKeys: (keyof MembroColetivo["servicosBasicos"])[] = ["agua", "energia", "coletaLixo", "esgoto", "internet"];
    const serviceLabels: Record<string, string> = {
      agua: "Água encanada",
      energia: "Energia elétrica",
      coletaLixo: "Coleta de lixo",
      esgoto: "Esgoto tratado",
      internet: "Internet em casa",
    };
    const servicosBasicos = serviceKeys.map((key) => {
      const count = membros.filter((m) => m.servicosBasicos[key]).length;
      return { name: serviceLabels[key], percent: Math.round((count / total) * 100) };
    }).sort((a, b) => b.percent - a.percent);

    const membrosSemServico = membros.filter((m) =>
      !m.servicosBasicos.agua || !m.servicosBasicos.energia || !m.servicosBasicos.coletaLixo || !m.servicosBasicos.esgoto || !m.servicosBasicos.internet
    ).length;
    const percentSemServico = Math.round((membrosSemServico / total) * 100);

    const vulnLabels = ["Dependentes sem renda", "Benef. programa social", "Insegurança alimentar", "Familiar com deficiência", "Condição de rua (passada)"];
    const vulnerabilidades = vulnLabels.map((label) => {
      const count = membros.filter((m) =>
        m.vulnerabilidades.some((v) => v.toLowerCase().includes(label.toLowerCase().slice(0, 10)))
      ).length;
      return { name: label, percent: Math.round((count / total) * 100) };
    }).filter((v) => v.percent > 0).sort((a, b) => b.percent - a.percent);

    const coletivosComVuln = coletivos.filter((c) =>
      c.membrosLista.some((m) => m.vulnerabilidades.length > 0)
    ).length;
    const percentColetivosVulneravel = coletivos.length > 0
      ? Math.round((coletivosComVuln / coletivos.length) * 100)
      : 0;

    const ivcMap = new Map<string, number>();
    ["Média vulnerabilidade", "Alta vulnerabilidade", "Baixa vulnerabilidade"].forEach((k) => ivcMap.set(k, 0));
    coletivos.forEach((c) => {
      const label = c.ivc === "alta" ? "Alta vulnerabilidade" : c.ivc === "media" ? "Média vulnerabilidade" : "Baixa vulnerabilidade";
      ivcMap.set(label, (ivcMap.get(label) || 0) + 1);
    });
    const totalC = coletivos.length || 1;
    const ivc: CountItem[] = ["Média vulnerabilidade", "Alta vulnerabilidade", "Baixa vulnerabilidade"].map((name) => {
      const value = ivcMap.get(name) || 0;
      return { name, value, percent: Math.round((value / totalC) * 100) };
    });

    return {
      membros,
      coletivos,
      totalMembros: membros.length,
      totalColetivos: coletivos.length,
      genero,
      raca,
      faixaEtaria,
      formalizacao,
      linguagem,
      renda,
      escolaridade,
      rendaMedia,
      percentAbaixoSM,
      servicosBasicos,
      percentSemServico,
      vulnerabilidades,
      percentColetivosVulneravel,
      ivc,
    };
  }, [filtroLinguagem]);
}
