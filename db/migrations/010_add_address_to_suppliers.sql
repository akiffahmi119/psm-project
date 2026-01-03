-- 010_add_address_to_suppliers.sql
-- Adds the missing 'address' column to the public.suppliers table.

ALTER TABLE public.suppliers
ADD COLUMN address TEXT;
