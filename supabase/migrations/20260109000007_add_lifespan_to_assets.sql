-- 020_add_lifespan_to_assets.sql
-- Adds a lifespan_years column to the assets table to track the expected lifespan of an asset.

ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS lifespan_years INTEGER NOT NULL DEFAULT 3;
