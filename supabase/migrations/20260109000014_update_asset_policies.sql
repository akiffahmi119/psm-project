-- 007_update_asset_policies.sql
-- Adds a SELECT policy for the 'employee' role on the public.assets table

-- NOTE: This policy assumes that when a user is created, their department's name
-- is stored in their user_metadata as 'department_name'. It also assumes the
-- `assets` table has a column named `department` containing the department's name.

-- Remove previous policy if it exists to avoid duplication
DROP POLICY IF EXISTS "Allow Employee to read their department assets" ON public.assets;

-- Policy: Allow Employee to read assets for their own department
CREATE POLICY "Allow Employee to read their department assets"
  ON public.assets
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'employee' AND
    assets.current_department_id = (
      SELECT id FROM public.departments
      WHERE name = (auth.jwt() -> 'user_metadata' ->> 'department_name')
    )
  );
