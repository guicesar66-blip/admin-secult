-- Fix 1: Restrict profiles SELECT policies to 'authenticated' role only

-- Drop the existing public-role SELECT policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "criadores_veem_perfis_candidatos" ON public.profiles;

-- Recreate with 'authenticated' role restriction
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "criadores_veem_perfis_candidatos"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (EXISTS (
    SELECT 1
    FROM oportunidade_interessados oi
    JOIN oportunidades o ON o.id = oi.oportunidade_id
    WHERE oi.user_id = profiles.user_id AND o.criador_id = auth.uid()
  ))
  OR
  (EXISTS (
    SELECT 1
    FROM oficina_inscricoes ins
    JOIN oficinas of ON of.id = ins.oficina_id
    WHERE ins.user_id = profiles.user_id AND of.criador_id = auth.uid()
  ))
);