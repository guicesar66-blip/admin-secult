import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OportunidadeVitrine {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  local: string | null;
  municipio: string | null;
  data_evento: string | null;
  imagem: string | null;
  area_cultural: string | null;
  criador_nome: string;
  criador_id: string | null;
  meta_captacao: number | null;
  captacao_atual: number | null;
  mostrar_progresso: boolean | null;
  exibir_vitrine: boolean;
  status: string;
  created_at: string;
  // Campos calculados da view
  criador_nome_completo?: string | null;
  criador_nome_artistico?: string | null;
  total_propostas?: number;
  valor_captado?: number;
}

export interface OficinaVitrine {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
  area_artistica: string;
  local: string | null;
  organizacao: string;
  meta_captacao: number | null;
  captacao_atual: number | null;
  mostrar_progresso: boolean | null;
  exibir_vitrine: boolean;
  status: string;
  created_at: string;
  total_propostas?: number;
  valor_captado?: number;
}

// Buscar todas as oportunidades na vitrine
export const useOportunidadesVitrine = () => {
  return useQuery({
    queryKey: ["oportunidades-vitrine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oportunidades")
        .select("*")
        .eq("exibir_vitrine", true)
        .eq("status", "ativa")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OportunidadeVitrine[];
    },
  });
};

// Buscar todas as oficinas na vitrine
export const useOficinasVitrine = () => {
  return useQuery({
    queryKey: ["oficinas-vitrine"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oficinas")
        .select("*")
        .eq("exibir_vitrine", true)
        .eq("status", "inscricoes_abertas")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OficinaVitrine[];
    },
  });
};

// Buscar uma oportunidade específica para investimento
export const useOportunidadeParaInvestir = (id: string) => {
  return useQuery({
    queryKey: ["oportunidade-investir", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oportunidades")
        .select("*")
        .eq("id", id)
        .eq("exibir_vitrine", true)
        .single();

      if (error) throw error;
      return data as OportunidadeVitrine;
    },
    enabled: !!id,
  });
};

// Buscar oportunidades "em alta" (mais propostas recebidas)
export const useOportunidadesEmAlta = () => {
  return useQuery({
    queryKey: ["oportunidades-em-alta"],
    queryFn: async () => {
      // Buscar oportunidades na vitrine
      const { data: oportunidades, error: opError } = await supabase
        .from("oportunidades")
        .select("*")
        .eq("exibir_vitrine", true)
        .eq("status", "ativa")
        .order("created_at", { ascending: false })
        .limit(10);

      if (opError) throw opError;
      
      // Buscar contagem de propostas para cada oportunidade
      const oportunidadesComContagem = await Promise.all(
        (oportunidades || []).map(async (op) => {
          const { count } = await supabase
            .from("propostas_investimento")
            .select("*", { count: "exact", head: true })
            .eq("oportunidade_id", op.id);
          
          return {
            ...op,
            total_propostas: count || 0,
          };
        })
      );

      // Ordenar por número de propostas
      return oportunidadesComContagem
        .sort((a, b) => b.total_propostas - a.total_propostas)
        .slice(0, 4) as OportunidadeVitrine[];
    },
  });
};

// Estatísticas gerais da vitrine
export const useVitrineStats = () => {
  return useQuery({
    queryKey: ["vitrine-stats"],
    queryFn: async () => {
      const { count: totalOportunidades } = await supabase
        .from("oportunidades")
        .select("*", { count: "exact", head: true })
        .eq("exibir_vitrine", true)
        .eq("status", "ativa");

      const { count: totalOficinas } = await supabase
        .from("oficinas")
        .select("*", { count: "exact", head: true })
        .eq("exibir_vitrine", true)
        .eq("status", "inscricoes_abertas");

      const { count: totalPropostas } = await supabase
        .from("propostas_investimento")
        .select("*", { count: "exact", head: true });

      return {
        totalOportunidades: totalOportunidades || 0,
        totalOficinas: totalOficinas || 0,
        totalPropostas: totalPropostas || 0,
        totalProjetos: (totalOportunidades || 0) + (totalOficinas || 0),
      };
    },
  });
};
