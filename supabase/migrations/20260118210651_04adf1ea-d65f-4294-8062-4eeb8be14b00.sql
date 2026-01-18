-- Adicionar campos de marketplace/vitrine na tabela oportunidades
ALTER TABLE public.oportunidades
ADD COLUMN exibir_vitrine boolean DEFAULT false,
ADD COLUMN meta_captacao numeric DEFAULT NULL,
ADD COLUMN mostrar_progresso boolean DEFAULT true,
ADD COLUMN captacao_atual numeric DEFAULT 0;

-- Adicionar campos na tabela oficinas também
ALTER TABLE public.oficinas
ADD COLUMN exibir_vitrine boolean DEFAULT false,
ADD COLUMN meta_captacao numeric DEFAULT NULL,
ADD COLUMN mostrar_progresso boolean DEFAULT true,
ADD COLUMN captacao_atual numeric DEFAULT 0;

-- Criar enum para tipo de investimento/apoio
CREATE TYPE public.tipo_apoio AS ENUM ('financeiro', 'servico', 'patrocinio');

-- Criar enum para status da proposta
CREATE TYPE public.status_proposta AS ENUM ('pendente', 'aprovada', 'rejeitada', 'contraproposta', 'cancelada');

-- Tabela de propostas de investimento
CREATE TABLE public.propostas_investimento (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    oportunidade_id uuid REFERENCES public.oportunidades(id) ON DELETE CASCADE,
    oficina_id uuid REFERENCES public.oficinas(id) ON DELETE CASCADE,
    investidor_id uuid NOT NULL,
    criador_id uuid NOT NULL,
    tipo_apoio tipo_apoio NOT NULL,
    valor_financeiro numeric DEFAULT NULL,
    descricao_servico text DEFAULT NULL,
    contrapartidas_desejadas text[] DEFAULT NULL,
    mensagem text DEFAULT NULL,
    status status_proposta DEFAULT 'pendente',
    proposta_pai_id uuid REFERENCES public.propostas_investimento(id) ON DELETE SET NULL,
    motivo_rejeicao text DEFAULT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT check_oportunidade_ou_oficina CHECK (
        (oportunidade_id IS NOT NULL AND oficina_id IS NULL) OR 
        (oportunidade_id IS NULL AND oficina_id IS NOT NULL)
    )
);

-- Habilitar RLS
ALTER TABLE public.propostas_investimento ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para propostas_investimento

-- Investidores podem ver suas próprias propostas
CREATE POLICY "Investidores veem suas propostas"
ON public.propostas_investimento
FOR SELECT
USING (auth.uid() = investidor_id);

-- Criadores podem ver propostas dos seus projetos
CREATE POLICY "Criadores veem propostas dos seus projetos"
ON public.propostas_investimento
FOR SELECT
USING (auth.uid() = criador_id);

-- Investidores podem criar propostas
CREATE POLICY "Investidores podem criar propostas"
ON public.propostas_investimento
FOR INSERT
WITH CHECK (auth.uid() = investidor_id);

-- Criadores podem atualizar propostas (aprovar/rejeitar/contraproposta)
CREATE POLICY "Criadores podem atualizar propostas"
ON public.propostas_investimento
FOR UPDATE
USING (auth.uid() = criador_id);

-- Investidores podem cancelar suas próprias propostas
CREATE POLICY "Investidores podem cancelar propostas"
ON public.propostas_investimento
FOR UPDATE
USING (auth.uid() = investidor_id AND status = 'pendente');

-- Service role tem acesso total
CREATE POLICY "Service role acesso total propostas"
ON public.propostas_investimento
FOR ALL
USING (auth.role() = 'service_role');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_propostas_investimento_updated_at
BEFORE UPDATE ON public.propostas_investimento
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar view para oportunidades disponíveis no marketplace (vitrine)
CREATE OR REPLACE VIEW public.oportunidades_vitrine AS
SELECT 
    o.*,
    p.nome_completo as criador_nome_completo,
    p.nome_artistico as criador_nome_artistico,
    (SELECT COUNT(*) FROM public.propostas_investimento pi WHERE pi.oportunidade_id = o.id) as total_propostas,
    (SELECT COALESCE(SUM(pi.valor_financeiro), 0) FROM public.propostas_investimento pi WHERE pi.oportunidade_id = o.id AND pi.status = 'aprovada' AND pi.tipo_apoio = 'financeiro') as valor_captado
FROM public.oportunidades o
LEFT JOIN public.profiles p ON o.criador_id = p.user_id
WHERE o.exibir_vitrine = true AND o.status = 'ativa';

-- Criar view para oficinas disponíveis no marketplace (vitrine)
CREATE OR REPLACE VIEW public.oficinas_vitrine AS
SELECT 
    of.*,
    (SELECT COUNT(*) FROM public.propostas_investimento pi WHERE pi.oficina_id = of.id) as total_propostas,
    (SELECT COALESCE(SUM(pi.valor_financeiro), 0) FROM public.propostas_investimento pi WHERE pi.oficina_id = of.id AND pi.status = 'aprovada' AND pi.tipo_apoio = 'financeiro') as valor_captado
FROM public.oficinas of
WHERE of.exibir_vitrine = true AND of.status = 'inscricoes_abertas';