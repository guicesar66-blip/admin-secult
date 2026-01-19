import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InscricaoOficina {
  id: string;
  oficina_id: string;
  user_id: string;
  status: string;
  created_at: string;
  // Profile info
  nome_completo?: string;
  nome_artistico?: string;
  telefone?: string;
  area_artistica?: string;
  tempo_atuacao?: string;
  tipo_atuacao?: string;
  situacao_formalizacao?: string;
  experiencia_editais?: string;
  municipio?: string;
  bairro?: string;
}

export function useInscricoesByOficina(oficinaId: string) {
  return useQuery({
    queryKey: ["inscricoes-oficina", oficinaId],
    queryFn: async () => {
      // Buscar inscrições
      const { data: inscricoes, error } = await supabase
        .from("oficina_inscricoes")
        .select("*")
        .eq("oficina_id", oficinaId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching inscricoes:", error);
        throw error;
      }

      if (!inscricoes || inscricoes.length === 0) {
        return [] as InscricaoOficina[];
      }

      // Buscar profiles dos inscritos
      const userIds = inscricoes.map(i => i.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, nome_completo, nome_artistico, telefone, area_artistica, tempo_atuacao, tipo_atuacao, situacao_formalizacao, experiencia_editais, municipio, bairro")
        .in("user_id", userIds);

      // Mesclar dados
      const result = inscricoes.map(i => {
        const profile = profiles?.find(p => p.user_id === i.user_id);
        return {
          ...i,
          nome_completo: profile?.nome_completo,
          nome_artistico: profile?.nome_artistico,
          telefone: profile?.telefone,
          area_artistica: profile?.area_artistica,
          tempo_atuacao: profile?.tempo_atuacao,
          tipo_atuacao: profile?.tipo_atuacao,
          situacao_formalizacao: profile?.situacao_formalizacao,
          experiencia_editais: profile?.experiencia_editais,
          municipio: profile?.municipio,
          bairro: profile?.bairro,
        };
      });

      return result as InscricaoOficina[];
    },
    enabled: !!oficinaId,
  });
}

export function useUpdateInscricaoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
    }: { 
      id: string; 
      status: string; 
    }) => {
      const { error } = await supabase
        .from("oficina_inscricoes")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inscricoes-oficina"] });
      const statusMsg = variables.status === "aprovada" ? "aprovado" : "reprovado";
      toast.success(`Inscrito ${statusMsg} com sucesso!`);
    },
    onError: () => {
      toast.error("Erro ao atualizar status da inscrição.");
    },
  });
}
