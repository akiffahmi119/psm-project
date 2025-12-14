-- 001_assets_select_policies.sql
-- Enables RLS (Row Level Security) on public.assets and creates SELECT policies

-- NOTE: Before applying, verify that `assets` has a department column with a matching value
-- for the user's `department` in their `user_metadata`. If the column is named differently
-- (e.g., `department_id`), adjust the USING expression accordingly.

-- Enable row level security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Remove any previous policy with the same name to avoid duplication
DROP POLICY IF EXISTS "Allow Admin/IT Staff to read all assets" ON public.assets;
DROP POLICY IF EXISTS "Allow Department PIC to read department assets" ON public.assets;

-- Policy: Allow Admin/IT Staff to read all assets
CREATE POLICY "Allow Admin/IT Staff to read all assets"
  ON public.assets
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'it_staff')
  );

-- Policy: Allow Department PIC to read assets for their own department
CREATE POLICY "Allow Department PIC to read department assets"
  ON public.assets
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'department_pic' AND
    (auth.jwt() -> 'user_metadata' ->> 'department') = assets.department
  );

-- Optional: If you need department PICs to also be able to view assets assigned directly to them
-- (i.e., a column `assigned_to` stores the user's id), you can expand the expression like the following:
-- OR assets.assigned_to = auth.uid()
