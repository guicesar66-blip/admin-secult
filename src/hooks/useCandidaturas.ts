import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Candidatura {
  id: string;
  oportunidade_id: string;
  user_id: string;
  status: string;
  mensagem: string | null;
  motivo_reprovacao: string | null;
  created_at: string;
  updated_at: string | null;
  // Profile info
  nome_completo?: string;
  nome_artistico?: string;
  telefone?: string;
}

export function useCandidaturasByOportunidade(oportunidadeId: string) {
  return useQuery({
    queryKey: ["candidaturas", oportunidadeId],
    queryFn: async () => {
      // Buscar candidaturas
      const { data: candidaturas, error } = await supabase
        .from("oportunidade_interessados")
        .select("*")
        .eq("oportunidade_id", oportunidadeId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching candidaturas:", error);
        throw error;
      }

      // Buscar profiles dos candidatos
      const userIds = candidaturas.map(c => c.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, nome_completo, nome_artistico, telefone")
        .in("user_id", userIds);

      // Mesclar dados
      const result = candidaturas.map(c => {
        const profile = profiles?.find(p => p.user_id === c.user_id);
        return {
          ...c,
          nome_completo: profile?.nome_completo,
          nome_artistico: profile?.nome_artistico,
          telefone: profile?.telefone,
        };
      });

      return result as Candidatura[];
    },
    enabled: !!oportunidadeId,
  });
}

export function useUpdateCandidaturaStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      motivo_reprovacao 
    }: { 
      id: string; 
      status: string; 
      motivo_reprovacao?: string;
    }) => {
      const updateData: { status: string; motivo_reprovacao?: string } = { status };
      if (motivo_reprovacao) {
        updateData.motivo_reprovacao = motivo_reprovacao;
      }

      const { error } = await supabase
        .from("oportunidade_interessados")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["candidaturas"] });
      const statusMsg = variables.status === "aprovada" ? "aprovado" : "reprovado";
      toast.success(`Candidato ${statusMsg} com sucesso!`);
    },
    onError: () => {
      toast.error("Erro ao atualizar status do candidato.");
    },
  });
}
