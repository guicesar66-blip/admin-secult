-- 1) Garantir que o usuário de teste (guicesar1@hotmail.com) NÃO seja admin
DELETE FROM public.user_roles
WHERE user_id = 'd846577c-5c49-4b2d-b9dc-bba6fd6fdd21';

INSERT INTO public.user_roles (user_id, role)
VALUES ('d846577c-5c49-4b2d-b9dc-bba6fd6fdd21', 'app');

-- 2) Garantir que o segundo usuário (guicesar666@gmail.com) seja admin (único role)
DELETE FROM public.user_roles
WHERE user_id = 'c6a73495-2480-459b-bef0-d46d01d20109';

INSERT INTO public.user_roles (user_id, role)
VALUES ('c6a73495-2480-459b-bef0-d46d01d20109', 'admin');

-- 3) Remover FK indevida para auth.users (mantém a coluna, só remove o vínculo)
ALTER TABLE public.oficinas
  DROP CONSTRAINT IF EXISTS oficinas_criador_id_fkey;

-- 4) Garantir RLS habilitado
ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oficinas ENABLE ROW LEVEL SECURITY;

-- 5) Políticas: somente o criador pode ver/criar/atualizar/deletar
-- OPORTUNIDADES
DROP POLICY IF EXISTS "Usuários veem suas próprias oportunidades" ON public.oportunidades;
DROP POLICY IF EXISTS "Admins podem criar oportunidades" ON public.oportunidades;
DROP POLICY IF EXISTS "Admins podem atualizar oportunidades" ON public.oportunidades;
DROP POLICY IF EXISTS "Admins podem deletar oportunidades" ON public.oportunidades;

DROP POLICY IF EXISTS "oportunidades_select_own" ON public.oportunidades;
DROP POLICY IF EXISTS "oportunidades_insert_own" ON public.oportunidades;
DROP POLICY IF EXISTS "oportunidades_update_own" ON public.oportunidades;
DROP POLICY IF EXISTS "oportunidades_delete_own" ON public.oportunidades;

CREATE POLICY "oportunidades_select_own"
ON public.oportunidades
FOR SELECT
TO authenticated
USING (criador_id = auth.uid());

CREATE POLICY "oportunidades_insert_own"
ON public.oportunidades
FOR INSERT
TO authenticated
WITH CHECK (criador_id = auth.uid());

CREATE POLICY "oportunidades_update_own"
ON public.oportunidades
FOR UPDATE
TO authenticated
USING (criador_id = auth.uid())
WITH CHECK (criador_id = auth.uid());

CREATE POLICY "oportunidades_delete_own"
ON public.oportunidades
FOR DELETE
TO authenticated
USING (criador_id = auth.uid());

-- OFICINAS
DROP POLICY IF EXISTS "Usuários veem suas próprias oficinas" ON public.oficinas;
DROP POLICY IF EXISTS "Admins podem criar oficinas" ON public.oficinas;
DROP POLICY IF EXISTS "Admins podem atualizar oficinas" ON public.oficinas;
DROP POLICY IF EXISTS "Admins podem deletar oficinas" ON public.oficinas;

DROP POLICY IF EXISTS "oficinas_select_own" ON public.oficinas;
DROP POLICY IF EXISTS "oficinas_insert_own" ON public.oficinas;
DROP POLICY IF EXISTS "oficinas_update_own" ON public.oficinas;
DROP POLICY IF EXISTS "oficinas_delete_own" ON public.oficinas;

CREATE POLICY "oficinas_select_own"
ON public.oficinas
FOR SELECT
TO authenticated
USING (criador_id = auth.uid());

CREATE POLICY "oficinas_insert_own"
ON public.oficinas
FOR INSERT
TO authenticated
WITH CHECK (criador_id = auth.uid());

CREATE POLICY "oficinas_update_own"
ON public.oficinas
FOR UPDATE
TO authenticated
USING (criador_id = auth.uid())
WITH CHECK (criador_id = auth.uid());

CREATE POLICY "oficinas_delete_own"
ON public.oficinas
FOR DELETE
TO authenticated
USING (criador_id = auth.uid());

-- 6) Corrigir warnings do linter (search_path) em funções plpgsql (sem alterar lógica)
CREATE OR REPLACE FUNCTION public.update_oportunidades_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_oficinas_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_candidatura_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.registrar_historico_candidatura()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Só registra se o status mudou
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.candidatura_historico (candidatura_id, status, usuario_id)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.registrar_historico_candidatura_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.candidatura_historico (candidatura_id, status, usuario_id)
  VALUES (NEW.id, NEW.status, auth.uid());
  RETURN NEW;
END;
$$;

-- 7) Corrigir erros do linter (views) usando security_invoker
CREATE OR REPLACE VIEW public.candidaturas_com_oportunidade
WITH (security_invoker=on)
AS
SELECT c.id,
    c.user_id,
    c.oportunidade_id,
    c.mensagem,
    c.status,
    c.motivo_reprovacao,
    c.created_at,
    c.updated_at,
    o.titulo,
    o.descricao,
    o.tipo,
    o.area_cultural,
    o.municipio,
    o.local,
    o.data_evento,
    o.horario,
    o.duracao,
    o.remuneracao,
    o.cena_coins AS trocados,
    o.requisitos,
    o.vagas,
    o.imagem,
    o.criador_nome,
    o.criador_contato,
    o.prazo_inscricao
   FROM public.oportunidade_interessados c
     JOIN public.oportunidades o ON o.id = c.oportunidade_id;

CREATE OR REPLACE VIEW public.oficinas_com_vagas
WITH (security_invoker=on)
AS
SELECT o.id,
    o.titulo,
    o.descricao,
    o.imagem,
    o.area_artistica,
    o.categoria,
    o.nivel,
    o.modalidade,
    o.data_inicio,
    o.data_fim,
    o.inscricao_fim,
    o.vagas_total,
    o.dias_semana,
    o.horario,
    o.carga_horaria,
    o.num_encontros,
    o.local,
    o.publico_alvo,
    o.prerequisitos,
    o.facilitador_nome,
    o.facilitador_bio,
    o.facilitador_avatar,
    o.organizacao,
    o.emite_certificado,
    o.status,
    o.created_at,
    o.updated_at,
    o.vagas_total - COALESCE(( SELECT count(*) AS count
           FROM public.oficina_inscricoes i
          WHERE i.oficina_id = o.id AND (i.status = ANY (ARRAY['inscrito'::text, 'confirmado'::text]))), 0::bigint) AS vagas_disponiveis
   FROM public.oficinas o;

CREATE OR REPLACE VIEW public.oportunidades_com_interesse
WITH (security_invoker=on)
AS
SELECT o.id,
    o.titulo,
    o.descricao,
    o.imagem,
    o.tipo,
    o.local,
    o.municipio,
    o.data_evento,
    o.horario,
    o.duracao,
    o.remuneracao,
    o.cena_coins,
    o.requisitos,
    o.vagas,
    o.prazo_inscricao,
    o.criador_nome,
    o.criador_contato,
    o.criador_id,
    o.status,
    o.created_at,
    o.updated_at,
    o.area_cultural,
    COALESCE(( SELECT count(*) AS count
           FROM public.oportunidade_interessados oi
          WHERE oi.oportunidade_id = o.id), 0::bigint)::integer AS total_interessados,
    COALESCE(( SELECT count(*) AS count
           FROM public.oportunidade_interessados oi
          WHERE oi.oportunidade_id = o.id AND oi.status = 'aprovada'::text), 0::bigint)::integer AS total_aceitos
   FROM public.oportunidades o;