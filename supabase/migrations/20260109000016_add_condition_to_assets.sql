-- 017_add_condition_to_assets.sql
-- Adds a condition column to the assets table.

ALTER TABLE public.assets
ADD COLUMN condition TEXT;
