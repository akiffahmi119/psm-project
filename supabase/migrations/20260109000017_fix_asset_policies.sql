-- 018_fix_asset_policies.sql
-- This migration fixes the row-level security policy for the 'assets' table.
-- The previous policy was incorrect and prevented users from fetching asset data.

-- Drop the old, incorrect policy
DROP POLICY IF EXISTS "Allow Employee to read their department assets" ON public.assets;
DROP POLICY IF EXISTS "Allow authenticated user to read assets" ON public.assets;

-- Create a new policy that allows any authenticated user to read all assets.
-- This is a simpler policy to ensure the application works.
-- For more fine-grained access control, this policy can be updated later.
CREATE POLICY "Allow authenticated users to read assets"
  ON public.assets
  FOR SELECT
  TO authenticated
  USING (true);
