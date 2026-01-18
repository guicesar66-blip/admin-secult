-- Remover role admin do usuário guicesar1@hotmail.com para testar a separação
DELETE FROM public.user_roles 
WHERE user_id = 'd846577c-5c49-4b2d-b9dc-bba6fd6fdd21' AND role = 'admin';

-- Garantir que ele tenha apenas role 'app' (usuário normal)
INSERT INTO public.user_roles (user_id, role)
VALUES ('d846577c-5c49-4b2d-b9dc-bba6fd6fdd21', 'app')
ON CONFLICT (user_id, role) DO NOTHING;