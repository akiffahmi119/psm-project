-- 011_remove_category_from_suppliers.sql
-- Removes the 'category' column from the public.suppliers table.

ALTER TABLE public.suppliers
DROP COLUMN IF EXISTS category;
