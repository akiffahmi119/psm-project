-- 20260109000004_add_department_id_to_loans.sql
-- Adds a department_id column to the public.loans table,
-- allowing assets to be loaned directly to departments.

ALTER TABLE public.loans
ADD COLUMN department_id BIGINT REFERENCES public.departments(id) ON DELETE SET NULL;

-- Add a check constraint to ensure either employee_id OR department_id is present, but not both.
-- Or, if both are allowed, then remove this constraint. For now, assuming either/or.
ALTER TABLE public.loans
ADD CONSTRAINT chk_employee_or_department
CHECK (
    (employee_id IS NOT NULL AND department_id IS NULL) OR
    (employee_id IS NULL AND department_id IS NOT NULL)
);

-- Update RLS policies to allow departments to also be associated with loans if needed.
-- For now, keep existing policies as they are mostly focused on employee/admin access.
-- Further refinement of RLS might be needed depending on how department-level access is designed.