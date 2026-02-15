-- Migration: Auto-create profile and user role on auth user creation
-- Description: Database function to be called via Supabase Auth Hooks
-- Date: 2026-02-15
--
-- SETUP INSTRUCTIONS:
-- 1. Run this SQL in Supabase Dashboard SQL Editor
-- 2. Go to Authentication > Hooks in Supabase Dashboard
-- 3. Enable "Send user data after sign up" hook
-- 4. Set HTTP endpoint to: https://YOUR_PROJECT_REF.supabase.co/functions/v1/handle-new-user
--
-- OR use Database Webhooks:
-- 1. Go to Database > Webhooks
-- 2. Create new webhook on table: auth.users
-- 3. Events: INSERT
-- 4. Type: HTTP Request
-- 5. URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/handle-new-user

-- ============================================================================
-- Function: Create profile and role from auth user data
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_profile_for_user(
  user_id uuid,
  user_email text,
  metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile from metadata
  INSERT INTO public.profiles (
    user_id,
    first_name,
    last_name,
    display_name,
    email,
    country,
    date_of_birth,
    timezone,
    is_guest,
    guest_created_at
  )
  VALUES (
    user_id,
    metadata->>'first_name',
    metadata->>'last_name',
    COALESCE(
      metadata->>'display_name',
      NULLIF(TRIM(CONCAT(
        COALESCE(metadata->>'first_name', ''),
        ' ',
        COALESCE(metadata->>'last_name', '')
      )), ''),
      user_email
    ),
    user_email,
    metadata->>'country',
    (metadata->>'date_of_birth')::date,
    COALESCE(metadata->>'timezone', 'UTC'),
    COALESCE((metadata->>'is_guest')::boolean, false),
    CASE
      WHEN COALESCE((metadata->>'is_guest')::boolean, false) = true THEN NOW()
      ELSE NULL
    END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    country = COALESCE(EXCLUDED.country, profiles.country),
    date_of_birth = COALESCE(EXCLUDED.date_of_birth, profiles.date_of_birth),
    timezone = COALESCE(EXCLUDED.timezone, profiles.timezone);

  -- Insert default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

-- EXCEPTION
--   WHEN OTHERS THEN
--     RAISE LOG 'Error creating profile for user %: %', user_id, SQLERRM;
--     -- Don't fail the transaction, just log the error
END;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION public.create_profile_for_user(uuid, text, jsonb) IS
'Creates profile and user_role for a new auth user. Call this from Auth Hooks or Database Webhooks.';
