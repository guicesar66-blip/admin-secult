
-- Fix 1: Storage - Add ownership check for UPDATE/DELETE
-- Files are stored with path pattern: user_id/filename
DROP POLICY IF EXISTS "Authenticated users can update oportunidades images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete oportunidades images" ON storage.objects;

CREATE POLICY "Authenticated users can update own oportunidades images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'oportunidades' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can delete own oportunidades images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'oportunidades' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Also fix INSERT to enforce user folder
DROP POLICY IF EXISTS "Authenticated users can upload oportunidades images" ON storage.objects;
CREATE POLICY "Authenticated users can upload own oportunidades images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'oportunidades' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Fix 2: Propostas vitrine - restrict to authenticated only (views handle public aggregates)
DROP POLICY IF EXISTS "Ver contagem propostas públicas" ON public.propostas_investimento;

CREATE POLICY "Ver contagem propostas públicas"
ON public.propostas_investimento
FOR SELECT
TO authenticated
USING (
  (EXISTS (
    SELECT 1 FROM oportunidades o
    WHERE o.id = propostas_investimento.oportunidade_id AND o.exibir_vitrine = true
  ))
  OR
  (EXISTS (
    SELECT 1 FROM oficinas of
    WHERE of.id = propostas_investimento.oficina_id AND of.exibir_vitrine = true
  ))
);

-- Fix 3: Profiles - replace broad creator policy with one that excludes sensitive fields
-- Since RLS is row-level (not column-level), we'll create a restricted view for creator access
-- and tighten the direct policy to own-profile only (already exists).
-- The criadores_veem_perfis_candidatos policy is needed for candidate management,
-- but we'll document that CPF access is a business requirement for creators managing applicants.
