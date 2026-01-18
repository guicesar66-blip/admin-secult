-- Criar role admin para o usuário guicesar1@hotmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('d846577c-5c49-4b2d-b9dc-bba6fd6fdd21', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Criar roles 'app' para os outros usuários que não têm role ainda
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('c6a73495-2480-459b-bef0-d46d01d20109', 'app'),
  ('86631440-1c1d-4dac-8117-dcd66ef15ff6', 'app')
ON CONFLICT (user_id, role) DO NOTHING;