-- Corrigir as views para usar SECURITY INVOKER (padrão seguro)
-- Isso garante que as views respeitem as políticas RLS do usuário que consulta

-- Recriar a view oportunidades_vitrine com security_invoker
DROP VIEW IF EXISTS public.oportunidades_vitrine;
CREATE VIEW public.oportunidades_vitrine
WITH (security_invoker = true)
AS
SELECT 
    o.*,
    p.nome_completo as criador_nome_completo,
    p.nome_artistico as criador_nome_artistico,
    (SELECT COUNT(*) FROM public.propostas_investimento pi WHERE pi.oportunidade_id = o.id) as total_propostas,
    (SELECT COALESCE(SUM(pi.valor_financeiro), 0) FROM public.propostas_investimento pi WHERE pi.oportunidade_id = o.id AND pi.status = 'aprovada' AND pi.tipo_apoio = 'financeiro') as valor_captado
FROM public.oportunidades o
LEFT JOIN public.profiles p ON o.criador_id = p.user_id
WHERE o.exibir_vitrine = true AND o.status = 'ativa';

-- Recriar a view oficinas_vitrine com security_invoker
DROP VIEW IF EXISTS public.oficinas_vitrine;
CREATE VIEW public.oficinas_vitrine
WITH (security_invoker = true)
AS
SELECT 
    of.*,
    (SELECT COUNT(*) FROM public.propostas_investimento pi WHERE pi.oficina_id = of.id) as total_propostas,
    (SELECT COALESCE(SUM(pi.valor_financeiro), 0) FROM public.propostas_investimento pi WHERE pi.oficina_id = of.id AND pi.status = 'aprovada' AND pi.tipo_apoio = 'financeiro') as valor_captado
FROM public.oficinas of
WHERE of.exibir_vitrine = true AND of.status = 'inscricoes_abertas';

-- Adicionar política SELECT pública para oportunidades em vitrine
CREATE POLICY "Qualquer pessoa pode ver oportunidades na vitrine"
ON public.oportunidades
FOR SELECT
USING (exibir_vitrine = true AND status = 'ativa');

-- Adicionar política SELECT pública para oficinas em vitrine
CREATE POLICY "Qualquer pessoa pode ver oficinas na vitrine"
ON public.oficinas
FOR SELECT
USING (exibir_vitrine = true AND status = 'inscricoes_abertas');

-- Permitir que qualquer pessoa autenticada veja propostas para mostrar contagem
CREATE POLICY "Ver contagem propostas públicas"
ON public.propostas_investimento
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.oportunidades o 
        WHERE o.id = oportunidade_id 
        AND o.exibir_vitrine = true
    ) OR EXISTS (
        SELECT 1 FROM public.oficinas of 
        WHERE of.id = oficina_id 
        AND of.exibir_vitrine = true
    )
);