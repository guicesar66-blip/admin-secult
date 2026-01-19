-- Tabela para lançamentos financeiros (receitas e despesas)
CREATE TABLE public.lancamentos_financeiros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oportunidade_id UUID REFERENCES public.oportunidades(id) ON DELETE CASCADE,
  oficina_id UUID REFERENCES public.oficinas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  data DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'previsto' CHECK (status IN ('previsto', 'confirmado', 'pago', 'cancelado')),
  categoria TEXT,
  criador_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT lancamento_projeto_check CHECK (
    (oportunidade_id IS NOT NULL AND oficina_id IS NULL) OR
    (oportunidade_id IS NULL AND oficina_id IS NOT NULL)
  )
);

-- Tabela para repasses aos colaboradores
CREATE TABLE public.repasses_colaboradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oportunidade_id UUID REFERENCES public.oportunidades(id) ON DELETE CASCADE,
  oficina_id UUID REFERENCES public.oficinas(id) ON DELETE CASCADE,
  colaborador_nome TEXT NOT NULL,
  colaborador_id UUID,
  valor NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  data_pagamento DATE,
  criador_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT repasse_projeto_check CHECK (
    (oportunidade_id IS NOT NULL AND oficina_id IS NULL) OR
    (oportunidade_id IS NULL AND oficina_id IS NOT NULL)
  )
);

-- Habilitar RLS
ALTER TABLE public.lancamentos_financeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repasses_colaboradores ENABLE ROW LEVEL SECURITY;

-- Políticas para lancamentos_financeiros
CREATE POLICY "Criadores veem lancamentos dos seus projetos"
  ON public.lancamentos_financeiros FOR SELECT
  USING (criador_id = auth.uid());

CREATE POLICY "Criadores podem criar lancamentos"
  ON public.lancamentos_financeiros FOR INSERT
  WITH CHECK (criador_id = auth.uid());

CREATE POLICY "Criadores podem atualizar lancamentos"
  ON public.lancamentos_financeiros FOR UPDATE
  USING (criador_id = auth.uid());

CREATE POLICY "Criadores podem deletar lancamentos"
  ON public.lancamentos_financeiros FOR DELETE
  USING (criador_id = auth.uid());

-- Políticas para repasses_colaboradores
CREATE POLICY "Criadores veem repasses dos seus projetos"
  ON public.repasses_colaboradores FOR SELECT
  USING (criador_id = auth.uid());

CREATE POLICY "Criadores podem criar repasses"
  ON public.repasses_colaboradores FOR INSERT
  WITH CHECK (criador_id = auth.uid());

CREATE POLICY "Criadores podem atualizar repasses"
  ON public.repasses_colaboradores FOR UPDATE
  USING (criador_id = auth.uid());

CREATE POLICY "Criadores podem deletar repasses"
  ON public.repasses_colaboradores FOR DELETE
  USING (criador_id = auth.uid());

-- Triggers para updated_at
CREATE TRIGGER update_lancamentos_financeiros_updated_at
  BEFORE UPDATE ON public.lancamentos_financeiros
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_repasses_colaboradores_updated_at
  BEFORE UPDATE ON public.repasses_colaboradores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();