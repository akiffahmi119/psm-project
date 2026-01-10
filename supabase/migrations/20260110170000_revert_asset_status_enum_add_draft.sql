-- First, drop the existing check constraint
ALTER TABLE public.assets
DROP CONSTRAINT IF EXISTS assets_status_check;

-- Add the new check constraint with the updated values
ALTER TABLE public.assets
ADD CONSTRAINT assets_status_check CHECK (status IN ('in_storage', 'checked_out', 'in_repair', 'retired', 'broken'));
