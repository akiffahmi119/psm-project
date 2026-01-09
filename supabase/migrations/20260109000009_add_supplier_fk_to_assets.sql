-- 022_add_supplier_fk_to_assets.sql
-- Adds a foreign key constraint to the supplier_id column in the assets table.

ALTER TABLE public.assets
ADD CONSTRAINT assets_supplier_id_fkey
FOREIGN KEY (supplier_id)
REFERENCES public.suppliers(id)
ON DELETE SET NULL;
