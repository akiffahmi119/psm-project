-- 021_add_loans_policies.sql
-- Adds RLS policies for the loans table

-- 1. Allow authenticated users to read loans
CREATE POLICY "Allow authenticated users to read loans"
ON public.loans
FOR SELECT
TO authenticated
USING (true);

-- 2. Allow IT staff and admins to create loans
CREATE POLICY "Allow IT staff to create loans"
ON public.loans
WITH CHECK (
  (get_my_claim('role'::text)) = '"it_staff"'::jsonb OR
  (get_my_claim('role'::text)) = '"system_admin"'::jsonb OR
  (get_my_claim('role'::text)) = '"admin"'::jsonb
);

-- 3. Allow IT staff and admins to update loans
CREATE POLICY "Allow IT staff to update loans"
ON public.loans
FOR UPDATE
TO authenticated
USING (
  (get_my_claim('role'::text)) = '"it_staff"'::jsonb OR
  (get_my_claim('role'::text)) = '"system_admin"'::jsonb
)
WITH CHECK (
  (get_my_claim('role'::text)) = '"it_staff"'::jsonb OR
  (get_my_claim('role'::text)) = '"system_admin"'::jsonb OR
  (get_my_claim('role'::text)) = '"admin"'::jsonb
);
