import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Oficina {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
  area_artistica: string;
  categoria: string;
  nivel: string;
  modalidade: string;
  dias_semana: string[];
  horario: string;
  local: string | null;
  data_inicio: string;
  data_fim: string;
  inscricao_fim: string;
  carga_horaria: number;
  num_encontros: number;
  vagas_total: number;
  publico_alvo: string | null;
  prerequisitos: string | null;
  facilitador_nome: string;
  facilitador_bio: string | null;
  facilitador_avatar: string | null;
  organizacao: string;
  emite_certificado: boolean | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOficinaData {
  titulo: string;
  descricao?: string;
  area_artistica: string;
  categoria: string;
  nivel: string;
  modalidade: string;
  dias_semana: string[];
  horario: string;
  local?: string;
  data_inicio: string;
  data_fim: string;
  inscricao_fim: string;
  carga_horaria: number;
  num_encontros: number;
  vagas_total?: number;
  publico_alvo?: string;
  prerequisitos?: string;
  facilitador_nome: string;
  facilitador_bio?: string;
  facilitador_avatar?: string;
  organizacao: string;
  emite_certificado?: boolean;
  imagem?: string;
}

export function useOficinas() {
  return useQuery({
    queryKey: ["oficinas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oficinas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching oficinas:", error);
        throw error;
      }

      return data as Oficina[];
    },
  });
}

export function useOficina(id: string) {
  return useQuery({
    queryKey: ["oficina", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oficinas")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching oficina:", error);
        throw error;
      }

      return data as Oficina | null;
    },
    enabled: !!id,
  });
}

export function useCreateOficina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOficinaData) => {
      const { data: result, error } = await supabase
        .from("oficinas")
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error("Error creating oficina:", error);
        throw error;
      }

      return result as Oficina;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oficinas"] });
      toast.success("Oficina criada com sucesso!");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Erro ao criar oficina. Tente novamente.");
    },
  });
}

export function useDeleteOficina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("oficinas")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting oficina:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oficinas"] });
      toast.success("Oficina excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Erro ao excluir oficina. Tente novamente.");
    },
  });
}
