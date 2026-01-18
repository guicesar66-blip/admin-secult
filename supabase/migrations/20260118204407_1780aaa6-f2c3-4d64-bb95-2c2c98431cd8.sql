-- Remover constraint antiga de tipo
ALTER TABLE public.oportunidades DROP CONSTRAINT IF EXISTS oportunidades_tipo_check;

-- Padronizar os dados existentes PRIMEIRO
UPDATE public.oportunidades SET tipo = 'evento' WHERE tipo IN ('show', 'encontro');
UPDATE public.oportunidades SET tipo = 'vaga' WHERE tipo IN ('colaboracao', 'projeto');

-- Criar nova constraint com os tipos padronizados
ALTER TABLE public.oportunidades ADD CONSTRAINT oportunidades_tipo_check 
CHECK (tipo = ANY (ARRAY['evento'::text, 'vaga'::text, 'projeto_bairro'::text]));