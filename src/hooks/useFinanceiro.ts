import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface LancamentoFinanceiro {
  id: string;
  oportunidade_id: string | null;
  oficina_id: string | null;
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number;
  data: string;
  status: "previsto" | "confirmado" | "pago" | "cancelado";
  categoria: string | null;
  criador_id: string;
  created_at: string;
  updated_at: string;
}

export interface RepasseColaborador {
  id: string;
  oportunidade_id: string | null;
  oficina_id: string | null;
  colaborador_nome: string;
  colaborador_id: string | null;
  valor: number;
  status: "pendente" | "pago" | "cancelado";
  data_pagamento: string | null;
  criador_id: string;
  created_at: string;
  updated_at: string;
}

export type CreateLancamento = Omit<LancamentoFinanceiro, "id" | "created_at" | "updated_at">;
export type CreateRepasse = Omit<RepasseColaborador, "id" | "created_at" | "updated_at">;

// Hook para lançamentos financeiros de um projeto
export function useLancamentosFinanceiros(projetoId: string, tipoEntidade: "oportunidade" | "oficina") {
  return useQuery({
    queryKey: ["lancamentos-financeiros", projetoId, tipoEntidade],
    queryFn: async () => {
      const column = tipoEntidade === "oportunidade" ? "oportunidade_id" : "oficina_id";
      const { data, error } = await supabase
        .from("lancamentos_financeiros")
        .select("*")
        .eq(column, projetoId)
        .order("data", { ascending: false });

      if (error) throw error;
      return data as LancamentoFinanceiro[];
    },
    enabled: !!projetoId,
  });
}

// Hook para repasses de um projeto
export function useRepassesColaboradores(projetoId: string, tipoEntidade: "oportunidade" | "oficina") {
  return useQuery({
    queryKey: ["repasses-colaboradores", projetoId, tipoEntidade],
    queryFn: async () => {
      const column = tipoEntidade === "oportunidade" ? "oportunidade_id" : "oficina_id";
      const { data, error } = await supabase
        .from("repasses_colaboradores")
        .select("*")
        .eq(column, projetoId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RepasseColaborador[];
    },
    enabled: !!projetoId,
  });
}

// Hook para criar lançamento
export function useCreateLancamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lancamento: CreateLancamento) => {
      const { data, error } = await supabase
        .from("lancamentos_financeiros")
        .insert(lancamento)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["lancamentos-financeiros", variables.oportunidade_id || variables.oficina_id] 
      });
      toast.success("Lançamento criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar lançamento:", error);
      toast.error("Erro ao criar lançamento");
    },
  });
}

// Hook para atualizar lançamento
export function useUpdateLancamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LancamentoFinanceiro> }) => {
      const { data: result, error } = await supabase
        .from("lancamentos_financeiros")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos-financeiros"] });
      toast.success("Lançamento atualizado!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar lançamento:", error);
      toast.error("Erro ao atualizar lançamento");
    },
  });
}

// Hook para deletar lançamento
export function useDeleteLancamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lancamentos_financeiros")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos-financeiros"] });
      toast.success("Lançamento excluído!");
    },
    onError: (error) => {
      console.error("Erro ao excluir lançamento:", error);
      toast.error("Erro ao excluir lançamento");
    },
  });
}

// Hook para criar repasse
export function useCreateRepasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repasse: CreateRepasse) => {
      const { data, error } = await supabase
        .from("repasses_colaboradores")
        .insert(repasse)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["repasses-colaboradores", variables.oportunidade_id || variables.oficina_id] 
      });
      toast.success("Repasse criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar repasse:", error);
      toast.error("Erro ao criar repasse");
    },
  });
}

// Hook para atualizar repasse
export function useUpdateRepasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RepasseColaborador> }) => {
      const { data: result, error } = await supabase
        .from("repasses_colaboradores")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repasses-colaboradores"] });
      toast.success("Repasse atualizado!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar repasse:", error);
      toast.error("Erro ao atualizar repasse");
    },
  });
}

// Hook para deletar repasse
export function useDeleteRepasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("repasses_colaboradores")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repasses-colaboradores"] });
      toast.success("Repasse excluído!");
    },
    onError: (error) => {
      console.error("Erro ao excluir repasse:", error);
      toast.error("Erro ao excluir repasse");
    },
  });
}
