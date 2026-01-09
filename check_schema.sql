SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'assets'
  AND column_name = 'supplier_id';

SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'public.assets'::regclass
  AND conname = 'fk_supplier';