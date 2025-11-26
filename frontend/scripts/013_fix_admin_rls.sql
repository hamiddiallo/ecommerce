-- Fix admin_users RLS policy
-- The current policy blocks non-admins from checking if they're admin (circular dependency)
-- Solution: Disable RLS for admin_users OR allow public read access

-- Option 1: Disable RLS (simplest for admin check)
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS, allow everyone to read (but not modify)
-- DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
-- CREATE POLICY "Anyone can view admin users"
--   ON public.admin_users FOR SELECT
--   USING (true);
