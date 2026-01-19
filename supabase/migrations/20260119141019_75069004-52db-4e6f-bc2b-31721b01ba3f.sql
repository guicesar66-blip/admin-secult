-- Política para criadores de oportunidades verem perfis de candidatos
CREATE POLICY "criadores_veem_perfis_candidatos" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.oportunidade_interessados oi
    JOIN public.oportunidades o ON o.id = oi.oportunidade_id
    WHERE oi.user_id = profiles.user_id 
    AND o.criador_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.oficina_inscricoes ins
    JOIN public.oficinas of ON of.id = ins.oficina_id
    WHERE ins.user_id = profiles.user_id 
    AND of.criador_id = auth.uid()
  )
);