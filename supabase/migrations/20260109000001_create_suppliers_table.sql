-- 009_create_suppliers_table.sql
-- Creates the suppliers table and its RLS policies.



-- Enable Row Level Security


-- Policies for suppliers table

-- Allow any authenticated user to view all suppliers
-- Suppliers are generally not considered sensitive information in this context


-- Allow admins and IT staff to manage suppliers (create, update, delete)

