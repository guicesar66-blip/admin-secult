import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UpdateOportunidadeData {
  titulo?: string;
  descricao?: string;
  tipo?: string;
  local?: string;
  municipio?: string;
  data_evento?: string;
  horario?: string;
  duracao?: string;
  remuneracao?: number;
  cena_coins?: number;
  requisitos?: string;
  vagas?: number;
  prazo_inscricao?: string;
  criador_nome?: string;
  criador_contato?: string;
  area_cultural?: string;
  imagem?: string;
  status?: string;
}

export function useUpdateOportunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOportunidadeData }) => {
      const { error } = await supabase
        .from("oportunidades")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oportunidades"] });
      queryClient.invalidateQueries({ queryKey: ["oportunidade"] });
      toast.success("Projeto atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar projeto.");
    },
  });
}

export function useUpdateOficina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const { error } = await supabase
        .from("oficinas")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oficinas"] });
      queryClient.invalidateQueries({ queryKey: ["oficina"] });
      toast.success("Oficina atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar oficina.");
    },
  });
}
