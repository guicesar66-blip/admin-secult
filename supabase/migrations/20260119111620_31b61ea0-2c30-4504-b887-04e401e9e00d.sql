-- ============================================================================
-- Migration: Corrigir políticas RLS de oficinas para restaurar acesso
-- Descrição: Restaura política original que permite qualquer autenticado ver oficinas
-- ============================================================================

-- Remover política restritiva atual de SELECT
DROP POLICY IF EXISTS "oficinas_select_own" ON public.oficinas;

-- Criar política original: qualquer autenticado pode ver todas as oficinas
CREATE POLICY "oficinas_select_policy"
ON public.oficinas FOR SELECT
TO authenticated
USING (true);

-- Manter as políticas de INSERT/UPDATE/DELETE baseadas no criador_id
-- (essas já existem e funcionam corretamente)

-- Garantir que os campos novos são opcionais (já são nullable, mas confirmando)
-- criador_id, exibir_vitrine, meta_captacao, mostrar_progresso, captacao_atual
-- Todos já são nullable, então não precisa alterar