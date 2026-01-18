-- Adicionar políticas para admins criarem oportunidades
CREATE POLICY "Admins podem criar oportunidades"
ON public.oportunidades
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar oportunidades"
ON public.oportunidades
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar oportunidades"
ON public.oportunidades
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Adicionar políticas para admins criarem oficinas
CREATE POLICY "Admins podem criar oficinas"
ON public.oficinas
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar oficinas"
ON public.oficinas
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar oficinas"
ON public.oficinas
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));