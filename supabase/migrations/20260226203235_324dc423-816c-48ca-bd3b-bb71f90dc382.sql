CREATE OR REPLACE FUNCTION public.create_admin_user(p_email text, p_password text, p_display_name text, p_role text DEFAULT 'admin'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.admin_users (email, password_hash, display_name, role)
    VALUES (lower(trim(p_email)), extensions.crypt(p_password, extensions.gen_salt('bf')), trim(p_display_name), p_role)
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_admin_login(p_email text, p_password text)
 RETURNS TABLE(admin_id uuid, admin_email text, admin_display_name text, admin_role text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.email,
        a.display_name,
        a.role
    FROM public.admin_users a
    WHERE a.email = lower(trim(p_email))
      AND a.password_hash = extensions.crypt(p_password, a.password_hash)
      AND a.is_active = true;

    UPDATE public.admin_users
    SET last_login_at = now()
    WHERE email = lower(trim(p_email))
      AND password_hash = extensions.crypt(p_password, password_hash)
      AND is_active = true;
END;
$function$;