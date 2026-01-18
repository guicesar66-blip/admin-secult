import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Oportunidade {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
  tipo: string;
  local: string | null;
  municipio: string | null;
  data_evento: string | null;
  horario: string | null;
  duracao: string;
  remuneracao: number | null;
  cena_coins: number | null;
  requisitos: string | null;
  vagas: number | null;
  prazo_inscricao: string | null;
  criador_nome: string;
  criador_contato: string | null;
  criador_id: string | null;
  status: string;
  area_cultural: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOportunidadeData {
  titulo: string;
  descricao?: string;
  tipo: string;
  local?: string;
  municipio?: string;
  data_evento?: string;
  horario?: string;
  duracao: string;
  remuneracao?: number;
  cena_coins?: number;
  requisitos?: string;
  vagas?: number;
  prazo_inscricao?: string;
  criador_nome: string;
  criador_contato?: string;
  criador_id?: string;
  area_cultural?: string;
  imagem?: string;
}

export function useOportunidades(tipo?: string) {
  return useQuery({
    queryKey: ["oportunidades", tipo],
    queryFn: async () => {
      let query = supabase
        .from("oportunidades")
        .select("*")
        .order("created_at", { ascending: false });

      if (tipo) {
        query = query.eq("tipo", tipo);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching oportunidades:", error);
        throw error;
      }

      return data as Oportunidade[];
    },
  });
}

export function useOportunidade(id: string) {
  return useQuery({
    queryKey: ["oportunidade", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oportunidades")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching oportunidade:", error);
        throw error;
      }

      return data as Oportunidade | null;
    },
    enabled: !!id,
  });
}

export function useCreateOportunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOportunidadeData) => {
      const { data: result, error } = await supabase
        .from("oportunidades")
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error("Error creating oportunidade:", error);
        throw error;
      }

      return result as Oportunidade;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oportunidades"] });
      toast.success("Projeto criado com sucesso!");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Erro ao criar projeto. Tente novamente.");
    },
  });
}

export function useDeleteOportunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("oportunidades")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting oportunidade:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oportunidades"] });
      toast.success("Projeto excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Erro ao excluir projeto. Tente novamente.");
    },
  });
}
