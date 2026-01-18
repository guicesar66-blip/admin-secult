-- Adicionar coluna criador_id à tabela oficinas
ALTER TABLE public.oficinas ADD COLUMN IF NOT EXISTS criador_id UUID REFERENCES auth.users(id);

-- Atualizar política de oportunidades para mostrar apenas do criador
DROP POLICY IF EXISTS "Oportunidades ativas são públicas" ON public.oportunidades;

CREATE POLICY "Usuários veem suas próprias oportunidades"
ON public.oportunidades
FOR SELECT
USING (criador_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Atualizar política de oficinas para mostrar apenas do criador
DROP POLICY IF EXISTS "oficinas_select_policy" ON public.oficinas;

CREATE POLICY "Usuários veem suas próprias oficinas"
ON public.oficinas
FOR SELECT
USING (criador_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Promover segundo usuário para admin (guicesar666@gmail.com)
INSERT INTO public.user_roles (user_id, role)
VALUES ('c6a73495-2480-459b-bef0-d46d01d20109', 'admin')
ON CONFLICT (user_id, role) DO UPDATE SET role = 'admin';

-- Atribuir metade das oportunidades ao primeiro admin (guicesar1@hotmail.com)
UPDATE public.oportunidades 
SET criador_id = 'd846577c-5c49-4b2d-b9dc-bba6fd6fdd21'
WHERE id IN (
  SELECT id FROM public.oportunidades 
  ORDER BY created_at 
  LIMIT 5
);

-- Atribuir outra metade ao segundo admin (guicesar666@gmail.com)
UPDATE public.oportunidades 
SET criador_id = 'c6a73495-2480-459b-bef0-d46d01d20109'
WHERE criador_id IS NULL;

-- Atribuir metade das oficinas ao primeiro admin
UPDATE public.oficinas 
SET criador_id = 'd846577c-5c49-4b2d-b9dc-bba6fd6fdd21'
WHERE id IN (
  SELECT id FROM public.oficinas 
  ORDER BY created_at 
  LIMIT 5
);

-- Atribuir outra metade ao segundo admin
UPDATE public.oficinas 
SET criador_id = 'c6a73495-2480-459b-bef0-d46d01d20109'
WHERE criador_id IS NULL;