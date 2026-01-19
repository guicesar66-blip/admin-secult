-- Adiciona política para permitir que o criador da oficina veja as inscrições
CREATE POLICY "criador_pode_ver_inscricoes" 
ON public.oficina_inscricoes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.oficinas 
    WHERE oficinas.id = oficina_inscricoes.oficina_id 
    AND oficinas.criador_id = auth.uid()
  )
);

-- Adiciona política para permitir que o criador da oficina atualize status das inscrições
CREATE POLICY "criador_pode_atualizar_inscricoes" 
ON public.oficina_inscricoes 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.oficinas 
    WHERE oficinas.id = oficina_inscricoes.oficina_id 
    AND oficinas.criador_id = auth.uid()
  )
);