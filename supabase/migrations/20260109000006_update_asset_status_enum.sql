-- 019_update_asset_status_enum.sql
-- Updates the status enum for assets to consolidate 'available' and 'in_storage'
-- and to add 'broken'.

-- First, remove the existing check constraint
ALTER TABLE public.assets
DROP CONSTRAINT IF EXISTS assets_status_check;

-- Update existing 'available' values to 'in_storage'
UPDATE public.assets
SET status = 'in_storage'
WHERE status = 'available';

-- Add the new check constraint with the updated values
ALTER TABLE public.assets
ADD CONSTRAINT assets_status_check CHECK (status IN ('in_storage', 'checked_out', 'in_repair', 'retired', 'broken'));

-- Alter the default value of the column
ALTER TABLE public.assets
ALTER COLUMN status SET DEFAULT 'in_storage';
