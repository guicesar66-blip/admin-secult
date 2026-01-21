import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Hook para buscar todos os lançamentos financeiros do usuário logado
export function useTodosLancamentos() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["todos-lancamentos", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("lancamentos_financeiros")
        .select("*")
        .eq("criador_id", user.id)
        .order("data", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

// Hook para buscar todos os repasses do usuário logado
export function useTodosRepasses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["todos-repasses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("repasses_colaboradores")
        .select("*")
        .eq("criador_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

// Hook para buscar todos os candidatos/inscritos nos projetos do usuário
export function useTodosCandidatos() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["todos-candidatos", user?.id],
    queryFn: async () => {
      if (!user?.id) return { candidaturas: [], inscricoes: [] };

      // Buscar oportunidades do usuário
      const { data: oportunidades } = await supabase
        .from("oportunidades")
        .select("id")
        .eq("criador_id", user.id);

      // Buscar oficinas do usuário
      const { data: oficinas } = await supabase
        .from("oficinas")
        .select("id")
        .eq("criador_id", user.id);

      const oportunidadeIds = oportunidades?.map(o => o.id) || [];
      const oficinaIds = oficinas?.map(o => o.id) || [];

      // Buscar candidaturas
      let candidaturas: any[] = [];
      if (oportunidadeIds.length > 0) {
        const { data } = await supabase
          .from("oportunidade_interessados")
          .select("*")
          .in("oportunidade_id", oportunidadeIds);
        candidaturas = data || [];
      }

      // Buscar inscrições em oficinas
      let inscricoes: any[] = [];
      if (oficinaIds.length > 0) {
        const { data } = await supabase
          .from("oficina_inscricoes")
          .select("*")
          .in("oficina_id", oficinaIds);
        inscricoes = data || [];
      }

      // Buscar profiles dos candidatos/inscritos
      const allUserIds = [
        ...candidaturas.map(c => c.user_id),
        ...inscricoes.map(i => i.user_id),
      ].filter((id, index, arr) => arr.indexOf(id) === index);

      let profiles: any[] = [];
      if (allUserIds.length > 0) {
        const { data } = await supabase
          .from("profiles")
          .select("user_id, nome_completo, nome_artistico, municipio, bairro, area_artistica, tempo_atuacao, situacao_formalizacao")
          .in("user_id", allUserIds);
        profiles = data || [];
      }

      // Mesclar profiles com candidaturas
      const candidaturasComProfile = candidaturas.map(c => ({
        ...c,
        profile: profiles.find(p => p.user_id === c.user_id),
      }));

      // Mesclar profiles com inscrições
      const inscricoesComProfile = inscricoes.map(i => ({
        ...i,
        profile: profiles.find(p => p.user_id === i.user_id),
      }));

      return {
        candidaturas: candidaturasComProfile,
        inscricoes: inscricoesComProfile,
        profiles,
      };
    },
    enabled: !!user?.id,
  });
}

// Hook para estatísticas agregadas por região (baseado nos projetos do usuário)
export function useEstatisticasTerritoriais() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["estatisticas-territoriais", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Buscar oportunidades com municípios
      const { data: oportunidades } = await supabase
        .from("oportunidades")
        .select("id, municipio, local, vagas")
        .eq("criador_id", user.id);

      // Buscar oficinas com locais
      const { data: oficinas } = await supabase
        .from("oficinas")
        .select("id, local, vagas_total")
        .eq("criador_id", user.id);

      // Agregar por região/município
      const regiaoMap: Record<string, { projetos: number; vagas: number }> = {};

      oportunidades?.forEach(o => {
        const regiao = o.municipio || o.local || "Não especificado";
        if (!regiaoMap[regiao]) {
          regiaoMap[regiao] = { projetos: 0, vagas: 0 };
        }
        regiaoMap[regiao].projetos += 1;
        regiaoMap[regiao].vagas += o.vagas || 0;
      });

      oficinas?.forEach(o => {
        const regiao = o.local || "Não especificado";
        if (!regiaoMap[regiao]) {
          regiaoMap[regiao] = { projetos: 0, vagas: 0 };
        }
        regiaoMap[regiao].projetos += 1;
        regiaoMap[regiao].vagas += o.vagas_total || 0;
      });

      return Object.entries(regiaoMap).map(([nome, dados]) => ({
        nome,
        projetos: dados.projetos,
        vagas: dados.vagas,
      }));
    },
    enabled: !!user?.id,
  });
}
