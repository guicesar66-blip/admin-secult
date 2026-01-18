import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type TipoApoio = "financeiro" | "servico" | "patrocinio";
export type StatusProposta = "pendente" | "aprovada" | "rejeitada" | "contraproposta" | "cancelada";

export interface PropostaInvestimento {
  id: string;
  oportunidade_id: string | null;
  oficina_id: string | null;
  investidor_id: string;
  criador_id: string;
  tipo_apoio: TipoApoio;
  valor_financeiro: number | null;
  descricao_servico: string | null;
  contrapartidas_desejadas: string[] | null;
  mensagem: string | null;
  status: StatusProposta;
  proposta_pai_id: string | null;
  motivo_rejeicao: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePropostaData {
  oportunidade_id?: string;
  oficina_id?: string;
  criador_id: string;
  tipo_apoio: TipoApoio;
  valor_financeiro?: number;
  descricao_servico?: string;
  contrapartidas_desejadas?: string[];
  mensagem?: string;
  proposta_pai_id?: string;
}

// Hook para buscar propostas que o usuário enviou (como investidor)
export const useMinhasPropostas = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["minhas-propostas", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("propostas_investimento")
        .select("*")
        .eq("investidor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PropostaInvestimento[];
    },
    enabled: !!user?.id,
  });
};

// Hook para buscar propostas recebidas (como criador de projetos)
export const usePropostasRecebidas = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["propostas-recebidas", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("propostas_investimento")
        .select("*")
        .eq("criador_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PropostaInvestimento[];
    },
    enabled: !!user?.id,
  });
};

// Hook para buscar propostas de uma oportunidade específica
export const usePropostasByOportunidade = (oportunidadeId: string) => {
  return useQuery({
    queryKey: ["propostas-oportunidade", oportunidadeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("propostas_investimento")
        .select("*")
        .eq("oportunidade_id", oportunidadeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PropostaInvestimento[];
    },
    enabled: !!oportunidadeId,
  });
};

// Hook para criar uma proposta
export const useCreateProposta = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propostaData: CreatePropostaData) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("propostas_investimento")
        .insert({
          ...propostaData,
          investidor_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minhas-propostas"] });
      queryClient.invalidateQueries({ queryKey: ["propostas-oportunidade"] });
      toast.success("Proposta enviada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar proposta:", error);
      toast.error("Erro ao enviar proposta. Tente novamente.");
    },
  });
};

// Hook para atualizar status de uma proposta (criador)
export const useUpdatePropostaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propostaId,
      status,
      motivo_rejeicao,
    }: {
      propostaId: string;
      status: StatusProposta;
      motivo_rejeicao?: string;
    }) => {
      const { data, error } = await supabase
        .from("propostas_investimento")
        .update({ status, motivo_rejeicao })
        .eq("id", propostaId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["propostas-recebidas"] });
      queryClient.invalidateQueries({ queryKey: ["propostas-oportunidade"] });
      
      const statusMessages: Record<StatusProposta, string> = {
        aprovada: "Proposta aprovada com sucesso!",
        rejeitada: "Proposta rejeitada.",
        contraproposta: "Contraproposta enviada!",
        cancelada: "Proposta cancelada.",
        pendente: "Status atualizado.",
      };
      
      toast.success(statusMessages[variables.status]);
    },
    onError: (error) => {
      console.error("Erro ao atualizar proposta:", error);
      toast.error("Erro ao atualizar proposta.");
    },
  });
};

// Hook para cancelar proposta (investidor)
export const useCancelarProposta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propostaId: string) => {
      const { data, error } = await supabase
        .from("propostas_investimento")
        .update({ status: "cancelada" as StatusProposta })
        .eq("id", propostaId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minhas-propostas"] });
      toast.success("Proposta cancelada.");
    },
    onError: (error) => {
      console.error("Erro ao cancelar proposta:", error);
      toast.error("Erro ao cancelar proposta.");
    },
  });
};
