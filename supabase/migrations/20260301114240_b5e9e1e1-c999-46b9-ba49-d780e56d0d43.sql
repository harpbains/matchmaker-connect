INSERT INTO public.admin_users (email, password_hash, display_name, role)
VALUES (
  'admin@desiconnect.com',
  extensions.crypt('Admin2026!', extensions.gen_salt('bf')),
  'Admin',
  'super_admin'
)