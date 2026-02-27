-- Stats function for admin dashboard
CREATE OR REPLACE FUNCTION public.admin_get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM profiles),
    'verified_users', (SELECT count(*) FROM profiles WHERE is_verified = true),
    'onboarded_users', (SELECT count(*) FROM profiles WHERE onboarding_completed = true),
    'users_today', (SELECT count(*) FROM profiles WHERE created_at >= CURRENT_DATE),
    'users_this_week', (SELECT count(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    'users_this_month', (SELECT count(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'),
    'gender_stats', (SELECT json_object_agg(COALESCE(gender, 'unspecified'), cnt) FROM (SELECT gender, count(*) as cnt FROM profiles GROUP BY gender) g),
    'country_stats', (SELECT json_object_agg(COALESCE(country, 'unspecified'), cnt) FROM (SELECT country, count(*) as cnt FROM profiles WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY cnt DESC LIMIT 10) c),
    'religion_stats', (SELECT json_object_agg(COALESCE(religion, 'unspecified'), cnt) FROM (SELECT religion, count(*) as cnt FROM profiles WHERE religion IS NOT NULL AND religion != '' GROUP BY religion ORDER BY cnt DESC LIMIT 10) r),
    'signups_by_day', (SELECT json_agg(row_to_json(d)) FROM (SELECT created_at::date as date, count(*) as count FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' GROUP BY created_at::date ORDER BY date) d)
  ) INTO result;
  RETURN result;
END;
$$;

-- Function to list profiles for admin (paginated)
CREATE OR REPLACE FUNCTION public.admin_list_profiles(
  p_search text DEFAULT '',
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_gender text DEFAULT NULL,
  p_verified boolean DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total', (
      SELECT count(*) FROM profiles
      WHERE (p_search = '' OR first_name ILIKE '%' || p_search || '%' OR last_name ILIKE '%' || p_search || '%' OR city ILIKE '%' || p_search || '%')
        AND (p_gender IS NULL OR gender = p_gender)
        AND (p_verified IS NULL OR is_verified = p_verified)
    ),
    'profiles', (
      SELECT COALESCE(json_agg(row_to_json(p)), '[]'::json)
      FROM (
        SELECT id, user_id, first_name, last_name, gender, city, country, religion, 
               profession, is_verified, onboarding_completed, photos, date_of_birth, created_at
        FROM profiles
        WHERE (p_search = '' OR first_name ILIKE '%' || p_search || '%' OR last_name ILIKE '%' || p_search || '%' OR city ILIKE '%' || p_search || '%')
          AND (p_gender IS NULL OR gender = p_gender)
          AND (p_verified IS NULL OR is_verified = p_verified)
        ORDER BY created_at DESC
        LIMIT p_limit OFFSET p_offset
      ) p
    )
  ) INTO result;
  RETURN result;
END;
$$;

-- Toggle verification
CREATE OR REPLACE FUNCTION public.admin_toggle_verify(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_status boolean;
BEGIN
  UPDATE profiles SET is_verified = NOT is_verified WHERE user_id = p_user_id RETURNING is_verified INTO new_status;
  RETURN new_status;
END;
$$;