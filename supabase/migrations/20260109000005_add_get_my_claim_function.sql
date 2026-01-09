-- 023_add_get_my_claim_function.sql
-- Defines the get_my_claim function used in RLS policies.

CREATE OR REPLACE FUNCTION public.get_my_claim(c text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT auth.jwt() -> 'app_metadata' -> c
  );
END;
$$;
