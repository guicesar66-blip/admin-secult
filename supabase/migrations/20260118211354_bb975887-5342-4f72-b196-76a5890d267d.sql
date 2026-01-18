-- Deletar dados de todas as tabelas exceto profiles
-- Ordem respeitando foreign keys

-- Primeiro: tabelas que dependem de outras
DELETE FROM public.candidatura_historico;
DELETE FROM public.propostas_investimento;
DELETE FROM public.oficina_inscricoes;
DELETE FROM public.oportunidade_interessados;

-- Depois: tabelas principais
DELETE FROM public.oportunidades;
DELETE FROM public.oficinas;

-- Manter profiles e user_roles (necessários para autenticação)