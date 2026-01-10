ALTER TABLE public.assets
ALTER COLUMN current_department_id DROP NOT NULL;

ALTER TABLE public.assets
DROP COLUMN IF EXISTS assigned_to_employee_id;
