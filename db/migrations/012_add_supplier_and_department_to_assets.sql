-- 012_add_supplier_and_department_to_assets.sql
-- Add supplier_id and department_id to assets table and create foreign key constraints.

ALTER TABLE public.assets
ADD COLUMN supplier_id BIGINT NULL;

ALTER TABLE public.assets
ADD CONSTRAINT fk_supplier
FOREIGN KEY (supplier_id)
REFERENCES public.suppliers(id)
ON DELETE SET NULL;

ALTER TABLE public.assets
ADD COLUMN department_id BIGINT NULL;

ALTER TABLE public.assets
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id)
REFERENCES public.departments(id)
ON DELETE SET NULL;

-- Create an index on supplier_id for faster lookups
CREATE INDEX idx_asset_supplier_id ON public.assets (supplier_id);

-- Create an index on department_id for faster lookups
CREATE INDEX idx_asset_department_id ON public.assets (department_id);